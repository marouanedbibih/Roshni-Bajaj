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
            'infos.birth_day' => 'required|date',
            'infos.birth_place' => 'required|string|max:255',
            'infos.country' => 'required|string|max:255',
            'infos.state' => 'required|string|max:255',
            'infos.city' => 'required|string|max:255',
            'infos.code_postal' => 'required|string|max:255',
            'infos.company' => 'required|string|max:255',
            'infos.job' => 'required|string|max:255',
            'infos.image' => 'string',  // You may want to validate the image format and size here
    
            'emails' => [
                'required',
                'array',
            ],
            'emails.*.id' => 'integer|nullable', // Ensure 'id' is an integer
            'emails.*.key' => 'string|max:255',
            'emails.*.value' => [
                'email',
                new UpdateUniqueEmail($customerId, $this->input('emails.*.id'), $this->input('emails'))
            
            ],
            'phones' => [
                'required',
                'array',
            ],
            'phones.*.id' => 'integer|nullable', // Ensure 'id' is an integer
            'phones.*.key' => 'string|max:255',
            'phones.*.value' => [
                'string',
                new UpdateUniqueEmail($customerId, $this->input('phones.*.id'), $this->input('phones'))
            
            ],
            'adresses' => [
                'required',
                'array',
            ],
            'adresses.*.id' => 'integer|nullable', // Ensure 'id' is an integer
            'adresses.*.key' => 'string|max:255',
            'adresses.*.value' => [
                'string',
                // new UpdateUniquePhone($customerId, $this->input('phones.*.id'))
            
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
