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
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the lead that this deal belongs to
     */
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }

    /**
     * Get the deal items for this deal
     */
    public function items()
    {
        return $this->hasMany(DealItem::class);
    }

    /**
     * Calculate total amount from deal items
     */
    public function calculateTotal(): float
    {
        return $this->items->sum('subtotal');
    }

    /**
     * Update total amount based on deal items
     */
    public function updateTotal(): void
    {
        $this->total_amount = $this->calculateTotal();
        $this->save();
    }

    /**
     * Check if deal requires approval
     */
    public function requiresApproval(): bool
    {
        return $this->items()->whereHas('product', function ($query) {
            $query->whereRaw('deal_items.harga_nego < products.harga_jual');
        })->exists();
    }

    /**
     * Approve the deal
     */
    public function approve(): void
    {
        $this->status = 'approved';
        $this->save();

        // Convert lead to customer when deal is approved
        if (!$this->lead->customer) {
            $this->convertLeadToCustomer();
        }
    }

    /**
     * Reject the deal
     */
    public function reject(): void
    {
        $this->status = 'rejected';
        $this->save();
    }

    /**
     * Convert lead to customer
     */
    private function convertLeadToCustomer(): void
    {
        $customer = Customer::create([
            'lead_id' => $this->lead_id,
            'name' => $this->lead->name,
            'contact' => $this->lead->contact,
        ]);

        // Create customer services for each deal item
        foreach ($this->items as $item) {
            CustomerService::create([
                'customer_id' => $customer->id,
                'product_id' => $item->product_id,
                'price' => $item->harga_nego,
                'start_date' => now(),
            ]);
        }
    }

    /**
     * Scope to filter by status
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to get deals for specific sales user
     */
    public function scopeForSalesUser($query, $userId)
    {
        return $query->whereHas('lead', function ($q) use ($userId) {
            $q->where('owner_user_id', $userId);
        });
    }
}
