<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deal extends Model
{
    use HasFactory;

    protected $fillable = [
        'deal_number',
        'lead_id',
        'title',
        'description',
        'total_amount',
        'discount_amount',
        'final_amount',
        'status',
        'needs_approval',
        'sales_id',
        'approved_by',
        'approved_at',
        'closed_at',
        'notes',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'final_amount' => 'decimal:2',
        'needs_approval' => 'boolean',
        'approved_at' => 'datetime',
        'closed_at' => 'datetime',
    ];

    // Auto-generate deal number on create
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($deal) {
            if (empty($deal->deal_number)) {
                $deal->deal_number = 'DEAL-' . date('Ymd') . '-' . str_pad(static::whereDate('created_at', today())->count() + 1, 3, '0', STR_PAD_LEFT);
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

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function items()
    {
        return $this->hasMany(DealItem::class);
    }

    public function dealItems()
    {
        return $this->hasMany(DealItem::class);
    }

    public function customerServices()
    {
        return $this->hasMany(CustomerService::class);
    }

    // Scopes
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeForSales($query, $salesId)
    {
        return $query->where('sales_id', $salesId);
    }

    public function scopeNeedsApproval($query)
    {
        return $query->where('needs_approval', true)->where('status', 'waiting_approval');
    }

    // Helper methods
    public function updateTotalAmount()
    {
        $this->total_amount = $this->dealItems()->sum('subtotal');
        $this->final_amount = $this->total_amount - $this->discount_amount;
        $this->saveQuietly(); // Save without triggering events
    }

    public function checkApprovalRequired()
    {
        // Check if any item has negotiated price below selling price
        $needsApproval = $this->dealItems()->whereRaw('negotiated_price < unit_price')->exists();
        $this->needs_approval = $needsApproval;

        if ($needsApproval && $this->status === 'draft') {
            $this->status = 'waiting_approval';
        }

        $this->save();
    }
}
