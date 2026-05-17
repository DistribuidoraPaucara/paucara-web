<?php

use App\Http\Controllers\ConfiguracionGlobalController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Rutas de Configuración Global
|--------------------------------------------------------------------------
*/

Route::prefix('configuracion-global')->name('configuracion-global.')->group(function () {
    // Obtener todas las configuraciones
    Route::get('/', [ConfiguracionGlobalController::class, 'index'])->name('index');

    // Obtener configuraciones específicas de ganancias
    Route::get('/ganancias', [ConfiguracionGlobalController::class, 'configuracionesGanancias'])->name('ganancias');

    // Actualizar configuraciones de ganancias en lote
    Route::put('/ganancias', [ConfiguracionGlobalController::class, 'actualizarConfiguracionesGanancias'])->name('ganancias.update');

    // Crear nueva configuración
    Route::post('/', [ConfiguracionGlobalController::class, 'store'])->name('store');

    // Obtener configuración específica por clave
    Route::get('/{clave}', [ConfiguracionGlobalController::class, 'show'])->name('show');

    // Actualizar configuración específica
    Route::put('/{clave}', [ConfiguracionGlobalController::class, 'update'])->name('update');

    // Resetear configuración a valores por defecto
    Route::patch('/{clave}/reset', [ConfiguracionGlobalController::class, 'resetear'])->name('reset');
});
