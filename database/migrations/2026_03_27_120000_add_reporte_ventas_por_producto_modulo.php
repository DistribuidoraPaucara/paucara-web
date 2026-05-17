<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Obtener el módulo padre "Ventas" (si existe)
        $moduloPadreId = DB::table('modulos_sidebar')
            ->where('titulo', 'Ventas')
            ->value('id');

        // Si existe "Ventas", agregar sub-módulo
        DB::table('modulos_sidebar')->insert([
            'titulo' => 'Reporte: Ventas por Producto',
            'ruta' => '/ventas/reportes/ventas-por-producto',
            'icono' => 'TrendingUp',
            'descripcion' => 'Ver todas las ventas de un producto por fecha',
            'modulo_padre_id' => $moduloPadreId,
            'activo' => true,
            'es_submenu' => !is_null($moduloPadreId),
            'orden' => 99,
            'permisos' => json_encode(['ventas.index']),
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
            ->where('titulo', 'Reporte: Ventas por Producto')
            ->where('ruta', '/ventas/reportes/ventas-por-producto')
            ->delete();
    }
};
