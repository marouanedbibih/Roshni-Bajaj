<?php

namespace App\Http\Controllers\Api;

use App\Exports\CustomerExport;
use App\Http\Controllers\Contact\EmailController;
use App\Http\Requests\Phone\UpdatePhoneRequest;
use App\Http\Resources\CustomerResourceMenu;
use Illuminate\Support\Facades\DB;


use App\Http\Controllers\Controller;
use App\Http\Controllers\Tools\ImageController;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Http\Requests\Email\UpdateEmailRequest; // Import the UpdateEmailRequest
use App\Http\Resources\CustomerResource;
use App\Models\Adresse;
use App\Models\Customer;
use App\Models\Email;
use App\Models\Phone;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Maatwebsite\Excel\Facades\Excel;

class CustomerController extends Controller
{
    protected $imageController;
    public function __construct(ImageController $imageController)
    {
        $this->imageController = $imageController;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = Customer::select(
        'id',
        'name',
        'birth_day',
        'birth_place',
        'country',
        'state',
        'city',
        'code_postal',
        'company',
        'job',
        'image',
        'created_at'
        )->get();
        $customers = CustomerResource::collection($data);

        return response(['Customers'=> $customers],200);
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCustomerRequest $request)
    {
        $data = $request->validated();
        $infosData = $data['infos'];
        $emailsData = $data['emails'];
        $phonesData = $data['phones'];
        $adressesData = $data['adresses'];
    
        // Check if image was given and save it
        if (isset($infosData['image'])) {
            $relativePath = $this->imageController->uploadImage($infosData['image'], 'images/customers/', '-customer');
            $infosData['image'] = $relativePath;
        } else {
            $infosData['image'] = "images/customers/default-profile.png";
        }
    
        // Create the customer
        $customer = Customer::create($infosData);
    
        // Store emails, phones, and addresses
        foreach ($emailsData as $emailData) {
            $customer->emails()->create($emailData);
        }
    
        foreach ($phonesData as $phoneData) {
            $customer->phones()->create($phoneData);
        }
    
        foreach ($adressesData as $addressData) {
            $customer->addresses()->create($addressData);
        }
    
        return response(['customer' => $customer], 201); // Return the created customer with a 201 status code
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Customer $customer)
    {
        $infos = new CustomerResource($customer);
        $emails = $customer->emails()->get(['id','key','value']);
        $phones = $customer->phones()->get(['id','key','value']);
        $adresses = $customer->addresses()->get(['id','key','value']);

        return response([
            'infos' => $infos,
            'emails' => $emails,
            'phones' => $phones,
            'adresses' => $adresses
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $data = $request->validated();
        $infosData = $data['infos'];
        $emailsData = $data['emails'];
        $phonesData = $data['phones'];
        $adressesData = $data['adresses'];
    
        // Check if a new image is provided and update/remove the old one
        if (isset($infosData['image'])) {
            $this->imageController->removeImage($customer->image);
            $relativePath = $this->imageController->uploadImage($infosData['image'], 'images/customers/', '-customer');
            $infosData['image'] = $relativePath;
        }
    
        // Update customer's information
        $customer->update($infosData);
    
        // Update or create emails
        $updatedEmails = [];
        foreach ($emailsData as $emailData) {
            if (isset($emailData['id'])) {
                $email = $customer->emails()->find($emailData['id']);
                if ($email) {
                    $email->update($emailData);
                    $updatedEmails[] = $email;
                }
            }
            else{
                $email = $customer->emails()->create($emailData);
                $updatedEmails[] = $email;
            }
        }
    
        // Update or create phones
        $updatedPhones = [];
        foreach ($phonesData as $phoneData) {
            if (isset($phoneData['id'])) {
                $phone = $customer->phones()->find($phoneData['id']);
                if ($phone) {
                    $phone->update($phoneData);
                    $updatedPhones[] = $phone;
                }
            }
            else{
                $phone = $customer->phones()->create($phoneData);
                $updatedPhones[] = $phone;
            }
        }
    
        // Update or create addresses
        $updatedAdresses = [];
        foreach ($adressesData as $adresseData) {
            if (isset($adresseData['id'])) {
                $adress = $customer->addresses()->find($adresseData['id']);
                if ($adress) {
                    $adress->update($adresseData);
                    $updatedAddresses[] = $adress;
                }
                else{
                    $adresse = $customer->addresses()->create($adresseData);
                    $updatedAdresses[] = $adress;
                }
            }
        }
    
        // Return the updated customer data
        $response = [
            'customer' => $customer->fresh(), // Refresh the customer model to get the updated data
            'updatedEmails' => $updatedEmails,
            'updatedPhones' => $updatedPhones,
            'updatedAddresses' => $updatedAddresses,
        ];
    
        return response($response);
    }
    


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Customer $customer)
    {
        $customer->delete();
        return response(['message' => 'You are delete customer succufuly'],200);
    }

    public function getCustomerForMenu()
    {
        $customers = DB::table('customers')
            ->leftJoin('emails', function ($join) {
                $join->on('customers.id', '=', 'emails.customer_id');
            })
            ->leftJoin('phones', function ($join) {
                $join->on('customers.id', '=', 'phones.customer_id');
            })
            ->select(
                'customers.id',
                'customers.image',
                'customers.name',
                'customers.created_at',
                'customers.country',
                'customers.birth_day',
                'customers.birth_place',
                DB::raw('MIN(emails.value) as email'), // Get the first email
                DB::raw('MIN(phones.value) as phone')  // Get the first phone number
            )
            ->groupBy('customers.id', 'customers.image', 'customers.name', 'customers.created_at', 'customers.country', 'customers.birth_day', 'customers.birth_place')
            ->orderBy('customers.id', 'desc') // Corrected order column
            ->paginate(7);
    
        return CustomerResourceMenu::collection($customers);
    }
    
    
    public function deleteCustomerSelected(Request $request)
{
    $selectedCustomerIds = $request->input('selectedCustomerIds');

    // Perform validation and authorization checks here

    // Delete the selected customers
    Customer::whereIn('id', $selectedCustomerIds)->delete();

    return response()->json(['message' => 'Selected customers were successfully deleted']);
}

public function searchCustomers(Request $request)
{
    $searchTerm = $request->input('searchTerm');

    
    $customers = DB::table('customers')
        ->leftJoin('emails', 'customers.id', '=', 'emails.customer_id')
        ->leftJoin('phones', 'customers.id', '=', 'phones.customer_id')
        ->leftJoin('adresses', 'customers.id', '=', 'adresses.customer_id')
        ->select(
            'customers.id',
            'customers.image',
            'customers.name',
            'customers.created_at',
            'customers.country',
            'customers.birth_day',
            'customers.birth_place',
            DB::raw('MIN(emails.value) as email'),
            DB::raw('MIN(phones.value) as phone')
        )
        ->where(function ($query) use ($searchTerm) {
            $query->where('customers.name', 'like', "%$searchTerm%")
                ->orWhere('customers.birth_place', 'like', "%$searchTerm%")
                ->orWhere('customers.country', 'like', "%$searchTerm%")
                ->orWhere('customers.state', 'like', "%$searchTerm%")
                ->orWhere('customers.city', 'like', "%$searchTerm%")
                ->orWhere('customers.code_postal', 'like', "%$searchTerm%")
                ->orWhere('customers.company', 'like', "%$searchTerm%")
                ->orWhere('customers.job', 'like', "%$searchTerm%")
                ->orWhere('emails.value', 'like', "%$searchTerm%")
                ->orWhere('emails.key', 'like', "%$searchTerm%")
                ->orWhere('phones.value', 'like', "%$searchTerm%")
                ->orWhere('phones.key', 'like', "%$searchTerm%")
                ->orWhere('adresses.value', 'like', "%$searchTerm%")
                ->orWhere('adresses.key', 'like', "%$searchTerm%");
        })
        ->groupBy('customers.id', 'customers.image', 'customers.name', 'customers.created_at', 'customers.country', 'customers.birth_day', 'customers.birth_place')
        ->orderBy('customers.id', 'desc')
        ->paginate(7);

    return CustomerResourceMenu::collection($customers);
}


    public function exportCustomer(Request $request){
        $customerIds = $request->input('selectedCustomerIds');

        $fileName = 'customers-'.time() . '.xlsx';
    
        return Excel::download(new CustomerExport($customerIds), $fileName,\Maatwebsite\Excel\Excel::XLSX);
    }

    public function downloadOneCustomer(){

    }

    public function downloadCustomers(){

    }
}
