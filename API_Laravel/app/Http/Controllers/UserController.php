<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\User;
use App\Company;
use Illuminate\Support\Facades\Hash;
use App\Http\Requests\UserRequest;
use Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        if(Auth::user()->admin){
            return UserResource::collection(User::orderBy('created_at', 'desc')->get());
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
                'firstname' => 'nullable|string',
                'function' => 'nullable|string',
                'phone' => 'nullable|string',
                'email' => 'required|email',
                'admin' => 'required|boolean',
                'company_id' => 'required|integer',
                'comment' => 'nullable|string',
                'password' => 'required|min:5|max:255'
            ]);

            if($validator->fails()) {
                return response()->json($validator->messages(),400);
            } else {
                try{
                    $user = new User;
                    if($request->name){
                        $user->name = $request->name;
                    }
                    if($request->firstname){
                        $user->firstname = $request->firstname;
                    }
                    if($request->function){
                        $user->function = $request->function;
                    }
                    if($request->phone){
                        $user->phone = $request->phone;
                    }
                    if($request->email){
                        $user->email = $request->email;
                    }
                    if($request->password){
                        $user->password = Hash::make($request->password);
                    }
                    if($request->admin){
                        $user->admin = $request->admin;
                    }
                    if($request->company_id){
                        $user->company_id = $request->company_id;
                    }
                    if($request->comment){
                        $user->comment = $request->comment;
                    }

                    $user->save();

                    return response()->json(['message' => 'success'], 200);
                }catch(QueryException $e){
                    $errorSQL = explode(' ', $e->getMessage());
                    if (in_array("'users_email_unique'", $errorSQL)){
                        return response()->json(['email' => "Cet email est déjà présent dans nos bases de données"], 500);
                        
                    }else{
                        return response()->json(['error' => $e->getMessage()], 500);
                    }
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
    public function show($id)
    {
        if(Auth::user()->admin || Auth::user()->id == $id){
            $user = User::find($id);
            if($user) {
                return new UserResource($user);
            } else {
                return response()->json(['message' => 'user inexistant'], 202);
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
        if(Auth::user()->admin || Auth::user()->id == $id){
            $user = User::find($id);
            if($user){
                $validator = Validator::make($request->all(),['name' => 'required|string',
                                                            'firstname' => 'nullable|string',
                                                            'function' => 'nullable|string',
                                                            'phone' => 'nullable|string',
                                                            'email' => 'required|email',
                                                            'admin' => 'required|boolean',
                                                            'company_id' => 'required|integer',
                                                            'comment' => 'nullable|string',
                                                            'password' => 'nullable|min:5|max:255']);
                if($validator->fails()){
                    return response()->json($validator->messages(),400);
                }else{
                    try{
                        if($request->name){
                            $user->name = $request->name;
                        }
                        if($request->firstname){
                            $user->firstname = $request->firstname;
                        }
                        if($request->function){
                            $user->function = $request->function;
                        }
                        if($request->phone){
                            $user->phone = $request->phone;
                        }
                        if($request->email){
                            $user->email = $request->email;
                        }
                        if($request->password){
                            $user->password = Hash::make($request->password);
                        }
                        if(isset($request->admin)){
                            $user->admin = $request->admin;
                        }
                        if($request->company_id){
                            $user->company_id = $request->company_id;
                        }
                        if($request->comment){
                            $user->comment = $request->comment;
                        }

                        $user->save();

                        return response()->json(['message' => 'success'], 200);

                    }catch(QueryException $e){
                        $errorSQL = explode(' ', $e->getMessage());
                        if (in_array("'users_email_unique'", $errorSQL)){
                            return response()->json(['email' => "Cet email est déjà présent dans nos bases de données"], 500);
                        }else{
                            return response()->json(['error' => "erreur"], 500);
                        }
                    }
                }

            }else {
                return response()->json(['message' => 'user inexistant'], 202);
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
            $user = User::find($id);
            if($user !== null) {
                try{
                    $user->delete();
                    return response()->json(['message' => 'success'], 200);
                }catch(QueryException $e){
                    return response()->json(['error' => 'erreur'], 500);
                }
            }else{
                return response()->json(['message' => 'user inexistant'], 202);
            }
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }

    public function userByCompany(Company $company)
    {
        if(Auth::user()->admin || Auth::user()->company_id == $company->id){
            return UserResource::collection(User::where('company_id', $company->id)->orderBy('created_at', 'desc')->get());
        }else{
            return response()->json(['message' => 'action non autorisée'], 401);
        }
    }
}
