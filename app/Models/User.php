<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function leads()
    {
        return $this->hasMany(Lead::class, 'sales_id');
    }

    public function deals()
    {
        return $this->hasMany(Deal::class, 'sales_id');
    }

    public function approvedDeals()
    {
        return $this->hasMany(Deal::class, 'approved_by');
    }

    public function customers()
    {
        return $this->hasMany(Customer::class, 'sales_id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
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

    public function scopeSales($query)
    {
        return $query->where('role', 'sales');
    }

    public function scopeManagers($query)
    {
        return $query->where('role', 'manager');
    }

    // Helper methods
    public function isSales()
    {
        return $this->role === 'sales';
    }

    public function isManager()
    {
        return $this->role === 'manager';
    }

    public function canApproveDeals()
    {
        return $this->isManager();
    }
}
