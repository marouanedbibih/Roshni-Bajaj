<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Contact\DescriptionController;
use App\Http\Controllers\Contact\EmailController;
use App\Http\Controllers\Contact\PhoneController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Route::apiResource('/users', UserController::class);
});


Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'checkUserRole:1,2'])->group(function () {
    // Routes accessible for users with role 1 or 2
    Route::apiResource('/customer', CustomerController::class);
    Route::get('/getCustomerForMenu',[CustomerController::class,'getCustomerForMenu']);
    Route::get('/search-customers', [CustomerController::class,'searchCustomers']);


    Route::delete('/descriptions/{description}', [DescriptionController::class, 'destroy']);
    Route::delete('/emails/{email}', [EmailController::class, 'destroy']);
    Route::delete('/phones/{phone}', [PhoneController::class, 'destroy']);
    Route::delete('/customers/delete-selected', [CustomerController::class,'deleteCustomerSelected']);

});
Route::middleware(['auth:sanctum', 'checkUserRole:1'])->group(function () {
    Route::apiResource('/users',UserController::class);
});

Route::post('/customers/export', [CustomerController::class,'exportCustomer']);



