<?php

namespace App\Services;

use App\Models\Impuesto;
use App\Models\LibroVentasIva;
use App\Models\TipoDocumento;
use App\Models\Venta;
use App\Models\VentaImpuesto;
use Illuminate\Support\Facades\DB;

class TributarioService
{
    /**
     * Calcular impuestos para una venta
     */
    public function calcularImpuestos(Venta $venta, array $impuestos = ['IVA', 'IT']): array
    {
        $resultados = [];
        // Usar subtotal como base imponible si está disponible, sino usar total
        $montoBase = $venta->subtotal ?? $venta->total ?? 0;

        foreach ($impuestos as $codigoImpuesto) {
            $impuesto = Impuesto::where('codigo', $codigoImpuesto)
                ->where('activo', true)
                ->first();

            if (! $impuesto) {
                continue;
            }

            $baseImponible = $this->calcularBaseImponible($montoBase, $impuesto);
            $montoImpuesto = $impuesto->calcularMonto($baseImponible);

            $resultados[] = [
                'impuesto_id' => $impuesto->id,
                'codigo' => $impuesto->codigo,
                'nombre' => $impuesto->nombre,
                'base_imponible' => $baseImponible,
                'tasa_aplicada' => $impuesto->porcentaje,
                'monto_impuesto' => $montoImpuesto,
            ];
        }

        return $resultados;
    }

    /**
     * Aplicar impuestos a una venta
     */
    public function aplicarImpuestos(Venta $venta, array $impuestos = ['IVA', 'IT']): Venta
    {
        DB::transaction(function () use ($venta, $impuestos) {
            // Limpiar impuestos anteriores
            VentaImpuesto::where('venta_id', $venta->id)->delete();

            $calculosImpuestos = $this->calcularImpuestos($venta, $impuestos);
            $totalImpuestos = 0;

            foreach ($calculosImpuestos as $calculo) {
                VentaImpuesto::create([
                    'venta_id' => $venta->id,
                    'impuesto_id' => $calculo['impuesto_id'],
                    'base_imponible' => $calculo['base_imponible'],
                    'porcentaje_aplicado' => $calculo['tasa_aplicada'],
                    'monto_impuesto' => $calculo['monto_impuesto'],
                ]);

                $totalImpuestos += $calculo['monto_impuesto'];
            }

            // Actualizar totales de la venta usando los campos existentes
            $venta->update([
                'impuesto' => $totalImpuestos,
                'total' => $venta->subtotal + $totalImpuestos,
            ]);

            // Si es una factura con IVA, registrar en libro de ventas
            if (in_array('IVA', $impuestos) && $venta->tipoDocumento?->codigo === 'FAC') {
                $this->registrarEnLibroVentas($venta);
            }
        });

        return $venta->fresh();
    }

    /**
     * Registrar venta en libro de ventas IVA
     */
    public function registrarEnLibroVentas(Venta $venta): LibroVentasIva
    {
        $impuestoIva = $venta->impuestos()->where('codigo', 'IVA')->first();
        $ventaImpuestoIva = $venta->ventaImpuestos()->whereHas('impuesto', function ($q) {
            $q->where('codigo', 'IVA');
        })->first();

        return LibroVentasIva::create([
            'fecha' => $venta->fecha,
            'numero_factura' => $venta->numero ?? $this->generarNumeroDocumento($venta),
            'numero_autorizacion' => $venta->numero_autorizacion ?? '',
            'nit_ci_cliente' => $venta->cliente?->nit ?? '0',
            'razon_social_cliente' => $venta->cliente?->nombre ?? 'Sin nombre',
            'importe_total' => $venta->total,
            'importe_ice' => 0,
            'importe_iehd' => 0,
            'importe_ipj' => 0,
            'tasas' => 0,
            'importe_gift_card' => 0,
            'descuentos' => $venta->descuento,
            'importe_base_cf' => $ventaImpuestoIva?->base_imponible ?? $venta->subtotal,
            'credito_fiscal' => $ventaImpuestoIva?->monto_impuesto ?? 0,
            'estado_factura' => 'vigente',
            'codigo_control' => $venta->codigo_control ?? '',
            'venta_id' => $venta->id,
            'tipo_documento_id' => $venta->tipo_documento_id,
        ]);
    }

    /**
     * Generar siguiente número de documento
     */
    public function generarNumeroDocumento(Venta $venta): string
    {
        if (! $venta->tipoDocumento) {
            return 'SIN-TIPO-001';
        }

        return $venta->tipoDocumento->obtenerSiguienteNumero();
    }

    /**
     * Calcular base imponible para un impuesto específico
     */
    private function calcularBaseImponible(float $montoBase, Impuesto $impuesto): float
    {
        // Para IVA e IT se aplica sobre el monto sin impuestos
        if (in_array($impuesto->codigo, ['IVA', 'IT'])) {
            return $montoBase;
        }

        // Para ICE podría tener lógica específica
        if ($impuesto->codigo === 'ICE') {
            return $montoBase;
        }

        return $montoBase;
    }

    /**
     * Obtener resumen tributario de una venta
     */
    public function obtenerResumenTributario(Venta $venta): array
    {
        $impuestos = $venta->ventaImpuestos()->with('impuesto')->get();

        $resumen = [
            'subtotal' => $venta->subtotal ?? $venta->total,
            'total_impuestos' => $venta->impuesto ?? 0,
            'total_general' => $venta->total,
            'detalle_impuestos' => [],
        ];

        foreach ($impuestos as $ventaImpuesto) {
            $resumen['detalle_impuestos'][] = [
                'codigo' => $ventaImpuesto->impuesto->codigo,
                'nombre' => $ventaImpuesto->impuesto->nombre,
                'base_imponible' => $ventaImpuesto->base_imponible,
                'tasa' => $ventaImpuesto->porcentaje_aplicado,
                'monto' => $ventaImpuesto->monto_impuesto,
            ];
        }

        return $resumen;
    }

    /**
     * Validar configuración tributaria
     */
    public function validarConfiguracionTributaria(): array
    {
        $errores = [];

        // Verificar impuestos básicos
        $impuestosBasicos = ['IVA', 'IT'];
        foreach ($impuestosBasicos as $codigo) {
            $impuesto = Impuesto::where('codigo', $codigo)->where('activo', true)->first();
            if (! $impuesto) {
                $errores[] = "Impuesto {$codigo} no está configurado o no está activo";
            }
        }

        // Verificar tipos de documento
        $tiposBasicos = ['FAC', 'BOL'];
        foreach ($tiposBasicos as $codigo) {
            $tipo = TipoDocumento::where('codigo', $codigo)->where('activo', true)->first();
            if (! $tipo) {
                $errores[] = "Tipo de documento {$codigo} no está configurado o no está activo";
            }
        }

        return [
            'valido' => empty($errores),
            'errores' => $errores,
        ];
    }
}
