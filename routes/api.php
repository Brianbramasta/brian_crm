<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\DealController;
use App\Http\Controllers\Api\CustomerController;

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

// Public authentication routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Authentication routes
    Route::get('/auth/user', [AuthController::class, 'user']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/auth/register', [AuthController::class, 'register']); // For managers only

    // Leads routes
    Route::apiResource('leads', LeadController::class);
    Route::get('/leads-stats', [LeadController::class, 'stats']);

    // Products routes
    Route::apiResource('products', ProductController::class);
    Route::post('/products/{product}/check-price', [ProductController::class, 'checkPriceApproval']);

    // Deals routes
    Route::apiResource('deals', DealController::class);
    Route::post('/deals/{deal}/approve', [DealController::class, 'approve']);
    Route::post('/deals/{deal}/reject', [DealController::class, 'reject']);
    Route::get('/deals-stats', [DealController::class, 'stats']);

    // Customers routes
    Route::apiResource('customers', CustomerController::class)->only(['index', 'show', 'update']);
    Route::get('/customers/{customer}/services', [CustomerController::class, 'services']);
    Route::post('/customers/{customer}/services', [CustomerController::class, 'addService']);
    Route::delete('/customers/{customer}/services/{service}', [CustomerController::class, 'removeService']);
    Route::get('/customers-stats', [CustomerController::class, 'stats']);
});
