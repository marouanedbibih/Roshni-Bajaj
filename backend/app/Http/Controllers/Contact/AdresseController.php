<?php

namespace App\Http\Controllers\Contact;

use App\Http\Controllers\Controller;
use App\Models\Adresse;
use Illuminate\Http\Request;

class AdresseController extends Controller
{
    public function destroy(Adresse $adresse)
    {
        try {
            $adresse->delete();
            return response(['message' => 'Adresse deleted successfully'], 200);
        } catch (\Exception $e) {
            // Handle any exceptions that may occur during deletion
            return response(['error' => 'An error occurred while deleting the Adresse'], 500);
        }
    }
}
