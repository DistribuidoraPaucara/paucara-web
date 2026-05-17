<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Actualizar entregas existentes que tienen estado_entrega_id = NULL
     *
     * Mapea el estado ENUM al estado_entrega_id basado en estados_logistica
     */
    public function up(): void
    {
        echo "\n🔄 [MIGRATION] Actualizando entregas.estado_entrega_id...\n";

        // Obtener todos los estados entrega_logistica
        $estados = DB::table('estados_logistica')
            ->where('categoria', 'entrega_logistica')
            ->pluck('id', 'codigo')
            ->toArray();

        if (empty($estados)) {
            echo "⚠️  [MIGRATION] No hay estados entrega_logistica en BD. Saltando migración.\n";
            return;
        }

        echo "📋 Estados disponibles:\n";
        foreach ($estados as $codigo => $id) {
            echo "   ✓ $codigo → ID: $id\n";
        }

        // Mapeo: estado ENUM → estado_logistica.id
        $mapeos = [
            'PROGRAMADO'         => $estados['PROGRAMADO'] ?? null,
            'PREPARACION_CARGA'  => $estados['PREPARACION_CARGA'] ?? null,
            'LISTO_PARA_ENTREGA' => $estados['LISTO_PARA_ENTREGA'] ?? null,
            'EN_TRANSITO'        => $estados['EN_TRANSITO'] ?? null,
            'LLEGO'              => $estados['LLEGO'] ?? null,
            'ENTREGADO'          => $estados['ENTREGADO'] ?? null,
            'NOVEDAD'            => $estados['NOVEDAD'] ?? null,
            'RECHAZADO'          => $estados['RECHAZADO'] ?? null,
            'CANCELADA'          => $estados['CANCELADA'] ?? null,
        ];

        $actualizado = 0;
        $noMapeado   = 0;

        echo "\n🔄 Procesando entregas...\n";

        // Obtener todas las entregas con estado_entrega_id = NULL
        $entregas = DB::table('entregas')
            ->whereNull('estado_entrega_id')
            ->where('estado', '!=', null)
            ->get(['id', 'numero_entrega', 'estado']);

        if ($entregas->isEmpty()) {
            echo "✅ No hay entregas con estado_entrega_id = NULL\n";
            return;
        }

        echo "📊 Encontradas " . $entregas->count() . " entregas para actualizar\n\n";

        foreach ($entregas as $entrega) {
            $estadoId = $mapeos[$entrega->estado] ?? null;

            if ($estadoId) {
                DB::table('entregas')
                    ->where('id', $entrega->id)
                    ->update(['estado_entrega_id' => $estadoId]);

                echo "✅ ENT-$entrega->id ($entrega->numero_entrega) → $entrega->estado (ID: $estadoId)\n";
                $actualizado++;
            } else {
                echo "❌ ENT-$entrega->id ($entrega->numero_entrega) → Estado '$entrega->estado' NO MAPEADO\n";
                $noMapeado++;
            }
        }

        echo "\n" . str_repeat("─", 60) . "\n";
        echo "✅ Actualizadas: $actualizado entregas\n";
        echo "❌ No mapeadas: $noMapeado entregas\n";
        echo str_repeat("─", 60) . "\n\n";
    }

    public function down(): void
    {
        // Restaurar a NULL (reversible)
        DB::table('entregas')
            ->update(['estado_entrega_id' => null]);

        echo "⚠️  [MIGRATION] entregas.estado_entrega_id restaurado a NULL\n";
    }
};
