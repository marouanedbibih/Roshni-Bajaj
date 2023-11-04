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
        $customers = Customer::with('emails', 'phones')
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
                'Job' => $customer->job,
                'Emails' => '', 
                'Phones' => ''
            ];

            // Add emails as separate rows
            $emailAddresses = [];
            foreach ($customer->emails as $email) {
                $emailAddresses[] = "{$email->key}: {$email->value}";
            }
            $customerData['Emails'] = implode("\n", $emailAddresses);

            // Add emails as separate rows
            $phonesNumbres = [];
            foreach ($customer->phones as $phone) {
                $phonesNumbres[] = "{$phone->key}: {$phone->value}";
            }
            $customerData['Phones'] = implode("\n", $phonesNumbres);

            $exportData->push($customerData);
        }

        return $exportData;
    }

    public function headings(): array
    {
        return [
            'ID',
            'Name',
            'Birth Day',
            'Birth Place',
            'Country',
            'State',
            'City',
            'Job',
            'Emails',         
            'Phones'
            // Add other headings dynamically based on the data
        ];
    }
}

