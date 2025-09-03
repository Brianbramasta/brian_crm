<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DealItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'deal_id',
        'product_id',
        'qty',
        'harga_nego',
    ];

    protected $casts = [
        'qty' => 'integer',
        'harga_nego' => 'decimal:2',
        'subtotal' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the deal that this item belongs to
     */
    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }

    /**
     * Get the product for this deal item
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Calculate subtotal
     */
    public function calculateSubtotal(): float
    {
        return $this->qty * $this->harga_nego;
    }

    /**
     * Check if negotiated price requires approval
     */
    public function requiresApproval(): bool
    {
        return $this->harga_nego < $this->product->harga_jual;
    }

    /**
     * Get formatted price
     */
    public function getFormattedHargaNegoAttribute(): string
    {
        return 'Rp ' . number_format($this->harga_nego, 0, ',', '.');
    }

    public function getFormattedSubtotalAttribute(): string
    {
        return 'Rp ' . number_format($this->subtotal, 0, ',', '.');
    }

    /**
     * Update deal total when deal item is saved
     */
    protected static function booted()
    {
        static::saved(function ($dealItem) {
            $dealItem->deal->updateTotal();
        });

        static::deleted(function ($dealItem) {
            $dealItem->deal->updateTotal();
        });
    }
}
