<?php

namespace App\Exports;

use Illuminate\Support\Collection;

class LeadsExport extends BaseReportExport
{
    public function collection()
    {
        return $this->data->map(function ($lead) {
            return [
                'Lead ID' => $lead->id,
                'Nama' => $lead->name,
                'Email' => $lead->email ?? '-',
                'Telepon' => $lead->phone ?? '-',
                'Alamat' => $lead->address ?? '-',
                'Kebutuhan' => $lead->needs ?? '-',
                'Status' => ucfirst($lead->status),
                'Sumber' => $lead->source ?? '-',
                'Sales Person' => $lead->sales->name ?? '-',
                'Tanggal Dibuat' => $this->formatDateTime($lead->created_at),
                'Tanggal Update' => $this->formatDateTime($lead->updated_at),
                'Catatan' => $lead->notes ?? '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Lead ID',
            'Nama',
            'Email',
            'Telepon',
            'Alamat',
            'Kebutuhan',
            'Status',
            'Sumber',
            'Sales Person',
            'Tanggal Dibuat',
            'Tanggal Update',
            'Catatan',
        ];
    }
}
