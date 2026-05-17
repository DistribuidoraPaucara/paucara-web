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
        // Get the logística module ID
        $logisticaModulo = DB::table('modulos_sidebar')
            ->where('titulo', 'Logística')
            ->orWhere('ruta', '/logistica')
            ->first();

        if (!$logisticaModulo) {
            // If logística module doesn't exist, create it first
            $logisticaId = DB::table('modulos_sidebar')->insertGetId([
                'titulo' => 'Logística',
                'ruta' => '/logistica',
                'icono' => 'truck',
                'descripcion' => 'Gestión de logística y entregas',
                'orden' => 5,
                'activo' => true,
                'es_submenu' => false,
                'modulo_padre_id' => null,
                'categoria' => 'logistica',
                'color' => 'bg-blue-500',
                'visible_dashboard' => true,
                'permisos' => json_encode(['reportes-carga.index']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $logisticaId = $logisticaModulo->id;
        }

        // Add Reportes de Carga submenu
        DB::table('modulos_sidebar')->insert([
            'titulo' => 'Reportes de Carga',
            'ruta' => '/logistica/reportes',
            'icono' => 'file-text',
            'descripcion' => 'Gestión centralizada de reportes de carga',
            'orden' => 1,
            'activo' => true,
            'es_submenu' => true,
            'modulo_padre_id' => $logisticaId,
            'categoria' => 'logistica',
            'color' => 'bg-blue-600',
            'visible_dashboard' => true,
            'permisos' => json_encode(['reportes-carga.index']),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('modulos_sidebar')
            ->where('ruta', '/logistica/reportes')
            ->delete();
    }
};
