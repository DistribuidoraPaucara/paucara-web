<?php

namespace App\Services\Logistica;

use App\Models\DetalleVenta;
use App\Models\Entrega;
use App\Models\ReporteCarga;
use App\Models\ReporteCargaDetalle;
use App\Models\Venta;
use App\Services\Traits\LogsOperations;
use App\Services\Traits\ManagesTransactions;
use App\Services\WebSocket\EntregaWebSocketService;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

/**
 * ReporteCargoService - Gestión de reportes de carga para entregas
 *
 * RESPONSABILIDADES:
 * ✓ Generar reportes de carga desde entregas/ventas
 * ✓ Gestionar detalles de carga (productos, cantidades)
 * ✓ Cambiar estado de reportes
 * ✓ Registrar verificación de carga
 * ✓ Calcular métricas de carga
 *
 * INVARIANTE: ÚNICO punto donde se crean y modifican reportes de carga
 */
class ReporteCargoService
{
    use ManagesTransactions, LogsOperations;

    public function __construct(
        private EntregaWebSocketService $webSocketService,
    ) {}

    /**
     * Generar un reporte de carga para una entrega
     *
     * @param Entrega $entrega Entrega para la cual generar el reporte
     * @param array $datos Datos adicionales del reporte (vehiculo_id, descripcion, etc.)
     * @return ReporteCarga Reporte creado
     * @throws Exception
     */
    public function generarReporteDesdeEntrega(Entrega $entrega, array $datos = []): ReporteCarga
    {
        // ✅ CORREGIDO: Removido $this->transaction() para evitar anidamiento de transacciones en PostgreSQL
        // La transacción exterior en EntregaService::crearLote() manejará todo
        // ✅ FASE 3: Actualizado para trabajar con N:M relación (1 entrega, N ventas)

        try {
            // Obtener todas las ventas asociadas a la entrega (N:M via pivot)
            $ventas = $entrega->ventas()->with('detalles.producto')->get();

            if ($ventas->count() === 0) {
                throw new Exception("La entrega {$entrega->id} no tiene ventas asociadas");
            }

            // Generar número de reporte único
            $numeroReporte = ReporteCarga::generarNumeroReporte();

            // Crear el reporte (venta_id = null ahora ya que tiene múltiples ventas)
            // ✅ CORREGIDO: Para operaciones en lote, no asignamos generado_por ya que es una operación del sistema
            $reporte = ReporteCarga::create([
                'numero_reporte' => $numeroReporte,
                'entrega_id' => $entrega->id,
                'vehiculo_id' => $datos['vehiculo_id'] ?? null,
                'venta_id' => null,  // NULL ahora (múltiples ventas via N:M)
                'descripcion' => $datos['descripcion'] ?? "Reporte de {$ventas->count()} ventas",
                'peso_total_kg' => $datos['peso_total_kg'] ?? 0,
                'volumen_total_m3' => $datos['volumen_total_m3'] ?? null,
                'generado_por' => null,  // Sistema/Lote - sin usuario específico
                'estado' => ReporteCarga::ESTADO_PENDIENTE,
                'fecha_generacion' => now(),
            ]);

            // Crear detalles del reporte desde TODAS las ventas asociadas
            foreach ($ventas as $venta) {
                $this->crearDetallesDesdeVenta($reporte, $venta);
            }

            // ✅ NUEVA: Vincular entrega al reporte via tabla pivot (Many-to-Many)
            $reporte->entregas()->attach($entrega->id, [
                'orden' => 1,
                'incluida_en_carga' => false,
                'notas' => null,
            ]);

            // Obtener el estado PREPARACION_CARGA desde estados_logistica
            $estadoPreparacion = \App\Models\EstadoLogistica::where('codigo', 'PREPARACION_CARGA')
                ->where('categoria', 'entrega')
                ->first();

            if (!$estadoPreparacion) {
                \Log::error('❌ Estado PREPARACION_CARGA no encontrado en estados_logistica', [
                    'categoria' => 'entrega',
                ]);
            }

            // Actualizar la entrega con el estado (mantener reporte_carga_id para compatibilidad legacy)
            $entrega->update([
                'reporte_carga_id' => $reporte->id,
                'estado' => Entrega::ESTADO_PREPARACION_CARGA,
                'estado_entrega_id' => $estadoPreparacion?->id,  // ✅ FK a estados_logistica
            ]);

            $this->logSuccess('Reporte de carga generado', [
                'reporte_id' => $reporte->id,
                'numero' => $numeroReporte,
                'entrega_id' => $entrega->id,
                'ventas_count' => $ventas->count(),
            ]);

            // ✅ CORREGIDO: Cargar solo relaciones esenciales, evitando relaciones anidadas problemáticas
            // El chofer es un Empleado que tiene relación con User, y si ese User no existe,
            // falla la carga y aborta la transacción. Solo cargamos lo necesario.
            try {
                // Cargar relaciones de ventas
                $entrega->load(['ventas.cliente']);
            } catch (Exception $e) {
                Log::warning('No se pudieron cargar todas las relaciones de la entrega', [
                    'entrega_id' => $entrega->id,
                    'error' => $e->getMessage(),
                ]);
                // Continuar sin las relaciones - no es crítico para la creación
            }

            // Notificar por WebSocket (con o sin relaciones cargadas)
            try {
                $this->webSocketService->notifyReporteCargoGenerado($entrega, $reporte);
            } catch (Exception $e) {
                Log::error('Error enviando notificación WebSocket de reporte generado', [
                    'entrega_id' => $entrega->id,
                    'reporte_id' => $reporte->id,
                    'error' => $e->getMessage(),
                ]);
            }

            return $reporte;
        } catch (Exception $e) {
            Log::error('Error generando reporte de carga: ' . $e->getMessage(), [
                'entrega_id' => $entrega->id,
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Generar un reporte de carga consolidado para múltiples entregas
     *
     * Agrupa todos los productos de todas las ventas en un solo reporte.
     * Útil para batch mode cuando se desea un solo reporte que incluya todo.
     *
     * @param array $entregas Array de entregas a consolidar (modelos Entrega)
     * @param array $datos Datos adicionales del reporte (vehiculo_id, descripcion)
     * @return ReporteCarga Reporte consolidado creado
     * @throws Exception
     */
    public function generarReporteConsolidado(array $entregas, array $datos = []): ReporteCarga
    {
        // ✅ CORREGIDO: Removido $this->transaction() para evitar anidamiento de transacciones en PostgreSQL
        // La transacción exterior en EntregaService::crearLote() manejará todo

        try {
            // Validar que hay entregas
            if (empty($entregas)) {
                throw new Exception("No hay entregas para consolidar");
            }

            // Generar número de reporte único
            $numeroReporte = ReporteCarga::generarNumeroReporte();

            // Calcular peso total de todas las entregas
            $pesoTotal = collect($entregas)->sum('peso_kg') ?? 0;

            // Crear el reporte consolidado (sin entrega_id específica, sin venta_id específica)
            // ✅ CORREGIDO: Para operaciones en lote, no asignamos generado_por ya que es una operación del sistema
            $reporte = ReporteCarga::create([
                'numero_reporte' => $numeroReporte,
                'entrega_id' => null,                           // Consolidado no está vinculado a una entrega específica
                'vehiculo_id' => $datos['vehiculo_id'] ?? null,
                'venta_id' => null,                             // Múltiples ventas
                'descripcion' => $datos['descripcion'] ?? 'Reporte consolidado',
                'peso_total_kg' => $pesoTotal,
                'volumen_total_m3' => $datos['volumen_total_m3'] ?? null,
                'generado_por' => null,  // Sistema/Lote - sin usuario específico
                'estado' => ReporteCarga::ESTADO_PENDIENTE,
                'fecha_generacion' => now(),
            ]);

            // Consolidar detalles de todas las ventas
            $detallesConsolidados = [];
            $entregasCount = count($entregas);

            // Convert to Entrega models if they're arrays
            $entregasModels = [];
            foreach ($entregas as $entrega) {
                if ($entrega instanceof Entrega) {
                    $entregasModels[] = $entrega;
                } else {
                    // Si es un array, intenta cargar desde BD
                    $entregasModels[] = Entrega::with('ventas.detalles.producto')->findOrFail($entrega['id'] ?? $entrega);
                }
            }

            // Procesar detalles de cada entrega
            foreach ($entregasModels as $entrega) {
                // Obtener todas las ventas asociadas a esta entrega
                $ventas = $entrega->ventas ?? collect();

                // Si tiene una sola venta (legacy), usarla
                if ($ventas->isEmpty() && isset($entrega->venta) && $entrega->venta) {
                    $ventas = collect([$entrega->venta]);
                }

                // Procesar detalles de cada venta
                foreach ($ventas as $venta) {
                    if (!$venta || !$venta->detalles) {
                        continue;
                    }

                    foreach ($venta->detalles as $detalleVenta) {
                        $productoId = $detalleVenta->producto_id;
                        // Cast cantidad a int porque BD espera INTEGER, no FLOAT
                        $cantidadInt = (int) $detalleVenta->cantidad;

                        // Si el producto ya existe en consolidados, sumar cantidad
                        if (isset($detallesConsolidados[$productoId])) {
                            $detallesConsolidados[$productoId]['cantidad_solicitada'] += $cantidadInt;
                            $pesoDetalle = $detalleVenta->producto?->peso_kg
                                ? ($cantidadInt * $detalleVenta->producto->peso_kg)
                                : ($cantidadInt * 2); // Default 2kg por unidad
                            $detallesConsolidados[$productoId]['peso_kg'] += $pesoDetalle;
                        } else {
                            // Agregar nuevo producto
                            $pesoDetalle = $detalleVenta->producto?->peso_kg
                                ? ($cantidadInt * $detalleVenta->producto->peso_kg)
                                : ($cantidadInt * 2); // Default 2kg por unidad

                            $detallesConsolidados[$productoId] = [
                                'reporte_carga_id' => $reporte->id,
                                'detalle_venta_id' => $detalleVenta->id, // Referencia al primero encontrado
                                'producto_id' => $productoId,
                                'cantidad_solicitada' => $cantidadInt,
                                'cantidad_cargada' => 0,
                                'verificado' => false,
                                'peso_kg' => $pesoDetalle,
                                'notas' => "Consolidado de {$venta->numero_venta}",
                                'created_at' => now(),
                                'updated_at' => now(),
                            ];
                        }
                    }
                }
            }

            // Insertar detalles consolidados
            if (!empty($detallesConsolidados)) {
                ReporteCargaDetalle::insert(array_values($detallesConsolidados));
            }

            // ✅ NUEVA: Vincular TODAS las entregas al reporte via tabla pivot (Many-to-Many)
            // Esto permite que 1 reporte tenga N entregas, cada una con orden e incluida_en_carga
            foreach ($entregasModels as $idx => $entrega) {
                $reporte->entregas()->attach($entrega->id, [
                    'orden' => $idx + 1,  // Posición en el reporte consolidado
                    'incluida_en_carga' => false,
                    'notas' => null,
                ]);
            }

            // Actualizar estado de todas las entregas (mantener reporte_carga_id para compatibilidad legacy)
            $entregaIds = collect($entregasModels)->pluck('id')->toArray();
            Entrega::whereIn('id', $entregaIds)->update([
                'reporte_carga_id' => $reporte->id,
                'estado' => Entrega::ESTADO_PREPARACION_CARGA,
            ]);

            $this->logSuccess('Reporte consolidado generado', [
                'reporte_id' => $reporte->id,
                'numero' => $numeroReporte,
                'entregas_count' => $entregasCount,
                'productos_count' => count($detallesConsolidados),
            ]);

            return $reporte;
        } catch (Exception $e) {
            Log::error('Error generando reporte consolidado: ' . $e->getMessage(), [
                'entregas_count' => count($entregas),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Crear detalles del reporte desde los detalles de la venta
     *
     * @param ReporteCarga $reporte Reporte al cual agregar detalles
     * @param Venta $venta Venta cuyo contenido se va a cargar
     * @return void
     */
    private function crearDetallesDesdeVenta(ReporteCarga $reporte, Venta $venta): void
    {
        $detalles = $venta->detalles()->with('producto')->get();

        foreach ($detalles as $detalle) {
            // Cast cantidad a int porque BD espera INTEGER, no FLOAT
            $cantidadInt = (int) $detalle->cantidad;

            ReporteCargaDetalle::create([
                'reporte_carga_id' => $reporte->id,
                'detalle_venta_id' => $detalle->id,
                'producto_id' => $detalle->producto_id,
                'cantidad_solicitada' => $cantidadInt,
                'cantidad_cargada' => 0,
                'peso_kg' => $detalle->producto?->peso_kg ? ($cantidadInt * $detalle->producto->peso_kg) : null,
                'notas' => null,
                'verificado' => false,
            ]);
        }
    }

    /**
     * Actualizar cantidad cargada de un detalle
     *
     * @param ReporteCargaDetalle $detalle Detalle a actualizar
     * @param int $cantidadCargada Nueva cantidad cargada
     * @return ReporteCargaDetalle Detalle actualizado
     * @throws Exception
     */
    public function actualizarCantidadCargada(ReporteCargaDetalle $detalle, int $cantidadCargada): ReporteCargaDetalle
    {
        return $this->transaction(function () use ($detalle, $cantidadCargada) {
            try {
                if ($cantidadCargada < 0) {
                    throw new Exception('La cantidad cargada no puede ser negativa');
                }

                if ($cantidadCargada > $detalle->cantidad_solicitada) {
                    throw new Exception('La cantidad cargada no puede exceder la cantidad solicitada');
                }

                $detalle->update([
                    'cantidad_cargada' => $cantidadCargada,
                ]);

                Log::info('Cantidad cargada actualizada', [
                    'detalle_id' => $detalle->id,
                    'reporte_id' => $detalle->reporte_carga_id,
                    'cantidad_cargada' => $cantidadCargada,
                ]);

                return $detalle;
            } catch (Exception $e) {
                Log::error('Error actualizando cantidad cargada: ' . $e->getMessage());
                throw $e;
            }
        });
    }

    /**
     * Marcar un detalle como verificado
     *
     * @param ReporteCargaDetalle $detalle Detalle a verificar
     * @param string|null $notas Notas opcionales
     * @return ReporteCargaDetalle Detalle actualizado
     */
    public function verificarDetalle(ReporteCargaDetalle $detalle, ?string $notas = null): ReporteCargaDetalle
    {
        return $this->transaction(function () use ($detalle, $notas) {
            try {
                $detalle->marcarVerificado(Auth::id());

                if ($notas) {
                    $detalle->update(['notas' => $notas]);
                }

                Log::info('Detalle verificado', [
                    'detalle_id' => $detalle->id,
                    'reporte_id' => $detalle->reporte_carga_id,
                    'verificado_por' => Auth::id(),
                ]);

                return $detalle;
            } catch (Exception $e) {
                Log::error('Error verificando detalle: ' . $e->getMessage());
                throw $e;
            }
        });
    }

    /**
     * Confirmar la carga completa del reporte
     *
     * @param ReporteCarga $reporte Reporte a confirmar
     * @return ReporteCarga Reporte actualizado
     * @throws Exception
     */
    public function confirmarCarga(ReporteCarga $reporte): ReporteCarga
    {
        return $this->transaction(function () use ($reporte) {
            try {
                // Verificar que haya detalles
                if ($reporte->detalles()->count() === 0) {
                    throw new Exception('El reporte no tiene detalles de carga');
                }

                // Actualizar estado del reporte
                $reporte->update([
                    'estado' => ReporteCarga::ESTADO_CONFIRMADO,
                    'confirmado_por' => Auth::id(),
                    'fecha_confirmacion' => now(),
                ]);

                // Actualizar estado de la entrega
                if ($reporte->entrega) {
                    $reporte->entrega->update([
                        'confirmado_carga_por' => Auth::id(),
                        'fecha_confirmacion_carga' => now(),
                        'estado' => Entrega::ESTADO_EN_CARGA,
                    ]);
                }

                $this->logSuccess('Carga confirmada', [
                    'reporte_id' => $reporte->id,
                    'numero' => $reporte->numero_reporte,
                    'confirmado_por' => Auth::id(),
                ]);

                return $reporte;
            } catch (Exception $e) {
                Log::error('Error confirmando carga: ' . $e->getMessage());
                throw $e;
            }
        });
    }

    /**
     * Marcar reporte como listo para entrega (después de completar la carga)
     *
     * @param ReporteCarga $reporte Reporte a marcar como listo
     * @return ReporteCarga Reporte actualizado
     * @throws Exception
     */
    public function marcarListoParaEntrega(ReporteCarga $reporte): ReporteCarga
    {
        return $this->transaction(function () use ($reporte) {
            try {
                if ($reporte->estado !== ReporteCarga::ESTADO_CONFIRMADO) {
                    throw new Exception('Solo se pueden marcar como listo reportes confirmados');
                }

                // Actualizar entrega
                if ($reporte->entrega) {
                    $reporte->entrega->update([
                        'estado' => Entrega::ESTADO_LISTO_PARA_ENTREGA,
                        'iniciada_entrega_por' => Auth::id(),
                        'fecha_inicio_entrega' => now(),
                    ]);
                }

                $this->logSuccess('Entrega marcada como lista', [
                    'reporte_id' => $reporte->id,
                    'entrega_id' => $reporte->entrega_id,
                ]);

                return $reporte;
            } catch (Exception $e) {
                Log::error('Error marcando como listo para entrega: ' . $e->getMessage());
                throw $e;
            }
        });
    }

    /**
     * Iniciar tránsito (GPS tracking)
     *
     * @param Entrega $entrega Entrega que inicia tránsito
     * @param array $ubicacion Array con latitud, longitud
     * @return Entrega Entrega actualizada
     * @throws Exception
     */
    public function iniciarTransito(Entrega $entrega, array $ubicacion): Entrega
    {
        return $this->transaction(function () use ($entrega, $ubicacion) {
            try {
                if (!isset($ubicacion['latitud']) || !isset($ubicacion['longitud'])) {
                    throw new Exception('Se requieren latitud y longitud para iniciar el tránsito');
                }

                $entrega->update([
                    'estado' => Entrega::ESTADO_EN_TRANSITO,
                    'latitud_actual' => $ubicacion['latitud'],
                    'longitud_actual' => $ubicacion['longitud'],
                    'fecha_ultima_ubicacion' => now(),
                ]);

                Log::info('Entrega iniciada en tránsito', [
                    'entrega_id' => $entrega->id,
                    'latitud' => $ubicacion['latitud'],
                    'longitud' => $ubicacion['longitud'],
                ]);

                return $entrega;
            } catch (Exception $e) {
                Log::error('Error iniciando tránsito: ' . $e->getMessage());
                throw $e;
            }
        });
    }

    /**
     * Actualizar ubicación actual de la entrega
     *
     * @param Entrega $entrega Entrega a actualizar
     * @param array $ubicacion Array con latitud, longitud
     * @return Entrega Entrega actualizada
     */
    public function actualizarUbicacion(Entrega $entrega, array $ubicacion): Entrega
    {
        return $this->transaction(function () use ($entrega, $ubicacion) {
            try {
                $entrega->update([
                    'latitud_actual' => $ubicacion['latitud'] ?? $entrega->latitud_actual,
                    'longitud_actual' => $ubicacion['longitud'] ?? $entrega->longitud_actual,
                    'fecha_ultima_ubicacion' => now(),
                ]);

                return $entrega;
            } catch (Exception $e) {
                Log::error('Error actualizando ubicación: ' . $e->getMessage());
                throw $e;
            }
        });
    }

    /**
     * Cancelar un reporte de carga
     *
     * @param ReporteCarga $reporte Reporte a cancelar
     * @param string|null $razon Razón de cancelación
     * @return ReporteCarga Reporte actualizado
     */
    public function cancelarReporte(ReporteCarga $reporte, ?string $razon = null): ReporteCarga
    {
        return $this->transaction(function () use ($reporte, $razon) {
            try {
                $reporte->update([
                    'estado' => ReporteCarga::ESTADO_CANCELADO,
                ]);

                if ($reporte->entrega) {
                    $reporte->entrega->update([
                        'estado' => Entrega::ESTADO_CANCELADA,
                    ]);
                }

                Log::info('Reporte cancelado', [
                    'reporte_id' => $reporte->id,
                    'razon' => $razon,
                ]);

                return $reporte;
            } catch (Exception $e) {
                Log::error('Error cancelando reporte: ' . $e->getMessage());
                throw $e;
            }
        });
    }
}
