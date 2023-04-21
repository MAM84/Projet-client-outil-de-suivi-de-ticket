<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    public function contractmodels() {
        return $this->hasMany('App\Contractmodel');
    }
}
