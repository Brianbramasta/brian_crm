<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CustomerController extends Controller
{
    /**
     * Display a listing of customers
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = Customer::with(['lead.owner', 'services.product']);

        // Sales can only see customers from their own leads
        if ($user->isSales()) {
            $query->whereHas('lead', function ($q) use ($user) {
                $q->where('owner_user_id', $user->id);
            });
        }

        // Search functionality
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->search($searchTerm);
        }

        $customers = $query->orderBy('created_at', 'desc')->paginate(15);

        // Add calculated fields
        $customers->getCollection()->transform(function ($customer) {
            $customer->total_revenue = $customer->getTotalMonthlyRevenue();
            $customer->services_count = $customer->getActiveServicesCount();
            return $customer;
        });

        return response()->json($customers);
    }

    /**
     * Display the specified customer
     */
    public function show(Customer $customer): JsonResponse
    {
        $user = Auth::user();

        // Check ownership for sales users
        if ($user->isSales() && $customer->lead && $customer->lead->owner_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $customer->load(['lead.owner', 'services.product']);
        $customer->total_revenue = $customer->getTotalMonthlyRevenue();
        $customer->services_count = $customer->getActiveServicesCount();

        return response()->json($customer);
    }

    /**
     * Update the specified customer
     */
    public function update(Request $request, Customer $customer): JsonResponse
    {
        $user = Auth::user();

        // Check ownership for sales users
        if ($user->isSales() && $customer->lead && $customer->lead->owner_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'string|max:100',
            'contact' => 'string|max:50',
        ]);

        $customer->update($request->only(['name', 'contact']));
        $customer->load(['lead.owner', 'services.product']);

        return response()->json($customer);
    }

    /**
     * Get customer services
     */
    public function services(Customer $customer): JsonResponse
    {
        $user = Auth::user();

        // Check ownership for sales users
        if ($user->isSales() && $customer->lead && $customer->lead->owner_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $services = $customer->services()->with('product')->get();

        return response()->json($services);
    }

    /**
     * Add service to customer
     */
    public function addService(Request $request, Customer $customer): JsonResponse
    {
        $user = Auth::user();

        // Check ownership for sales users
        if ($user->isSales() && $customer->lead && $customer->lead->owner_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'product_id' => 'required|exists:products,id',
            'price' => 'required|numeric|min:0',
            'start_date' => 'required|date',
        ]);

        // Check if customer already has this service
        $existingService = $customer->services()->where('product_id', $request->product_id)->first();
        if ($existingService) {
            return response()->json([
                'message' => 'Customer already has this service'
            ], 422);
        }

        $service = CustomerService::create([
            'customer_id' => $customer->id,
            'product_id' => $request->product_id,
            'price' => $request->price,
            'start_date' => $request->start_date,
        ]);

        $service->load('product');

        return response()->json($service, 201);
    }

    /**
     * Remove service from customer
     */
    public function removeService(Customer $customer, CustomerService $service): JsonResponse
    {
        $user = Auth::user();

        // Check ownership for sales users
        if ($user->isSales() && $customer->lead && $customer->lead->owner_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if service belongs to customer
        if ($service->customer_id !== $customer->id) {
            return response()->json(['message' => 'Service does not belong to customer'], 422);
        }

        $service->delete();

        return response()->json(['message' => 'Service removed successfully']);
    }

    /**
     * Get customer statistics
     */
    public function stats(): JsonResponse
    {
        $user = Auth::user();
        $query = Customer::query();

        if ($user->isSales()) {
            $query->whereHas('lead', function ($q) use ($user) {
                $q->where('owner_user_id', $user->id);
            });
        }

        $totalCustomers = $query->count();
        $totalRevenue = CustomerService::whereHas('customer', function ($q) use ($user) {
            if ($user->isSales()) {
                $q->whereHas('lead', function ($subQ) use ($user) {
                    $subQ->where('owner_user_id', $user->id);
                });
            }
        })->sum('price');

        $stats = [
            'total_customers' => $totalCustomers,
            'total_monthly_revenue' => $totalRevenue,
            'average_revenue_per_customer' => $totalCustomers > 0 ? $totalRevenue / $totalCustomers : 0,
        ];

        return response()->json($stats);
    }
}
