<?php

namespace App\Services;

use App\Models\MovimientoPrestable;
use App\Models\PrestableStock;
use Illuminate\Support\Facades\Log;

class MovimientoPrestableService
{
    /**
     * Registra un movimiento de prestable
     *
     * @param array $data Datos del movimiento
     * @return MovimientoPrestable
     */
    public function registrarMovimiento(array $data): MovimientoPrestable
    {
        try {
            $movimiento = MovimientoPrestable::create([
                'prestable_stock_id' => $data['prestable_stock_id'],
                'almacenes_prestables_id' => $data['almacenes_prestables_id'],
                'usuario_id' => $data['usuario_id'] ?? auth()->id(),
                'tipo' => $data['tipo'],
                'cantidad' => $data['cantidad'] ?? 0,
                'disponible_anterior' => $data['disponible_anterior'] ?? 0,
                'prestamo_cliente_anterior' => $data['prestamo_cliente_anterior'] ?? 0,
                'prestamo_proveedor_anterior' => $data['prestamo_proveedor_anterior'] ?? 0,
                'vendida_anterior' => $data['vendida_anterior'] ?? 0,
                'disponible_posterior' => $data['disponible_posterior'] ?? 0,
                'prestamo_cliente_posterior' => $data['prestamo_cliente_posterior'] ?? 0,
                'prestamo_proveedor_posterior' => $data['prestamo_proveedor_posterior'] ?? 0,
                'vendida_posterior' => $data['vendida_posterior'] ?? 0,
                'categoria_afectada' => $data['categoria_afectada'] ?? null,
                'motivo' => $data['motivo'] ?? null,
                'observaciones' => $data['observaciones'] ?? null,
                'numero_referencia' => $data['numero_referencia'] ?? null,
                'referencia_tipo' => $data['referencia_tipo'] ?? null,
                'referencia_id' => $data['referencia_id'] ?? null,
                'ip_usuario' => $data['ip_usuario'] ?? request()?->ip(),
                'user_agent' => $data['user_agent'] ?? request()?->userAgent(),
            ]);

            Log::info('✅ Movimiento de prestable registrado', [
                'movimiento_id' => $movimiento->id,
                'prestable_stock_id' => $data['prestable_stock_id'],
                'tipo' => $data['tipo'],
                'cantidad' => $data['cantidad'] ?? 0,
            ]);

            return $movimiento;
        } catch (\Exception $e) {
            Log::error('❌ Error registrando movimiento de prestable', [
                'error' => $e->getMessage(),
                'data' => $data,
            ]);
            throw $e;
        }
    }

    /**
     * Registra un movimiento de ajuste directo
     */
    public function registrarAjusteDirecto(
        PrestableStock $stock,
        int $almacenId,
        int $disponibleAntes,
        int $prestamoClienteAntes,
        int $prestamoProveedorAntes,
        int $vendidaAntes,
        int $disponibleDespues,
        int $prestamoClienteDespues,
        int $prestamoProveedorDespues,
        int $vendidaDespues,
        ?string $motivo = null,
        ?string $observaciones = null,
        ?int $ajusteId = null,
    ): MovimientoPrestable {
        $totalAntes = $disponibleAntes + $prestamoClienteAntes + $prestamoProveedorAntes + $vendidaAntes;
        $totalDespues = $disponibleDespues + $prestamoClienteDespues + $prestamoProveedorDespues + $vendidaDespues;

        return $this->registrarMovimiento([
            'prestable_stock_id' => $stock->id,
            'almacenes_prestables_id' => $almacenId,
            'usuario_id' => auth()->id(),
            'tipo' => 'AJUSTE_DIRECTO',
            'cantidad' => $totalDespues - $totalAntes,
            'disponible_anterior' => $disponibleAntes,
            'prestamo_cliente_anterior' => $prestamoClienteAntes,
            'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
            'vendida_anterior' => $vendidaAntes,
            'disponible_posterior' => $disponibleDespues,
            'prestamo_cliente_posterior' => $prestamoClienteDespues,
            'prestamo_proveedor_posterior' => $prestamoProveedorDespues,
            'vendida_posterior' => $vendidaDespues,
            'motivo' => $motivo,
            'observaciones' => $observaciones,
            'numero_referencia' => $ajusteId ? "AJUSTE-{$ajusteId}" : null,
            'referencia_tipo' => 'AJUSTE',
            'referencia_id' => $ajusteId,
        ]);
    }

    /**
     * Registra un movimiento de ajuste relativo (incremento/decremento)
     */
    public function registrarAjusteRelativo(
        PrestableStock $stock,
        int $almacenId,
        string $categoria,
        int $cantidad,
        ?string $motivo = null,
        ?string $observaciones = null,
        ?int $ajusteId = null,
    ): MovimientoPrestable {
        // Compatibilidad: aceptar categorías legacy y normalizarlas.
        $categoriaNormalizada = match ($categoria) {
            'prestamo_cliente_activo' => 'prestamo_cliente',
            'prestamo_proveedor_activo' => 'prestamo_proveedor',
            default => $categoria,
        };

        // Valores antes
        $disponibleAntes = $stock->cantidad_disponible;
        $prestamoClienteAntes = $stock->cantidad_prestamo_cliente_activo;
        $prestamoProveedorAntes = $stock->cantidad_prestamo_proveedor_activo;
        $vendidaAntes = 0;

        // Valores después (con el ajuste aplicado)
        $disponibleDespues = $disponibleAntes + (($categoriaNormalizada === 'disponible') ? $cantidad : 0);
        $prestamoClienteDespues = $prestamoClienteAntes + (($categoriaNormalizada === 'prestamo_cliente') ? $cantidad : 0);
        $prestamoProveedorDespues = $prestamoProveedorAntes + (($categoriaNormalizada === 'prestamo_proveedor') ? $cantidad : 0);
        $vendidaDespues = 0;

        return $this->registrarMovimiento([
            'prestable_stock_id' => $stock->id,
            'almacenes_prestables_id' => $almacenId,
            'usuario_id' => auth()->id(),
            'tipo' => 'AJUSTE_RELATIVO',
            'cantidad' => $cantidad,
            'disponible_anterior' => $disponibleAntes,
            'prestamo_cliente_anterior' => $prestamoClienteAntes,
            'prestamo_proveedor_anterior' => $prestamoProveedorAntes,
            'vendida_anterior' => $vendidaAntes,
            'disponible_posterior' => $disponibleDespues,
            'prestamo_cliente_posterior' => $prestamoClienteDespues,
            'prestamo_proveedor_posterior' => $prestamoProveedorDespues,
            'vendida_posterior' => $vendidaDespues,
            'categoria_afectada' => $categoriaNormalizada,
            'motivo' => $motivo,
            'observaciones' => $observaciones,
            'numero_referencia' => $ajusteId ? "AJUSTE-{$ajusteId}" : null,
            'referencia_tipo' => 'AJUSTE',
            'referencia_id' => $ajusteId,
        ]);
    }

    /**
     * Anula un movimiento existente
     */
    public function anularMovimiento(
        MovimientoPrestable $movimiento,
        string $motivo,
        ?int $usuarioAnulacionId = null,
    ): MovimientoPrestable {
        $movimiento->update([
            'anulado' => true,
            'motivo_anulacion' => $motivo,
            'usuario_anulacion_id' => $usuarioAnulacionId ?? auth()->id(),
            'fecha_anulacion' => now(),
        ]);

        Log::info('⛔ Movimiento de prestable anulado', [
            'movimiento_id' => $movimiento->id,
            'motivo' => $motivo,
        ]);

        return $movimiento;
    }

    /**
     * Obtiene movimientos filtrados
     */
    public function obtenerMovimientos(array $filtros = [])
    {
        $query = MovimientoPrestable::query();

        if (isset($filtros['prestable_stock_id'])) {
            $query->where('prestable_stock_id', $filtros['prestable_stock_id']);
        }

        if (isset($filtros['almacenes_prestables_id'])) {
            $query->where('almacenes_prestables_id', $filtros['almacenes_prestables_id']);
        }

        if (isset($filtros['usuario_id'])) {
            $query->where('usuario_id', $filtros['usuario_id']);
        }

        if (isset($filtros['tipo'])) {
            $query->where('tipo', $filtros['tipo']);
        }

        if (isset($filtros['desde'])) {
            $query->where('created_at', '>=', $filtros['desde']);
        }

        if (isset($filtros['hasta'])) {
            $query->where('created_at', '<=', $filtros['hasta']);
        }

        if (!isset($filtros['incluir_anulados']) || !$filtros['incluir_anulados']) {
            $query->where('anulado', false);
        }

        return $query->orderBy('created_at', 'desc')->paginate($filtros['per_page'] ?? 50);
    }
}
