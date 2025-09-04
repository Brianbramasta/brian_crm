<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;

class LeadController extends Controller
{
    /**
     * Get all leads with role-based access
     */
    public function index(Request $request)
    {
        $query = Lead::with(['sales:id,name', 'deals:id,lead_id,status', 'customer:id,lead_id,name']);

        // Role-based filtering
        if ($request->user()->isSales()) {
            $query->where('sales_id', $request->user()->id);
        }

        // Status filtering
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Search filtering
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%")
                  ->orWhere('phone', 'like', "%$search%");
            });
        }

        $leads = $query->orderBy('created_at', 'desc')
                      ->paginate($request->get('per_page', 15));

        return response()->json($leads);
    }

    /**
     * Store a new lead
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'nullable|email|max:100',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string',
            'needs' => 'nullable|string',
            'source' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
        ]);

        $lead = Lead::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'address' => $request->address,
            'needs' => $request->needs,
            'source' => $request->source,
            'notes' => $request->notes,
            'status' => 'new',
            'sales_id' => $request->user()->id,
        ]);

        return response()->json($lead->load('sales'), 201);
    }

    /**
     * Display the specified lead
     */
    public function show(Request $request, Lead $lead)
    {
        // Check access permission
        if ($request->user()->isSales() && $lead->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        return response()->json($lead->load(['sales', 'deals.items.product', 'customer']));
    }

    /**
     * Update the specified lead
     */
    public function update(Request $request, Lead $lead)
    {
        // Check access permission
        if ($request->user()->isSales() && $lead->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|nullable|email|max:100',
            'phone' => 'sometimes|nullable|string|max:50',
            'address' => 'sometimes|nullable|string',
            'needs' => 'sometimes|nullable|string',
            'status' => 'sometimes|required|in:new,contacted,qualified,proposal,negotiation,closed_won,closed_lost',
            'source' => 'sometimes|nullable|string|max:100',
            'notes' => 'sometimes|nullable|string',
        ]);

        $lead->update($request->only([
            'name', 'email', 'phone', 'address', 'needs', 'status', 'source', 'notes'
        ]));

        return response()->json($lead->load('sales'));
    }

    /**
     * Remove the specified lead
     */
    public function destroy(Request $request, Lead $lead)
    {
        // Check access permission
        if ($request->user()->isSales() && $lead->sales_id !== $request->user()->id) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        // Check if lead has deals
        if ($lead->deals()->exists()) {
            return response()->json([
                'message' => 'Cannot delete lead with existing deals'
            ], 422);
        }

        $lead->delete();

        return response()->json([
            'message' => 'Lead deleted successfully'
        ]);
    }

    /**
     * Get lead statistics
     */
    public function stats(Request $request)
    {
        $query = Lead::query();

        // Role-based filtering
        if ($request->user()->isSales()) {
            $query->where('sales_id', $request->user()->id);
        }

        $stats = [
            'total' => $query->count(),
            'new' => $query->where('status', 'new')->count(),
            'contacted' => $query->where('status', 'contacted')->count(),
            'qualified' => $query->where('status', 'qualified')->count(),
            'proposal' => $query->where('status', 'proposal')->count(),
            'negotiation' => $query->where('status', 'negotiation')->count(),
            'closed_won' => $query->where('status', 'closed_won')->count(),
            'closed_lost' => $query->where('status', 'closed_lost')->count(),
        ];

        return response()->json($stats);
    }
}
