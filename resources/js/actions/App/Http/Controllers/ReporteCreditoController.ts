import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReporteCreditoController::index
 * @see app/Http/Controllers/ReporteCreditoController.php:22
 * @route '/reportes/credito'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/reportes/credito',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCreditoController::index
 * @see app/Http/Controllers/ReporteCreditoController.php:22
 * @route '/reportes/credito'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCreditoController::index
 * @see app/Http/Controllers/ReporteCreditoController.php:22
 * @route '/reportes/credito'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCreditoController::index
 * @see app/Http/Controllers/ReporteCreditoController.php:22
 * @route '/reportes/credito'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteCreditoController::index
 * @see app/Http/Controllers/ReporteCreditoController.php:22
 * @route '/reportes/credito'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteCreditoController::index
 * @see app/Http/Controllers/ReporteCreditoController.php:22
 * @route '/reportes/credito'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteCreditoController::index
 * @see app/Http/Controllers/ReporteCreditoController.php:22
 * @route '/reportes/credito'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerGraficosCreditoApi
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
export const obtenerGraficosCreditoApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerGraficosCreditoApi.url(options),
    method: 'get',
})

obtenerGraficosCreditoApi.definition = {
    methods: ["get","head"],
    url: '/reportes/credito/graficos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerGraficosCreditoApi
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
obtenerGraficosCreditoApi.url = (options?: RouteQueryOptions) => {
    return obtenerGraficosCreditoApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerGraficosCreditoApi
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
obtenerGraficosCreditoApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerGraficosCreditoApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerGraficosCreditoApi
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
obtenerGraficosCreditoApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerGraficosCreditoApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerGraficosCreditoApi
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
    const obtenerGraficosCreditoApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerGraficosCreditoApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerGraficosCreditoApi
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
        obtenerGraficosCreditoApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerGraficosCreditoApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerGraficosCreditoApi
 * @see app/Http/Controllers/ReporteCreditoController.php:159
 * @route '/reportes/credito/graficos'
 */
        obtenerGraficosCreditoApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerGraficosCreditoApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerGraficosCreditoApi.form = obtenerGraficosCreditoApiForm
/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerClientesVencidosApi
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
export const obtenerClientesVencidosApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerClientesVencidosApi.url(options),
    method: 'get',
})

obtenerClientesVencidosApi.definition = {
    methods: ["get","head"],
    url: '/reportes/credito/vencidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerClientesVencidosApi
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
obtenerClientesVencidosApi.url = (options?: RouteQueryOptions) => {
    return obtenerClientesVencidosApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerClientesVencidosApi
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
obtenerClientesVencidosApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerClientesVencidosApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerClientesVencidosApi
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
obtenerClientesVencidosApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerClientesVencidosApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerClientesVencidosApi
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
    const obtenerClientesVencidosApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerClientesVencidosApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerClientesVencidosApi
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
        obtenerClientesVencidosApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerClientesVencidosApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteCreditoController::obtenerClientesVencidosApi
 * @see app/Http/Controllers/ReporteCreditoController.php:237
 * @route '/reportes/credito/vencidos'
 */
        obtenerClientesVencidosApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerClientesVencidosApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerClientesVencidosApi.form = obtenerClientesVencidosApiForm
const ReporteCreditoController = { index, obtenerGraficosCreditoApi, obtenerClientesVencidosApi }

export default ReporteCreditoController