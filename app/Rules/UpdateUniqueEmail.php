<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Facades\DB;

class UpdateUniqueEmail implements ValidationRule
{
    protected $customerId;
    protected $emailId;
    protected $emails;

    public function __construct($customerId, $emailId, $emails)
    {
        $this->customerId = $customerId;
        $this->emailId = $emailId;
        $this->emails = $emails;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        foreach ($this->emails as $key => $email) {
            $count = DB::table('emails')
                ->where('value', $email['value'])
                ->where('customer_id', '<>', $this->customerId)
                ->where('id', '<>', $email['id'])
                ->count();

            if ($count > 0) {
                $fail(trans('validation.unique'));
            }
        }
    }
}
