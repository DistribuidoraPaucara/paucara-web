<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Compra;
use App\Models\MovimientoCaja;
use App\Models\Producto;
use App\Models\User;
use App\Models\Venta;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DatosVendedorSeeder extends Seeder
{
    /**
     * Crear datos de prueba para Vendedor/Cajero Dashboard
     */
    public function run(): void
    {
        echo "📊 Creando datos de prueba para Vendedor/Cajero...\n";

        // Obtener usuario Cajero y productos
        $cajero = User::where('email', 'cajero@distribuidora.com')->first();
        $productos = Producto::where('activo', true)->limit(10)->get();
        $clientes = Cliente::where('activo', true)->limit(15)->get();

        if (!$cajero || $productos->isEmpty() || $clientes->isEmpty()) {
            echo "❌ Error: No hay usuario Cajero, productos o clientes disponibles\n";
            return;
        }

        // Obtener estado documento (Facturado = 4)
        $estadoDocumento = \App\Models\EstadoDocumento::find(4) ?? \App\Models\EstadoDocumento::first();
        $moneda = \App\Models\Moneda::first();

        // Crear 20 ventas en el mes actual
        echo "💰 Creando ventas...\n";
        for ($i = 0; $i < 20; $i++) {
            $cliente = $clientes->random();
            $subtotal = random_int(1000, 50000);
            $descuento = intval($subtotal * random_int(0, 20) / 100);
            $impuesto = intval(($subtotal - $descuento) * 0.10);
            $total = $subtotal - $descuento + $impuesto;

            Venta::create([
                'numero' => 'VTA-' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                'cliente_id' => $cliente->id,
                'usuario_id' => $cajero->id,
                'fecha' => Carbon::now()->subDays(random_int(0, 29)),
                'subtotal' => $subtotal,
                'descuento' => $descuento,
                'impuesto' => $impuesto,
                'total' => $total,
                'estado_documento_id' => $estadoDocumento?->id,
                'moneda_id' => $moneda?->id,
                'estado_pago' => 'PAGADO',
                'monto_pagado' => $total,
                'monto_pendiente' => 0,
                'canal_origen' => 'WEB',
                'observaciones' => 'Venta generada para testing de dashboard',
            ]);
        }

        // Crear 15 movimientos de caja
        echo "💳 Creando movimientos de caja...\n";
        for ($i = 0; $i < 15; $i++) {
            $tipo = random_int(0, 1) === 0 ? 'INGRESO' : 'EGRESO';
            $monto = random_int(5000, 100000);

            // Crear tipo de operación si no existe
            $tipoOperacion = \App\Models\TipoOperacionCaja::where('codigo', $tipo)->first();

            if ($tipoOperacion) {
                MovimientoCaja::create([
                    'tipo_operacion_id' => $tipoOperacion->id,
                    'monto' => $monto,
                    'usuario_id' => $cajero->id,
                    'fecha' => Carbon::now()->subDays(random_int(0, 29)),
                    'descripcion' => ucfirst($tipo) . ' de caja - Testing',
                    'referencia' => 'MOV-' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                ]);
            }
        }

        // Crear 10 compras
        echo "📦 Creando compras...\n";
        $proveedores = \App\Models\Proveedor::limit(5)->get();

        if (!$proveedores->isEmpty()) {
            for ($i = 0; $i < 10; $i++) {
                $subtotal = random_int(10000, 100000);
                $descuento = intval($subtotal * random_int(0, 10) / 100);
                $impuesto = intval(($subtotal - $descuento) * 0.05);
                $total = $subtotal - $descuento + $impuesto;

                Compra::create([
                    'numero' => 'CMP-' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                    'numero_factura' => 'FAC-' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                    'proveedor_id' => $proveedores->random()->id,
                    'usuario_id' => $cajero->id,
                    'fecha' => Carbon::now()->subDays(random_int(0, 29)),
                    'subtotal' => $subtotal,
                    'descuento' => $descuento,
                    'impuesto' => $impuesto,
                    'total' => $total,
                    'estado_documento_id' => $estadoDocumento?->id,
                    'moneda_id' => $moneda?->id,
                    'observaciones' => 'Compra generada para testing',
                ]);
            }
        }

        echo "✅ Datos de prueba creados exitosamente!\n";
        echo "   - 20 Ventas\n";
        echo "   - 15 Movimientos de Caja\n";
        echo "   - 10 Compras\n";
    }
}
