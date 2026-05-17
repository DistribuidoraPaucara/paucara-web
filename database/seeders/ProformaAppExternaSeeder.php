<?php

namespace Database\Seeders;

use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Proforma;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProformaAppExternaSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener algunos clientes, productos y usuarios para las proformas
        $clientes = Cliente::limit(3)->get();
        $productos = Producto::where('activo', true)->limit(5)->get();
        $encargado = User::where('name', 'like', '%admin%')->first() ?? User::first();
        $monedaBase = \App\Models\Moneda::where('es_moneda_base', true)->first();

        if ($clientes->isEmpty() || $productos->isEmpty() || ! $encargado || ! $monedaBase) {
            $this->command->warn('No se encontraron clientes, productos, usuarios o moneda base para crear proformas. Ejecute los seeders correspondientes primero.');

            return;
        }

        $proformasData = [
            [
                'cliente_id' => $clientes->first()->id,
                'moneda_id' => $monedaBase->id,
                'usuario_creador_id' => $encargado->id,
                'numero' => 'PRF-APP-001',
                'fecha' => now()->subDays(2),
                'subtotal' => 150.00,
                'impuesto' => 19.50,
                'total' => 169.50,
                'observaciones' => 'Proforma generada desde app móvil',
                'estado' => Proforma::PENDIENTE,
                'canal_origen' => 'APP_EXTERNA',
                'cliente_app_id' => 'cliente_app_001',
                'ubicacion_entrega' => json_encode([
                    'direccion' => 'Av. Principal 123, Lima',
                    'referencia' => 'Frente al parque central',
                    'latitud' => -12.0464,
                    'longitud' => -77.0428,
                ]),
                'contacto_entrega' => json_encode([
                    'nombre' => 'Juan Pérez',
                    'telefono' => '987654321',
                    'email' => 'juan.perez@email.com',
                ]),
            ],
            [
                'cliente_id' => $clientes->skip(1)->first()->id,
                'moneda_id' => $monedaBase->id,
                'usuario_creador_id' => $encargado->id,
                'numero' => 'PRF-APP-002',
                'fecha' => now()->subDays(1),
                'subtotal' => 250.00,
                'impuesto' => 32.50,
                'total' => 282.50,
                'observaciones' => 'Pedido urgente desde app móvil',
                'estado' => Proforma::APROBADA,
                'canal_origen' => 'APP_EXTERNA',
                'cliente_app_id' => 'cliente_app_002',
                'ubicacion_entrega' => json_encode([
                    'direccion' => 'Jr. Los Olivos 456, Lima',
                    'referencia' => 'Casa azul con portón negro',
                    'latitud' => -12.0564,
                    'longitud' => -77.0528,
                ]),
                'contacto_entrega' => json_encode([
                    'nombre' => 'María González',
                    'telefono' => '987123456',
                    'email' => 'maria.gonzalez@email.com',
                ]),
                'fecha_aprobacion' => now()->subHours(12),
                'aprobado_por' => $encargado->id,
                'comentario_aprobacion' => 'Aprobado - Cliente frecuente',
            ],
            [
                'cliente_id' => $clientes->last()->id,
                'moneda_id' => $monedaBase->id,
                'usuario_creador_id' => $encargado->id,
                'numero' => 'PRF-APP-003',
                'fecha' => now(),
                'subtotal' => 320.00,
                'impuesto' => 41.60,
                'total' => 361.60,
                'observaciones' => 'Proforma para entrega programada',
                'estado' => Proforma::RECHAZADA,
                'canal_origen' => 'APP_EXTERNA',
                'cliente_app_id' => 'cliente_app_003',
                'ubicacion_entrega' => json_encode([
                    'direccion' => 'Calle Los Pinos 789, Lima',
                    'referencia' => 'Edificio Torre Azul, depto 504',
                    'latitud' => -12.0664,
                    'longitud' => -77.0628,
                ]),
                'contacto_entrega' => json_encode([
                    'nombre' => 'Carlos Ruiz',
                    'telefono' => '987987987',
                    'email' => 'carlos.ruiz@email.com',
                ]),
                'fecha_respuesta' => now()->subHours(2),
                'comentario_rechazo' => 'Stock insuficiente para algunos productos',
            ],
        ];

        foreach ($proformasData as $proformaData) {
            $proforma = Proforma::firstOrCreate(
                ['numero' => $proformaData['numero']],
                $proformaData
            );

            // Agregar algunos productos a cada proforma
            $cantidadProductos = min(2, $productos->count()); // Usar máximo 2 o el total disponible
            $productosProforma = $productos->random($cantidadProductos);
            foreach ($productosProforma as $producto) {
                $cantidad = rand(1, 5);
                $precioUnitario = rand(5, 50); // Precio fijo para pruebas

                DB::table('detalle_proformas')->insert([
                    'proforma_id' => $proforma->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precioUnitario,
                    'descuento' => 0,
                    'subtotal' => $cantidad * $precioUnitario,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('proformas de app externa creadas exitosamente.');
    }
}
