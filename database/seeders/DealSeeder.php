<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Deal;
use App\Models\DealItem;
use App\Models\Lead;
use App\Models\Product;
use App\Models\User;

class DealSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leads = Lead::all();
        $products = Product::all();
        $manager = User::where('role', 'manager')->first();

        $deals = [
            [
                'lead_id' => $leads->where('name', 'PT Teknologi Maju')->first()->id,
                'title' => 'Paket Internet Corporate PT Teknologi Maju',
                'description' => 'Instalasi internet dedicated 100Mbps untuk kantor pusat',
                'status' => 'approved',
                'discount_amount' => 0,
                'needs_approval' => false,
                'approved_by' => $manager->id,
                'approved_at' => now()->subDays(5),
                'notes' => 'Deal approved untuk paket corporate standard',
                'items' => [
                    [
                        'product_name' => 'Paket Internet Corporate 100Mbps',
                        'quantity' => 1,
                        'negotiated_price' => 1120000, // Same as selling price
                    ]
                ]
            ],
            [
                'lead_id' => $leads->where('name', 'CV Kreatif Digital')->first()->id,
                'title' => 'Setup Internet Co-working Space',
                'description' => 'Paket internet untuk co-working space dengan 20 tenant',
                'status' => 'waiting_approval',
                'discount_amount' => 25000,
                'needs_approval' => true,
                'notes' => 'Customer minta diskon untuk kontrak 2 tahun',
                'items' => [
                    [
                        'product_name' => 'Paket Internet Rumahan 50Mbps',
                        'quantity' => 2,
                        'negotiated_price' => 240000, // Below selling price 250000
                    ]
                ]
            ],
            [
                'lead_id' => $leads->where('name', 'Hotel Grand Sejahtera')->first()->id,
                'title' => 'Solusi WiFi Hotel Grand Sejahtera',
                'description' => 'Implementasi WiFi hotspot untuk 100 kamar hotel',
                'status' => 'draft',
                'discount_amount' => 0,
                'needs_approval' => false,
                'notes' => 'Masih dalam tahap negosiasi spesifikasi teknis',
                'items' => [
                    [
                        'product_name' => 'Paket WiFi Hotspot',
                        'quantity' => 3,
                        'negotiated_price' => 750000, // Same as selling price
                    ],
                    [
                        'product_name' => 'Paket Internet Corporate 100Mbps',
                        'quantity' => 1,
                        'negotiated_price' => 1120000,
                    ]
                ]
            ],
            [
                'lead_id' => $leads->where('name', 'Gaming Center Ultimate')->first()->id,
                'title' => 'Internet Gaming Low Latency',
                'description' => 'Setup internet gaming dengan prioritas low latency',
                'status' => 'approved',
                'discount_amount' => 50000,
                'needs_approval' => true,
                'approved_by' => $manager->id,
                'approved_at' => now()->subDays(2),
                'notes' => 'Approved dengan diskon untuk kontrak gaming center',
                'items' => [
                    [
                        'product_name' => 'Paket Internet Gaming 200Mbps',
                        'quantity' => 1,
                        'negotiated_price' => 500000, // Discounted from 540000
                    ]
                ]
            ],
            [
                'lead_id' => $leads->where('name', 'PT Manufaktur Indonesia')->first()->id,
                'title' => 'Internet Corporate untuk Pabrik',
                'description' => 'Internet high-speed untuk sistem ERP dan produksi',
                'status' => 'rejected',
                'discount_amount' => 0,
                'needs_approval' => true,
                'approved_by' => $manager->id,
                'approved_at' => now()->subDays(1),
                'notes' => 'Rejected: Customer minta harga terlalu rendah, tidak profitable',
                'items' => [
                    [
                        'product_name' => 'Paket Internet Corporate 500Mbps',
                        'quantity' => 1,
                        'negotiated_price' => 2200000, // Way below selling price 2700000
                    ]
                ]
            ],
        ];

        foreach ($deals as $dealData) {
            $items = $dealData['items'];
            unset($dealData['items']);

            // Set sales_id from lead's sales_id
            $lead = Lead::find($dealData['lead_id']);
            $dealData['sales_id'] = $lead->sales_id;

            $deal = Deal::create($dealData);

            // Create deal items
            foreach ($items as $itemData) {
                $product = Product::where('name', $itemData['product_name'])->first();

                if ($product) {
                    DealItem::create([
                        'deal_id' => $deal->id,
                        'product_id' => $product->id,
                        'quantity' => $itemData['quantity'],
                        'unit_price' => $product->selling_price,
                        'negotiated_price' => $itemData['negotiated_price'],
                        'discount_percentage' => (($product->selling_price - $itemData['negotiated_price']) / $product->selling_price) * 100,
                    ]);
                }
            }

            // Update deal totals
            $deal->calculateTotal();

            // Check if approval is required
            if ($deal->status === 'draft') {
                $deal->checkApprovalRequired();
            }
        }
    }
}
