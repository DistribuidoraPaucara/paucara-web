<?php

use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\EmpresaController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (\Illuminate\Support\Facades\Auth::check()) {
        return redirect()->route('dashboard-redirect');
    }

    return redirect()->route('login');
})->name('home');

// Ruta de prueba para verificar CSRF token
Route::post('/test-csrf', function () {
    return response()->json(['message' => 'CSRF token is valid', 'success' => true]);
})->name('test.csrf');

// Ruta de prueba para verificar logos
Route::get('/test-logo', function () {
    $empresa = \App\Models\Empresa::find(1);
    return view('test-logo', ['empresa' => $empresa]);
})->name('test.logo');

// Rutas públicas para compartir ventas con clientes
Route::prefix('venta')->name('venta.')->group(function () {
    Route::get('preview/{token}', [App\Http\Controllers\VentaPublicController::class, 'preview'])->name('preview');
    Route::get('download/{token}', [App\Http\Controllers\VentaPublicController::class, 'show'])->name('download');
});

// 🌐 NUEVA: Página pública de precios y catálogo
Route::get('/public/precios', [App\Http\Controllers\PublicStockController::class, 'precios'])->name('public.precios');

// 🌐 NUEVA: Página pública de precios CON STOCK visible
Route::get('/public/precios-stock', [App\Http\Controllers\PublicStockController::class, 'preciosConStock'])->name('public.precios-stock');

// ✅ ACTUALIZADO: Agregado middleware 'platform' para validar acceso a plataforma web
Route::middleware(['auth', 'verified', 'platform'])->group(function () {
    Route::get('dashboard', [App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

    // API routes para el dashboard
    Route::prefix('api/dashboard')->group(function () {
        Route::get('metricas', [App\Http\Controllers\DashboardController::class, 'metricas'])->name('api.dashboard.metricas');
        Route::get('graficos', [App\Http\Controllers\DashboardController::class, 'graficos'])->name('api.dashboard.graficos');
        Route::get('productos-mas-vendidos', [App\Http\Controllers\DashboardController::class, 'productosMasVendidos'])->name('api.dashboard.productos-mas-vendidos');
        Route::get('alertas-stock', [App\Http\Controllers\DashboardController::class, 'alertasStock'])->name('api.dashboard.alertas-stock');
        Route::get('ventas-por-canal', [App\Http\Controllers\DashboardController::class, 'ventasPorCanal'])->name('api.dashboard.ventas-por-canal');
    });

    // API routes para búsqueda de clientes
    Route::prefix('api/clientes')->group(function () {
        Route::get('search', [App\Http\Controllers\ClienteController::class, 'search'])->name('api.clientes.search');
    });

    // Incluir rutas de roles
    require __DIR__ . '/roles.php';

    Route::resource('categorias', CategoriaController::class)->middleware('permission:categorias.manage');
    Route::resource('marcas', \App\Http\Controllers\MarcaController::class)->middleware('permission:marcas.manage');
    Route::resource('almacenes', \App\Http\Controllers\AlmacenController::class)->middleware('permission:almacenes.manage');
    Route::resource('sectores', \App\Http\Controllers\SectorController::class)->middleware('permission:sectores.manage');
    Route::resource('localidades', \App\Http\Controllers\LocalidadController::class)->middleware('permission:localidades.manage');
    Route::get('localidades/api/active', [\App\Http\Controllers\LocalidadController::class, 'getActiveLocalidades'])->name('localidades.api.active');

    // Incluir rutas de configuración global
    require __DIR__ . '/configuracion.php';

    // Rutas de empresas
    Route::resource('empresas', EmpresaController::class)->middleware('permission:empresas.manage');

    Route::resource('proveedores', \App\Http\Controllers\ProveedorController::class)->middleware('permission:proveedores.manage');

    // ✅ ACTUALIZADO: Rutas de clientes protegidas por ClientePolicy
    // La autorización se realiza en el controlador mediante $this->authorize()
    Route::resource('clientes', \App\Http\Controllers\ClienteController::class);

    // Rutas para fotos de lugar de clientes
    // ✅ ACTUALIZADO: Protegidas por ClientePolicy (en el controlador)
    Route::get('clientes/{cliente}/fotos', [\App\Http\Controllers\FotoLugarClienteController::class, 'index'])->name('clientes.fotos.index');
    Route::get('clientes/{cliente}/fotos/create', [\App\Http\Controllers\FotoLugarClienteController::class, 'create'])->name('clientes.fotos.create');
    Route::post('clientes/{cliente}/fotos', [\App\Http\Controllers\FotoLugarClienteController::class, 'store'])->name('clientes.fotos.store');
    Route::get('clientes/{cliente}/fotos/{foto}', [\App\Http\Controllers\FotoLugarClienteController::class, 'show'])->name('clientes.fotos.show');
    Route::get('clientes/{cliente}/fotos/{foto}/edit', [\App\Http\Controllers\FotoLugarClienteController::class, 'edit'])->name('clientes.fotos.edit');
    Route::put('clientes/{cliente}/fotos/{foto}', [\App\Http\Controllers\FotoLugarClienteController::class, 'update'])->name('clientes.fotos.update');
    Route::delete('clientes/{cliente}/fotos/{foto}', [\App\Http\Controllers\FotoLugarClienteController::class, 'destroy'])->name('clientes.fotos.destroy');

    // Rutas para crédito de clientes
    Route::get('clientes/{cliente}/credito', function (\App\Models\Cliente $cliente) {
        return \Inertia\Inertia::render('clientes/credito', [
            'clienteId' => $cliente->id,
            'tipos_pago' => \App\Models\TipoPago::select('id', 'nombre', 'codigo')->where('codigo', '!=', 'CREDITO')->get(),
        ]);
    })->name('clientes.credito');

    // ✅ FASE 3: Ruta para página principal de créditos del usuario actual
    Route::get('creditos', function () {
        return \Inertia\Inertia::render('creditos/index');
    })->name('creditos.index');

    // ✅ NUEVO: Ruta para importar créditos históricos (solo Admin)
    Route::get('admin/creditos/importar', function () {
        return \Inertia\Inertia::render('admin/creditos/importar');
    })->middleware('permission:admin.creditos.importar')->name('admin.creditos.importar');

    // ✅ NUEVO: Ruta para crear crédito manual (solo Admin)
    Route::get('admin/creditos/crear', [\App\Http\Controllers\CreditoController::class, 'create'])
        ->middleware('permission:admin.creditos.importar')->name('admin.creditos.crear');

    // ⚠️ RUTAS ESPECÍFICAS DEBEN IR ANTES DEL RESOURCE
    // Rutas para carga masiva de productos
    Route::get('productos/carga-masiva', function () {
        return \Inertia\Inertia::render('productos/carga-masiva', [
            'categorias' => \App\Models\Categoria::where('activo', true)->get(['id', 'nombre'])->toArray(),
            'marcas' => \App\Models\Marca::where('activo', true)->get(['id', 'nombre'])->toArray(),
            'unidades' => \App\Models\UnidadMedida::where('activo', true)->get(['id', 'codigo', 'nombre'])->toArray(),
            'almacenes' => \App\Models\Almacen::where('activo', true)->orderBy('id')->get(['id', 'nombre'])->toArray(),
        ]);
    })->middleware('permission:productos.manage')->name('productos.carga-masiva');
    Route::get('productos/historial-cargas', fn() => \Inertia\Inertia::render('productos/historial-cargas'))->middleware('permission:productos.manage')->name('productos.historial-cargas');
    Route::get('productos/crear/moderno', [\App\Http\Controllers\ProductoController::class, 'createModerno'])->middleware('permission:productos.manage')->name('productos.create.moderno');
    Route::get('productos/paginados/listar', [\App\Http\Controllers\ProductoController::class, 'getPaginados'])->middleware('permission:productos.manage')->name('productos.paginados');
    Route::get('productos/filtros/datos', [\App\Http\Controllers\ProductoController::class, 'getFiltrosData'])->middleware('permission:productos.manage')->name('productos.filtros-data');

    // Rutas para combos (productos virtuales que agrupan otros productos)
    Route::get('combos/{combo}/capacidad', [\App\Http\Controllers\ComboController::class, 'capacidad'])->middleware('permission:productos.manage')->name('combos.capacidad');
    Route::get('combos/{combo}/capacidad-detalles', [\App\Http\Controllers\ComboController::class, 'capacidadDetalles'])->middleware('permission:productos.manage')->name('combos.capacidad-detalles');
    Route::resource('combos', \App\Http\Controllers\ComboController::class)->middleware('permission:productos.manage');

    // Resource route DESPUÉS de las rutas específicas
    Route::resource('productos', \App\Http\Controllers\ProductoController::class)->except(['show'])->middleware('permission:productos.manage');
    Route::get('productos/{producto}/historial-precios', [\App\Http\Controllers\ProductoController::class, 'historialPrecios'])->middleware('permission:productos.manage')->name('productos.historial-precios');

    // Rutas para gestión de códigos de barra
    Route::resource('codigos-barra', \App\Http\Controllers\CodigoBarraController::class)->middleware('permission:productos.manage');
    Route::put('codigos-barra/{codigo_barra}/principal', [\App\Http\Controllers\CodigoBarraController::class, 'marcarPrincipal'])->middleware('permission:productos.manage')->name('codigos-barra.principal');
    Route::get('api/codigos-barra/buscar/{codigo}', [\App\Http\Controllers\CodigoBarraController::class, 'buscarPorCodigo'])->name('api.codigos-barra.buscar');
    Route::get('api/codigos-barra/validar/{codigo}', [\App\Http\Controllers\CodigoBarraController::class, 'validar'])->name('api.codigos-barra.validar');
    Route::post('api/codigos-barra/generar', [\App\Http\Controllers\CodigoBarraController::class, 'generar'])->name('api.codigos-barra.generar');
    Route::get('api/codigos-barra/producto/{producto}', [\App\Http\Controllers\CodigoBarraController::class, 'codigosProducto'])->name('api.codigos-barra.producto');

    // APIs avanzadas de códigos de barra (caché, imágenes, estadísticas)
    Route::prefix('api/codigos-barra')->name('api.codigos-barra.')->group(function () {
        Route::get('imagen/{codigo}', [\App\Http\Controllers\CodigoBarraController::class, 'obtenerImagen'])->name('imagen');
        Route::get('imagen-svg/{codigo}', [\App\Http\Controllers\CodigoBarraController::class, 'obtenerImagenSVG'])->name('imagen-svg');
        Route::get('buscar-rapido/{codigo}', [\App\Http\Controllers\CodigoBarraController::class, 'buscarProductoPorCodigoRapido'])->name('buscar-rapido');
        Route::post('precalentar-cache', [\App\Http\Controllers\CodigoBarraController::class, 'precalentarCache'])->middleware('permission:productos.manage')->name('precalentar-cache');
        Route::get('estadisticas-cache', [\App\Http\Controllers\CodigoBarraController::class, 'estadisticasCache'])->name('estadisticas-cache');
    });

    // Reportes de códigos de barra
    Route::prefix('reportes/codigos-barra')->name('reportes.codigos-barra.')->middleware('permission:reportes.view')->group(function () {
        Route::get('productos-sin-codigo', [\App\Http\Controllers\ReporteCodigosBarraController::class, 'productosSinCodigo'])->name('productos-sin-codigo');
        Route::get('duplicados-inactivos', [\App\Http\Controllers\ReporteCodigosBarraController::class, 'codigosDuplicadosInactivos'])->name('duplicados-inactivos');
        Route::get('historial-cambios', [\App\Http\Controllers\ReporteCodigosBarraController::class, 'historialCambios'])->name('historial-cambios');
        Route::get('descargar/productos-sin-codigo', [\App\Http\Controllers\ReporteCodigosBarraController::class, 'descargarProductosSinCodigo'])->name('descargar-productos-sin-codigo');
        Route::get('descargar/historial', [\App\Http\Controllers\ReporteCodigosBarraController::class, 'descargarHistorial'])->name('descargar-historial');
    });

    // ✅ NUEVO: Impresión de Reportes (con filtros de fecha)
    Route::get('reportes/impresion', [\App\Http\Controllers\ReporteController::class, 'impresionReportes'])
        ->name('reportes.impresion')
        ->middleware('permission:reportes.view');

    Route::resource('unidades', \App\Http\Controllers\UnidadMedidaController::class)->parameters(['unidades' => 'unidad'])->middleware('permission:unidades.manage');

    // Rutas para gestión de tipos de precio
    Route::resource('tipos-precio', \App\Http\Controllers\TipoPrecioController::class)->parameters(['tipos-precio' => 'tipoPrecio'])->middleware('permission:tipos-precio.manage');
    Route::patch('tipos-precio/{tipoPrecio}/toggle-activo', [\App\Http\Controllers\TipoPrecioController::class, 'toggleActivo'])->middleware('permission:tipos-precio.manage')->name('tipos-precio.toggle-activo');

    // ✅ NUEVO: Rutas para gestión de rangos de precios por cantidad
    Route::get('precio-rango', [\App\Http\Controllers\PrecioRangoController::class, 'index'])->middleware('permission:productos.manage')->name('precio-rango.index');
    Route::get('precio-rango/create', [\App\Http\Controllers\PrecioRangoController::class, 'create'])->middleware('permission:productos.manage')->name('precio-rango.create');
    Route::get('precio-rango/import-csv', [\App\Http\Controllers\PrecioRangoController::class, 'importCsv'])->middleware('permission:productos.manage')->name('precio-rango.import-csv');
    Route::get('precio-rango/{rango}/edit', [\App\Http\Controllers\PrecioRangoController::class, 'edit'])->middleware('permission:productos.manage')->name('precio-rango.edit');

    // Rutas para gestión de monedas
    Route::resource('monedas', \App\Http\Controllers\MonedaController::class)->middleware('permission:monedas.manage');
    Route::get('monedas/{moneda}/activas', [\App\Http\Controllers\MonedaController::class, 'activas'])->middleware('permission:monedas.manage')->name('monedas.activas');
    Route::post('monedas/convertir', [\App\Http\Controllers\MonedaController::class, 'convertir'])->middleware('permission:monedas.manage')->name('monedas.convertir');
    Route::patch('monedas/{moneda}/toggle-activo', [\App\Http\Controllers\MonedaController::class, 'toggleActivo'])->middleware('permission:monedas.manage')->name('monedas.toggle-activo');
    Route::patch('monedas/{moneda}/establecer-base', [\App\Http\Controllers\MonedaController::class, 'establecerBase'])->middleware('permission:monedas.manage')->name('monedas.establecer-base');

    // Rutas para gestión de tipos de pago
    Route::resource('tipos-pago', \App\Http\Controllers\TipoPagoController::class)->parameters(['tipos-pago' => 'tipoPago'])->middleware('permission:tipos-pago.manage');

    // Rutas para gestión de tipos de documento
    Route::resource('tipos-documento', \App\Http\Controllers\TipoDocumentoController::class)->parameters(['tipos-documento' => 'tipoDocumento'])->middleware('permission:tipos_documento.manage');

    // Rutas para backup de imágenes
    Route::get('admin/image-backup', fn() => \Inertia\Inertia::render('admin/image-backup'))->middleware('permission:admin.image-backup.manage')->name('admin.image-backup');

    // ✅ NUEVO: Reportes de Productos Dañados
    Route::get('admin/reportes-productos-danados', [\App\Http\Controllers\ReporteProductoDanadoAdminController::class, 'index'])->middleware('permission:admin')->name('admin.reportes-productos-danados.index');

    // ✅ NUEVO: Banners Publicitarios
    Route::prefix('admin/banners-publicitarios')->middleware('permission:admin')->group(function () {
        Route::get('/', [\App\Http\Controllers\BannerPublicitarioAdminController::class, 'index'])->name('admin.banners-publicitarios.index');
        Route::post('/', [\App\Http\Controllers\BannerPublicitarioAdminController::class, 'store'])->name('admin.banners-publicitarios.store');
        Route::post('/{banner}', [\App\Http\Controllers\BannerPublicitarioAdminController::class, 'update'])->name('admin.banners-publicitarios.update');
        Route::patch('/{banner}/toggle', [\App\Http\Controllers\BannerPublicitarioAdminController::class, 'toggleActivo'])->name('admin.banners-publicitarios.toggle');
        Route::delete('/{banner}', [\App\Http\Controllers\BannerPublicitarioAdminController::class, 'destroy'])->name('admin.banners-publicitarios.destroy');
        Route::post('/actualizar-orden', [\App\Http\Controllers\BannerPublicitarioAdminController::class, 'actualizarOrden'])->name('admin.banners-publicitarios.actualizar-orden');
    });

    // ✅ Categorías de Cliente
    Route::get('admin/categorias-cliente', [\App\Http\Controllers\CategoriaClienteController::class, 'index'])
        ->middleware('permission:admin')
        ->name('admin.categorias-cliente.index');

    // Rutas para gestión de módulos del sidebar
    Route::get('modulos-sidebar', [\App\Http\Controllers\ModuloSidebarController::class, 'index'])->name('modulos-sidebar.index');
    Route::get('modulos-sidebar/create', [\App\Http\Controllers\ModuloSidebarController::class, 'create'])->middleware('permission:admin.config')->name('modulos-sidebar.create');
    Route::post('modulos-sidebar', [\App\Http\Controllers\ModuloSidebarController::class, 'store'])->middleware('permission:admin.config')->name('modulos-sidebar.store');
    Route::get('modulos-sidebar/{moduloSidebar}', [\App\Http\Controllers\ModuloSidebarController::class, 'show'])->name('modulos-sidebar.show');
    Route::get('modulos-sidebar/{moduloSidebar}/edit', [\App\Http\Controllers\ModuloSidebarController::class, 'edit'])->middleware('permission:admin.config')->name('modulos-sidebar.edit');
    Route::match(['PUT', 'PATCH'], 'modulos-sidebar/{moduloSidebar}', [\App\Http\Controllers\ModuloSidebarController::class, 'update'])->middleware('permission:admin.config')->name('modulos-sidebar.update');
    Route::delete('modulos-sidebar/{moduloSidebar}', [\App\Http\Controllers\ModuloSidebarController::class, 'destroy'])->middleware('permission:admin.config')->name('modulos-sidebar.destroy');

    // ✅ MOVIDAS A api.php - Las rutas API deben estar en api.php para mejor organización
    // Route::get('api/modulos-sidebar', ...) → Ahora en api.php
    // Route::get('api/modulos-sidebar/permisos/disponibles', ...) → Ahora en api.php
    // Route::get('api/modulos-sidebar/matriz-acceso', ...) → Ahora en api.php
    // Route::get('api/modulos-sidebar/roles', ...) → Ahora en api.php
    // Route::get('api/modulos-sidebar/preview/{rolName}', ...) → Ahora en api.php
    // Route::get('api/modulos-sidebar/historial', ...) → Ahora en api.php
    // Route::post('api/modulos-sidebar/matriz-acceso/bulk-update', ...) → Ahora en api.php

    Route::post('modulos-sidebar/actualizar-orden', [\App\Http\Controllers\ModuloSidebarController::class, 'actualizarOrden'])->middleware('permission:admin.config')->name('modulos-sidebar.actualizar-orden');
    Route::patch('modulos-sidebar/{moduloSidebar}/toggle-activo', [\App\Http\Controllers\ModuloSidebarController::class, 'toggleActivo'])->middleware('permission:admin.config')->name('modulos-sidebar.toggle-activo');
    Route::post('modulos-sidebar/bulk-update', [\App\Http\Controllers\ModuloSidebarController::class, 'bulkUpdate'])->middleware('permission:admin.config')->name('modulos-sidebar.bulk-update');

    // Rutas para gestión de usuarios, roles y permisos
    Route::resource('usuarios', \App\Http\Controllers\UserController::class);
    Route::post('usuarios/{usuario}/assign-role', [\App\Http\Controllers\UserController::class, 'assignRole'])->name('usuarios.assign-role');
    Route::delete('usuarios/{usuario}/remove-role', [\App\Http\Controllers\UserController::class, 'removeRole'])->name('usuarios.remove-role');
    Route::post('usuarios/{usuario}/assign-permission', [\App\Http\Controllers\UserController::class, 'assignPermission'])->name('usuarios.assign-permission');
    Route::delete('usuarios/{usuario}/remove-permission', [\App\Http\Controllers\UserController::class, 'removePermission'])->name('usuarios.remove-permission');
    Route::patch('usuarios/{usuario}/toggle-status', [\App\Http\Controllers\UserController::class, 'toggleStatus'])->name('usuarios.toggle-status');

    Route::resource('roles', \App\Http\Controllers\RoleController::class);
    Route::post('roles/{role}/assign-permission', [\App\Http\Controllers\RoleController::class, 'assignPermission'])->name('roles.assign-permission');
    Route::delete('roles/{role}/remove-permission', [\App\Http\Controllers\RoleController::class, 'removePermission'])->name('roles.remove-permission');

    // Rutas avanzadas de Roles - Sistema C
    Route::get('roles-data/templates', [\App\Http\Controllers\RoleController::class, 'getTemplates'])->name('roles.templates');
    Route::post('roles-data/templates', [\App\Http\Controllers\RoleController::class, 'createTemplate'])->name('roles.create-template');
    Route::post('roles/{role}/apply-template', [\App\Http\Controllers\RoleController::class, 'applyTemplate'])->name('roles.apply-template');
    Route::post('roles/{role}/copy-from', [\App\Http\Controllers\RoleController::class, 'copyFromRole'])->name('roles.copy-from');
    Route::post('roles-data/compare', [\App\Http\Controllers\RoleController::class, 'compareRoles'])->name('roles.compare');
    Route::get('roles/{role}/audit', [\App\Http\Controllers\RoleController::class, 'getAudit'])->name('roles.audit');
    Route::get('roles-data/permissions-grouped', [\App\Http\Controllers\RoleController::class, 'getPermissionsGrouped'])->name('roles.permissions-grouped');

    // ✅ PANEL DE GESTIÓN DE PERMISOS
    Route::prefix('permisos')->name('permisos.')->group(function () {
        // Ver todos los permisos
        Route::get('/', [\App\Http\Controllers\PermissionController::class, 'index'])
            ->middleware('permission:permissions.index')
            ->name('index');

        // Editar permisos de usuario
        Route::get('usuario/{user}/editar', [\App\Http\Controllers\PermissionController::class, 'editarUsuario'])
            ->middleware('permission:usuarios.assign-permission')
            ->name('usuario.editar');
        Route::patch('usuario/{user}', [\App\Http\Controllers\PermissionController::class, 'actualizarUsuario'])
            ->middleware('permission:usuarios.assign-permission')
            ->name('usuario.actualizar');

        // Editar permisos de rol
        Route::get('rol/{role}/editar', [\App\Http\Controllers\PermissionController::class, 'editarRol'])
            ->middleware('permission:roles.assign-permission')
            ->name('rol.editar');
        Route::patch('rol/{role}', [\App\Http\Controllers\PermissionController::class, 'actualizarRol'])
            ->middleware('permission:roles.assign-permission')
            ->name('rol.actualizar');
    });

    // Rutas para gestión de empleados
    Route::resource('empleados', \App\Http\Controllers\EmpleadoController::class);
    Route::patch('empleados/{empleado}/toggle-estado', [\App\Http\Controllers\EmpleadoController::class, 'toggleEstado'])->name('empleados.toggle-estado');
    Route::patch('empleados/{empleado}/toggle-acceso-sistema', [\App\Http\Controllers\EmpleadoController::class, 'toggleAccesoSistema'])->name('empleados.toggle-acceso-sistema');
    Route::post('empleados/crear-rapido', [\App\Http\Controllers\EmpleadoController::class, 'crearEmpleadoRapido'])->name('empleados.crear-rapido');

    // Rutas para datos de selects en formularios de empleados
    Route::get('empleados-data/departamentos', [\App\Http\Controllers\EmpleadoController::class, 'getDepartamentos'])->name('empleados.data.departamentos');
    Route::get('empleados-data/tipos-contrato', [\App\Http\Controllers\EmpleadoController::class, 'getTiposContrato'])->name('empleados.data.tipos-contrato');
    Route::get('empleados-data/estados', [\App\Http\Controllers\EmpleadoController::class, 'getEstados'])->name('empleados.data.estados');
    Route::get('empleados-data/supervisores', [\App\Http\Controllers\EmpleadoController::class, 'getSupervisores'])->name('empleados.data.supervisores');
    Route::get('empleados-data/roles', [\App\Http\Controllers\EmpleadoController::class, 'getRoles'])->name('empleados.data.roles');
    Route::post('empleados-data/rol-sugerido', [\App\Http\Controllers\EmpleadoController::class, 'getRolSugeridoPorCargo'])->name('empleados.data.rol-sugerido');

    // Rutas adicionales para módulo de compras (ANTES de resource para evitar conflictos)
    Route::prefix('compras')->name('compras.')->group(function () {
        // Gestión de Cuentas por Pagar
        Route::get('cuentas-por-pagar', [\App\Http\Controllers\CuentaPorPagarController::class, 'index'])->name('cuentas-por-pagar.index');
        Route::get('cuentas-por-pagar/export', [\App\Http\Controllers\CuentaPorPagarController::class, 'export'])->name('cuentas-por-pagar.export');
        Route::get('cuentas-por-pagar/{cuenta}/show', [\App\Http\Controllers\CuentaPorPagarController::class, 'show'])->name('cuentas-por-pagar.show');
        Route::patch('cuentas-por-pagar/{cuenta}/estado', [\App\Http\Controllers\CuentaPorPagarController::class, 'actualizarEstado'])->name('cuentas-por-pagar.actualizar-estado');
        Route::post('cuentas-por-pagar/{cuentaPorPagar}/registrar-pago', [\App\Http\Controllers\CuentaPorPagarController::class, 'registrarPago'])->name('cuentas-por-pagar.registrar-pago');
        Route::post('cuentas-por-pagar/{cuentaPorPagar}/anular-pago/{pago}', [\App\Http\Controllers\CuentaPorPagarController::class, 'anularPago'])->name('cuentas-por-pagar.anular-pago');
        Route::get('cuentas-por-pagar/{cuentaPorPagar}/imprimir-ticket-80', [\App\Http\Controllers\CuentaPorPagarController::class, 'imprimirTicket80'])->name('cuentas-por-pagar.imprimir-ticket-80');

        // Sistema de Pagos
        Route::get('pagos', [\App\Http\Controllers\PagoController::class, 'index'])->name('pagos.index');
        Route::get('pagos/create', [\App\Http\Controllers\PagoController::class, 'create'])->name('pagos.create');
        Route::post('pagos', [\App\Http\Controllers\PagoController::class, 'store'])->name('pagos.store');
        Route::get('pagos/{pago}', [\App\Http\Controllers\PagoController::class, 'show'])->name('pagos.show');
        Route::get('pagos/{pago}/imprimir', [\App\Http\Controllers\PagoController::class, 'imprimir'])->name('pagos.imprimir');
        Route::delete('pagos/{pago}', [\App\Http\Controllers\PagoController::class, 'destroy'])->name('pagos.destroy');
        Route::get('pagos/export', [\App\Http\Controllers\PagoController::class, 'export'])->name('pagos.export');

        // Gestión de Lotes y Vencimientos
        Route::get('lotes-vencimientos', [\App\Http\Controllers\LoteVencimientoController::class, 'index'])->name('lotes-vencimientos.index');
        Route::patch('lotes-vencimientos/{lote}/actualizar-estado', [\App\Http\Controllers\LoteVencimientoController::class, 'actualizarEstado'])->name('lotes-vencimientos.actualizar-estado');
        Route::patch('lotes-vencimientos/{lote}/cantidad', [\App\Http\Controllers\LoteVencimientoController::class, 'actualizarCantidad'])->name('lotes-vencimientos.actualizar-cantidad');
        Route::get('lotes-vencimientos/export', [\App\Http\Controllers\LoteVencimientoController::class, 'export'])->name('lotes-vencimientos.export');

        // Reportes Específicos
        Route::get('reportes', [\App\Http\Controllers\ReporteComprasController::class, 'index'])->name('reportes.index');
        Route::get('reportes/export', [\App\Http\Controllers\ReporteComprasController::class, 'export'])->name('reportes.export');
        Route::get('reportes/export-pdf', [\App\Http\Controllers\ReporteComprasController::class, 'exportPdf'])->name('reportes.export-pdf');
    });

    // ==========================================
    // 📦 COMPRAS - IMPRESIÓN (ANTES del resource para evitar conflictos)
    // ==========================================
    Route::prefix('compras')->name('compras.')->group(function () {
        Route::get('imprimir', [\App\Http\Controllers\ImpresionComprasController::class, 'imprimir'])->name('imprimir');
    });

    // Rutas para gestión de compras (después de rutas específicas para evitar conflictos)
    // ✅ NUEVO: Ruta para anular compras
    Route::post('compras/{compra}/anular', [\App\Http\Controllers\CompraController::class, 'anular'])->name('compras.anular');

    Route::resource('compras', \App\Http\Controllers\CompraController::class)->except(['destroy']);

    // Keep nested details routes
    Route::resource('compras.detalles', \App\Http\Controllers\DetalleCompraController::class)->shallow();

    // ==========================================
    // RUTAS DE IMPRESIÓN - COMPRAS (INDIVIDUAL)
    // ==========================================
    Route::prefix('compras')->name('compras.')->group(function () {
        Route::get('{compra}/imprimir', [\App\Http\Controllers\ImpresionComprasController::class, 'imprimirIndividual'])->name('imprimir-compra');
        Route::get('{compra}/preview', [\App\Http\Controllers\CompraController::class, 'previewCompra'])->name('preview');
        Route::get('{compra}/exportar-excel', [\App\Http\Controllers\CompraController::class, 'exportarExcel'])->name('exportar-excel');
        Route::get('{compra}/exportar-pdf', [\App\Http\Controllers\CompraController::class, 'exportarPdf'])->name('exportar-pdf');
    });

    // ==========================================
    // ✨ RUTAS PARA GESTIÓN DE PRECIOS
    // ==========================================
    Route::get('precios', [\App\Http\Controllers\PrecioController::class, 'index'])->middleware('permission:precios.index')->name('precios.management');

    // Rutas para gestión de ventas
    // ✅ Ruta específica para verificar caja abierta (ANTES del resource para evitar conflictos)
    Route::get('ventas/check-caja-abierta', [\App\Http\Controllers\VentaController::class, 'checkCajaAbierta'])->name('ventas.check-caja-abierta');

    // ✅ Rutas para cuentas por cobrar
    Route::get('ventas/cuentas-por-cobrar/check-caja-abierta', [\App\Http\Controllers\CuentaPorCobrarController::class, 'checkCajaAbierta'])->name('cuentas-por-cobrar.check-caja-abierta');
    Route::post('ventas/cuentas-por-cobrar/{cuentaPorCobrar}/registrar-pago', [\App\Http\Controllers\CuentaPorCobrarController::class, 'registrarPago'])->name('cuentas-por-cobrar.registrar-pago');
    Route::post('ventas/cuentas-por-cobrar/{cuentaPorCobrar}/anular-pago/{pago}', [\App\Http\Controllers\CuentaPorCobrarController::class, 'anularPago'])->name('cuentas-por-cobrar.anular-pago');

    // ✅ NUEVO: Aplicar middleware CheckCajaAbierta para validar que hay caja abierta
    // Excluir 'show' porque lo definiremos después de las rutas específicas
    Route::resource('ventas', \App\Http\Controllers\VentaController::class)->except(['show'])->middleware('caja.abierta');

    // ✨ NUEVO: Ruta para interfaz de venta de comidas/helados
    Route::get('ventas-comidas', function () {
        $clientes = \App\Models\Cliente::where('activo', true)
            ->select('id', 'nombre', 'nit')
            ->orderBy('nombre')
            ->get();

        $tiposPago = \App\Models\TipoPago::where('activo', true)
            ->select('id', 'nombre', 'codigo')
            ->orderBy('nombre')
            ->get();

        return inertia('VentasComidas', [
            'clientes' => $clientes,
            'tiposPago' => $tiposPago,
            'auth' => ['user' => auth()->user()],
        ]);
    })->name('ventas-comidas.index')->middleware('caja.abierta');

    // ==========================================
    // RUTAS DE IMPRESIÓN - VENTAS
    // ==========================================
    // ✅ NUEVAS RUTAS: Stock / Inventario - Exportación
    Route::prefix('stock')->name('stock.')->group(function () {
        Route::get('{stock}/exportar-excel', [\App\Http\Controllers\InventarioController::class, 'exportarExcel'])->name('exportar-excel')->middleware('permission:inventario.dashboard');
        Route::get('{stock}/exportar-pdf', [\App\Http\Controllers\InventarioController::class, 'exportarPdf'])->name('exportar-pdf')->middleware('permission:inventario.dashboard');
    });

    // ==========================================
    // RUTAS ADICIONALES PARA MÓDULO DE VENTAS
    // ==========================================
    Route::prefix('ventas')->name('ventas.')->group(function () {
        // ✅ NUEVO: Reporte de productos vendidos - ANTES de rutas genéricas
        Route::get('reporte-productos-vendidos/imprimir', [\App\Http\Controllers\ReporteVentasController::class, 'imprimirReporte'])
            ->name('reporte-productos-vendidos.imprimir')
            ->middleware('permission:ventas.index');

        Route::get('reporte-productos-vendidos', [\App\Http\Controllers\ReporteVentasController::class, 'productosVendidos'])
            ->name('reporte-productos-vendidos')
            ->middleware('permission:ventas.index');

        // ✅ NUEVO: Impresión directa a impresora (sin diálogos)
        Route::post('reporte-productos-vendidos/imprimir-directo', [\App\Http\Controllers\ReporteVentasController::class, 'imprimirDirecto'])
            ->name('reporte-productos-vendidos.imprimir-directo')
            ->middleware('permission:ventas.index');

        // ✅ NUEVO: Reporte de ventas por producto (con filtros de fecha)
        Route::get('reportes/ventas-por-producto', [\App\Http\Controllers\ReporteController::class, 'ventasPorProducto'])
            ->name('reportes.ventas-por-producto')
            ->middleware('permission:ventas.index');

        // Rutas sin parámetros dinámicos PRIMERO
        // IMPORTANTE: Las rutas sin parámetros dinámicos DEBEN ir ANTES de las que sí tienen parámetros
        Route::get('formatos-disponibles', [\App\Http\Controllers\VentaController::class, 'formatosDisponibles'])->name('formatos-disponibles');

        // Gestión de Cuentas por Cobrar
        Route::get('cuentas-por-cobrar', [\App\Http\Controllers\CuentaPorCobrarController::class, 'index'])->name('cuentas-por-cobrar.index');
        Route::get('cuentas-por-cobrar/{cuentaPorCobrar}/show', [\App\Http\Controllers\CuentaPorCobrarController::class, 'show'])->name('cuentas-por-cobrar.show');
        Route::get('cuentas-por-cobrar/{cuentaPorCobrar}/imprimir-ticket-80', [\App\Http\Controllers\CuentaPorCobrarController::class, 'imprimirTicket80'])->name('cuentas-por-cobrar.imprimir-ticket-80');
        Route::put('cuentas-por-cobrar/{cuentaPorCobrar}/actualizar-fecha-vencimiento', [\App\Http\Controllers\CuentaPorCobrarController::class, 'actualizarFechaVencimiento'])->name('cuentas-por-cobrar.actualizar-fecha-vencimiento');
        // ✅ NUEVO: Anular cuenta por cobrar
        Route::post('cuentas-por-cobrar/{cuentaPorCobrar}/anular', [\App\Http\Controllers\CuentaPorCobrarController::class, 'anularCuenta'])->name('cuentas-por-cobrar.anular');

        // Acciones personalizadas (POST)
        Route::post('{venta}/anular', [\App\Http\Controllers\VentaController::class, 'anular'])->name('anular');
        Route::post('{venta}/aprobar', [\App\Http\Controllers\VentaController::class, 'aprobar'])->name('aprobar');
        Route::post('{venta}/rechazar', [\App\Http\Controllers\VentaController::class, 'rechazar'])->name('rechazar');
        Route::post('{venta}/registrar-pago', [\App\Http\Controllers\VentaController::class, 'registrarPago'])->name('registrar-pago');

        // Rutas con parámetros dinámicos van al final
        // ⚠️ IMPORTANTE: Restringir {venta} a solo números para no capturar rutas de texto
        Route::get('{venta}/imprimir', [\App\Http\Controllers\VentaController::class, 'imprimir'])->name('imprimir-venta')->where('venta', '[0-9]+');
        Route::get('{venta}/preview', [\App\Http\Controllers\VentaController::class, 'preview'])->name('preview')->where('venta', '[0-9]+');
        Route::get('{venta}/exportar-excel', [\App\Http\Controllers\VentaController::class, 'exportarExcel'])->name('exportar-excel')->where('venta', '[0-9]+');
        Route::get('{venta}/exportar-pdf', [\App\Http\Controllers\VentaController::class, 'exportarPdf'])->name('exportar-pdf')->where('venta', '[0-9]+');

        // Show debe ir AL FINAL para no capturar otras rutas
        Route::get('{id}', [\App\Http\Controllers\VentaController::class, 'show'])->name('show')->where('id', '[0-9]+');
    });

    // Rutas para gestión de stock en ventas
    Route::prefix('ventas/stock')->name('ventas.stock.')->group(function () {
        Route::post('verificar', [\App\Http\Controllers\VentaController::class, 'verificarStock'])->name('verificar');
        Route::get('producto/{producto}', [\App\Http\Controllers\VentaController::class, 'obtenerStockProducto'])->name('producto');
        Route::get('bajo', [\App\Http\Controllers\VentaController::class, 'productosStockBajo'])->name('bajo');
    });

    // Ruta para resumen de stock de una venta específica
    Route::get('ventas/{venta}/stock/resumen', [\App\Http\Controllers\VentaController::class, 'obtenerResumenStock'])->name('ventas.stock.resumen');

    // ==========================================
    // DEVOLUCIONES - MÓDULO DE DEVOLUCIONES Y CAMBIOS
    // ==========================================
    // Devoluciones: lista y detalle general
    Route::get('devoluciones', [\App\Http\Controllers\DevolucionController::class, 'index'])
        ->name('devoluciones.index');
    Route::get('devoluciones/{devolucion}', [\App\Http\Controllers\DevolucionController::class, 'show'])
        ->name('devoluciones.show');

    // Devoluciones: crear desde una venta específica (nested resource)
    Route::get('ventas/{venta}/devoluciones/create', [\App\Http\Controllers\DevolucionController::class, 'create'])
        ->name('devoluciones.create');
    Route::post('ventas/{venta}/devoluciones', [\App\Http\Controllers\DevolucionController::class, 'store'])
        ->name('devoluciones.store');

    // ==========================================
    // SERVICIOS - MÓDULO DE SERVICIOS (INYECCIONES, CONSULTAS, ETC.)
    // ==========================================
    Route::get('servicios', [\App\Http\Controllers\ServicioController::class, 'index'])
        ->name('servicios.index');
    Route::get('servicios/create', [\App\Http\Controllers\ServicioController::class, 'create'])
        ->name('servicios.create');
    Route::post('servicios', [\App\Http\Controllers\ServicioController::class, 'store'])
        ->name('servicios.store');
    Route::get('servicios/{servicio}', [\App\Http\Controllers\ServicioController::class, 'show'])
        ->name('servicios.show');

    // ==========================================
    // PROFORMAS - VISTAS INERTIA (usan ApiProformaController)
    // ==========================================
    // Vistas Inertia que reciben datos desde ApiProformaController
    // Todas las acciones (aprobar, rechazar, convertir) van a /api/proformas/*
    Route::prefix('proformas')->name('proformas.')->group(function () {
        // Vista: Lista de proformas (usa ProformaController::index)
        Route::get('/', [\App\Http\Controllers\ProformaController::class, 'index'])->name('index');

        // ==========================================
        // RUTAS DE IMPRESIÓN - PROFORMAS (SIN PARÁMETROS DINÁMICOS)
        // ==========================================
        // IMPORTANTE: Las rutas sin parámetros dinámicos DEBEN ir ANTES de las que sí tienen parámetros
        Route::get('create', [\App\Http\Controllers\ProformaController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\ProformaController::class, 'store'])->name('store');
        Route::get('formatos-disponibles', [\App\Http\Controllers\ProformaController::class, 'formatosDisponibles'])->name('formatos-disponibles');

        // ✅ NUEVO: Editar proforma existente
        Route::get('/{proforma}/edit', [\App\Http\Controllers\ProformaController::class, 'edit'])->name('edit');

        // ==========================================
        // RUTAS DE IMPRESIÓN (DEBEN ir ANTES de rutas con parámetros dinámicos)
        // ==========================================
        // ✅ Preparación de impresión de proformas filtradas (guarda en sesión)
        Route::get('/imprimir-filtrado', [\App\Http\Controllers\ProformaController::class, 'imprimirFiltrado'])->name('imprimir-filtrado');

        // ✅ Renderizado de PDF (obtiene de sesión) - Sigue patrón de ventas
        Route::get('/imprimir', [\App\Http\Controllers\ImpresionProformasController::class, 'imprimir'])->name('imprimir-batch');

        // ✅ Impresión individual (con ID en path)
        Route::get('/{proforma}/imprimir', [\App\Http\Controllers\ProformaController::class, 'imprimir'])->name('imprimir');
        Route::get('/{proforma}/preview', [\App\Http\Controllers\ProformaController::class, 'preview'])->name('preview');

        // Rutas con parámetros dinámicos van al final
        // Vista: Detalle de proforma (usa ProformaController::show)
        Route::get('/{proforma}', [\App\Http\Controllers\ProformaController::class, 'show'])->name('show');

        // Acciones POST - usan ProformaController (compatible con ReservaStock del web UI)
        Route::post('/{id}/aprobar', [\App\Http\Controllers\ProformaController::class, 'aprobar'])->name('aprobar');
        Route::post('/{id}/rechazar', [\App\Http\Controllers\ProformaController::class, 'rechazar'])->name('rechazar');

        // ✅ NUEVO: Endpoint simplificado (un solo paso: convertir directamente)
        Route::post('/{id}/procesar-venta', [\App\Http\Controllers\ProformaController::class, 'procesarVenta'])
            ->middleware('caja.abierta')
            ->name('procesar-venta');

        Route::post('/{id}/convertir-venta', [\App\Http\Controllers\ProformaController::class, 'convertirAVenta'])
            ->middleware('caja.abierta')
            ->name('convertir-venta');
        Route::post('/{id}/renovar-reservas', [\App\Http\Controllers\ProformaController::class, 'renovarReservas'])->name('renovar-reservas');
    });

    // ==========================================
    // 📦 GESTIÓN DE RESERVAS DE PROFORMAS
    // ==========================================
    Route::prefix('reservas')->name('reservas.')->middleware('auth')->group(function () {
        Route::get('/', [\App\Http\Controllers\ReservaController::class, 'index'])->name('index');
    });

    // ✅ RUTAS PARA USUARIO: Gestión de su propia caja
    Route::prefix('cajas')->name('cajas.')->middleware('permission:cajas.index')->group(function () {
        // ✅ NUEVO: Dashboard de caja de usuario específico (admin viendo caja de otro usuario)
        // Navega por user_id en lugar de apertura_id para ver la caja sin importar si está abierta
        Route::get('user/{userId}', [\App\Http\Controllers\CajaController::class, 'index'])->name('user');

        // ✅ NUEVO: Dashboard de caja específica (admin viendo caja de usuario)
        // Usa route model binding - {aperturaCaja} se inyecta automáticamente
        // ✅ CONSTRAINT: Solo aceptar números enteros para evitar conflictos con otras rutas
        Route::get('{aperturaCaja}', [\App\Http\Controllers\CajaController::class, 'index'])
            ->where('aperturaCaja', '[0-9]+')
            ->name('show');

        // Dashboard del usuario (su propia caja)
        Route::get('/', [\App\Http\Controllers\CajaController::class, 'index'])->name('index');
        Route::post('/abrir', [\App\Http\Controllers\CajaController::class, 'abrirCaja'])->name('abrir');
        Route::post('/cerrar', [\App\Http\Controllers\CajaController::class, 'cerrarCaja'])->name('cerrar');
        Route::get('/movimientos', [\App\Http\Controllers\CajaController::class, 'movimientosDia'])->name('movimientos');
        Route::post('/movimientos', [\App\Http\Controllers\CajaController::class, 'registrarMovimiento'])->name('registrar-movimiento');
        Route::post('/movimientos-json', [\App\Http\Controllers\CajaController::class, 'registrarMovimientoJson'])->name('registrar-movimiento-json'); // ✅ NUEVO: Para retornar JSON con movimiento_id

        // Gastos del usuario
        Route::prefix('gastos')->name('gastos.')->middleware('permission:cajas.gastos')->group(function () {
            Route::get('/', [\App\Http\Controllers\GastoController::class, 'index'])->name('index');
            Route::get('/create', [\App\Http\Controllers\GastoController::class, 'create'])->name('create');
            Route::post('/', [\App\Http\Controllers\GastoController::class, 'store'])->name('store');
            Route::delete('/{id}', [\App\Http\Controllers\GastoController::class, 'destroy'])->name('destroy');
        });
    });

    // ✅ RUTA PARA MOVIMIENTOS DE UNA APERTURA ESPECÍFICA
    Route::get('cajas/apertura/{aperturaId}/movimientos', [\App\Http\Controllers\CajaController::class, 'movimientosApertura'])
        ->name('cajas.apertura-movimientos')
        ->middleware('permission:cajas.transacciones');

    // ✅ RUTAS PARA IMPRESIONES DE CIERRE DE CAJA
    Route::prefix('cajas')->name('cajas.')->group(function () {
        Route::get('/{aperturaCaja}/cierre/imprimir', [\App\Http\Controllers\CajaController::class, 'imprimirCierre'])
            ->where('aperturaCaja', '[0-9]+')
            ->name('cierre.imprimir')
            ->middleware('permission:cajas.cerrar');

        Route::get('/{aperturaCaja}/cierre/exportar-excel', [\App\Http\Controllers\CajaController::class, 'exportarExcelCierre'])
            ->where('aperturaCaja', '[0-9]+')
            ->name('cierre.exportar-excel')
            ->middleware('permission:cajas.cerrar');

        Route::get('/{aperturaCaja}/datos-cierre', [\App\Http\Controllers\CajaController::class, 'obtenerDatosCierre'])
            ->where('aperturaCaja', '[0-9]+')
            ->name('datos-cierre')
            ->middleware('permission:cajas.cerrar');

        Route::get('/{aperturaCaja}/movimientos/imprimir', [\App\Http\Controllers\CajaController::class, 'imprimirMovimientos'])
            ->where('aperturaCaja', '[0-9]+')
            ->name('movimientos.imprimir')
            ->middleware('permission:cajas.transacciones');

        // ✅ NUEVO: Ruta para imprimir un movimiento individual
        Route::get('/movimiento/{movimiento}/imprimir', [\App\Http\Controllers\CajaController::class, 'imprimirMovimiento'])
            ->where('movimiento', '[0-9]+')
            ->name('movimiento.imprimir')
            ->middleware('permission:cajas.transacciones');

        // ✅ NUEVO: Ruta para eliminar un movimiento (solo GASTOS, PAGO_SUELDO, ANTICIPO)
        Route::delete('/movimiento/{movimiento}/eliminar', [\App\Http\Controllers\CajaController::class, 'eliminarMovimiento'])
            ->where('movimiento', '[0-9]+')
            ->name('movimiento.eliminar')
            ->middleware('permission:cajas.transacciones');

        Route::get('/{caja}/movimientos/exportar-excel', [\App\Http\Controllers\CajaController::class, 'exportarExcel'])
            ->where('caja', '[0-9]+')
            ->name('movimientos.exportar-excel')
            ->middleware('permission:cajas.transacciones');

        Route::get('/{caja}/movimientos/exportar-pdf', [\App\Http\Controllers\CajaController::class, 'exportarPdf'])
            ->where('caja', '[0-9]+')
            ->name('movimientos.exportar-pdf')
            ->middleware('permission:cajas.transacciones');

        // ✅ NUEVO (2026-03-09): Resumen de movimientos por tipo de pago
        Route::get('/resumen/por-tipo-pago', [\App\Http\Controllers\CajaController::class, 'resumenPorTipoPago'])
            ->name('resumen.por-tipo-pago')
            ->middleware('permission:cajas.transacciones');
    });

    // ✅ RUTAS PARA ADMIN: Gestión de cajas de otros usuarios
    Route::prefix('cajas/admin')->name('cajas.admin.')->middleware('permission:cajas.index')->group(function () {
        // Dashboard admin (ver todas las cajas)
        Route::get('/dashboard', [\App\Http\Controllers\CajaController::class, 'dashboard'])->name('dashboard');

        // ✅ NUEVO: Cierre Diario General Manual - Consolida todas las cajas activas
        Route::post('/cierre-diario', [\App\Http\Controllers\CajaController::class, 'cierreDiarioGeneral'])->name('cierre-diario');

        // ✅ NUEVO: Cierre Diario General - Versión JSON para Inertia
        Route::post('/cierre-diario-json', [\App\Http\Controllers\CajaController::class, 'cierreDiarioGeneralJson'])->name('cierre-diario-json');

        // ✅ NUEVO: Reportes de Cierres Diarios - Historial y detalles
        Route::prefix('reportes-diarios')->name('reportes-diarios.')->group(function () {
            Route::get('/', [\App\Http\Controllers\CierreDiarioGeneralController::class, 'index'])->name('index');
            Route::get('/{id}/debug', [\App\Http\Controllers\CierreDiarioGeneralController::class, 'debug'])->name('debug');
            Route::get('/{id}', [\App\Http\Controllers\CierreDiarioGeneralController::class, 'show'])->name('show');
            Route::get('/{id}/descargar', [\App\Http\Controllers\CierreDiarioGeneralController::class, 'descargar'])->name('descargar');
            Route::get('/{id}/descargar-filtrado', [\App\Http\Controllers\CierreDiarioGeneralController::class, 'descargarFiltrado'])->name('descargar-filtrado');
        });

        // Gestión de cajas por usuario - Validación de roles en el controlador
        Route::prefix('cajas/{userId}')->name('cajas.')->group(function () {
            Route::get('/', [\App\Http\Controllers\CajaController::class, 'detalle'])->name('detalle');
            Route::get('/movimientos', [\App\Http\Controllers\CajaController::class, 'movimientosDia'])->name('movimientos');
            Route::post('/abrir', [\App\Http\Controllers\CajaController::class, 'abrirCaja'])->name('abrir');
            Route::post('/cerrar', [\App\Http\Controllers\CajaController::class, 'cerrarCaja'])->name('cerrar');
            Route::post('/consolidar', [\App\Http\Controllers\CajaController::class, 'consolidarCaja'])->name('consolidar');
        });

        // Reportes del admin
        Route::get('/reportes', [\App\Http\Controllers\CajaController::class, 'reportes'])->middleware('permission:cajas.reportes')->name('reportes');

        // ✅ NUEVO: Conciliación de cajas (Regularización Ventas vs Movimientos)
        Route::get('/conciliacion', function () {
            return view('cajas.conciliacion');
        })->name('conciliacion')->middleware('permission:cajas.transacciones');

        // Gastos (admin ve todos)
        Route::prefix('gastos')->name('gastos.')->middleware('permission:cajas.gastos')->group(function () {
            Route::get('/', [\App\Http\Controllers\GastoController::class, 'adminIndex'])->name('index');
            Route::post('/{id}/aprobar', [\App\Http\Controllers\GastoController::class, 'aprobar'])->name('aprobar');
            Route::post('/{id}/rechazar', [\App\Http\Controllers\GastoController::class, 'rechazar'])->name('rechazar');
            Route::delete('/{id}', [\App\Http\Controllers\GastoController::class, 'destroy'])->name('destroy');
        });

        // Auditoría
        Route::prefix('auditoria')->name('auditoria.')->middleware('permission:cajas.auditoria')->group(function () {
            Route::get('/', [\App\Http\Controllers\AuditoriaCajaController::class, 'index'])->name('index');
            Route::get('/alertas', [\App\Http\Controllers\AuditoriaCajaController::class, 'alertas'])->name('alertas');
            Route::get('/{id}', [\App\Http\Controllers\AuditoriaCajaController::class, 'show'])->name('show');
            Route::get('/exportar/csv', [\App\Http\Controllers\AuditoriaCajaController::class, 'exportar'])->name('exportar');
        });
    });

    // Rutas para contabilidad
    Route::prefix('contabilidad')->name('contabilidad.')->middleware('permission:contabilidad.manage')->group(function () {
        Route::get('asientos', [\App\Http\Controllers\AsientoContableController::class, 'index'])->name('asientos.index');
        Route::get('asientos/{asientoContable}', [\App\Http\Controllers\AsientoContableController::class, 'show'])->name('asientos.show');

        // Reportes contables
        Route::get('reportes/libro-mayor', [\App\Http\Controllers\AsientoContableController::class, 'libroMayor'])->name('reportes.libro-mayor');
        Route::get('reportes/balance-comprobacion', [\App\Http\Controllers\AsientoContableController::class, 'balanceComprobacion'])->name('reportes.balance-comprobacion');
    });
    Route::resource('ventas.detalles', \App\Http\Controllers\DetalleVentaController::class)->shallow();

    // Rutas para gestión de inventario
    Route::prefix('inventario')->name('inventario.')->group(function () {
        Route::get('/', [\App\Http\Controllers\InventarioController::class, 'dashboard'])->middleware('permission:inventario.dashboard')->name('index');
        Route::get('/dashboard', [\App\Http\Controllers\InventarioController::class, 'dashboard'])->middleware('permission:inventario.dashboard')->name('dashboard');
        Route::get('stock-bajo', [\App\Http\Controllers\InventarioController::class, 'stockBajo'])->middleware('permission:inventario.stock-bajo')->name('stock-bajo');
        Route::get('proximos-vencer', [\App\Http\Controllers\InventarioController::class, 'proximosVencer'])->middleware('permission:inventario.proximos-vencer')->name('proximos-vencer');
        Route::get('vencidos', [\App\Http\Controllers\InventarioController::class, 'vencidos'])->middleware('permission:inventario.vencidos')->name('vencidos');
        Route::get('movimientos', [\App\Http\Controllers\InventarioController::class, 'movimientos'])->middleware('permission:inventario.movimientos')->name('movimientos');
        Route::get('movimientos/imprimir', [\App\Http\Controllers\ImpresionMovimientosController::class, 'imprimir'])->middleware('permission:inventario.movimientos')->name('movimientos.imprimir');
        Route::get('productos-vendidos/imprimir', [\App\Http\Controllers\ImpresionProductosVendidosController::class, 'imprimir'])->middleware('permission:inventario.movimientos')->name('productos-vendidos.imprimir');
        Route::get('ajuste', [\App\Http\Controllers\InventarioController::class, 'ajusteForm'])->middleware('permission:inventario.ajuste.form')->name('ajuste.form');
        Route::post('ajuste', [\App\Http\Controllers\InventarioController::class, 'procesarAjuste'])->middleware('permission:inventario.ajuste.procesar')->name('ajuste.procesar');
        // ✅ NUEVO: Ruta para ajuste por tabla editable
        Route::get('ajuste-tabla', function () {
            $almacenes = \App\Models\Almacen::where('activo', true)->orderBy('nombre')->get(['id', 'nombre']);
            $stock_productos = \App\Models\StockProducto::with(['producto:id,nombre,sku,codigo_barras,codigo_qr', 'producto.codigosBarra', 'almacen:id,nombre'])->get();
            // ✅ Cargar tipos de ajuste para la tabla
            $tipos_ajuste_inventario = \App\Models\TipoAjusteInventario::where('activo', true)->orderBy('label')->get();
            return \Inertia\Inertia::render('inventario/ajuste-tabla', [
                'almacenes' => $almacenes,
                'stock_productos' => $stock_productos,
                'tipos_ajuste_inventario' => $tipos_ajuste_inventario,
            ]);
        })->middleware('permission:inventario.ajuste.form')->name('ajuste-tabla.form');
        Route::get('ajuste-masivo', [\App\Http\Controllers\InventarioController::class, 'ajusteMasivoForm'])->middleware('permission:inventario.ajuste.form')->name('ajuste-masivo.form');
        Route::get('historial-cargas', [\App\Http\Controllers\InventarioController::class, 'historialCargasForm'])->middleware('permission:inventario.ajuste.form')->name('historial-cargas.form');
        Route::get('reportes', [\App\Http\Controllers\InventarioController::class, 'reportes'])->middleware('permission:inventario.reportes')->name('reportes');
        Route::get('ajuste/imprimir', [\App\Http\Controllers\InventarioController::class, 'imprimirAjustes'])->middleware('permission:inventario.ajuste.form')->name('ajuste.imprimir');

        // ✅ Rutas para mermas de inventario
        Route::get('merma', [\App\Http\Controllers\InventarioController::class, 'mermaForm'])->middleware('permission:inventario.mermas.registrar')->name('merma.form');

        // Rutas para gestión de tipos de ajuste de inventario
        Route::resource('tipos-ajuste-inventario', \App\Http\Controllers\TipoAjusteInventarioController::class)->parameters(['tipos-ajuste-inventario' => 'tipoAjusteInventario'])->middleware('permission:inventario.tipos-ajuste.manage');

        // Rutas para gestión de vehículos desde inventario
        Route::prefix('vehiculos')->name('vehiculos.')->group(function () {
            Route::get('/', [\App\Http\Controllers\VehiculoController::class, 'index'])->middleware('permission:inventario.vehiculos.manage')->name('index');
            Route::get('create', [\App\Http\Controllers\VehiculoController::class, 'create'])->middleware('permission:inventario.vehiculos.manage')->name('create');
            Route::post('/', [\App\Http\Controllers\VehiculoController::class, 'store'])->middleware('permission:inventario.vehiculos.manage')->name('store');
            Route::get('{vehiculo}/edit', [\App\Http\Controllers\VehiculoController::class, 'edit'])->middleware('permission:inventario.vehiculos.manage')->name('edit');
            Route::put('{vehiculo}', [\App\Http\Controllers\VehiculoController::class, 'update'])->middleware('permission:inventario.vehiculos.manage')->name('update');
            Route::delete('{vehiculo}', [\App\Http\Controllers\VehiculoController::class, 'destroy'])->middleware('permission:inventario.vehiculos.manage')->name('destroy');
        });

        // Rutas para transferencias de inventario
        Route::prefix('transferencias')->name('transferencias.')->group(function () {
            Route::get('/', [\App\Http\Controllers\InventarioController::class, 'transferencias'])->middleware('permission:inventario.transferencias.index')->name('index');
            Route::get('crear', [\App\Http\Controllers\InventarioController::class, 'formularioCrearTransferencia'])->middleware('permission:inventario.transferencias.crear')->name('crear');
            Route::post('crear', [\App\Http\Controllers\InventarioController::class, 'crearTransferencia'])->middleware('permission:inventario.transferencias.crear')->name('store');
            Route::get('{transferencia}', [\App\Http\Controllers\InventarioController::class, 'verTransferencia'])->middleware('permission:inventario.transferencias.ver')->name('show');
            Route::get('{transferencia}/edit', [\App\Http\Controllers\InventarioController::class, 'editarTransferencia'])->middleware('permission:inventario.transferencias.edit')->name('edit');
            Route::put('{transferencia}', [\App\Http\Controllers\InventarioController::class, 'actualizarTransferencia'])->middleware('permission:inventario.transferencias.edit')->name('update');
            Route::post('{transferencia}/enviar', [\App\Http\Controllers\InventarioController::class, 'enviarTransferencia'])->middleware('permission:inventario.transferencias.enviar')->name('enviar');
            Route::post('{transferencia}/recibir', [\App\Http\Controllers\InventarioController::class, 'recibirTransferencia'])->middleware('permission:inventario.transferencias.recibir')->name('recibir');
            Route::post('{transferencia}/cancelar', [\App\Http\Controllers\InventarioController::class, 'cancelarTransferencia'])->middleware('permission:inventario.transferencias.cancelar')->name('cancelar');
        });

        // Rutas para manejo de mermas
        Route::prefix('mermas')->name('mermas.')->group(function () {
            Route::get('/', [\App\Http\Controllers\InventarioController::class, 'mermas'])->middleware('permission:inventario.mermas.index')->name('index');
            Route::get('registrar', [\App\Http\Controllers\InventarioController::class, 'formularioRegistrarMerma'])->middleware('permission:inventario.mermas.registrar')->name('registrar');
            Route::post('registrar', [\App\Http\Controllers\InventarioController::class, 'registrarMerma'])->middleware('permission:inventario.mermas.store')->name('store');
            Route::get('{merma}', [\App\Http\Controllers\InventarioController::class, 'verMerma'])->middleware('permission:inventario.mermas.show')->name('show');
            Route::post('{merma}/aprobar', [\App\Http\Controllers\InventarioController::class, 'aprobarMerma'])->middleware('permission:inventario.mermas.aprobar')->name('aprobar');
            Route::post('{merma}/rechazar', [\App\Http\Controllers\InventarioController::class, 'rechazarMerma'])->middleware('permission:inventario.mermas.rechazar')->name('rechazar');
            Route::get('{id}/imprimir', [\App\Http\Controllers\InventarioController::class, 'imprimirMerma'])->middleware('permission:inventario.mermas.show')->name('imprimir');
        });

        // Rutas para carga masiva de inventario inicial
        Route::get('inventario-inicial', [\App\Http\Controllers\InventarioInicialController::class, 'index'])->middleware('permission:inventario.ajuste.form')->name('inicial.index');
        Route::post('inventario-inicial', [\App\Http\Controllers\InventarioInicialController::class, 'store'])->middleware('permission:inventario.ajuste.procesar')->name('inicial.store');

        // Rutas para borradores de inventario inicial
        Route::prefix('inventario-inicial')->name('inicial.')->middleware('permission:inventario.ajuste.form')->group(function () {
            Route::post('draft/create', [\App\Http\Controllers\InventarioInicialController::class, 'createOrGetDraft'])->name('draft.create');
            Route::get('draft/{borrador}', [\App\Http\Controllers\InventarioInicialController::class, 'getDraft'])->name('draft.get');
            Route::post('draft/{borrador}/items', [\App\Http\Controllers\InventarioInicialController::class, 'storeDraftItem'])->name('draft.item.store');
            Route::post('draft/{borrador}/productos', [\App\Http\Controllers\InventarioInicialController::class, 'addProductosToDraft'])->name('draft.productos.add');
            Route::post('draft/{borrador}/productos/load-paginated', [\App\Http\Controllers\InventarioInicialController::class, 'loadProductsPaginated'])->name('draft.productos.load-paginated');
            Route::post('draft/{borrador}/productos/suggestions', [\App\Http\Controllers\InventarioInicialController::class, 'searchProductosForSuggestions'])->name('draft.productos.suggestions');
            Route::post('draft/{borrador}/productos/search', [\App\Http\Controllers\InventarioInicialController::class, 'searchProductoInDraft'])->name('draft.productos.search');
            Route::delete('draft/{borrador}/items/{item}', [\App\Http\Controllers\InventarioInicialController::class, 'deleteDraftItem'])->name('draft.item.delete');
            Route::post('draft/{borrador}/complete', [\App\Http\Controllers\InventarioInicialController::class, 'completeDraft'])->middleware('permission:inventario.ajuste.procesar')->name('draft.complete');
        });

        // Rutas para gestión de reservas de inventario
        Route::prefix('reservas')->name('reservas.')->group(function () {
            Route::get('/', [\App\Http\Controllers\Inventario\ReservaProformaController::class, 'index'])->middleware('permission:inventario.reservas.index')->name('index');
            Route::post('{id}/liberar', [\App\Http\Controllers\Inventario\ReservaProformaController::class, 'liberar'])->middleware('permission:inventario.reservas.liberar')->name('liberar');
            Route::post('liberar-masivo', [\App\Http\Controllers\Inventario\ReservaProformaController::class, 'liberarMasivo'])->middleware('permission:inventario.reservas.liberar-masivo')->name('liberar-masivo');
            Route::post('{id}/extender', [\App\Http\Controllers\Inventario\ReservaProformaController::class, 'extender'])->middleware('permission:inventario.reservas.extender')->name('extender');
        });
    });

    // ✅ PRÉSTAMOS DE CANASTILLAS Y EMBASES
    Route::prefix('prestamos')->name('prestamos.')->middleware(['auth', 'verified'])->group(function () {
        Route::get('/', [\App\Http\Controllers\PrestamosInertiaController::class, 'index'])->name('index');
        Route::get('prestables', [\App\Http\Controllers\PrestamosInertiaController::class, 'prestables'])->name('prestables');

        // Stock routes
        Route::get('stock', [\App\Http\Controllers\Prestamos\StockController::class, 'stock'])->name('stock');
        Route::get('stock/clientes', [\App\Http\Controllers\Prestamos\StockController::class, 'stockClientes'])->name('stock.clientes');
        Route::get('stock/proveedores', [\App\Http\Controllers\Prestamos\StockController::class, 'stockProveedores'])->name('stock.proveedores');
        Route::get('ajustes/historial', fn() => Inertia::render('prestamos/ajustes/historial'))->name('ajustes.historial');
        Route::get('ajustes/movimientos', fn() => Inertia::render('prestamos/ajustes/movimientos'))->name('ajustes.movimientos');
        Route::get('ventas', fn() => Inertia::render('prestamos/ventas/listado'))->name('ventas.listado');
        Route::get('ventas/crear', fn() => Inertia::render('prestamos/ventas/crear'))->name('ventas.crear');
        Route::get('ventas/{venta}', [\App\Http\Controllers\PrestamoVendidoController::class, 'showWeb'])->name('ventas.show');

        // Compras de Prestables
        Route::get('compras', fn() => Inertia::render('prestamos/compras/listado'))->name('compras.listado');
        Route::get('compras/crear', fn() => Inertia::render('prestamos/compras/crear'))->name('compras.crear');
        Route::get('compras/{compra}', [\App\Http\Controllers\CompraPrestableController::class, 'show'])->name('compras.show');

        Route::get('clientes', [\App\Http\Controllers\PrestamosInertiaController::class, 'clientesIndex'])->name('clientes.index');
        Route::get('clientes/crear', [\App\Http\Controllers\PrestamosInertiaController::class, 'clientesCrear'])->name('clientes.crear');
        Route::post('clientes', [\App\Http\Controllers\PrestamosInertiaController::class, 'clientesStore'])->name('clientes.store');

        // Impresión de préstamos de cliente (similar a ventas/{venta}/imprimir)
        Route::get('clientes/{prestamo}/imprimir', [\App\Http\Controllers\PrestamoClienteController::class, 'imprimir'])
            ->name('clientes.imprimir')
            ->where('prestamo', '[0-9]+');

        // Página de devoluciones de un préstamo
        Route::get('clientes/{prestamo}/devoluciones', fn(\App\Models\PrestamoCliente $prestamo) =>
            Inertia::render('prestamos/clientes/devoluciones', ['prestamoId' => $prestamo->id])
        )->name('clientes.devoluciones')
        ->where('prestamo', '[0-9]+');

        // Imprimir todas las devoluciones de un préstamo
        Route::get('clientes/{prestamo}/devoluciones/imprimir', [\App\Http\Controllers\PrestamoClienteController::class, 'imprimirTodasLasDevoluciones'])
            ->name('clientes.devoluciones.imprimir')
            ->where('prestamo', '[0-9]+');

        // Página de devoluciones de un préstamo a proveedor
        Route::get('proveedores/{prestamo}/devoluciones', fn(\App\Models\PrestamoProveedor $prestamo) =>
            Inertia::render('prestamos/proveedores/devoluciones', ['prestamoId' => $prestamo->id])
        )->name('proveedores.devoluciones')
        ->where('prestamo', '[0-9]+');

        Route::get('proveedores', [\App\Http\Controllers\PrestamosInertiaController::class, 'proveedoresIndex'])->name('proveedores.index');

        // Rutas para PRÉSTAMOS a proveedor
        Route::get('proveedores/prestamos/crear', [\App\Http\Controllers\PrestamosInertiaController::class, 'proveedoresPrestamosCrear'])->name('proveedores.prestamos.crear');

        // Rutas para COMPRA de prestables
        Route::get('proveedores/compras/crear', [\App\Http\Controllers\PrestamosInertiaController::class, 'proveedoresComprasCrear'])->name('proveedores.compras.crear');

        // POST es igual para ambos (se diferencia por es_compra en los datos)
        Route::post('proveedores', [\App\Http\Controllers\PrestamosInertiaController::class, 'proveedoresStore'])->name('proveedores.store');

        // Impresión de préstamos de proveedor
        Route::get('proveedores/{prestamo}/imprimir', [\App\Http\Controllers\PrestamoProveedorController::class, 'imprimir'])
            ->name('proveedores.imprimir')
            ->where('prestamo', '[0-9]+');

        Route::get('reportes', [\App\Http\Controllers\PrestamosInertiaController::class, 'reportes'])->name('reportes');
    });

    // Rutas para logística y envíos
    Route::prefix('logistica')->name('logistica.')->group(function () {
        Route::get('dashboard', [App\Http\Controllers\Web\LogisticaController::class, 'dashboard'])->name('dashboard');
        Route::get('proformas-pendientes', fn() => Inertia::render('logistica/proformas-pendientes'))->name('proformas-pendientes');
        Route::get('envios/{envio}/seguimiento', [App\Http\Controllers\Web\LogisticaController::class, 'seguimiento'])->name('envios.seguimiento');

        // ✅ NUEVO: Entregas consolidadas (migrado desde /envios)
        Route::prefix('entregas')->name('entregas.')->group(function () {
            // ✅ IMPORTANTE: Las rutas específicas DEBEN estar ANTES de {entrega}
            // para evitar que sean capturadas por la ruta con parámetro

            Route::get('/', [\App\Http\Controllers\EntregaController::class, 'index'])->name('index');

            // Rutas específicas de entregas
            Route::get('asignadas', fn() => Inertia::render('logistica/entregas/asignadas'))->name('asignadas');
            Route::get('en-transito', fn() => Inertia::render('logistica/entregas/en-transito'))->name('en-transito');

            // ✅ UNIFICADO: Dashboard ahora es parte de index.tsx con ?view=dashboard
            // Route::get('dashboard', ...) → Eliminado, usar /logistica/entregas?view=dashboard
            // ✅ COMPATIBILIDAD: Redirigir URLs antiguas de dashboard a la nueva vista unificada
            Route::redirect('dashboard', '/logistica/entregas?view=dashboard', 301);

            Route::get('dashboard-stats', [\App\Http\Controllers\EntregaController::class, 'dashboardStats'])->name('dashboard-stats');

            // 🔍 DEBUG: Endpoint para diagnosticar qué ventas están disponibles
            Route::get('debug-ventas', [\App\Http\Controllers\EntregaController::class, 'debugVentas'])->name('debug-ventas');

            // ✅ FASE UNIFICADA: Una sola ruta para crear entregas simples o en lote
            // Soporta: ?venta_id=N para modo single, o sin parámetros para batch
            Route::get('create', [\App\Http\Controllers\EntregaController::class, 'create'])->name('create');

            // ✅ NUEVO: Búsqueda de ventas en BD (para BatchVentaSelector)
            // GET /logistica/entregas/ventas/search?q=...&fecha_desde=...&fecha_hasta=...
            Route::get('ventas/search', [\App\Http\Controllers\EntregaController::class, 'searchVentas'])->name('ventas.search');

            // ✅ NUEVO: Búsqueda de entregas por ID, número, chofer o vehículo (para EntregaSearchSelector)
            // GET /logistica/entregas/search?q=...
            Route::get('search', [\App\Http\Controllers\EntregaController::class, 'searchEntregas'])->name('search');

            // ⚠️ DEPRECATED: /crear-lote → Usar /create en su lugar
            // FASE UNIFICADA ha consolidado ambos flujos en una sola interfaz.
            // Esta ruta será eliminada en próximo sprint.
            Route::get('crear-lote', [\App\Http\Controllers\EntregaController::class, 'create'])->name('create-batch');

            // Optimización masiva de rutas (FFD + Nearest Neighbor)
            Route::post('optimizar', [\App\Http\Controllers\EntregaController::class, 'optimizarRutas'])->name('optimizar');
            Route::post('/', [\App\Http\Controllers\EntregaController::class, 'store'])->name('store');

            // ✅ NUEVO: Editar entrega existente
            // GET /logistica/entregas/{id}/edit - reutiliza formulario de crear
            Route::get('{entrega}/edit', [\App\Http\Controllers\EntregaController::class, 'edit'])->name('edit');

            // ✅ IMPORTANTE: Las rutas con parámetro {entrega} DEBEN estar al final
            Route::get('{entrega}', [\App\Http\Controllers\EntregaController::class, 'show'])->name('show');
            Route::post('{entrega}/asignar', [\App\Http\Controllers\EntregaController::class, 'asignarChoferVehiculo'])->name('asignar');
            Route::post('{entrega}/iniciar', [\App\Http\Controllers\EntregaController::class, 'iniciar'])->name('iniciar');
            Route::post('{entrega}/llego', [\App\Http\Controllers\EntregaController::class, 'registrarLlegada'])->name('llego');
            Route::post('{entrega}/confirmar', [\App\Http\Controllers\EntregaController::class, 'confirmar'])->name('confirmar');
            Route::post('{entrega}/novedad', [\App\Http\Controllers\EntregaController::class, 'reportarNovedad'])->name('novedad');
            Route::post('{entrega}/rechazar', [\App\Http\Controllers\EntregaController::class, 'rechazar'])->name('rechazar'); // Legacy
            Route::post('{entrega}/ubicacion', [\App\Http\Controllers\EntregaController::class, 'registrarUbicacion'])->name('ubicacion');

            // ✅ Desvincular venta de entrega en edit mode
            Route::delete('{entrega}/ventas/{venta}', [\App\Http\Controllers\EntregaController::class, 'desvincularVenta'])->name('desvincular-venta');
        });

        // ✅ FASE 2: Reportes de Carga (gestión centralizada)
        Route::prefix('reportes')->name('reportes.')->group(function () {
            Route::get('/', [\App\Http\Controllers\ReporteCargoListController::class, 'index'])
                ->middleware('permission:reportes-carga.index')
                ->name('index');
        });
    });

    // ✅ NUEVO: Dashboard para Vendedor/Cajero
    Route::prefix('vendedor')->name('vendedor.')->group(function () {
        Route::get('dashboard', [App\Http\Controllers\VendedorController::class, 'dashboard'])->name('dashboard');
    });

    // ✅ NUEVO: Dashboard para Chofer
    Route::prefix('chofer')->name('chofer.')->group(function () {
        Route::get('dashboard', [App\Http\Controllers\ChoferController::class, 'dashboard'])->name('dashboard');
    });

    // ✅ NUEVO: Dashboard para Preventista
    Route::prefix('preventista')->name('preventista.')->group(function () {
        Route::get('dashboard', [App\Http\Controllers\PreventistController::class, 'dashboard'])->name('dashboard');
    });

    // ✅ NUEVO: Dashboard para Admin
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('dashboard', [App\Http\Controllers\AdminController::class, 'dashboard'])->name('dashboard');
    });

    // Rutas para gestión de rutas (planificación y seguimiento)
    Route::prefix('rutas')->name('rutas.')->middleware('permission:envios.manage')->group(function () {
        Route::get('/', [\App\Http\Controllers\RutaController::class, 'index'])->name('index');
        Route::get('create', [\App\Http\Controllers\RutaController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\RutaController::class, 'store'])->name('store');
        Route::post('/planificar', [\App\Http\Controllers\RutaController::class, 'planificar'])->name('planificar');
        Route::get('{ruta}', [\App\Http\Controllers\RutaController::class, 'show'])->name('show');
        Route::post('{ruta}/iniciar', [\App\Http\Controllers\RutaController::class, 'iniciar'])->name('iniciar');
        Route::post('{ruta}/completar', [\App\Http\Controllers\RutaController::class, 'completar'])->name('completar');
        Route::post('{ruta}/cancelar', [\App\Http\Controllers\RutaController::class, 'cancelar'])->name('cancelar');
        Route::post('detalles/{detalle}/registrar-entrega', [\App\Http\Controllers\RutaController::class, 'registrarEntrega'])->name('registrar-entrega');
    });

    // ✅ DEPRECATED: Rutas de envíos eliminadas - usar /logistica/entregas en su lugar
    // Todos los /envios/* routes redirigen a /logistica/entregas con 301 Permanent Redirect
    Route::redirect('/envios', '/logistica/entregas', 301);
    Route::redirect('/envios/create', '/logistica/entregas/create', 301);
    Route::redirect('/envios/api/vehiculos-disponibles', '/logistica/entregas/api/vehiculos-disponibles', 301);
    Route::redirect('/envios/api/choferes-disponibles', '/logistica/entregas/api/choferes-disponibles', 301);
    Route::get('/envios/{id}', fn($id) => redirect("/logistica/entregas/{$id}", 301))->where('id', '[0-9]+');

    // ✅ COMPATIBILITY: Línea movida dentro del grupo de entregas para evitar conflicto con {entrega}

    // API routes para autocompletado (NOTA: Estas rutas deberían moverse a routes/api.php eventualmente)
    Route::get('api/proveedores/buscar', [\App\Http\Controllers\ProveedorController::class, 'buscarApi'])->name('api.proveedores.buscar');
    Route::get('api/productos/buscar', [\App\Http\Controllers\ProductoController::class, 'buscarApi'])->name('api.productos.buscar');

    // Rutas para reportes de precios
    Route::prefix('reportes')->name('reportes.')->group(function () {
        Route::get('precios', [\App\Http\Controllers\ReportePreciosController::class, 'index'])->middleware('permission:reportes.precios.index')->name('precios.index');
        Route::get('precios/export', [\App\Http\Controllers\ReportePreciosController::class, 'export'])->name('precios.export');
        Route::get('ganancias', [\App\Http\Controllers\ReportePreciosController::class, 'ganancias'])->name('ganancias.index');
        Route::get('ganancias/export', [\App\Http\Controllers\ReportePreciosController::class, 'exportGanancias'])->name('ganancias.export');

        // Reportes de crédito
        Route::get('credito', [\App\Http\Controllers\ReporteCreditoController::class, 'index'])->middleware('permission:reportes.credito.index')->name('credito.index');
        Route::get('credito/graficos', [\App\Http\Controllers\ReporteCreditoController::class, 'obtenerGraficosCreditoApi'])->name('credito.graficos');
        Route::get('credito/vencidos', [\App\Http\Controllers\ReporteCreditoController::class, 'obtenerClientesVencidosApi'])->name('credito.vencidos');

        // Reportes de visitas de preventistas
        Route::get('visitas', [\App\Http\Controllers\ReporteVisitasController::class, 'index'])->middleware('role:Admin|Super Admin')->name('visitas');
        Route::get('visitas/exportar-excel', [\App\Http\Controllers\ReporteVisitasController::class, 'exportarExcel'])->middleware('role:Admin|Super Admin')->name('visitas.exportar-excel');

        // Reportes de inventario
        Route::prefix('inventario')->name('inventario.')->group(function () {
            Route::get('stock-actual', [\App\Http\Controllers\ReporteInventarioController::class, 'stockActual'])->name('stock-actual');
            Route::post('buscar-stock', [\App\Http\Controllers\ReporteInventarioController::class, 'buscarStock'])->name('buscar-stock');
            Route::get('vencimientos', [\App\Http\Controllers\ReporteInventarioController::class, 'vencimientos'])->name('vencimientos');
            Route::get('rotacion', [\App\Http\Controllers\ReporteInventarioController::class, 'rotacion'])->name('rotacion');
            Route::get('movimientos', [\App\Http\Controllers\ReporteInventarioController::class, 'movimientos'])->name('movimientos');
            // ✅ NUEVO: Exportación de reportes
            Route::get('export', [\App\Http\Controllers\ReporteInventarioController::class, 'export'])->name('export');
            Route::get('export-pdf', [\App\Http\Controllers\ReporteInventarioController::class, 'exportPdf'])->name('export-pdf');
        });

        // Reportes de ventas
        Route::prefix('ventas')->name('ventas.')->group(function () {
            Route::get('ranking-clientes', [\App\Http\Controllers\ReporteVentasController::class, 'rankingClientes'])->name('ranking-clientes');
            Route::get('entregas-por-chofer', [\App\Http\Controllers\ReporteVentasController::class, 'entregasPorChofer'])->name('entregas-por-chofer');
            Route::get('entregas-por-cliente', [\App\Http\Controllers\ReporteVentasController::class, 'entregarsPorCliente'])->name('entregas-por-cliente');
            Route::post('export', [\App\Http\Controllers\ReporteVentasController::class, 'export'])->name('export');
        });
    });

    // ==========================================
    // RUTAS PARA SISTEMAS AVANZADOS DE INVENTARIO
    // ==========================================

    // Rutas para Reservas de Stock
    Route::prefix('inventario/reservas')->name('reservas-stock.')->middleware('permission:inventario.reservas.manage')->group(function () {
        Route::get('/', [\App\Http\Controllers\ReservaStockController::class, 'index'])->name('index');
        Route::get('dashboard', [\App\Http\Controllers\ReservaStockController::class, 'dashboard'])->name('dashboard');
        Route::get('create', [\App\Http\Controllers\ReservaStockController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\ReservaStockController::class, 'store'])->name('store');
        Route::get('{reservaStock}', [\App\Http\Controllers\ReservaStockController::class, 'show'])->name('show');
        Route::get('{reservaStock}/edit', [\App\Http\Controllers\ReservaStockController::class, 'edit'])->name('edit');
        Route::put('{reservaStock}', [\App\Http\Controllers\ReservaStockController::class, 'update'])->name('update');
        Route::delete('{reservaStock}', [\App\Http\Controllers\ReservaStockController::class, 'destroy'])->name('destroy');

        // Acciones específicas
        Route::post('{reservaStock}/utilizar', [\App\Http\Controllers\ReservaStockController::class, 'utilizar'])->name('utilizar');
        Route::post('{reservaStock}/liberar', [\App\Http\Controllers\ReservaStockController::class, 'liberar'])->name('liberar');

        // APIs
        Route::prefix('api')->name('api.')->group(function () {
            Route::get('stock-disponible', [\App\Http\Controllers\ReservaStockController::class, 'apiStockDisponible'])->name('stock-disponible');
            Route::get('reservas-por-producto', [\App\Http\Controllers\ReservaStockController::class, 'apiReservasPorProducto'])->name('reservas-por-producto');
            Route::post('liberar-vencidas', [\App\Http\Controllers\ReservaStockController::class, 'apiLiberarVencidas'])->name('liberar-vencidas');
        });
    });

    // Rutas para Conteos Físicos
    Route::prefix('inventario/conteos-fisicos')->name('conteos-fisicos.')->middleware('permission:inventario.conteos.manage')->group(function () {
        Route::get('/', [\App\Http\Controllers\ConteoFisicoController::class, 'index'])->name('index');
        Route::get('dashboard', [\App\Http\Controllers\ConteoFisicoController::class, 'dashboard'])->name('dashboard');
        Route::get('create', [\App\Http\Controllers\ConteoFisicoController::class, 'create'])->name('create');
        Route::post('/', [\App\Http\Controllers\ConteoFisicoController::class, 'store'])->name('store');
        Route::get('{conteoFisico}', [\App\Http\Controllers\ConteoFisicoController::class, 'show'])->name('show');

        // Acciones de flujo de conteo
        Route::post('{conteoFisico}/iniciar', [\App\Http\Controllers\ConteoFisicoController::class, 'iniciar'])->name('iniciar');
        Route::post('{conteoFisico}/finalizar', [\App\Http\Controllers\ConteoFisicoController::class, 'finalizar'])->name('finalizar');
        Route::post('{conteoFisico}/aprobar', [\App\Http\Controllers\ConteoFisicoController::class, 'aprobar'])->name('aprobar');
        Route::post('{conteoFisico}/cancelar', [\App\Http\Controllers\ConteoFisicoController::class, 'cancelar'])->name('cancelar');

        // Acciones de conteo de items
        Route::post('{conteoFisico}/items/{detalle}/contar', [\App\Http\Controllers\ConteoFisicoController::class, 'contarItem'])->name('contar-item');
        Route::post('{conteoFisico}/items/{detalle}/recontar', [\App\Http\Controllers\ConteoFisicoController::class, 'recontarItem'])->name('recontar-item');
        Route::post('{conteoFisico}/items/{detalle}/marcar-reconteo', [\App\Http\Controllers\ConteoFisicoController::class, 'marcarParaReconteo'])->name('marcar-reconteo');

        // APIs
        Route::prefix('api')->name('api.')->group(function () {
            Route::get('conteos', [\App\Http\Controllers\ConteoFisicoController::class, 'apiConteos'])->name('conteos');
            Route::get('{conteoFisico}/detalle', [\App\Http\Controllers\ConteoFisicoController::class, 'apiDetalleConteo'])->name('detalle-conteo');
            Route::post('programar-ciclicos', [\App\Http\Controllers\ConteoFisicoController::class, 'apiProgramarConteosCiclicos'])->name('programar-ciclicos');
        });
    });

    // Rutas para Análisis ABC
    Route::prefix('inventario/analisis-abc')->name('analisis-abc.')->middleware('permission:inventario.analisis.manage')->group(function () {
        Route::get('/', [\App\Http\Controllers\AnalisisAbcController::class, 'index'])->name('index');
        Route::get('dashboard', [\App\Http\Controllers\AnalisisAbcController::class, 'dashboard'])->name('dashboard');
        Route::get('{analisisAbc}', [\App\Http\Controllers\AnalisisAbcController::class, 'show'])->name('show');

        // Acciones de cálculo
        Route::post('calcular', [\App\Http\Controllers\AnalisisAbcController::class, 'calcular'])->name('calcular');
        Route::get('export', [\App\Http\Controllers\AnalisisAbcController::class, 'export'])->name('export');

        // Reportes especializados
        Route::get('reportes/rotacion', [\App\Http\Controllers\AnalisisAbcController::class, 'reporteRotacion'])->name('reporte-rotacion');
        Route::get('reportes/obsoletos', [\App\Http\Controllers\AnalisisAbcController::class, 'reporteObsoletos'])->name('reporte-obsoletos');

        // APIs
        Route::prefix('api')->name('api.')->group(function () {
            Route::post('calcular-analisis', [\App\Http\Controllers\AnalisisAbcController::class, 'apiCalcularAnalisis'])->name('calcular-analisis');
            Route::get('recomendaciones', [\App\Http\Controllers\AnalisisAbcController::class, 'apiRecomendaciones'])->name('recomendaciones');
        });
    });

    // ==========================================
    // 📦 STOCK - IMPRESIÓN
    // ==========================================
    Route::prefix('stock')->name('stock.')->group(function () {
        Route::get('imprimir', [\App\Http\Controllers\ImpresionStockController::class, 'imprimir'])->name('imprimir');
        Route::get('preview', [\App\Http\Controllers\ImpresionStockController::class, 'preview'])->name('preview');
    });

    // ==========================================
    // 📋 MOVIMIENTOS - IMPRESIÓN
    // ==========================================
    Route::prefix('movimientos')->name('movimientos.')->group(function () {
        Route::get('imprimir', [\App\Http\Controllers\ImpresionMovimientosController::class, 'imprimir'])->name('imprimir');
        Route::get('preview', [\App\Http\Controllers\ImpresionMovimientosController::class, 'preview'])->name('preview');
    });

    // ==========================================
    // 💳 VENTAS - IMPRESIÓN
    // ==========================================
    Route::prefix('ventas')->name('ventas.')->group(function () {
        Route::get('imprimir', [\App\Http\Controllers\ImpresionVentasController::class, 'imprimir'])->name('imprimir');
    });

    // ==========================================
    // 📦 PRÉSTAMOS - DASHBOARD, STOCK Y ALERTAS
    // ==========================================
    Route::prefix('prestamos')->name('prestamos.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Prestamos\DashboardController::class, 'dashboard'])->name('dashboard');
        Route::get('dashboard', [\App\Http\Controllers\Prestamos\DashboardController::class, 'dashboard'])->name('dashboard-alt');
        Route::get('stock', [\App\Http\Controllers\Prestamos\StockController::class, 'stock'])->name('stock');
        Route::get('alertas', [\App\Http\Controllers\Prestamos\AlertasController::class, 'alertas'])->name('alertas');
    });
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/test.php';
