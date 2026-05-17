<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Agregar estados PENDIENTE_RETIRO y PENDIENTE_ENVIO a venta_logistica
        // si no existen

        $estadosPendiente = [
            [
                'codigo' => 'PENDIENTE_RETIRO',
                'categoria' => 'venta_logistica',
                'nombre' => 'Pendiente de Retiro',
                'descripcion' => 'La venta está lista para ser retirada por el cliente',
                'color' => '#FFC107',
                'icono' => 'local-shipping',
                'orden' => 1,
                'activo' => true,
            ],
            [
                'codigo' => 'PENDIENTE_ENVIO',
                'categoria' => 'venta_logistica',
                'nombre' => 'Pendiente de Envío',
                'descripcion' => 'La venta está pendiente de envío',
                'color' => '#FF9800',
                'icono' => 'schedule',
                'orden' => 1,
                'activo' => true,
            ],
        ];

        foreach ($estadosPendiente as $estado) {
            // Verificar si ya existe
            $exists = DB::table('estados_logistica')
                ->where('codigo', $estado['codigo'])
                ->where('categoria', $estado['categoria'])
                ->exists();

            if (!$exists) {
                DB::table('estados_logistica')->insert(array_merge(
                    $estado,
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                ));
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar los estados agregados
        DB::table('estados_logistica')
            ->whereIn('codigo', ['PENDIENTE_RETIRO', 'PENDIENTE_ENVIO'])
            ->where('categoria', 'venta_logistica')
            ->delete();
    }
};
