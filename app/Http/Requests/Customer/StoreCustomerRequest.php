<?php

namespace App\Http\Requests\Customer;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

use Illuminate\Foundation\Http\FormRequest;

class StoreCustomerRequest extends FormRequest
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
        return [
            'infos' => 'required|array',
            'infos.name' => 'required|string|max:255|unique:customers,name',
            'infos.birth_day' => 'required|date',
            'infos.birth_place' => 'required|string|max:255',
            'infos.country' => 'required|string|max:255',
            'infos.state' => 'required|string|max:255',
            'infos.city' => 'required|string|max:255',
            'infos.code_postal' => 'required|string|max:255',
            'infos.company' => 'required|string|max:255',
            'infos.job' => 'required|string|max:255',
            'infos.image' => 'string',  // You may want to validate the image format and size here
    
            'emails' => 'required|array',
            'emails.*.key' => 'required|string|max:255',
            'emails.*.value' => 'required|email|unique:emails,value',  // You can add email format validation
    
            'phones' => 'required|array',
            'phones.*.key' => 'required|string|max:255',
            'phones.*.value' => 'required|string|max:255|unique:phones,value',  // You can add phone number format validation
    
            'adresses' => 'required|array',
            'adresses.*.key' => 'required|string|max:255',
            'adresses.*.value' => 'required|string|unique:adresses,value',  // You may want to add address format validation
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
