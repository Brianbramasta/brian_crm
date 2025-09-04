<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\CustomerService;

class CustomerController extends Controller
{
    /**
     * Get all customers with role-based access
     */
    public function index(Request $request)
    {
        $query = Customer::with(['sales:id,name', 'services.product:id,name']);

        // Role-based filtering
        if ($request->user()->isSales()) {
            $query->where('sales_id', $request->user()->id);
        }

        // Status filtering
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Customer type filtering
        if ($request->has('customer_type')) {
            $query->where('customer_type', $request->customer_type);
        }

        // Search filtering
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%")
                  ->orWhere('phone', 'like', "%$search%")
                  ->orWhere('customer_number', 'like', "%$search%");
            });
        }

        $customers = $query->orderBy('created_at', 'desc')
                          ->paginate($request->get('per_page', 15));

        // Transform the data
        $customers->getCollection()->transform(function ($customer) {
            return [
                'id' => $customer->id,
                'customer_number' => $customer->customer_number,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'customer_type' => $customer->customer_type,
                'status' => $customer->status,
                'activation_date' => $customer->activation_date,
                'sales' => $customer->sales,
                'active_services_count' => $customer->services->where('status', 'active')->count(),
                'total_monthly_revenue' => $customer->services->where('status', 'active')->sum('monthly_fee'),
                'created_at' => $customer->created_at,
            ];
        });

        return response()->json($customers);
    }

    /**
     * Display the specified customer
     */
    public function show(Request $request, Customer $customer)
    {
        // Check access permission
        if ($request->user()->isSales() && $customer->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $customer->load(['sales', 'lead', 'services.product', 'services.deal']);

        return response()->json([
            'id' => $customer->id,
            'customer_number' => $customer->customer_number,
            'lead_id' => $customer->lead_id,
            'name' => $customer->name,
            'email' => $customer->email,
            'phone' => $customer->phone,
            'address' => $customer->address,
            'billing_address' => $customer->billing_address,
            'installation_address' => $customer->installation_address,
            'customer_type' => $customer->customer_type,
            'status' => $customer->status,
            'activation_date' => $customer->activation_date,
            'notes' => $customer->notes,
            'sales' => $customer->sales,
            'lead' => $customer->lead,
            'services' => $customer->services->map(function ($service) {
                return [
                    'id' => $service->id,
                    'service_number' => $service->service_number,
                    'product' => $service->product,
                    'monthly_fee' => $service->monthly_fee,
                    'installation_fee' => $service->installation_fee,
                    'start_date' => $service->start_date,
                    'end_date' => $service->end_date,
                    'billing_cycle' => $service->billing_cycle,
                    'status' => $service->status,
                    'equipment_info' => $service->equipment_info,
                    'deal_id' => $service->deal_id,
                ];
            }),
            'total_monthly_revenue' => $customer->services->where('status', 'active')->sum('monthly_fee'),
            'created_at' => $customer->created_at,
            'updated_at' => $customer->updated_at,
        ]);
    }

    /**
     * Update the specified customer
     */
    public function update(Request $request, Customer $customer)
    {
        // Check access permission
        if ($request->user()->isSales() && $customer->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|nullable|email|max:100',
            'phone' => 'sometimes|nullable|string|max:50',
            'address' => 'sometimes|nullable|string',
            'billing_address' => 'sometimes|nullable|string',
            'installation_address' => 'sometimes|nullable|string',
            'customer_type' => 'sometimes|required|in:individual,corporate',
            'status' => 'sometimes|required|in:active,inactive,suspended',
            'notes' => 'sometimes|nullable|string',
        ]);

        $customer->update($request->only([
            'name', 'email', 'phone', 'address', 'billing_address',
            'installation_address', 'customer_type', 'status', 'notes'
        ]));

        return response()->json($customer->load('sales'));
    }

    /**
     * Get customer services
     */
    public function services(Request $request, Customer $customer)
    {
        // Check access permission
        if ($request->user()->isSales() && $customer->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $query = $customer->services()->with(['product', 'deal']);

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $services = $query->orderBy('start_date', 'desc')->get();

        return response()->json($services->map(function ($service) {
            return [
                'id' => $service->id,
                'service_number' => $service->service_number,
                'product' => $service->product,
                'monthly_fee' => $service->monthly_fee,
                'installation_fee' => $service->installation_fee,
                'start_date' => $service->start_date,
                'end_date' => $service->end_date,
                'billing_cycle' => $service->billing_cycle,
                'status' => $service->status,
                'installation_address' => $service->installation_address,
                'equipment_info' => $service->equipment_info,
                'deal' => $service->deal ? [
                    'id' => $service->deal->id,
                    'deal_number' => $service->deal->deal_number,
                    'title' => $service->deal->title,
                ] : null,
                'notes' => $service->notes,
                'created_at' => $service->created_at,
            ];
        }));
    }

    /**
     * Update customer service
     */
    public function updateService(Request $request, Customer $customer, CustomerService $service)
    {
        // Check access permission
        if ($request->user()->isSales() && $customer->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        // Verify service belongs to customer
        if ($service->customer_id !== $customer->id) {
            return response()->json(['message' => 'Service does not belong to this customer'], 422);
        }

        $request->validate([
            'monthly_fee' => 'sometimes|required|numeric|min:0',
            'billing_cycle' => 'sometimes|required|in:monthly,quarterly,yearly',
            'status' => 'sometimes|required|in:active,inactive,suspended,terminated',
            'end_date' => 'sometimes|nullable|date',
            'installation_address' => 'sometimes|nullable|string',
            'notes' => 'sometimes|nullable|string',
        ]);

        $service->update($request->only([
            'monthly_fee', 'billing_cycle', 'status', 'end_date',
            'installation_address', 'notes'
        ]));

        return response()->json($service->load('product'));
    }

    /**
     * Get customer statistics
     */
    public function stats(Request $request)
    {
        $query = Customer::query();

        // Role-based filtering
        if ($request->user()->isSales()) {
            $query->where('sales_id', $request->user()->id);
        }

        $stats = [
            'total' => $query->count(),
            'active' => $query->where('status', 'active')->count(),
            'inactive' => $query->where('status', 'inactive')->count(),
            'suspended' => $query->where('status', 'suspended')->count(),
            'individual' => $query->where('customer_type', 'individual')->count(),
            'corporate' => $query->where('customer_type', 'corporate')->count(),
            'new_this_month' => $query->whereMonth('created_at', now()->month)
                                   ->whereYear('created_at', now()->year)
                                   ->count(),
        ];

        // Revenue statistics
        $revenueQuery = CustomerService::whereHas('customer', function ($q) use ($request) {
            if ($request->user()->isSales()) {
                $q->where('sales_id', $request->user()->id);
            }
        })->where('status', 'active');

        $stats['total_monthly_revenue'] = $revenueQuery->sum('monthly_fee');
        $stats['active_services'] = $revenueQuery->count();

        return response()->json($stats);
    }

    /**
     * Get customer revenue report
     */
    public function revenueReport(Request $request, Customer $customer)
    {
        // Check access permission
        if ($request->user()->isSales() && $customer->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $services = $customer->services()->with('product')->get();

        $report = [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'customer_number' => $customer->customer_number,
            ],
            'services' => $services->map(function ($service) {
                return [
                    'service_number' => $service->service_number,
                    'product_name' => $service->product->name,
                    'monthly_fee' => $service->monthly_fee,
                    'status' => $service->status,
                    'start_date' => $service->start_date,
                    'months_active' => $service->start_date ?
                        $service->start_date->diffInMonths(now()) + 1 : 0,
                    'total_revenue' => $service->start_date ?
                        ($service->start_date->diffInMonths(now()) + 1) * $service->monthly_fee : 0,
                ];
            }),
            'summary' => [
                'total_monthly_revenue' => $services->where('status', 'active')->sum('monthly_fee'),
                'total_services' => $services->count(),
                'active_services' => $services->where('status', 'active')->count(),
                'total_lifetime_revenue' => $services->sum(function ($service) {
                    return $service->start_date ?
                        ($service->start_date->diffInMonths(now()) + 1) * $service->monthly_fee : 0;
                }),
            ],
        ];

        return response()->json($report);
    }
}
