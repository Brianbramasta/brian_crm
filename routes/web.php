<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Route untuk mengakses aplikasi React CRM
Route::get('/', function () {
    return view('react-app');
});

// Catch-all route untuk React Router (SPA)
Route::get('/{any}', function () {
    return view('react-app');
})->where('any', '.*');
