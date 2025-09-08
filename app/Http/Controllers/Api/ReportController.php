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
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\LeadsExport;
use App\Exports\DealsExport;
use App\Exports\CustomersExport;
use App\Exports\SalesReportExport;

class ReportController extends Controller
{
    /**
     * Get dashboard summary data
     */
    public function dashboard(Request $request)
    {
        $request->validate([
            'start_date' => 'sometimes|date',
            'end_date' => 'sometimes|date|after_or_equal:start_date',
            'period' => 'sometimes|in:week,month,quarter,year',
        ]);

        $user = $request->user();

        // Determine date range based on parameters
        if ($request->has('start_date') && $request->has('end_date')) {
            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);
        } else {
            // Use period-based date range (default to current month)
            $period = $request->get('period', 'month');
            switch ($period) {
                case 'week':
                    $startDate = now()->startOfWeek();
                    $endDate = now()->endOfWeek();
                    break;
                case 'quarter':
                    $startDate = now()->startOfQuarter();
                    $endDate = now()->endOfQuarter();
                    break;
                case 'year':
                    $startDate = now()->startOfYear();
                    $endDate = now()->endOfYear();
                    break;
                default: // month
                    $startDate = now()->startOfMonth();
                    $endDate = now()->endOfMonth();
            }
        }

        // Base queries with role-based and date filtering
        $leadsQuery = Lead::whereBetween('created_at', [$startDate, $endDate]);
        $dealsQuery = Deal::whereBetween('created_at', [$startDate, $endDate]);
        $customersQuery = Customer::whereBetween('created_at', [$startDate, $endDate]);
        $servicesQuery = CustomerService::whereHas('customer', function ($q) use ($user, $startDate, $endDate) {
            $q->whereBetween('created_at', [$startDate, $endDate]);
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
        $totalLeads = $leadsQuery->count();
        $leadsStats = [
            'total' => $totalLeads,
            'new_this_period' => $totalLeads, // All leads in the selected period are "new" for this period
            'by_status' => [
                'new' => (clone $leadsQuery)->where('status', 'new')->count(),
                'contacted' => (clone $leadsQuery)->where('status', 'contacted')->count(),
                'qualified' => (clone $leadsQuery)->where('status', 'qualified')->count(),
                'proposal' => (clone $leadsQuery)->where('status', 'proposal')->count(),
                'negotiation' => (clone $leadsQuery)->where('status', 'negotiation')->count(),
                'closed_won' => (clone $leadsQuery)->where('status', 'closed_won')->count(),
                'closed_lost' => (clone $leadsQuery)->where('status', 'closed_lost')->count(),
            ]
        ];

        // Deals statistics
        $totalDeals = $dealsQuery->count();
        $dealsStats = [
            'total' => $totalDeals,
            'waiting_approval' => (clone $dealsQuery)->where('status', 'waiting_approval')->count(),
            'approved' => (clone $dealsQuery)->where('status', 'approved')->count(),
            'rejected' => (clone $dealsQuery)->where('status', 'rejected')->count(),
            'closed_won' => (clone $dealsQuery)->where('status', 'closed_won')->count(),
            'total_value' => (clone $dealsQuery)->where('status', 'approved')->sum('final_amount'),
            'pending_value' => (clone $dealsQuery)->where('status', 'waiting_approval')->sum('final_amount'),
        ];

        // Customers statistics
        $totalCustomers = $customersQuery->count();
        $customersStats = [
            'total' => $totalCustomers,
            'active' => (clone $customersQuery)->where('status', 'active')->count(),
            'new_this_period' => $totalCustomers, // All customers in the selected period are "new" for this period
            'corporate' => (clone $customersQuery)->where('customer_type', 'corporate')->count(),
            'individual' => (clone $customersQuery)->where('customer_type', 'individual')->count(),
        ];

        // Revenue statistics
        $activeServices = $servicesQuery->where('status', 'active');
        $totalRevenue = (clone $dealsQuery)->where('status', 'approved')->sum('final_amount');
        $conversionRate = $totalLeads > 0 ? ((clone $leadsQuery)->where('status', 'closed_won')->count() / $totalLeads) * 100 : 0;

        $revenueStats = [
            'monthly_recurring_revenue' => $activeServices->sum('monthly_fee'),
            'active_services' => $activeServices->count(),
            'average_revenue_per_customer' => $totalCustomers > 0 ? $totalRevenue / $totalCustomers : 0,
            'total_revenue' => $totalRevenue,
        ];

        // Recent activities (filtered by date range)
        $recentActivities = [];

        // Recent leads
        $recentLeads = (clone $leadsQuery)->latest()->limit(3)->get();
        foreach ($recentLeads as $lead) {
            $recentActivities[] = [
                'type' => 'lead_created',
                'description' => "New lead created: {$lead->name}",
                'created_at' => $lead->created_at,
                'entity_id' => $lead->id,
            ];
        }

        // Recent deals
        $recentDeals = (clone $dealsQuery)->latest()->limit(3)->get();
        foreach ($recentDeals as $deal) {
            $recentActivities[] = [
                'type' => 'deal_created',
                'description' => "Deal created: {$deal->title}",
                'created_at' => $deal->created_at,
                'entity_id' => $deal->id,
            ];
        }

        // Recent customers
        $recentCustomers = (clone $customersQuery)->latest()->limit(2)->get();
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
            // Frontend expected fields
            'totalRevenue' => $totalRevenue,
            'totalCustomers' => $totalCustomers,
            'totalLeads' => $totalLeads,
            'activeServices' => $activeServices->count(),
            'conversionRate' => round($conversionRate, 2),
            'avgDealValue' => $totalDeals > 0 ? $totalRevenue / $totalDeals : 0,
            'monthlyGrowth' => 0, // TODO: Calculate actual growth
            'customerRetention' => 0, // TODO: Calculate actual retention
            'newLeads' => $totalLeads,
            'period' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
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
        $totalLeads = $leadsQuery->count();
        $totalDeals = $dealsQuery->count();
        $totalCustomers = $customersQuery->count();
        $totalRevenue = (clone $dealsQuery)->where('status', 'approved')->sum('final_amount');
        $closedWonLeads = (clone $leadsQuery)->where('status', 'closed_won')->count();

        $summary = [
            'period' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ],
            'total_leads' => $totalLeads,
            'total_deals' => $totalDeals,
            'total_customers' => $totalCustomers,
            'total_revenue' => $totalRevenue,
            'conversion_rate' => $totalLeads > 0 ? ($closedWonLeads / $totalLeads) * 100 : 0,
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

                $leadsCount = $salesLeads->count();
                $dealsCount = $salesDeals->count();
                $customersCount = $salesCustomers->count();
                $revenue = (clone $salesDeals)->where('status', 'approved')->sum('final_amount');
                $closedWonCount = (clone $salesLeads)->where('status', 'closed_won')->count();

                $bySales[] = [
                    'sales_id' => $sales->id,
                    'sales_name' => $sales->name,
                    'leads_count' => $leadsCount,
                    'deals_count' => $dealsCount,
                    'customers_count' => $customersCount,
                    'revenue' => $revenue,
                    'conversion_rate' => $leadsCount > 0 ? ($closedWonCount / $leadsCount) * 100 : 0,
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
     * Export report to Excel
     */
    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required|in:sales,leads,customers,deals',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'sales_id' => 'sometimes|exists:users,id',
        ]);

        $type = $request->type;
        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);
        $user = $request->user();

        // Generate filename with timestamp
        $timestamp = now()->format('Y-m-d_H-i-s');
        $filename = "{$type}_report_{$timestamp}.xlsx";

        switch ($type) {
            case 'leads':
                $query = Lead::with('sales')->whereBetween('created_at', [$startDate, $endDate]);
                if ($user->isSales()) {
                    $query->where('sales_id', $user->id);
                } elseif ($request->has('sales_id')) {
                    $query->where('sales_id', $request->sales_id);
                }
                $data = $query->get();
                $export = new LeadsExport($data, 'Laporan Leads', $startDate, $endDate, $user);
                break;

            case 'deals':
                $query = Deal::with(['lead', 'sales', 'approver'])->whereBetween('created_at', [$startDate, $endDate]);
                if ($user->isSales()) {
                    $query->where('sales_id', $user->id);
                } elseif ($request->has('sales_id')) {
                    $query->where('sales_id', $request->sales_id);
                }
                $data = $query->get();
                $export = new DealsExport($data, 'Laporan Deals', $startDate, $endDate, $user);
                break;

            case 'customers':
                $query = Customer::with(['sales', 'lead'])->whereBetween('created_at', [$startDate, $endDate]);
                if ($user->isSales()) {
                    $query->where('sales_id', $user->id);
                } elseif ($request->has('sales_id')) {
                    $query->where('sales_id', $request->sales_id);
                }
                $data = $query->get();
                $export = new CustomersExport($data, 'Laporan Customers', $startDate, $endDate, $user);
                break;

            case 'sales':
                // Generate sales report data
                $salesReport = $this->sales($request);
                $reportData = $salesReport->getData(true); // Convert to array

                $export = new SalesReportExport(
                    $reportData['by_sales'],
                    $reportData['summary'],
                    'Laporan Performance Sales',
                    $startDate,
                    $endDate,
                    $user
                );
                break;

            default:
                return response()->json(['message' => 'Invalid report type'], 400);
        }

        return Excel::download($export, $filename);
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
            'revenue' => (clone $dealsQuery)->where('status', 'approved')->sum('final_amount'),
        ];
    }

    private function calculateGrowth($previous, $current)
    {
        if ($previous == 0) {
            return $current > 0 ? 100 : 0;
        }

        return round((($current - $previous) / $previous) * 100, 2);
    }

    /**
     * Alias for sales method (for salesReport route)
     */
    public function salesReport(Request $request)
    {
        return $this->sales($request);
    }

    /**
     * Alias for revenueTrends method (for revenueReport route)
     */
    public function revenueReport(Request $request)
    {
        return $this->revenueTrends($request);
    }

    /**
     * Alias for performance method (for performanceReport route)
     */
    public function performanceReport(Request $request)
    {
        return $this->performance($request);
    }

    /**
     * Alias for export method (for exportData route)
     */
    public function exportData(Request $request)
    {
        return $this->export($request);
    }

    /**
     * Get lead conversion analytics
     */
    public function leadConversion(Request $request)
    {
        $request->validate([
            'period' => 'sometimes|in:week,month,quarter,year',
        ]);

        $period = $request->get('period', 'month');
        $user = $request->user();

        // Define date range based on period
        switch ($period) {
            case 'week':
                $startDate = now()->startOfWeek();
                $endDate = now()->endOfWeek();
                break;
            case 'quarter':
                $startDate = now()->startOfQuarter();
                $endDate = now()->endOfQuarter();
                break;
            case 'year':
                $startDate = now()->startOfYear();
                $endDate = now()->endOfYear();
                break;
            default:
                $startDate = now()->startOfMonth();
                $endDate = now()->endOfMonth();
        }

        $leadsQuery = Lead::whereBetween('created_at', [$startDate, $endDate]);
        if ($user->isSales()) {
            $leadsQuery->where('sales_id', $user->id);
        }

        $totalLeads = $leadsQuery->count();
        $convertedLeads = (clone $leadsQuery)->where('status', 'closed_won')->count();
        $conversionRate = $totalLeads > 0 ? ($convertedLeads / $totalLeads) * 100 : 0;

        // Conversion funnel by status
        $funnel = [
            'new' => (clone $leadsQuery)->where('status', 'new')->count(),
            'contacted' => (clone $leadsQuery)->where('status', 'contacted')->count(),
            'qualified' => (clone $leadsQuery)->where('status', 'qualified')->count(),
            'proposal' => (clone $leadsQuery)->where('status', 'proposal')->count(),
            'negotiation' => (clone $leadsQuery)->where('status', 'negotiation')->count(),
            'closed_won' => $convertedLeads,
            'closed_lost' => (clone $leadsQuery)->where('status', 'closed_lost')->count(),
        ];

        return response()->json([
            'period' => $period,
            'date_range' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'total_leads' => $totalLeads,
            'converted_leads' => $convertedLeads,
            'conversion_rate' => round($conversionRate, 2),
            'funnel' => $funnel,
        ]);
    }

    /**
     * Get sales performance by user
     */
    public function salesPerformance(Request $request)
    {
        $request->validate([
            'period' => 'sometimes|in:week,month,quarter,year',
        ]);

        $period = $request->get('period', 'month');
        $user = $request->user();

        // Only managers can see all sales performance
        if ($user->isSales()) {
            return response()->json(['message' => 'Access denied'], 403);
        }

        // Define date range
        switch ($period) {
            case 'week':
                $startDate = now()->startOfWeek();
                $endDate = now()->endOfWeek();
                break;
            case 'quarter':
                $startDate = now()->startOfQuarter();
                $endDate = now()->endOfQuarter();
                break;
            case 'year':
                $startDate = now()->startOfYear();
                $endDate = now()->endOfYear();
                break;
            default:
                $startDate = now()->startOfMonth();
                $endDate = now()->endOfMonth();
        }

        $salesUsers = User::where('role', 'sales')->get();
        $performance = [];

        foreach ($salesUsers as $sales) {
            $leadsCount = Lead::where('sales_id', $sales->id)
                             ->whereBetween('created_at', [$startDate, $endDate])
                             ->count();

            $dealsCount = Deal::where('sales_id', $sales->id)
                             ->whereBetween('created_at', [$startDate, $endDate])
                             ->count();

            $customersCount = Customer::where('sales_id', $sales->id)
                                     ->whereBetween('created_at', [$startDate, $endDate])
                                     ->count();

            $revenue = Deal::where('sales_id', $sales->id)
                          ->where('status', 'closed_won')
                          ->whereBetween('updated_at', [$startDate, $endDate])
                          ->sum('final_amount');

            $performance[] = [
                'sales_id' => $sales->id,
                'sales_name' => $sales->name,
                'leads' => $leadsCount,
                'deals' => $dealsCount,
                'customers' => $customersCount,
                'revenue' => $revenue,
                'conversion_rate' => $leadsCount > 0 ? ($customersCount / $leadsCount) * 100 : 0,
            ];
        }

        // Sort by revenue descending
        usort($performance, function ($a, $b) {
            return $b['revenue'] <=> $a['revenue'];
        });

        return response()->json([
            'period' => $period,
            'date_range' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'performance' => $performance,
        ]);
    }

    /**
     * Get product performance
     */
    public function productPerformance(Request $request)
    {
        $request->validate([
            'period' => 'sometimes|in:week,month,quarter,year',
        ]);

        $period = $request->get('period', 'month');
        $user = $request->user();

        // Define date range
        switch ($period) {
            case 'week':
                $startDate = now()->startOfWeek();
                $endDate = now()->endOfWeek();
                break;
            case 'quarter':
                $startDate = now()->startOfQuarter();
                $endDate = now()->endOfQuarter();
                break;
            case 'year':
                $startDate = now()->startOfYear();
                $endDate = now()->endOfYear();
                break;
            default:
                $startDate = now()->startOfMonth();
                $endDate = now()->endOfMonth();
        }

        // Get products and their performance
        $products = \App\Models\Product::with([
            'dealItems' => function ($query) use ($startDate, $endDate, $user) {
                $query->whereHas('deal', function ($q) use ($startDate, $endDate, $user) {
                    $q->whereBetween('created_at', [$startDate, $endDate])
                      ->where('status', 'closed_won');

                    if ($user->isSales()) {
                        $q->where('sales_id', $user->id);
                    }
                });
            }
        ])->get();

        $performance = $products->map(function ($product) {
            $totalQuantity = $product->dealItems->sum('quantity');
            $totalRevenue = $product->dealItems->sum('subtotal');
            $dealsCount = $product->dealItems->count();

            return [
                'product_id' => $product->id,
                'product_name' => $product->name,
                'category' => $product->category,
                'selling_price' => $product->selling_price,
                'quantity_sold' => $totalQuantity,
                'deals_count' => $dealsCount,
                'total_revenue' => $totalRevenue,
                'average_price' => $dealsCount > 0 ? $totalRevenue / $dealsCount : 0,
            ];
        })->sortByDesc('total_revenue')->values();

        return response()->json([
            'period' => $period,
            'date_range' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'products' => $performance,
        ]);
    }

    /**
     * Get all generated reports (placeholder)
     */
    public function getAllReports(Request $request)
    {
        // This is a placeholder for stored reports functionality
        // In a real implementation, you might store generated reports in a database

        $user = $request->user();

        // Mock data for demonstration
        $reports = [
            [
                'id' => 1,
                'type' => 'sales',
                'name' => 'Sales Report - ' . now()->format('M Y'),
                'generated_by' => $user->name,
                'generated_at' => now()->subDays(2)->format('Y-m-d H:i:s'),
                'period' => [
                    'start' => now()->startOfMonth()->format('Y-m-d'),
                    'end' => now()->endOfMonth()->format('Y-m-d'),
                ],
                'status' => 'completed',
            ],
            [
                'id' => 2,
                'type' => 'revenue',
                'name' => 'Revenue Report - ' . now()->format('M Y'),
                'generated_by' => $user->name,
                'generated_at' => now()->subDays(5)->format('Y-m-d H:i:s'),
                'period' => [
                    'start' => now()->subMonth()->startOfMonth()->format('Y-m-d'),
                    'end' => now()->subMonth()->endOfMonth()->format('Y-m-d'),
                ],
                'status' => 'completed',
            ],
        ];

        if ($user->isSales()) {
            // Filter reports for sales users (only their own)
            $reports = array_filter($reports, function ($report) use ($user) {
                return $report['generated_by'] === $user->name;
            });
        }

        return response()->json(array_values($reports));
    }

    /**
     * Delete report (placeholder)
     */
    public function deleteReport(Request $request, $id)
    {
        // This is a placeholder for deleting stored reports
        // In a real implementation, you would delete from database

        return response()->json(['message' => 'Report deleted successfully']);
    }

    /**
     * Download report (placeholder)
     */
    public function downloadReport(Request $request, $type, $id)
    {
        // This is a placeholder for downloading reports
        // In a real implementation, you would retrieve the file and return it

        return response()->json([
            'message' => 'Report download initiated',
            'type' => $type,
            'id' => $id,
            'download_url' => "/reports/{$type}/{$id}/download",
        ]);
    }
}
