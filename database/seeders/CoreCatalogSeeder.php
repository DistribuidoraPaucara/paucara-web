<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CoreCatalogSeeder extends Seeder
{
    public function run(): void
    {
        // Estados de documento
        /* $estadosDocumento = [
            ['codigo' => 'BORRADOR', 'nombre' => 'Borrador'],
            ['codigo' => 'PENDIENTE', 'nombre' => 'Pendiente'],
            ['codigo' => 'APROBADO', 'nombre' => 'Aprobado'],
            ['codigo' => 'RECHAZADO', 'nombre' => 'Rechazado'],
            ['codigo' => 'CANCELADO', 'nombre' => 'Cancelado'],
            ['codigo' => 'FACTURADO', 'nombre' => 'Facturado'],
        ];
        DB::table('estados_documento')->upsert($estadosDocumento, ['codigo'], ['nombre']); */
        /* $estados = [
            ['nombre' => 'Borrador', 'codigo' => 'BORRADOR', 'descripcion' => 'Documento en edición', 'activo' => true],
            ['nombre' => 'Pendiente', 'codigo' => 'PENDIENTE', 'descripcion' => 'Pendiente de aprobación', 'activo' => true],
            ['nombre' => 'Aprobado', 'codigo' => 'APROBADO', 'descripcion' => 'Aprobado para su uso', 'activo' => true],
            ['nombre' => 'Rechazado', 'codigo' => 'RECHAZADO', 'descripcion' => 'Rechazado', 'activo' => true],
            ['nombre' => 'Cancelado', 'codigo' => 'CANCELADO', 'descripcion' => 'Cancelado', 'activo' => true],
            ['nombre' => 'Facturado', 'codigo' => 'FACTURADO', 'descripcion' => 'Documento facturado', 'activo' => true],
        ];
        foreach ($estados as $estado) {
            EstadoDocumento::firstOrCreate(['codigo' => $estado['codigo']], $estado);
        } */

        // Tipos de pago
        $tiposPago = [
            ['codigo' => 'EFECTIVO', 'nombre' => 'Efectivo'],
            ['codigo' => 'TRANSFERENCIA/QR', 'nombre' => 'Transferencia / QR'],
            ['codigo' => 'CREDITO', 'nombre' => 'Crédito'],
            ['codigo' => 'TARJETA', 'nombre' => 'Tarjeta'],
        ];
        DB::table('tipos_pago')->upsert($tiposPago, ['codigo'], ['nombre']);

        // Tipos de documento
        $tiposDocumento = [
            /*[
                'codigo'                => 'FAC',
                'nombre'                => 'Factura',
                'descripcion'           => 'Documento fiscal de venta',
                'genera_inventario'     => true,
                'requiere_autorizacion' => true,
                'formato_numeracion'    => 'FAC-{YYYY}-{####}',
                'siguiente_numero'      => 1,
                'activo'                => true,
            ],
            [
                'codigo'                => 'BOL',
                'nombre'                => 'Boleta',
                'descripcion'           => 'Comprobante de venta simplificado',
                'genera_inventario'     => true,
                'requiere_autorizacion' => false,
                'formato_numeracion'    => 'BOL-{YYYY}-{####}',
                'siguiente_numero'      => 1,
                'activo'                => true,
            ],*/
            [
                'codigo'                => 'REC',
                'nombre'                => 'Recibo',
                'descripcion'           => 'Comprobante de pago',
                'genera_inventario'     => false,
                'requiere_autorizacion' => false,
                'formato_numeracion'    => 'REC-{YYYY}-{####}',
                'siguiente_numero'      => 1,
                'activo'                => true,
            ],
            /*[
                'codigo'                => 'NC',
                'nombre'                => 'Nota de Crédito',
                'descripcion'           => 'Documento que reduce deuda al cliente',
                'genera_inventario'     => true,
                'requiere_autorizacion' => false,
                'formato_numeracion'    => 'NC-{YYYY}-{####}',
                'siguiente_numero'      => 1,
                'activo'                => true,
            ],
            [
                'codigo'                => 'ND',
                'nombre'                => 'Nota de Débito',
                'descripcion'           => 'Documento que aumenta deuda al cliente',
                'genera_inventario'     => false,
                'requiere_autorizacion' => false,
                'formato_numeracion'    => 'ND-{YYYY}-{####}',
                'siguiente_numero'      => 1,
                'activo'                => true,
            ],*/
        ];
        DB::table('tipos_documento')->upsert($tiposDocumento, ['codigo'], [
            'nombre',
            'descripcion',
            'genera_inventario',
            'requiere_autorizacion',
            'formato_numeracion',
            'siguiente_numero',
            'activo',
        ]);

        // Tipo operación de caja
        /* $tiposOpCaja = [
            ['codigo' => 'APERTURA', 'nombre' => 'Apertura'],
            ['codigo' => 'CIERRE', 'nombre' => 'Cierre'],
            ['codigo' => 'VENTA', 'nombre' => 'Venta'],
            ['codigo' => 'COMPRA', 'nombre' => 'Compra'],
            ['codigo' => 'GASTO', 'nombre' => 'Gasto'],
            ['codigo' => 'INGRESO_EXTRA', 'nombre' => 'Ingreso extra'],
        ];
        DB::table('tipo_operacion_caja')->upsert($tiposOpCaja, ['codigo'], ['nombre']); */

        // Estados de pedido
        $estadosPedido = [
            ['codigo' => 'SOLICITADO', 'nombre' => 'Solicitado'],
            ['codigo' => 'CONFIRMADO', 'nombre' => 'Confirmado'],
            ['codigo' => 'PREPARANDO', 'nombre' => 'Preparando'],
            ['codigo' => 'LISTO_PARA_ENVIO', 'nombre' => 'Listo para envío'],
            ['codigo' => 'EN_CAMINO', 'nombre' => 'En camino'],
            ['codigo' => 'ENTREGADO', 'nombre' => 'Entregado'],
            ['codigo' => 'CANCELADO', 'nombre' => 'Cancelado'],
        ];
        DB::table('estados_pedido')->upsert($estadosPedido, ['codigo'], ['nombre']);

        // almacenes para ALMACEN PRINCIPAL Y SALA DE VENTAS
        $almacenes = [
            ['nombre' => 'Almacen Principal', 'activo' => true, 'direccion' => 'Ubicación principal del depósito'],
            ['nombre' => 'Sala de Ventas', 'activo' => true, 'direccion' => 'Ubicación de la sala de ventas'],
        ];
        DB::table('almacenes')->upsert($almacenes, ['nombre'], ['activo', 'direccion']);

        // marcas para COCA COLA y PEPSI
        /*$marcas = [
            ['nombre' => 'Coca Cola', 'activo' => true],
            ['nombre' => 'Pepsi', 'activo' => true],
        ];
        DB::table('marcas')->upsert($marcas, ['nombre'], ['activo']);*/

        // categorias para CERVEZAS, GASEOSA, AGUAS
        /*$categorias = [
            ['nombre' => 'Cervezas', 'activo' => true],
            ['nombre' => 'Gaseosa', 'activo' => true],
            ['nombre' => 'Aguas', 'activo' => true],
        ];
        DB::table('categorias')->upsert($categorias, ['nombre'], ['activo']);*/
        // Monedas básicas
        /*$monedas = [

        ];
        DB::table('monedas')->upsert($monedas, ['codigo'], ['nombre','simbolo','decimales','es_principal','activa']);*/
    }
}
