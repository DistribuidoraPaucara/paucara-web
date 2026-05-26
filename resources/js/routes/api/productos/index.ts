import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import stock from './stock'
/**
* @see \App\Http\Controllers\ComboController::combos
 * @see app/Http/Controllers/ComboController.php:506
 * @route '/api/productos/{producto}/combos'
 */
export const combos = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: combos.url(args, options),
    method: 'get',
})

combos.definition = {
    methods: ["get","head"],
    url: '/api/productos/{producto}/combos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ComboController::combos
 * @see app/Http/Controllers/ComboController.php:506
 * @route '/api/productos/{producto}/combos'
 */
combos.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return combos.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ComboController::combos
 * @see app/Http/Controllers/ComboController.php:506
 * @route '/api/productos/{producto}/combos'
 */
combos.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: combos.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ComboController::combos
 * @see app/Http/Controllers/ComboController.php:506
 * @route '/api/productos/{producto}/combos'
 */
combos.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: combos.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ComboController::combos
 * @see app/Http/Controllers/ComboController.php:506
 * @route '/api/productos/{producto}/combos'
 */
    const combosForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: combos.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ComboController::combos
 * @see app/Http/Controllers/ComboController.php:506
 * @route '/api/productos/{producto}/combos'
 */
        combosForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: combos.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ComboController::combos
 * @see app/Http/Controllers/ComboController.php:506
 * @route '/api/productos/{producto}/combos'
 */
        combosForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: combos.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    combos.form = combosForm
/**
* @see \App\Http\Controllers\ProductoController::stock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
export const stock = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stock.url(args, options),
    method: 'get',
})

stock.definition = {
    methods: ["get","head"],
    url: '/api/productos/{producto}/stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::stock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
stock.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return stock.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::stock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
stock.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stock.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::stock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
stock.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stock.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::stock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
    const stockForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stock.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::stock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
        stockForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stock.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::stock
 * @see app/Http/Controllers/ProductoController.php:4032
 * @route '/api/productos/{producto}/stock'
 */
        stockForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stock.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stock.form = stockForm
/**
* @see \App\Http\Controllers\ProductoController::buscar
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
export const buscar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscar.url(options),
    method: 'get',
})

buscar.definition = {
    methods: ["get","head"],
    url: '/api/productos/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::buscar
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
buscar.url = (options?: RouteQueryOptions) => {
    return buscar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::buscar
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
buscar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::buscar
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
buscar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscar.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::buscar
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
    const buscarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscar.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::buscar
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
        buscarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscar.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::buscar
 * @see app/Http/Controllers/ProductoController.php:2196
 * @route '/api/productos/buscar'
 */
        buscarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscar.form = buscarForm
const productos = {
    combos,
stock,
buscar,
}

export default productos