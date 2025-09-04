<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Lead;
use App\Models\Deal;
use App\Models\Customer;
use App\Models\CustomerService;
use App\Models\User;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Get dashboard summary data
     */
    public function dashboard(Request $request)
    {
        $user = $request->user();

        // Base queries with role-based filtering
        $leadsQuery = Lead::query();
        $dealsQuery = Deal::query();
        $customersQuery = Customer::query();
        $servicesQuery = CustomerService::whereHas('customer', function ($q) use ($user) {
            if ($user->isSales()) {
                $q->where('sales_id', $user->id);
            }
        });

        if ($user->isSales()) {
            $leadsQuery->where('sales_id', $user->id);
            $dealsQuery->where('sales_id', $user->id);
            $customersQuery->where('sales_id', $user->id);
        }

        // Leads statistics
        $leadsStats = [
            'total' => $leadsQuery->count(),
            'new_this_month' => $leadsQuery->whereMonth('created_at', now()->month)->count(),
            'by_status' => [
                'new' => $leadsQuery->where('status', 'new')->count(),
                'contacted' => $leadsQuery->where('status', 'contacted')->count(),
                'qualified' => $leadsQuery->where('status', 'qualified')->count(),
                'proposal' => $leadsQuery->where('status', 'proposal')->count(),
                'negotiation' => $leadsQuery->where('status', 'negotiation')->count(),
                'closed_won' => $leadsQuery->where('status', 'closed_won')->count(),
                'closed_lost' => $leadsQuery->where('status', 'closed_lost')->count(),
            ]
        ];

        // Deals statistics
        $dealsStats = [
            'total' => $dealsQuery->count(),
            'waiting_approval' => $dealsQuery->where('status', 'waiting_approval')->count(),
            'approved' => $dealsQuery->where('status', 'approved')->count(),
            'rejected' => $dealsQuery->where('status', 'rejected')->count(),
            'closed_won' => $dealsQuery->where('status', 'closed_won')->count(),
            'total_value' => $dealsQuery->where('status', 'approved')->sum('final_amount'),
            'pending_value' => $dealsQuery->where('status', 'waiting_approval')->sum('final_amount'),
        ];

        // Customers statistics
        $customersStats = [
            'total' => $customersQuery->count(),
            'active' => $customersQuery->where('status', 'active')->count(),
            'new_this_month' => $customersQuery->whereMonth('created_at', now()->month)->count(),
            'corporate' => $customersQuery->where('customer_type', 'corporate')->count(),
            'individual' => $customersQuery->where('customer_type', 'individual')->count(),
        ];

        // Revenue statistics
        $activeServices = $servicesQuery->where('status', 'active');
        $revenueStats = [
            'monthly_recurring_revenue' => $activeServices->sum('monthly_fee'),
            'active_services' => $activeServices->count(),
            'average_revenue_per_customer' => $customersQuery->count() > 0 ?
                $activeServices->sum('monthly_fee') / $customersQuery->count() : 0,
        ];

        // Recent activities
        $recentActivities = [];

        // Recent leads
        $recentLeads = $leadsQuery->latest()->limit(3)->get();
        foreach ($recentLeads as $lead) {
            $recentActivities[] = [
                'type' => 'lead_created',
                'description' => "New lead created: {$lead->name}",
                'created_at' => $lead->created_at,
                'entity_id' => $lead->id,
            ];
        }

        // Recent deals
        $recentDeals = $dealsQuery->latest()->limit(3)->get();
        foreach ($recentDeals as $deal) {
            $recentActivities[] = [
                'type' => 'deal_created',
                'description' => "Deal created: {$deal->title}",
                'created_at' => $deal->created_at,
                'entity_id' => $deal->id,
            ];
        }

        // Recent customers
        $recentCustomers = $customersQuery->latest()->limit(2)->get();
        foreach ($recentCustomers as $customer) {
            $recentActivities[] = [
                'type' => 'customer_added',
                'description' => "New customer: {$customer->name}",
                'created_at' => $customer->created_at,
                'entity_id' => $customer->id,
            ];
        }

        // Sort recent activities by date
        usort($recentActivities, function ($a, $b) {
            return $b['created_at'] <=> $a['created_at'];
        });

        $recentActivities = array_slice($recentActivities, 0, 8);

        return response()->json([
            'leads' => $leadsStats,
            'deals' => $dealsStats,
            'customers' => $customersStats,
            'revenue' => $revenueStats,
            'recent_activities' => $recentActivities,
        ]);
    }

    /**
     * Get sales report with filtering
     */
    public function sales(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'sales_id' => 'sometimes|exists:users,id',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $user = $request->user();

        // Base query for the period
        $leadsQuery = Lead::whereBetween('created_at', [$startDate, $endDate]);
        $dealsQuery = Deal::whereBetween('created_at', [$startDate, $endDate]);
        $customersQuery = Customer::whereBetween('created_at', [$startDate, $endDate]);

        // Apply role-based and sales_id filtering
        if ($user->isSales()) {
            $leadsQuery->where('sales_id', $user->id);
            $dealsQuery->where('sales_id', $user->id);
            $customersQuery->where('sales_id', $user->id);
        } elseif ($request->has('sales_id')) {
            $leadsQuery->where('sales_id', $request->sales_id);
            $dealsQuery->where('sales_id', $request->sales_id);
            $customersQuery->where('sales_id', $request->sales_id);
        }

        // Summary statistics
        $summary = [
            'period' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
            'total_leads' => $leadsQuery->count(),
            'total_deals' => $dealsQuery->count(),
            'total_customers' => $customersQuery->count(),
            'total_revenue' => $dealsQuery->where('status', 'approved')->sum('final_amount'),
            'conversion_rate' => $leadsQuery->count() > 0 ?
                ($leadsQuery->where('status', 'closed_won')->count() / $leadsQuery->count()) * 100 : 0,
        ];

        // By sales person (if manager)
        $bySales = [];
        if ($user->isManager()) {
            $salesUsers = User::where('role', 'sales')->get();

            foreach ($salesUsers as $sales) {
                $salesLeads = Lead::where('sales_id', $sales->id)
                                ->whereBetween('created_at', [$startDate, $endDate]);
                $salesDeals = Deal::where('sales_id', $sales->id)
                                ->whereBetween('created_at', [$startDate, $endDate]);
                $salesCustomers = Customer::where('sales_id', $sales->id)
                                        ->whereBetween('created_at', [$startDate, $endDate]);

                $bySales[] = [
                    'sales_id' => $sales->id,
                    'sales_name' => $sales->name,
                    'leads_count' => $salesLeads->count(),
                    'deals_count' => $salesDeals->count(),
                    'customers_count' => $salesCustomers->count(),
                    'revenue' => $salesDeals->where('status', 'approved')->sum('final_amount'),
                    'conversion_rate' => $salesLeads->count() > 0 ?
                        ($salesLeads->where('status', 'closed_won')->count() / $salesLeads->count()) * 100 : 0,
                ];
            }
        }

        return response()->json([
            'summary' => $summary,
            'by_sales' => $bySales,
        ]);
    }

    /**
     * Get revenue trends
     */
    public function revenueTrends(Request $request)
    {
        $request->validate([
            'period' => 'sometimes|in:7_days,30_days,90_days,12_months',
        ]);

        $period = $request->get('period', '30_days');
        $user = $request->user();

        switch ($period) {
            case '7_days':
                $days = 7;
                $format = 'Y-m-d';
                break;
            case '90_days':
                $days = 90;
                $format = 'Y-m-d';
                break;
            case '12_months':
                $days = 365;
                $format = 'Y-m';
                break;
            default:
                $days = 30;
                $format = 'Y-m-d';
        }

        $startDate = now()->subDays($days);

        // Get deals closed in the period
        $dealsQuery = Deal::where('status', 'closed_won')
                         ->whereBetween('closed_at', [$startDate, now()]);

        if ($user->isSales()) {
            $dealsQuery->where('sales_id', $user->id);
        }

        $deals = $dealsQuery->get();

        // Group by date/month
        $trends = [];
        $deals->groupBy(function ($deal) use ($format) {
            return $deal->closed_at->format($format);
        })->each(function ($group, $date) use (&$trends) {
            $trends[] = [
                'period' => $date,
                'revenue' => $group->sum('final_amount'),
                'deals_count' => $group->count(),
            ];
        });

        return response()->json($trends);
    }

    /**
     * Export report (placeholder for Excel export)
     */
    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required|in:sales,leads,customers,deals',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'sales_id' => 'sometimes|exists:users,id',
        ]);

        // This is a placeholder - in a real implementation, you would use
        // a package like Laravel Excel to generate actual Excel files

        $type = $request->type;
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $user = $request->user();

        $data = [];

        switch ($type) {
            case 'leads':
                $query = Lead::whereBetween('created_at', [$startDate, $endDate]);
                if ($user->isSales()) {
                    $query->where('sales_id', $user->id);
                } elseif ($request->has('sales_id')) {
                    $query->where('sales_id', $request->sales_id);
                }
                $data = $query->with('sales')->get()->map(function ($lead) {
                    return [
                        'Name' => $lead->name,
                        'Email' => $lead->email,
                        'Phone' => $lead->phone,
                        'Status' => $lead->status,
                        'Sales Person' => $lead->sales->name,
                        'Created Date' => $lead->created_at->format('Y-m-d'),
                    ];
                });
                break;

            case 'deals':
                $query = Deal::whereBetween('created_at', [$startDate, $endDate]);
                if ($user->isSales()) {
                    $query->where('sales_id', $user->id);
                } elseif ($request->has('sales_id')) {
                    $query->where('sales_id', $request->sales_id);
                }
                $data = $query->with(['lead', 'sales'])->get()->map(function ($deal) {
                    return [
                        'Deal Number' => $deal->deal_number,
                        'Title' => $deal->title,
                        'Lead Name' => $deal->lead->name,
                        'Status' => $deal->status,
                        'Total Amount' => $deal->final_amount,
                        'Sales Person' => $deal->sales->name,
                        'Created Date' => $deal->created_at->format('Y-m-d'),
                    ];
                });
                break;

            case 'customers':
                $query = Customer::whereBetween('created_at', [$startDate, $endDate]);
                if ($user->isSales()) {
                    $query->where('sales_id', $user->id);
                } elseif ($request->has('sales_id')) {
                    $query->where('sales_id', $request->sales_id);
                }
                $data = $query->with('sales')->get()->map(function ($customer) {
                    return [
                        'Customer Number' => $customer->customer_number,
                        'Name' => $customer->name,
                        'Email' => $customer->email,
                        'Phone' => $customer->phone,
                        'Type' => $customer->customer_type,
                        'Status' => $customer->status,
                        'Sales Person' => $customer->sales->name,
                        'Activation Date' => $customer->activation_date,
                    ];
                });
                break;
        }

        // In a real implementation, return Excel file download
        // For now, return JSON data that could be converted to Excel on frontend
        return response()->json([
            'type' => $type,
            'period' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
            'data' => $data,
            'total_records' => count($data),
            'generated_at' => now()->format('Y-m-d H:i:s'),
        ]);
    }

    /**
     * Get performance metrics
     */
    public function performance(Request $request)
    {
        $user = $request->user();
        $currentMonth = now();
        $lastMonth = now()->subMonth();

        // Current month metrics
        $currentMetrics = $this->getMonthMetrics($currentMonth, $user);
        $lastMonthMetrics = $this->getMonthMetrics($lastMonth, $user);

        // Calculate growth percentages
        $metrics = [
            'leads' => [
                'current' => $currentMetrics['leads'],
                'previous' => $lastMonthMetrics['leads'],
                'growth' => $this->calculateGrowth($lastMonthMetrics['leads'], $currentMetrics['leads']),
            ],
            'deals' => [
                'current' => $currentMetrics['deals'],
                'previous' => $lastMonthMetrics['deals'],
                'growth' => $this->calculateGrowth($lastMonthMetrics['deals'], $currentMetrics['deals']),
            ],
            'customers' => [
                'current' => $currentMetrics['customers'],
                'previous' => $lastMonthMetrics['customers'],
                'growth' => $this->calculateGrowth($lastMonthMetrics['customers'], $currentMetrics['customers']),
            ],
            'revenue' => [
                'current' => $currentMetrics['revenue'],
                'previous' => $lastMonthMetrics['revenue'],
                'growth' => $this->calculateGrowth($lastMonthMetrics['revenue'], $currentMetrics['revenue']),
            ],
        ];

        return response()->json($metrics);
    }

    private function getMonthMetrics($month, $user)
    {
        $leadsQuery = Lead::whereMonth('created_at', $month->month)
                         ->whereYear('created_at', $month->year);
        $dealsQuery = Deal::whereMonth('created_at', $month->month)
                         ->whereYear('created_at', $month->year);
        $customersQuery = Customer::whereMonth('created_at', $month->month)
                                ->whereYear('created_at', $month->year);

        if ($user->isSales()) {
            $leadsQuery->where('sales_id', $user->id);
            $dealsQuery->where('sales_id', $user->id);
            $customersQuery->where('sales_id', $user->id);
        }

        return [
            'leads' => $leadsQuery->count(),
            'deals' => $dealsQuery->count(),
            'customers' => $customersQuery->count(),
            'revenue' => $dealsQuery->where('status', 'approved')->sum('final_amount'),
        ];
    }

    private function calculateGrowth($previous, $current)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round((($current - $previous) / $previous) * 100, 2);
    }
}
