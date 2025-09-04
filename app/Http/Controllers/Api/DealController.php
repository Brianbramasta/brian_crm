<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\Product;

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

            $deal->items()->create([
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'unit_price' => $product->selling_price,
                'negotiated_price' => $item['negotiated_price'],
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

            // TODO: Create customer and customer services
            // This would be implemented based on business requirements
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
}
