<?php

use App\Models\Empresa;
use Illuminate\Support\Facades\Route;

Route::get('/test-logo', function () {
    $empresa = Empresa::find(1);
    
    return view('test-logo', ['empresa' => $empresa]);
});
