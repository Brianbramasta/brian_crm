<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Deal;
use App\Models\Lead;
use App\Models\DealItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DealController extends Controller
{
    /**
     * Display a listing of deals
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = Deal::with(['lead.owner', 'items.product']);

        // Sales can only see their own deals, managers can see all
        if ($user->isSales()) {
            $query->forSalesUser($user->id);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->withStatus($request->status);
        }

        $deals = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($deals);
    }

    /**
     * Store a newly created deal
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'lead_id' => 'required|exists:leads,id',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.harga_nego' => 'required|numeric|min:0',
        ]);

        $lead = Lead::findOrFail($request->lead_id);
        $user = Auth::user();

        // Check ownership for sales users
        if ($user->isSales() && $lead->owner_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        DB::beginTransaction();
        try {
            // Create deal
            $deal = Deal::create([
                'lead_id' => $request->lead_id,
                'status' => 'waiting_approval',
                'total_amount' => 0, // Will be calculated by deal items
            ]);

            // Create deal items
            foreach ($request->items as $itemData) {
                DealItem::create([
                    'deal_id' => $deal->id,
                    'product_id' => $itemData['product_id'],
                    'qty' => $itemData['qty'],
                    'harga_nego' => $itemData['harga_nego'],
                ]);
            }

            // Check if approval is needed
            if (!$deal->requiresApproval()) {
                $deal->status = 'approved';
                $deal->save();
                $deal->approve();
            }

            DB::commit();

            $deal->load(['lead.owner', 'items.product']);

            return response()->json($deal, 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create deal'], 500);
        }
    }

    /**
     * Display the specified deal
     */
    public function show(Deal $deal): JsonResponse
    {
        $user = Auth::user();

        // Check ownership for sales users
        if ($user->isSales() && $deal->lead->owner_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $deal->load(['lead.owner', 'items.product']);

        return response()->json($deal);
    }

    /**
     * Update the specified deal
     */
    public function update(Request $request, Deal $deal): JsonResponse
    {
        $user = Auth::user();

        // Check ownership for sales users
        if ($user->isSales() && $deal->lead->owner_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only allow updates if deal is still waiting approval
        if ($deal->status !== 'waiting_approval') {
            return response()->json([
                'message' => 'Cannot update deal that is already approved or rejected'
            ], 422);
        }

        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.harga_nego' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            // Delete existing items
            $deal->items()->delete();

            // Create new items
            foreach ($request->items as $itemData) {
                DealItem::create([
                    'deal_id' => $deal->id,
                    'product_id' => $itemData['product_id'],
                    'qty' => $itemData['qty'],
                    'harga_nego' => $itemData['harga_nego'],
                ]);
            }

            // Check if approval is still needed
            if (!$deal->requiresApproval()) {
                $deal->approve();
            }

            DB::commit();

            $deal->load(['lead.owner', 'items.product']);

            return response()->json($deal);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to update deal'], 500);
        }
    }

    /**
     * Approve a deal (managers only)
     */
    public function approve(Deal $deal): JsonResponse
    {
        if (!Auth::user()->isManager()) {
            return response()->json(['message' => 'Only managers can approve deals'], 403);
        }

        if ($deal->status !== 'waiting_approval') {
            return response()->json([
                'message' => 'Deal is not waiting for approval'
            ], 422);
        }

        $deal->approve();
        $deal->load(['lead.owner', 'items.product']);

        return response()->json($deal);
    }

    /**
     * Reject a deal (managers only)
     */
    public function reject(Deal $deal): JsonResponse
    {
        if (!Auth::user()->isManager()) {
            return response()->json(['message' => 'Only managers can reject deals'], 403);
        }

        if ($deal->status !== 'waiting_approval') {
            return response()->json([
                'message' => 'Deal is not waiting for approval'
            ], 422);
        }

        $deal->reject();
        $deal->load(['lead.owner', 'items.product']);

        return response()->json($deal);
    }

    /**
     * Remove the specified deal
     */
    public function destroy(Deal $deal): JsonResponse
    {
        $user = Auth::user();

        // Check ownership for sales users
        if ($user->isSales() && $deal->lead->owner_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Only allow deletion if deal is not approved
        if ($deal->status === 'approved') {
            return response()->json([
                'message' => 'Cannot delete approved deal'
            ], 422);
        }

        $deal->delete();

        return response()->json(['message' => 'Deal deleted successfully']);
    }

    /**
     * Get deal statistics
     */
    public function stats(): JsonResponse
    {
        $user = Auth::user();
        $query = Deal::query();

        if ($user->isSales()) {
            $query->forSalesUser($user->id);
        }

        $stats = [
            'total' => $query->count(),
            'waiting_approval' => $query->clone()->withStatus('waiting_approval')->count(),
            'approved' => $query->clone()->withStatus('approved')->count(),
            'rejected' => $query->clone()->withStatus('rejected')->count(),
            'total_value' => $query->clone()->withStatus('approved')->sum('total_amount'),
        ];

        return response()->json($stats);
    }
}
