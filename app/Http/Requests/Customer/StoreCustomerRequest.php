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
            'infos.birth_day' => 'nullable|date',
            'infos.birth_place' => 'nullable|string|max:255',
            'infos.country' => 'nullable|string|max:255',
            'infos.state' => 'nullable|string|max:255',
            'infos.city' => 'nullable|string|max:255',
            'infos.job' => 'nullable|string|max:255',
    
            'emails' => 'required|array',
            'emails.*.key' => 'nullable|string|max:255',
            'emails.*.value' => 'nullable|email|unique:emails,value',  
    
            'phones' => 'required|array',
            'phones.*.key' => 'nullable|string|max:255',
            'phones.*.value' => 'nullable|string|max:255|unique:phones,value',  
    
            'descriptions' => 'required|array',
            'descriptions.*.key' => 'nullable|string|max:255',
            'descriptions.*.value' => 'nullable|string|',  
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
