<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * Login user and create token
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        // Check if user account is active
        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['Your account has been deactivated. Please contact administrator.'],
            ]);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->formatUserData($user),
            'permissions' => $this->getUserPermissions($user),
        ]);
    }

    /**
     * Logout user (revoke token)
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Get current user
     */
    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => $this->formatUserData($user),
            'permissions' => $this->getUserPermissions($user),
            'stats' => $this->getUserStats($user),
        ]);
    }

    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|email|max:255|unique:users,email,' . $request->user()->id,
            'current_password' => 'required_with:password',
            'password' => 'nullable|min:8|confirmed',
        ]);

        $user = $request->user();

        // Verify current password if changing password
        if ($request->password) {
            if (!Hash::check($request->current_password, $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['The current password is incorrect.'],
                ]);
            }
        }

        $user->update([
            'name' => $request->name ?? $user->name,
            'email' => $request->email ?? $user->email,
            'password' => $request->password ? Hash::make($request->password) : $user->password,
        ]);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $this->formatUserData($user->fresh()),
        ]);
    }

    /**
     * Format user data for API response
     */
    private function formatUserData(User $user)
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'is_active' => $user->is_active,
            'email_verified_at' => $user->email_verified_at,
            'created_at' => $user->created_at,
            'updated_at' => $user->updated_at,
        ];
    }

    /**
     * Get user permissions based on role
     */
    private function getUserPermissions(User $user)
    {
        $permissions = [
            'can_view_leads' => true,
            'can_create_leads' => true,
            'can_view_deals' => true,
            'can_create_deals' => true,
            'can_view_customers' => true,
            'can_view_products' => true,
        ];

        if ($user->isManager()) {
            $permissions = array_merge($permissions, [
                'can_view_all_leads' => true,
                'can_view_all_deals' => true,
                'can_view_all_customers' => true,
                'can_approve_deals' => true,
                'can_manage_products' => true,
                'can_manage_users' => true,
                'can_view_reports' => true,
                'can_export_data' => true,
            ]);
        } else {
            $permissions = array_merge($permissions, [
                'can_view_all_leads' => false,
                'can_view_all_deals' => false,
                'can_view_all_customers' => false,
                'can_approve_deals' => false,
                'can_manage_products' => false,
                'can_manage_users' => false,
                'can_view_reports' => false,
                'can_export_data' => false,
            ]);
        }

        return $permissions;
    }

    /**
     * Get user statistics
     */
    private function getUserStats(User $user)
    {
        if ($user->isSales()) {
            return [
                'total_leads' => $user->leads()->count(),
                'qualified_leads' => $user->leads()->where('status', 'qualified')->count(),
                'total_deals' => $user->deals()->count(),
                'won_deals' => $user->deals()->where('status', 'closed_won')->count(),
                'total_customers' => $user->customers()->count(),
                'this_month_revenue' => $user->deals()
                    ->where('status', 'closed_won')
                    ->whereMonth('updated_at', now()->month)
                    ->whereYear('updated_at', now()->year)
                    ->sum('final_amount'),
            ];
        }

        if ($user->isManager()) {
            return [
                'total_leads' => \App\Models\Lead::count(),
                'total_deals' => \App\Models\Deal::count(),
                'total_customers' => \App\Models\Customer::count(),
                'pending_approvals' => \App\Models\Deal::where('status', 'waiting_approval')->count(),
                'this_month_revenue' => \App\Models\Deal::where('status', 'closed_won')
                    ->whereMonth('updated_at', now()->month)
                    ->whereYear('updated_at', now()->year)
                    ->sum('final_amount'),
            ];
        }

        return [];
    }
}
