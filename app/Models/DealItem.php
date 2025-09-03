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
        'subtotal',
    ];

    protected $casts = [
        'qty' => 'integer',
        'harga_nego' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    // Automatically calculate subtotal
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($dealItem) {
            $dealItem->subtotal = $dealItem->qty * $dealItem->harga_nego;
        });

        static::saved(function ($dealItem) {
            $dealItem->deal->updateTotalAmount();
        });

        static::deleted(function ($dealItem) {
            $dealItem->deal->updateTotalAmount();
        });
    }

    // Relationships
    public function deal()
    {
        return $this->belongsTo(Deal::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
