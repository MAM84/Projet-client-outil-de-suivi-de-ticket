<?php

namespace App\Http\Controllers;

use App\Contractmodel;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\CompanyResource;
use App\Company;
use App\Company_contractmodel;
use App\User;
use App\Ticket;
use DB;
use Str;
use Validator;
// use Storage;
use Carbon\Carbon;
use App\Http\Resources\Company_ContractmodelResource;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if(Auth::user()->admin){
            return CompanyResource::collection(Company::orderBy('created_at', 'desc')->get());
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
        if(Auth::user()->admin){
            $validator = Validator::make($request->all(),[
                                        'name' => 'required|string',
                                        'logo' => 'nullable|image',
                                        'address' => 'nullable|string',
                                        'comment' => 'nullable|string',
                                        'contractmodel_id' => 'nullable|integer',
                                        'contractComment' => 'nullable|string',
                                        'startingDate' => 'required_with:contractmodel_id|string|size:10'
                                        ]);

            if($validator->fails()){
                return response()->json($validator->messages(),400);
            }else{
                DB::beginTransaction();
            try {
                // enregistrement d'une nouvelle entreprise
                $company = new Company;
                if($request->name) {
                    $company->name = htmlspecialchars($request->name);
                }
                if($request->address) {
                    $company->address = htmlspecialchars($request->address);
                }
                if($request->comment) {
                    $company->comment = htmlspecialchars($request->comment);
                }
                $company->save();

                // fait ici pour le cas où deux entreprises auraient le même nom
                // ainsi, l'id de l'enreprise est dispo et inséré dans le nom du fichier
                if($request->file('logo')) {
                    $logo = $request->file('logo');
                    $nomLogo = Str::slug('logo_' .Carbon::now()->timestamp. '_' . $company->id) . '.' . $logo->getClientOriginalextension();
                    // Storage::disk('public')->putFileAs('img', $logo, $nomLogo);
                    $logo->move(public_path('images'), $nomLogo);
                    $company->logo = $nomLogo;
                }
                $company->save();

                // enregistrement du contrat attaché à l'entreprise (si précisé)
                if($request->contractmodel_id) {
                    $company_contractmodel = new Company_contractmodel;
                    $company_contractmodel->contractmodel_id = $request->contractmodel_id;
                    $company_contractmodel->company_id = $company->id;
                    if($request->startingDate) {
                        $company_contractmodel->startingDate = Carbon::parse($request->startingDate)->isoFormat('Y/MM/DD');
                        $contractmodel = Contractmodel::findOrFail($request->contractmodel_id)->first();
                        $company_contractmodel->finalDate = Carbon::create($company_contractmodel->startingDate)->addMonths($contractmodel->durationMonth)->subDay();
                    }
                    if($request->contractComment) {
                        $company_contractmodel->comment = htmlspecialchars($request->contractComment);
                    }
                    $company_contractmodel->save();
                }

                DB::commit();
                return response()->json(['message' => 'success'], 200);
            } catch(QueryException $e) {
                DB::rollback(); // rq : consomme tout de même un id
                return response()->json(['error' => 'erreur'], 500);
            }
            }
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
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
        if(Auth::user()->admin || Auth::user()->company_id == $id){
            $company = Company::find($id);
            if($company) {
                return new CompanyResource($company);
            } else {
                return response()->json(['message' => 'entreprise inexistante'], 202);
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
            $company = Company::find($id);
            if($company) {
                $validator = Validator::make($request->all(),[
                                                'name' => 'required|string',
                                                'logo' => 'nullable|image',
                                                'address' => 'nullable|string',
                                                'comment' => 'nullable|string',
                                                'contractmodel_id' => 'nullable|integer',
                                                'contractComment' => 'nullable|string',
                                                'startingDate' => 'required_with:contractmodel_id|string|size:10'
                                            ]);

                if($validator->fails()){
                    return response()->json($validator->messages(),400);
                }else{
                    DB::beginTransaction();
                try {
                    if ($request->name) {
                        $company->name = htmlspecialchars($request->name);
                    }
                    if ($request->address) {
                        $company->address = htmlspecialchars($request->address);
                    }
                    if ($request->file('logo')) {
                        $logo = $request->file('logo');
                        $nomLogo = Str::slug('logo_' .Carbon::now()->timestamp. '_' . $company->id) . '.' . $logo->getClientOriginalextension();
                        // Storage::disk('public')->putFileAs('img', $logo, $nomLogo);
                        $logo->move(public_path('images'), $nomLogo);
                        $company->logo = $nomLogo;
                    }
                    if ($request->comment) {
                        $company->comment = htmlspecialchars($request->comment);
                    }
                    $company->save();

                    if ($request->company_contractmodel_id) {

                        // modification d'un ancien contrat attaché à l'entreprise
                        $company_contractmodel = Company_contractmodel::FindOrfail($request->company_contractmodel_id);
                        // on ne modifie QUE si le contrat est bien rattaché à l'entreprise en cours de modification
                        if ($company->id == $company_contractmodel->company_id) {
                            if ($request->contractmodel_id) {
                                $company_contractmodel->contractmodel_id = $request->contractmodel_id;
                            }
                            if ($request->startingDate) {
                                $company_contractmodel->startingDate = Carbon::parse($request->startingDate)->isoFormat('Y/MM/DD');
                                $contractmodel = Contractmodel::findOrFail($request->contractmodel_id)->first();
                                $company_contractmodel->finalDate = Carbon::create($company_contractmodel->startingDate)->addMonths($contractmodel->durationMonth)->subDay();
                            }
                            if ($request->contractComment) {
                                $company_contractmodel->comment = htmlspecialchars($request->contractComment);
                            }
                            $company_contractmodel->save();
                        }

                    } else {

                        // enregistrement d'un nouveau contrat attaché à l'entreprise
                        if ($request->contractmodel_id) {
                            $company_contractmodel = new Company_contractmodel;
                            $company_contractmodel->contractmodel_id = $request->contractmodel_id;
                            $company_contractmodel->company_id = $company->id;
                            if ($request->startingDate) {
                                $company_contractmodel->startingDate = Carbon::parse($request->startingDate)->isoFormat('Y/MM/DD');
                                $contractmodel = Contractmodel::findOrFail($request->contractmodel_id)->first();
                                $company_contractmodel->finalDate = Carbon::create($company_contractmodel->startingDate)->addMonths($contractmodel->durationMonth)->subDay();
                            }
                            if ($request->contractComment) {
                                $company_contractmodel->comment = htmlspecialchars($request->contractComment);
                            }
                            $company_contractmodel->save();

                        }

                        // suppression d'un contrat attaché à l'entreprise ??
                    }

                    DB::commit();
                    return response()->json(['message' => 'success'], 200);
                } catch (QueryException $e) {
                    DB::rollback(); // rq : consomme tout de même un id
                    return response()->json(['error' => 'erreur'], 500);
                }
                }
            } else {
                return response()->json(['message' => 'entreprise inexistante'], 202);
            }
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
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
            $company = Company::find($id);
            if($company !== null) {
                // ajouter une condition : uniquement le super admin
                DB::beginTransaction();
                try {
                    // suppression des contracts
                    $company_contractmodels = Company_contractmodel::where('company_id', $company->id)->get();
                    foreach($company_contractmodels as $company_contractmodel) {
                        $company_contractmodel->delete();
                    }

                    // suppression des tickets
                    $users = User::where('company_id', $company->id)->pluck('id');
                    $tickets = Ticket::whereIn('requester_id', $users)->get();
                    foreach($tickets as $ticket) {
                        $ticket->delete();
                    }

                    // suppression des utilisateurs
                    $users = User::where('company_id', $company->id)->get();
                    foreach($users as $user) {
                        $user->delete();
                    }

                    $company->delete();
                    DB::commit();
                    return response()->json(['message' => 'success'], 200);
                } catch (QueryException $e) {
                    DB::rollback();
                    return response()->json(['error' => $e->getMessage()], 500);
                }
            } else {
                return response()->json(['message' => 'entreprise inexistante'], 202);
            }
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }

    public function companyContracts(Company $company)
    {
        if(Auth::user()->admin || Auth::user()->company_id == $company->id){
            return Company_ContractmodelResource::collection($company->contractmodels()->orderBy('finalDate', 'DESC')->get());
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }
}
