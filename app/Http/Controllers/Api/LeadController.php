<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class LeadController extends Controller
{
    /**
     * Display a listing of leads
     */
    public function index(Request $request): JsonResponse
    {
        $user = Auth::user();
        $query = Lead::with('owner');

        // Sales can only see their own leads, managers can see all
        if ($user->isSales()) {
            $query->ownedBy($user->id);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $query->withStatus($request->status);
        }

        // Search functionality
        if ($request->has('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('contact', 'like', "%{$searchTerm}%")
                  ->orWhere('address', 'like', "%{$searchTerm}%");
            });
        }

        $leads = $query->orderBy('created_at', 'desc')->paginate(15);

        return response()->json($leads);
    }

    /**
     * Store a newly created lead
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'contact' => 'required|string|max:50',
            'address' => 'required|string|max:255',
            'kebutuhan' => 'required|string|max:255',
            'status' => 'in:new,contacted,qualified,lost',
        ]);

        $lead = Lead::create([
            'name' => $request->name,
            'contact' => $request->contact,
            'address' => $request->address,
            'kebutuhan' => $request->kebutuhan,
            'status' => $request->status ?? 'new',
            'owner_user_id' => Auth::id(),
        ]);

        $lead->load('owner');

        return response()->json($lead, 201);
    }

    /**
     * Display the specified lead
     */
    public function show(Lead $lead): JsonResponse
    {
        $user = Auth::user();

        // Check ownership for sales users
        if ($user->isSales() && $lead->owner_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $lead->load(['owner', 'deals.items.product', 'customer']);

        return response()->json($lead);
    }

    /**
     * Update the specified lead
     */
    public function update(Request $request, Lead $lead): JsonResponse
    {
        $user = Auth::user();

        // Check ownership for sales users
        if ($user->isSales() && $lead->owner_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'string|max:100',
            'contact' => 'string|max:50',
            'address' => 'string|max:255',
            'kebutuhan' => 'string|max:255',
            'status' => 'in:new,contacted,qualified,lost',
        ]);

        $lead->update($request->only([
            'name', 'contact', 'address', 'kebutuhan', 'status'
        ]));

        $lead->load('owner');

        return response()->json($lead);
    }

    /**
     * Remove the specified lead
     */
    public function destroy(Lead $lead): JsonResponse
    {
        $user = Auth::user();

        // Check ownership for sales users
        if ($user->isSales() && $lead->owner_user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Check if lead has related deals
        if ($lead->deals()->exists()) {
            return response()->json([
                'message' => 'Cannot delete lead with existing deals'
            ], 422);
        }

        $lead->delete();

        return response()->json(['message' => 'Lead deleted successfully']);
    }

    /**
     * Get lead statistics
     */
    public function stats(): JsonResponse
    {
        $user = Auth::user();
        $query = Lead::query();

        if ($user->isSales()) {
            $query->ownedBy($user->id);
        }

        $stats = [
            'total' => $query->count(),
            'new' => $query->clone()->withStatus('new')->count(),
            'contacted' => $query->clone()->withStatus('contacted')->count(),
            'qualified' => $query->clone()->withStatus('qualified')->count(),
            'lost' => $query->clone()->withStatus('lost')->count(),
        ];

        return response()->json($stats);
    }
}
