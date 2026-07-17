import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
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
const lotesVencimientos = {
    index,
actualizarEstado,
actualizarCantidad,
export: exportMethod,
}

export default lotesVencimientos