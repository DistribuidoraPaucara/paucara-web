import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import prestamos from './prestamos'
import compras from './compras'
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/proveedores/{prestamo}/devoluciones'
 */
export const devoluciones = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devoluciones.url(args, options),
    method: 'get',
})

devoluciones.definition = {
    methods: ["get","head"],
    url: '/prestamos/proveedores/{prestamo}/devoluciones',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/proveedores/{prestamo}/devoluciones'
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
 * @route '/prestamos/proveedores/{prestamo}/devoluciones'
 */
devoluciones.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: devoluciones.url(args, options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/proveedores/{prestamo}/devoluciones'
 */
devoluciones.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: devoluciones.url(args, options),
    method: 'head',
})

    /**
 * @see [serialized-closure]:2
 * @route '/prestamos/proveedores/{prestamo}/devoluciones'
 */
    const devolucionesForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: devoluciones.url(args, options),
        method: 'get',
    })

            /**
 * @see [serialized-closure]:2
 * @route '/prestamos/proveedores/{prestamo}/devoluciones'
 */
        devolucionesForm.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: devoluciones.url(args, options),
            method: 'get',
        })
            /**
 * @see [serialized-closure]:2
 * @route '/prestamos/proveedores/{prestamo}/devoluciones'
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
/**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/prestamos/proveedores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::index
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
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
* @see \App\Http\Controllers\PrestamosInertiaController::store
 * @see app/Http/Controllers/PrestamosInertiaController.php:217
 * @route '/prestamos/proveedores'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/prestamos/proveedores',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::store
 * @see app/Http/Controllers/PrestamosInertiaController.php:217
 * @route '/prestamos/proveedores'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::store
 * @see app/Http/Controllers/PrestamosInertiaController.php:217
 * @route '/prestamos/proveedores'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::store
 * @see app/Http/Controllers/PrestamosInertiaController.php:217
 * @route '/prestamos/proveedores'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::store
 * @see app/Http/Controllers/PrestamosInertiaController.php:217
 * @route '/prestamos/proveedores'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:237
 * @route '/prestamos/proveedores/{prestamo}/imprimir'
 */
export const imprimir = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/prestamos/proveedores/{prestamo}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:237
 * @route '/prestamos/proveedores/{prestamo}/imprimir'
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
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:237
 * @route '/prestamos/proveedores/{prestamo}/imprimir'
 */
imprimir.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:237
 * @route '/prestamos/proveedores/{prestamo}/imprimir'
 */
imprimir.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:237
 * @route '/prestamos/proveedores/{prestamo}/imprimir'
 */
    const imprimirForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:237
 * @route '/prestamos/proveedores/{prestamo}/imprimir'
 */
        imprimirForm.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:237
 * @route '/prestamos/proveedores/{prestamo}/imprimir'
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
const proveedores = {
    devoluciones,
index,
prestamos,
compras,
store,
imprimir,
}

export default proveedores