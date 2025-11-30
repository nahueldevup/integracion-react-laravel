<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'group',
        'name',
        'locked',
        'payload'
    ];

    // Esto hace que el campo 'payload' se convierta automáticamente de JSON a Array y viceversa
    protected $casts = [
        'locked' => 'boolean',
        'payload' => 'array',
    ];
}