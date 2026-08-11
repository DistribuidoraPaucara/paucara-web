import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import proformas from './proformas'
import tiposPago from './tipos-pago'
import modulosSidebar from './modulos-sidebar'
import tipoOperacionCaja from './tipo-operacion-caja'
import sectores from './sectores'
import combos from './combos'
import productos from './productos'
import app from './app'
import ventas from './ventas'
import compras from './compras'
import precios from './precios'
import clientes from './clientes'
import cliente from './cliente'
import pago from './pago'
import creditos from './creditos'
import geocoding from './geocoding'
import entregas from './entregas'
import estadosLogistica from './estados-logistica'
import proveedores from './proveedores'
import almacenesPrestables from './almacenes-prestables'
import cajas from './cajas'
import gastos from './gastos'
import admin from './admin'
import conciliacion from './conciliacion'
import debug from './debug'
import reportes from './reportes'
import alertas from './alertas'
import prestamosCliente from './prestamos-cliente'
import prestamosEvento from './prestamos-evento'
import prestamosProveedor from './prestamos-proveedor'
import cuentasPorCobrar from './cuentas-por-cobrar'
import egresosAnalisis from './egresos-analisis'
import egresos from './egresos'
import notificaciones from './notificaciones'
import actualizarStockMasivo from './actualizar-stock-masivo'
import dashboard from './dashboard'
import codigosBarra from './codigos-barra'
import productosComidas from './productos-comidas'
/**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
export const modulosSidebar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: modulosSidebar.url(options),
    method: 'get',
})

modulosSidebar.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
modulosSidebar.url = (options?: RouteQueryOptions) => {
    return modulosSidebar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
modulosSidebar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: modulosSidebar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
modulosSidebar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: modulosSidebar.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
    const modulosSidebarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: modulosSidebar.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
        modulosSidebarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: modulosSidebar.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::modulosSidebar
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
        modulosSidebarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: modulosSidebar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    modulosSidebar.form = modulosSidebarForm
/**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::dashboardRedirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
export const dashboardRedirect = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardRedirect.url(options),
    method: 'get',
})

dashboardRedirect.definition = {
    methods: ["get","head"],
    url: '/api/dashboard-redirect',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::dashboardRedirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
dashboardRedirect.url = (options?: RouteQueryOptions) => {
    return dashboardRedirect.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::dashboardRedirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
dashboardRedirect.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardRedirect.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::dashboardRedirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
dashboardRedirect.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboardRedirect.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::dashboardRedirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
    const dashboardRedirectForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboardRedirect.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::dashboardRedirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
        dashboardRedirectForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardRedirect.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Auth\DashboardRedirectController::dashboardRedirect
 * @see app/Http/Controllers/Auth/DashboardRedirectController.php:81
 * @route '/api/dashboard-redirect'
 */
        dashboardRedirectForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardRedirect.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboardRedirect.form = dashboardRedirectForm
/**
 * @see routes/api.php:414
 * @route '/api/preventistas'
 */
export const preventistas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preventistas.url(options),
    method: 'get',
})

preventistas.definition = {
    methods: ["get","head"],
    url: '/api/preventistas',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/api.php:414
 * @route '/api/preventistas'
 */
preventistas.url = (options?: RouteQueryOptions) => {
    return preventistas.definition.url + queryParams(options)
}

/**
 * @see routes/api.php:414
 * @route '/api/preventistas'
 */
preventistas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preventistas.url(options),
    method: 'get',
})
/**
 * @see routes/api.php:414
 * @route '/api/preventistas'
 */
preventistas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preventistas.url(options),
    method: 'head',
})

    /**
 * @see routes/api.php:414
 * @route '/api/preventistas'
 */
    const preventistasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preventistas.url(options),
        method: 'get',
    })

            /**
 * @see routes/api.php:414
 * @route '/api/preventistas'
 */
        preventistasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preventistas.url(options),
            method: 'get',
        })
            /**
 * @see routes/api.php:414
 * @route '/api/preventistas'
 */
        preventistasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preventistas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preventistas.form = preventistasForm
/**
 * @see routes/api.php:1536
 * @route '/api/logs'
 */
export const logs = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logs.url(options),
    method: 'get',
})

logs.definition = {
    methods: ["get","head"],
    url: '/api/logs',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/api.php:1536
 * @route '/api/logs'
 */
logs.url = (options?: RouteQueryOptions) => {
    return logs.definition.url + queryParams(options)
}

/**
 * @see routes/api.php:1536
 * @route '/api/logs'
 */
logs.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: logs.url(options),
    method: 'get',
})
/**
 * @see routes/api.php:1536
 * @route '/api/logs'
 */
logs.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: logs.url(options),
    method: 'head',
})

    /**
 * @see routes/api.php:1536
 * @route '/api/logs'
 */
    const logsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: logs.url(options),
        method: 'get',
    })

            /**
 * @see routes/api.php:1536
 * @route '/api/logs'
 */
        logsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: logs.url(options),
            method: 'get',
        })
            /**
 * @see routes/api.php:1536
 * @route '/api/logs'
 */
        logsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: logs.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    logs.form = logsForm
const api = {
    proformas,
tiposPago,
modulosSidebar,
dashboardRedirect,
tipoOperacionCaja,
sectores,
combos,
productos,
app,
preventistas,
ventas,
compras,
precios,
clientes,
cliente,
pago,
creditos,
geocoding,
entregas,
estadosLogistica,
proveedores,
almacenesPrestables,
cajas,
gastos,
admin,
conciliacion,
debug,
logs,
reportes,
alertas,
prestamosCliente,
prestamosEvento,
prestamosProveedor,
cuentasPorCobrar,
egresosAnalisis,
egresos,
notificaciones,
actualizarStockMasivo,
dashboard,
codigosBarra,
productosComidas,
}

export default api