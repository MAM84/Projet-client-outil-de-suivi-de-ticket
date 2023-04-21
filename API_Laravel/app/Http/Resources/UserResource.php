<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class UserResource extends JsonResource
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
            'name' => $this->name,
            'firstname' => $this->firstname,
            'function' => $this->function,
            'phone' => $this->phone,
            'mail' => $this->email,
            'admin' => $this->admin,
            'companyName' => $this->company_id == 0 ? null : $this->company()->first()->name,
            'companyId' => $this->company_id == 0 ? null : $this->company()->first()->id,
            'comment' => Auth::user()->admin ? $this->comment : ''
        ];
    }
}
