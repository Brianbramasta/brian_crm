<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Product;
use App\Models\Customer;
use App\Models\CustomerService;

class DealController extends Controller
{
    /**
     * Get all deals with role-based access
     */
    public function index(Request $request)
    {
        $query = Deal::with(['lead:id,name', 'sales:id,name', 'approver:id,name', 'items.product:id,name']);

        // Role-based filtering
        if ($request->user()->isSales()) {
            $query->where('sales_id', $request->user()->id);
        }

        // Status filtering
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        $deals = $query->orderBy('created_at', 'desc')
                      ->paginate($request->get('per_page', 15));

        return response()->json($deals);
    }

    /**
     * Store a new deal
     */
    public function store(Request $request)
    {
        $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.negotiated_price' => 'required|numeric|min:0',
            'items.*.discount_percentage' => 'nullable|numeric|min:0|max:100',
            'items.*.notes' => 'nullable|string',
            'discount_amount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        // Check if user can access this lead
        $lead = Lead::findOrFail($request->lead_id);
        if ($request->user()->isSales() && $lead->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $deal = Deal::create([
            'lead_id' => $request->lead_id,
            'title' => $request->title,
            'description' => $request->description,
            'discount_amount' => $request->discount_amount ?? 0,
            'status' => 'draft',
            'sales_id' => $request->user()->id,
            'notes' => $request->notes,
        ]);

        // Create deal items
        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);

            // Use provided discount percentage or calculate it
            $discountPercentage = $item['discount_percentage'] ?? 0;
            if (!isset($item['discount_percentage']) && $product->selling_price > 0) {
                $discountPercentage = (($product->selling_price - $item['negotiated_price']) / $product->selling_price) * 100;
                $discountPercentage = max(0, $discountPercentage); // Ensure non-negative
            }

            $deal->items()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $product->selling_price,
                'negotiated_price' => $item['negotiated_price'],
                'discount_percentage' => $discountPercentage,
                'notes' => $item['notes'] ?? null,
            ]);
        }

        // Check if approval is required and update totals
        $deal->checkApprovalRequired();

        return response()->json($deal->load(['lead', 'sales', 'items.product']), 201);
    }

    /**
     * Display the specified deal
     */
    public function show(Request $request, Deal $deal)
    {
        // Check access permission
        if ($request->user()->isSales() && $deal->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        return response()->json($deal->load(['lead', 'sales', 'approver', 'items.product']));
    }

    /**
     * Update the specified deal
     */
    public function update(Request $request, Deal $deal)
    {
        // Check access permission
        if ($request->user()->isSales() && $deal->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        // Can't update approved or closed deals
        if (in_array($deal->status, ['approved', 'closed_won', 'closed_lost'])) {
            return response()->json(['message' => 'Cannot update deal with status: ' . $deal->status], 422);
        }

        $request->validate([
            'title' => 'sometimes|required|string|max:200',
            'description' => 'sometimes|nullable|string',
            'discount_amount' => 'sometimes|nullable|numeric|min:0',
            'notes' => 'sometimes|nullable|string',
        ]);

        $deal->update($request->only(['title', 'description', 'discount_amount', 'notes']));

        return response()->json($deal->load(['lead', 'sales', 'items.product']));
    }

    /**
     * Delete a deal
     */
    public function destroy(Request $request, Deal $deal)
    {
        // Check access permission
        if ($request->user()->isSales() && $deal->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        // Can't delete approved or closed deals
        if (in_array($deal->status, ['approved', 'closed_won', 'closed_lost'])) {
            return response()->json(['message' => 'Cannot delete deal with status: ' . $deal->status], 422);
        }

        $deal->delete();

        return response()->json(['message' => 'Deal deleted successfully']);
    }

    /**
     * Approve or reject a deal (Manager only)
     */
    public function approve(Request $request, Deal $deal)
    {
        if (!$request->user()->canApproveDeals()) {
            return response()->json(['message' => 'Access denied. Manager role required.'], 403);
        }

        $request->validate([
            'approved' => 'required|boolean',
            'notes' => 'nullable|string',
        ]);

        if (!$deal->canBeApproved()) {
            return response()->json(['message' => 'Deal cannot be approved in current status'], 422);
        }

        $deal->update([
            'status' => $request->approved ? 'approved' : 'rejected',
            'approved_by' => $request->user()->id,
            'approved_at' => now(),
            'notes' => $request->notes ? $deal->notes . "\n\nApproval Notes: " . $request->notes : $deal->notes,
        ]);

        return response()->json($deal->load(['lead', 'sales', 'approver']));
    }

    /**
     * Close a deal as won or lost
     */
    public function close(Request $request, Deal $deal)
    {
        // Check access permission
        if ($request->user()->isSales() && $deal->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $request->validate([
            'status' => 'required|in:closed_won,closed_lost',
            'notes' => 'nullable|string',
        ]);

        // Can only close approved deals
        if ($deal->status !== 'approved') {
            return response()->json(['message' => 'Only approved deals can be closed'], 422);
        }

        $deal->update([
            'status' => $request->status,
            'closed_at' => now(),
            'notes' => $request->notes ? $deal->notes . "\n\nClosing Notes: " . $request->notes : $deal->notes,
        ]);

        // Update lead status
        if ($request->status === 'closed_won') {
            $deal->lead->update(['status' => 'closed_won']);

            // Create customer automatically from lead and deal
            $customer = Customer::create([
                'lead_id' => $deal->lead_id,
                'name' => $deal->lead->name,
                'email' => $deal->lead->email,
                'phone' => $deal->lead->phone,
                'address' => $deal->lead->address,
                'billing_address' => $deal->lead->address,
                'installation_address' => $deal->lead->address,
                'customer_type' => 'individual', // Default, could be determined by business logic
                'status' => 'active',
                'sales_id' => $deal->sales_id,
                'activation_date' => now(),
                'notes' => 'Customer created automatically from deal: ' . $deal->title,
            ]);

            // Create customer services from deal items
            foreach ($deal->items as $dealItem) {
                CustomerService::create([
                    'customer_id' => $customer->id,
                    'product_id' => $dealItem->product_id,
                    'deal_id' => $deal->id,
                    'monthly_fee' => $dealItem->negotiated_price,
                    'installation_fee' => $this->calculateInstallationFee($dealItem->product),
                    'start_date' => now(),
                    'billing_cycle' => 'monthly',
                    'status' => 'active',
                    'installation_address' => $customer->address,
                    'equipment_info' => $this->generateEquipmentInfo($dealItem->product),
                    'notes' => 'Service created from deal item: ' . $dealItem->product->name,
                ]);
            }

            // Log the customer creation for audit
            \Log::info('Customer created automatically from deal', [
                'deal_id' => $deal->id,
                'customer_id' => $customer->id,
                'lead_id' => $deal->lead_id,
                'sales_id' => $deal->sales_id
            ]);
        } else {
            $deal->lead->update(['status' => 'closed_lost']);
        }

        return response()->json($deal->load(['lead', 'sales']));
    }

    /**
     * Get deals that need approval (Manager only)
     */
    public function needsApproval(Request $request)
    {
        if (!$request->user()->canApproveDeals()) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $deals = Deal::needsApproval()
                    ->with(['lead:id,name', 'sales:id,name', 'items.product:id,name'])
                    ->orderBy('created_at', 'asc')
                    ->paginate($request->get('per_page', 15));

        return response()->json($deals);
    }

    /**
     * Get deal statistics
     */
    public function stats(Request $request)
    {
        $query = Deal::query();

        // Role-based filtering
        if ($request->user()->isSales()) {
            $query->where('sales_id', $request->user()->id);
        }

        $stats = [
            'total' => $query->count(),
            'draft' => $query->where('status', 'draft')->count(),
            'waiting_approval' => $query->where('status', 'waiting_approval')->count(),
            'approved' => $query->where('status', 'approved')->count(),
            'rejected' => $query->where('status', 'rejected')->count(),
            'closed_won' => $query->where('status', 'closed_won')->count(),
            'closed_lost' => $query->where('status', 'closed_lost')->count(),
            'total_value' => $query->where('status', 'approved')->sum('final_amount'),
        ];

        return response()->json($stats);
    }

    /**
     * Calculate installation fee based on product category
     */
    private function calculateInstallationFee($product)
    {
        // Default installation fees based on product type
        if (stripos($product->name, 'corporate') !== false || stripos($product->name, 'enterprise') !== false) {
            return 500000; // Corporate installation fee
        } elseif (stripos($product->name, 'rumahan') !== false || stripos($product->name, 'home') !== false) {
            return 200000; // Home installation fee
        } else {
            return 300000; // Default installation fee
        }
    }

    /**
     * Generate equipment information based on product
     */
    private function generateEquipmentInfo($product)
    {
        $isCorporate = stripos($product->name, 'corporate') !== false || stripos($product->name, 'enterprise') !== false;

        return [
            'router' => $isCorporate ? 'Enterprise Router ER-X' : 'Home Router HR-5',
            'modem' => 'Fiber Modem FM-1000',
            'installation_date' => now()->format('Y-m-d'),
            'technician' => 'Tech Team ' . rand(1, 5),
            'signal_strength' => rand(85, 100) . '%',
            'bandwidth_allocated' => $this->extractBandwidthFromProductName($product->name),
        ];
    }

    /**
     * Extract bandwidth information from product name
     */
    private function extractBandwidthFromProductName($productName)
    {
        // Try to extract bandwidth (e.g., "50Mbps", "100Mbps", "1Gbps")
        if (preg_match('/(\d+)(Mbps|Gbps)/i', $productName, $matches)) {
            return $matches[1] . $matches[2];
        }
        return 'Standard';
    }
}
