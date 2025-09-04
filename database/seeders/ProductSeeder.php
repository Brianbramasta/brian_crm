<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'Paket Internet Rumahan 20Mbps',
                'description' => 'Paket internet rumahan dengan kecepatan 20Mbps, cocok untuk penggunaan sehari-hari seperti browsing, streaming, dan video call.',
                'hpp' => 150000,
                'margin_percentage' => 30,
                'category' => 'residential',
                'bandwidth' => '20Mbps',
            ],
            [
                'name' => 'Paket Internet Rumahan 50Mbps',
                'description' => 'Paket internet rumahan dengan kecepatan 50Mbps, ideal untuk keluarga dengan multiple device dan streaming HD.',
                'hpp' => 200000,
                'margin_percentage' => 25,
                'category' => 'residential',
                'bandwidth' => '50Mbps',
            ],
            [
                'name' => 'Paket Internet Rumahan 100Mbps',
                'description' => 'Paket internet rumahan dengan kecepatan 100Mbps, perfect untuk gaming online dan streaming 4K.',
                'hpp' => 300000,
                'margin_percentage' => 30,
                'category' => 'residential',
                'bandwidth' => '100Mbps',
            ],
            [
                'name' => 'Paket Internet Corporate 100Mbps',
                'description' => 'Paket dedicated internet untuk perusahaan kecil dengan bandwidth 100Mbps dan SLA guarantee.',
                'hpp' => 800000,
                'margin_percentage' => 40,
                'category' => 'corporate',
                'bandwidth' => '100Mbps',
            ],
            [
                'name' => 'Paket Internet Corporate 500Mbps',
                'description' => 'Paket dedicated internet untuk perusahaan menengah dengan bandwidth 500Mbps dan priority support.',
                'hpp' => 2000000,
                'margin_percentage' => 35,
                'category' => 'corporate',
                'bandwidth' => '500Mbps',
            ],
            [
                'name' => 'Paket Internet Corporate 1Gbps',
                'description' => 'Paket dedicated internet untuk perusahaan besar dengan bandwidth 1Gbps, 24/7 support dan redundant connection.',
                'hpp' => 3500000,
                'margin_percentage' => 40,
                'category' => 'corporate',
                'bandwidth' => '1Gbps',
            ],
            [
                'name' => 'Paket WiFi Hotspot',
                'description' => 'Solusi WiFi hotspot untuk cafe, restaurant, dan tempat umum dengan management portal.',
                'hpp' => 500000,
                'margin_percentage' => 50,
                'category' => 'hotspot',
                'bandwidth' => '100Mbps',
            ],
            [
                'name' => 'Paket Internet Gaming 200Mbps',
                'description' => 'Paket khusus gaming dengan low latency, 200Mbps dedicated, dan gaming server priority.',
                'hpp' => 400000,
                'margin_percentage' => 35,
                'category' => 'gaming',
                'bandwidth' => '200Mbps',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
