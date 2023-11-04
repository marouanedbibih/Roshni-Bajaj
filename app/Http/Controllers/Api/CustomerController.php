<?php

namespace App\Http\Controllers\Api;

use App\Exports\CustomerExport;
use App\Http\Resources\CustomerResourceMenu;
use Illuminate\Support\Facades\DB;


use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCustomerRequest;
use App\Http\Requests\Customer\UpdateCustomerRequest;
use App\Http\Resources\CustomerResource;
use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Maatwebsite\Excel\Facades\Excel;

class CustomerController extends Controller
{
    public function getIds() {
        $perPage = 7;
        $customerIds = Customer::select('id')->orderBy('id', 'desc')->get();
    
        $totalIds = count($customerIds);
        $paginationObject = [];
    
        for ($page = 1; $page <= ceil($totalIds / $perPage); $page++) {
            $offset = ($page - 1) * $perPage;
            $pageIds = array_slice($customerIds->pluck('id')->toArray(), $offset, $perPage);
            $paginationObject[$page] = $pageIds;
        }
    
        return response(['customerIds' => $paginationObject], 200);
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
        'job',
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
        $descriptionsData = $data['descriptions'];

        $customer = Customer::create($infosData);
    
        foreach ($emailsData as $emailData) {
            $customer->emails()->create($emailData);
        }
    
        foreach ($phonesData as $phoneData) {
            $customer->phones()->create($phoneData);
        }
    
        foreach ($descriptionsData as $descriptionData) {
            $customer->descriptions()->create($descriptionData);
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
        $descriptions = $customer->descriptions()->get(['id','key','value']);

        return response([
            'infos' => $infos,
            'emails' => $emails,
            'phones' => $phones,
            'descriptions' => $descriptions
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
        $descriptionsData = $data['descriptions'];

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
        $updatedDescriptions = [];
        foreach ($descriptionsData as $descriptionData) {
            if (isset($descriptionData['id'])) {
                $description = $customer->descriptions()->find($descriptionData['id']);
                if ($description) {
                    $description->update($descriptionData);
                    $updatedDescriptions[] = $description;
                }
            } else {
                $description = $customer->descriptions()->create($descriptionData);
                $updatedDescriptions[] = $description;
            }
        }
    
        // Return the updated customer data
        $response = [
            'customer' => $customer->fresh(), // Refresh the customer model to get the updated data
            'updatedEmails' => $updatedEmails,
            'updatedPhones' => $updatedPhones,
            'updatedDescriptions' => $updatedDescriptions,
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
                $join->on('customers.id', '=', 'emails.customer_id')      
                ->whereRaw('emails.created_at = (SELECT MIN(created_at) FROM emails WHERE customer_id = customers.id)');
            })
            ->leftJoin('phones', function ($join) {
                $join->on('customers.id', '=', 'phones.customer_id')
                ->whereRaw('phones.created_at = (SELECT MIN(created_at) FROM phones WHERE customer_id = customers.id)');
            })
            ->select(
                'customers.id',
                'customers.name',
                'customers.created_at',
                'customers.country',
                'customers.birth_day',
                'customers.birth_place',
                DB::raw('MAX(emails.value) as email'), // Get the first email
                DB::raw('MAX(phones.value) as phone')  // Get the first phone number
            )
            ->groupBy('customers.id', 'customers.name', 'customers.created_at', 'customers.country', 'customers.birth_day', 'customers.birth_place')
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
        ->leftJoin('descriptions', 'customers.id', '=', 'descriptions.customer_id')
        ->select(
            'customers.id',
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
                // ->orWhere('customers.code_postal', 'like', "%$searchTerm%")
                // ->orWhere('customers.company', 'like', "%$searchTerm%")
                ->orWhere('customers.job', 'like', "%$searchTerm%")
                ->orWhere('emails.value', 'like', "%$searchTerm%")
                ->orWhere('emails.key', 'like', "%$searchTerm%")
                ->orWhere('phones.value', 'like', "%$searchTerm%")
                ->orWhere('phones.key', 'like', "%$searchTerm%")
                ->orWhere('descriptions.value', 'like', "%$searchTerm%")
                ->orWhere('descriptions.key', 'like', "%$searchTerm%");
        })
        ->groupBy('customers.id', 'customers.name', 'customers.created_at', 'customers.country', 'customers.birth_day', 'customers.birth_place')
        ->orderBy('customers.id', 'desc')
        ->paginate(7);

    return CustomerResourceMenu::collection($customers);
}

public function exportCustomer(Request $request){
    $customerIds = $request->input('selectedCustomerIds');

    $fileName = 'customers-'.time() . '.xlsx';

    return Excel::download(new CustomerExport($customerIds), $fileName,\Maatwebsite\Excel\Excel::XLSX);
}

}
