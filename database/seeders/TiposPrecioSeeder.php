<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TiposPrecioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tiposPrecios = [
            [
                'codigo'              => 'COSTO',
                'nombre'              => 'Precio de Costo',
                'descripcion'         => 'Precio de compra o costo del producto, base para calcular ganancias',
                'porcentaje_ganancia' => 0,
                'color'               => 'blue',
                'es_ganancia'         => false,
                'es_precio_base'      => true,
                'orden'               => 1,
                'activo'              => true,
                'es_sistema'          => true,
                'configuracion'       => json_encode([
                    'icono'   => '📦',
                    'tooltip' => 'Precio base para cálculos de ganancia',
                ]),
            ],
            [
                'codigo'              => 'LICORERIA',
                'nombre'              => 'Precio de Licorería',
                'descripcion'         => 'Precio de licorería',
                'porcentaje_ganancia' => 20.00,
                'color'               => 'green',
                'es_ganancia'         => true,
                'es_precio_base'      => false,
                'orden'               => 2,
                'activo'              => true,
                'es_sistema'          => true,
                'configuracion'       => json_encode([
                    'icono'   => '💰',
                    'tooltip' => 'Precio de lidcorería',
                ]),
            ],
            [
                'codigo'              => 'FRIA',
                'nombre'              => 'Precio fria',
                'descripcion'         => 'Precio fria',
                'porcentaje_ganancia' => 10.00,
                'color'               => 'purple',
                'es_ganancia'         => true,
                'es_precio_base'      => false,
                'orden'               => 3,
                'activo'              => true,
                'es_sistema'          => true,
                'configuracion'       => json_encode([
                    'icono'           => '📦',
                    'tooltip'         => 'Precio fria',
                    'cantidad_minima' => 10,
                ]),
            ],
            [
                'codigo'              => 'FACTURADO',
                'nombre'              => 'Precio Facturado',
                'descripcion'         => 'Precio facturado',
                'porcentaje_ganancia' => 15.00,
                'color'               => 'indigo',
                'es_ganancia'         => true,
                'es_precio_base'      => false,
                'orden'               => 5,
                'activo'              => true,
                'es_sistema'          => true,
                'configuracion'       => json_encode([
                    'icono'                 => '🏢',
                    'tooltip'               => 'Precio facturado',
                    'requiere_autorizacion' => true,
                ]),
            ],
            [
                'codigo'              => 'VENTA',
                'nombre'              => 'Precio Venta',
                'descripcion'         => 'Precio venta',
                'porcentaje_ganancia' => 11.00,
                'color'               => 'red',
                'es_ganancia'         => true,
                'es_precio_base'      => false,
                'orden'               => 6,
                'activo'              => true,
                'es_sistema'          => false,
                'configuracion'       => json_encode([
                    'icono'    => '🎉',
                    'tooltip'  => 'Precio venta',
                    'temporal' => true,
                ]),
            ],
            // DESCUENTO
            [
                'codigo'              => 'DESCUENTO',
                'nombre'              => 'Precio Descuento',
                'descripcion'         => 'Precio con descuento especial',
                'porcentaje_ganancia' => -5.00,
                'color'               => 'orange',
                'es_ganancia'         => false,
                'es_precio_base'      => false,
                'orden'               => 7,
                'activo'              => true,
                'es_sistema'          => false,
                'configuracion'       => json_encode([
                    'icono'   => '🔖',
                    'tooltip' => 'Precio con descuento especial',
                ]),
            ],
            //ESPECIAL
            [
                'codigo'              => 'ESPECIAL',
                'nombre'              => 'Precio Especial',
                'descripcion'         => 'Precio especial para clientes VIP',
                'porcentaje_ganancia' => 25.00,
                'color'               => 'teal',
                'es_ganancia'         => true,
                'es_precio_base'      => false,
                'orden'               => 8,
                'activo'              => true,
                'es_sistema'          => false,
                'configuracion'       => json_encode([
                    'icono'   => '🌟',
                    'tooltip' => 'Precio especial para clientes VIP',
                ]),
            ],
            // PUEBLOS
            [
                'codigo'              => 'PUEBLOS',
                'nombre'              => 'Precio Pueblos',
                'descripcion'         => 'Precio especial para zonas rurales',
                'porcentaje_ganancia' => 12.00,
                'color'               => 'brown',
                'es_ganancia'         => true,
                'es_precio_base'      => false,
                'orden'               => 9,
                'activo'              => true,
                'es_sistema'          => false,
                'configuracion'       => json_encode([
                    'icono'   => '🏞️',
                    'tooltip' => 'Precio especial para zonas rurales',
                ]),
            ],
        ];

        foreach ($tiposPrecios as $tipoPrecio) {
            DB::table('tipos_precio')->updateOrInsert(
                ['codigo' => $tipoPrecio['codigo']],
                array_merge($tipoPrecio, [
                    'created_at' => now(),
                    'updated_at' => now(),
                ])
            );
        }
    }

    /**
     * Eliminar los tipos de precio del sistema.
     * Útil para hacer rollback de los datos sembrados.
     */
    public function eliminarTiposPrecioSistema(): void
    {
        $codigosSistema = [
            'COSTO',
            'VENTA',
            'POR_MAYOR',
            'FACTURADO',
            'DISTRIBUIDOR',
            'PROMOCIONAL',
        ];

        DB::table('tipos_precio')->whereIn('codigo', $codigosSistema)->delete();
    }

    /**
     * Eliminar solo los tipos de precio que no son del sistema.
     * Preserva los tipos de precio base del sistema.
     */
    public function eliminarTiposPrecioPersonalizados(): void
    {
        DB::table('tipos_precio')->where('es_sistema', false)->delete();
    }

    /**
     * Limpiar todos los tipos de precio.
     * ¡CUIDADO! Esto eliminará todos los tipos de precio de la base de datos.
     */
    public function limpiarTodosLosTiposPrecio(): void
    {
        DB::table('tipos_precio')->truncate();
    }
}
