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
        'harga_jual',
        'description',
        'stock',
    ];

    protected $casts = [
        'hpp' => 'decimal:2',
        'margin_percent' => 'decimal:2',
        'harga_jual' => 'decimal:2',
        'stock' => 'integer',
    ];

    // Automatically calculate harga_jual when saving
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($product) {
            if ($product->hpp && $product->margin_percent) {
                $product->harga_jual = $product->hpp + ($product->hpp * $product->margin_percent / 100);
            }
        });
    }

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

    // Accessor for API compatibility
    public function getPriceAttribute()
    {
        return $this->harga_jual;
    }
}
