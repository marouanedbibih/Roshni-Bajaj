<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Models\Phone;
use Illuminate\Http\Request;

class PhoneController extends Controller
{
    public function destroy(Phone $phone)
    {
        try {
            $phone->delete();
            return response(['message' => 'Phone deleted successfully'], 200);
        } catch (\Exception $e) {
            // Handle any exceptions that may occur during deletion
            return response(['error' => 'An error occurred while deleting the Adresse'], 500);
        }
    }
}
