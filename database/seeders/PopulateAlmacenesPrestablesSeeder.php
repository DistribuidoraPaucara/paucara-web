<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PopulateAlmacenesPrestablesSeeder extends Seeder
{
    /**
     * Populate almacenes_prestables from almacenes table.
     * This runs after AlmacenesUbicacionSeeder creates almacenes.
     */
    public function run(): void
    {
        // Get all almacenes that aren't already in almacenes_prestables
        $almacenes = DB::table('almacenes')
            ->leftJoin('almacenes_prestables', 'almacenes.id', '=', 'almacenes_prestables.id')
            ->whereNull('almacenes_prestables.id')
            ->select(
                'almacenes.id',
                'almacenes.empresa_id',
                'almacenes.nombre',
                'almacenes.direccion',
                'almacenes.ubicacion_fisica',
                'almacenes.requiere_transporte_externo',
                'almacenes.responsable',
                'almacenes.telefono',
                'almacenes.activo',
                'almacenes.created_at',
                'almacenes.updated_at'
            )
            ->get();

        foreach ($almacenes as $almacen) {
            DB::table('almacenes_prestables')->insert([
                'id' => $almacen->id,
                'empresa_id' => $almacen->empresa_id,
                'nombre' => $almacen->nombre,
                'direccion' => $almacen->direccion,
                'ubicacion_fisica' => $almacen->ubicacion_fisica,
                'requiere_transporte_externo' => $almacen->requiere_transporte_externo,
                'responsable' => $almacen->responsable,
                'telefono' => $almacen->telefono,
                'es_proveedor' => false,
                'activo' => $almacen->activo,
                'created_at' => $almacen->created_at,
                'updated_at' => $almacen->updated_at,
            ]);
        }
    }
}
