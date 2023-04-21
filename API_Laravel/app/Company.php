<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    public function users() {
        return $this->hasMany('App\User');
    }

    public function contractmodels() {
        return $this->belongsToMany('App\Contractmodel')->withPivot('id', 'startingDate', 'finalDate', 'comment')->withTimestamps();
    }
}
