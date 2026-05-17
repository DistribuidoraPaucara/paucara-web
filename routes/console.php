<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// Programar limpieza automática de reservas expiradas
// Se ejecuta todos los días a las 2:00 AM
Schedule::command('proforma:limpiar-reservas-expiradas --force')
    ->dailyAt('02:00')
    ->timezone('America/La_Paz')
    ->withoutOverlapping()
    ->runInBackground()
    ->onSuccess(function () {
        \Illuminate\Support\Facades\Log::info('Limpieza automática de reservas expiradas completada con éxito');
    })
    ->onFailure(function () {
        \Illuminate\Support\Facades\Log::error('Falló la limpieza automática de reservas expiradas');
    });
