import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/compras/lotes-vencimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
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
* @see \App\Http\Controllers\LoteVencimientoController::actualizarEstado
 * @see app/Http/Controllers/LoteVencimientoController.php:64
 * @route '/compras/lotes-vencimientos/{lote}/actualizar-estado'
 */
export const actualizarEstado = (args: { lote: number | { id: number } } | [lote: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEstado.url(args, options),
    method: 'patch',
})

actualizarEstado.definition = {
    methods: ["patch"],
    url: '/compras/lotes-vencimientos/{lote}/actualizar-estado',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarEstado
 * @see app/Http/Controllers/LoteVencimientoController.php:64
 * @route '/compras/lotes-vencimientos/{lote}/actualizar-estado'
 */
actualizarEstado.url = (args: { lote: number | { id: number } } | [lote: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lote: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lote: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lote: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lote: typeof args.lote === 'object'
                ? args.lote.id
                : args.lote,
                }

    return actualizarEstado.definition.url
            .replace('{lote}', parsedArgs.lote.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarEstado
 * @see app/Http/Controllers/LoteVencimientoController.php:64
 * @route '/compras/lotes-vencimientos/{lote}/actualizar-estado'
 */
actualizarEstado.patch = (args: { lote: number | { id: number } } | [lote: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEstado.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarEstado
 * @see app/Http/Controllers/LoteVencimientoController.php:64
 * @route '/compras/lotes-vencimientos/{lote}/actualizar-estado'
 */
    const actualizarEstadoForm = (args: { lote: number | { id: number } } | [lote: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarEstado.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarEstado
 * @see app/Http/Controllers/LoteVencimientoController.php:64
 * @route '/compras/lotes-vencimientos/{lote}/actualizar-estado'
 */
        actualizarEstadoForm.patch = (args: { lote: number | { id: number } } | [lote: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarEstado.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarEstado.form = actualizarEstadoForm
/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarCantidad
 * @see app/Http/Controllers/LoteVencimientoController.php:77
 * @route '/compras/lotes-vencimientos/{lote}/cantidad'
 */
export const actualizarCantidad = (args: { lote: number | { id: number } } | [lote: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarCantidad.url(args, options),
    method: 'patch',
})

actualizarCantidad.definition = {
    methods: ["patch"],
    url: '/compras/lotes-vencimientos/{lote}/cantidad',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarCantidad
 * @see app/Http/Controllers/LoteVencimientoController.php:77
 * @route '/compras/lotes-vencimientos/{lote}/cantidad'
 */
actualizarCantidad.url = (args: { lote: number | { id: number } } | [lote: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lote: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { lote: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    lote: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lote: typeof args.lote === 'object'
                ? args.lote.id
                : args.lote,
                }

    return actualizarCantidad.definition.url
            .replace('{lote}', parsedArgs.lote.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarCantidad
 * @see app/Http/Controllers/LoteVencimientoController.php:77
 * @route '/compras/lotes-vencimientos/{lote}/cantidad'
 */
actualizarCantidad.patch = (args: { lote: number | { id: number } } | [lote: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarCantidad.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarCantidad
 * @see app/Http/Controllers/LoteVencimientoController.php:77
 * @route '/compras/lotes-vencimientos/{lote}/cantidad'
 */
    const actualizarCantidadForm = (args: { lote: number | { id: number } } | [lote: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarCantidad.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarCantidad
 * @see app/Http/Controllers/LoteVencimientoController.php:77
 * @route '/compras/lotes-vencimientos/{lote}/cantidad'
 */
        actualizarCantidadForm.patch = (args: { lote: number | { id: number } } | [lote: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarCantidad.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarCantidad.form = actualizarCantidadForm
/**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:95
 * @route '/compras/lotes-vencimientos/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/compras/lotes-vencimientos/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:95
 * @route '/compras/lotes-vencimientos/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:95
 * @route '/compras/lotes-vencimientos/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:95
 * @route '/compras/lotes-vencimientos/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:95
 * @route '/compras/lotes-vencimientos/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:95
 * @route '/compras/lotes-vencimientos/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:95
 * @route '/compras/lotes-vencimientos/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
const lotesVencimientos = {
    index,
actualizarEstado,
actualizarCantidad,
export: exportMethod,
}

export default lotesVencimientos