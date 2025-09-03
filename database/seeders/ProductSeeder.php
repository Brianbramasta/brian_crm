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
                'name' => 'ERP System Basic',
                'hpp' => 5000000,
                'margin_percent' => 30,
                'description' => 'Basic Enterprise Resource Planning system for small businesses',
                'stock' => 50,
            ],
            [
                'name' => 'ERP System Premium',
                'hpp' => 10000000,
                'margin_percent' => 25,
                'description' => 'Premium ERP system with advanced features',
                'stock' => 30,
            ],
            [
                'name' => 'CRM Software',
                'hpp' => 3000000,
                'margin_percent' => 40,
                'description' => 'Customer Relationship Management software',
                'stock' => 100,
            ],
            [
                'name' => 'Accounting Software',
                'hpp' => 2000000,
                'margin_percent' => 35,
                'description' => 'Professional accounting and bookkeeping software',
                'stock' => 75,
            ],
            [
                'name' => 'Inventory Management System',
                'hpp' => 4000000,
                'margin_percent' => 30,
                'description' => 'Complete inventory and warehouse management solution',
                'stock' => 25,
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
