<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Carbon\Carbon;

abstract class BaseReportExport implements FromCollection, WithHeadings, WithStyles, WithTitle, ShouldAutoSize
{
    protected $data;
    protected $title;
    protected $startDate;
    protected $endDate;
    protected $user;

    public function __construct($data, $title, $startDate = null, $endDate = null, $user = null)
    {
        $this->data = $data;
        $this->title = $title;
        $this->startDate = $startDate;
        $this->endDate = $endDate;
        $this->user = $user;
    }

    public function title(): string
    {
        return $this->title;
    }

    public function styles(Worksheet $sheet)
    {
        return [
            // Header row styling
            1 => [
                'font' => [
                    'bold' => true,
                    'color' => ['rgb' => 'FFFFFF'],
                ],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '4472C4'],
                ],
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_CENTER,
                ],
            ],
            // Auto-fit columns
            'A:Z' => [
                'alignment' => [
                    'horizontal' => Alignment::HORIZONTAL_LEFT,
                ],
            ],
        ];
    }

    protected function formatDate($date)
    {
        if (!$date) return '';
        return Carbon::parse($date)->format('d/m/Y');
    }

    protected function formatDateTime($datetime)
    {
        if (!$datetime) return '';
        return Carbon::parse($datetime)->format('d/m/Y H:i');
    }

    protected function formatCurrency($amount)
    {
        if (!$amount) return 'Rp 0';
        return 'Rp ' . number_format($amount, 0, ',', '.');
    }

    protected function formatPercentage($percentage)
    {
        if (!$percentage) return '0%';
        return number_format($percentage, 2) . '%';
    }
}
