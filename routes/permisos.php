<?php
// routes/permisos.php

use App\Http\Controllers\PermissionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    // ⚠️ IMPORTANTE: Las rutas estáticas DEBEN ir ANTES del Route::resource()

    // Rutas de gestión de permisos - usa PermissionController existente
    Route::get('/permisos', [PermissionController::class, 'index'])->name('permissions.index');
    Route::get('/permisos/create', [PermissionController::class, 'create'])->name('permissions.create');
    Route::post('/permisos', [PermissionController::class, 'store'])->name('permissions.store');
    Route::get('/permisos/{permission}/edit', [PermissionController::class, 'edit'])->name('permissions.edit');
    Route::put('/permisos/{permission}', [PermissionController::class, 'update'])->name('permissions.update');
    Route::delete('/permisos/{permission}', [PermissionController::class, 'destroy'])->name('permissions.destroy');

});
