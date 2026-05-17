<?php

namespace App\Console\Commands;

use App\Models\AperturaCaja;
use App\Models\Caja;
use App\Models\Cliente;
use App\Models\DetalleVenta;
use App\Models\MovimientoInventario;
use App\Models\Producto;
use App\Models\TipoPago;
use App\Models\User;
use App\Models\Venta;
use Illuminate\Console\Command;

class ProbarAutomatizacionCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:automatizacion';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Probar automatización de inventario, contabilidad y caja';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Iniciando prueba de automatización completa...');

        try {
            // 1. Preparar datos de prueba
            $this->info('📋 Preparando datos de prueba...');
            $this->prepararDatosPrueba();

            // 2. Crear venta de prueba
            $this->info('💰 Creando venta de prueba...');
            $venta = $this->crearVentaPrueba();

            // 3. Verificar automatizaciones
            $this->info('🔍 Verificando automatizaciones...');
            $this->verificarAutomatizaciones($venta);

            $this->info('✅ Prueba completada exitosamente!');

        } catch (\Exception $e) {
            $this->error('❌ Error en la prueba: '.$e->getMessage());
            $this->error($e->getTraceAsString());
        }
    }

    private function prepararDatosPrueba()
    {
        // Crear caja si no existe
        if (! Caja::first()) {
            $caja = Caja::create([
                'nombre' => 'Caja Principal',
                'descripcion' => 'Caja principal de prueba',
                'activa' => true,
            ]);
        } else {
            $caja = Caja::first();
        }

        // Crear apertura de caja si no existe (usar user_id en lugar de usuario_id)
        $usuario = User::first();
        $aperturaExistente = AperturaCaja::where('user_id', $usuario->id)
            ->whereDate('fecha', today())
            ->first();

        if (! $aperturaExistente) {
            AperturaCaja::create([
                'caja_id' => $caja->id,
                'user_id' => $usuario->id,
                'fecha' => today(),
                'monto_apertura' => 1000,
                'observaciones' => 'Apertura de prueba para automatización',
            ]);
        }

        $this->info('  ✓ Datos de caja preparados');
    }

    private function crearVentaPrueba()
    {
        $cliente = Cliente::first();
        $usuario = User::first();
        $producto = Producto::first();
        $tipoPagoContado = TipoPago::where('codigo', 'CONTADO')->first();

        // Crear datos básicos si no existen
        if (! $cliente) {
            $cliente = Cliente::create([
                'nombre' => 'Cliente Prueba',
                'nit' => '123456789',
                'telefono' => '70000000',
                'email' => 'prueba@test.com',
            ]);
        }

        if (! $producto) {
            $producto = Producto::create([
                'codigo' => 'TEST001',
                'nombre' => 'Producto Prueba',
                'precio_venta' => 50.00,
                'precio_compra' => 30.00,
                'activo' => true,
            ]);
        }

        if (! $tipoPagoContado) {
            $tipoPagoContado = TipoPago::create([
                'codigo' => 'CONTADO',
                'nombre' => 'Contado',
                'activo' => true,
            ]);
        }

        $venta = Venta::create([
            'numero' => 'TEST-'.now()->format('YmdHis'),
            'fecha' => today(),
            'subtotal' => 100.00,
            'impuesto' => 13.00,
            'total' => 113.00,
            'cliente_id' => $cliente->id,
            'usuario_id' => $usuario->id,
            'tipo_pago_id' => $tipoPagoContado->id,
            'estado_documento_id' => 1,
            'moneda_id' => 1, // BOB por defecto
            'observaciones' => 'Venta de prueba para automatización',
        ]);

        // Crear detalle de venta
        DetalleVenta::create([
            'venta_id' => $venta->id,
            'producto_id' => $producto->id,
            'cantidad' => 2,
            'precio_unitario' => 50.00,
            'subtotal' => 100.00,
        ]);

        $this->info("  ✓ Venta #{$venta->numero} creada");

        return $venta;
    }

    private function verificarAutomatizaciones(Venta $venta)
    {
        // 1. Verificar asiento contable
        $asiento = $venta->asientoContable;
        if ($asiento) {
            $this->info("  ✅ Asiento contable #{$asiento->numero} generado automáticamente");
            $this->info("    - Total Debe: {$asiento->total_debe}");
            $this->info("    - Total Haber: {$asiento->total_haber}");
            $this->info('    - Balanceado: '.($asiento->estaBalanceado() ? 'SÍ' : 'NO'));
            $this->info("    - Detalles: {$asiento->detalles->count()} registros");
        } else {
            $this->error('  ❌ No se generó asiento contable automáticamente');
        }

        // 2. Verificar movimiento de inventario
        $movimientos = MovimientoInventario::where('numero_documento', $venta->numero)->get();
        if ($movimientos->count() > 0) {
            $this->info("  ✅ Movimientos de inventario generados: {$movimientos->count()}");
            foreach ($movimientos as $movimiento) {
                $this->info("    - Producto: {$movimiento->stockProducto->producto->nombre}");
                $this->info("    - Cantidad: {$movimiento->cantidad}");
                $this->info("    - Tipo: {$movimiento->tipo}");
            }
        } else {
            $this->error('  ❌ No se generaron movimientos de inventario');
        }

        // 3. Verificar movimiento de caja
        $movimientoCaja = $venta->movimientoCaja;
        if ($movimientoCaja) {
            $this->info('  ✅ Movimiento de caja generado automáticamente');
            $this->info("    - Monto entrada: {$movimientoCaja->monto_entrada}");
            $this->info("    - Descripción: {$movimientoCaja->descripcion}");
        } else {
            $this->error('  ❌ No se generó movimiento de caja automáticamente');
        }
    }
}
