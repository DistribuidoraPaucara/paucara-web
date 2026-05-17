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
        // Obtener IDs de los estados que existen
        $estadoPendienteRetiro = DB::table('estados_logistica')
            ->where('codigo', 'PENDIENTE_RETIRO')
            ->where('categoria', 'venta_logistica')
            ->first();

        $estadoPendienteEnvio = DB::table('estados_logistica')
            ->where('codigo', 'PENDIENTE_ENVIO')
            ->where('categoria', 'venta_logistica')
            ->first();

        // Estos estados podrían no existir en todas las instalaciones
        // Solo crear transiciones si ambos estados nuevos existen
        if ($estadoPendienteRetiro && $estadoPendienteEnvio) {
            // Solo crear transiciones si hay otros estados para transicionar
            // Esto es opcional - si no existen otros estados, simplemente no creamos las transiciones

            // Obtener otros estados si existen
            $estadoProgramado = DB::table('estados_logistica')
                ->where('codigo', 'PROGRAMADO')
                ->where('categoria', 'venta_logistica')
                ->first();

            $estadoEnPreparacion = DB::table('estados_logistica')
                ->where('codigo', 'EN_PREPARACION')
                ->where('categoria', 'venta_logistica')
                ->first();

            $estadoCancelada = DB::table('estados_logistica')
                ->where('codigo', 'CANCELADA')
                ->where('categoria', 'venta_logistica')
                ->first();

            // Transiciones desde PENDIENTE_RETIRO (solo si destino existe)
            if ($estadoProgramado) {
                $exists = DB::table('transiciones_estado')
                    ->where('estado_origen_id', $estadoPendienteRetiro->id)
                    ->where('estado_destino_id', $estadoProgramado->id)
                    ->where('categoria', 'venta_logistica')
                    ->exists();

                if (!$exists) {
                    DB::table('transiciones_estado')->insert([
                        'estado_origen_id' => $estadoPendienteRetiro->id,
                        'estado_destino_id' => $estadoProgramado->id,
                        'categoria' => 'venta_logistica',
                        'automatica' => false,
                        'notificar' => true,
                        'activa' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            if ($estadoCancelada) {
                $exists = DB::table('transiciones_estado')
                    ->where('estado_origen_id', $estadoPendienteRetiro->id)
                    ->where('estado_destino_id', $estadoCancelada->id)
                    ->where('categoria', 'venta_logistica')
                    ->exists();

                if (!$exists) {
                    DB::table('transiciones_estado')->insert([
                        'estado_origen_id' => $estadoPendienteRetiro->id,
                        'estado_destino_id' => $estadoCancelada->id,
                        'categoria' => 'venta_logistica',
                        'automatica' => false,
                        'notificar' => true,
                        'activa' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            // Transiciones desde PENDIENTE_ENVIO
            if ($estadoEnPreparacion) {
                $exists = DB::table('transiciones_estado')
                    ->where('estado_origen_id', $estadoPendienteEnvio->id)
                    ->where('estado_destino_id', $estadoEnPreparacion->id)
                    ->where('categoria', 'venta_logistica')
                    ->exists();

                if (!$exists) {
                    DB::table('transiciones_estado')->insert([
                        'estado_origen_id' => $estadoPendienteEnvio->id,
                        'estado_destino_id' => $estadoEnPreparacion->id,
                        'categoria' => 'venta_logistica',
                        'automatica' => false,
                        'notificar' => true,
                        'activa' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            if ($estadoCancelada) {
                $exists = DB::table('transiciones_estado')
                    ->where('estado_origen_id', $estadoPendienteEnvio->id)
                    ->where('estado_destino_id', $estadoCancelada->id)
                    ->where('categoria', 'venta_logistica')
                    ->exists();

                if (!$exists) {
                    DB::table('transiciones_estado')->insert([
                        'estado_origen_id' => $estadoPendienteEnvio->id,
                        'estado_destino_id' => $estadoCancelada->id,
                        'categoria' => 'venta_logistica',
                        'automatica' => false,
                        'notificar' => true,
                        'activa' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Obtener IDs de los estados
        $estadoPendienteRetiro = DB::table('estados_logistica')
            ->where('codigo', 'PENDIENTE_RETIRO')
            ->where('categoria', 'venta_logistica')
            ->first();

        $estadoPendienteEnvio = DB::table('estados_logistica')
            ->where('codigo', 'PENDIENTE_ENVIO')
            ->where('categoria', 'venta_logistica')
            ->first();

        if ($estadoPendienteRetiro) {
            DB::table('transiciones_estado')
                ->where('estado_origen_id', $estadoPendienteRetiro->id)
                ->where('categoria', 'venta_logistica')
                ->delete();
        }

        if ($estadoPendienteEnvio) {
            DB::table('transiciones_estado')
                ->where('estado_origen_id', $estadoPendienteEnvio->id)
                ->where('categoria', 'venta_logistica')
                ->delete();
        }
    }
};
