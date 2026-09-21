<?php

namespace App\Services\Venta;

use App\Models\Venta;
use App\Models\PrestamoCliente;
use App\Models\PrestamoEvento;
use App\Services\Prestamos\PrestamoReversalService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * VentaPrestablesReverseService
 *
 * Gestiona la reversión de prestables cuando se anula una venta
 *
 * DIFERENCIA CON anularPrestamo():
 * ├─ anularPrestamo() → Para anulación MANUAL de préstamo
 * │  └─ Incrementa sin_liquido (devuelve lo prestado)
 * │
 * └─ revertirPrestables() → Para anulación AUTOMÁTICA por venta
 *    └─ Decrementa sin_liquido (revierte lo que la venta agregó)
 *
 * RESPONSABILIDADES:
 * ✓ Revertir PrestableStock (disponible↑, sin_liquido↓, deudor↓)
 * ✓ Cancelar PrestamoCliente si existe
 * ✓ Cancelar PrestamoEvento si existe
 * ✓ Crear MovimientoPrestable de auditoría
 *
 * LÓGICA:
 * - Si cliente.codigo != 'EVENTO' → Busca PrestamoCliente
 * - Si cliente.codigo == 'EVENTO' → Busca PrestamoEvento
 */
class VentaPrestablesReverseService
{
    public function __construct(
        private PrestamoReversalService $prestamoReversalService,
    ) {}

    /**
     * Revertir prestables cuando se anula una venta
     *
     * ✅ Genera movimientos inversos en PrestableStock
     * ✅ Anula PrestamoCliente o PrestamoEvento según cliente
     * ✅ Registra MovimientoPrestable con tipo='ENTRADA'
     *
     * @param Venta $venta La venta a revertir
     * @param string $motivo Razón de la anulación
     * @throws \Exception Si falla la reversión
     */
    public function revertirPrestables(Venta $venta, string $motivo): void
    {
        try {
            // Cargar relaciones necesarias
            $venta->load(['cliente']);

            Log::info('🔄 [VentaPrestablesReverseService] Iniciando reversión de prestables', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'cliente_id' => $venta->cliente_id,
                'cliente_codigo' => $venta->cliente?->codigo,
                'motivo' => $motivo,
            ]);

            // 1️⃣ Buscar y anular PrestamoEvento (cliente_id = 51 es EVENTOS)
            // ✅ Primero buscar por relación many-to-many (más confiable)
            if ($venta->cliente_id === 51) {
                $this->revertirPrestamosEvento($venta, $motivo);
            }

            // 2️⃣ Buscar y anular PrestamoCliente
            // ✅ Clientes normales (cualquier cliente que NO sea 51)
            if ($venta->cliente_id !== 51) {
                $this->revertirPrestamosCliente($venta, $motivo);
            }

            Log::info('✅ Prestables revertidos correctamente al anular venta', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'cliente_codigo' => $venta->cliente?->codigo,
                'motivo' => $motivo,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error revirtiendo prestables al anular venta', [
                'venta_id' => $venta->id,
                'venta_numero' => $venta->numero,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Revertir PrestamoCliente asociados a la venta
     *
     * ✅ Busca por venta_id
     * ✅ Usa PrestamoReversalService::revertirPrestamoCliente()
     * ✅ Decrementa sin_liquido y cliente_deudor (reversión específica de venta)
     *
     * @param Venta $venta
     * @param string $motivo
     */
    private function revertirPrestamosCliente(Venta $venta, string $motivo): void
    {
        try {
            // Buscar préstamos de cliente asociados a esta venta
            $prestamos = PrestamoCliente::where('venta_id', $venta->id)
                ->where('estado', '!=', 'CANCELADO')
                ->get();

            if ($prestamos->isEmpty()) {
                Log::info('ℹ️ No hay PrestamoCliente para revertir', [
                    'venta_id' => $venta->id,
                ]);
                return;
            }

            foreach ($prestamos as $prestamo) {
                Log::info('🔄 Revirtiendo PrestamoCliente', [
                    'prestamo_id' => $prestamo->id,
                    'cliente_id' => $prestamo->cliente_id,
                    'venta_id' => $venta->id,
                    'estado_actual' => $prestamo->estado,
                ]);

                // ✅ Usa PrestamoReversalService para reversión específica de venta
                // - Decrementa sin_liquido (revierte el +10 de la venta)
                // - Decrementa cliente_deudor (revierte el préstamo)
                // - Incrementa disponible (revierte el -10 de la venta)
                // - Crea MovimientoPrestable
                // - Cambia estado a CANCELADO
                $this->prestamoReversalService->revertirPrestamoCliente(
                    $prestamo,
                    $venta,
                    $motivo
                );

                Log::info('✅ PrestamoCliente revertido correctamente', [
                    'prestamo_id' => $prestamo->id,
                    'venta_id' => $venta->id,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('❌ Error revirtiendo PrestamoCliente', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }

    /**
     * Revertir PrestamoEvento asociados a la venta
     *
     * ✅ Busca por relación many-to-many en prestamo_evento_venta
     * ✅ Usa PrestamoReversalService::revertirPrestamoEvento()
     * ✅ Decrementa sin_liquido y evento_deudor (reversión específica de venta)
     *
     * @param Venta $venta
     * @param string $motivo
     */
    private function revertirPrestamosEvento(Venta $venta, string $motivo): void
    {
        try {
            // Buscar préstamos a evento asociados a esta venta
            $prestamos = PrestamoEvento::whereHas('ventas', function ($query) use ($venta) {
                $query->where('venta_id', $venta->id);
            })
            ->where('estado', '!=', 'CANCELADO')
            ->get();

            if ($prestamos->isEmpty()) {
                Log::info('ℹ️ No hay PrestamoEvento para revertir', [
                    'venta_id' => $venta->id,
                ]);
                return;
            }

            foreach ($prestamos as $prestamo) {
                Log::info('🔄 Revirtiendo PrestamoEvento', [
                    'prestamo_evento_id' => $prestamo->id,
                    'cliente_id' => $prestamo->cliente_id,
                    'venta_id' => $venta->id,
                    'estado_actual' => $prestamo->estado,
                ]);

                // ✅ Usa PrestamoReversalService para reversión específica de venta
                // - Decrementa sin_liquido (revierte el +10 de la venta)
                // - Decrementa evento_deudor (revierte el préstamo)
                // - Incrementa disponible (revierte el -10 de la venta)
                // - Crea MovimientoPrestable
                // - Cambia estado a CANCELADO
                $this->prestamoReversalService->revertirPrestamoEvento(
                    $prestamo,
                    $venta,
                    $motivo
                );

                Log::info('✅ PrestamoEvento revertido correctamente', [
                    'prestamo_evento_id' => $prestamo->id,
                    'venta_id' => $venta->id,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('❌ Error revirtiendo PrestamoEvento', [
                'venta_id' => $venta->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
