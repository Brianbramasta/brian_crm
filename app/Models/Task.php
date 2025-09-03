<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'isCompleted',
        'user_id',
    ];

    protected $casts = [
        'isCompleted' => 'boolean',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Accessor for API compatibility
    public function getCreatedAtAttribute($value)
    {
        return $this->asDateTime($value)->toISOString();
    }

    public function getUpdatedAtAttribute($value)
    {
        return $this->asDateTime($value)->toISOString();
    }
}
