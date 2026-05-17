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
        // Get the Ventas module ID
        $ventasModulo = DB::table('modulos_sidebar')
            ->where('titulo', 'Ventas')
            ->orWhere('ruta', '/ventas')
            ->first();

        if (!$ventasModulo) {
            // If Ventas module doesn't exist, create it first
            $ventasId = DB::table('modulos_sidebar')->insertGetId([
                'titulo' => 'Ventas',
                'ruta' => '/ventas',
                'icono' => 'ShoppingCart',
                'descripcion' => 'Gestión de ventas',
                'orden' => 2,
                'activo' => true,
                'es_submenu' => false,
                'modulo_padre_id' => null,
                'categoria' => 'ventas',
                'color' => 'bg-green-500',
                'visible_dashboard' => true,
                'permisos' => json_encode(['ventas.index']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $ventasId = $ventasModulo->id;
        }

        // Check if Cuentas por Cobrar already exists
        $cuentasExistente = DB::table('modulos_sidebar')
            ->where('ruta', '/ventas/cuentas-por-cobrar')
            ->exists();

        if (!$cuentasExistente) {
            // Add Cuentas por Cobrar submenu
            DB::table('modulos_sidebar')->insert([
                'titulo' => 'Cuentas por Cobrar',
                'ruta' => '/ventas/cuentas-por-cobrar',
                'icono' => 'CreditCard',
                'descripcion' => 'Gestión de deudas de clientes',
                'orden' => 2,
                'activo' => true,
                'es_submenu' => true,
                'modulo_padre_id' => $ventasId,
                'categoria' => 'ventas',
                'color' => 'bg-green-600',
                'visible_dashboard' => true,
                'permisos' => json_encode(['ventas.index']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('modulos_sidebar')
            ->where('ruta', '/ventas/cuentas-por-cobrar')
            ->delete();
    }
};
