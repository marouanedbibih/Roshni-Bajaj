<?php

namespace App\Http\Requests\Customer;
use App\Rules\UpdateUniqueEmail;
use App\Rules\UpdateUniquePhone;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;


use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $customerId = $this->route('customer');

        return [
            'infos' => 'required',
            'infos.name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('customers', 'name')->ignore($customerId),
            ],
            'infos.birth_day' => 'nullable|date',
            'infos.birth_place' => 'nullable|string|max:255',
            'infos.country' => 'nullable|string|max:255',
            'infos.state' => 'nullable|string|max:255',
            'infos.city' => 'nullable|string|max:255',
            'infos.job' => 'nullable|string|max:255',
    
            'emails' => [
                'required',
                'array',
            ],
            'emails.*.id' => 'integer|nullable', // Ensure 'id' is an integer
            'emails.*.key' => 'nullable|string|max:255',
            'emails.*.value' => [
                'email',
                'nullable',
                new UpdateUniqueEmail($customerId, $this->input('emails.*.id'), $this->input('emails'))
            
            ],
            'phones' => [
                'required',
                'array',
            ],
            'phones.*.id' => 'integer|nullable', // Ensure 'id' is an integer
            'phones.*.key' => 'nullable|string|max:255',
            'phones.*.value' => [
                'string',
                'nullable',
                new UpdateUniqueEmail($customerId, $this->input('phones.*.id'), $this->input('phones'))
            
            ],
            'dscriptions' => [
                'nullable',
                'array',
            ],
            'descriptions.*.id' => '|integer|nullable', // Ensure 'id' is an integer
            'descriptions.*.key' => 'nullable|string|max:255',
            'descriptions.*.value' => [
                'string',  
                'nullable'          
            ],
        ];
    }


    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'message' => 'validation error',
            'errors' => $validator->errors()
        ], 422));
    }
}
