<?php
// routes/roles.php

use App\Http\Controllers\RoleController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {

    // ⚠️ IMPORTANTE: Las rutas estáticas DEBEN ir ANTES del Route::resource()

    // Rutas para vistas avanzadas de gestión de roles (Sistema C)
    // TODO: Crear páginas de templates y compare
    // Route::get('admin/permisos/roles/templates', fn() => Inertia::render('admin/permisos/roles/templates'))->name('roles.templates.page');
    // Route::get('admin/permisos/roles/compare', fn() => Inertia::render('admin/permisos/roles/compare'))->name('roles.compare.page');

    // Ruta adicional para crear funcionalidad (trait) para un rol existente
    Route::post('admin/permisos/roles/{role}/crear-funcionalidad', [RoleController::class, 'crearFuncionalidad'])
        ->name('roles.crear-funcionalidad')
        ->middleware('permission:roles.edit');

    // Rutas de gestión de roles (esto va AL FINAL para no interferir con rutas estáticas)
    Route::resource('admin/permisos/roles', RoleController::class);

});
