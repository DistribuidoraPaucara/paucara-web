import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import devoluciones from './devoluciones'
/**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/prestamos/clientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
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
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
export const crear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})

crear.definition = {
    methods: ["get","head"],
    url: '/prestamos/clientes/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
crear.url = (options?: RouteQueryOptions) => {
    return crear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
crear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
crear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: crear.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
    const crearForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: crear.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
        crearForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: crear.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::crear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
        crearForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: crear.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    crear.form = crearForm
/**
* @see \App\Http\Controllers\PrestamosInertiaController::store
 * @see app/Http/Controllers/PrestamosInertiaController.php:81
 * @route '/prestamos/clientes'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/prestamos/clientes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::store
 * @see app/Http/Controllers/PrestamosInertiaController.php:81
 * @route '/prestamos/clientes'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::store
 * @see app/Http/Controllers/PrestamosInertiaController.php:81
 * @route '/prestamos/clientes'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::store
 * @see app/Http/Controllers/PrestamosInertiaController.php:81
 * @route '/prestamos/clientes'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::store
 * @see app/Http/Controllers/PrestamosInertiaController.php:81
 * @route '/prestamos/clientes'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:322
 * @route '/prestamos/clientes/{prestamo}/imprimir'
 */
export const imprimir = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/prestamos/clientes/{prestamo}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:322
 * @route '/prestamos/clientes/{prestamo}/imprimir'
 */
imprimir.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return imprimir.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:322
 * @route '/prestamos/clientes/{prestamo}/imprimir'
 */
imprimir.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:322
 * @route '/prestamos/clientes/{prestamo}/imprimir'
 */
imprimir.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:322
 * @route '/prestamos/clientes/{prestamo}/imprimir'
 */
    const imprimirForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:322
 * @route '/prestamos/clientes/{prestamo}/imprimir'
 */
        imprimirForm.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:322
 * @route '/prestamos/clientes/{prestamo}/imprimir'
 */
        imprimirForm.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir.form = imprimirForm
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/clientes/{prestamo}/devoluciones'
 */
export const devoluciones = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devoluciones.url(args, options),
    method: 'get',
})

devoluciones.definition = {
    methods: ["get","head"],
    url: '/prestamos/clientes/{prestamo}/devoluciones',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/clientes/{prestamo}/devoluciones'
 */
devoluciones.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return devoluciones.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/clientes/{prestamo}/devoluciones'
 */
devoluciones.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devoluciones.url(args, options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/clientes/{prestamo}/devoluciones'
 */
devoluciones.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: devoluciones.url(args, options),
    method: 'head',
})

    /**
 * @see [serialized-closure]:2
 * @route '/prestamos/clientes/{prestamo}/devoluciones'
 */
    const devolucionesForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: devoluciones.url(args, options),
        method: 'get',
    })

            /**
 * @see [serialized-closure]:2
 * @route '/prestamos/clientes/{prestamo}/devoluciones'
 */
        devolucionesForm.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: devoluciones.url(args, options),
            method: 'get',
        })
            /**
 * @see [serialized-closure]:2
 * @route '/prestamos/clientes/{prestamo}/devoluciones'
 */
        devolucionesForm.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: devoluciones.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    devoluciones.form = devolucionesForm
const clientes = {
    index,
crear,
store,
imprimir,
devoluciones,
}

export default clientes