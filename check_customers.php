<?php

use App\Models\Customer;
use App\Models\Deal;
use App\Models\Lead;

echo "=== Current Customers in System ===" . PHP_EOL;

$customers = Customer::with(['lead', 'sales', 'services.product'])->get();

echo "Total customers: " . $customers->count() . PHP_EOL . PHP_EOL;

foreach ($customers as $customer) {
    echo "Customer: " . $customer->name . " (Number: " . $customer->customer_number . ")" . PHP_EOL;
    echo "  Email: " . ($customer->email ?? 'No email') . PHP_EOL;
    echo "  Phone: " . ($customer->phone ?? 'No phone') . PHP_EOL;
    echo "  Lead: " . ($customer->lead ? $customer->lead->name : 'No Lead') . PHP_EOL;
    echo "  Sales: " . ($customer->sales ? $customer->sales->name : 'No Sales') . PHP_EOL;
    echo "  Type: " . $customer->customer_type . PHP_EOL;
    echo "  Status: " . $customer->status . PHP_EOL;
    echo "  Created: " . $customer->created_at->format('Y-m-d H:i:s') . PHP_EOL;
    echo "  Notes: " . ($customer->notes ?? 'No notes') . PHP_EOL;
    echo "  Services: " . $customer->services->count() . PHP_EOL;

    foreach ($customer->services as $service) {
        echo "    - " . $service->product->name . " (" . $service->service_number . ")" . PHP_EOL;
    }

    echo PHP_EOL;
}

echo "=== Lead to Deal to Customer Flow Check ===" . PHP_EOL;

$leadsWithDeals = Lead::with(['deals', 'customer'])->whereHas('deals')->get();

foreach ($leadsWithDeals as $lead) {
    echo "Lead: " . $lead->name . " (Status: " . $lead->status . ")" . PHP_EOL;

    foreach ($lead->deals as $deal) {
        echo "  Deal: " . $deal->title . " (Status: " . $deal->status . ")" . PHP_EOL;
    }

    if ($lead->customer) {
        echo "  Customer: " . $lead->customer->name . " (Auto-created: " . (strpos($lead->customer->notes, 'automatically') !== false ? 'YES' : 'NO') . ")" . PHP_EOL;
    } else {
        echo "  Customer: NOT CREATED" . PHP_EOL;
    }

    echo PHP_EOL;
}
