<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
        /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'birth_day',
        'birth_place',
        'country',
        'state',
        'city',
        'job',
    ];

    public function emails(){
        return $this->hasMany(Email::class);
    }

    public function phones()
    {
        return $this->hasMany(Phone::class);
    }

    public function descriptions()
    {
        return $this->hasMany(Description::class);
    }
}


