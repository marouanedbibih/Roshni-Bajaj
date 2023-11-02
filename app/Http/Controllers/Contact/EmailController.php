<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Models\Adresse;
use App\Models\Email;
use Illuminate\Http\Request;

class EmailController extends Controller
{
    public function destroy(Email $email)
    {
        try {
            $email->delete();
            return response(['message' => 'Email deleted successfully'], 200);
        } catch (\Exception $e) {
            // Handle any exceptions that may occur during deletion
            return response(['error' => 'An error occurred while deleting the Adresse'], 500);
        }
    }
}
