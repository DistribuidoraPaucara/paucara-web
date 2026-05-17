<?php
namespace App\Services;

use App\Models\AperturaCaja;
use App\Models\MovimientoCaja;
use App\Models\TipoOperacionCaja;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * CierreCajaService - Centraliza todos los cálculos de cierre de caja
 *
 * ✅ REFACTORIZADO (2026-02-10):
 * - Utiliza columna 'direccion' de tipo_operacion_caja
 * - Eliminada lógica hardcodeada
 * - Cálculos más simples y mantenibles
 * - SQL más eficiente
 *
 * ✅ REFACTORIZADO (2026-02-11):
 * - Eliminada duplicación de código en cálculos de ventas
 * - Uso consistente de estados_documento.codigo (no nombres)
 * - Métodos auxiliares para validación de estados
 * - Mejor mantenibilidad y seguridad
 *
 * Direcciones:
 * - ENTRADA: Ingresos (VENTA, PAGO)
 * - SALIDA: Egresos (COMPRA, GASTOS, PAGO_SUELDO, ANTICIPO, ANULACION)
 * - AJUSTE: Especiales (AJUSTE, CREDITO)
 * - ESPECIAL: Sistema (APERTURA, CIERRE)
 *
 * Códigos de Estado (SIEMPRE usar .codigo, no .nombre):
 * - APROBADO: Venta confirmada
 * - ANULADO: Venta cancelada
 */
class CierreCajaService
{
    protected $fechaInicio;
    protected $fechaFin;

    // Códigos de estado estándar
    const ESTADO_APROBADO = 'APROBADO';
    const ESTADO_ANULADO = 'ANULADO';

    /**
     * ✅ REFACTORIZADO (2026-02-11): Cálculos Simplificados
     * Calcular TODOS los datos necesarios para cierre de caja
     *
     * Cálculos Principales (NUEVOS):
     * - totalVentas = Sumatoria de TODAS las ventas por todos sus tipos de pago
     * - totalEfectivo = (Efectivo + Transferencias) - Crédito + Pagos CxC - Salidas
     *
     * @param AperturaCaja $aperturaCaja
     * @return array Datos con todos los cálculos
     */
    public function calcularDatos(AperturaCaja $aperturaCaja): array
    {
        // ✅ NUEVO (2026-02-20): Rango de fecha desde apertura hasta cierre/hoy
        // Siempre incluir movimientos desde que se abrió la caja
        // Si CERRADA: hasta fecha de cierre
        // Si ABIERTA: hasta ahora (permite ver cajas abiertas desde días anteriores)
        $this->fechaInicio = $aperturaCaja->fecha;
        $this->fechaFin = $aperturaCaja->cierre?->created_at ?? now();

        $movimientos = $this->obtenerMovimientos($aperturaCaja);
        $movimientosVenta = $this->obtenerMovimientosVenta($aperturaCaja);

        // ✅ NUEVOS CÁLCULOS PRINCIPALES SIMPLIFICADOS
        $totalVentas = $this->calcularTotalVentas($aperturaCaja);
        $efectivoEnCaja = $this->calcularEfectivoEnCaja($aperturaCaja, $movimientos);

        // Detalles para breakdown
        $ventasEfectivoTransferencia = $this->calcularVentasPorTipoPagoEspecifico($aperturaCaja, ['EFECTIVO', 'TRANSFERENCIA/QR']);
        $ventasCredito = $this->calcularVentasAprobadasCredito($aperturaCaja);
        $pagosCredito = $this->calcularPagosCredito($movimientos);
        $salidasReales = $this->calcularSalidasReales($movimientos);
        $compras = $this->calcularCompras($movimientos);  // Referencial (promesa de pago)
        $anulaciones = $this->calcularAnulaciones($movimientos);  // ✅ CORREGIDO (2026-04-30): Suma directa de movimientos ANULACION
        $totalSalidas = $this->calcularTotalSalidas($movimientos);

        return [
            'apertura'                  => $aperturaCaja,
            'cierre'                    => $aperturaCaja->cierre,
            'movimientos'               => $movimientos,
            'movimientosAgrupados'      => $this->agruparPorTipoOperacion($movimientos),

            // ✅ CÁLCULOS PRINCIPALES (NUEVOS)
            'totalVentas'               => (float) $totalVentas,  // Todas las ventas
            'totalEfectivo'             => (float) $efectivoEnCaja, // Todo efectivo en caja

            // Breakdown del Efectivo en Caja (para detalles y auditoría)
            'detalleEfectivo' => [
                'ventas_efectivo_transferencia' => (float) $ventasEfectivoTransferencia,
                'pagos_credito'                 => (float) $pagosCredito,
                'total_entradas_efectivo'       => (float) ($ventasEfectivoTransferencia + $pagosCredito),
                'salidas_reales'                => (float) $salidasReales,
            ],

            // Datos Referenciales (NO afectan totalEfectivo, solo informativos)
            'datosReferenciales' => [
                'ventas_credito'   => (float) $ventasCredito,       // Promesa de pago del cliente
                'compras'          => (float) $compras,             // Promesa de pago a proveedor
                'anulaciones'      => (float) $anulaciones,         // Transacciones canceladas (nunca pasaron)
            ],

            // Datos para reportes detallados (compatibilidad)
            'ventasPorTipoPago'         => $this->calcularVentasPorTipoPago($movimientos),
            'ventasPorTipoPagoCompleto' => $this->calcularVentasPorTipoPagoConTodos($this->calcularVentasPorTipoPago($movimientos)),
            'sumatoriasVentasPorTipoPago' => $this->calcularSumatoriasVentasPorTipoPago($movimientos),
            'movimientosPorTipoPago'    => $this->calcularMovimientosPorTipoPago($movimientos),
            'pagosCreditoPorTipoPago'   => $this->calcularPagosCreditoPorTipoPago($movimientos),
            'detallesPagosVentaPorTipo' => $this->calcularDetallesPagosVentaPorTipo($aperturaCaja),  // ✅ NUEVO: Pagos desde detalles_pago_venta
            'gastosPorTipoPago'         => $this->calcularGastosPorTipoPago($movimientos),
            'ventasPorEstado'           => $this->calcularVentasPorEstado($aperturaCaja),
            'efectivoEsperado'          => $this->calcularEfectivoEsperado($aperturaCaja, $movimientos),
            'totalIngresos'             => $this->calcularTotalIngresos($movimientos),
            'totalEgresos'              => $this->calcularTotalEgresos($movimientos),
            'primeraVenta'              => $this->calcularRangoFechas($movimientos, $movimientosVenta)['primeraVenta'],
            'ultimaVenta'               => $this->calcularRangoFechas($movimientos, $movimientosVenta)['ultimaVenta'],
            'primerMovimiento'          => $this->calcularRangoFechas($movimientos, $movimientosVenta)['primerMovimiento'],
            'ultimoMovimiento'          => $this->calcularRangoFechas($movimientos, $movimientosVenta)['ultimoMovimiento'],
            'rangoVentasIds'            => $this->calcularRangoVentasIds($movimientosVenta),
            'rangoCreditos'             => $this->calcularRangoCreditos($movimientosVenta),
            'pagosCreditos'             => $this->calcularRangoPagos($movimientos)['totalPagos'] ?? 0,
            'montoPagosCreditos'        => $this->calcularRangoPagos($movimientos)['montoPagos'] ?? 0,
            'rangoPagos'                => $this->calcularRangoPagos($movimientos),
            'sumatorialVentas'          => $totalVentas,
            'ventasTotalAprobadas'      => $totalVentas,
            'sumatorialVentasEfectivo'  => $ventasEfectivoTransferencia,
            'sumatorialVentasCredito'   => $ventasCredito,
            'cantidadVentasCredito'     => $this->calcularCantidadVentasCredito($aperturaCaja),
            'sumatorialGastos'          => $this->calcularSumaPorCodigo($movimientos, 'GASTOS'),
            'sumatorialPagosSueldo'     => $this->calcularSumaPorCodigo($movimientos, 'PAGO_SUELDO'),
            'sumatorialAnticipos'       => $this->calcularSumaPorCodigo($movimientos, 'ANTICIPO'),
            'sumatorialDevoluciones'    => $this->calcularSumaPorCodigo($movimientos, 'DEVOLUCION'),
            'sumatorialServicio'        => $this->calcularSumaPorCodigo($movimientos, 'SERVICIO'),
            'sumatorialAnulaciones'     => (float) $anulaciones,  // Referencial (no afecta totalEfectivo)
            'sumatorialVentasAnuladas'  => $this->calcularVentasAnuladas($aperturaCaja),  // Referencial
            'sumatorialCompras'         => (float) $compras,  // Referencial
            'sumatorialSalidasReales'   => (float) $salidasReales,
            'ventasTotales'             => $totalVentas,
            // ✅ NUEVO (2026-05-03): Cálculo de VUELTOS registrados como movimientos separados
            'sumatorialVueltos'         => $this->calcularVueltos($aperturaCaja),
        ];
    }

    /**
     * ✅ NUEVO: Calcular TOTAL DE VENTAS
     * Suma todas las ventas aprobadas de TODOS los tipos de pago
     *
     * Fórmula: VENTA.total + CREDITO.total (ambas en estado APROBADO)
     */
    private function calcularTotalVentas(AperturaCaja $aperturaCaja): float
    {
        try {
            // ✅ CORREGIDO (2026-02-11): SOLO VENTA (sin CREDITO)
            // VENTA = Operaciones completadas / CREDITO = Cuentas por cobrar
            $totalVentas = DB::table('movimientos_caja')
                ->join('ventas', 'movimientos_caja.numero_documento', '=', 'ventas.numero')
                ->join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->where('movimientos_caja.caja_id', $aperturaCaja->caja_id)
                ->where('tipo_operacion_caja.codigo', 'VENTA')  // ✅ SOLO VENTA (no CREDITO)
                ->where('estados_documento.codigo', self::ESTADO_APROBADO)
                ->whereBetween('movimientos_caja.fecha', [$this->fechaInicio, $this->fechaFin])
                ->sum('ventas.total');

            Log::info('💰 [calcularTotalVentas]:', [
                'apertura_id' => $aperturaCaja->id,
                'total' => $totalVentas,
            ]);

            return (float) $totalVentas;
        } catch (\Exception $e) {
            Log::error('❌ [calcularTotalVentas]:', [
                'apertura_id' => $aperturaCaja->id,
                'error' => $e->getMessage(),
            ]);
            return 0;
        }
    }

    /**
     * ✅ NUEVO: Calcular EFECTIVO EN CAJA
     * (Efectivo + Transferencias) + Pagos de CxC - Salidas REALES
     *
     * ✅ NOTA IMPORTANTE:
     * - CREDITO (Ventas al crédito) = Promesa de pago, NO afecta efectivo
     * - COMPRA (Deuda a proveedores) = Promesa de pago, NO afecta efectivo (solo referencial)
     * - Solo resta dinero que REALMENTE sale: GASTOS, PAGO_SUELDO, ANTICIPO, ANULACION
     *
     * Fórmula:
     * = Apertura
     * + Ventas Efectivo/Transferencia
     * + Pagos de Crédito (dinero que entra al cobrar deudas)
     * - Dinero que sale (Gastos, Sueldos, Anticipos, Anulaciones)
     *
     * Datos Referenciales (no afectan totalEfectivo):
     * - Ventas al Crédito (promesa de pago)
     * - Compras (deuda a proveedores)
     */
    private function calcularEfectivoEnCaja(AperturaCaja $aperturaCaja, $movimientos): float
    {
        $montoApertura = $aperturaCaja->monto_apertura ?? 0;

        // Entrada 1: Ventas en Efectivo + Transferencias
        $ventasEfectivoTransferencia = $this->calcularVentasPorTipoPagoEspecifico($aperturaCaja, ['EFECTIVO', 'TRANSFERENCIA/QR']);

        // Entrada 2: Pagos de Cuentas por Cobrar (Crédito pagado en efectivo)
        $pagosCredito = $this->calcularPagosCredito($movimientos);

        // Salida: Dinero que REALMENTE sale (excluye COMPRA y CREDITO, que son promesas)
        $dineroQueRealmnteSale = $this->calcularSalidasReales($movimientos);

        // Referencial (no afecta cálculo):
        $ventasCredito = $this->calcularVentasAprobadasCredito($aperturaCaja);
        $compras = $this->calcularCompras($movimientos);

        $efectivoTotal = $montoApertura + $ventasEfectivoTransferencia + $pagosCredito - $dineroQueRealmnteSale;

        Log::info('💵 [calcularEfectivoEnCaja]:', [
            'apertura_id' => $aperturaCaja->id,
            'apertura' => $montoApertura,
            'ventas_efectivo_transferencia' => $ventasEfectivoTransferencia,
            'pagos_credito' => $pagosCredito,
            'dinero_que_realmente_sale' => $dineroQueRealmnteSale,
            'total_efectivo' => $efectivoTotal,
            'referencial_ventas_credito' => $ventasCredito,
            'referencial_compras' => $compras,
        ]);

        return (float) $efectivoTotal;
    }

    /**
     * Calcular ventas por tipos de pago específicos
     * (ej: EFECTIVO + TRANSFERENCIA)
     */
    /**
     * ✅ Calcular ventas aprobadas filtrando por código de tipo de pago
     * @param array $tiposPago Array de CÓDIGOS (ej: ['EFECTIVO', 'TRANSFERENCIA/QR'])
     */
    private function calcularVentasPorTipoPagoEspecifico(AperturaCaja $aperturaCaja, array $tiposPago): float
    {
        try {
            // ✅ REFACTORIZADO (2026-04-30): Usar detalles_pago_venta como fuente de verdad
            // CON FALLBACK a movimientos_caja para ventas antiguas sin detalles_pago_venta
            // Obtiene los montos REALES pagados por tipo, no el total de la venta

            // 1. Obtener IDs de ventas aprobadas en la caja durante el período
            $ventasIds = DB::table('movimientos_caja')
                ->join('ventas', 'movimientos_caja.numero_documento', '=', 'ventas.numero')
                ->join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->where('movimientos_caja.caja_id', $aperturaCaja->caja_id)
                ->where('tipo_operacion_caja.codigo', 'VENTA')
                ->where('estados_documento.codigo', self::ESTADO_APROBADO)
                ->whereBetween('movimientos_caja.fecha', [$this->fechaInicio, $this->fechaFin])
                ->distinct('ventas.id')
                ->pluck('ventas.id')
                ->toArray();

            if (empty($ventasIds)) {
                return 0;
            }

            // 2️⃣ Intentar obtener desde detalles_pago_venta (ventas nuevas)
            $montosDetalles = DB::table('detalles_pago_venta')
                ->join('tipos_pago', 'detalles_pago_venta.tipo_pago_id', '=', 'tipos_pago.id')
                ->whereIn('detalles_pago_venta.venta_id', $ventasIds)
                ->whereIn('tipos_pago.codigo', $tiposPago)
                ->sum('detalles_pago_venta.monto');

            // 2b. Obtener IDs de ventas que SÍ tienen detalles_pago_venta
            $ventasConDetalles = DB::table('detalles_pago_venta')
                ->whereIn('venta_id', $ventasIds)
                ->pluck('venta_id')
                ->unique()
                ->toArray();

            // 3️⃣ FALLBACK: Ventas antiguas sin detalles_pago_venta - usar movimientos_caja
            $ventasAntiguasIds = array_diff($ventasIds, $ventasConDetalles);
            $montosAntiguos = 0;

            if (!empty($ventasAntiguasIds)) {
                Log::warning('⚠️ [calcularVentasPorTipoPagoEspecifico] Usando fallback para ventas antiguas:', [
                    'cantidad_ventas_antiguas' => count($ventasAntiguasIds),
                    'tipos_pago' => $tiposPago,
                ]);

                $montosAntiguos = DB::table('movimientos_caja')
                    ->join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
                    ->join('tipos_pago', 'movimientos_caja.tipo_pago_id', '=', 'tipos_pago.id')
                    ->whereIn('movimientos_caja.venta_id', $ventasAntiguasIds)
                    ->where('tipo_operacion_caja.codigo', 'VENTA')
                    ->whereIn('tipos_pago.codigo', $tiposPago)
                    ->sum('movimientos_caja.monto');
            }

            Log::info('💰 [calcularVentasPorTipoPagoEspecifico] (detalles_pago_venta + fallback):', [
                'tipos_pago' => $tiposPago,
                'montos_detalles' => $montosDetalles,
                'montos_antiguos' => $montosAntiguos,
                'total' => $montosDetalles + $montosAntiguos,
            ]);

            return (float) ($montosDetalles + $montosAntiguos);
        } catch (\Exception $e) {
            Log::error('❌ [calcularVentasPorTipoPagoEspecifico]:', [
                'tipos_pago' => $tiposPago,
                'error' => $e->getMessage(),
            ]);
            return 0;
        }
    }

    /**
     * Calcular pagos de crédito (cuentas por cobrar pagadas)
     */
    private function calcularPagosCredito($movimientos): float
    {
        try {
            $pagos = $movimientos
                ->filter(fn($m) => $m->tipoOperacion?->codigo === 'PAGO' && $m->pago?->estado === 'REGISTRADO')
                ->sum('monto');

            Log::info('📥 [calcularPagosCredito]:', [
                'total' => $pagos,
            ]);

            return (float) $pagos;
        } catch (\Exception $e) {
            Log::error('❌ [calcularPagosCredito]:', ['error' => $e->getMessage()]);
            return 0;
        }
    }

    /**
     * ✅ Calcular SALIDAS REALES (dinero que realmente sale de la caja)
     * Incluye TODOS los tipos con dirección='SALIDA' que son dinero real:
     * - GASTOS: Gastos operacionales ✓
     * - PAGO_SUELDO: Pago de nómina ✓
     * - ANTICIPO: Anticipos a empleados ✓
     * - COMPRA: Compras a proveedores (dinero que sale) ✓
     *
     * Excluye:
     * - ANULACION: Ventas anuladas (transacción que nunca pasó) ❌
     *
     * ✅ NOTA: Este es el dinero que REALMENTE afecta el efectivo en caja
     */
    private function calcularSalidasReales($movimientos): float
    {
        try {
            // ✅ Restar todos los tipos que son dinero real que sale
            // INCLUYE: GASTOS, PAGO_SUELDO, ANTICIPO, COMPRA
            // EXCLUYE: ANULACION (transacción cancelada, nunca pasó)
            $salidas = abs((float) $this->obtenerMovimientosPorDireccion($movimientos, 'SALIDA')
                ->filter(fn($m) => $this->esPagoValido($m) && in_array($m->tipoOperacion?->codigo, ['GASTOS', 'PAGO_SUELDO', 'ANTICIPO', 'COMPRA']))
                ->sum('monto'));

            // Desglose por tipo para logging
            $desglose = $this->obtenerMovimientosPorDireccion($movimientos, 'SALIDA')
                ->filter(fn($m) => $this->esPagoValido($m) && in_array($m->tipoOperacion?->codigo, ['GASTOS', 'PAGO_SUELDO', 'ANTICIPO', 'COMPRA']))
                ->groupBy(fn($m) => $m->tipoOperacion?->codigo)
                ->map(fn($grupo) => abs((float) $grupo->sum('monto')))
                ->toArray();

            Log::info('💸 [calcularSalidasReales]:', [
                'total' => $salidas,
                'desglose' => $desglose,
            ]);

            return $salidas;
        } catch (\Exception $e) {
            Log::error('❌ [calcularSalidasReales]:', ['error' => $e->getMessage()]);
            return 0;
        }
    }

    /**
     * ✅ CORREGIDO (2026-04-30): Calcular ANULACIONES sumando movimientos directamente
     * Suma directa de movimientos_caja donde tipo_operacion.codigo = 'ANULACION'
     * Se muestra como referencial para auditoría
     *
     * ⚠️ NOTA IMPORTANTE:
     * - Suma TODOS los movimientos de tipo ANULACION sin filtro de venta
     * - Incluye anulaciones y reversiones como movimientos contables
     * - No debe restar del totalEfectivo
     * - Solo referencial para análisis
     */
    private function calcularAnulaciones($movimientos): float
    {
        try {
            // ✅ ACTUALIZADO (2026-05-04): Suma directa de movimientos ANULACION
            // EXCLUYE anulaciones de VUELTO (que se muestran aparte como informativos)
            $anulaciones = abs((float) $movimientos
                ->filter(fn($m) =>
                    $m->tipoOperacion?->codigo === 'ANULACION' &&
                    !str_contains($m->numero_documento ?? '', 'VUELTO-ANU')  // Excluir anulaciones de vuelto
                )
                ->sum('monto'));

            Log::info('🗑️ [calcularAnulaciones] (SIN anulaciones de vuelto):', [
                'total' => $anulaciones,
                'cantidad_movimientos' => $movimientos->filter(fn($m) =>
                    $m->tipoOperacion?->codigo === 'ANULACION' &&
                    !str_contains($m->numero_documento ?? '', 'VUELTO-ANU')
                )->count(),
            ]);

            return $anulaciones;
        } catch (\Exception $e) {
            Log::error('❌ [calcularAnulaciones]:', ['error' => $e->getMessage()]);
            return 0;
        }
    }

    /**
     * ✅ Calcular COMPRAS (referencial, promesa de pago)
     * Dinero que NO está saliendo ahora, es deuda a proveedores
     * Solo se afecta el efectivo cuando realmente se paga
     *
     * Usado para: Reportes, análisis de deuda, auditoría
     */
    private function calcularCompras($movimientos): float
    {
        try {
            $compras = abs((float) $this->obtenerMovimientosPorDireccion($movimientos, 'SALIDA')
                ->filter(fn($m) => $this->esPagoValido($m) && $m->tipoOperacion?->codigo === 'COMPRA')
                ->sum('monto'));

            Log::info('📦 [calcularCompras] (referencial):', [
                'total' => $compras,
            ]);

            return $compras;
        } catch (\Exception $e) {
            Log::error('❌ [calcularCompras]:', ['error' => $e->getMessage()]);
            return 0;
        }
    }

    /**
     * ✅ Calcular TOTAL DE TODAS LAS SALIDAS (incluyendo promesas)
     * Incluye dinero real + promesas de pago, para reportes generales
     * Usa dirección para ser automático (no hardcodeado)
     */
    private function calcularTotalSalidas($movimientos): float
    {
        try {
            // Sumar TODAS las operaciones con dirección='SALIDA'
            $salidas = abs((float) $this->obtenerMovimientosPorDireccion($movimientos, 'SALIDA')
                ->filter(fn($m) => $this->esPagoValido($m))
                ->sum('monto'));

            // Desglose por tipo para logging
            $desglose = $this->obtenerMovimientosPorDireccion($movimientos, 'SALIDA')
                ->filter(fn($m) => $this->esPagoValido($m))
                ->groupBy(fn($m) => $m->tipoOperacion?->codigo)
                ->map(fn($grupo) => abs((float) $grupo->sum('monto')))
                ->toArray();

            Log::info('📤 [calcularTotalSalidas] (todo incl. promesas):', [
                'total' => $salidas,
                'desglose' => $desglose,
            ]);

            return $salidas;
        } catch (\Exception $e) {
            Log::error('❌ [calcularTotalSalidas]:', ['error' => $e->getMessage()]);
            return 0;
        }
    }

    /**
     * ✅ Calcular total de ingresos usando DIRECCION (ENTRADA)
     * ✅ Filtra movimientos con pagos válidos (no anulados)
     */
    private function calcularTotalIngresos($movimientos): float
    {
        return (float) $movimientos
            ->filter(fn($m) =>
                $m->tipoOperacion?->direccion === 'ENTRADA' && $this->esPagoValido($m)
            )
            ->sum('monto');
    }

    /**
     * ✅ Calcular total de egresos (dinero que realmente sale)
     * ✅ Excluye ANULACION (transacción cancelada, nunca pasó)
     *
     * ✅ ACTUALIZADO (2026-02-20): Incluye COMPRA en los egresos
     *
     * Incluye dinero real que sale:
     * - GASTOS ✓
     * - PAGO_SUELDO ✓
     * - ANTICIPO ✓
     * - COMPRA ✓ (dinero que sale de la caja)
     */
    private function calcularTotalEgresos($movimientos): float
    {
        // ✅ ACTUALIZADO (2026-05-04): Excluir VUELTO de los egresos
        // Los vueltos NO son gastos, son cambio dado al cliente
        // Se restan correctamente en calcularEfectivoEsperado()
        return abs((float) $movimientos
            ->filter(fn($m) =>
                $m->tipoOperacion?->direccion === 'SALIDA' &&
                $this->esPagoValido($m) &&
                !in_array($m->tipoOperacion?->codigo, ['ANULACION', 'VUELTO'])  // Excluye ANULACION y VUELTO
            )
            ->sum('monto'));
    }

    /**
     * ✅ NUEVO: Obtener movimientos por dirección
     */
    private function obtenerMovimientosPorDireccion($movimientos, string $direccion)
    {
        return $movimientos->filter(fn($m) => $m->tipoOperacion?->direccion === $direccion);
    }

    /**
     * ✅ NUEVO: Calcular suma para un código específico
     */
    private function calcularSumaPorCodigo($movimientos, string $codigo): float
    {
        $resultado = abs((float) $movimientos
            ->filter(fn($m) => $m->tipoOperacion?->codigo === $codigo)
            ->sum('monto'));

        // ✅ DEBUG: Logging para diagnosticar
        Log::info('🔍 [calcularSumaPorCodigo]', [
            'codigo' => $codigo,
            'total_movimientos' => $movimientos->count(),
            'movimientos_filtrados' => $movimientos->filter(fn($m) => $m->tipoOperacion?->codigo === $codigo)->count(),
            'resultado' => $resultado,
            'primeros_3_tipos' => $movimientos->take(3)->map(fn($m) => $m->tipoOperacion?->codigo)->toArray(),
        ]);

        return $resultado;
    }

    /**
     * Obtener movimientos del período
     */
    private function obtenerMovimientos(AperturaCaja $aperturaCaja)
    {
        return MovimientoCaja::where('caja_id', $aperturaCaja->caja_id)
            ->whereBetween('fecha', [$this->fechaInicio, $this->fechaFin])
            ->with(['tipoOperacion', 'comprobantes', 'tipoPago', 'venta.estadoDocumento', 'pago'])
            ->orderBy('id', 'desc')
            ->get();
    }

    /**
     * Obtener solo movimientos de venta APROBADAS (incluye VENTA y CREDITO)
     * ✅ Usa estados_documento.codigo para validación segura
     * ✅ CORREGIDO (2026-03-17): Incluye ambos tipos de operación VENTA y CREDITO
     *    Esto asegura que el rango de ventas incluya ventas a crédito
     */
    private function obtenerMovimientosVenta(AperturaCaja $aperturaCaja)
    {
        $tiposOperacionIds = TipoOperacionCaja::whereIn('codigo', ['VENTA', 'CREDITO'])->pluck('id')->toArray();

        if (empty($tiposOperacionIds)) {
            Log::warning('⚠️ Tipos de operación VENTA o CREDITO no encontrados en BD', [
                'apertura_id' => $aperturaCaja->id,
            ]);
            return collect();
        }

        return MovimientoCaja::where('caja_id', $aperturaCaja->caja_id)
            ->whereBetween('fecha', [$this->fechaInicio, $this->fechaFin])
            ->whereIn('tipo_operacion_id', $tiposOperacionIds)
            ->with(['tipoPago', 'venta.estadoDocumento'])
            ->get()
            ->filter(fn($m) => $this->esVentaAprobada($m)); // ✅ Usa validación por código
    }

    /**
     * Agrupar movimientos por tipo de operación
     */
    private function agruparPorTipoOperacion($movimientos)
    {
        return $movimientos->groupBy(fn($m) => $m->tipoOperacion->nombre ?? 'Sin tipo');
    }

    /**
     * Validar si un movimiento tiene venta en estado aprobado
     * ✅ Siempre usa estados_documento.codigo para mayor seguridad
     */
    private function esVentaAprobada($movimiento): bool
    {
        return $movimiento->venta?->estadoDocumento?->codigo === self::ESTADO_APROBADO;
    }

    /**
     * Validar si un movimiento tiene venta en estado anulado
     */
    private function esVentaAnulada($movimiento): bool
    {
        return $movimiento->venta?->estadoDocumento?->codigo === self::ESTADO_ANULADO;
    }

    /**
     * Validar si un pago es válido (no anulado)
     */
    private function esPagoValido($movimiento): bool
    {
        return $movimiento->pago?->estado !== 'ANULADO';
    }

    /**
     * Calcular ventas por tipo de pago (VENTA + CREDITO aprobadas)
     */
    private function calcularVentasPorTipoPago($movimientos)
    {
        // ✅ REFACTORIZADO (2026-04-30): Usar detalles_pago_venta como fuente de verdad
        // CON FALLBACK a movimientos_caja para ventas antiguas sin detalles_pago_venta
        // Las ventas pueden tener múltiples tipos de pago. Deben sumarse desde detalles_pago_venta,
        // NO desde venta.total (que duplicaría los valores)

        try {
            // Obtener IDs de ventas aprobadas en este período
            $ventasIds = $movimientos
                ->filter(fn($m) => $this->esVentaAprobada($m) && $m->tipoOperacion?->codigo === 'VENTA')
                ->pluck('venta_id')
                ->filter()
                ->unique()
                ->toArray();

            // 🔍 DEBUG DETALLADO
            Log::info('🔍 [calcularVentasPorTipoPago DEBUG - Ventas Únicas]', [
                'total_movimientos_venta' => $movimientos->filter(fn($m) => $m->tipoOperacion?->codigo === 'VENTA')->count(),
                'total_movimientos_aprobados' => $movimientos->filter(fn($m) => $this->esVentaAprobada($m) && $m->tipoOperacion?->codigo === 'VENTA')->count(),
                'ventas_unicas_ids_count' => count($ventasIds),
                'ventas_unicas_ids_min' => !empty($ventasIds) ? min($ventasIds) : null,
                'ventas_unicas_ids_max' => !empty($ventasIds) ? max($ventasIds) : null,
                'ventas_ids_sample' => array_slice($ventasIds, 0, 10),
            ]);

            if (empty($ventasIds)) {
                return collect();
            }

            // 1️⃣ Intentar obtener desde detalles_pago_venta (ventas nuevas)
            $pagos = DB::table('detalles_pago_venta')
                ->join('tipos_pago', 'detalles_pago_venta.tipo_pago_id', '=', 'tipos_pago.id')
                ->whereIn('detalles_pago_venta.venta_id', $ventasIds)
                ->select(
                    'tipos_pago.nombre',
                    DB::raw('COUNT(DISTINCT detalles_pago_venta.venta_id) as cantidad'),
                    DB::raw('SUM(detalles_pago_venta.monto) as total')
                )
                ->groupBy('tipos_pago.id', 'tipos_pago.nombre')
                ->get();

            // ✅ OBTENER IDs de ventas que SÍ tienen detalles_pago_venta
            $ventasConDetalles = DB::table('detalles_pago_venta')
                ->whereIn('venta_id', $ventasIds)
                ->pluck('venta_id')
                ->unique()
                ->toArray();

            $resultado = [];
            foreach ($pagos as $pago) {
                $resultado[$pago->nombre] = [
                    'cantidad' => (int) $pago->cantidad,
                    'total' => (float) $pago->total,
                ];
            }

            // 2️⃣ FALLBACK: Ventas antiguas sin detalles_pago_venta - usar movimientos_caja
            $ventasAntiguasIds = array_diff($ventasIds, array_filter($ventasConDetalles));
            if (!empty($ventasAntiguasIds)) {
                Log::warning('⚠️ [calcularVentasPorTipoPago] Usando fallback para ventas antiguas:', [
                    'cantidad_ventas_antiguas' => count($ventasAntiguasIds),
                ]);

                $pagosAntiguos = $movimientos
                    ->filter(fn($m) =>
                        $this->esVentaAprobada($m) &&
                        $m->tipoOperacion?->codigo === 'VENTA' &&
                        in_array($m->venta_id, $ventasAntiguasIds)
                    )
                    ->groupBy(fn($m) => $m->tipoPago?->nombre ?? 'Sin tipo de pago')
                    ->map(fn($grupo) => [
                        'cantidad' => $grupo->pluck('venta_id')->unique()->count(),
                        'total' => (float) $grupo->sum(fn($m) => $m->monto),
                    ]);

                foreach ($pagosAntiguos as $tipo => $datos) {
                    if (!isset($resultado[$tipo])) {
                        $resultado[$tipo] = $datos;
                    } else {
                        // Agregar al total existente
                        $resultado[$tipo]['cantidad'] += $datos['cantidad'];
                        $resultado[$tipo]['total'] += $datos['total'];
                    }
                }
            }

            Log::info('📊 [calcularVentasPorTipoPago] (detalles_pago_venta + fallback):', [
                'ventasIds_count' => count($ventasIds),
                'ventasConDetalles_count' => count($ventasConDetalles),
                'ventasAntiguasIds_count' => count($ventasAntiguasIds),
                'resultado_por_tipo' => $resultado,
                'total_cantidad_calculada' => array_sum(array_map(fn($v) => $v['cantidad'], $resultado)),
            ]);
            return collect($resultado);
        } catch (\Exception $e) {
            Log::error('❌ [calcularVentasPorTipoPago]:', ['error' => $e->getMessage()]);
            return collect();
        }
    }

    /**
     * Calcular movimientos por tipo de pago (filtrando por dirección y estado de pago)
     * ✅ Usa estados_documento.codigo para validación de ventas
     */
    /**
     * ✅ REFACTORIZADO (2026-02-11): Ventas por tipo de pago
     * - Solo VENTAS aprobadas (NO creditos)
     * - Usa ventas.total (no movimientos_caja.monto)
     * - Agrupa por tipo de pago
     */
    private function calcularMovimientosPorTipoPago($movimientos)
    {
        return $movimientos
            ->filter(function ($m) {
                // Solo VENTAS aprobadas (excluyendo CREDITO)
                if ($m->tipoOperacion->codigo === 'VENTA') {
                    return $this->esVentaAprobada($m);
                }

                // Excluir todo lo demás (CREDITO, PAGO, GASTOS, etc.)
                return false;
            })
            ->groupBy(fn($m) => $m->tipoPago?->nombre ?? 'Sin tipo de pago')
            ->map(fn($grupo) => [
                'cantidad' => $grupo->count(),
                // Usar ventas.total (no movimientos_caja.monto) para consistencia con calcularTotalVentas()
                'total' => (float) $grupo->sum(fn($m) => $m->venta?->total ?? 0),
            ]);
    }

    /**
     * Calcular pagos de crédito por tipo de pago
     */
    private function calcularPagosCreditoPorTipoPago($movimientos)
    {
        return $movimientos
            ->filter(fn($m) => $m->tipoOperacion?->codigo === 'PAGO' && $m->pago?->estado === 'REGISTRADO')
            ->groupBy(fn($m) => $m->tipoPago?->nombre ?? 'Sin tipo de pago')
            ->map(fn($grupo) => [
                'tipo' => $grupo->first()?->tipoPago?->nombre ?? 'Sin tipo',
                'cantidad' => $grupo->count(),
                'total' => $grupo->sum('monto'),
            ])
            ->values();
    }

    /**
     * Calcular gastos por tipo de pago
     */
    private function calcularGastosPorTipoPago($movimientos)
    {
        return $movimientos
            ->filter(fn($m) => $m->tipoOperacion?->codigo === 'GASTOS')
            ->groupBy(fn($m) => $m->tipoPago?->nombre ?? 'Sin tipo de pago')
            ->map(fn($grupo) => [
                'tipo' => $grupo->first()?->tipoPago?->nombre ?? 'Sin tipo',
                'cantidad' => $grupo->count(),
                'total' => $grupo->sum('monto'),
            ])
            ->values();
    }

    /**
     * Calcular ventas agrupadas por estado de documento
     * ✅ Usa estados_documento.codigo en lugar de nombre para mayor seguridad
     */
    private function calcularVentasPorEstado(AperturaCaja $aperturaCaja)
    {
        try {
            return DB::table('movimientos_caja')
                ->join('ventas', 'movimientos_caja.numero_documento', '=', 'ventas.numero')
                ->join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->where('movimientos_caja.caja_id', $aperturaCaja->caja_id)
                ->where('tipo_operacion_caja.codigo', 'VENTA')
                ->whereBetween('movimientos_caja.fecha', [$this->fechaInicio, $this->fechaFin])
                ->groupBy('estados_documento.codigo', 'estados_documento.nombre')
                ->select(
                    'estados_documento.codigo as codigo',
                    'estados_documento.nombre as estado',
                    DB::raw('COUNT(DISTINCT ventas.id) as cantidad'),
                    DB::raw('SUM(ventas.total) as total')
                )
                ->get()
                ->map(fn($g) => [
                    'codigo' => $g->codigo ?? 'SIN_ESTADO', // ✅ Agregado código
                    'estado' => $g->estado ?? 'Sin estado',
                    'total' => (float) ($g->total ?? 0),
                    'count' => (int) ($g->cantidad ?? 0),
                ]);
        } catch (\Exception $e) {
            Log::error('❌ [calcularVentasPorEstado]:', [
                'apertura_id' => $aperturaCaja->id,
                'error' => $e->getMessage(),
            ]);
            return collect();
        }
    }

    /**
     * Calcular efectivo esperado en caja
     * ✅ Usa estados_documento.codigo en lugar de nombres
     */
    private function calcularEfectivoEsperado(AperturaCaja $aperturaCaja, $movimientos)
    {
        $montoApertura = $aperturaCaja->monto_apertura ?? 0;

        // ✅ CORREGIDO (2026-03-03): Usar MISMO CÁLCULO que sumatorialVentasEfectivo
        // (Solo EFECTIVO + TRANSFERENCIA/QR - tipos de pago explícitos)
        // Esto asegura consistencia con sumatorialVentasEfectivo
        $ventasEfectivo = $this->calcularVentasPorTipoPagoEspecifico($aperturaCaja, ['EFECTIVO', 'TRANSFERENCIA/QR']);

        // Ventas anuladas (TODOS los tipos excepto crédito)
        $ventasAnuladas = $movimientos
            ->filter(fn($m) =>
                $m->tipoOperacion?->codigo === 'VENTA' &&
                $m->tipoPago?->codigo !== 'CREDITO' &&
                $this->esVentaAnulada($m)
            )
            ->sum('monto');

        // Pagos de crédito (TODOS los tipos de pago: efectivo, transferencia, tarjeta, etc.)
        // ✅ CORREGIDO (2026-02-11): Incluye TODOS los tipos de pago, no solo Efectivo
        $pagosCreditoTotal = $movimientos
            ->filter(fn($m) =>
                $m->tipoOperacion?->codigo === 'PAGO'
                // Removida restricción de tipoPago.nombre === 'Efectivo'
                // para incluir TRANSFERENCIA, TARJETA, etc.
            )
            ->sum('monto');

        // Egresos por dirección SALIDA
        $gastos = abs($this->obtenerMovimientosPorDireccion($movimientos, 'SALIDA')
            ->filter(fn($m) => $m->tipoOperacion?->codigo === 'GASTOS')
            ->sum('monto'));

        $pagosSueldo = abs($this->obtenerMovimientosPorDireccion($movimientos, 'SALIDA')
            ->filter(fn($m) => $m->tipoOperacion?->codigo === 'PAGO_SUELDO')
            ->sum('monto'));

        $anticipos = abs($this->obtenerMovimientosPorDireccion($movimientos, 'SALIDA')
            ->filter(fn($m) => $m->tipoOperacion?->codigo === 'ANTICIPO')
            ->sum('monto'));

        // ✅ CORREGIDO (2026-04-30): Suma directa de movimientos ANULACION
        $anulaciones = abs((float) $movimientos
            ->filter(fn($m) => $m->tipoOperacion?->codigo === 'ANULACION')
            ->sum('monto'));

        $compras = abs($this->obtenerMovimientosPorDireccion($movimientos, 'SALIDA')
            ->filter(fn($m) => $m->tipoOperacion?->codigo === 'COMPRA')
            ->sum('monto'));

        $devoluciones = abs($this->obtenerMovimientosPorDireccion($movimientos, 'SALIDA')
            ->filter(fn($m) => $m->tipoOperacion?->codigo === 'DEVOLUCION')
            ->sum('monto'));

        // ✅ NUEVO (2026-03-09): Servicios como entrada de efectivo
        $servicio = abs($this->obtenerMovimientosPorDireccion($movimientos, 'ENTRADA')
            ->filter(fn($m) => $m->tipoOperacion?->codigo === 'SERVICIO')
            ->sum('monto'));

        // ✅ NUEVO (2026-05-04): Vueltos (cambio dado al cliente - INFORMATIVO SOLAMENTE)
        // Se calcula y muestra pero NO afecta los totales (como las devoluciones)
        // Después con la práctica real se definirá dónde incluirlo
        $vueltos = $this->calcularVueltos($aperturaCaja);

        // ✅ ACTUALIZADO (2026-03-09): Incluye COMPRA + DEVOLUCION en los egresos, SERVICIO en los ingresos
        // EXCLUYE solo ANULACIONES (transacción cancelada que nunca pasó dinero real)
        // Los VUELTOS se calculan aparte como dato informativo (no afectan los totales)
        $totalEgresos = $gastos + $pagosSueldo + $anticipos + $compras + $devoluciones;
        $totalIngresos = $ventasEfectivo + $pagosCreditoTotal + $servicio;

        // ✅ ACTUALIZADO (2026-05-04): Vueltos NO se restan (informativo solamente)
        // La fórmula es: Apertura + Ingresos - Egresos
        $efectivoEsperado = $montoApertura + $totalIngresos - $totalEgresos;

        // ✅ NUEVO (2026-03-06): Logs detallados para verificar el cálculo
        Log::info('═══════════════════════════════════════════════════════════');
        Log::info('💰 CÁLCULO DE EFECTIVO ESPERADO');
        Log::info('═══════════════════════════════════════════════════════════');
        Log::info('📊 ENTRADAS:');
        Log::info('  - Monto Apertura: Bs. ' . number_format($montoApertura, 2));
        Log::info('  - Ventas Efectivo (EFECTIVO + TRANSFERENCIA/QR): Bs. ' . number_format($ventasEfectivo, 2));
        Log::info('  - Pagos de Crédito (TODOS los tipos): Bs. ' . number_format($pagosCreditoTotal, 2));
        Log::info('  - Servicios: Bs. ' . number_format($servicio, 2));  // ✅ NUEVO (2026-03-09)
        Log::info('  - Ventas Anuladas (no incluidas en total): Bs. ' . number_format($ventasAnuladas, 2));
        Log::info('───────────────────────────────────────────────────────────');
        Log::info('💸 SALIDAS:');
        Log::info('  - Gastos: Bs. ' . number_format($gastos, 2));
        Log::info('  - Pagos de Sueldo: Bs. ' . number_format($pagosSueldo, 2));
        Log::info('  - Anticipos: Bs. ' . number_format($anticipos, 2));
        Log::info('  - Compras: Bs. ' . number_format($compras, 2));
        Log::info('  - Devoluciones: Bs. ' . number_format($devoluciones, 2));  // ✅ NUEVO (2026-03-09)
        Log::info('  - Vueltos (Cambios): Bs. ' . number_format($vueltos, 2));  // ✅ NUEVO (2026-05-03)
        Log::info('  - Anulaciones (EXCLUIDAS del total): Bs. ' . number_format($anulaciones, 2));
        Log::info('  - Total Egresos: Bs. ' . number_format($totalEgresos, 2));
        Log::info('───────────────────────────────────────────────────────────');
        Log::info('📋 DATOS INFORMATIVOS (no afectan totales):');
        Log::info('  - Vueltos (Cambios): Bs. ' . number_format($vueltos, 2) . ' [INFORMATIVO]');
        Log::info('───────────────────────────────────────────────────────────');
        Log::info('✅ FÓRMULA: Apertura + (VentasEfectivo + PagosCrédito + Servicios) - (Gastos + PagosSueldo + Anticipos + Compras + Devoluciones)');
        Log::info('✅ CÁLCULO: ' . number_format($montoApertura, 2) . ' + ' . number_format($totalIngresos, 2) . ' - ' . number_format($totalEgresos, 2));
        Log::info('═══════════════════════════════════════════════════════════');
        Log::info('💵 EFECTIVO ESPERADO EN CAJA: Bs. ' . number_format($efectivoEsperado, 2));
        Log::info('═══════════════════════════════════════════════════════════');

        return [
            'apertura' => $montoApertura,
            'ventas_efectivo' => $ventasEfectivo,
            'ventas_anuladas' => $ventasAnuladas,
            'pagos_credito' => $pagosCreditoTotal,
            'pagos_credito_all' => $pagosCreditoTotal,
            'gastos' => $gastos,
            'pagos_sueldo' => $pagosSueldo,
            'anticipos' => $anticipos,
            'compras' => $compras,
            'devoluciones' => $devoluciones,  // ✅ NUEVO (2026-03-09)
            'servicio' => $servicio,  // ✅ NUEVO (2026-03-09)
            'vueltos' => $vueltos,  // ✅ NUEVO (2026-05-03): Cambios dados al cliente
            'anulaciones' => $anulaciones,
            'total_egresos' => $totalEgresos,
            // ✅ ACTUALIZADO (2026-05-03): monto_esperado = Apertura + Entradas - Salidas - Vueltos
            // Es la cantidad TOTAL de dinero que debería haber en caja al cierre
            'total' => $efectivoEsperado,
        ];
    }

    /**
     * Calcular rango de fechas
     */
    private function calcularRangoFechas($movimientos, $movimientosVenta)
    {
        return [
            'primeraVenta' => $movimientosVenta->min('fecha'),
            'ultimaVenta' => $movimientosVenta->max('fecha'),
            'primerMovimiento' => $movimientos->min('fecha'),
            'ultimoMovimiento' => $movimientos->max('fecha'),
        ];
    }

    /**
     * Calcular rango de IDs de ventas
     */
    private function calcularRangoVentasIds($movimientosVenta)
    {
        $ventaIds = $movimientosVenta
            ->pluck('venta_id')
            ->filter(fn($id) => !empty($id) && $id > 0)
            ->unique()
            ->sort();

        return [
            'minId' => $ventaIds->isNotEmpty() ? $ventaIds->first() : null,
            'maxId' => $ventaIds->isNotEmpty() ? $ventaIds->last() : null,
            'totalVentas' => $ventaIds->count(),
        ];
    }

    /**
     * Calcular rango de créditos
     */
    private function calcularRangoCreditos($movimientosVenta)
    {
        $creditosIds = $movimientosVenta
            ->filter(fn($m) => $m->tipoPago?->nombre === 'Crédito')
            ->pluck('venta_id')
            ->filter(fn($id) => !empty($id) && $id > 0)
            ->unique()
            ->sort();

        return [
            'minId' => $creditosIds->isNotEmpty() ? $creditosIds->first() : null,
            'maxId' => $creditosIds->isNotEmpty() ? $creditosIds->last() : null,
            'totalCreditos' => $creditosIds->count(),
            'montoCreditos' => $movimientosVenta
                ->filter(fn($m) => $m->tipoPago?->nombre === 'Crédito')
                ->sum('monto'),
        ];
    }

    /**
     * Calcular rango de pagos
     */
    private function calcularRangoPagos($movimientos)
    {
        $pagosMovimientos = $movimientos->filter(fn($m) =>
            $m->tipoOperacion->codigo === 'PAGO' && $m->pago?->estado === 'REGISTRADO'
        );

        $pagosIds = $pagosMovimientos
            ->pluck('id')
            ->unique()
            ->sort();

        return [
            'minId' => $pagosIds->isNotEmpty() ? $pagosIds->first() : null,
            'maxId' => $pagosIds->isNotEmpty() ? $pagosIds->last() : null,
            'totalPagos' => $pagosIds->count(),
            'montoPagos' => $pagosMovimientos->sum('monto'),
        ];
    }

    /**
     * ✅ REFACTORIZADO: Calcular sumatoria de ventas aprobadas
     * ✅ Método unificado que reemplaza 3 métodos casi idénticos
     * ✅ Usa siempre estados_documento.codigo (APROBADO)
     *
     * @param AperturaCaja $aperturaCaja
     * @param array $tiposOperacion ['VENTA', 'CREDITO'] para obtener todos; ['VENTA'] para solo ventas
     * @param string|null $tipoPagoCodigo null para todos; 'EFECTIVO' para efectivo; 'CREDITO' para crédito
     * @return float
     */
    private function calcularVentasAprobadas(
        AperturaCaja $aperturaCaja,
        array $tiposOperacion = ['VENTA', 'CREDITO'],
        ?string $tipoPagoCodigo = null
    ): float {
        try {
            $query = DB::table('movimientos_caja')
                ->join('ventas', 'movimientos_caja.numero_documento', '=', 'ventas.numero')
                ->join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->where('movimientos_caja.caja_id', $aperturaCaja->caja_id)
                ->whereIn('tipo_operacion_caja.codigo', $tiposOperacion)
                ->where('estados_documento.codigo', self::ESTADO_APROBADO) // ✅ Usa código, no nombre
                ->whereBetween('movimientos_caja.fecha', [$this->fechaInicio, $this->fechaFin]);

            // Filtro opcional por tipo de pago
            if ($tipoPagoCodigo) {
                $query->join('tipos_pago', 'movimientos_caja.tipo_pago_id', '=', 'tipos_pago.id')
                      ->where('tipos_pago.codigo', $tipoPagoCodigo);
            }

            $resultado = $query->sum('ventas.total');

            Log::info('💰 [calcularVentasAprobadas]:', [
                'apertura_id' => $aperturaCaja->id,
                'tipos_operacion' => $tiposOperacion,
                'tipo_pago' => $tipoPagoCodigo ?? 'TODOS',
                'total' => $resultado,
            ]);

            return (float) $resultado;
        } catch (\Exception $e) {
            Log::error('❌ [calcularVentasAprobadas]:', [
                'apertura_id' => $aperturaCaja->id,
                'tipos_operacion' => $tiposOperacion,
                'tipo_pago' => $tipoPagoCodigo ?? 'TODOS',
                'error' => $e->getMessage(),
            ]);
            return 0;
        }
    }

    /**
     * Calcular sumatoria TOTAL de ventas APROBADAS (todos los tipos de pago)
     */
    private function calcularVentasAprobadasTotal(AperturaCaja $aperturaCaja)
    {
        return $this->calcularVentasAprobadas($aperturaCaja, ['VENTA', 'CREDITO']);
    }

    /**
     * Calcular sumatoria de ventas APROBADAS en EFECTIVO
     */
    private function calcularVentasAprobadasEfectivo(AperturaCaja $aperturaCaja)
    {
        return $this->calcularVentasAprobadas($aperturaCaja, ['VENTA'], 'EFECTIVO');
    }

    /**
     * ✅ REFACTORIZADO (2026-02-20): Calcular sumatoria de ventas APROBADAS a CRÉDITO
     *
     * Busca DIRECTAMENTE en tabla ventas (no en movimientos_caja)
     * Esto es más óptimo y captura TODAS las ventas a crédito aprobadas
     * independientemente de si tienen movimiento registrado
     *
     * Diferencia importante:
     * - tipos_pago: Métodos de pago (Efectivo, Transferencia, Cheque) → cómo pagó
     * - politica_pago: Política de pago (Contra Entrega, Crédito, etc.) → condiciones
     */
    private function calcularVentasAprobadasCredito(AperturaCaja $aperturaCaja): float
    {
        try {
            // ✅ REFACTORIZADO: Buscar DIRECTAMENTE en tabla ventas
            // Esto es más óptimo que depender de movimientos_caja
            $query = DB::table('ventas')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->where('ventas.caja_id', $aperturaCaja->caja_id)                 // ✅ Ventas de ESTA caja
                ->where('ventas.usuario_id', $aperturaCaja->user_id)              // ✅ Del USUARIO DE LA APERTURA (campo correcto: usuario_id)
                ->where('ventas.politica_pago', 'CREDITO')                        // ✅ POLÍTICA de pago = CRÉDITO
                ->where('estados_documento.codigo', self::ESTADO_APROBADO)        // ✅ APROBADAS
                ->whereBetween('ventas.created_at', [$this->fechaInicio, $this->fechaFin]);  // ✅ Rango de fechas

            // ✅ DEBUG: Ver el SQL y cantidad de registros
            $registros = $query->get();
            $total = (float) $registros->sum('total');

            Log::info('💳 [calcularVentasAprobadasCredito] - DEBUGGING (OPTIMIZADO):', [
                'apertura_id' => $aperturaCaja->id,
                'caja_id' => $aperturaCaja->caja_id,
                'user_id' => $aperturaCaja->user_id,
                'fecha_inicio' => $this->fechaInicio,
                'fecha_fin' => $this->fechaFin,
                'cantidad_registros' => $registros->count(),
                'total_credito' => $total,
                'registro_ids' => $registros->pluck('id')->toArray(),
                'registros_completos' => $registros->toArray(),
                'sql_query' => $query->toSql(),
                'sql_bindings' => $query->getBindings(),
            ]);

            return $total;
        } catch (\Exception $e) {
            Log::error('❌ [calcularVentasAprobadasCredito]:', [
                'apertura_id' => $aperturaCaja->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return 0;
        }
    }

    /**
     * ✅ NUEVO: Calcular TODAS las ventas a crédito de UNA CAJA
     *
     * Suma TODAS las ventas APROBADAS con politica_pago='CREDITO'
     * que pertenezcan a esta caja (pagadas o pendientes)
     *
     * ✅ REFACTORIZADO (2026-02-20):
     * - Usa movimientos_caja como tabla principal
     * - Filtra por caja_id + politica_pago='CREDITO' + estado='APROBADO'
     * - Permite que admins vean todas las cajas sin restricción de usuario
     *
     * @param AperturaCaja $aperturaCaja
     * @return float Suma total de ventas a crédito de la caja
     */
    public function calcularVentasCreditoDeCaja(AperturaCaja $aperturaCaja): float
    {
        try {
            // ✅ CORREGIDO (2026-03-03): Filtrar por CAJA + USUARIO + PERÍODO DE APERTURA
            // Considerar que la caja puede estar abierta varios días

            $fechaCierre = $aperturaCaja->cierre?->created_at ?? now();  // Si está cerrada, usar fecha cierre; sino, ahora

            $total = DB::table('ventas')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->where('ventas.caja_id', $aperturaCaja->caja_id)           // ✅ Ventas de esta caja
                ->where('ventas.usuario_id', $aperturaCaja->user_id)         // ✅ Ventas del USUARIO DE LA APERTURA (campo correcto: usuario_id)
                ->where('ventas.created_at', '>=', $aperturaCaja->fecha)    // ✅ Desde que se abrió
                ->where('ventas.created_at', '<=', $fechaCierre)            // ✅ Hasta que se cerró (o ahora)
                ->where('ventas.politica_pago', 'CREDITO')                  // ✅ Política CRÉDITO
                ->where('estados_documento.codigo', self::ESTADO_APROBADO)  // ✅ Solo aprobadas
                ->sum('ventas.total');                                      // ✅ Suma totales de ventas

            Log::info('💳 [calcularVentasCreditoDeCaja]:', [
                'apertura_id' => $aperturaCaja->id,
                'caja_id' => $aperturaCaja->caja_id,
                'user_id' => $aperturaCaja->user_id,
                'fecha_apertura' => $aperturaCaja->fecha,
                'fecha_cierre' => $fechaCierre,
                'dias_abierta' => $aperturaCaja->fecha->diffInDays($fechaCierre),
                'total_credito' => $total,
            ]);

            return (float) $total;
        } catch (\Exception $e) {
            Log::error('❌ [calcularVentasCreditoDeCaja]:', [
                'apertura_id' => $aperturaCaja->id,
                'caja_id' => $aperturaCaja->caja_id,
                'user_id' => $aperturaCaja->user_id,
                'error' => $e->getMessage(),
            ]);
            return 0;
        }
    }

    /**
     * Calcular sumatoria de ventas anuladas
     * ✅ Usa estados_documento.codigo para mayor seguridad
     */
    private function calcularVentasAnuladas(AperturaCaja $aperturaCaja)
    {
        try {
            // ✅ NUEVO (2026-03-09): Obtener desglose detallado de ventas anuladas
            $ventasAnuladasDetalle = DB::table('movimientos_caja')
                ->join('ventas', 'movimientos_caja.numero_documento', '=', 'ventas.numero')
                ->join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->where('movimientos_caja.caja_id', $aperturaCaja->caja_id)
                ->where('tipo_operacion_caja.codigo', 'VENTA')
                ->where('estados_documento.codigo', self::ESTADO_ANULADO)
                ->whereBetween('movimientos_caja.fecha', [$this->fechaInicio, $this->fechaFin])
                ->select('ventas.numero', 'ventas.total', 'movimientos_caja.fecha', 'estados_documento.nombre')
                ->orderBy('ventas.numero')
                ->get();

            $resultado = (float) $ventasAnuladasDetalle->sum('total');

            Log::info('📋 [calcularVentasAnuladas] - DESGLOSE DETALLADO:', [
                'apertura_id' => $aperturaCaja->id,
                'cantidad_ventas_anuladas' => $ventasAnuladasDetalle->count(),
                'total_anulado' => $resultado,
                'ventas_anuladas' => $ventasAnuladasDetalle->map(fn($v) => [
                    'numero' => $v->numero,
                    'total' => (float) $v->total,
                    'fecha' => $v->fecha,
                ])->toArray(),
            ]);

            return $resultado;
        } catch (\Exception $e) {
            Log::error('❌ [calcularVentasAnuladas]:', [
                'apertura_id' => $aperturaCaja->id,
                'error' => $e->getMessage(),
            ]);
            return 0;
        }
    }

    /**
     * ✅ Retorna ventas por tipo de pago incluyendo tipos de pago con $0
     */
    private function calcularVentasPorTipoPagoConTodos($ventasPorTipoPago)
    {
        try {
            $todosTiposPago = \App\Models\TipoPago::all()->pluck('nombre');

            $resultado = [];
            foreach ($todosTiposPago as $tipo) {
                $resultado[$tipo] = ['cantidad' => 0, 'total' => 0];
            }

            foreach ($ventasPorTipoPago as $tipo => $datos) {
                if (isset($resultado[$tipo])) {
                    $resultado[$tipo] = [
                        'cantidad' => $datos['cantidad'] ?? 0,
                        'total' => $datos['total'] ?? 0,
                    ];
                }
            }

            Log::info('✅ [calcularVentasPorTipoPagoConTodos]:', [
                'total_tipos' => count($resultado),
            ]);

            return $resultado;
        } catch (\Exception $e) {
            Log::error('❌ [calcularVentasPorTipoPagoConTodos]:', ['error' => $e->getMessage()]);
            return $ventasPorTipoPago;
        }
    }

    /**
     * Calcular sumatorias de ventas registradas en movimientos_caja por tipos de pago
     * ✅ Usa estados_documento.codigo para validación segura
     *
     * Agrupa las ventas APROBADAS por tipo de pago y retorna:
     * - cantidad: número de ventas
     * - total: suma de montos
     * - promedio_por_venta: total / cantidad
     */
    private function calcularSumatoriasVentasPorTipoPago($movimientos)
    {
        try {
            $resultado = $movimientos
                ->filter(function ($mov) {
                    // Solo ventas aprobadas (usando código de estado)
                    $tipoOp = $mov->tipoOperacion?->codigo;
                    return $this->esVentaAprobada($mov) && $tipoOp === 'VENTA';
                })
                ->groupBy(fn($m) => $m->tipoPago?->nombre ?? 'Sin tipo de pago')
                ->map(function ($grupo) {
                    $cantidad = $grupo->pluck('venta_id')->unique()->count();
                    $total = (float) $grupo->sum('monto');
                    $promedio = $cantidad > 0 ? $total / $cantidad : 0;

                    return [
                        'tipo_pago' => $grupo->first()?->tipoPago?->nombre ?? 'Sin tipo de pago',
                        'cantidad' => $cantidad,
                        'total' => $total,
                        'promedio_por_venta' => round($promedio, 2),
                    ];
                })
                ->values();

            Log::info('✅ [calcularSumatoriasVentasPorTipoPago]:', [
                'tipos_pago' => $resultado->count(),
                'total_ventas' => $resultado->sum('cantidad'),
                'total_monto' => $resultado->sum('total'),
            ]);

            return $resultado;
        } catch (\Exception $e) {
            Log::error('❌ [calcularSumatoriasVentasPorTipoPago]:', ['error' => $e->getMessage()]);
            return collect();
        }
    }

    /**
     * ✅ Calcular CANTIDAD de ventas a crédito
     * Cuenta cuántas operaciones de tipo CREDITO hay aprobadas
     */
    private function calcularCantidadVentasCredito(AperturaCaja $aperturaCaja): int
    {
        try {
            $cantidad = DB::table('movimientos_caja')
                ->join('ventas', 'movimientos_caja.numero_documento', '=', 'ventas.numero')
                ->join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->where('movimientos_caja.caja_id', $aperturaCaja->caja_id)
                ->where('tipo_operacion_caja.codigo', 'CREDITO')
                ->where('estados_documento.codigo', self::ESTADO_APROBADO)
                ->whereBetween('movimientos_caja.fecha', [$this->fechaInicio, $this->fechaFin])
                ->distinct('ventas.id')
                ->count();

            Log::info('📊 [calcularCantidadVentasCredito]:', [
                'apertura_id' => $aperturaCaja->id,
                'cantidad' => $cantidad,
            ]);

            return (int) $cantidad;
        } catch (\Exception $e) {
            Log::error('❌ [calcularCantidadVentasCredito]:', [
                'apertura_id' => $aperturaCaja->id,
                'error' => $e->getMessage(),
            ]);
            return 0;
        }
    }

    /**
     * ✅ NUEVO (2026-04-30): Calcular pagos de ventas agrupados por tipo desde detalles_pago_venta
     * CON FALLBACK a movimientos_caja para ventas antiguas sin detalles_pago_venta
     * Esta es la FUENTE DE VERDAD para dinero real que entró por ventas
     *
     * Obtiene TODAS las ventas de esta caja en el período y suma sus detalles_pago_venta
     */
    private function calcularDetallesPagosVentaPorTipo(AperturaCaja $aperturaCaja): array
    {
        try {
            // ✅ CORREGIDO (2026-04-30): Obtener SOLO ventas APROBADAS, no anuladas
            // Obtener IDs de ventas APROBADAS en esta caja durante el período
            $ventasIds = DB::table('movimientos_caja')
                ->join('ventas', 'movimientos_caja.numero_documento', '=', 'ventas.numero')
                ->join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
                ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->where('movimientos_caja.caja_id', $aperturaCaja->caja_id)
                ->whereIn('tipo_operacion_caja.codigo', ['VENTA', 'CREDITO'])
                ->where('estados_documento.codigo', self::ESTADO_APROBADO)
                ->whereBetween('movimientos_caja.fecha', [$this->fechaInicio, $this->fechaFin])
                ->pluck('ventas.id')
                ->filter()
                ->unique()
                ->toArray();

            if (empty($ventasIds)) {
                return [];
            }

            // 1️⃣ Intentar obtener desde detalles_pago_venta (ventas nuevas)
            $pagos = DB::table('detalles_pago_venta')
                ->join('tipos_pago', 'detalles_pago_venta.tipo_pago_id', '=', 'tipos_pago.id')
                ->whereIn('detalles_pago_venta.venta_id', $ventasIds)
                ->select(
                    'tipos_pago.nombre',
                    'tipos_pago.codigo',
                    DB::raw('SUM(detalles_pago_venta.monto) as total'),
                    DB::raw('COUNT(DISTINCT detalles_pago_venta.venta_id) as cantidad')
                )
                ->groupBy('tipos_pago.id', 'tipos_pago.nombre', 'tipos_pago.codigo')
                ->get();

            $resultado = [];
            $ventasConDetalles = [];
            foreach ($pagos as $pago) {
                $resultado[$pago->nombre] = [
                    'codigo' => $pago->codigo,
                    'cantidad' => (int) $pago->cantidad,
                    'total' => (float) $pago->total,
                ];
                // Registrar que esta venta tiene detalles
                // Nota: Necesitamos obtener las ventas con detalles para el fallback
            }

            // 2️⃣ Obtener IDs de ventas que SÍ tienen detalles_pago_venta
            $ventasConDetallesIds = DB::table('detalles_pago_venta')
                ->whereIn('venta_id', $ventasIds)
                ->pluck('venta_id')
                ->unique()
                ->toArray();

            // 3️⃣ FALLBACK: Ventas antiguas sin detalles_pago_venta - usar movimientos_caja
            $ventasAntiguasIds = array_diff($ventasIds, $ventasConDetallesIds);
            if (!empty($ventasAntiguasIds)) {
                Log::warning('⚠️ [calcularDetallesPagosVentaPorTipo] Usando fallback para ventas antiguas:', [
                    'cantidad_ventas_antiguas' => count($ventasAntiguasIds),
                ]);

                // ✅ CORREGIDO (2026-04-30): Validar también estado APROBADO en el fallback
                $pagosAntiguos = DB::table('movimientos_caja')
                    ->join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
                    ->join('tipos_pago', 'movimientos_caja.tipo_pago_id', '=', 'tipos_pago.id')
                    ->join('ventas', 'movimientos_caja.numero_documento', '=', 'ventas.numero')
                    ->join('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                    ->whereIn('movimientos_caja.venta_id', $ventasAntiguasIds)
                    ->whereIn('tipo_operacion_caja.codigo', ['VENTA', 'CREDITO'])
                    ->where('estados_documento.codigo', self::ESTADO_APROBADO)
                    ->select(
                        'tipos_pago.nombre',
                        'tipos_pago.codigo',
                        DB::raw('SUM(movimientos_caja.monto) as total'),
                        DB::raw('COUNT(DISTINCT movimientos_caja.venta_id) as cantidad')
                    )
                    ->groupBy('tipos_pago.id', 'tipos_pago.nombre', 'tipos_pago.codigo')
                    ->get();

                foreach ($pagosAntiguos as $pago) {
                    if (!isset($resultado[$pago->nombre])) {
                        $resultado[$pago->nombre] = [
                            'codigo' => $pago->codigo,
                            'cantidad' => (int) $pago->cantidad,
                            'total' => (float) $pago->total,
                        ];
                    } else {
                        // Agregar al total existente
                        $resultado[$pago->nombre]['cantidad'] += (int) $pago->cantidad;
                        $resultado[$pago->nombre]['total'] += (float) $pago->total;
                    }
                }
            }

            Log::info('💳 [calcularDetallesPagosVentaPorTipo] (detalles_pago_venta + fallback):', [
                'apertura_id' => $aperturaCaja->id,
                'ventas_count' => count($ventasIds),
                'ventas_con_detalles' => count($ventasConDetallesIds),
                'ventas_antiguas' => count($ventasAntiguasIds),
                'datos' => $resultado,
            ]);

            return $resultado;
        } catch (\Exception $e) {
            Log::error('❌ [calcularDetallesPagosVentaPorTipo]:', [
                'apertura_id' => $aperturaCaja->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return [];
        }
    }

    /**
     * ✅ NUEVO (2026-05-03): Calcular suma de VUELTOS registrados
     *
     * Cuando cliente paga más de lo que cuesta la venta:
     * - Ejemplo: Venta 96, Cliente paga 110, Vuelto 14
     *
     * Se registran como movimientos separados:
     * - VENTA: +96 (desglosado por tipo de pago)
     * - VUELTO: -14 (como movimiento único)
     *
     * Esta función suma TODOS los vueltos del período de la caja
     * para que el frontend pueda mostrar: totalIngresos - vueltos = neto real
     */
    private function calcularVueltos(AperturaCaja $aperturaCaja): float
    {
        try {
            // ✅ ACTUALIZADO (2026-05-04): Solo contar vueltos de ventas APROBADAS
            // Si una venta está anulada, sus vueltos NO deben contarse
            $totalVueltos = DB::table('movimientos_caja')
                ->join('tipo_operacion_caja', 'movimientos_caja.tipo_operacion_id', '=', 'tipo_operacion_caja.id')
                ->leftJoin('ventas', 'movimientos_caja.venta_id', '=', 'ventas.id')
                ->leftJoin('estados_documento', 'ventas.estado_documento_id', '=', 'estados_documento.id')
                ->where('movimientos_caja.caja_id', $aperturaCaja->caja_id)
                ->where('tipo_operacion_caja.codigo', 'VUELTO')
                ->whereBetween('movimientos_caja.fecha', [$this->fechaInicio, $this->fechaFin])
                // ✅ SOLO vueltos de ventas APROBADAS (no anuladas, no rechazadas)
                ->where(function ($query) {
                    $query->whereNull('movimientos_caja.venta_id')  // Vueltos sin venta asociada
                          ->orWhere('estados_documento.codigo', self::ESTADO_APROBADO);  // O ventas aprobadas
                })
                ->sum(DB::raw('ABS(movimientos_caja.monto)'));  // ABS porque se registran como negativos

            Log::info('💸 [calcularVueltos] (SOLO de ventas APROBADAS):', [
                'apertura_id' => $aperturaCaja->id,
                'total_vueltos' => $totalVueltos,
            ]);

            return (float) $totalVueltos;
        } catch (\Exception $e) {
            Log::error('❌ [calcularVueltos]:', [
                'apertura_id' => $aperturaCaja->id,
                'error' => $e->getMessage(),
            ]);
            return 0;
        }
    }
}
