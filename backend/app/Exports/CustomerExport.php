<?php

namespace App\Exports;

use App\Models\Customer;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class CustomerExport implements FromCollection, WithHeadings
{
    protected $customerIds;

    public function __construct(array $customerIds)
    {
        $this->customerIds = $customerIds;
    }

    public function collection()
    {
        $exportData = collect([]);

        // Fetch the customer data along with their emails, phones, and addresses
        $customers = Customer::with('emails', 'phones', 'addresses')
            ->whereIn('id', $this->customerIds)
            ->get();

        // Loop through each customer
        foreach ($customers as $customer) {
            // Add basic customer info
            $customerData = [
                'Customer ID' => $customer->id,
                'Name' => $customer->name,
                'Birth Day' => $customer->birth_day,
                'Birth Place' => $customer->birth_place,
                'Country' => $customer->country,
                'State' => $customer->state,
                'City' => $customer->city,
                'Code Postal' => $customer->code_postal,
                'Company' => $customer->company,
                'Job' => $customer->job,
            ];

            // Add emails
            $emailData = [];
            foreach ($customer->emails as $email) {
                $emailData["Email: {$email->key}"] = $email->value;
            }
            $customerData['Emails'] = $emailData;

            // Add phones
            $phoneData = [];
            foreach ($customer->phones as $phone) {
                $phoneData["Phone: {$phone->key}"] = $phone->value;
            }
            $customerData['Phones'] = $phoneData;

            // Add addresses
            $addressData = [];
            foreach ($customer->addresses as $address) {
                $addressData["Address: {$address->key}"] = $address->value;
            }
            $customerData['Addresses'] = $addressData;

            $exportData->push($customerData);
        }

        return $exportData;
    }

    public function headings(): array
    {
        return [
            'Customer ID',
            'Name',
            'Birth Day',
            'Birth Place',
            'Country',
            'State',
            'City',
            'Code Postal',
            'Company',
            'Job',
            // Add other headings dynamically based on the data
        ];
    }
}
