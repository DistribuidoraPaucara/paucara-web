<?php

/**
 * Configuración de widgets del dashboard dinámico por módulo
 *
 * Esta configuración define qué widgets y datos se cargan para cada módulo
 * Permite escalabilidad: solo añade un nuevo módulo y sus widgets aquí
 * sin necesidad de modificar el código del dashboard
 */

return [
    // Widget genéricos (disponibles para todos)
    'always_visible' => [
        'header_selector', // Selector de período
    ],

    // Mapeo de módulos a widgets
    'modules' => [
        // MÓDULO GENERAL - visible para todos los usuarios autenticados
        'general' => [
            'widgets' => [
                'metricas_principales',      // Ventas, Compras, Inventario, Caja
                'metricas_secundarias',      // Clientes, proformas, Stock
                'grafico_ventas',            // Evolución de ventas
                'ventas_por_canal',          // Doughnut chart
                'productos_mas_vendidos',    // Top 10 productos
                'alertas_stock',             // Alertas de stock bajo/crítico
            ],
            'required_permissions' => [],   // Disponible para todos
            'services' => [                 // Servicios del backend necesarios
                'metricas_generales',
                'graficos_ventas',
                'productos_vendidos',
                'alertas_stock',
                'ventas_canal',
            ],
        ],

        // MÓDULO COMPRAS
        'compras' => [
            'widgets' => [
                'metricas_compras',          // Total compras, cantidad, promedio
                'grafico_compras',           // Evolución de compras
                'cuentas_por_pagar',         // Saldo pendiente
                'pagos_realizados',          // Pagos del mes
                'lotes_proximos_vencer',     // Lotes próximos a vencer (30 días)
                'lotes_vencidos',            // Lotes ya vencidos
                'proveedores_activos',       // Top proveedores
                'alertas_compras',           // Alertas personalizadas compras
            ],
            'required_permissions' => ['compras.manage', 'compras.view'],
            'services' => [
                'metricas_compras',
                'graficos_compras',
                'cuentas_pagar',
                'lotes_vencer',
                'proveedores',
            ],
        ],

        // MÓDULO LOGÍSTICA
        'logistica' => [
            'widgets' => [
                'metricas_logistica',        // Rutas, km, envíos
                'rutas_del_dia',             // Rutas planificadas hoy
                'envios_activos',            // Envíos en tránsito
                'desempeño_choferes',        // Top choferes por entregas
                'alertas_logistica',         // Demoras, envíos sin asignar
            ],
            'required_permissions' => ['logistica.manage', 'logistica.view'],
            'services' => [
                'metricas_logistica',
                'rutas_activas',
                'envios_estado',
                'desempeño_choferes',
            ],
        ],

        // MÓDULO INVENTARIO
        'inventario' => [
            'widgets' => [
                'metricas_inventario',       // Stock total, productos, valor
                'alertas_stock_detallado',   // Alertas detalladas
                'productos_rotacion_lenta',  // Productos sin movimiento
                'grafico_movimiento',        // Gráfico de entrada/salida
            ],
            'required_permissions' => ['inventario.manage', 'inventario.view'],
            'services' => [
                'metricas_inventario',
                'alertas_stock',
                'productos_movimiento',
            ],
        ],

        // MÓDULO CONTABILIDAD
        'contabilidad' => [
            'widgets' => [
                'saldo_caja',                // Saldo en caja
                'ingresos_egresos',          // Gráfico ingresos/egresos
                'movimientos_caja',          // Últimos movimientos
                'resumen_financiero',        // Resumen financiero del período
                'alertas_contabilidad',      // Alertas financieras
            ],
            'required_permissions' => ['contabilidad.manage', 'contabilidad.view'],
            'services' => [
                'metricas_caja',
                'movimientos_caja',
                'resumen_financiero',
            ],
        ],

        // MÓDULO PREVENTISTA (vendedor por zonas)
        'preventista' => [
            'widgets' => [
                'mis_clientes',              // Cartera de clientes asignada
                'comisiones',                // Comisiones generadas
                'proformas_pendientes',      // proformas pendientes de aprobación
                'cartera_vencida',           // Deuda de clientes
            ],
            'required_permissions' => ['preventista.manage'],
            'services' => [
                'clientes_asignados',
                'comisiones',
                'proformas_usuario',
                'cartera_vencida',
            ],
        ],

        // MÓDULO CHOFER
        'chofer' => [
            'widgets' => [
                'mis_rutas',                 // Rutas del chofer hoy/semana
                'estadisticas_chofer',       // Entregas, km, desempeño
                'proxima_ruta',              // Próxima ruta a realizar
            ],
            'required_permissions' => ['chofer.view'],
            'services' => [
                'rutas_chofer',
                'estadisticas_chofer',
            ],
        ],

        // MÓDULO GESTOR DE ALMACÉN
        'almacen' => [
            'widgets' => [
                'metricas_almacen',          // Productos, stock, organización
                'alertas_almacen',           // Productos mal ubicados, vencidos
                'recepción_salida_diaria',   // Movimientos del día
            ],
            'required_permissions' => ['almacen.manage'],
            'services' => [
                'metricas_almacen',
                'alertas_almacen',
                'movimientos_almacen',
            ],
        ],

        // MÓDULO VENDEDOR POS
        'vendedor' => [
            'widgets' => [
                'ventas_hoy',                // Ventas de hoy
                'clientes_frecuentes',       // Clientes frecuentes
                'productos_bajo_stock',      // Productos con bajo stock
            ],
            'required_permissions' => ['vendedor.view'],
            'services' => [
                'ventas_vendedor',
                'clientes_frecuentes',
            ],
        ],
    ],

    // Mapeo de roles a módulos principales
    // Define qué módulos ve cada rol por defecto
    'role_modules' => [
        'super_admin' => ['general', 'compras', 'logistica', 'inventario', 'contabilidad'],
        'admin' => ['general', 'compras', 'logistica', 'inventario', 'contabilidad'],
        'comprador' => ['general', 'compras'],
        'preventista' => ['general', 'preventista'],
        'chofer' => ['general', 'chofer'],
        'logistica' => ['general', 'logistica'],
        'gestor_almacen' => ['general', 'almacen', 'inventario'],
        'vendedor' => ['general', 'vendedor'],
        'cajero' => ['general', 'vendedor'],
        'contabilidad' => ['general', 'contabilidad'],
    ],

    // Configuración de widgets individuales
    'widget_config' => [
        'metricas_principales' => [
            'type' => 'metric_grid',
            'grid_cols' => 4,
            'items' => ['ventas', 'compras', 'inventario', 'caja'],
        ],
        'metricas_secundarias' => [
            'type' => 'metric_grid',
            'grid_cols' => 3,
            'items' => ['clientes', 'proformas', 'stock'],
        ],
        'grafico_ventas' => [
            'type' => 'chart',
            'chart_type' => 'line',
            'span' => 'full',
        ],
        'alertas_stock' => [
            'type' => 'alerts_table',
            'limit' => 10,
        ],
        'productos_mas_vendidos' => [
            'type' => 'table',
            'limit' => 10,
        ],
    ],
];
