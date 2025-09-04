<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\LeadController;
use App\Http\Controllers\Api\DealController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\ReportController;

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

// Authentication Routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/profile', [AuthController::class, 'updateProfile']);

    // CRM - Leads Management
    Route::apiResource('leads', LeadController::class);
    Route::get('/leads-stats', [LeadController::class, 'stats']);

    // CRM - Deals Management
    Route::apiResource('deals', DealController::class);
    Route::post('/deals/{deal}/approve', [DealController::class, 'approve']);
    Route::post('/deals/{deal}/close', [DealController::class, 'close']);
    Route::get('/deals-stats', [DealController::class, 'stats']);
    Route::get('/deals-approval', [DealController::class, 'needsApproval']);

    // CRM - Customers Management
    Route::apiResource('customers', CustomerController::class);
    Route::get('/customers/{customer}/services', [CustomerController::class, 'services']);
    Route::post('/customers/{customer}/services', [CustomerController::class, 'addService']);
    Route::put('/customers/{customer}/services/{service}', [CustomerController::class, 'updateService']);

    // Products Management
    Route::apiResource('products', ProductController::class);

    // Reports and Dashboard
    Route::get('/dashboard', [ReportController::class, 'dashboard']);
    Route::get('/reports/sales', [ReportController::class, 'salesReport']);
    Route::get('/reports/revenue', [ReportController::class, 'revenueReport']);
    Route::get('/reports/performance', [ReportController::class, 'performanceReport']);
    Route::post('/reports/export', [ReportController::class, 'exportData']);

    // Task Management (keeping existing functionality)
    Route::apiResource('tasks', TaskController::class);

    // Cart Management (keeping existing functionality)
    Route::apiResource('cart', CartController::class)->except(['show']);
});

// Public Routes (if needed)
// Products (public for browsing - commented out as this might not be needed for CRM)
// Route::apiResource('products', ProductController::class)->only(['index', 'show']);
