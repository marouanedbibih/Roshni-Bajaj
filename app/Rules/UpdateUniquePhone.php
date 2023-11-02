<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class UpdateUniquePhone implements ValidationRule
{
    protected $customerId;
    protected $phoneId;
    protected $phones;

    public function __construct($customerId, $phoneId, $phones)
    {
        $this->customerId = $customerId;
        $this->phoneId = $phoneId;
        $this->phones = $phones;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        foreach ($this->phones as $key => $phone) {
            $count = DB::table('phones')
                ->where('value', $phone['value'])
                ->where('customer_id', '<>', $this->customerId)
                ->where('id', '<>', $phone['id'])
                ->count();

            if ($count > 0) {
                $fail(trans('validation.unique'));
            }
        }
    }
}
