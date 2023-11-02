<?php

namespace App\Http\Requests\Email;
use Illuminate\Validation\Rule;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class UpdateEmailRequest extends FormRequest
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
        $emailId = $this->route('email'); // Assuming the route parameter is named 'email'

        return [
            'label' => 'required|string',
            'email' => [
                'required',
                'email',
                Rule::unique('emails')->ignore($emailId)
            ],
            'customer_id' => 'exists:customers,id',
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
