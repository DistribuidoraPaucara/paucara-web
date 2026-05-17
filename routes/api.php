<?php

use App\Http\Controllers\AlertasController;
use App\Http\Controllers\Api\ApiProformaController;
use App\Http\Controllers\Api\ApiVentaController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApiPoliticaPagoController;
use App\Http\Controllers\Api\ReservaProformaController;
use App\Http\Controllers\Api\ChoferPreferenciaController;
use App\Http\Controllers\Api\EmpleadoApiController;
use App\Http\Controllers\Api\EntregaBatchController;
use App\Http\Controllers\Api\EntregaController;
use App\Http\Controllers\Api\ChoferCajaController;
use App\Http\Controllers\Api\ChoferGastoController;
use App\Http\Controllers\Api\AdminCajaApiController;
use App\Http\Controllers\Api\EncargadoController;
use App\Http\Controllers\Api\EstadoLogisticoController;
use App\Http\Controllers\Api\GeocodingController;
use App\Http\Controllers\Api\PrecioRangoProductoController;
use App\Http\Controllers\Api\ReporteCargoController;
use App\Http\Controllers\Api\ReporteProductoDañadoController;
use App\Http\Controllers\Api\BannerPublicitarioController;
use App\Http\Controllers\Api\EstadoMermaController;
use App\Http\Controllers\Api\StockDisponiblePdfController;
use App\Http\Controllers\Api\SectorController;
use App\Http\Controllers\Api\TipoPagoController;
use App\Http\Controllers\ReporteCargaPdfController;
use App\Http\Controllers\ReporteCargoListController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\TipoAjusteInventarioController;
use App\Http\Controllers\Api\TipoMermaController;
use App\Http\Controllers\Api\TipoOperacionController;
use App\Http\Controllers\Api\TrackingController;
use App\Http\Controllers\AsientoContableController;
use App\Http\Controllers\CategoriaClienteController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\CompraController;
use App\Http\Controllers\DireccionClienteApiController;
use App\Http\Controllers\ImageBackupController;
use App\Http\Controllers\InventarioController;
use App\Http\Controllers\LocalidadController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProveedorController;
use App\Http\Controllers\ReporteInventarioApiController;
use App\Http\Controllers\VehiculoController;
use App\Http\Controllers\VentaController;
use App\Http\Controllers\PrecioController;
use App\Http\Controllers\ComboController;
use App\Http\Controllers\ConciliacionCajaController;
use App\Http\Controllers\PrestableController;
use App\Http\Controllers\Api\PagoVentaController;
use App\Http\Controllers\PrestamoVendidoController;
use App\Http\Controllers\CompraPrestableController;
use App\Http\Controllers\PrestableStockController;
use App\Http\Controllers\PrestamoClienteController;
use App\Http\Controllers\PrestamoProveedorController;
use App\Http\Controllers\ReportesController;
use Illuminate\Support\Facades\Route;

// ==========================================
// 🔓 RUTAS API PÚBLICAS (sin autenticación)
// ==========================================

// Rutas de autenticación API
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rutas para empleados
Route::get('/empleados/determinar-rol', [EmpleadoApiController::class, 'determinarRol']);

// ✅ NUEVO: Rutas públicas de proformas (para compartir sin autenticación)
Route::group(['prefix' => 'proformas'], function () {
    // 🖨️ Descargar proforma como PDF (público cuando accion=compartir)
    Route::get('/{proforma}/imprimir', [\App\Http\Controllers\ProformaController::class, 'imprimir'])
        ->name('api.proformas.imprimir.public');
});

// Catálogos públicos - GET only (para cargar datos en selects/dropdowns)
// Nota: El control de acceso se hace a nivel de página web con permisos
Route::get('/tipos-ajuste-inventario', [TipoAjusteInventarioController::class, 'index']);
Route::get('/tipo-operaciones', function () {
    return \App\Models\TipoOperacion::activos()->get();
});
// ✅ NUEVO: Endpoint para cargar tipos de pago en ApprovalPaymentForm
Route::get('/tipos-pago', function () {
    return response()->json([
        'success' => true,
        'data' => \App\Models\TipoPago::where('activo', true)->get()
    ]);
});

// ✅ NUEVO: Endpoint para cargar almacenes (para gestión de stock)
Route::get('/almacenes', function () {
    return response()->json([
        'success' => true,
        'data' => \App\Models\Almacen::where('activo', true)->get()
    ]);
});

// ✅ NUEVO: Endpoint para cargar almacenes de prestables
Route::get('/almacenes-prestables', function () {
    return response()->json([
        'success' => true,
        'data' => \App\Models\AlmacenPrestable::where('activo', true)->get()
    ]);
});

// ✅ NUEVO: Endpoints para Políticas de Pago
Route::get('/politicas-pago', [ApiPoliticaPagoController::class, 'index']);
Route::get('/politicas-pago/disponibles/{clienteId}', [ApiPoliticaPagoController::class, 'disponibles']);

// ✅ NUEVO: Endpoints para Banners Publicitarios (públicos, sin autenticación)
Route::get('/banners-publicitarios', [BannerPublicitarioController::class, 'index']);

// Procesar ajustes masivos (requiere autenticación)
// ✅ ACTUALIZADO: Agregado middleware 'platform' para validar acceso a plataforma
Route::middleware(['auth:sanctum,web', 'platform'])->group(function () {
    Route::post('/inventario/ajustes-masivos', [InventarioController::class, 'importarAjustesMasivos']);

    // Historial de cargas CSV
    Route::get('/inventario/cargos-csv', [InventarioController::class, 'listarCargosCsv']);
    Route::get('/inventario/cargos-csv/{cargo}', [InventarioController::class, 'obtenerDetalleCargo']);
    Route::post('/inventario/cargos-csv/{cargo}/revertir', [InventarioController::class, 'revertirCargo']);
    Route::post('/inventario/ajuste/preparar-impresion', [InventarioController::class, 'prepararImpresionAjustes']);

    // Anular ajuste de inventario
    Route::post('/inventario/ajuste/{ajuste}/anular', [InventarioController::class, 'anularAjuste']);
});

// ==========================================
// 📋 RUTAS PARA GESTIÓN DE ROLES
// ==========================================
// Obtener roles con detalles, categorías y descripciones
Route::get('/roles/details', [RoleController::class, 'getRolesWithDetails']);

// Validar combinación de roles
Route::post('/roles/validate-combination', [RoleController::class, 'validateRoleCombination']);

// ==========================================
// 📋 RUTAS API PARA MÓDULOS DEL SIDEBAR
// ==========================================
Route::middleware(['auth'])->group(function () {
    // Obtener módulos del sidebar (filtrados por permisos del usuario)
    Route::get('/modulos-sidebar', [App\Http\Controllers\ModuloSidebarController::class, 'apiIndex'])->name('api.modulos-sidebar');

    // Obtener TODOS los módulos para administración (sin filtros)
    Route::get('/modulos-sidebar/admin', [App\Http\Controllers\ModuloSidebarController::class, 'apiIndexAdmin'])->name('api.modulos-sidebar.admin');

    // Obtener permisos disponibles
    Route::get('/modulos-sidebar/permisos/disponibles', [App\Http\Controllers\ModuloSidebarController::class, 'getPermisosDisponibles'])->name('api.modulos-sidebar.permisos.disponibles');

    // Obtener matriz de acceso rol-módulo
    Route::get('/modulos-sidebar/matriz-acceso', [App\Http\Controllers\ModuloSidebarController::class, 'getMatrizAcceso'])->name('api.modulos-sidebar.matriz-acceso');

    // Obtener roles disponibles
    Route::get('/modulos-sidebar/roles', [App\Http\Controllers\ModuloSidebarController::class, 'obtenerRoles'])->name('api.modulos-sidebar.roles');

    // Vista previa del sidebar para un rol
    Route::get('/modulos-sidebar/preview/{rolName}', [App\Http\Controllers\ModuloSidebarController::class, 'previewPorRol'])->name('api.modulos-sidebar.preview');

    // Historial de cambios
    Route::get('/modulos-sidebar/historial', [App\Http\Controllers\ModuloSidebarController::class, 'obtenerHistorial'])->name('api.modulos-sidebar.historial');

    // Bulk update de matriz de acceso
    Route::post('/modulos-sidebar/matriz-acceso/bulk-update', [App\Http\Controllers\ModuloSidebarController::class, 'bulkUpdateMatrizAcceso'])->name('api.modulos-sidebar.matriz-acceso.bulk-update');
});

// ✅ NUEVA: Ruta API para obtener la redirección del dashboard según el rol
Route::middleware(['auth'])->get('/dashboard-redirect', [App\Http\Controllers\Auth\DashboardRedirectController::class, 'getRedirectApi'])->name('api.dashboard-redirect');

// ==========================================
// 📱 RUTAS PARA APP EXTERNA (Flutter)
// ==========================================
// ✅ ACTUALIZADO: Agregado middleware 'platform' para validar acceso a plataforma
Route::middleware(['auth:sanctum,web', 'platform'])->group(function () {
    // Rutas de autenticación protegidas
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    // ✅ NUEVO: Refrescar permisos sin logout
    Route::get('/auth/refresh-permissions', [AuthController::class, 'refreshPermissions']);

    // ✅ NUEVO: API DE PERMISOS (para mobile o admin panel)
    Route::prefix('permisos')->group(function () {
        // Obtener estructura de permisos
        Route::get('/estructura', [\App\Http\Controllers\PermissionController::class, 'getStructure'])
            ->middleware('permission:permissions.index');

        // Obtener permisos agrupados
        Route::get('/agrupados', [\App\Http\Controllers\PermissionController::class, 'getGrouped'])
            ->middleware('permission:permissions.index');

        // Gestionar permisos de usuarios
        Route::get('usuario/{user}', [\App\Http\Controllers\PermissionController::class, 'editarUsuario'])
            ->middleware('permission:usuarios.assign-permission');
        Route::patch('usuario/{user}', [\App\Http\Controllers\PermissionController::class, 'actualizarUsuario'])
            ->middleware('permission:usuarios.assign-permission');

        // Gestionar permisos de roles
        Route::get('rol/{role}', [\App\Http\Controllers\PermissionController::class, 'editarRol'])
            ->middleware('permission:roles.assign-permission');
        Route::patch('rol/{role}', [\App\Http\Controllers\PermissionController::class, 'actualizarRol'])
            ->middleware('permission:roles.assign-permission');
    });

    // ✅ NUEVO: Lista de usuarios y roles para panel central
    Route::get('/usuarios', [\App\Http\Controllers\PermissionController::class, 'getUsuarios'])
        ->middleware('permission:permissions.index');
    Route::get('/roles', [\App\Http\Controllers\PermissionController::class, 'getRoles'])
        ->middleware('permission:permissions.index');

    // ✅ NUEVO: Historial de auditoría
    Route::get('/permisos/historial', [\App\Http\Controllers\PermissionController::class, 'getHistorial'])
        ->middleware('permission:permissions.index');

    // ✅ NUEVO: Bulk edit de permisos
    Route::post('/permisos/bulk-edit', [\App\Http\Controllers\PermissionController::class, 'bulkEdit'])
        ->middleware('permission:permissions.index');

    // ==========================================
    // 🎯 FASE 2: GESTIÓN DE CAPACIDADES
    // ==========================================
    Route::prefix('capacidades')->group(function () {
        // Obtener todas las capacidades con sus permisos
        Route::get('/', [\App\Http\Controllers\PermissionController::class, 'getCapabilities'])
            ->middleware('permission:permissions.index');

        // Obtener plantillas predefinidas
        Route::get('/plantillas', [\App\Http\Controllers\PermissionController::class, 'getCapabilityTemplates'])
            ->middleware('permission:permissions.index');

        // Capacidades de usuario
        Route::get('/usuario/{user}', [\App\Http\Controllers\PermissionController::class, 'getUserCapabilities'])
            ->middleware('permission:permissions.index');
        Route::post('/usuario/{user}/asignar', [\App\Http\Controllers\PermissionController::class, 'assignCapabilityToUser'])
            ->middleware('permission:usuarios.assign-permission');
        Route::post('/usuario/{user}/remover', [\App\Http\Controllers\PermissionController::class, 'removeCapabilityFromUser'])
            ->middleware('permission:usuarios.remove-permission');
        Route::post('/usuario/{user}/aplicar-plantilla', [\App\Http\Controllers\PermissionController::class, 'applyTemplateToUser'])
            ->middleware('permission:usuarios.assign-permission');

        // Capacidades de rol
        Route::get('/rol/{role}', [\App\Http\Controllers\PermissionController::class, 'getRoleCapabilities'])
            ->middleware('permission:permissions.index');
        Route::post('/rol/{role}/asignar', [\App\Http\Controllers\PermissionController::class, 'assignCapabilityToRole'])
            ->middleware('permission:roles.assign-permission');
        Route::post('/rol/{role}/remover', [\App\Http\Controllers\PermissionController::class, 'removeCapabilityFromRole'])
            ->middleware('permission:roles.remove-permission');
        Route::post('/rol/{role}/aplicar-plantilla', [\App\Http\Controllers\PermissionController::class, 'applyTemplateToRole'])
            ->middleware('permission:roles.assign-permission');
    });

    // ==========================================
    // 🔔 GESTIÓN DE NOTIFICACIONES
    // ==========================================
    Route::prefix('notificaciones')->group(function () {
        // Listar todas las notificaciones del usuario
        Route::get('/', [NotificationController::class, 'index']);

        // Listar solo notificaciones no leídas
        Route::get('/no-leidas', [NotificationController::class, 'unread']);

        // Obtener estadísticas de notificaciones
        Route::get('/estadisticas', [NotificationController::class, 'stats']);

        // Obtener notificaciones por tipo
        Route::get('/por-tipo/{type}', [NotificationController::class, 'byType']);

        // Marcar todas las notificaciones como leídas
        Route::post('/marcar-todas-leidas', [NotificationController::class, 'markAllAsRead']);

        // Eliminar todas las notificaciones
        Route::delete('/eliminar-todas', [NotificationController::class, 'destroyAll']);

        // Operaciones sobre notificación específica
        Route::get('/{notification}', [NotificationController::class, 'show']);
        Route::post('/{notification}/marcar-leida', [NotificationController::class, 'markAsRead']);
        Route::post('/{notification}/marcar-no-leida', [NotificationController::class, 'markAsUnread']);
        Route::delete('/{notification}', [NotificationController::class, 'destroy']);
    });

    // ==========================================
    // 👤 PREFERENCIAS DE USUARIO
    // ==========================================
    Route::prefix('user')->group(function () {
        // Chofer preferences for intelligent delivery wizard
        Route::get('/chofer-preferencias', [ChoferPreferenciaController::class, 'index']);
        Route::post('/chofer-preferencias', [ChoferPreferenciaController::class, 'store']);
    });

    // Catálogos de mermas
    Route::apiResource('tipo-mermas', TipoMermaController::class);
    Route::apiResource('estado-mermas', EstadoMermaController::class);

    // Catálogos de inventario - Operaciones que modifican datos (POST, PUT, DELETE)
    // El GET está en la ruta pública para que cualquier usuario autenticado pueda obtener los datos
    Route::apiResource('tipos-ajuste-inventario', TipoAjusteInventarioController::class, [
        'only' => ['store', 'update', 'destroy', 'show']
    ]);

    // ==========================================
    // 💳 TIPOS DE PAGO (API CRUD)
    // ==========================================
    // Listar tipos de pago: GET /api/tipos-pago
    // Obtener tipo de pago: GET /api/tipos-pago/{id}
    // Crear tipo de pago: POST /api/tipos-pago
    // Actualizar tipo de pago: PUT /api/tipos-pago/{id}
    // Eliminar tipo de pago: DELETE /api/tipos-pago/{id}
    // Tipos activos: GET /api/tipos-pago/activos/listar
    Route::apiResource('tipos-pago', TipoPagoController::class)->names('api.tipos-pago');
    Route::get('/tipos-pago/activos/listar', [TipoPagoController::class, 'activos'])->name('api.tipos-pago.activos');

    // ==========================================
    // 🏢 SECTORES DE ALMACÉN (API CRUD)
    // ==========================================
    // Listar sectores por almacén: GET /api/sectores?almacen_id=2
    // Obtener sector: GET /api/sectores/{id}
    // Crear sector: POST /api/sectores
    // Actualizar sector: PUT /api/sectores/{id}
    // Eliminar sector: DELETE /api/sectores/{id}
    Route::apiResource('sectores', SectorController::class)->names('api.sectores');

    // Obtener sector genérico de un almacén
    Route::get('/almacenes/{almacenId}/sector-generico', [SectorController::class, 'obtenerGenerico'])->name('api.sectores.obtener-generico');

    // Obtener sectores de un almacén (para formularios)
    Route::get('/almacenes/{almacenId}/sectores', [SectorController::class, 'obtenerSectoresPorAlmacen'])->name('api.sectores.obtener-por-almacen');

    // Productos para la app
    Route::get('/app/productos', [ProductoController::class, 'indexApi']);
    Route::get('/app/productos/filtros', [ProductoController::class, 'filtros']);  // ✅ NUEVO: Obtener categorías y marcas
    Route::get('/app/productos/buscar', [ProductoController::class, 'buscarApi']);
    Route::get('/app/productos/listar', [ProductoController::class, 'listarApi']); // ✅ NIVEL 2: Listar todos para Fuse.js - DEBE IR ANTES DE {producto}
    Route::get('/app/productos/{producto}', [ProductoController::class, 'showApi']);

    // ==========================================
    // 📦 COMBOS - CAPACIDAD DE MANUFACTURA
    // ==========================================
    Route::get('/combos/{combo}/capacidad', [ComboController::class, 'capacidad'])->name('api.combos.capacidad');
    Route::get('/combos/{combo}/capacidad-detalles', [ComboController::class, 'capacidadDetalles'])->name('api.combos.capacidad-detalles');
    Route::get('/productos/{producto}/combos', [ComboController::class, 'combosDelProducto'])->name('api.productos.combos');

    // ==========================================
    // 📊 STOCK DE PRODUCTOS
    // ==========================================
    Route::get('/productos/{producto}/stock', [ProductoController::class, 'obtenerStock'])->name('api.productos.stock');
    Route::post('/productos/stock/multiples', [ProductoController::class, 'obtenerStockMultiples'])->name('api.productos.stock.multiples');

    // ✅ NUEVO: PDF de stock disponible para preventistas
    Route::get('/app/stock/pdf', [StockDisponiblePdfController::class, 'generar'])->name('api.app.stock.pdf');

    // ✅ NUEVO: Imagen PNG de stock disponible para preventistas
    Route::get('/app/stock/imagen', [StockDisponiblePdfController::class, 'imagen'])->name('api.app.stock.imagen');

    // ✅ NUEVO: Preventistas para selector en ventas
    Route::get('/preventistas', function () {
        try {
            $preventistas = \App\Models\User::role('preventista')
                ->select('id', 'name')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'preventistas' => $preventistas->toArray(),
            ]);
        } catch (\Exception $e) {
            \Log::error('Error al obtener preventistas:', ['error' => $e->getMessage()]);
            return response()->json([
                'success' => false,
                'message' => 'Error al cargar preventistas',
            ], 500);
        }
    })->name('api.preventistas');

    // ==========================================
    // 🛒 PROFORMAS - API UNIFICADA
    // ==========================================
    // Una sola fuente de verdad para todas las operaciones de proformas
    // El método index() filtra automáticamente según el rol del usuario

    // CRUD básico
    Route::get('/proformas', [ApiProformaController::class, 'index']);                    // Lista (inteligente por rol)
    Route::get('/proformas/estadisticas', [ApiProformaController::class, 'stats']);       // Estadísticas (debe ir antes de {proforma})

    // Búsquedas desde frontend (debe ir antes de {proforma})
    Route::get('/proformas/search/clientes', [ApiProformaController::class, 'searchClientes']);  // ✅ NUEVO: Buscar clientes
    Route::get('/proformas/search/usuarios', [ApiProformaController::class, 'searchUsuarios']);  // ✅ NUEVO: Buscar usuarios

    // Impresión de proformas filtradas (debe ir antes de {proforma})
    Route::post('/proformas/preparar-impresion', [ApiProformaController::class, 'prepararImpresion']);  // ✅ NUEVO: Preparar impresión
    Route::get('/proformas/descargar-pdf', [ApiProformaController::class, 'descargarPdfProformas']);  // ✅ NUEVO: Descargar PDF (para app móvil)
    Route::get('/proformas/descargar-pdf-con-filtros', [ApiProformaController::class, 'descargarPdfProformasConFiltros']);  // ✅ NUEVO: Descargar PDF con filtros (sin paginación)

    Route::post('/proformas', [ApiProformaController::class, 'store']);                   // Crear
    Route::get('/proformas/{proforma}', [ApiProformaController::class, 'show']);          // Ver detalle
    Route::put('/proformas/{proforma}', [ApiProformaController::class, 'update']);        // ✅ NUEVO: Actualizar proforma

    // Acciones sobre proforma
    Route::post('/proformas/{proforma}/aprobar', [ApiProformaController::class, 'aprobar']);
    Route::post('/proformas/{proforma}/rechazar', [ApiProformaController::class, 'rechazar']);
    Route::post('/proformas/{proforma}/convertir-venta', [ApiProformaController::class, 'convertirAVenta']);
    Route::post('/proformas/{proforma}/confirmar', [ApiProformaController::class, 'confirmarProforma'])->name('api.proformas.confirmar');
    Route::post('/proformas/{proforma}/extender-vencimiento', [ApiProformaController::class, 'extenderVencimiento']);
    Route::post('/proformas/{proforma}/coordinar', [ApiProformaController::class, 'coordinarEntrega'])->name('api.proformas.coordinar');
    Route::post('/proformas/{proforma}/actualizar-detalles', [ApiProformaController::class, 'actualizarDetalles'])->name('api.proformas.actualizar-detalles');

    // Estado y verificaciones
    Route::get('/proformas/{proforma}/estado', [ApiProformaController::class, 'verificarEstado']);
    Route::get('/proformas/{proforma}/reservas', [ApiProformaController::class, 'verificarReservas']);
    Route::post('/proformas/{proforma}/extender-reservas', [ApiProformaController::class, 'extenderReservas']);

    // Utilidades
    Route::post('/proformas/verificar-stock', [ApiProformaController::class, 'verificarStock']);
    Route::get('/proformas/productos-disponibles', [ApiProformaController::class, 'obtenerProductosDisponibles']);
    // ✅ NUEVO: Navegación entre proformas pendientes
    Route::get('/proformas/siguiente-pendiente', [ApiProformaController::class, 'obtenerSiguientePendiente']);

    // ✅ ACTUALIZADO: PROFORMAS - Impresión / Descarga de PDFs
    // La ruta de imprimir ahora está en rutas públicas (para compartir sin autenticación)
    // Solo preview requiere autenticación
    Route::group(['prefix' => 'proformas'], function () {
        // 🖨️ Vista previa de proforma en navegador (requiere autenticación)
        Route::get('/{proforma}/preview', [\App\Http\Controllers\ProformaController::class, 'preview'])
            ->name('api.proformas.preview');
    });

    // ==========================================
    // 📦 RESERVAS PROFORMA - GESTIÓN DE STOCK
    // ==========================================
    Route::get('/reservas-proforma', [ReservaProformaController::class, 'index']);           // Lista con filtros y paginación
    Route::get('/reservas-proforma/{id}', [ReservaProformaController::class, 'show']);       // Ver detalle
    Route::post('/reservas-proforma/{id}/liberar', [ReservaProformaController::class, 'liberar']); // Liberar reserva

    // 🛒 ENDPOINTS LEGACY PARA APP MÓVIL (mantener por compatibilidad)
    // TODO: Migrar app móvil para usar /proformas en lugar de /app/pedidos
    Route::post('app/pedidos', [ApiProformaController::class, 'crearPedidoDesdeApp']);
    Route::get('app/pedidos/{id}', [ApiProformaController::class, 'obtenerDetallePedido']);
    Route::get('app/pedidos/{id}/estado', [ApiProformaController::class, 'obtenerEstadoPedido']);
    Route::get('carritos/usuario/{usuarioId}/ultimo', [ApiProformaController::class, 'obtenerUltimoCarrito']);

    // Cliente puede ver sus datos desde la app
    Route::prefix('app/cliente')->group(function () {
        Route::get('/ventas', [VentaController::class, 'ventasCliente']);
        // DEPRECATED: /app/cliente/envios - usar /api/entregas en su lugar
    });

    // 💳 GESTIÓN DE PAGOS EN VENTAS
    Route::prefix('app/ventas')->group(function () {
        Route::post('/{venta}/pagos', [VentaController::class, 'registrarPago'])->name('api.ventas.registrar-pago');
        Route::get('/{ventaId}/entrega', [\App\Http\Controllers\Api\EntregaController::class, 'obtenerEntregaPorVenta'])->name('api.ventas.obtener-entrega');  // ✅ NUEVO (2026-02-17): Obtener entrega para Flutter app
    });

    // DEPRECATED: Seguimiento de envíos desde la app
    // Reemplazado por: /api/entregas/{entrega}/seguimiento
    // (Las rutas de entregas están en routes/api.php dentro de EntregaController)
});

// ==========================================
// 📊 RUTAS PARA DASHBOARD DE LOGÍSTICA
// ==========================================
// DEPRECATED: Rutas de Envios eliminadas - usar /logistica/entregas en su lugar
// Estadísticas: GET /api/entregas/dashboard-stats
// Listado: GET /api/entregas
// Seguimiento: GET /api/entregas/{entrega}/seguimiento

// ==========================================
// RUTAS API EXISTENTES (Protegidas por autenticación)
// ==========================================
Route::middleware(['auth:sanctum,web', 'platform'])->group(function () {
    // ⚠️ IMPORTANTE: Rutas customizadas ANTES de apiResource para evitar conflictos con {id}
    Route::group(['prefix' => 'compras'], function () {
        // 🔍 Búsqueda para AsyncSearchSelect
        Route::get('search', [CompraController::class, 'search']);
        // 📦 Obtener detalles de una compra (para prestamos)
        Route::get('{id}/detalles', [CompraController::class, 'show']);
        // 🖨️ Rutas de impresión - ANTES que apiResource
        Route::get('para-impresion', [CompraController::class, 'comprasParaImpresion']);
    });

    // Rutas API básicas con nombres únicos para evitar conflictos con rutas web
    Route::apiResource('compras', CompraController::class)->names('api.compras');

    // ==========================================
    // 💰 RUTAS PARA GESTIÓN DE PRECIOS
    // ==========================================
    Route::prefix('precios')->group(function () {
        // API: Listar precios con filtros
        Route::get('/', [PrecioController::class, 'listadoApi'])->name('api.precios.listado');

        // API: Obtener detalles de un producto con precios
        Route::get('/producto/{producto}', [PrecioController::class, 'mostrarProducto'])->name('api.precios.mostrar-producto');

        // API: Obtener compras donde el precio de COSTO es diferente
        Route::get('/producto/{productoId}/compras-diferencia-costo', [PrecioController::class, 'obtenerComprasConDiferenciaCosto'])->name('api.precios.compras-diferencia-costo');

        // API: Actualizar un precio específico
        Route::put('/{precio}', [PrecioController::class, 'update'])->name('api.precios.update');

        // API: Obtener historial completo de un precio
        Route::get('/{precio}/historial', [PrecioController::class, 'historial'])->name('api.precios.historial');

        // API: Cambios de precios recientes
        Route::get('/resumen/cambios-recientes', [PrecioController::class, 'cambiosRecientes'])->name('api.precios.cambios-recientes');

        // API: Resumen general
        Route::get('/resumen', [PrecioController::class, 'resumen'])->name('api.precios.resumen');

        // API: Actualizar múltiples precios en lote
        Route::post('/actualizar-lote', [PrecioController::class, 'actualizarLote'])->name('api.precios.actualizar-lote');
    });

    // ✅ VENTAS: PDF Download (Impresión de tickets y facturas) - ANTES de apiResource
    // Esto asegura que se procesen ANTES que las rutas genéricas de apiResource
    Route::group(['prefix' => 'ventas'], function () {
        // ✅ Reporte de productos vendidos - DEBE IR ANTES que {venta}/imprimir
        // Para evitar que sea capturado por {venta}/imprimir
        Route::get('reporte-productos-vendidos/imprimir', [\App\Http\Controllers\ReporteVentasController::class, 'imprimirReporte']);

        // 🖨️ Descargar venta como PDF (múltiples formatos)
        // Accesible por Chofer (para descargar PDFs de ventas asignadas)
        // y por Cliente (para descargar sus propias ventas)
        Route::get('{venta}/imprimir', [VentaController::class, 'imprimir'])
            ->name('api.ventas.imprimir');

        // 🖨️ Vista previa de venta en navegador
        Route::get('{venta}/preview', [VentaController::class, 'preview'])
            ->name('api.ventas.preview');
    });

    // ⚠️ IMPORTANTE: Rutas customizadas ANTES de apiResource para evitar conflictos con {id}
    Route::group(['prefix' => 'ventas'], function () {
        // 🖨️ Rutas de impresión - ANTES que apiResource
        Route::get('para-impresion', [VentaController::class, 'ventasParaImpresion']);
        Route::get('search', [VentaController::class, 'search'])->name('api.ventas.search');
        // 📦 Obtener detalles de una venta (para préstamos)
        Route::get('{id}/detalles', [VentaController::class, 'show']);
        Route::post('verificar-stock', [VentaController::class, 'verificarStock']);
        Route::get('productos/stock-bajo', [VentaController::class, 'productosStockBajo']);

        // 🎯 Rutas con parámetro {venta} o {producto}
        Route::get('{producto}/stock', [VentaController::class, 'obtenerStockProducto']);
        Route::get('{venta}/resumen-stock', [VentaController::class, 'obtenerResumenStock']);
        Route::post('{venta}/anular', [VentaController::class, 'anular']);

        // ✅ NUEVO: Verificar reversión de stock en ventas anuladas (auditoría)
        Route::get('{venta}/verificar-reversion-stock', [VentaController::class, 'verificarReversionStock']);

        // ✅ NUEVO (2026-02-10): Ejecutar reversión de stock manualmente
        Route::post('{venta}/ejecutar-reversion-stock', [VentaController::class, 'ejecutarReversionStock']);

        // ✅ NUEVO: Endpoints para confirmación de pickup
        Route::post('{venta}/confirmar-pickup-cliente', [ApiVentaController::class, 'confirmarPickupCliente'])
            ->name('api.ventas.confirmar-pickup-cliente');

        Route::post('{venta}/confirmar-pickup-empleado', [ApiVentaController::class, 'confirmarPickupEmpleado'])
            ->name('api.ventas.confirmar-pickup-empleado');

        // ✅ NUEVO: Registrar venta en movimientos de caja
        Route::post('{venta}/registrar-en-caja', [ApiVentaController::class, 'registrarEnCaja'])
            ->name('api.ventas.registrar-en-caja')
            ->middleware('permission:cajas.transacciones');

        // ✅ NUEVO: Gestión de pagos de venta (efectivo + transferencia + etc.)
        Route::post('{venta}/pagos/registrar', [PagoVentaController::class, 'registrarPagos'])
            ->name('api.ventas.pagos.registrar');

        Route::get('{venta}/pagos/resumen', [PagoVentaController::class, 'obtenerResumen'])
            ->name('api.ventas.pagos.resumen');

        Route::get('{venta}/pagos/detalle', [PagoVentaController::class, 'obtenerDetalle'])
            ->name('api.ventas.pagos.detalle');

        Route::get('pagos/reporte-caja', [PagoVentaController::class, 'reporteCaja'])
            ->name('api.ventas.pagos.reporte-caja');
    });

    Route::apiResource('ventas', VentaController::class)->names('api.ventas');
});

// Rutas API para contabilidad
Route::group(['prefix' => 'contabilidad'], function () {
    Route::get('asientos', [AsientoContableController::class, 'indexApi']);
    Route::get('asientos/{asientoContable}', [AsientoContableController::class, 'showApi']);
});

// Rutas API para inventario
Route::group(['prefix' => 'inventario'], function () {
    Route::get('buscar-productos', [InventarioController::class, 'buscarProductos']);
    Route::get('stock-producto/{producto}', [InventarioController::class, 'stockProducto']);
    Route::get('stock-filtrado', [InventarioController::class, 'apiStockFiltrado']);
    Route::get('lotes', [InventarioController::class, 'apiLotes']);
    Route::post('ajustes', [InventarioController::class, 'procesarAjusteApi']);
    // ✅ NUEVO: Endpoint mejorado para ajustes por tabla
    Route::post('ajuste', [InventarioController::class, 'procesarAjusteTabla']);
    // ✅ NUEVO: Búsqueda de productos por almacén (incluye productos sin stock)
    Route::get('productos-almacen/{almacen_id}', [InventarioController::class, 'buscarProductosAlmacen']);
    // ✅ NUEVO: Crear stock_producto para producto nuevo
    Route::post('crear-stock-producto', [InventarioController::class, 'crearStockProducto']);
    Route::get('movimientos', [InventarioController::class, 'movimientosApi']);
    Route::get('movimientos-para-impresion', [InventarioController::class, 'movimientosParaImpresion']);
    Route::post('movimientos', [InventarioController::class, 'crearMovimiento']);
    Route::get('estadisticas', [InventarioController::class, 'estadisticasApi']);

    // ✅ NUEVO: Tipos de Operación para ajustes masivos
    Route::get('tipos-operacion', [TipoOperacionController::class, 'index']);
    Route::get('tipos-operacion/{tipoOperacion}', [TipoOperacionController::class, 'show']);
    Route::get('tipos-operacion/por-direccion/{direccion}', [TipoOperacionController::class, 'porDireccion']);
    Route::get('tipos-operacion/con-requisitos', [TipoOperacionController::class, 'conRequisitos']);

    // Reportes
    Route::group(['prefix' => 'reportes'], function () {
        Route::get('estadisticas', [ReporteInventarioApiController::class, 'estadisticasGenerales']);
        Route::get('stock-bajo', [ReporteInventarioApiController::class, 'stockBajo']);
        Route::get('proximos-vencer', [ReporteInventarioApiController::class, 'proximosVencer']);
        Route::get('vencidos', [ReporteInventarioApiController::class, 'vencidos']);
        Route::get('movimientos-periodo', [ReporteInventarioApiController::class, 'movimientosPorPeriodo']);
        Route::get('productos-mas-movidos', [ReporteInventarioApiController::class, 'productosMasMovidos']);
        Route::get('valorizacion', [ReporteInventarioApiController::class, 'valorizacionInventario']);
        Route::get('generar', [ReporteInventarioApiController::class, 'generar'])->name('inventario.reportes.generar');
    });
});

// Rutas API para localidades
Route::middleware(['auth:sanctum,web', 'platform'])->group(function () {
    // Rutas API para productos
    Route::group(['prefix' => 'productos'], function () {
        Route::get('/', [ProductoController::class, 'indexApi']);
        Route::post('/', [ProductoController::class, 'storeApi']);
        Route::get('buscar', [ProductoController::class, 'buscarApi']);
        Route::get('{producto}', [ProductoController::class, 'showApi']);
        Route::put('{producto}', [ProductoController::class, 'updateApi']);
        Route::delete('{producto}', [ProductoController::class, 'destroyApi']);
        Route::get('{producto}/historial-precios', [ProductoController::class, 'historialPrecios']);

        // ✅ NUEVO: Rutas para gestión de rangos de precios por cantidad
        Route::get('{producto}/rangos-precio', [PrecioRangoProductoController::class, 'index']);
        Route::post('{producto}/rangos-precio', [PrecioRangoProductoController::class, 'store']);
        Route::get('{producto}/rangos-precio/{rango}', [PrecioRangoProductoController::class, 'show'])
            ->where('rango', '\d+');
        Route::put('{producto}/rangos-precio/{rango}', [PrecioRangoProductoController::class, 'update'])
            ->where('rango', '\d+');
        Route::delete('{producto}/rangos-precio/{rango}', [PrecioRangoProductoController::class, 'destroy'])
            ->where('rango', '\d+');
        Route::get('{producto}/rangos-precio/validar', [PrecioRangoProductoController::class, 'validarIntegridad']);
        Route::post('{producto}/rangos-precio/copiar/{productoDestino}', [PrecioRangoProductoController::class, 'copiarRangos']);
        Route::post('{producto}/calcular-precio', [PrecioRangoProductoController::class, 'calcularPrecio']);

        // ✅ NUEVO: Rutas para importación CSV de rangos
        Route::post('rangos-precio/previsualizar-csv', [PrecioRangoProductoController::class, 'previsualizarCSV']);
        Route::post('rangos-precio/importar-csv', [PrecioRangoProductoController::class, 'importarCSV']);
        Route::get('rangos-precio/plantilla-csv', [PrecioRangoProductoController::class, 'descargarPlantillaCSV']);

        // Rutas para carga masiva de productos
        Route::post('importar-masivo', [ProductoController::class, 'importarProductosMasivos']);
        Route::post('validar-csv', [ProductoController::class, 'validarProductosCSV']);
        Route::get('cargas-masivas', [ProductoController::class, 'listarCargasMasivas']);
        Route::get('cargas-masivas/{cargo}', [ProductoController::class, 'verCargaMasiva']);
        Route::post('cargas-masivas/{cargo}/revertir', [ProductoController::class, 'revertirCargaMasiva']);
    });

    // ✅ NUEVO: Endpoint para calcular carrito completo con precios por rango
    Route::post('/carrito/calcular', [PrecioRangoProductoController::class, 'calcularCarrito']);

    // Rutas API para vehículos
    Route::group(['prefix' => 'vehiculos'], function () {
        Route::get('/', [VehiculoController::class, 'apiIndex']);
        Route::get('/{vehiculo}', [VehiculoController::class, 'apiShow']);
        Route::post('/sugerir', [VehiculoController::class, 'apiSugerir']);
    });

    // Rutas API para clientes
    Route::group(['prefix' => 'clientes'], function () {
        Route::get('/', [ClienteController::class, 'index']);
        Route::post('/', [ClienteController::class, 'store']);
        Route::get('buscar', [ClienteController::class, 'buscarApi']);
        Route::get('search', [ClienteController::class, 'search']);

        // Ruta especial para obtener el perfil del cliente autenticado (debe ir antes de {cliente})
        Route::get('mi-perfil', [ClienteController::class, 'miPerfil']);

        Route::get('{cliente}', [ClienteController::class, 'showApi']);
        Route::put('{cliente}', [ClienteController::class, 'update']);
        Route::delete('{cliente}', [ClienteController::class, 'destroy']);
        Route::get('{cliente}/saldo-cuentas', [ClienteController::class, 'saldoCuentasPorCobrar']);
        Route::get('{cliente}/historial-ventas', [ClienteController::class, 'historialVentas']);
        Route::get('{cliente}/credito/detalles', [ClienteController::class, 'obtenerDetallesCreditoApi']);
        Route::get('{cliente}/auditoria-credito', [ClienteController::class, 'obtenerAuditoriaCreditoApi']);
        Route::post('{cliente}/pagos', [ClienteController::class, 'registrarPagoApi']);

        // Cambio de credenciales para clientes autenticados
        Route::post('cambiar-credenciales', [ClienteController::class, 'cambiarCredenciales']);

        // Gestión de direcciones
        Route::get('{cliente}/direcciones', [DireccionClienteApiController::class, 'index']);
        Route::post('{cliente}/direcciones', [DireccionClienteApiController::class, 'store']);
        Route::put('{cliente}/direcciones/{direccion}', [DireccionClienteApiController::class, 'update']);

        // Gestión de fotos de lugar
        Route::get('{cliente}/fotos', [\App\Http\Controllers\FotoLugarClienteController::class, 'index']);
        Route::post('{cliente}/fotos', [\App\Http\Controllers\FotoLugarClienteController::class, 'store']);
        Route::post('{cliente}/fotos/multiple', [\App\Http\Controllers\FotoLugarClienteController::class, 'uploadMultiple']);
        Route::get('{cliente}/fotos/{foto}', [\App\Http\Controllers\FotoLugarClienteController::class, 'show']);
        Route::put('{cliente}/fotos/{foto}', [\App\Http\Controllers\FotoLugarClienteController::class, 'update']);
        Route::delete('{cliente}/fotos/{foto}', [\App\Http\Controllers\FotoLugarClienteController::class, 'destroy']);
        Route::delete('{cliente}/direcciones/{direccion}', [DireccionClienteApiController::class, 'destroy']);
        Route::patch('{cliente}/direcciones/{direccion}/principal', [DireccionClienteApiController::class, 'establecerPrincipal']);

        // ✅ FASE 3: Nuevas rutas para créditos mejoradas
        Route::get('{cliente}/credito-detalles', [ClienteController::class, 'obtenerDetallesCreditoApi'])->name('api.cliente.credito-detalles');
        Route::get('{cliente}/cuentas-pendientes', [ClienteController::class, 'obtenerCuentasPendientes'])->name('api.cliente.cuentas-pendientes');
        Route::get('{cliente}/cuentas-vencidas', [ClienteController::class, 'obtenerCuentasVencidas'])->name('api.cliente.cuentas-vencidas');
        Route::get('{cliente}/pagos', [ClienteController::class, 'obtenerHistorialPagos'])->name('api.cliente.pagos');
        Route::post('{cliente}/registrar-pago', [ClienteController::class, 'registrarPagoApi'])->name('api.cliente.registrar-pago');
        Route::post('pagos/{pago}/anular', [ClienteController::class, 'anularPago'])->name('api.pago.anular');
        Route::post('{cliente}/ajustar-limite', [ClienteController::class, 'ajustarLimiteCredito'])->name('api.cliente.ajustar-limite');

        // ✅ FASE 4: Rutas para impresión de reportes de crédito
        Route::get('{cliente}/credito/imprimir', [ClienteController::class, 'imprimirCredito'])->name('api.cliente.credito.imprimir');
        Route::get('{cliente}/credito/preview', [ClienteController::class, 'previewCredito'])->name('api.cliente.credito.preview');

        // ✅ FASE 4: Rutas para impresión de comprobantes de pago
        Route::get('{cliente}/pagos/{pago}/imprimir', [ClienteController::class, 'imprimirPago'])->name('api.cliente.pago.imprimir');
        Route::get('{cliente}/pagos/{pago}/preview', [ClienteController::class, 'previewPago'])->name('api.cliente.pago.preview');
    });

    // ✅ FASE 3: Grupo de rutas para gestión de créditos
    Route::group(['prefix' => 'creditos'], function () {
        Route::get('/', [ClienteController::class, 'listarCreditos'])->name('api.creditos.index');
        Route::get('mi-credito', [ClienteController::class, 'obtenerMiCredito'])->name('api.creditos.mi-credito');
        Route::get('cliente/{clienteId}/resumen', [ClienteController::class, 'obtenerResumenCredito'])->name('api.creditos.resumen');
        Route::get('estadisticas', [ClienteController::class, 'obtenerEstadisticasCreditos'])->name('api.creditos.estadisticas');
        Route::get('exportar', [ClienteController::class, 'exportarReporteCreditos'])->name('api.creditos.exportar');

        // ✅ IMPORTACION DE CREDITOS HISTORICOS (SOLO ADMIN)
        Route::post('importar/validar', [\App\Http\Controllers\CreditoImportController::class, 'validar'])->name('api.creditos.validar');
        Route::post('importar', [\App\Http\Controllers\CreditoImportController::class, 'importar'])->name('api.creditos.importar');

        // ✅ CREAR CREDITO MANUAL (SOLO ADMIN)
        Route::post('crear', [\App\Http\Controllers\CreditoController::class, 'store'])->name('api.creditos.crear');
    });

    Route::group(['prefix' => 'localidades'], function () {
        Route::get('/', [LocalidadController::class, 'indexApi']);
        Route::post('/', [LocalidadController::class, 'storeApi']);
        Route::get('{localidad}', [LocalidadController::class, 'showApi']);
        Route::put('{localidad}', [LocalidadController::class, 'updateApi']);
        Route::delete('{localidad}', [LocalidadController::class, 'destroyApi']);
    });

    // Geocoding / Reverse Geocoding - Auto-detección de localidad por GPS
    Route::group(['prefix' => 'geocoding'], function () {
        Route::post('/reverse', [GeocodingController::class, 'reverseGeocode'])->name('api.geocoding.reverse');
    });

    Route::group(['prefix' => 'categorias-cliente'], function () {
        Route::get('/', [CategoriaClienteController::class, 'indexApi']);
        Route::post('/', [CategoriaClienteController::class, 'storeApi']);
        Route::get('{categoria}', [CategoriaClienteController::class, 'showApi']);
        Route::put('{categoria}', [CategoriaClienteController::class, 'updateApi']);
        Route::delete('{categoria}', [CategoriaClienteController::class, 'destroyApi']);
    });
});

// ==========================================
// 📦 RUTAS API PARA LOGÍSTICA
// ==========================================

// RUTAS - Planificación y gestión
Route::middleware(['auth:sanctum', 'platform'])->group(function () {
    Route::prefix('rutas')->group(function () {
        Route::get('/', [\App\Http\Controllers\Api\RutaApiController::class, 'index']);
        Route::post('/planificar', [\App\Http\Controllers\Api\RutaApiController::class, 'planificar']);
        Route::get('/{ruta}', [\App\Http\Controllers\Api\RutaApiController::class, 'show']);
        Route::patch('/{ruta}/estado', [\App\Http\Controllers\Api\RutaApiController::class, 'actualizarEstado']);
        Route::get('/{ruta}/detalles', [\App\Http\Controllers\Api\RutaApiController::class, 'obtenerDetalles']);
        Route::post('/{ruta}/detalles/{detalle}/completar', [\App\Http\Controllers\Api\RutaApiController::class, 'completarDetalle']);
    });
});

// CHOFER - Entregas y tracking
Route::middleware(['auth:sanctum', 'platform'])->group(function () {
    Route::prefix('chofer')->group(function () {
        // ✅ NUEVO: Obtener estadísticas rápidas (optimizado para dashboard)
        Route::get('/estadisticas', [EntregaController::class, 'estadisticasChofer']);

        // Nuevo endpoint que combina entregas + envios
        Route::get('/trabajos', [EntregaController::class, 'misTrabjos']);

        // Endpoints legacy (mantener para compatibilidad)
        Route::get('/entregas', [EntregaController::class, 'entregasAsignadas']);
        Route::get('/entregas/{id}', [EntregaController::class, 'showEntrega']);
        Route::post('/entregas/{id}/iniciar-ruta', [EntregaController::class, 'iniciarRuta']);
        Route::post('/entregas/{id}/actualizar-estado', [EntregaController::class, 'actualizarEstado']);
        Route::post('/entregas/{id}/marcar-llegada', [EntregaController::class, 'marcarLlegada']);
        // ✅ NUEVO: Confirmar una VENTA específica (con validación de todas entregadas)
        // ✅ Confirmar venta individual (venta por venta)
        Route::post('/entregas/{id}/ventas/{venta_id}/confirmar-entrega', [EntregaController::class, 'confirmarVentaEntregada']);
        // ✅ NUEVO: Actualizar una confirmación existente (editar confirmación)
        Route::put('/entregas/{id}/ventas/{venta_id}/confirmaciones/{confirmacion_id}', [EntregaController::class, 'actualizarConfirmacionVenta']);

        // ✅ NUEVA RUTA: Finalizar entrega (después de todas las ventas entregadas)
        Route::post('/entregas/{id}/finalizar-entrega', [EntregaController::class, 'finalizarEntrega']);

        // Confirmar TODA la entrega (backward compatibility)
        Route::post('/entregas/{id}/confirmar-entrega', [EntregaController::class, 'confirmarEntrega']);
        Route::post('/entregas/{id}/reportar-novedad', [EntregaController::class, 'reportarNovedad']);
        Route::post('/entregas/{id}/ubicacion', [EntregaController::class, 'registrarUbicacion']);
        Route::get('/historial', [EntregaController::class, 'historialEntregas']);

        // ✅ NUEVO: Resumen de pagos registrados en una entrega
        Route::get('/entregas/{id}/resumen-pagos', [EntregaController::class, 'obtenerResumenPagos']);

        // ✅ NUEVO: Obtener entregas disponibles para reasignar
        Route::get('/entregas/{id}/entregas-disponibles', [EntregaController::class, 'entregasDisponiblesParaReasignar']);

        // ✅ NUEVO: Reasignar una venta a otra entrega
        Route::put('/entregas/{id}/reasignar-venta', [EntregaController::class, 'reasignarVenta']);

        // ✅ NUEVO: Rutas para gestión de cajas del chofer
        Route::prefix('cajas')->middleware('can.open.caja')->group(function () {
            Route::get('/estado', [ChoferCajaController::class, 'obtenerEstado']);
            Route::post('/abrir', [ChoferCajaController::class, 'abrirCaja']);
            Route::post('/cerrar', [ChoferCajaController::class, 'cerrarCaja']);
            Route::get('/movimientos', [ChoferCajaController::class, 'obtenerMovimientos']);
            Route::get('/resumen', [ChoferCajaController::class, 'obtenerResumen']);
        });
    });

    // CLIENTE - Tracking de pedidos
    Route::prefix('cliente')->group(function () {
        Route::get('/pedidos/{proformaId}/tracking', [EntregaController::class, 'obtenerTracking']);
    });

    // TRACKING - Información de ubicación y ETA
    Route::prefix('tracking')->group(function () {
        // Rutas originales (web)
        Route::get('/entregas/{entregaId}/ubicaciones', [TrackingController::class, 'obtenerUbicaciones']);
        Route::get('/entregas/{entregaId}/ultima-ubicacion', [TrackingController::class, 'ultimaUbicacion']);
        Route::post('/entregas/{entregaId}/calcular-eta', [TrackingController::class, 'calcularETA']);

        // ✅ ALIAS: Rutas alternativas para compatibilidad con app Flutter
        Route::get('/ubicaciones/{entregaId}', [TrackingController::class, 'obtenerUbicaciones']);
        Route::get('/ultima-ubicacion/{entregaId}', [TrackingController::class, 'ultimaUbicacion']);
    });

    // ENCARGADO - Gestión de entregas
    Route::prefix('encargado')->group(function () {
        Route::get('/dashboard', [EncargadoController::class, 'dashboard']);
        Route::get('/dashboard/stats', [EncargadoController::class, 'dashboard']); // Alias para obtener estadísticas

        // ✅ Entregas (mantener en EncargadoController - lógica específica)
        Route::get('/entregas/asignadas', [EncargadoController::class, 'entregasAsignadas']);
        Route::post('/entregas/{id}/procesar-carga', [EncargadoController::class, 'procesarCargaVehiculo']);
        Route::get('/entregas', [EncargadoController::class, 'indexAdmin']);
        Route::post('/entregas/{id}/asignar', [EncargadoController::class, 'asignarEntrega']);
        Route::get('/entregas/activas', [EncargadoController::class, 'entregasActivas']);
    });

    // DEPRECATED: RECURSOS - Vehículos y Choferes disponibles
    // Estas rutas estaban usando EnvioController que ha sido eliminado
    // TODO: Implementar endpoints equivalentes en EntregaController o recurso separado
    // Route::prefix('recursos')->group(function () {
    //     Route::get('/vehiculos/disponibles', [EntregaController::class, 'obtenerVehiculosDisponibles']);
    //     Route::get('/choferes/disponibles', [EntregaController::class, 'obtenerChoferesDisponibles']);
    // });

    // ADMIN - Gestión completa de entregas
    Route::prefix('admin')->group(function () {
        Route::get('/entregas', [EntregaController::class, 'indexAdmin']);
        Route::post('/entregas/{id}/asignar', [EntregaController::class, 'asignarEntrega']);
        Route::get('/entregas/activas', [EntregaController::class, 'entregasActivas']);
    });

    // ✅ NUEVO: Tracking GPS en tiempo real
    Route::prefix('entregas')->group(function () {
        // Registrar ubicación GPS (desde app móvil o web)
        Route::post('/{id}/ubicacion', [EntregaController::class, 'registrarUbicacion'])
            ->middleware('permission:envios.manage')
            ->name('entregas.registrar-ubicacion');

        // Obtener historial de ubicaciones (para visualización de ruta)
        Route::get('/{id}/ubicaciones', [EntregaController::class, 'obtenerUbicaciones'])
            ->middleware('permission:envios.manage')
            ->name('entregas.ubicaciones');
    });

    // ✅ PHASE 2: ENTREGAS (Simples y en Lote)
    Route::prefix('entregas')->group(function () {
        // ✅ TEST: Debug endpoint para notificaciones WebSocket
        Route::post('/test-notificacion-venta', [EntregaController::class, 'testVentaNotificacion'])
            ->name('api.entregas.test-notificacion-venta');

        // Crear entrega simple (1 venta)
        Route::post('/', [\App\Http\Controllers\EntregaController::class, 'store'])
            ->middleware('permission:entregas.create')
            ->name('api.entregas.store');
    });

    // ✅ PHASE 2: ENTREGAS EN LOTE (Creación Masiva Optimizada)
    Route::prefix('entregas/lote')->group(function () {
        // Preview/simulación de creación en lote
        Route::post('/preview', [EntregaBatchController::class, 'preview'])
            ->middleware('permission:entregas.create')
            ->name('entregas.lote.preview');

        // Crear entregas en lote
        Route::post('/', [EntregaBatchController::class, 'store'])
            ->middleware('permission:entregas.create')
            ->name('entregas.lote.crear');

        // Optimizar entregas para múltiples vehículos (sin crear)
        Route::post('/optimizar', [EntregaBatchController::class, 'optimizar'])
            ->middleware('permission:entregas.create')
            ->name('entregas.lote.optimizar');
    });

    // ✅ LOGÍSTICA: Seguimiento de Ventas y Entregas
    Route::prefix('ventas')->group(function () {
        // ✅ NUEVO: Obtener lista de impresoras disponibles
        Route::get('/impresoras/disponibles', [\App\Http\Controllers\ReporteVentasController::class, 'obtenerImpresoras'])
            ->name('impresoras.disponibles');

        // Obtener detalle logístico de una venta (estado de entregas)
        Route::get('/{venta}/logistica', [\App\Http\Controllers\Api\VentaLogisticaController::class, 'show'])
            ->middleware('permission:ventas.show')
            ->name('ventas.logistica.show');

        // Obtener todas las entregas de una venta
        Route::get('/{venta}/entregas', [\App\Http\Controllers\Api\VentaLogisticaController::class, 'entregas'])
            ->middleware('permission:ventas.show')
            ->name('ventas.entregas');
    });

    // ✅ LOGÍSTICA: Estadísticas y Admin
    Route::prefix('logistica')->group(function () {
        // Estadísticas generales de entregas por estado
        Route::get('/estadisticas', [\App\Http\Controllers\Api\VentaLogisticaController::class, 'estadisticas'])
            ->middleware('permission:entregas.index')
            ->name('logistica.estadisticas');

        // Resincronizar estados (admin only)
        Route::post('/resincronizar', [\App\Http\Controllers\Api\VentaLogisticaController::class, 'resincronizar'])
            ->middleware('permission:admin.panel')
            ->name('logistica.resincronizar');
    });

    // ✅ PHASE 3: ENTREGAS - Flujo de carga y tránsito
    Route::prefix('entregas')->group(function () {
        // 🖨️ Descargar entrega como PDF (múltiples formatos)
        Route::get('/{entrega}/descargar', [\App\Http\Controllers\EntregaPdfController::class, 'descargar'])
            ->middleware('auth:sanctum,web')
            ->name('entregas.descargar');

        // 🖨️ Vista previa de entrega en navegador
        Route::get('/{entrega}/preview', [\App\Http\Controllers\EntregaPdfController::class, 'preview'])
            ->middleware('auth:sanctum,web')
            ->name('entregas.preview');

        // 📊 Exportar entrega a Excel
        Route::get('/{entrega}/exportar-excel', [\App\Http\Controllers\EntregaPdfController::class, 'exportarExcel'])
            ->middleware('auth:sanctum,web')
            ->name('entregas.exportar-excel');

        // 🔍 Debug - Ver datos de entrega (TEMPORAL)
        Route::get('/{entrega}/debug', [\App\Http\Controllers\EntregaPdfController::class, 'debug'])
            ->middleware('auth:sanctum,web')
            ->name('entregas.debug');

        // 📦 Obtener productos agrupados de una entrega (consolidando cantidades)
        Route::get('/{entrega}/productos-agrupados', [\App\Http\Controllers\EntregaPdfController::class, 'obtenerProductosAgrupados'])
            ->middleware('auth:sanctum,web')
            ->name('entregas.productos-agrupados');

        // Confirmar carga (cambiar a EN_CARGA)
        Route::post('/{id}/confirmar-carga', [EntregaController::class, 'confirmarCarga'])
            ->middleware('permission:entregas.update')
            ->name('entregas.confirmar-carga');

        // Marcar listo para entrega (cambiar a LISTO_PARA_ENTREGA)
        Route::post('/{id}/listo-para-entrega', [EntregaController::class, 'marcarListoParaEntrega'])
            ->middleware('permission:entregas.update')
            ->name('entregas.listo-para-entrega');

        // Iniciar tránsito (cambiar a EN_TRANSITO)
        Route::post('/{id}/iniciar-transito', [EntregaController::class, 'iniciarTransito'])
            ->middleware('permission:entregas.update')
            ->name('entregas.iniciar-transito');

        // Actualizar ubicación GPS
        Route::patch('/{id}/ubicacion-gps', [EntregaController::class, 'actualizarUbicacionGPS'])
            ->middleware('permission:entregas.update')
            ->name('entregas.ubicacion-gps');

        // ✅ PHASE 4: Entregas consolidadas (N:M Venta-Entrega)
        // Consolidación automática (botón en header)
        Route::post('/consolidar-automatico', [EntregaController::class, 'consolidarAutomatico'])
            ->middleware('permission:entregas.create')
            ->name('entregas.consolidar-automatico');

        // Crear entrega consolidada con múltiples ventas
        Route::post('/crear-consolidada', [EntregaController::class, 'crearEntregaConsolidada'])
            ->middleware('permission:entregas.create')
            ->name('entregas.crear-consolidada');

        // 🔧 NUEVO: Actualizar entrega consolidada (modo edición)
        // PATCH /api/entregas/{entrega_id}
        Route::patch('/{entrega}', [EntregaController::class, 'actualizarEntregaConsolidada'])
            ->middleware('permission:entregas.update')
            ->name('entregas.actualizar-consolidada');

        // Cancelar entrega consolidada sin afectar ventas
        Route::post('/{id}/cancelar', [EntregaController::class, 'cancelarEntrega'])
            ->middleware('permission:entregas.delete')
            ->name('entregas.cancelar');

        // Confirmar venta cargada en almacén (confirmar_carga workflow)
        Route::post('/{id}/confirmar-venta/{venta_id}', [EntregaController::class, 'confirmarVentaCargada'])
            ->middleware('permission:entregas.update')
            ->name('entregas.confirmar-venta');

        // Desmarcar venta como cargada
        Route::delete('/{id}/confirmar-venta/{venta_id}', [EntregaController::class, 'desmarcarVentaCargada'])
            ->middleware('permission:entregas.update')
            ->name('entregas.desmarcar-venta');

        // Obtener detalles completos de entrega consolidada
        Route::get('/{id}/detalles', [EntregaController::class, 'obtenerDetalles'])
            ->middleware('permission:entregas.show')
            ->name('entregas.detalles');

        // Obtener progreso de confirmación de carga
        Route::get('/{id}/progreso', [EntregaController::class, 'obtenerProgreso'])
            ->middleware('permission:entregas.show')
            ->name('entregas.progreso');

        // Obtener localidades de clientes en las ventas de una entrega
        Route::get('/{entrega}/localidades', [EntregaController::class, 'obtenerLocalidades'])
            ->middleware('permission:entregas.show')
            ->name('entregas.localidades');

        // ✅ NUEVO: Corregir pagos en entregas ya confirmadas
        Route::patch('/{entrega}/ventas/{venta}/corregir-pago', [EntregaController::class, 'corregirPagoConfirmacion'])
            ->middleware('permission:entregas.update')
            ->name('entregas.corregir-pago');

        // ✅ NUEVO 2026-02-21: Cambiar tipo de entrega de una venta
        Route::patch('/{entrega}/ventas/{venta}/cambiar-tipo-entrega', [EntregaController::class, 'cambiarTipoEntrega'])
            ->middleware('permission:entregas.update')
            ->name('entregas.cambiar-tipo-entrega');
    });

    // ✅ PHASE 3: REPORTES DE CARGA (Gestión de cargas en vehículos)
    Route::prefix('reportes-carga')->group(function () {
        // Crear nuevo reporte de carga (accesible si puedes crear entregas)
        Route::post('/', [ReporteCargoController::class, 'generarReporte'])
            ->middleware('permission:entregas.create')
            ->name('reportes-carga.crear');

        // 🖨️ Formatos de impresión disponibles (ANTES de /{reporte} para mayor especificidad)
        Route::get('/formatos-disponibles', [ReporteCargoController::class, 'formatosDisponibles'])
            ->middleware('auth:sanctum,web')  // Solo requiere autenticación
            ->name('reportes-carga.formatos-disponibles');

        // Obtener detalles de un reporte
        Route::get('/{reporte}', [ReporteCargoController::class, 'show'])
            ->middleware('permission:reportes-carga.view')
            ->name('reportes-carga.show');

        // 🖨️ Vista previa de reporte
        Route::get('/{reporte}/preview', [ReporteCargoController::class, 'preview'])
            ->middleware('auth:sanctum,web')  // Solo requiere autenticación
            ->name('reportes-carga.preview');

        // 🖨️ Descargar reporte como PDF
        Route::get('/{reporte}/descargar', [ReporteCargoController::class, 'descargar'])
            ->middleware('auth:sanctum,web')  // Solo requiere autenticación, no permiso específico
            ->name('reportes-carga.descargar');

        // Actualizar cantidad cargada de un detalle
        Route::patch('/{reporte}/detalles/{detalle}', [ReporteCargoController::class, 'actualizarDetalle'])
            ->middleware('permission:reportes-carga.actualizar-detalle')
            ->name('reportes-carga.actualizar-detalle');

        // Verificar un detalle de carga
        Route::post('/{reporte}/detalles/{detalle}/verificar', [ReporteCargoController::class, 'verificarDetalle'])
            ->middleware('permission:reportes-carga.verificar-detalle')
            ->name('reportes-carga.verificar-detalle');

        // Confirmar carga completa
        Route::post('/{reporte}/confirmar', [ReporteCargoController::class, 'confirmarCarga'])
            ->middleware('permission:reportes-carga.confirmar')
            ->name('reportes-carga.confirmar');

        // Marcar como listo para entrega
        Route::post('/{reporte}/listo-para-entrega', [ReporteCargoController::class, 'marcarListoParaEntrega'])
            ->middleware('permission:reportes-carga.listo-para-entrega')
            ->name('reportes-carga.listo-para-entrega');

        // Cancelar reporte
        Route::post('/{reporte}/cancelar', [ReporteCargoController::class, 'cancelarReporte'])
            ->middleware('permission:reportes-carga.delete')
            ->name('reportes-carga.cancelar');

        // ✅ NUEVA: Generar PDF del reporte (descargar)
        Route::get('/{reporte}/pdf', [ReporteCargaPdfController::class, 'generarPdf'])
            ->middleware('auth:sanctum,web')
            ->name('reportes-carga.pdf');

        // ✅ NUEVA: Generar PDF detallado con entregas (descargar)
        Route::get('/{reporte}/pdf-detallado', [ReporteCargaPdfController::class, 'generarPdfDetallado'])
            ->middleware('auth:sanctum,web')
            ->name('reportes-carga.pdf-detallado');

        // ✅ NUEVA: Vista previa de PDF en navegador
        Route::get('/{reporte}/pdf-preview', [ReporteCargaPdfController::class, 'previewPdf'])
            ->middleware('auth:sanctum,web')
            ->name('reportes-carga.pdf-preview');
    });

    // ✅ FASE 2: Endpoints para gestión centralizada de reportes
    Route::group(['prefix' => 'reportes'], function () {
        // Obtener estadísticas de reportes
        Route::get('/estadisticas', [ReporteCargoListController::class, 'estadisticas'])
            ->middleware('auth:sanctum,web')
            ->name('reportes.estadisticas');

        // Exportar múltiples reportes como ZIP
        Route::post('/exportar-zip', [ReporteCargoListController::class, 'exportarZip'])
            ->middleware('auth:sanctum,web')
            ->name('reportes.exportar-zip');
    });

    // ✅ NUEVO: Rutas para Reportes de Productos Dañados
    Route::prefix('reportes-productos-danados')->group(function () {
        // Listar todos los reportes
        Route::get('/', [ReporteProductoDañadoController::class, 'index'])
            ->name('reportes-productos-danados.index');

        // Crear un nuevo reporte
        Route::post('/', [ReporteProductoDañadoController::class, 'store'])
            ->name('reportes-productos-danados.store');

        // Ver detalles de un reporte
        Route::get('/{id}', [ReporteProductoDañadoController::class, 'show'])
            ->name('reportes-productos-danados.show');

        // Actualizar estado del reporte
        Route::patch('/{id}', [ReporteProductoDañadoController::class, 'update'])
            ->name('reportes-productos-danados.update');

        // Eliminar un reporte
        Route::delete('/{id}', [ReporteProductoDañadoController::class, 'destroy'])
            ->name('reportes-productos-danados.destroy');

        // Subir imagen para un reporte
        Route::post('/{id}/imagenes', [ReporteProductoDañadoController::class, 'subirImagen'])
            ->name('reportes-productos-danados.subir-imagen');

        // Eliminar una imagen del reporte
        Route::delete('/imagenes/{imagenId}', [ReporteProductoDañadoController::class, 'eliminarImagen'])
            ->name('reportes-productos-danados.eliminar-imagen');

        // Obtener reportes de una venta específica
        Route::get('/venta/{ventaId}', [ReporteProductoDañadoController::class, 'reportesPorVenta'])
            ->name('reportes-productos-danados.por-venta');
    });
});

// ✅ NUEVA RUTA: Obtener datos completos de una entrega
Route::middleware(['auth:sanctum,web'])->get('/entregas/{id}', [EntregaController::class, 'showEntrega'])
    ->name('entregas.show');

// Rutas API para proveedores
Route::group(['prefix' => 'proveedores'], function () {
    Route::get('/', [ProveedorController::class, 'indexApi']);
    Route::post('/', [ProveedorController::class, 'storeApi']);
    Route::get('search', [ProveedorController::class, 'buscarApi']);
    Route::get('buscar', [ProveedorController::class, 'buscarApi']);
});

// ==========================================
// 🖼️ RUTAS API PARA BACKUP DE IMÁGENES
// ==========================================
Route::middleware(['auth:sanctum,web', 'platform'])->group(function () {
    Route::prefix('image-backup')->group(function () {
        // ========== DIAGNÓSTICO ==========
        // Diagnosticar problemas con backups (DEBUGGING)
        Route::get('/diagnostico/disk-space', [ImageBackupController::class, 'diagnoseDiskSpace']);

        // ========== BACKUPS COMPLETOS ==========
        // Crear backup (completo o selectivo)
        Route::post('/create', [ImageBackupController::class, 'createBackup']);

        // Restaurar backup completo
        Route::post('/restore', [ImageBackupController::class, 'restoreBackup']);

        // Listar backups disponibles (DEBE ser antes que /{backupName})
        Route::get('/list', [ImageBackupController::class, 'listBackups']);

        // Descargar un backup (DEBE ser antes que /{backupName})
        Route::get('/{backupName}/download', [ImageBackupController::class, 'downloadBackup']);

        // ========== BACKUPS POR CARPETA ==========
        // Obtener tamaños de carpetas
        Route::get('/folder/sizes', [ImageBackupController::class, 'getFolderSizes']);

        // Crear backup de una carpeta específica
        Route::post('/folder/backup', [ImageBackupController::class, 'createFolderBackup']);

        // Descargar backup de una carpeta (crea uno temporal)
        Route::post('/folder/download', [ImageBackupController::class, 'downloadFolderBackup']);

        // Restaurar una carpeta desde un backup
        Route::post('/folder/restore', [ImageBackupController::class, 'restoreFolderBackup']);

        // ========== SUBIR ARCHIVOS ==========
        // Subir un archivo ZIP de backup (método antiguo, para compatibilidad)
        Route::post('/upload', [ImageBackupController::class, 'uploadBackup']);

        // ========== SUBIDA POR PARTES (CHUNKED UPLOAD) ==========
        // Obtener información del espacio en disco
        Route::get('/disk-space', [ImageBackupController::class, 'getDiskSpace']);

        // Iniciar subida por partes
        Route::post('/chunked/start', [ImageBackupController::class, 'startChunkedUpload']);

        // Subir un chunk
        Route::post('/chunked/upload', [ImageBackupController::class, 'uploadChunk']);

        // Finalizar subida y ensamblar
        Route::post('/chunked/finish', [ImageBackupController::class, 'finishChunkedUpload']);

        // Obtener estado de upload
        Route::get('/chunked/status', [ImageBackupController::class, 'getChunkedUploadStatus']);

        // Cancelar upload
        Route::post('/chunked/cancel', [ImageBackupController::class, 'cancelChunkedUpload']);

        // ========== RUTAS CON PARÁMETROS (DEBEN IR AL FINAL) ==========
        // Obtener información de un backup específico (GET)
        Route::get('/{backupName}', [ImageBackupController::class, 'getBackupInfo']);

        // Eliminar un backup (DELETE)
        Route::delete('/{backupName}', [ImageBackupController::class, 'deleteBackup']);
    });
});

// ✅ Rutas API de auditoría de cajas (Sprint 4)
Route::middleware(['auth', 'permission:admin.auditoria'])->prefix('cajas/auditoria')->group(function () {
    Route::get('/estadisticas', [\App\Http\Controllers\AuditoriaCajaController::class, 'estadisticas'])->name('api.cajas.auditoria.estadisticas');
});

// ✅ Rutas API de gastos para chofer (Sprint 5)
Route::middleware(['auth'])->prefix('cajas/gastos')->group(function () {
    Route::post('/', [ChoferGastoController::class, 'store'])->name('api.gastos.store');
    Route::get('/', [ChoferGastoController::class, 'index'])->name('api.gastos.index');
    Route::get('/estadisticas', [ChoferGastoController::class, 'estadisticas'])->name('api.gastos.estadisticas');
    Route::delete('/{id}', [ChoferGastoController::class, 'destroy'])->name('api.gastos.destroy');
});

// ✅ Rutas API para monitoreo en tiempo real (Admin) - Sprint 6
Route::middleware(['auth', 'permission:cajas.index'])->prefix('admin/cajas')->group(function () {
    // Estado general de todas las cajas
    Route::get('/estado-general', [\App\Http\Controllers\Api\AdminCajaApiController::class, 'estadoGeneral'])
        ->name('api.admin.cajas.estado-general');

    // Alertas activas
    Route::get('/alertas', [\App\Http\Controllers\Api\AdminCajaApiController::class, 'obtenerAlertas'])
        ->name('api.admin.cajas.alertas');

    // Estadísticas del día
    Route::get('/estadisticas', [\App\Http\Controllers\Api\AdminCajaApiController::class, 'estadisticas'])
        ->name('api.admin.cajas.estadisticas');

    // Detalle en tiempo real de una caja
    Route::get('/{id}/detalle', [\App\Http\Controllers\Api\AdminCajaApiController::class, 'detalleCaja'])
        ->name('api.admin.cajas.detalle');

    // ✅ NUEVO: Cierre Diario General Manual - Consolida todas las cajas activas
    Route::post('/cierre-diario', [\App\Http\Controllers\Api\AdminCajaApiController::class, 'cierreDiarioGeneral'])
        ->name('api.admin.cajas.cierre-diario');
});

// ✅ Rutas API para gestión de cierres de caja (Workflow de Aprobación) - Sprint 7
Route::middleware(['auth', 'permission:admin.cierres.ver'])->prefix('admin/cierres')->group(function () {
    // Listar cierres pendientes de verificación
    Route::get('/pendientes', [\App\Http\Controllers\Api\AdminCajaApiController::class, 'cierresPendientes'])
        ->name('api.admin.cierres.pendientes');

    // Estadísticas de cierres del día
    Route::get('/estadisticas', [\App\Http\Controllers\Api\AdminCajaApiController::class, 'estadisticasCierres'])
        ->name('api.admin.cierres.estadisticas');

    // Consolidar un cierre (aprobar)
    Route::post('/{id}/consolidar', [\App\Http\Controllers\Api\AdminCajaApiController::class, 'consolidarCierre'])
        ->middleware('permission:admin.cierres.consolidar')
        ->name('api.admin.cierres.consolidar');

    // Rechazar un cierre
    Route::post('/{id}/rechazar', [\App\Http\Controllers\Api\AdminCajaApiController::class, 'rechazarCierre'])
        ->middleware('permission:admin.cierres.rechazar')
        ->name('api.admin.cierres.rechazar');
});

// ✅ Rutas API para gastos en tiempo real (Admin) - Sprint 6
Route::middleware(['auth', 'permission:cajas.gastos'])->prefix('admin/gastos')->group(function () {
    Route::get('/resumen', [\App\Http\Controllers\Api\AdminCajaApiController::class, 'resumenGastos'])
        ->name('api.admin.gastos.resumen');
});

// ✅ Rutas API para conciliación de cajas (Regularización Ventas vs Movimientos)
Route::middleware(['auth', 'permission:cajas.transacciones'])->prefix('conciliacion')->group(function () {
    Route::get('/dia', [\App\Http\Controllers\ConciliacionCajaController::class, 'conciliacionDelDia'])
        ->name('api.conciliacion.dia');
    Route::get('/historial', [\App\Http\Controllers\ConciliacionCajaController::class, 'historial'])
        ->name('api.conciliacion.historial');
});

// ========================================
// 📊 RUTAS API ESTADOS LOGÍSTICA (Q1 2026)
// ========================================
// Endpoints públicos para obtener estados (sin autenticación)
Route::prefix('estados')->group(function () {
    // Obtener todas las categorías disponibles
    Route::get('/categorias', [EstadoLogisticoController::class, 'categorias']);

    // Buscar estados por término
    Route::get('/buscar', [EstadoLogisticoController::class, 'buscar']);

    // Obtener transiciones válidas desde un estado (por ID)
    // IMPORTANTE: Esto debe estar ANTES de las rutas con parámetros dinámicos
    Route::get('/{estadoId}/transiciones', [EstadoLogisticoController::class, 'transicionesPorId']);

    // Obtener estados de una categoría específica
    Route::get('/{categoria}', [EstadoLogisticoController::class, 'porCategoria']);

    // Obtener un estado específico
    Route::get('/{categoria}/{codigo}', [EstadoLogisticoController::class, 'porCodigo']);

    // Obtener estadísticas de una categoría
    Route::get('/{categoria}/estadisticas', [EstadoLogisticoController::class, 'estadisticas']);

    // Obtener transiciones válidas desde un estado (por categoría y código)
    Route::get('/{categoria}/{codigo}/transiciones', [EstadoLogisticoController::class, 'transicionesDisponibles']);
});

// Obtener mapeos entre estados de diferentes categorías
Route::prefix('mapeos')->group(function () {
    Route::get('/{categoriaOrigen}/{codigoOrigen}/{categoriaDestino}', [EstadoLogisticoController::class, 'obtenerMapeo']);
});

// ==========================================
// 📋 VISITAS DE PREVENTISTAS
// ==========================================
Route::middleware(['auth:sanctum'])->prefix('visitas')->group(function () {
    Route::post('/', [\App\Http\Controllers\Api\VisitaPreventistaController::class, 'store']);
    Route::get('/', [\App\Http\Controllers\Api\VisitaPreventistaController::class, 'index']);
    Route::get('/estadisticas', [\App\Http\Controllers\Api\VisitaPreventistaController::class, 'estadisticas']);
    Route::get('/dashboard-stats', [\App\Http\Controllers\Api\VisitaPreventistaController::class, 'dashboardStats']); // ✅ NUEVO: Stats ligeras para dashboard
    Route::get('/orden-del-dia', [\App\Http\Controllers\Api\VisitaPreventistaController::class, 'ordenDelDia']); // ✅ NUEVO
    Route::get('/validar-horario', [\App\Http\Controllers\Api\VisitaPreventistaController::class, 'validarHorario']);
    Route::get('/{visita}', [\App\Http\Controllers\Api\VisitaPreventistaController::class, 'show']);
});

// ==========================================
// 📦 STOCK - IMPRESIÓN Y GESTIÓN
// ==========================================
Route::middleware(['auth:sanctum'])->prefix('stock')->group(function () {
    // POST: Preparar datos para impresión (guardan en sesión)
    Route::post('preparar-impresion', [\App\Http\Controllers\Api\StockApiController::class, 'prepararImpresion']);
    Route::post('preparar-impresion-movimientos', [\App\Http\Controllers\Api\StockApiController::class, 'prepararImpresionMovimientos']);
    Route::post('preparar-impresion-ventas', [\App\Http\Controllers\Api\StockApiController::class, 'prepararImpresionVentas']);
    Route::post('preparar-impresion-compras', [\App\Http\Controllers\Api\StockApiController::class, 'prepararImpresionCompras']);
    Route::post('preparar-impresion-productos-vendidos', [\App\Http\Controllers\Api\StockApiController::class, 'prepararImpresionProductosVendidos']);

    // GET: Obtener HTML desde sesión para imprimir
    Route::get('imprimir-ventas', [\App\Http\Controllers\Api\StockApiController::class, 'imprimirVentasDesdeSession']);
    Route::get('imprimir-movimientos', [\App\Http\Controllers\Api\StockApiController::class, 'imprimirMovimientosDesdeSession']);
    Route::get('imprimir-stock', [\App\Http\Controllers\Api\StockApiController::class, 'imprimirStockDesdeSession']);
    Route::get('imprimir-compras', [\App\Http\Controllers\Api\StockApiController::class, 'imprimirComprasDesdeSession']);
    Route::get('imprimir-productos-vendidos', [\App\Http\Controllers\Api\StockApiController::class, 'imprimirProductosVendidosDesdeSession']);

    Route::delete('productos/{id}', [\App\Http\Controllers\Api\StockApiController::class, 'destroy'])->name('stock-productos.destroy');
});

// ==========================================
// 📊 REPORTES DE VENTAS
// ==========================================
Route::middleware(['auth:sanctum'])->prefix('reportes')->group(function () {
    Route::get('productos-vendidos', [\App\Http\Controllers\Api\ApiReporteVentasController::class, 'productosVendidos'])
        ->name('api.reportes.productos-vendidos');
});

// ==========================================
// 🚨 ALERTAS Y NOTIFICACIONES
// ==========================================
Route::middleware(['auth:sanctum,web'])->group(function () {
    Route::get('/alertas/cuentas-vencidas', [AlertasController::class, 'cuentasVencidas'])
        ->name('api.alertas.cuentas-vencidas');
});

// ==========================================
// 🧺 PRESTAMOS - CANASTILLAS Y EMBASES
// ==========================================
Route::middleware(['auth:sanctum'])->group(function () {
    // Prestables (Canastillas/Embases)
    Route::prefix('prestables')->group(function () {
        // Rutas sin parámetros (van antes de las parametrizadas)
        Route::get('/', [PrestableController::class, 'index']);
        Route::get('/ajustes/historial', [PrestableController::class, 'historialAjustes']);
        Route::get('/movimientos', [PrestableController::class, 'movimientos']);

        // Rutas con parámetros
        Route::post('/', [PrestableController::class, 'store']);
        Route::get('/{prestable}', [PrestableController::class, 'show']);
        Route::put('/{prestable}', [PrestableController::class, 'update']);
        Route::delete('/{prestable}', [PrestableController::class, 'destroy']);
        Route::get('/{prestable}/stock', [PrestableController::class, 'obtenerStock']);
        Route::get('/{prestable}/disponibilidad', [PrestableController::class, 'obtenerDisponibilidad']);
        Route::post('/{prestable}/stock/incrementar', [PrestableController::class, 'incrementarStock']);
        Route::post('/{prestable}/stock/ajustar', [PrestableController::class, 'ajustarStock']);
        Route::get('/{prestable}/ajuste-documento', [PrestableController::class, 'ajusteDocumento']);

        // Stock management
        Route::get('/{prestable}/stock/detalle', [PrestableStockController::class, 'show']);
        Route::post('/{prestable}/stock/agregar-almacen', [PrestableStockController::class, 'agregarAlmacen']);
    });

    // Ventas de Prestables
    Route::prefix('prestamos-vendidos')->group(function () {
        // Rutas sin parámetros (van antes de las parametrizadas)
        Route::get('/', [PrestamoVendidoController::class, 'index']);
        Route::post('/', [PrestamoVendidoController::class, 'store']);

        // Rutas con parámetros
        Route::get('/{venta}', [PrestamoVendidoController::class, 'show']);
        Route::post('/{venta}/agregar-detalle', [PrestamoVendidoController::class, 'agregarDetalle']);
        Route::delete('/{venta}/detalles/{detalle}', [PrestamoVendidoController::class, 'eliminarDetalle']);
        Route::post('/{venta}/confirmar', [PrestamoVendidoController::class, 'confirmar']);
        Route::post('/{venta}/cancelar', [PrestamoVendidoController::class, 'cancelar']);
        Route::get('/{venta}/imprimir', [PrestamoVendidoController::class, 'imprimir']);
        Route::get('/{venta}/descargar-pdf', [PrestamoVendidoController::class, 'descargarPdf']);
    });

    // Compras de Prestables
    Route::prefix('compras-prestables')->group(function () {
        // Rutas sin parámetros (van antes de las parametrizadas)
        Route::get('/', [CompraPrestableController::class, 'index']);
        Route::post('/', [CompraPrestableController::class, 'store']);

        // Rutas con parámetros
        Route::get('/{compra}', [CompraPrestableController::class, 'showApi']);
        Route::post('/{compra}/agregar-detalle', [CompraPrestableController::class, 'agregarDetalle']);
        Route::delete('/{compra}/detalles/{detalle}', [CompraPrestableController::class, 'eliminarDetalle']);
        Route::post('/{compra}/confirmar', [CompraPrestableController::class, 'confirmar']);
        Route::post('/{compra}/cancelar', [CompraPrestableController::class, 'cancelar']);
        Route::get('/{compra}/imprimir', [CompraPrestableController::class, 'imprimir']);
    });

    // Prestable Stock Records
    Route::prefix('prestables-stock')->group(function () {
        Route::put('/{prestableStock}', [PrestableStockController::class, 'update']);
        Route::delete('/{prestableStock}', [PrestableStockController::class, 'destroy']);
    });

    // Préstamos a Clientes
    Route::prefix('prestamos-cliente')->group(function () {
        Route::get('/', [PrestamoClienteController::class, 'index']);
        Route::post('/', [PrestamoClienteController::class, 'store']);
        Route::get('/{prestamo}', [PrestamoClienteController::class, 'show']);
        Route::patch('/{prestamo}', [PrestamoClienteController::class, 'update']);
        Route::post('/{prestamo}/devolver', [PrestamoClienteController::class, 'registrarDevolucion']);
        Route::post('/{prestamo}/anular', [PrestamoClienteController::class, 'anularPrestamo']);
        Route::get('/{prestamo}/devoluciones/imprimir', [PrestamoClienteController::class, 'imprimirTodasLasDevoluciones']);
        Route::get('/{prestamo}/devoluciones/{devolucion}/imprimir', [PrestamoClienteController::class, 'imprimirDevolucion']);
        Route::get('/chofer/{choferId}/pendientes', [PrestamoClienteController::class, 'obtenerPendientesChofer']);
        Route::get('/cliente/{clienteId}/activos', [PrestamoClienteController::class, 'obtenerActivosCliente']);
    });

    // Préstamos a Proveedores
    Route::prefix('prestamos-proveedor')->group(function () {
        Route::get('/', [PrestamoProveedorController::class, 'index']);
        Route::post('/', [PrestamoProveedorController::class, 'store']);
        // Rutas específicas PRIMERO (antes de rutas con parámetros genéricos)
        Route::get('/proveedor/{proveedorId}/activos', [PrestamoProveedorController::class, 'obtenerActivosProveedor']);
        Route::get('/proveedor/{proveedorId}/deuda', [PrestamoProveedorController::class, 'obtenerDeuda']);
        // Rutas genéricas DESPUÉS
        Route::get('/{prestamo}', [PrestamoProveedorController::class, 'show']);
        Route::post('/{prestamo}/devolver', [PrestamoProveedorController::class, 'registrarDevolucion']);
        Route::post('/{prestamo}/anular', [PrestamoProveedorController::class, 'anularPrestamo']);
    });

    // Reportes de Préstamos
    Route::prefix('reportes')->group(function () {
        // Stock
        Route::get('/stock', [ReportesController::class, 'reporteStock']);
        Route::get('/stock/bajo', [ReportesController::class, 'reporteStockBajo']);
        Route::get('/stock-bajo-prestables', [ReportesController::class, 'stockBajoPrestables']);
        Route::get('/stock-prestables', [ReportesController::class, 'reporteStock']);

        // Préstamos y Devoluciones
        Route::get('/prestamos/cliente', [ReportesController::class, 'reportePrestamosCliente']);
        Route::get('/devoluciones/pendientes', [ReportesController::class, 'reporteDevolucionesPendientes']);
        Route::get('/devoluciones-pendientes', [ReportesController::class, 'reporteDevolucionesPendientes']);

        // Proveedores y Resumen
        Route::get('/proveedor/deudas', [ReportesController::class, 'reporteDeudas']);
        Route::get('/deudas-proveedores', [ReportesController::class, 'reporteDeudas']);
        Route::get('/resumen-prestamos', [ReportesController::class, 'reporteResumen']);

        // ✨ NUEVO: Reportes Consolidados (stock por almacén + mezcla inteligente)
        Route::prefix('prestables')->group(function () {
            Route::get('/stock-detalle', [\App\Http\Controllers\Prestamos\ReportesConsolidadosController::class, 'stockDetallado']);
            Route::get('/stock-por-almacen', [\App\Http\Controllers\Prestamos\ReportesConsolidadosController::class, 'stockPorAlmacen']);
            Route::get('/deuda-proveedores', [\App\Http\Controllers\Prestamos\ReportesConsolidadosController::class, 'deudaProveedores']);
            Route::get('/resumen-general', [\App\Http\Controllers\Prestamos\ReportesConsolidadosController::class, 'resumenGeneral']);
        });
    });
});

// ==========================================
// 🧪 TEST: CIERRE CAJA SERVICE (Sin Middleware)
// ==========================================
Route::get('/test/cajas/{aperturaCaja}/datos-cierre', function (\App\Models\AperturaCaja $aperturaCaja) {
    try {
        $cierreCajaService = new \App\Services\CierreCajaService();
        $datos = $cierreCajaService->calcularDatos($aperturaCaja);

        return response()->json([
            'success' => true,
            'apertura_id' => $aperturaCaja->id,
            'caja_nombre' => $aperturaCaja->caja->nombre,
            'usuario' => $aperturaCaja->usuario->name,
            'data' => [
                'sumatoria_ventas_total' => (float) ($datos['sumatorialVentas'] ?? 0),
                'sumatoria_ventas_efectivo' => (float) ($datos['sumatorialVentasEfectivo'] ?? 0),
                'sumatoria_ventas_credito' => (float) ($datos['sumatorialVentasCredito'] ?? 0),
                'sumatoria_ventas_anuladas' => (float) ($datos['sumatorialVentasAnuladas'] ?? 0),
                'sumatoria_gastos' => (float) ($datos['sumatorialGastos'] ?? 0),
                'sumatoria_pagos_sueldo' => (float) ($datos['sumatorialPagosSueldo'] ?? 0),
                'sumatoria_anticipos' => (float) ($datos['sumatorialAnticipos'] ?? 0),
                'sumatoria_anulaciones' => (float) ($datos['sumatorialAnulaciones'] ?? 0),
                'efectivo_esperado' => $datos['efectivoEsperado'] ?? [],
                'movimientos_agrupados' => collect($datos['movimientosAgrupados'] ?? [])
                    ->map(fn($items, $tipo) => [
                        'tipo' => $tipo,
                        'total' => (float) $items->sum('monto'),
                        'cantidad' => (int) $items->count(),
                    ])
                    ->values()
                    ->toArray(),
                'ventasPorTipoPago' => $datos['ventasPorTipoPago'] ?? [],
                'sumatoriasVentasPorTipoPago' => $datos['sumatoriasVentasPorTipoPago'] ?? [],
                'ventasPorEstado' => $datos['ventasPorEstado'] ?? [],
                'total_ingresos' => (float) ($datos['totalIngresos'] ?? 0),
                'total_egresos' => (float) ($datos['totalEgresos'] ?? 0),
            ],
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage(),
        ], 404);
    }
});

// ✨ NUEVO: Rutas para productos de comida/helados
Route::prefix('productos-comida')->group(function () {
    Route::get('/', [\App\Http\Controllers\Api\AdicionalesProductoController::class, 'productosComida']);
    Route::get('/{producto}/adicionales', [\App\Http\Controllers\Api\AdicionalesProductoController::class, 'obtenerPorProducto']);
    Route::post('/adicionales', [\App\Http\Controllers\Api\AdicionalesProductoController::class, 'store']);
    Route::patch('/adicionales/{adicional}', [\App\Http\Controllers\Api\AdicionalesProductoController::class, 'update']);
    Route::delete('/adicionales/{adicional}', [\App\Http\Controllers\Api\AdicionalesProductoController::class, 'destroy']);
});

// ✨ NUEVO: Ruta para crear ventas de comidas/helados
Route::post('/ventas-comidas', [\App\Http\Controllers\Api\VentasComidasController::class, 'store']);
