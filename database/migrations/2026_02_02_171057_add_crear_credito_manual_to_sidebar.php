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
        // Get the Admin module ID (or create it if it doesn't exist)
        $adminModulo = DB::table('modulos_sidebar')
            ->where('titulo', 'Admin')
            ->orWhere('ruta', '/admin')
            ->first();

        if (!$adminModulo) {
            // If Admin module doesn't exist, create it first
            $adminId = DB::table('modulos_sidebar')->insertGetId([
                'titulo' => 'Admin',
                'ruta' => '/admin',
                'icono' => 'Settings',
                'descripcion' => 'Administración del sistema',
                'orden' => 10,
                'activo' => true,
                'es_submenu' => false,
                'modulo_padre_id' => null,
                'categoria' => 'admin',
                'color' => 'bg-gray-500',
                'visible_dashboard' => true,
                'permisos' => json_encode(['admin.creditos.importar']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } else {
            $adminId = $adminModulo->id;
        }

        // Check if "Crear Crédito Manual" already exists
        $creditoExistente = DB::table('modulos_sidebar')
            ->where('ruta', '/admin/creditos/crear')
            ->exists();

        if (!$creditoExistente) {
            // Add "Crear Crédito Manual" submenu
            DB::table('modulos_sidebar')->insert([
                'titulo' => 'Crear Crédito Manual',
                'ruta' => '/admin/creditos/crear',
                'icono' => 'Plus',
                'descripcion' => 'Crear un nuevo crédito manual para un cliente',
                'orden' => 1,
                'activo' => true,
                'es_submenu' => true,
                'modulo_padre_id' => $adminId,
                'categoria' => 'admin',
                'color' => 'bg-gray-600',
                'visible_dashboard' => true,
                'permisos' => json_encode(['admin.creditos.importar']),
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
            ->where('ruta', '/admin/creditos/crear')
            ->delete();
    }
};
