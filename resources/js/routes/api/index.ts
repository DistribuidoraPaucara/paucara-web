import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import proformas from './proformas'
import tiposPago from './tipos-pago'
import modulosSidebar from './modulos-sidebar'
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
import proveedores from './proveedores'
import cajas from './cajas'
import gastos from './gastos'
import admin from './admin'
import conciliacion from './conciliacion'
import reportes from './reportes'
import alertas from './alertas'
import dashboard from './dashboard'
import codigosBarra from './codigos-barra'
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
 * @see routes/api.php:357
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
 * @see routes/api.php:357
 * @route '/api/preventistas'
 */
preventistas.url = (options?: RouteQueryOptions) => {
    return preventistas.definition.url + queryParams(options)
}

/**
 * @see routes/api.php:357
 * @route '/api/preventistas'
 */
preventistas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preventistas.url(options),
    method: 'get',
})
/**
 * @see routes/api.php:357
 * @route '/api/preventistas'
 */
preventistas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preventistas.url(options),
    method: 'head',
})

    /**
 * @see routes/api.php:357
 * @route '/api/preventistas'
 */
    const preventistasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preventistas.url(options),
        method: 'get',
    })

            /**
 * @see routes/api.php:357
 * @route '/api/preventistas'
 */
        preventistasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preventistas.url(options),
            method: 'get',
        })
            /**
 * @see routes/api.php:357
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
const api = {
    proformas,
tiposPago,
modulosSidebar,
dashboardRedirect,
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
proveedores,
cajas,
gastos,
admin,
conciliacion,
reportes,
alertas,
dashboard,
codigosBarra,
}

export default api