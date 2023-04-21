<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->group(function() {
    Route::apiResources([
        'users' => 'UserController',
        'contractmodels' => 'ContractmodelController',
        'tickets' => 'TicketController',
    ]);
    Route::apiResource('companies' , 'CompanyController')->except('update');
    Route::post('/companies/{company}', 'CompanyController@update');
    Route::post('/addstep/tickets/{ticket}','TicketController@addStepTicket');
    Route::get('/tickets/users/{user}', 'TicketController@ticketByUser');
    Route::get('/tickets/companies/{company}', 'TicketController@ticketByCompany');
    
    Route::get('/tickets/steps/{step}','TicketController@ticketByStep');
    Route::get('/users/companies/{company}','UserController@userByCompany');
    Route::get('/contracts/companies/{company}','CompanyController@companyContracts');

    Route::get('/services','TableResourceController@servicesList');
    Route::get('/priorities','TableResourceController@prioritiesList');
    Route::get('/topics','TableResourceController@topicsList');
    Route::get('/steps','TableResourceController@stepsList');

    Route::fallback('FallbackController@index');
});

Route::get('/tickets/companies/{company}/pdf/{dateDebut}/{dateFin}/{filter}', 'TicketController@generatePdf');
