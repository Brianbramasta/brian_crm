<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'contact',
        'address',
        'kebutuhan',
        'status',
        'owner_user_id',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the lead
     */
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    /**
     * Get the deals for this lead
     */
    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    /**
     * Get the customer created from this lead
     */
    public function customer()
    {
        return $this->hasOne(Customer::class);
    }

    /**
     * Scope to filter leads by owner
     */
    public function scopeOwnedBy($query, $userId)
    {
        return $query->where('owner_user_id', $userId);
    }

    /**
     * Scope to filter leads by status
     */
    public function scopeWithStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Check if lead can be converted to customer
     */
    public function canBeConverted(): bool
    {
        return $this->status === 'qualified' && !$this->customer;
    }
}
