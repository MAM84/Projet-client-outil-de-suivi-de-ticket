<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\ContractModel;

class ContractmodelResource extends JsonResource
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
                'id' => $this->id,
                'service' => $this->service()->first()->name,
                'numberHours' => $this->numberHours,
                'durationMonth' => $this->durationMonth,
            ];
    }
}
