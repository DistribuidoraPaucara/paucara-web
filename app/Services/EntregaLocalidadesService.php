<?php

namespace App\Services;

use App\Models\Entrega;
use App\Models\Localidad;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SERVICIO: EntregaLocalidadesService
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * RESPONSABILIDAD:
 * Gestionar y obtener información sobre localidades en entregas
 *
 * RELACIÓN:
 *   Entrega → Ventas → Cliente → Localidad
 *
 * MÉTODOS DISPONIBLES:
 * - obtenerLocalidades(Entrega)      → Collection de Localidad
 * - obtenerLocalidadesResumen(Entrega) → Array con resumen agrupado
 * - esConsolidada(Entrega)           → Boolean (tiene múltiples localidades)
 * - obtenerLocalidadesPorEntregas()  → Array de entregas con sus localidades
 * - validarLocalidadEntrega()        → Validar si venta pertenece a localidad
 *
 * EJEMPLO DE USO:
 * ───────────────
 * $service = new EntregaLocalidadesService();
 * $localidades = $service->obtenerLocalidades($entrega);
 * $resumen = $service->obtenerLocalidadesResumen($entrega);
 *
 * INYECCIÓN DE DEPENDENCIAS:
 * ──────────────────────────
 * public function __construct(private EntregaLocalidadesService $service) {}
 * $localidades = $this->service->obtenerLocalidades($entrega);
 */
class EntregaLocalidadesService
{
    /**
     * Obtener todas las localidades de una entrega
     *
     * @param Entrega $entrega
     * @param bool $cargarRelaciones Si debe cargar relaciones (default: true)
     * @return Collection Collection de objetos Localidad (únicos)
     *
     * EJEMPLO:
     * $localidades = $service->obtenerLocalidades($entrega);
     * foreach ($localidades as $loc) {
     *     echo $loc->nombre; // "La Paz"
     * }
     */
    public function obtenerLocalidades(Entrega $entrega, bool $cargarRelaciones = true): Collection
    {
        Log::info('📍 [LOCALIDADES] Obteniendo localidades de entrega', [
            'entrega_id' => $entrega->id,
            'cargar_relaciones' => $cargarRelaciones,
        ]);

        // Cargar relaciones si no están ya cargadas
        if ($cargarRelaciones && !$entrega->relationLoaded('ventas')) {
            $entrega->load('ventas.cliente.localidad');
        }

        // Obtener localidades únicas
        $localidades = $entrega->ventas
            ->pluck('cliente.localidad')
            ->filter()  // Remover nulls
            ->unique('id')  // Localidades únicas por ID
            ->values();  // Re-indexar

        Log::info('✅ [LOCALIDADES] Localidades obtenidas', [
            'entrega_id' => $entrega->id,
            'cantidad' => $localidades->count(),
            'nombres' => $localidades->pluck('nombre')->toArray(),
        ]);

        return $localidades;
    }

    /**
     * Obtener información resumida de localidades (agrupadas)
     *
     * @param Entrega $entrega
     * @param bool $cargarRelaciones Si debe cargar relaciones (default: true)
     * @return array Array con estructura:
     *   [
     *     {
     *       'localidad_id' => 1,
     *       'localidad_nombre' => 'La Paz',
     *       'cantidad_ventas' => 3,
     *       'clientes' => ['Cliente A', 'Cliente B']
     *     }
     *   ]
     *
     * EJEMPLO:
     * $resumen = $service->obtenerLocalidadesResumen($entrega);
     * foreach ($resumen as $item) {
     *     echo "{$item['localidad_nombre']}: {$item['cantidad_ventas']} ventas";
     * }
     */
    public function obtenerLocalidadesResumen(Entrega $entrega, bool $cargarRelaciones = true): array
    {
        Log::info('📊 [LOCALIDADES] Obteniendo resumen de localidades', [
            'entrega_id' => $entrega->id,
        ]);

        // Cargar relaciones si no están ya cargadas
        if ($cargarRelaciones && !$entrega->relationLoaded('ventas')) {
            $entrega->load('ventas.cliente.localidad');
        }

        $localidades = [];

        // Agrupar por localidad
        foreach ($entrega->ventas as $venta) {
            $cliente = $venta->cliente;
            $localidad = $cliente?->localidad;

            if (!$localidad) {
                continue;
            }

            $localidadId = $localidad->id;

            // Inicializar si no existe
            if (!isset($localidades[$localidadId])) {
                $localidades[$localidadId] = [
                    'localidad_id' => $localidad->id,
                    'localidad_nombre' => $localidad->nombre,
                    'localidad_codigo' => $localidad->codigo ?? null,
                    'cantidad_ventas' => 0,
                    'clientes' => [],
                ];
            }

            // Incrementar cantidad de ventas
            $localidades[$localidadId]['cantidad_ventas']++;

            // Agregar cliente si no existe
            if ($cliente && !in_array($cliente->nombre, $localidades[$localidadId]['clientes'])) {
                $localidades[$localidadId]['clientes'][] = $cliente->nombre;
            }
        }

        $resultado = array_values($localidades);

        Log::info('✅ [LOCALIDADES] Resumen generado', [
            'entrega_id' => $entrega->id,
            'cantidad_localidades' => count($resultado),
        ]);

        return $resultado;
    }

    /**
     * Validar si una entrega tiene múltiples localidades
     *
     * @param Entrega $entrega
     * @return bool true si tiene 2 o más localidades
     *
     * EJEMPLO:
     * if ($service->esConsolidada($entrega)) {
     *     // Aplicar lógica especial
     * }
     */
    public function esConsolidada(Entrega $entrega): bool
    {
        $localidades = $this->obtenerLocalidades($entrega);
        $resultado = $localidades->count() > 1;

        Log::info('🔍 [LOCALIDADES] Validación de consolidación', [
            'entrega_id' => $entrega->id,
            'es_consolidada' => $resultado,
            'cantidad_localidades' => $localidades->count(),
        ]);

        return $resultado;
    }

    /**
     * Obtener cantidad de localidades de una entrega
     *
     * @param Entrega $entrega
     * @return int Número de localidades únicas
     *
     * EJEMPLO:
     * $cantidad = $service->obtenerCantidadLocalidades($entrega);
     */
    public function obtenerCantidadLocalidades(Entrega $entrega): int
    {
        return $this->obtenerLocalidades($entrega)->count();
    }

    /**
     * Obtener datos completos de localidades con formato estructurado
     *
     * @param Entrega $entrega
     * @return array Array estructurado con todas las localidades
     *
     * ESTRUCTURA RETORNADA:
     * [
     *   'localidades' => [...],
     *   'localidades_resumen' => [...],
     *   'cantidad_localidades' => 2,
     *   'es_consolidada' => true,
     *   'entrega_id' => 42,
     *   'numero_entrega' => 'ENT-20260207-001'
     * ]
     *
     * EJEMPLO:
     * $datos = $service->obtenerDatosCompletos($entrega);
     */
    public function obtenerDatosCompletos(Entrega $entrega): array
    {
        Log::info('📋 [LOCALIDADES] Obteniendo datos completos', [
            'entrega_id' => $entrega->id,
        ]);

        $localidades = $this->obtenerLocalidades($entrega);
        $resumen = $this->obtenerLocalidadesResumen($entrega);
        $esConsolidada = $this->esConsolidada($entrega);

        // Formatear localidades
        $localidadesFormato = $localidades->map(fn($loc) => [
            'id' => $loc->id,
            'nombre' => $loc->nombre,
            'codigo' => $loc->codigo ?? null,
        ])->toArray();

        return [
            'localidades' => $localidadesFormato,
            'localidades_resumen' => $resumen,
            'cantidad_localidades' => count($localidadesFormato),
            'es_consolidada' => $esConsolidada,
            'entrega_id' => $entrega->id,
            'numero_entrega' => $entrega->numero_entrega,
        ];
    }

    /**
     * Validar si una venta pertenece a una localidad específica en una entrega
     *
     * @param Entrega $entrega
     * @param int $ventaId ID de la venta
     * @param int $localidadId ID de la localidad
     * @return bool true si la venta de esa entrega está en esa localidad
     *
     * EJEMPLO:
     * $pertenece = $service->validarLocalidadVentaEntrega($entrega, 100, 1);
     */
    public function validarLocalidadVentaEntrega(Entrega $entrega, int $ventaId, int $localidadId): bool
    {
        Log::info('🔍 [LOCALIDADES] Validando localidad de venta', [
            'entrega_id' => $entrega->id,
            'venta_id' => $ventaId,
            'localidad_id' => $localidadId,
        ]);

        if (!$entrega->relationLoaded('ventas')) {
            $entrega->load('ventas.cliente.localidad');
        }

        $venta = $entrega->ventas->firstWhere('id', $ventaId);

        if (!$venta || !$venta->cliente || !$venta->cliente->localidad) {
            Log::warning('⚠️ [LOCALIDADES] Venta o localidad no encontrada', [
                'entrega_id' => $entrega->id,
                'venta_id' => $ventaId,
            ]);
            return false;
        }

        $resultado = $venta->cliente->localidad->id === $localidadId;

        Log::info('✅ [LOCALIDADES] Validación completada', [
            'entrega_id' => $entrega->id,
            'venta_id' => $ventaId,
            'valido' => $resultado,
        ]);

        return $resultado;
    }

    /**
     * Obtener localidades comunes entre múltiples entregas
     *
     * @param array|Collection $entregas IDs de entregas o colección de modelos Entrega
     * @return Collection Localidades que aparecen en TODAS las entregas
     *
     * EJEMPLO:
     * $entregas = [42, 43, 44];
     * $localesComunes = $service->obtenerLocalidadesComunes($entregas);
     */
    public function obtenerLocalidadesComunes($entregas): Collection
    {
        Log::info('🔍 [LOCALIDADES] Buscando localidades comunes', [
            'cantidad_entregas' => is_countable($entregas) ? count($entregas) : '?',
        ]);

        // Convertir IDs a modelos si es necesario
        if (!is_iterable($entregas)) {
            $entregas = [$entregas];
        }

        $entregas = collect($entregas)->map(fn($e) => $e instanceof Entrega ? $e : Entrega::find($e));

        if ($entregas->isEmpty()) {
            return collect();
        }

        // Obtener localidades de la primera entrega
        $localidadesComunes = $this->obtenerLocalidades($entregas->first())->pluck('id');

        // Intersectar con las demás
        foreach ($entregas->slice(1) as $entrega) {
            $localidadesEntrega = $this->obtenerLocalidades($entrega)->pluck('id');
            $localidadesComunes = $localidadesComunes->intersect($localidadesEntrega);
        }

        // Obtener modelos completos
        $resultado = Localidad::whereIn('id', $localidadesComunes)->get();

        Log::info('✅ [LOCALIDADES] Localidades comunes encontradas', [
            'cantidad' => $resultado->count(),
            'nombres' => $resultado->pluck('nombre')->toArray(),
        ]);

        return $resultado;
    }

    /**
     * Obtener todas las entregas que cubren una localidad específica
     *
     * @param int $localidadId ID de la localidad
     * @return Collection Colección de entregas
     *
     * EJEMPLO:
     * $entregas = $service->obtenerEntregasPorLocalidad(1);
     */
    public function obtenerEntregasPorLocalidad(int $localidadId): Collection
    {
        Log::info('🔍 [LOCALIDADES] Buscando entregas por localidad', [
            'localidad_id' => $localidadId,
        ]);

        $entregas = Entrega::with('ventas.cliente.localidad')
            ->get()
            ->filter(function ($entrega) use ($localidadId) {
                $localidades = $this->obtenerLocalidades($entrega);
                return $localidades->contains('id', $localidadId);
            })
            ->values();

        Log::info('✅ [LOCALIDADES] Entregas encontradas', [
            'localidad_id' => $localidadId,
            'cantidad_entregas' => $entregas->count(),
        ]);

        return $entregas;
    }
}
