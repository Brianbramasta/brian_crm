<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'address',
        'needs',
        'status',
        'source',
        'notes',
        'sales_id',
    ];

    protected $casts = [
        'status' => 'string',
    ];

    // Relationships
    public function sales()
    {
        return $this->belongsTo(User::class, 'sales_id');
    }

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    public function customer()
    {
        return $this->hasOne(Customer::class);
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

    public function scopeActive($query)
    {
        return $query->whereNotIn('status', ['closed_won', 'closed_lost']);
    }

    // Helper methods
    public function isConverted()
    {
        return $this->status === 'closed_won';
    }

    public function isLost()
    {
        return $this->status === 'closed_lost';
    }

    public function canCreateDeal()
    {
        return in_array($this->status, ['qualified', 'proposal', 'negotiation']);
    }
}
