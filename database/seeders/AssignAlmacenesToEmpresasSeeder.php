<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AssignAlmacenesToEmpresasSeeder extends Seeder
{
    /**
     * Asigna almacenes a las empresas existentes.
     *
     * Asigna:
     * - almacen_id_principal: ID 1 (Depósito) por defecto
     * - almacen_id_venta: ID 2 (Sala de Ventas) por defecto
     *
     * Esto parametriza la búsqueda de stock según la empresa.
     */
    public function run(): void
    {
        // Obtener todas las empresas activas
        $empresas = DB::table('empresas')
            ->where('activo', true)
            ->get();

        if ($empresas->isEmpty()) {
            $this->command->info('No hay empresas para asignar almacenes.');
            return;
        }

        // Obtener almacenes disponibles
        // Primero intenta con "Almacén Principal", luego con "Depósito"
        $almacenPrincipal = DB::table('almacenes')
            ->whereIn('nombre', ['Almacén Principal', 'Depósito'])
            ->first();

        $almacenVentas = DB::table('almacenes')
            ->where('nombre', 'Sala de Ventas')
            ->first();

        if (!$almacenPrincipal || !$almacenVentas) {
            $this->command->warn('No se encontraron almacenes requeridos.');
            $this->command->info('Almacenes disponibles:');

            $almacenesDisponibles = DB::table('almacenes')->get(['id', 'nombre']);
            foreach ($almacenesDisponibles as $almacen) {
                $this->command->line("  ID {$almacen->id}: {$almacen->nombre}");
            }
            return;
        }

        // Asignar almacenes a cada empresa
        $almacenPrincipalId = $almacenPrincipal->id;
        $almacenVentaId = $almacenVentas->id;

        $updated = 0;
        foreach ($empresas as $empresa) {
            DB::table('empresas')
                ->where('id', $empresa->id)
                ->update([
                    'almacen_id_principal' => $almacenPrincipalId,
                    'almacen_id_venta' => $almacenVentaId,
                ]);
            $updated++;
        }

        $this->command->info("✓ Se asignaron almacenes a {$updated} empresa(s):");
        $this->command->line("  • Almacén Principal: {$almacenPrincipal->nombre} (ID: {$almacenPrincipalId})");
        $this->command->line("  • Almacén de Venta: {$almacenVentas->nombre} (ID: {$almacenVentaId})");
    }
}
