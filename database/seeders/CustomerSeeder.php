<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\CustomerService;
use App\Models\Lead;
use App\Models\Deal;
use App\Models\Product;

class CustomerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get approved deals to convert to customers
        $approvedDeals = Deal::where('status', 'approved')->get();

        $customers = [
            [
                'lead_name' => 'PT Teknologi Maju',
                'customer_type' => 'corporate',
                'billing_address' => 'Jl. Sudirman No. 123, Jakarta Pusat 10220',
                'installation_address' => 'Lantai 5, Gedung Teknologi Maju, Jl. Sudirman No. 123',
                'activation_date' => now()->subDays(30),
                'notes' => 'Customer corporate dengan pembayaran bulanan via transfer bank',
            ],
            [
                'lead_name' => 'Gaming Center Ultimate',
                'customer_type' => 'corporate',
                'billing_address' => 'Jl. Cihampelas No. 234, Bandung 40131',
                'installation_address' => 'Gaming Center Ultimate, Lantai 2 Mall Cihampelas',
                'activation_date' => now()->subDays(15),
                'notes' => 'Gaming center dengan special requirements untuk low latency',
            ],
        ];

        foreach ($customers as $customerData) {
            $lead = Lead::where('name', $customerData['lead_name'])->first();

            if ($lead) {
                // Create customer
                $customer = Customer::create([
                    'customer_number' => 'CUST-' . date('Ymd') . '-' . str_pad(Customer::count() + 1, 3, '0', STR_PAD_LEFT),
                    'lead_id' => $lead->id,
                    'name' => $lead->name,
                    'email' => $lead->email,
                    'phone' => $lead->phone,
                    'address' => $lead->address,
                    'billing_address' => $customerData['billing_address'],
                    'installation_address' => $customerData['installation_address'],
                    'customer_type' => $customerData['customer_type'],
                    'status' => 'active',
                    'sales_id' => $lead->sales_id,
                    'activation_date' => $customerData['activation_date'],
                    'notes' => $customerData['notes'],
                ]);

                // Find approved deal for this lead
                $deal = Deal::where('lead_id', $lead->id)
                           ->where('status', 'approved')
                           ->first();

                if ($deal) {
                    // Create customer services based on deal items
                    foreach ($deal->items as $dealItem) {
                        CustomerService::create([
                            'service_number' => 'SVC-' . date('Ymd') . '-' . str_pad(CustomerService::count() + 1, 3, '0', STR_PAD_LEFT),
                            'customer_id' => $customer->id,
                            'product_id' => $dealItem->product_id,
                            'deal_id' => $deal->id,
                            'monthly_fee' => $dealItem->negotiated_price,
                            'installation_fee' => $dealItem->product->category === 'corporate' ? 500000 : 200000,
                            'start_date' => $customerData['activation_date'],
                            'billing_cycle' => 'monthly',
                            'status' => 'active',
                            'installation_address' => $customerData['installation_address'],
                            'equipment_info' => json_encode([
                                'router' => $dealItem->product->category === 'corporate' ? 'Enterprise Router ER-X' : 'Home Router HR-5',
                                'modem' => 'Fiber Modem FM-1000',
                                'installation_date' => $customerData['activation_date']->format('Y-m-d'),
                                'technician' => 'Tech Team ' . rand(1, 5),
                            ]),
                            'notes' => 'Service aktif dari deal: ' . $deal->title,
                        ]);
                    }

                    // Update lead status to closed_won
                    $lead->update(['status' => 'closed_won']);
                }
            }
        }

        // Create additional direct customers (not from leads)
        $directCustomers = [
            [
                'name' => 'Warnet Gamer Zone',
                'email' => 'owner@gamerzone.id',
                'phone' => '021-5555777',
                'address' => 'Jl. Mangga Besar No. 88, Jakarta Barat',
                'customer_type' => 'individual',
                'product_name' => 'Paket Internet Rumahan 100Mbps',
                'monthly_fee' => 390000,
                'activation_days_ago' => 60,
            ],
            [
                'name' => 'Toko Online Sejahtera',
                'email' => 'admin@tokosejahtera.com',
                'phone' => '022-9999111',
                'address' => 'Jl. Kebon Jeruk No. 45, Bandung',
                'customer_type' => 'individual',
                'product_name' => 'Paket Internet Rumahan 50Mbps',
                'monthly_fee' => 250000,
                'activation_days_ago' => 90,
            ],
        ];

        foreach ($directCustomers as $custData) {
            $salesId = \App\Models\User::where('role', 'sales')->inRandomOrder()->first()->id;

            $customer = Customer::create([
                'customer_number' => 'CUST-' . date('Ymd') . '-' . str_pad(Customer::count() + 1, 3, '0', STR_PAD_LEFT),
                'name' => $custData['name'],
                'email' => $custData['email'],
                'phone' => $custData['phone'],
                'address' => $custData['address'],
                'billing_address' => $custData['address'],
                'installation_address' => $custData['address'],
                'customer_type' => $custData['customer_type'],
                'status' => 'active',
                'sales_id' => $salesId,
                'activation_date' => now()->subDays($custData['activation_days_ago']),
                'notes' => 'Customer langsung tanpa melalui lead',
            ]);

            $product = Product::where('name', $custData['product_name'])->first();

            if ($product) {
                CustomerService::create([
                    'service_number' => 'SVC-' . date('Ymd') . '-' . str_pad(CustomerService::count() + 1, 3, '0', STR_PAD_LEFT),
                    'customer_id' => $customer->id,
                    'product_id' => $product->id,
                    'monthly_fee' => $custData['monthly_fee'],
                    'installation_fee' => 200000,
                    'start_date' => now()->subDays($custData['activation_days_ago']),
                    'billing_cycle' => 'monthly',
                    'status' => 'active',
                    'installation_address' => $custData['address'],
                    'equipment_info' => json_encode([
                        'router' => 'Home Router HR-3',
                        'modem' => 'Fiber Modem FM-500',
                        'installation_date' => now()->subDays($custData['activation_days_ago'])->format('Y-m-d'),
                        'technician' => 'Tech Team ' . rand(1, 5),
                    ]),
                    'notes' => 'Layanan aktif untuk customer direct',
                ]);
            }
        }
    }
}
