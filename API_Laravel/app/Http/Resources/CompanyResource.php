<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Company;
use App\Step_ticket;
use App\Ticket;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class CompanyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $company = Company::FindOrFail($this->id);
        $contractsList = $company->contractmodels()->orderBy('finalDate', 'DESC')->get();
        $contracts = [];
        // TODO : cleaner un peu le code ci-dessous car redondant
        foreach ($contractsList as $index => $contract) {
            $startingDate = Carbon::createFromDate($contract->pivot->startingDate);
            $date1 = Carbon::createFromDate($contract->pivot->startingDate);
            $date2 = Carbon::createFromDate($contract->pivot->startingDate);
            $date1->subMonth();
            $finalDate = Carbon::createFromDate($contract->pivot->finalDate);
            $nextContractStartingDate = Carbon::now();
            if(isset($contractsList[$index-1])) {
                $nextContractStartingDate = Carbon::createFromDate($contractsList[$index-1]->pivot->startingDate);
            }
            $timeSpentBetweenContracts = 0;
            $remainingTimeArray = [];
            if($contract->service()->first()->id === 1) {
                // contrat mensuel
                for($i=0; $i<$contract->durationMonth; $i++) {
                    $date1->addMonths(1);
                    $date2->addMonths(1)->subDay();
                    $spentTime = Ticket::whereIn('requester_id', $company->users()->pluck('id'))->whereBetween('created_at', [$date1, $date2])->sum('duration');
                    // ajout de la durée des tickets postérieurs à finalDate (et inf à la startingDate du prochain contrat si existant ou date du jour sinon)
                    if($i === 11) {
                        if(isset($contractsList[$index-1])) {
                            if($finalDate->diffInDays($nextContractStartingDate) > 1) {
                                $timeSpentBetweenContracts = Ticket::whereIn('requester_id', $company->users()->pluck('id'))->whereBetween('created_at', [$finalDate, $nextContractStartingDate])->sum('duration');
                            }
                        } else {
                            $timeSpentBetweenContracts = Ticket::whereIn('requester_id', $company->users()->pluck('id'))->whereBetween('created_at', [$finalDate, Carbon::now()])->sum('duration');
                        }
                    }
                    $spentTime += $timeSpentBetweenContracts;
                    if($contract->numberHours*60 - $spentTime < 0) {
                        $remainingTime = strval(ceil(($contract->numberHours*60 - $spentTime) / 60)).':'.strval(abs(($contract->numberHours*60 - $spentTime) % 60));
                    } else {
                        $remainingTime = strval(floor(($contract->numberHours*60 - $spentTime) / 60)).':'.strval(($contract->numberHours*60 - $spentTime) % 60);
                    }
                    $remainingTimeArray[] = [
                        'periode' => 'mois '.($i+1),
                        'remainingTime' => $remainingTime
                    ];
                    if(Carbon::now()->diffInDays($date1) >= 0 && $date2->diffInDays(Carbon::now()) >= 0) {
                        $remainingTimeActual = $remainingTime;
                    }
                }
            } elseif($contract->service()->first()->id === 2) {
                // contrat annuel
                $spentTime = Ticket::whereIn('requester_id', $company->users()->pluck('id'))->whereBetween('created_at', [$contract->pivot->startingDate, $contract->pivot->finalDate])->sum('duration');
                if(isset($contractsList[$index+1])) {
                    if($finalDate->diffInDays($nextContractStartingDate) > 1) {
                        $timeSpentBetweenContracts = Ticket::whereIn('requester_id', $company->users()->pluck('id'))->whereBetween('created_at', [$finalDate, $nextContractStartingDate])->sum('duration');
                    }
                } else {
                    $timeSpentBetweenContracts = Ticket::whereIn('requester_id', $company->users()->pluck('id'))->whereBetween('created_at', [$finalDate, Carbon::now()])->sum('duration');
                }
                $spentTime += $timeSpentBetweenContracts;
                if($contract->numberHours*60 - $spentTime < 0) {
                    $remainingTime = strval(ceil(($contract->numberHours*60 - $spentTime) / 60)).':'.strval(abs(($contract->numberHours*60 - $spentTime) % 60));
                } else {
                    $remainingTime = strval(floor(($contract->numberHours*60 - $spentTime) / 60)).':'.strval(($contract->numberHours*60 - $spentTime) % 60);
                }
                $remainingTimeArray[] = [
                    'periode' => 'période du contrat',
                    'remainingTime' => $remainingTime];
                $remainingTimeActual = $remainingTime;
            }

            $contracts[] = [
                'id' => $contract->pivot->id,
                'id_contractmodel' => $contract->id,
                'service' => $contract->service()->first()->name,
                'numberHours' => $contract->numberHours,
                'durationMonth' => $contract->durationMonth,
                'startingDate' => $contract->pivot->startingDate,
                'finalDate' => $contract->pivot->finalDate,
                'remainingTimeArray' => $remainingTimeArray,
                'remainingTimeActual' => $remainingTimeActual,
                'contractComment' => Auth::user()->admin ? $contract->pivot->comment : ''
            ];
        }

        if(isset($this->logo)){
            $urlLogo = url('images/'.$this->logo);
        }else{
            $urlLogo = "";
        }

        $nbTicketsTotal = count(Ticket::whereIn('requester_id', $company->users()->pluck('id'))->get());

        $ticketsId = Ticket::whereIn('requester_id', $company->users()->pluck('id'))->pluck('id');

        $nbTicketsEncours = 0;
        foreach($ticketsId as $ticketId){
            if(Step_ticket::where('ticket_id', $ticketId)->orderBy('created_at', 'DESC')->first()->step_id < 5){
                $nbTicketsEncours++;
            }
        }

        if(Auth::user()->admin) {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'logo' => $urlLogo,
                'address' => $this->address,
                'comment' => $this->comment,
                'contracts' => $contracts,
                'nbTicketsTotal' => $nbTicketsTotal,
                'nbTicketsEncours' => $nbTicketsEncours,
            ];
        } else {
            return [
                'id' => $this->id,
                'name' => $this->name,
                'logo' => $urlLogo,
                'address' => $this->address,
                'contracts' => $contracts,
            ];
        }
    }
}
