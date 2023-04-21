<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Company;
use Illuminate\Support\Facades\Auth;

class Company_ContractmodelResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
         return [
            'id' => $this->pivot->id,
            'id_contractmodel' => $this->id,
            'service' => $this->service()->first()->name,
            'numberHours' => $this->numberHours,
            'durationMonth' => $this->durationMonth,
            'startingDate' => $this->pivot->startingDate,
            'finalDate' => $this->pivot->finalDate,
            'contractComment' => Auth::user()->admin ? $this->pivot->comment : ''
        ];
        
    }
}
