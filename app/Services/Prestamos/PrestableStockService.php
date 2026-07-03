<?php

namespace App\Services\Prestamos;

use App\Models\Prestable;
use App\Models\StockProducto;

class PrestableStockService
{
    public function calcularCantidadConLiquido(Prestable $prestable, int $almacenPrestableId): int
    {
        if ($prestable->tipo === 'CANASTILLA') {
            return $this->calcularCantidadCanastilla($prestable, $almacenPrestableId);
        }

        if ($prestable->tipo === 'EMBASES') {
            return $this->calcularCantidadEmbase($prestable, $almacenPrestableId);
        }

        return 0;
    }

    private function calcularCantidadCanastilla(Prestable $canastilla, int $almacenPrestableId): int
    {
        $productosRelacionados = $canastilla->productos()->pluck('producto_id')->toArray();

        if (empty($productosRelacionados)) {
            return 0;
        }

        $sumaStock = StockProducto::whereIn('producto_id', $productosRelacionados)
            ->sum('cantidad');

        return (int) $sumaStock;
    }

    private function calcularCantidadEmbase(Prestable $embase, int $almacenPrestableId): int
    {
        $canastillaRelacionada = $embase->prestablePadre;

        if (!$canastillaRelacionada) {
            \Log::warning('⚠️ Embase sin canastilla relacionada', [
                'embase_id' => $embase->id,
                'embase_nombre' => $embase->nombre,
                'prestable_relacionado_id' => $embase->prestable_relacionado_id,
            ]);
            return 0;
        }

        $cantidadCanastilla = $this->calcularCantidadCanastilla($canastillaRelacionada, $almacenPrestableId);
        $capacidadCanastilla = $canastillaRelacionada->capacidad ?? 1;

        $resultado = $cantidadCanastilla * $capacidadCanastilla;

        \Log::info('📊 Cálculo Embase: ' . $cantidadCanastilla . ' × ' . $capacidadCanastilla . ' = ' . $resultado, [
            'embase_id' => $embase->id,
            'embase_nombre' => $embase->nombre,
            'canastilla_id' => $canastillaRelacionada->id,
            'canastilla_nombre' => $canastillaRelacionada->nombre,
            'canastilla_capacidad' => $capacidadCanastilla,
            'cantidad_canastilla' => $cantidadCanastilla,
            'resultado' => $resultado,
        ]);

        return $resultado;
    }

    public function calcularCantidadesConLiquido(array $prestables, int $almacenPrestableId): array
    {
        $resultado = [];

        foreach ($prestables as $prestable) {
            if (is_int($prestable)) {
                $prestable = Prestable::find($prestable);
            }

            if ($prestable) {
                $resultado[$prestable->id] = $this->calcularCantidadConLiquido($prestable, $almacenPrestableId);
            }
        }

        return $resultado;
    }

    public function agregarCantidadConLiquido(array $item, Prestable $prestable, int $almacenPrestableId): array
    {
        $item['cantidad_con_liquido'] = $this->calcularCantidadConLiquido($prestable, $almacenPrestableId);
        return $item;
    }
}