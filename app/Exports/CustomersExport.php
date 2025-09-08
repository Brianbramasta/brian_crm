<?php

namespace App\Exports;

use Illuminate\Support\Collection;

class CustomersExport extends BaseReportExport
{
    public function collection()
    {
        return $this->data->map(function ($customer) {
            return [
                'Customer Number' => $customer->customer_number,
                'Nama Customer' => $customer->name,
                'Email' => $customer->email ?? '-',
                'Telepon' => $customer->phone ?? '-',
                'Alamat' => $customer->address ?? '-',
                'Alamat Billing' => $customer->billing_address ?? '-',
                'Alamat Instalasi' => $customer->installation_address ?? '-',
                'Tipe Customer' => ucfirst($customer->customer_type),
                'Status' => ucfirst($customer->status),
                'Sales Person' => $customer->sales->name ?? '-',
                'Lead Asal' => $customer->lead->name ?? '-',
                'Tanggal Aktivasi' => $this->formatDate($customer->activation_date),
                'Tanggal Dibuat' => $this->formatDateTime($customer->created_at),
                'Catatan' => $customer->notes ?? '-',
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Customer Number',
            'Nama Customer',
            'Email',
            'Telepon',
            'Alamat',
            'Alamat Billing',
            'Alamat Instalasi',
            'Tipe Customer',
            'Status',
            'Sales Person',
            'Lead Asal',
            'Tanggal Aktivasi',
            'Tanggal Dibuat',
            'Catatan',
        ];
    }
}
