<?php

namespace App\Services\Compra;

use App\Models\Compra;
use App\Models\PrestamoProveedor;
use App\Services\Prestamos\PrestamoReversalService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * CompraPrestablesReverseService
 *
 * Gestiona la reversión de prestables cuando se anula una compra
 *
 * RESPONSABILIDADES:
 * ✓ Revertir PrestableStock (disponible↓, proveedor_acreedor↓)
 * ✓ Cancelar PrestamoProveedor si existe
 * ✓ Crear MovimientoPrestable de auditoría
 */
class CompraPrestablesReverseService
{
    public function __construct(
        private PrestamoReversalService $prestamoReversalService,
    ) {}

    /**
     * Revertir prestables cuando se anula una compra
     *
     * ✅ Genera movimientos inversos en PrestableStock
     * ✅ Anula PrestamoProveedor si existe
     * ✅ Registra MovimientoPrestable con tipo='ENTRADA'
     *
     * @param Compra $compra La compra a revertir
     * @param string $motivo Razón de la anulación
     * @throws \Exception Si falla la reversión
     */
    public function revertirPrestables(Compra $compra, string $motivo): void
    {
        try {
            Log::info('🔄 [CompraPrestablesReverseService] Iniciando reversión de prestables', [
                'compra_id' => $compra->id,
                'compra_numero' => $compra->numero,
                'motivo' => $motivo,
            ]);

            // Buscar y anular PrestamoProveedor
            $this->revertirPrestamosProveedor($compra, $motivo);

            Log::info('✅ Prestables revertidos correctamente al anular compra', [
                'compra_id' => $compra->id,
                'compra_numero' => $compra->numero,
                'motivo' => $motivo,
            ]);
        } catch (\Exception $e) {
            Log::error('❌ Error revirtiendo prestables al anular compra', [
                'compra_id' => $compra->id,
                'compra_numero' => $compra->numero,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * Revertir PrestamoProveedor asociados a la compra
     *
     * ✅ Busca por compra_id
     * ✅ Usa PrestamoReversalService::revertirPrestamoProveedor()
     * ✅ Decrementa proveedor_acreedor (reversión específica de compra)
     *
     * @param Compra $compra
     * @param string $motivo
     */
    private function revertirPrestamosProveedor(Compra $compra, string $motivo): void
    {
        try {
            // Buscar préstamos a proveedor asociados a esta compra
            $prestamos = PrestamoProveedor::where('compra_id', $compra->id)
                ->where('estado', '!=', 'CANCELADO')
                ->get();

            if ($prestamos->isEmpty()) {
                Log::info('ℹ️ No hay PrestamoProveedor para revertir', [
                    'compra_id' => $compra->id,
                ]);
                return;
            }

            foreach ($prestamos as $prestamo) {
                Log::info('🔄 Revirtiendo PrestamoProveedor', [
                    'prestamo_id' => $prestamo->id,
                    'proveedor_id' => $prestamo->proveedor_id,
                    'compra_id' => $compra->id,
                    'estado_actual' => $prestamo->estado,
                ]);

                // ✅ Usa PrestamoReversalService para reversión específica de compra
                // - Decrementa proveedor_acreedor (revierte el préstamo)
                // - Decrementa disponible (revierte lo que la compra agregó)
                // - Crea MovimientoPrestable
                // - Cambia estado a CANCELADO
                $this->prestamoReversalService->revertirPrestamoProveedor(
                    $prestamo,
                    $compra,
                    $motivo
                );

                Log::info('✅ PrestamoProveedor revertido correctamente', [
                    'prestamo_id' => $prestamo->id,
                    'compra_id' => $compra->id,
                ]);
            }
        } catch (\Exception $e) {
            Log::error('❌ Error revirtiendo PrestamoProveedor', [
                'compra_id' => $compra->id,
                'error' => $e->getMessage(),
            ]);
            throw $e;
        }
    }
}
