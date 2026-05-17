<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Eliminar módulos duplicados con ruta '/proformas'
        // Mantener solo el primero (con el ID más bajo)
        $duplicates = DB::table('modulos_sidebar')
            ->where('ruta', '/proformas')
            ->orderBy('id')
            ->get();

        if ($duplicates->count() > 1) {
            // Mantener el primero, eliminar el resto
            $idsToDelete = $duplicates->slice(1)->pluck('id')->toArray();
            DB::table('modulos_sidebar')
                ->whereIn('id', $idsToDelete)
                ->delete();
        }

        // También verificar y limpiar otros duplicados por ruta
        $routes = DB::table('modulos_sidebar')
            ->select('ruta')
            ->where('es_submenu', false)
            ->groupBy('ruta')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('ruta')
            ->toArray();

        foreach ($routes as $route) {
            $duplicates = DB::table('modulos_sidebar')
                ->where('ruta', $route)
                ->where('es_submenu', false)
                ->orderBy('id')
                ->get();

            if ($duplicates->count() > 1) {
                $idsToDelete = $duplicates->slice(1)->pluck('id')->toArray();
                DB::table('modulos_sidebar')
                    ->whereIn('id', $idsToDelete)
                    ->delete();
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // No se puede revertir esta migración ya que elimina datos
        // Para revertir, ejecutar: php artisan db:seed --class=ModuloSidebarSeeder
    }
};
