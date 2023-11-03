<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Models\Description;
use Illuminate\Http\Request;

class DescriptionController extends Controller
{
    public function destroy(Description $description)
    {
        try {
            $description->delete();
            return response(['message' => 'Description deleted successfully'], 200);
        } catch (\Exception $e) {
            // Handle any exceptions that may occur during deletion
            return response(['error' => 'An error occurred while deleting the Adresse'], 500);
        }
    }
}
