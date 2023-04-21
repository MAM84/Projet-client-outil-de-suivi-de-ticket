<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ContractmodelResource;
use App\Contractmodel;
use Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;

class ContractmodelController extends Controller
{
    
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if(Auth::user()->admin){
            return ContractmodelResource::collection(Contractmodel::all());
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
            $validator = Validator::make($request->all(),['numberHours' => 'required|integer',
                                                     'durationMonth' => 'required|integer',
                                                     'service_id' => 'required|integer']);

            if($validator->fails()){
                return response()->json($validator->messages(),400);
            }else{
                try{
                    $contractmodel = new Contractmodel;
                    if($request->service_id){
                        $contractmodel->service_id = $request->service_id;
                    }
                    if($request->numberHours){
                        $contractmodel->numberHours = $request->numberHours;
                    }
                    if($request->durationMonth){
                        $contractmodel->durationMonth = $request->durationMonth;
                    }
        
                    $contractmodel->save();
        
                    return response()->json(['message' => 'success'], 200);
                }catch(QueryException $e){
                    return response()->json(['error' => $e->getMessage()], 500);
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
        if(Auth::user()->admin){
            $contractmodel = Contractmodel::find($id);
            if($contractmodel){
                return new ContractmodelResource($contractmodel);
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
            $contractmodel = Contractmodel::find($id);
            if($contractmodel) {
                $validator = Validator::make($request->all(),['numberHours' => 'required|integer',
                                                            'durationMonth' => 'required|integer',
                                                            'service_id' => 'required|integer']);

                if($validator->fails()){
                    return response()->json($validator->messages(),400);
                }else{
                    try {
                        if ($request->service_id) {
                            $contractmodel->service_id = $request->service_id;
                        }
                        if ($request->numberHours) {
                            $contractmodel->numberHours = $request->numberHours;
                        }
                        if ($request->durationMonth) {
                            $contractmodel->durationMonth = $request->durationMonth;
                        }
    
                        $contractmodel->save();
    
                        return response()->json(['message' => 'success'], 200);
                    } catch (QueryException $e) {
                        return response()->json(['error' => 'erreur'], 500);
                    }
                }
            } else {
                return response()->json(['message' => 'contractmodel inexistant'], 202);
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
    public function destroy($id)
    {
        if(Auth::user()->admin){
            $contractmodel = Contractmodel::find($id);
            if($contractmodel !== null){
                try{
                    $contractmodel->delete();
                    return response()->json(['message' => 'success'], 200);
                }catch(QueryException $e){
                    return response()->json(['error' => 'erreur'], 500);
                }
            }else{
                return response()->json(['message' => 'contractmodel inexistant'], 202);
            }
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }
}
