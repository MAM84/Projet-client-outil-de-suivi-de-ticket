<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Step extends Model
{
    public function tickets() {
        return $this->belongsToMany('App\Ticket')->withPivot('dateStepTicket', 'comment')->withTimestamps();
    }
}
