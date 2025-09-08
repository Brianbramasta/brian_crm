<?php

namespace App\Exports;

use Illuminate\Support\Collection;

class SalesReportExport extends BaseReportExport
{
    protected $summary;

    public function __construct($data, $summary, $title, $startDate = null, $endDate = null, $user = null)
    {
        parent::__construct($data, $title, $startDate, $endDate, $user);
        $this->summary = $summary;
    }

    public function collection()
    {
        $collection = new Collection();

        // Convert summary to array if it's an object
        $summary = is_object($this->summary) ? (array) $this->summary : $this->summary;

        // Add summary header
        $collection->push([
            'RINGKASAN LAPORAN SALES',
            '',
            '',
            '',
            '',
            '',
        ]);

        $collection->push([
            'Periode',
            ($this->startDate ? $this->formatDate($this->startDate) : '') . ' - ' . ($this->endDate ? $this->formatDate($this->endDate) : ''),
            '',
            '',
            '',
            '',
        ]);

        $collection->push([
            'Total Leads',
            $summary['total_leads'] ?? 0,
            '',
            '',
            '',
            '',
        ]);

        $collection->push([
            'Total Deals',
            $summary['total_deals'] ?? 0,
            '',
            '',
            '',
            '',
        ]);

        $collection->push([
            'Total Customers',
            $summary['total_customers'] ?? 0,
            '',
            '',
            '',
            '',
        ]);

        $collection->push([
            'Total Revenue',
            $this->formatCurrency($summary['total_revenue'] ?? 0),
            '',
            '',
            '',
            '',
        ]);

        $collection->push([
            'Conversion Rate',
            $this->formatPercentage($summary['conversion_rate'] ?? 0),
            '',
            '',
            '',
            '',
        ]);

        // Add empty row
        $collection->push(['', '', '', '', '', '']);

        // Add detail headers
        $collection->push([
            'Sales Person',
            'Total Leads',
            'Total Deals',
            'Total Customers',
            'Revenue',
            'Conversion Rate',
        ]);

        // Add sales performance data
        if (is_array($this->data) || is_object($this->data)) {
            foreach ($this->data as $salesData) {
                // Convert to array if it's an object
                $data = is_object($salesData) ? (array) $salesData : $salesData;

                $collection->push([
                    $data['sales_name'] ?? '',
                    $data['leads_count'] ?? 0,
                    $data['deals_count'] ?? 0,
                    $data['customers_count'] ?? 0,
                    $this->formatCurrency($data['revenue'] ?? 0),
                    $this->formatPercentage($data['conversion_rate'] ?? 0),
                ]);
            }
        }

        return $collection;
    }

    public function headings(): array
    {
        return []; // We handle headers manually in collection()
    }
}
