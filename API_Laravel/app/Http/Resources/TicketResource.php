<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Ticket;
use App\User;
use App\Topic;
use App\Priority;
use App\Step;
use App\File;
use Carbon\Carbon;

class TicketResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $actual_step = $this->steps()->orderBy('pivot_created_at', 'desc')->first();

        $ticket = Ticket::findOrFail($this->id);
        $stepsList = $ticket->steps()->orderBy('pivot_created_at', 'desc')->get();
        $files_by_step = [];
        foreach ($stepsList as $step) {
            $allFiles = File::where('step_ticket_id', $step->pivot->id)->pluck('link');
            $urlFiles = [];
            foreach($allFiles as $file) {
                $urlFiles[] = url('attached_files/'.$file);
            }

            $files_by_step[] = [
                'id' => $step->id,
                'step' => $step->name,
                'date' => $step->pivot->dateStepTicket,
                'comment' => $step->pivot->comment,
                'files' => $urlFiles,
            ];
        }

        if($this->author_id) {
            $author = User::findOrFail($this->author_id);
            $author_details = [
                'id' => $author->id,
                'name' => $author->name,
                'firstname' => $author->firstname,
            ];
        } else {
            $author_details = 'no author';
        }

        if($this->manager_id) {
            $manager = User::findOrFail($this->manager_id);
            $manager_details = [
                'id' => $manager->id,
                'name' => $manager->name,
                'firstname' => $manager->firstname,
            ];
        } else {
            $manager_details = 'no manager';
        }

        if($this->requester_id) {
            $requester = User::findOrFail($this->requester_id);
            $requester_details = [
                'id' => $requester->id,
                'name' => $requester->name,
                'firstname' => $requester->firstname,
                'company' => $requester->company->name,
            ];
        } else {
            $requester_details = 'no requester';
        }

        return [
            'id' => $this->id,
            'dateEmission' => Carbon::parse($this->created_at)->isoFormat('L'),
            'dateResolution' =>$actual_step->id === 5 ? Carbon::parse($this->steps()->orderBy('pivot_created_at', 'desc')->first()->pivot->dateStepTicket)->isoFormat('L') : '',
            'title' => $this->title,
            'description' => $this->description,
            'topic' => $this->topic()->first()->name,
            'priority' => $this->priority()->first()->name,
            'actual_step' => $actual_step ? $actual_step->name : '', // normalement, il y a forcément a minima l'étape 'nouveau'
            'actual_step_id' => $actual_step ? $actual_step->id : '', // normalement, il y a forcément a minima l'étape 'nouveau'
            'duration' => $this->duration,
            'author' => $author_details,
            'manager' => $manager_details,
            'requester' => $requester_details,
            'all_steps' => $files_by_step,
        ];
    }
}
