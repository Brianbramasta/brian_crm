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
        'status' => 'string',
    ];

    // Relationships
    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

    public function deals()
    {
        return $this->hasMany(Deal::class);
    }

    public function customer()
    {
        return $this->hasOne(Customer::class);
    }
}
