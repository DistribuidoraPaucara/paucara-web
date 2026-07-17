import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupCliente
 * @see app/Http/Controllers/Api/ApiVentaController.php:24
 * @route '/api/ventas/{venta}/confirmar-pickup-cliente'
 */
export const confirmarPickupCliente = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarPickupCliente.url(args, options),
    method: 'post',
})

confirmarPickupCliente.definition = {
    methods: ["post"],
    url: '/api/ventas/{venta}/confirmar-pickup-cliente',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupCliente
 * @see app/Http/Controllers/Api/ApiVentaController.php:24
 * @route '/api/ventas/{venta}/confirmar-pickup-cliente'
 */
confirmarPickupCliente.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return confirmarPickupCliente.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupCliente
 * @see app/Http/Controllers/Api/ApiVentaController.php:24
 * @route '/api/ventas/{venta}/confirmar-pickup-cliente'
 */
confirmarPickupCliente.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarPickupCliente.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupEmpleado
 * @see app/Http/Controllers/Api/ApiVentaController.php:121
 * @route '/api/ventas/{venta}/confirmar-pickup-empleado'
 */
export const confirmarPickupEmpleado = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarPickupEmpleado.url(args, options),
    method: 'post',
})

confirmarPickupEmpleado.definition = {
    methods: ["post"],
    url: '/api/ventas/{venta}/confirmar-pickup-empleado',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupEmpleado
 * @see app/Http/Controllers/Api/ApiVentaController.php:121
 * @route '/api/ventas/{venta}/confirmar-pickup-empleado'
 */
confirmarPickupEmpleado.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return confirmarPickupEmpleado.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiVentaController::confirmarPickupEmpleado
 * @see app/Http/Controllers/Api/ApiVentaController.php:121
 * @route '/api/ventas/{venta}/confirmar-pickup-empleado'
 */
confirmarPickupEmpleado.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarPickupEmpleado.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\ApiVentaController::registrarEnCaja
 * @see app/Http/Controllers/Api/ApiVentaController.php:214
 * @route '/api/ventas/{venta}/registrar-en-caja'
 */
export const registrarEnCaja = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarEnCaja.url(args, options),
    method: 'post',
})

registrarEnCaja.definition = {
    methods: ["post"],
    url: '/api/ventas/{venta}/registrar-en-caja',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ApiVentaController::registrarEnCaja
 * @see app/Http/Controllers/Api/ApiVentaController.php:214
 * @route '/api/ventas/{venta}/registrar-en-caja'
 */
registrarEnCaja.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return registrarEnCaja.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiVentaController::registrarEnCaja
 * @see app/Http/Controllers/Api/ApiVentaController.php:214
 * @route '/api/ventas/{venta}/registrar-en-caja'
 */
registrarEnCaja.post = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarEnCaja.url(args, options),
    method: 'post',
})
const ApiVentaController = { confirmarPickupCliente, confirmarPickupEmpleado, registrarEnCaja }

export default ApiVentaController