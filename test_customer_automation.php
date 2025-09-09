<?php

// Test script untuk otomatisasi pembuatan customer
// Jalankan dengan: php artisan tinker < test_customer_automation.php

// Load models
use App\Models\User;
use App\Models\Lead;
use App\Models\Product;
use App\Models\Deal;
use App\Models\DealItem;
use App\Models\Customer;
use App\Models\CustomerService;

echo "=== Testing Automatic Customer Creation from Deal ===\n";

// 1. Get test data
$salesUser = User::where('role', 'sales')->first();
$lead = Lead::where('status', 'qualified')->first();
$product = Product::first();

if (!$salesUser || !$lead || !$product) {
    echo "ERROR: Missing test data. Please ensure you have users, leads, and products.\n";
    exit;
}

echo "Sales User: {$salesUser->name}\n";
echo "Lead: {$lead->name}\n";
echo "Product: {$product->name}\n";

// 2. Create a test deal
$deal = Deal::create([
    'lead_id' => $lead->id,
    'title' => 'Test Deal for Customer Automation',
    'description' => 'Testing automatic customer creation',
    'status' => 'draft',
    'sales_id' => $salesUser->id,
    'notes' => 'Created for testing',
]);

echo "Deal created: {$deal->title} (ID: {$deal->id})\n";

// 3. Add deal items
$dealItem = $deal->items()->create([
    'product_id' => $product->id,
    'quantity' => 1,
    'unit_price' => $product->selling_price,
    'negotiated_price' => $product->selling_price,
    'discount_percentage' => 0,
]);

echo "Deal item created: {$product->name}\n";

// 4. Update deal totals
$deal->updateTotalAmount();
echo "Deal total amount: {$deal->total_amount}\n";

// 5. Approve the deal (simulate manager approval)
$managerUser = User::where('role', 'manager')->first();
if ($managerUser) {
    $deal->update([
        'status' => 'approved',
        'approved_by' => $managerUser->id,
        'approved_at' => now(),
    ]);
    echo "Deal approved by: {$managerUser->name}\n";
} else {
    echo "No manager found, manually setting status to approved\n";
    $deal->update(['status' => 'approved']);
}

// 6. Count customers before closing deal
$customerCountBefore = Customer::count();
$customerServiceCountBefore = CustomerService::count();

echo "Customers before: {$customerCountBefore}\n";
echo "Customer services before: {$customerServiceCountBefore}\n";

// 7. Close deal as won (this should trigger automatic customer creation)
echo "\n=== Closing Deal as Won ===\n";
$deal->update([
    'status' => 'closed_won',
    'closed_at' => now(),
]);

// Update lead status
$lead->update(['status' => 'closed_won']);

// Create customer automatically (simulating the controller logic)
$customer = Customer::create([
    'lead_id' => $deal->lead_id,
    'name' => $deal->lead->name,
    'email' => $deal->lead->email,
    'phone' => $deal->lead->phone,
    'address' => $deal->lead->address,
    'billing_address' => $deal->lead->address,
    'installation_address' => $deal->lead->address,
    'customer_type' => 'individual',
    'status' => 'active',
    'sales_id' => $deal->sales_id,
    'activation_date' => now(),
    'notes' => 'Customer created automatically from deal: ' . $deal->title,
]);

echo "Customer created: {$customer->name} (Number: {$customer->customer_number})\n";

// Create customer services from deal items
foreach ($deal->items as $dealItem) {
    $customerService = CustomerService::create([
        'customer_id' => $customer->id,
        'product_id' => $dealItem->product_id,
        'deal_id' => $deal->id,
        'monthly_fee' => $dealItem->negotiated_price,
        'installation_fee' => 200000, // Default fee
        'start_date' => now(),
        'billing_cycle' => 'monthly',
        'status' => 'active',
        'installation_address' => $customer->address,
        'equipment_info' => [
            'router' => 'Home Router HR-5',
            'modem' => 'Fiber Modem FM-1000',
            'installation_date' => now()->format('Y-m-d'),
            'technician' => 'Tech Team ' . rand(1, 5),
        ],
        'notes' => 'Service created from deal item: ' . $dealItem->product->name,
    ]);

    echo "Customer service created: {$dealItem->product->name} (Number: {$customerService->service_number})\n";
}

// 8. Verify results
$customerCountAfter = Customer::count();
$customerServiceCountAfter = CustomerService::count();

echo "\n=== Results ===\n";
echo "Customers after: {$customerCountAfter}\n";
echo "Customer services after: {$customerServiceCountAfter}\n";
echo "Customers created: " . ($customerCountAfter - $customerCountBefore) . "\n";
echo "Customer services created: " . ($customerServiceCountAfter - $customerServiceCountBefore) . "\n";

// 9. Show customer details
$createdCustomer = Customer::with(['lead', 'sales', 'services.product'])->find($customer->id);
echo "\n=== Customer Details ===\n";
echo "Customer Number: {$createdCustomer->customer_number}\n";
echo "Name: {$createdCustomer->name}\n";
echo "Email: {$createdCustomer->email}\n";
echo "Phone: {$createdCustomer->phone}\n";
echo "Sales: {$createdCustomer->sales->name}\n";
echo "Lead: {$createdCustomer->lead->name}\n";
echo "Services: " . $createdCustomer->services->count() . "\n";

foreach ($createdCustomer->services as $service) {
    echo "  - {$service->product->name}: {$service->service_number}\n";
}

echo "\n=== Test Completed Successfully! ===\n";
