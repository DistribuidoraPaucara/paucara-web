<?php
namespace Database\Seeders;
use App\Models\Cliente;
use App\Models\Producto;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\DireccionCliente;
use App\Models\Localidad;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PruebaRutasSeeder extends Seeder
{
    public function run(): void
    {
        echo "\n🧪 Creando datos de prueba para rutas...\n";
        $user = User::first();
        if (!$user) {
            echo "   ⚠️  No hay usuarios\n";
            return;
        }
        $locs = [['nombre' => 'La Paz Centro'], ['nombre' => 'Zona Sur'], ['nombre' => 'Zona Este']];
        $loc_ids = [];
        foreach ($locs as $loc) {
            $l = Localidad::firstOrCreate(['nombre' => $loc['nombre']]);
            $loc_ids[] = $l->id;
        }
        $prods = Producto::limit(3)->get();
        if ($prods->isEmpty()) {
            echo "   ⚠️  No hay productos\n";
            return;
        }
        $clientes_data = [
            ['nombre' => 'Almacén Central', 'loc' => $loc_ids[0], 'lat' => -17.3895, 'lon' => -66.1568],
            ['nombre' => 'Tienda Don Juan', 'loc' => $loc_ids[0], 'lat' => -17.3890, 'lon' => -66.1570],
            ['nombre' => 'Supermercado Plaza', 'loc' => $loc_ids[0], 'lat' => -17.3900, 'lon' => -66.1560],
            ['nombre' => 'Mini Market Carol', 'loc' => $loc_ids[0], 'lat' => -17.3885, 'lon' => -66.1575],
            ['nombre' => 'Abarrotería Sur', 'loc' => $loc_ids[1], 'lat' => -17.4100, 'lon' => -66.1600],
            ['nombre' => 'Tienda del Sur', 'loc' => $loc_ids[1], 'lat' => -17.4110, 'lon' => -66.1610],
            ['nombre' => 'Mercado Familiar', 'loc' => $loc_ids[1], 'lat' => -17.4090, 'lon' => -66.1590],
            ['nombre' => 'Almacén Sur S.A.', 'loc' => $loc_ids[1], 'lat' => -17.4120, 'lon' => -66.1620],
            ['nombre' => 'Tienda Este', 'loc' => $loc_ids[2], 'lat' => -17.3850, 'lon' => -66.1350],
            ['nombre' => 'Almacén Este S.A.', 'loc' => $loc_ids[2], 'lat' => -17.3840, 'lon' => -66.1360],
        ];
        $clientes = [];
        foreach ($clientes_data as $data) {
            $c = Cliente::firstOrCreate(['nombre' => $data['nombre']], [
                'nit' => rand(10000000, 99999999),
                'telefono' => '6' . rand(10000000, 99999999),
                'email' => strtolower(str_replace(' ', '.', $data['nombre'])) . '@test.com',
                'localidad_id' => $data['loc'],
                'activo' => true,
            ]);
            DireccionCliente::firstOrCreate(['cliente_id' => $c->id], [
                'localidad_id' => $data['loc'],
                'direccion' => 'Calle ' . chr(65 + rand(0, 25)) . ' #' . rand(100, 999),
                'latitud' => $data['lat'],
                'longitud' => $data['lon'],
                'es_principal' => true,
                'activa' => true,
            ]);
            $clientes[] = $c;
        }
        $est_doc_id = \DB::table('estados_documento')->value('id') ?? 1;
        foreach ($clientes as $c) {
            $v = Venta::create([
                'numero' => 'VTA-' . rand(1000, 9999),
                'fecha' => Carbon::today(),
                'cliente_id' => $c->id,
                'usuario_id' => $user->id,
                'estado_documento_id' => $est_doc_id,
                'subtotal' => rand(500, 2000),
                'total' => rand(600, 2200),
                'requiere_envio' => true,
                'estado_logistico' => 'PENDIENTE_ENVIO',
                'fecha_entrega_comprometida' => Carbon::tomorrow(),
            ]);
            DetalleVenta::create([
                'venta_id' => $v->id,
                'producto_id' => $prods->random()->id,
                'cantidad' => rand(5, 20),
                'precio_unitario' => rand(50, 500),
                'subtotal' => rand(250, 2000),
            ]);
        }
        echo "✅ Datos creados: " . count($clientes) . " ventas\n\n";
    }
}
