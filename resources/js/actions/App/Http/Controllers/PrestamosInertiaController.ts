import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
export const clientesIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientesIndex.url(options),
    method: 'get',
})

clientesIndex.definition = {
    methods: ["get","head"],
    url: '/prestamos/clientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
clientesIndex.url = (options?: RouteQueryOptions) => {
    return clientesIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
clientesIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientesIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
clientesIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: clientesIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
export const clientesCrear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientesCrear.url(options),
    method: 'get',
})

clientesCrear.definition = {
    methods: ["get","head"],
    url: '/prestamos/clientes/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
clientesCrear.url = (options?: RouteQueryOptions) => {
    return clientesCrear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
clientesCrear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientesCrear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
clientesCrear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: clientesCrear.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:111
 * @route '/prestamos/clientes'
 */
export const clientesStore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clientesStore.url(options),
    method: 'post',
})

clientesStore.definition = {
    methods: ["post"],
    url: '/prestamos/clientes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:111
 * @route '/prestamos/clientes'
 */
clientesStore.url = (options?: RouteQueryOptions) => {
    return clientesStore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:111
 * @route '/prestamos/clientes'
 */
clientesStore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clientesStore.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:120
 * @route '/prestamos/proveedores'
 */
export const proveedoresIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedoresIndex.url(options),
    method: 'get',
})

proveedoresIndex.definition = {
    methods: ["get","head"],
    url: '/prestamos/proveedores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:120
 * @route '/prestamos/proveedores'
 */
proveedoresIndex.url = (options?: RouteQueryOptions) => {
    return proveedoresIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:120
 * @route '/prestamos/proveedores'
 */
proveedoresIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedoresIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:120
 * @route '/prestamos/proveedores'
 */
proveedoresIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proveedoresIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresPrestamosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:131
 * @route '/prestamos/proveedores/prestamos/crear'
 */
export const proveedoresPrestamosCrear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedoresPrestamosCrear.url(options),
    method: 'get',
})

proveedoresPrestamosCrear.definition = {
    methods: ["get","head"],
    url: '/prestamos/proveedores/prestamos/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresPrestamosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:131
 * @route '/prestamos/proveedores/prestamos/crear'
 */
proveedoresPrestamosCrear.url = (options?: RouteQueryOptions) => {
    return proveedoresPrestamosCrear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresPrestamosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:131
 * @route '/prestamos/proveedores/prestamos/crear'
 */
proveedoresPrestamosCrear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedoresPrestamosCrear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresPrestamosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:131
 * @route '/prestamos/proveedores/prestamos/crear'
 */
proveedoresPrestamosCrear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proveedoresPrestamosCrear.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresComprasCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:230
 * @route '/prestamos/proveedores/compras/crear'
 */
export const proveedoresComprasCrear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedoresComprasCrear.url(options),
    method: 'get',
})

proveedoresComprasCrear.definition = {
    methods: ["get","head"],
    url: '/prestamos/proveedores/compras/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresComprasCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:230
 * @route '/prestamos/proveedores/compras/crear'
 */
proveedoresComprasCrear.url = (options?: RouteQueryOptions) => {
    return proveedoresComprasCrear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresComprasCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:230
 * @route '/prestamos/proveedores/compras/crear'
 */
proveedoresComprasCrear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedoresComprasCrear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresComprasCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:230
 * @route '/prestamos/proveedores/compras/crear'
 */
proveedoresComprasCrear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proveedoresComprasCrear.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:261
 * @route '/prestamos/proveedores'
 */
export const proveedoresStore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proveedoresStore.url(options),
    method: 'post',
})

proveedoresStore.definition = {
    methods: ["post"],
    url: '/prestamos/proveedores',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:261
 * @route '/prestamos/proveedores'
 */
proveedoresStore.url = (options?: RouteQueryOptions) => {
    return proveedoresStore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:261
 * @route '/prestamos/proveedores'
 */
proveedoresStore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proveedoresStore.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:270
 * @route '/prestamos/eventos'
 */
export const eventosIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventosIndex.url(options),
    method: 'get',
})

eventosIndex.definition = {
    methods: ["get","head"],
    url: '/prestamos/eventos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:270
 * @route '/prestamos/eventos'
 */
eventosIndex.url = (options?: RouteQueryOptions) => {
    return eventosIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:270
 * @route '/prestamos/eventos'
 */
eventosIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventosIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:270
 * @route '/prestamos/eventos'
 */
eventosIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eventosIndex.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:292
 * @route '/prestamos/eventos/crear'
 */
export const eventosCrear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventosCrear.url(options),
    method: 'get',
})

eventosCrear.definition = {
    methods: ["get","head"],
    url: '/prestamos/eventos/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:292
 * @route '/prestamos/eventos/crear'
 */
eventosCrear.url = (options?: RouteQueryOptions) => {
    return eventosCrear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:292
 * @route '/prestamos/eventos/crear'
 */
eventosCrear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventosCrear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:292
 * @route '/prestamos/eventos/crear'
 */
eventosCrear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eventosCrear.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:346
 * @route '/prestamos/eventos'
 */
export const eventosStore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: eventosStore.url(options),
    method: 'post',
})

eventosStore.definition = {
    methods: ["post"],
    url: '/prestamos/eventos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:346
 * @route '/prestamos/eventos'
 */
eventosStore.url = (options?: RouteQueryOptions) => {
    return eventosStore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:346
 * @route '/prestamos/eventos'
 */
eventosStore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: eventosStore.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosShow
 * @see app/Http/Controllers/PrestamosInertiaController.php:355
 * @route '/prestamos/eventos/{prestamo}'
 */
export const eventosShow = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventosShow.url(args, options),
    method: 'get',
})

eventosShow.definition = {
    methods: ["get","head"],
    url: '/prestamos/eventos/{prestamo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosShow
 * @see app/Http/Controllers/PrestamosInertiaController.php:355
 * @route '/prestamos/eventos/{prestamo}'
 */
eventosShow.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return eventosShow.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosShow
 * @see app/Http/Controllers/PrestamosInertiaController.php:355
 * @route '/prestamos/eventos/{prestamo}'
 */
eventosShow.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventosShow.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::eventosShow
 * @see app/Http/Controllers/PrestamosInertiaController.php:355
 * @route '/prestamos/eventos/{prestamo}'
 */
eventosShow.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eventosShow.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:388
 * @route '/prestamos/reportes'
 */
export const reportes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})

reportes.definition = {
    methods: ["get","head"],
    url: '/prestamos/reportes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:388
 * @route '/prestamos/reportes'
 */
reportes.url = (options?: RouteQueryOptions) => {
    return reportes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:388
 * @route '/prestamos/reportes'
 */
reportes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:388
 * @route '/prestamos/reportes'
 */
reportes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportes.url(options),
    method: 'head',
})
const PrestamosInertiaController = { clientesIndex, clientesCrear, clientesStore, proveedoresIndex, proveedoresPrestamosCrear, proveedoresComprasCrear, proveedoresStore, eventosIndex, eventosCrear, eventosStore, eventosShow, reportes }

export default PrestamosInertiaController