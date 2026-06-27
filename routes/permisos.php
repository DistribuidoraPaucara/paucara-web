<?php
// routes/permisos.php

use App\Http\Controllers\PermissionController;
use Illuminate\Support\Facades\Route;

// ⚠️ IMPORTANTE: Las rutas estáticas DEBEN ir ANTES del Route::resource()
// Nota: Este archivo se incluye dentro del middleware group de web.php, así que NO duplicamos el middleware aquí

// Rutas de gestión de permisos - usa PermissionController existente
Route::get('/permisos', [PermissionController::class, 'index'])->name('permisos.index');
Route::get('/permisos/create', [PermissionController::class, 'create'])->name('permisos.create');
Route::post('/permisos', [PermissionController::class, 'store'])->name('permisos.store');
Route::get('/permisos/{permission}/edit', [PermissionController::class, 'edit'])->name('permisos.edit');
Route::put('/permisos/{permission}', [PermissionController::class, 'update'])->name('permisos.update');
Route::delete('/permisos/{permission}', [PermissionController::class, 'destroy'])->name('permisos.destroy');
