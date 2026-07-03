import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrecioController::listadoApi
 * @see app/Http/Controllers/PrecioController.php:61
 * @route '/api/precios'
 */
export const listadoApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listadoApi.url(options),
    method: 'get',
})

listadoApi.definition = {
    methods: ["get","head"],
    url: '/api/precios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::listadoApi
 * @see app/Http/Controllers/PrecioController.php:61
 * @route '/api/precios'
 */
listadoApi.url = (options?: RouteQueryOptions) => {
    return listadoApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::listadoApi
 * @see app/Http/Controllers/PrecioController.php:61
 * @route '/api/precios'
 */
listadoApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listadoApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::listadoApi
 * @see app/Http/Controllers/PrecioController.php:61
 * @route '/api/precios'
 */
listadoApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listadoApi.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrecioController::mostrarProducto
 * @see app/Http/Controllers/PrecioController.php:252
 * @route '/api/precios/producto/{producto}'
 */
export const mostrarProducto = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mostrarProducto.url(args, options),
    method: 'get',
})

mostrarProducto.definition = {
    methods: ["get","head"],
    url: '/api/precios/producto/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::mostrarProducto
 * @see app/Http/Controllers/PrecioController.php:252
 * @route '/api/precios/producto/{producto}'
 */
mostrarProducto.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return mostrarProducto.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::mostrarProducto
 * @see app/Http/Controllers/PrecioController.php:252
 * @route '/api/precios/producto/{producto}'
 */
mostrarProducto.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mostrarProducto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::mostrarProducto
 * @see app/Http/Controllers/PrecioController.php:252
 * @route '/api/precios/producto/{producto}'
 */
mostrarProducto.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mostrarProducto.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrecioController::obtenerComprasConDiferenciaCosto
 * @see app/Http/Controllers/PrecioController.php:404
 * @route '/api/precios/producto/{productoId}/compras-diferencia-costo'
 */
export const obtenerComprasConDiferenciaCosto = (args: { productoId: string | number } | [productoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerComprasConDiferenciaCosto.url(args, options),
    method: 'get',
})

obtenerComprasConDiferenciaCosto.definition = {
    methods: ["get","head"],
    url: '/api/precios/producto/{productoId}/compras-diferencia-costo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::obtenerComprasConDiferenciaCosto
 * @see app/Http/Controllers/PrecioController.php:404
 * @route '/api/precios/producto/{productoId}/compras-diferencia-costo'
 */
obtenerComprasConDiferenciaCosto.url = (args: { productoId: string | number } | [productoId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { productoId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    productoId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        productoId: args.productoId,
                }

    return obtenerComprasConDiferenciaCosto.definition.url
            .replace('{productoId}', parsedArgs.productoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::obtenerComprasConDiferenciaCosto
 * @see app/Http/Controllers/PrecioController.php:404
 * @route '/api/precios/producto/{productoId}/compras-diferencia-costo'
 */
obtenerComprasConDiferenciaCosto.get = (args: { productoId: string | number } | [productoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerComprasConDiferenciaCosto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::obtenerComprasConDiferenciaCosto
 * @see app/Http/Controllers/PrecioController.php:404
 * @route '/api/precios/producto/{productoId}/compras-diferencia-costo'
 */
obtenerComprasConDiferenciaCosto.head = (args: { productoId: string | number } | [productoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerComprasConDiferenciaCosto.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrecioController::update
 * @see app/Http/Controllers/PrecioController.php:286
 * @route '/api/precios/{precio}'
 */
export const update = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/precios/{precio}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PrecioController::update
 * @see app/Http/Controllers/PrecioController.php:286
 * @route '/api/precios/{precio}'
 */
update.url = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { precio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { precio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    precio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        precio: typeof args.precio === 'object'
                ? args.precio.id
                : args.precio,
                }

    return update.definition.url
            .replace('{precio}', parsedArgs.precio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::update
 * @see app/Http/Controllers/PrecioController.php:286
 * @route '/api/precios/{precio}'
 */
update.put = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PrecioController::historial
 * @see app/Http/Controllers/PrecioController.php:318
 * @route '/api/precios/{precio}/historial'
 */
export const historial = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(args, options),
    method: 'get',
})

historial.definition = {
    methods: ["get","head"],
    url: '/api/precios/{precio}/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::historial
 * @see app/Http/Controllers/PrecioController.php:318
 * @route '/api/precios/{precio}/historial'
 */
historial.url = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { precio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { precio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    precio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        precio: typeof args.precio === 'object'
                ? args.precio.id
                : args.precio,
                }

    return historial.definition.url
            .replace('{precio}', parsedArgs.precio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::historial
 * @see app/Http/Controllers/PrecioController.php:318
 * @route '/api/precios/{precio}/historial'
 */
historial.get = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::historial
 * @see app/Http/Controllers/PrecioController.php:318
 * @route '/api/precios/{precio}/historial'
 */
historial.head = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historial.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrecioController::cambiosRecientes
 * @see app/Http/Controllers/PrecioController.php:337
 * @route '/api/precios/resumen/cambios-recientes'
 */
export const cambiosRecientes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cambiosRecientes.url(options),
    method: 'get',
})

cambiosRecientes.definition = {
    methods: ["get","head"],
    url: '/api/precios/resumen/cambios-recientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::cambiosRecientes
 * @see app/Http/Controllers/PrecioController.php:337
 * @route '/api/precios/resumen/cambios-recientes'
 */
cambiosRecientes.url = (options?: RouteQueryOptions) => {
    return cambiosRecientes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::cambiosRecientes
 * @see app/Http/Controllers/PrecioController.php:337
 * @route '/api/precios/resumen/cambios-recientes'
 */
cambiosRecientes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cambiosRecientes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::cambiosRecientes
 * @see app/Http/Controllers/PrecioController.php:337
 * @route '/api/precios/resumen/cambios-recientes'
 */
cambiosRecientes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cambiosRecientes.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrecioController::resumen
 * @see app/Http/Controllers/PrecioController.php:363
 * @route '/api/precios/resumen'
 */
export const resumen = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(options),
    method: 'get',
})

resumen.definition = {
    methods: ["get","head"],
    url: '/api/precios/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::resumen
 * @see app/Http/Controllers/PrecioController.php:363
 * @route '/api/precios/resumen'
 */
resumen.url = (options?: RouteQueryOptions) => {
    return resumen.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::resumen
 * @see app/Http/Controllers/PrecioController.php:363
 * @route '/api/precios/resumen'
 */
resumen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::resumen
 * @see app/Http/Controllers/PrecioController.php:363
 * @route '/api/precios/resumen'
 */
resumen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumen.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrecioController::actualizarLote
 * @see app/Http/Controllers/PrecioController.php:579
 * @route '/api/precios/actualizar-lote'
 */
export const actualizarLote = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarLote.url(options),
    method: 'post',
})

actualizarLote.definition = {
    methods: ["post"],
    url: '/api/precios/actualizar-lote',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrecioController::actualizarLote
 * @see app/Http/Controllers/PrecioController.php:579
 * @route '/api/precios/actualizar-lote'
 */
actualizarLote.url = (options?: RouteQueryOptions) => {
    return actualizarLote.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::actualizarLote
 * @see app/Http/Controllers/PrecioController.php:579
 * @route '/api/precios/actualizar-lote'
 */
actualizarLote.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarLote.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrecioController::index
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/precios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::index
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::index
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::index
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})
const PrecioController = { listadoApi, mostrarProducto, obtenerComprasConDiferenciaCosto, update, historial, cambiosRecientes, resumen, actualizarLote, index }

export default PrecioController