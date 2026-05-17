import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\VentaController::verificar
 * @see app/Http/Controllers/VentaController.php:1213
 * @route '/ventas/stock/verificar'
 */
export const verificar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verificar.url(options),
    method: 'post',
})

verificar.definition = {
    methods: ["post"],
    url: '/ventas/stock/verificar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::verificar
 * @see app/Http/Controllers/VentaController.php:1213
 * @route '/ventas/stock/verificar'
 */
verificar.url = (options?: RouteQueryOptions) => {
    return verificar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::verificar
 * @see app/Http/Controllers/VentaController.php:1213
 * @route '/ventas/stock/verificar'
 */
verificar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verificar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::verificar
 * @see app/Http/Controllers/VentaController.php:1213
 * @route '/ventas/stock/verificar'
 */
    const verificarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: verificar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::verificar
 * @see app/Http/Controllers/VentaController.php:1213
 * @route '/ventas/stock/verificar'
 */
        verificarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: verificar.url(options),
            method: 'post',
        })
    
    verificar.form = verificarForm
/**
* @see \App\Http\Controllers\VentaController::producto
 * @see app/Http/Controllers/VentaController.php:1175
 * @route '/ventas/stock/producto/{producto}'
 */
export const producto = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: producto.url(args, options),
    method: 'get',
})

producto.definition = {
    methods: ["get","head"],
    url: '/ventas/stock/producto/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::producto
 * @see app/Http/Controllers/VentaController.php:1175
 * @route '/ventas/stock/producto/{producto}'
 */
producto.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { producto: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                }

    return producto.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::producto
 * @see app/Http/Controllers/VentaController.php:1175
 * @route '/ventas/stock/producto/{producto}'
 */
producto.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: producto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::producto
 * @see app/Http/Controllers/VentaController.php:1175
 * @route '/ventas/stock/producto/{producto}'
 */
producto.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: producto.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::producto
 * @see app/Http/Controllers/VentaController.php:1175
 * @route '/ventas/stock/producto/{producto}'
 */
    const productoForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: producto.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::producto
 * @see app/Http/Controllers/VentaController.php:1175
 * @route '/ventas/stock/producto/{producto}'
 */
        productoForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: producto.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::producto
 * @see app/Http/Controllers/VentaController.php:1175
 * @route '/ventas/stock/producto/{producto}'
 */
        productoForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: producto.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    producto.form = productoForm
/**
* @see \App\Http\Controllers\VentaController::bajo
 * @see app/Http/Controllers/VentaController.php:1142
 * @route '/ventas/stock/bajo'
 */
export const bajo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bajo.url(options),
    method: 'get',
})

bajo.definition = {
    methods: ["get","head"],
    url: '/ventas/stock/bajo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::bajo
 * @see app/Http/Controllers/VentaController.php:1142
 * @route '/ventas/stock/bajo'
 */
bajo.url = (options?: RouteQueryOptions) => {
    return bajo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::bajo
 * @see app/Http/Controllers/VentaController.php:1142
 * @route '/ventas/stock/bajo'
 */
bajo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bajo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::bajo
 * @see app/Http/Controllers/VentaController.php:1142
 * @route '/ventas/stock/bajo'
 */
bajo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bajo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::bajo
 * @see app/Http/Controllers/VentaController.php:1142
 * @route '/ventas/stock/bajo'
 */
    const bajoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bajo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::bajo
 * @see app/Http/Controllers/VentaController.php:1142
 * @route '/ventas/stock/bajo'
 */
        bajoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bajo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::bajo
 * @see app/Http/Controllers/VentaController.php:1142
 * @route '/ventas/stock/bajo'
 */
        bajoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bajo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bajo.form = bajoForm
/**
* @see \App\Http\Controllers\VentaController::resumen
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/ventas/{venta}/stock/resumen'
 */
export const resumen = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(args, options),
    method: 'get',
})

resumen.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/stock/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::resumen
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/ventas/{venta}/stock/resumen'
 */
resumen.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return resumen.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::resumen
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/ventas/{venta}/stock/resumen'
 */
resumen.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::resumen
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/ventas/{venta}/stock/resumen'
 */
resumen.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumen.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::resumen
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/ventas/{venta}/stock/resumen'
 */
    const resumenForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resumen.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::resumen
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/ventas/{venta}/stock/resumen'
 */
        resumenForm.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::resumen
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/ventas/{venta}/stock/resumen'
 */
        resumenForm.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    resumen.form = resumenForm
const stock = {
    verificar,
producto,
bajo,
resumen,
}

export default stock