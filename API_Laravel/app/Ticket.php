<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    public function steps() {
        return $this->belongsToMany('App\Step')->withPivot('id', 'dateStepTicket', 'comment')->withTimestamps();
    }

    public function topic() {
        return $this->belongsTo('App\Topic');
    }

    public function priority() {
        return $this->belongsTo('App\Priority');
    }

}
