<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerService extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'product_id',
        'price',
        'start_date',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'start_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the customer that this service belongs to
     */
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    /**
     * Get the product for this service
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get formatted price
     */
    public function getFormattedPriceAttribute(): string
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    /**
     * Get service duration in months
     */
    public function getServiceDurationInMonths(): int
    {
        return now()->diffInMonths($this->start_date);
    }

    /**
     * Scope to filter active services
     */
    public function scopeActive($query)
    {
        return $query->where('start_date', '<=', now());
    }

    /**
     * Scope to filter by date range
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('start_date', [$startDate, $endDate]);
    }
}
