<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_number',
        'lead_id',
        'name',
        'email',
        'phone',
        'address',
        'billing_address',
        'installation_address',
        'customer_type',
        'status',
        'sales_id',
        'activation_date',
        'notes',
    ];

    protected $casts = [
        'activation_date' => 'date',
    ];

    // Auto-generate customer number on create
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($customer) {
            if (empty($customer->customer_number)) {
                $customer->customer_number = 'CUST-' . date('Ymd') . '-' . str_pad(static::whereDate('created_at', today())->count() + 1, 3, '0', STR_PAD_LEFT);
            }
        });
    }

    // Relationships
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function sales()
    {
        return $this->belongsTo(User::class, 'sales_id');
    }

    public function services()
    {
        return $this->hasMany(CustomerService::class);
    }

    public function customerServices()
    {
        return $this->hasMany(CustomerService::class);
    }
}
