<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\TicketResource;
use App\Ticket;
use App\File;
use App\Step_ticket;
use App\User;
use App\Company;
use App\Step;
use Carbon\Carbon;
use DB;
use Str;
use Validator;
// use Storage;
use Illuminate\Database\QueryException;
use App\Mail\MailFromSite;
use Spipu\Html2Pdf\Html2Pdf;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if(Auth::user()->admin){
            return TicketResource::collection(Ticket::orderBy('created_at', 'desc')->get());
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'title' => 'required|string',
            'description' => 'required|string',
            'author_id' => 'required|integer',
            'requester_id' => 'required|integer',
            'topic_id' => 'required|integer',
            'priority_id' => 'required|integer',
        ]);

        if($validator->fails()) {
            return response()->json($validator->messages(),400);
        } else {
            DB::beginTransaction();
            try {
                $ticket = new Ticket;
                if ($request->title) {
                    $ticket->title = $request->title;
                }
                if ($request->description) {
                    $ticket->description = $request->description;
                }
                if ($request->author_id) {
                    $ticket->author_id = $request->author_id;
                }
                if ($request->requester_id) {
                    $ticket->requester_id = $request->requester_id;
                }
                if ($request->topic_id) {
                    $ticket->topic_id = $request->topic_id;
                }
                if ($request->priority_id) {
                    $ticket->priority_id = $request->priority_id;
                }
                $ticket->save();

                // création de la première étape 'nouveau' ticket par défaut
                $step_ticket = new Step_ticket;
                $step_ticket->dateStepTicket = Carbon::now()->isoFormat('Y/M/D');
                $step_ticket->ticket_id = $ticket->id;
                $step_ticket->step_id = 1;
                $step_ticket->save();

                // ajout des éventuels fichiers joints
                if($request->filesNb > 0) {
                    for($i=0; $i<$request->filesNb; $i++) {
                        $attached_file = $request->file('file-'.$i);
                        $file = new File;
                        $file->step_ticket_id = $step_ticket->id;
                        $fileName = Str::slug(pathinfo($request->file('file-'.$i)->getClientOriginalName(), PATHINFO_FILENAME).'_'.$i).'.'.$attached_file->getClientOriginalextension();
                        //Storage::disk('public')->putFileAs('attached_files', $attached_file, $fileName);
                        $attached_file->move(public_path('attached_files'), $fileName);
                        $file->link = $fileName;
                        $file->save();
                    }
                }

                //Envoi d'un mail de confirmation de création de ticket au user
                $message['subject'] = 'Création de ticket';
                $userRequesterEmail = User::find($ticket->requester_id)->email;
                $adminEmail = User::find(1)->email;
                $message['userName'] = User::find($ticket->requester_id)->name;
                $message['userFirstName'] = User::find($ticket->requester_id)->firstname;
                $message['userCompany'] = User::find($ticket->requester_id)->company()->first()->name;
                $message['titleticket'] = $ticket->title;
                $message['descriptionticket'] = $ticket->description;
                $message['topicticket'] = $ticket->topic()->first()->name;

                \Mail::to($userRequesterEmail)->cc($adminEmail)->send(new MailFromSite($message));

                DB::commit();
                return response()->json(['message' => 'success'], 200);
            } catch (QueryException $e) {
                DB::rollback();
                return response()->json(['error' => 'erreur'], 500);
            }
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(int $id)
    {
        $ticket = Ticket::find($id);
        $companyId = User::find($ticket->requester_id)->company()->first()->id;
        if(Auth::user()->admin || Auth::user()->company_id == $companyId){
            $ticket = Ticket::find($id);
            if($ticket) {
                return new TicketResource($ticket);
            } else {
                return response()->json(['message' => 'ticket inexistant'], 202);
            }
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, int $id)
    {
        if(Auth::user()->admin){
            $ticket = Ticket::find($id);
            if($ticket) {
                if($ticket->steps()->orderBy('pivot_created_at', 'desc')->first()->id == 5) {
                    return response()->json(['message' => 'ticket cloturé'], 409);
                } else {
                    $validator = Validator::make($request->all(),[
                        'topic_id' => 'nullable|integer',
                        'priority_id' => 'nullable|integer',
                        'duration' => 'nullable|string|size:5',
                        'manager_id' => 'nullable|integer',
                        'comment' => 'nullable|string',
                    ]);

                    if($validator->fails()) {
                        return response()->json($validator->messages(),400);
                    } else {
                        DB::beginTransaction();
                        try {
                            if($request->topic_id) {
                                $ticket->topic_id = $request->topic_id;
                            }

                            if($request->priority_id) {
                                $ticket->priority_id =  $request->priority_id;
                            }

                            if ($request->duration) {
                                $duration_details = explode(':', $request->duration);
                                $ticket->duration = $duration_details[0] * 60 + $duration_details[1];
                            } else {
                                $ticket->duration = $ticket->duration;
                            }

                            if ($request->manager_id && User::find($request->manager_id)->admin) {
                                $ticket->manager_id = $request->manager_id;

                                // ajout automatique de l'étape 'affecté'
                                $step_ticket = new Step_ticket;
                                $step_ticket->dateStepTicket = Carbon::now()->isoFormat('Y/M/D');
                                $step_ticket->ticket_id = $ticket->id;
                                $step_ticket->step_id = 2;
                                if ($request->comment) {
                                    $step_ticket->comment = $request->comment;
                                }
                                $step_ticket->save();
                            }

                            $ticket->save();

                            DB::commit();
                            return response()->json(['message' => 'success'], 200);
                        } catch (QueryException $e) {
                            DB::rollback();
                            return response()->json(['error' => 'erreur'], 500);
                        }
                    }
                }
            }else{
                return response()->json(['message' => 'action non autorisée'], 401);
            }
        }
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(int $id)
    {
        if(Auth::user()->admin){
            $ticket = Ticket::find($id);
            if($ticket !== null) {
                // ajouter une condition : uniquement le super admin
                DB::beginTransaction();
                try {
                    // suppression des pièces jointes associées au ticket
                    $step_tickets = Step_ticket::where('ticket_id', $ticket->id)->pluck('id');
                    $files = File::whereIn('step_ticket_id', $step_tickets)->get();
                    foreach($files as $file) {
                        $file->delete();
                    }

                    // suppression des étapes liées au ticket
                    $step_tickets = Step_ticket::where('ticket_id', $ticket->id)->get();
                    foreach($step_tickets as $step_ticket) {
                        $step_ticket->delete();
                    }

                    $ticket->delete();
                    DB::commit();
                    return response()->json(['message' => 'success'], 200);
                } catch (QueryException $e) {
                    DB::rollback();
                    return response()->json(['error' => 'erreur'], 500);
                }
            } else {
                return response()->json(['message' => 'ticket inexistant'], 202);
            }
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }

    public function addStepTicket(Request $request, int $id)
    {
        if(Auth::user()->admin){
            $ticket = Ticket::find($id);
            if($ticket !== null) {
                $validator = Validator::make($request->all(), [
                    'step_id' => 'required|integer',
                    'comment' => 'nullable|string',
                ]);

                if ($validator->fails()) {
                    return response()->json($validator->messages(), 400);
                } else {
                    DB::beginTransaction();
                    try {
                        $step_ticket = new Step_ticket;
                        $step_ticket->dateStepTicket = Carbon::now()->isoFormat('Y/M/D');
                        $step_ticket->ticket_id = $ticket->id;
                        if ($request->step_id) {
                            $step_ticket->step_id = $request->step_id;
                        }
                        if ($request->comment) {
                            $step_ticket->comment = $request->comment;
                        }

                        $step_ticket->save();

                        // ajout des éventuels fichiers joints
                        if($request->filesNb > 0) {
                            for($i=0; $i<$request->filesNb; $i++) {
                                $attached_file = $request->file('file-'.$i);
                                $file = new File;
                                $file->step_ticket_id = $step_ticket->id;
                                $fileName = Str::slug(pathinfo($request->file('file-'.$i)->getClientOriginalName(), PATHINFO_FILENAME).'_'.$i).'.'.$attached_file->getClientOriginalextension();
                                //Storage::disk('public')->putFileAs('attached_files', $attached_file, $fileName);
                                $attached_file->move(public_path('attached_files'), $fileName);
                                $file->link = $fileName;
                                $file->save();
                            }
                        }

                        DB::commit();
                        return response()->json(['message' => 'success'], 200);
                    } catch (QueryException $e) {
                        DB::rollback();
                        return response()->json(['error' => 'erreur'], 500);
                    }
                }
            } else {
                return response()->json(['message' => 'ticket inexistant'], 202);
            }
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }

    public function ticketByUser(User $user)
    {
        if(Auth::user()->admin || Auth::user()->company_id == $user->company_id){
            return TicketResource::collection(Ticket::where('requester_id', $user->id)->orderBy('created_at', 'desc')->get());
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }

    public function ticketByCompany(Company $company)
    {
        if(Auth::user()->admin || Auth::user()->company_id == $company->id){
            $users = User::where('company_id', $company->id)->pluck('id');
            return TicketResource::collection(Ticket::whereIn('requester_id', $users)->orderBy('created_at', 'desc')->get());
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }

    public function ticketByStep(Step $step)
    {
        if(Auth::user()->admin){
            $tickets = Ticket::all();
            $tickets_actual_step = [];
            foreach($tickets as $ticket){
                if($ticket->steps()->orderBy('pivot_created_at', 'desc')->first()->id == $step->id){
                    $tickets_actual_step[] = $ticket;
                }
            }
            return TicketResource::collection($tickets_actual_step);
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }

    public function generatePdf(Company $company, string $dateDebut, string $dateFin, string $filter)
    {
        if(Auth::user()->admin || Auth::user()->company_id == $company->id){
            $ringo = Company::find(1);

            if($dateDebut == "null"){
                $dateDebut1 = "2020-07-06";
                $dateDebut2 = Carbon::create("2020-07-06")->isoFormat('DD/MM/Y');
            }else{
                $dateDebut1 = $dateDebut;
                $dateDebut2 = Carbon::create($dateDebut)->isoFormat('DD/MM/Y');
            }

            if($dateFin == "null"){
                $dateFin1 = Carbon::now()->addDay();
                $dateFin2 = Carbon::now()->isoFormat('DD/MM/Y');
            }else{
                $dateFin1 = Carbon::create($dateFin)->addDay();
                $dateFin2 = Carbon::create($dateFin)->isoFormat('DD/MM/Y');
            }

            $users = User::where('company_id', $company->id)->pluck('id');
            $tickets = TicketResource::collection(Ticket::whereIn('requester_id', $users)->whereBetween('created_at', [$dateDebut1, $dateFin1])->get());

            $date = Carbon::now()->isoFormat('DD/MM/Y');

            $filterArray = explode(";", $filter);
            $filterArrayFile = [];
            $nbColonnes = 0;
            foreach($filterArray as $filter){
                $key = explode(':', $filter)[0];
                $value = explode(':', $filter)[1];
                $filterArrayFile[$key]=$value;
                $nbColonnes += $value;
            }
            $nbColonnesLeft = floor($nbColonnes/2);
            $nbColonnesRight = ceil($nbColonnes/2);
            $html = View('pdf.tickets')->with(array('ringo' => $ringo,'tickets' => $tickets, 'company' => $company, 'date' => $date, 'dateDebut' => $dateDebut2, 'dateFin' => $dateFin2, 'filterArrayFile' => $filterArrayFile, 'nbColonnesLeft' => $nbColonnesLeft, 'nbColonnesRight'=>$nbColonnesRight))->render();
            $htmlpdf = new Html2Pdf('L','A4','fr', true, 'UTF-8', array(10, 10, 10, 10));
            $htmlpdf->writeHTML($html);
            $htmlpdf->output('tickets.pdf');
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }
}
