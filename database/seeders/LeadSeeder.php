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
                'name' => 'PT Teknologi Maju',
                'email' => 'admin@tekma.co.id',
                'phone' => '021-7654321',
                'address' => 'Jl. Sudirman No. 123, Jakarta Pusat',
                'needs' => 'Internet dedicated 100Mbps untuk kantor pusat dengan 50 karyawan',
                'status' => 'qualified',
                'source' => 'website',
                'notes' => 'Perusahaan software development, butuh internet stabil untuk remote work',
                'sales_id' => $salesUsers->get(0)->id,
            ],
            [
                'name' => 'CV Kreatif Digital',
                'email' => 'info@kreatifdigital.com',
                'phone' => '022-8765432',
                'address' => 'Jl. Braga No. 45, Bandung',
                'needs' => 'Paket internet rumahan 50Mbps untuk co-working space',
                'status' => 'proposal',
                'source' => 'referral',
                'notes' => 'Co-working space dengan 20 tenant, butuh bandwidth reliable',
                'sales_id' => $salesUsers->get(1)->id,
            ],
            [
                'name' => 'Hotel Grand Sejahtera',
                'email' => 'manager@grandsejahtera.com',
                'phone' => '031-5432167',
                'address' => 'Jl. Pemuda No. 67, Surabaya',
                'needs' => 'WiFi hotspot solution untuk 100 kamar hotel',
                'status' => 'negotiation',
                'source' => 'cold_call',
                'notes' => 'Hotel bintang 4, perlu solusi WiFi untuk tamu dan management system',
                'sales_id' => $salesUsers->get(2)->id,
            ],
            [
                'name' => 'Warung Kopi Nusantara',
                'email' => 'owner@kopinus.id',
                'phone' => '0274-123456',
                'address' => 'Jl. Malioboro No. 89, Yogyakarta',
                'needs' => 'Internet 20Mbps untuk cafe dengan free WiFi customer',
                'status' => 'contacted',
                'source' => 'walk_in',
                'notes' => 'Cafe dengan 30 meja, target customer milenial yang butuh WiFi',
                'sales_id' => $salesUsers->get(0)->id,
            ],
            [
                'name' => 'PT Manufaktur Indonesia',
                'email' => 'it@manufaktur.co.id',
                'phone' => '021-9876543',
                'address' => 'Kawasan Industri Pulogadung, Jakarta Timur',
                'needs' => 'Internet corporate 500Mbps untuk pabrik dan sistem ERP',
                'status' => 'new',
                'source' => 'exhibition',
                'notes' => 'Pabrik elektronik dengan 200 karyawan, perlu internet untuk sistem produksi',
                'sales_id' => $salesUsers->get(1)->id,
            ],
            [
                'name' => 'Gaming Center Ultimate',
                'email' => 'admin@gcultimate.com',
                'phone' => '022-1111222',
                'address' => 'Jl. Cihampelas No. 234, Bandung',
                'needs' => 'Internet gaming 200Mbps dengan low latency',
                'status' => 'qualified',
                'source' => 'social_media',
                'notes' => 'Gaming center dengan 50 PC gaming, perlu internet stabil untuk turnamen',
                'sales_id' => $salesUsers->get(2)->id,
            ],
            [
                'name' => 'Sekolah Dasar Harapan',
                'email' => 'kepala@sdharapan.sch.id',
                'phone' => '0274-555666',
                'address' => 'Jl. Kaliurang KM 5, Sleman, Yogyakarta',
                'needs' => 'Internet 50Mbps untuk lab komputer dan e-learning',
                'status' => 'contacted',
                'source' => 'government_program',
                'notes' => 'Sekolah dengan 300 siswa, butuh internet untuk digitalisasi pendidikan',
                'sales_id' => $salesUsers->get(3)->id,
            ],
            [
                'name' => 'Klinik Sehat Bersama',
                'email' => 'admin@kliniksehat.com',
                'phone' => '031-7777888',
                'address' => 'Jl. Raya Darmo No. 15, Surabaya',
                'needs' => 'Internet 100Mbps untuk sistem informasi rumah sakit',
                'status' => 'closed_lost',
                'source' => 'referral',
                'notes' => 'Klinik dengan sistem SIMRS, sayangnya memilih kompetitor karena harga',
                'sales_id' => $salesUsers->get(0)->id,
            ],
        ];

        foreach ($leads as $lead) {
            Lead::create($lead);
        }
    }
}
