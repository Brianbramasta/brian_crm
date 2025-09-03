<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'status',
        'total_amount',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'status' => 'string',
    ];

    // Relationships
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    public function dealItems()
    {
        return $this->hasMany(DealItem::class);
    }

    // Automatically calculate total_amount
    protected static function boot()
    {
        parent::boot();

        static::saved(function ($deal) {
            $deal->updateTotalAmount();
        });
    }

    public function updateTotalAmount()
    {
        $this->total_amount = $this->dealItems()->sum('subtotal');
        $this->saveQuietly(); // Save without triggering events
    }
}
