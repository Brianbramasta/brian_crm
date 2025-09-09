<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerService extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_number',
        'customer_id',
        'product_id',
        'deal_id',
        'monthly_fee',
        'installation_fee',
        'start_date',
        'end_date',
        'billing_cycle',
        'status',
        'installation_address',
        'equipment_info',
        'notes',
    ];

    protected $casts = [
        'monthly_fee' => 'decimal:2',
        'installation_fee' => 'decimal:2',
        'start_date' => 'date',
        'end_date' => 'date',
        'equipment_info' => 'array',
    ];

    // Auto-generate service number on create
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($service) {
            if (empty($service->service_number)) {
                $service->service_number = 'SVC-' . date('Ymd') . '-' . str_pad(static::whereDate('created_at', today())->count() + 1, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    // Relationships
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }
}
