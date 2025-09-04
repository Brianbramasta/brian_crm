<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'hpp',
        'margin_percentage',
        'category',
        'bandwidth',
        'is_active',
    ];

    protected $casts = [
        'hpp' => 'decimal:2',
        'margin_percentage' => 'decimal:2',
        'selling_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Note: selling_price is calculated automatically by database trigger

    // Relationships
    public function dealItems()
    {
        return $this->hasMany(DealItem::class);
    }

    public function customerServices()
    {
        return $this->hasMany(CustomerService::class);
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    // Accessors
    public function getPriceAttribute()
    {
        return $this->selling_price;
    }

    public function getFormattedPriceAttribute()
    {
        return 'Rp ' . number_format($this->selling_price, 0, ',', '.');
    }
}
