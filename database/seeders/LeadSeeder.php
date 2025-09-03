<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Lead;
use App\Models\User;

class LeadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $salesUsers = User::where('role', 'sales')->get();

        $leads = [
            [
                'name' => 'PT Maju Jaya',
                'contact' => '08123456789',
                'address' => 'Jl. Sudirman No. 123, Jakarta',
                'kebutuhan' => 'Sistem ERP untuk mengelola inventory dan keuangan',
                'status' => 'new',
                'owner_user_id' => $salesUsers->first()->id,
            ],
            [
                'name' => 'CV Berkah Mandiri',
                'contact' => '08234567890',
                'address' => 'Jl. Gatot Subroto No. 456, Bandung',
                'kebutuhan' => 'Software CRM untuk customer management',
                'status' => 'contacted',
                'owner_user_id' => $salesUsers->last()->id,
            ],
            [
                'name' => 'PT Global Solutions',
                'contact' => '08345678901',
                'address' => 'Jl. Asia Afrika No. 789, Surabaya',
                'kebutuhan' => 'Sistem accounting terintegrasi',
                'status' => 'qualified',
                'owner_user_id' => $salesUsers->first()->id,
            ],
            [
                'name' => 'UD Sejahtera Abadi',
                'contact' => '08456789012',
                'address' => 'Jl. Diponegoro No. 321, Yogyakarta',
                'kebutuhan' => 'Inventory management system',
                'status' => 'new',
                'owner_user_id' => $salesUsers->last()->id,
            ],
        ];

        foreach ($leads as $lead) {
            Lead::create($lead);
        }
    }
}
