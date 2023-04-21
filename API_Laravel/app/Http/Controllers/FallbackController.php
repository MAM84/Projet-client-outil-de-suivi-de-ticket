<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FallbackController extends Controller
{
    public function index()
    {
        return response()->json(['message' => 'Requested route does not exist'], 500);
    }
}
