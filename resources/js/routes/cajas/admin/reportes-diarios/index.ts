import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::index
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:24
 * @route '/cajas/admin/reportes-diarios'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/reportes-diarios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::index
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:24
 * @route '/cajas/admin/reportes-diarios'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::index
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:24
 * @route '/cajas/admin/reportes-diarios'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::index
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:24
 * @route '/cajas/admin/reportes-diarios'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::index
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:24
 * @route '/cajas/admin/reportes-diarios'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::index
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:24
 * @route '/cajas/admin/reportes-diarios'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::index
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:24
 * @route '/cajas/admin/reportes-diarios'
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
* @see \App\Http\Controllers\CierreDiarioGeneralController::debug
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:116
 * @route '/cajas/admin/reportes-diarios/{id}/debug'
 */
export const debug = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: debug.url(args, options),
    method: 'get',
})

debug.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/reportes-diarios/{id}/debug',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::debug
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:116
 * @route '/cajas/admin/reportes-diarios/{id}/debug'
 */
debug.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return debug.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::debug
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:116
 * @route '/cajas/admin/reportes-diarios/{id}/debug'
 */
debug.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: debug.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::debug
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:116
 * @route '/cajas/admin/reportes-diarios/{id}/debug'
 */
debug.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: debug.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::debug
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:116
 * @route '/cajas/admin/reportes-diarios/{id}/debug'
 */
    const debugForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: debug.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::debug
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:116
 * @route '/cajas/admin/reportes-diarios/{id}/debug'
 */
        debugForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: debug.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::debug
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:116
 * @route '/cajas/admin/reportes-diarios/{id}/debug'
 */
        debugForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: debug.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    debug.form = debugForm
/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::show
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:164
 * @route '/cajas/admin/reportes-diarios/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/reportes-diarios/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::show
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:164
 * @route '/cajas/admin/reportes-diarios/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::show
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:164
 * @route '/cajas/admin/reportes-diarios/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::show
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:164
 * @route '/cajas/admin/reportes-diarios/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::show
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:164
 * @route '/cajas/admin/reportes-diarios/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::show
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:164
 * @route '/cajas/admin/reportes-diarios/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::show
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:164
 * @route '/cajas/admin/reportes-diarios/{id}'
 */
        showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargar
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:320
 * @route '/cajas/admin/reportes-diarios/{id}/descargar'
 */
export const descargar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargar.url(args, options),
    method: 'get',
})

descargar.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/reportes-diarios/{id}/descargar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargar
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:320
 * @route '/cajas/admin/reportes-diarios/{id}/descargar'
 */
descargar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return descargar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargar
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:320
 * @route '/cajas/admin/reportes-diarios/{id}/descargar'
 */
descargar.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargar
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:320
 * @route '/cajas/admin/reportes-diarios/{id}/descargar'
 */
descargar.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargar
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:320
 * @route '/cajas/admin/reportes-diarios/{id}/descargar'
 */
    const descargarForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descargar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargar
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:320
 * @route '/cajas/admin/reportes-diarios/{id}/descargar'
 */
        descargarForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargar
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:320
 * @route '/cajas/admin/reportes-diarios/{id}/descargar'
 */
        descargarForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descargar.form = descargarForm
/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargarFiltrado
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:358
 * @route '/cajas/admin/reportes-diarios/{id}/descargar-filtrado'
 */
export const descargarFiltrado = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarFiltrado.url(args, options),
    method: 'get',
})

descargarFiltrado.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/reportes-diarios/{id}/descargar-filtrado',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargarFiltrado
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:358
 * @route '/cajas/admin/reportes-diarios/{id}/descargar-filtrado'
 */
descargarFiltrado.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return descargarFiltrado.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargarFiltrado
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:358
 * @route '/cajas/admin/reportes-diarios/{id}/descargar-filtrado'
 */
descargarFiltrado.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargarFiltrado.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargarFiltrado
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:358
 * @route '/cajas/admin/reportes-diarios/{id}/descargar-filtrado'
 */
descargarFiltrado.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargarFiltrado.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargarFiltrado
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:358
 * @route '/cajas/admin/reportes-diarios/{id}/descargar-filtrado'
 */
    const descargarFiltradoForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descargarFiltrado.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargarFiltrado
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:358
 * @route '/cajas/admin/reportes-diarios/{id}/descargar-filtrado'
 */
        descargarFiltradoForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarFiltrado.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CierreDiarioGeneralController::descargarFiltrado
 * @see app/Http/Controllers/CierreDiarioGeneralController.php:358
 * @route '/cajas/admin/reportes-diarios/{id}/descargar-filtrado'
 */
        descargarFiltradoForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargarFiltrado.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descargarFiltrado.form = descargarFiltradoForm
const reportesDiarios = {
    index,
debug,
show,
descargar,
descargarFiltrado,
}

export default reportesDiarios