<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'hpp',
        'margin_percent',
    ];

    protected $casts = [
        'hpp' => 'decimal:2',
        'margin_percent' => 'decimal:2',
        'harga_jual' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the deal items for this product
     */
    public function dealItems()
    {
        return $this->hasMany(DealItem::class);
    }

    /**
     * Get the customer services for this product
     */
    public function customerServices()
    {
        return $this->hasMany(CustomerService::class);
    }

    /**
     * Calculate selling price (HPP + Margin)
     */
    public function getCalculatedSellingPrice(): float
    {
        return $this->hpp + ($this->hpp * $this->margin_percent / 100);
    }

    /**
     * Check if a negotiated price is below selling price
     */
    public function requiresApproval(float $negotiatedPrice): bool
    {
        return $negotiatedPrice < $this->getCalculatedSellingPrice();
    }

    /**
     * Get formatted price
     */
    public function getFormattedHppAttribute(): string
    {
        return 'Rp ' . number_format($this->hpp, 0, ',', '.');
    }

    public function getFormattedHargaJualAttribute(): string
    {
        return 'Rp ' . number_format($this->harga_jual, 0, ',', '.');
    }
}
