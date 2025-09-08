<?php

namespace App\Exports;

use Illuminate\Support\Collection;

class DealsExport extends BaseReportExport
{
    public function collection()
    {
        return $this->data->map(function ($deal) {
            return [
                'Deal Number' => $deal->deal_number,
                'Judul Deal' => $deal->title,
                'Lead' => $deal->lead->name ?? '-',
                'Deskripsi' => $deal->description ?? '-',
                'Total Amount' => $this->formatCurrency($deal->total_amount),
                'Diskon' => $this->formatCurrency($deal->discount_amount),
                'Final Amount' => $this->formatCurrency($deal->final_amount),
                'Status' => ucfirst(str_replace('_', ' ', $deal->status)),
                'Butuh Approval' => $deal->needs_approval ? 'Ya' : 'Tidak',
                'Sales Person' => $deal->sales->name ?? '-',
                'Approved By' => $deal->approver->name ?? '-',
                'Tanggal Approval' => $this->formatDateTime($deal->approved_at),
                'Tanggal Closed' => $this->formatDateTime($deal->closed_at),
                'Tanggal Dibuat' => $this->formatDateTime($deal->created_at),
                'Catatan' => $deal->notes ?? '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Deal Number',
            'Judul Deal',
            'Lead',
            'Deskripsi',
            'Total Amount',
            'Diskon',
            'Final Amount',
            'Status',
            'Butuh Approval',
            'Sales Person',
            'Approved By',
            'Tanggal Approval',
            'Tanggal Closed',
            'Tanggal Dibuat',
            'Catatan',
        ];
    }
}
