<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Contractmodel extends Model
{
    public function companies() {
        return $this->belongsToMany('App\Compagny')->withPivot('id', 'startingDate', 'finalDate', 'comment')->withTimestamps();
    }

    public function service() {
        return $this->belongsTo('App\Service');
    }
}
