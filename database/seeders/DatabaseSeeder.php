<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Product;
use App\Models\Lead;
use App\Models\Deal;
use App\Models\DealItem;
use App\Models\Customer;
use App\Models\CustomerService;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Users
        $manager = User::create([
            'name' => 'Manager PT Smart',
            'email' => 'manager@ptsmart.com',
            'password' => Hash::make('password123'),
            'role' => 'manager'
        ]);

        $sales1 = User::create([
            'name' => 'Sales Budi',
            'email' => 'budi@ptsmart.com',
            'password' => Hash::make('password123'),
            'role' => 'sales'
        ]);

        $sales2 = User::create([
            'name' => 'Sales Sari',
            'email' => 'sari@ptsmart.com',
            'password' => Hash::make('password123'),
            'role' => 'sales'
        ]);

        // Create Products
        $product1 = Product::create([
            'name' => 'Internet 50 Mbps',
            'hpp' => 300000,
            'margin_percent' => 40
        ]);

        $product2 = Product::create([
            'name' => 'Internet 100 Mbps',
            'hpp' => 500000,
            'margin_percent' => 35
        ]);

        $product3 = Product::create([
            'name' => 'Internet 200 Mbps',
            'hpp' => 800000,
            'margin_percent' => 30
        ]);

        $product4 = Product::create([
            'name' => 'Internet Unlimited',
            'hpp' => 1200000,
            'margin_percent' => 25
        ]);

        // Create Leads
        $lead1 = Lead::create([
            'name' => 'PT Maju Jaya',
            'contact' => '08123456789',
            'address' => 'Jl. Sudirman No. 123, Jakarta',
            'kebutuhan' => 'Internet untuk kantor 50 karyawan',
            'status' => 'qualified',
            'owner_user_id' => $sales1->id
        ]);

        $lead2 = Lead::create([
            'name' => 'CV Sejahtera',
            'contact' => '08234567890',
            'address' => 'Jl. Thamrin No. 456, Jakarta',
            'kebutuhan' => 'Internet high speed untuk data center',
            'status' => 'contacted',
            'owner_user_id' => $sales1->id
        ]);

        $lead3 = Lead::create([
            'name' => 'Toko Elektronik Jaya',
            'contact' => '08345678901',
            'address' => 'Jl. Gatot Subroto No. 789, Jakarta',
            'kebutuhan' => 'Internet untuk CCTV dan kasir',
            'status' => 'new',
            'owner_user_id' => $sales2->id
        ]);

        $lead4 = Lead::create([
            'name' => 'Restoran Padang Minang',
            'contact' => '08456789012',
            'address' => 'Jl. MH Thamrin No. 321, Jakarta',
            'kebutuhan' => 'Internet untuk WiFi customer',
            'status' => 'qualified',
            'owner_user_id' => $sales2->id
        ]);

        // Create Deals
        $deal1 = Deal::create([
            'lead_id' => $lead1->id,
            'status' => 'approved',
            'total_amount' => 0 // Will be calculated by deal items
        ]);

        $deal2 = Deal::create([
            'lead_id' => $lead2->id,
            'status' => 'waiting_approval',
            'total_amount' => 0
        ]);

        $deal3 = Deal::create([
            'lead_id' => $lead4->id,
            'status' => 'approved',
            'total_amount' => 0
        ]);

        // Create Deal Items
        DealItem::create([
            'deal_id' => $deal1->id,
            'product_id' => $product2->id,
            'qty' => 2,
            'harga_nego' => 650000 // Below selling price, needs approval
        ]);

        DealItem::create([
            'deal_id' => $deal1->id,
            'product_id' => $product1->id,
            'qty' => 1,
            'harga_nego' => 420000 // At selling price
        ]);

        DealItem::create([
            'deal_id' => $deal2->id,
            'product_id' => $product3->id,
            'qty' => 1,
            'harga_nego' => 900000 // Below selling price, waiting approval
        ]);

        DealItem::create([
            'deal_id' => $deal3->id,
            'product_id' => $product1->id,
            'qty' => 3,
            'harga_nego' => 420000
        ]);

        // Create Customers (from approved deals)
        $customer1 = Customer::create([
            'lead_id' => $lead1->id,
            'name' => 'PT Maju Jaya',
            'contact' => '08123456789'
        ]);

        $customer2 = Customer::create([
            'lead_id' => $lead4->id,
            'name' => 'Restoran Padang Minang',
            'contact' => '08456789012'
        ]);

        // Create Customer Services
        CustomerService::create([
            'customer_id' => $customer1->id,
            'product_id' => $product2->id,
            'price' => 650000,
            'start_date' => Carbon::now()->subDays(30)
        ]);

        CustomerService::create([
            'customer_id' => $customer1->id,
            'product_id' => $product1->id,
            'price' => 420000,
            'start_date' => Carbon::now()->subDays(30)
        ]);

        CustomerService::create([
            'customer_id' => $customer2->id,
            'product_id' => $product1->id,
            'price' => 420000,
            'start_date' => Carbon::now()->subDays(15)
        ]);

        $this->command->info('Database seeded successfully!');
        $this->command->info('Login credentials:');
        $this->command->info('Manager: manager@ptsmart.com / password123');
        $this->command->info('Sales 1: budi@ptsmart.com / password123');
        $this->command->info('Sales 2: sari@ptsmart.com / password123');
    }
}
