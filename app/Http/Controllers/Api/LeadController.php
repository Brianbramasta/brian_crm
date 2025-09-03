<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;

class LeadController extends Controller
{
    /**
     * Get all leads (or user's leads if sales role)
     */
    public function index(Request $request)
    {
        $query = Lead::with('owner');

        // If user is sales, only show their leads
        if ($request->user()->role === 'sales') {
            $query->where('owner_user_id', $request->user()->id);
        }

        $leads = $query->orderBy('created_at', 'desc')->get();

        return response()->json($leads);
    }

    /**
     * Get lead by ID
     */
    public function show(Request $request, Lead $lead)
    {
        // Check permissions
        if ($request->user()->role === 'sales' && $lead->owner_user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($lead->load('owner', 'deals'));
    }

    /**
     * Create a new lead
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'contact' => 'required|string|max:50',
            'address' => 'required|string|max:255',
            'kebutuhan' => 'required|string|max:255',
            'status' => 'sometimes|in:new,contacted,qualified,lost',
        ]);

        $lead = Lead::create([
            'name' => $request->name,
            'contact' => $request->contact,
            'address' => $request->address,
            'kebutuhan' => $request->kebutuhan,
            'status' => $request->status ?? 'new',
            'owner_user_id' => $request->user()->id,
        ]);

        return response()->json($lead->load('owner'), 201);
    }

    /**
     * Update a lead
     */
    public function update(Request $request, Lead $lead)
    {
        // Check permissions
        if ($request->user()->role === 'sales' && $lead->owner_user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:100',
            'contact' => 'sometimes|required|string|max:50',
            'address' => 'sometimes|required|string|max:255',
            'kebutuhan' => 'sometimes|required|string|max:255',
            'status' => 'sometimes|in:new,contacted,qualified,lost',
            'owner_user_id' => 'sometimes|exists:users,id',
        ]);

        // Only managers can reassign leads
        if ($request->has('owner_user_id') && $request->user()->role !== 'manager') {
            return response()->json(['message' => 'Only managers can reassign leads'], 403);
        }

        $lead->update($request->only(['name', 'contact', 'address', 'kebutuhan', 'status', 'owner_user_id']));

        return response()->json($lead->load('owner'));
    }

    /**
     * Delete a lead
     */
    public function destroy(Request $request, Lead $lead)
    {
        // Check permissions
        if ($request->user()->role === 'sales' && $lead->owner_user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $lead->delete();

        return response()->json([
            'message' => 'Lead deleted successfully'
        ]);
    }
}
