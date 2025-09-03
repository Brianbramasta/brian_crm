<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'name',
        'contact',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the lead that this customer was converted from
     */
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    /**
     * Get the services for this customer
     */
    public function services()
    {
        return $this->hasMany(CustomerService::class);
    }

    /**
     * Get total monthly revenue from this customer
     */
    public function getTotalMonthlyRevenue(): float
    {
        return $this->services->sum('price');
    }

    /**
     * Get active services count
     */
    public function getActiveServicesCount(): int
    {
        return $this->services->count();
    }

    /**
     * Scope to search customers by name or contact
     */
    public function scopeSearch($query, $term)
    {
        return $query->where('name', 'like', "%{$term}%")
                    ->orWhere('contact', 'like', "%{$term}%");
    }

    /**
     * Get formatted total revenue
     */
    public function getFormattedTotalRevenueAttribute(): string
    {
        return 'Rp ' . number_format($this->getTotalMonthlyRevenue(), 0, ',', '.');
    }
}
