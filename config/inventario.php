<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Almacén Principal
    |--------------------------------------------------------------------------
    |
    | ID del almacén principal del sistema. Este almacén se usará por defecto
    | para operaciones de stock cuando no se especifique uno explícitamente.
    |
    */
    'almacen_principal_id' => env('ALMACEN_PRINCIPAL_ID', 1),

    /*
    |--------------------------------------------------------------------------
    | Stock Mínimo por Defecto
    |--------------------------------------------------------------------------
    |
    | Cantidad mínima de stock por defecto para nuevos productos.
    |
    */
    'stock_minimo_default' => env('STOCK_MINIMO_DEFAULT', 10),

    /*
    |--------------------------------------------------------------------------
    | Alertas de Stock
    |--------------------------------------------------------------------------
    |
    | Configuración para las alertas de stock bajo.
    |
    */
    'alertas' => [
        'stock_bajo_habilitado' => env('ALERTAS_STOCK_BAJO', true),
        'dias_vencimiento_critico' => env('DIAS_VENCIMIENTO_CRITICO', 30),
        'dias_vencimiento_advertencia' => env('DIAS_VENCIMIENTO_ADVERTENCIA', 90),
    ],

    /*
    |--------------------------------------------------------------------------
    | Paginación
    |--------------------------------------------------------------------------
    |
    | Configuración de paginación para listados de inventario.
    |
    */
    'paginacion' => [
        'por_pagina_default' => env('INVENTARIO_POR_PAGINA', 20),
        'por_pagina_max' => env('INVENTARIO_POR_PAGINA_MAX', 100),
    ],
];
