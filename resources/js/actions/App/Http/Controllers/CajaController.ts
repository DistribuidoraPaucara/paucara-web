import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/user/{userId}'
 */
const index50a79801a626bb016ffd4370b1aecf6d = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index50a79801a626bb016ffd4370b1aecf6d.url(args, options),
    method: 'get',
})

index50a79801a626bb016ffd4370b1aecf6d.definition = {
    methods: ["get","head"],
    url: '/cajas/user/{userId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/user/{userId}'
 */
index50a79801a626bb016ffd4370b1aecf6d.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    userId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userId: args.userId,
                }

    return index50a79801a626bb016ffd4370b1aecf6d.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/user/{userId}'
 */
index50a79801a626bb016ffd4370b1aecf6d.get = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index50a79801a626bb016ffd4370b1aecf6d.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/user/{userId}'
 */
index50a79801a626bb016ffd4370b1aecf6d.head = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index50a79801a626bb016ffd4370b1aecf6d.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/{aperturaCaja}'
 */
const index44b3fd2764c84a205ac9d7f7cdcb2ebc = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index44b3fd2764c84a205ac9d7f7cdcb2ebc.url(args, options),
    method: 'get',
})

index44b3fd2764c84a205ac9d7f7cdcb2ebc.definition = {
    methods: ["get","head"],
    url: '/cajas/{aperturaCaja}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/{aperturaCaja}'
 */
index44b3fd2764c84a205ac9d7f7cdcb2ebc.url = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aperturaCaja: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { aperturaCaja: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    aperturaCaja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        aperturaCaja: typeof args.aperturaCaja === 'object'
                ? args.aperturaCaja.id
                : args.aperturaCaja,
                }

    return index44b3fd2764c84a205ac9d7f7cdcb2ebc.definition.url
            .replace('{aperturaCaja}', parsedArgs.aperturaCaja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/{aperturaCaja}'
 */
index44b3fd2764c84a205ac9d7f7cdcb2ebc.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index44b3fd2764c84a205ac9d7f7cdcb2ebc.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/{aperturaCaja}'
 */
index44b3fd2764c84a205ac9d7f7cdcb2ebc.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index44b3fd2764c84a205ac9d7f7cdcb2ebc.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas'
 */
const indexb0735af074a62eedbe1f0ee331fec630 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb0735af074a62eedbe1f0ee331fec630.url(options),
    method: 'get',
})

indexb0735af074a62eedbe1f0ee331fec630.definition = {
    methods: ["get","head"],
    url: '/cajas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas'
 */
indexb0735af074a62eedbe1f0ee331fec630.url = (options?: RouteQueryOptions) => {
    return indexb0735af074a62eedbe1f0ee331fec630.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas'
 */
indexb0735af074a62eedbe1f0ee331fec630.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb0735af074a62eedbe1f0ee331fec630.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas'
 */
indexb0735af074a62eedbe1f0ee331fec630.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexb0735af074a62eedbe1f0ee331fec630.url(options),
    method: 'head',
})

export const index = {
    '/cajas/user/{userId}': index50a79801a626bb016ffd4370b1aecf6d,
    '/cajas/{aperturaCaja}': index44b3fd2764c84a205ac9d7f7cdcb2ebc,
    '/cajas': indexb0735af074a62eedbe1f0ee331fec630,
}

/**
* @see \App\Http\Controllers\CajaController::abrirCaja
 * @see app/Http/Controllers/CajaController.php:419
 * @route '/cajas/abrir'
 */
const abrirCaja34804058a157f421867dccd569082d60 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: abrirCaja34804058a157f421867dccd569082d60.url(options),
    method: 'post',
})

abrirCaja34804058a157f421867dccd569082d60.definition = {
    methods: ["post"],
    url: '/cajas/abrir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::abrirCaja
 * @see app/Http/Controllers/CajaController.php:419
 * @route '/cajas/abrir'
 */
abrirCaja34804058a157f421867dccd569082d60.url = (options?: RouteQueryOptions) => {
    return abrirCaja34804058a157f421867dccd569082d60.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::abrirCaja
 * @see app/Http/Controllers/CajaController.php:419
 * @route '/cajas/abrir'
 */
abrirCaja34804058a157f421867dccd569082d60.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: abrirCaja34804058a157f421867dccd569082d60.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CajaController::abrirCaja
 * @see app/Http/Controllers/CajaController.php:419
 * @route '/cajas/admin/cajas/{userId}/abrir'
 */
const abrirCaja6d3a137bd3f51a8b2fa0342fee723fe2 = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: abrirCaja6d3a137bd3f51a8b2fa0342fee723fe2.url(args, options),
    method: 'post',
})

abrirCaja6d3a137bd3f51a8b2fa0342fee723fe2.definition = {
    methods: ["post"],
    url: '/cajas/admin/cajas/{userId}/abrir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::abrirCaja
 * @see app/Http/Controllers/CajaController.php:419
 * @route '/cajas/admin/cajas/{userId}/abrir'
 */
abrirCaja6d3a137bd3f51a8b2fa0342fee723fe2.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    userId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userId: args.userId,
                }

    return abrirCaja6d3a137bd3f51a8b2fa0342fee723fe2.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::abrirCaja
 * @see app/Http/Controllers/CajaController.php:419
 * @route '/cajas/admin/cajas/{userId}/abrir'
 */
abrirCaja6d3a137bd3f51a8b2fa0342fee723fe2.post = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: abrirCaja6d3a137bd3f51a8b2fa0342fee723fe2.url(args, options),
    method: 'post',
})

export const abrirCaja = {
    '/cajas/abrir': abrirCaja34804058a157f421867dccd569082d60,
    '/cajas/admin/cajas/{userId}/abrir': abrirCaja6d3a137bd3f51a8b2fa0342fee723fe2,
}

/**
* @see \App\Http\Controllers\CajaController::cerrarCaja
 * @see app/Http/Controllers/CajaController.php:515
 * @route '/cajas/cerrar'
 */
const cerrarCaja73c5abd5919c72672abb0e5a48540a5a = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cerrarCaja73c5abd5919c72672abb0e5a48540a5a.url(options),
    method: 'post',
})

cerrarCaja73c5abd5919c72672abb0e5a48540a5a.definition = {
    methods: ["post"],
    url: '/cajas/cerrar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::cerrarCaja
 * @see app/Http/Controllers/CajaController.php:515
 * @route '/cajas/cerrar'
 */
cerrarCaja73c5abd5919c72672abb0e5a48540a5a.url = (options?: RouteQueryOptions) => {
    return cerrarCaja73c5abd5919c72672abb0e5a48540a5a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::cerrarCaja
 * @see app/Http/Controllers/CajaController.php:515
 * @route '/cajas/cerrar'
 */
cerrarCaja73c5abd5919c72672abb0e5a48540a5a.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cerrarCaja73c5abd5919c72672abb0e5a48540a5a.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CajaController::cerrarCaja
 * @see app/Http/Controllers/CajaController.php:515
 * @route '/cajas/admin/cajas/{userId}/cerrar'
 */
const cerrarCajaef3fe8974d016ca2e1977bd82b3208ba = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cerrarCajaef3fe8974d016ca2e1977bd82b3208ba.url(args, options),
    method: 'post',
})

cerrarCajaef3fe8974d016ca2e1977bd82b3208ba.definition = {
    methods: ["post"],
    url: '/cajas/admin/cajas/{userId}/cerrar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::cerrarCaja
 * @see app/Http/Controllers/CajaController.php:515
 * @route '/cajas/admin/cajas/{userId}/cerrar'
 */
cerrarCajaef3fe8974d016ca2e1977bd82b3208ba.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    userId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userId: args.userId,
                }

    return cerrarCajaef3fe8974d016ca2e1977bd82b3208ba.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::cerrarCaja
 * @see app/Http/Controllers/CajaController.php:515
 * @route '/cajas/admin/cajas/{userId}/cerrar'
 */
cerrarCajaef3fe8974d016ca2e1977bd82b3208ba.post = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cerrarCajaef3fe8974d016ca2e1977bd82b3208ba.url(args, options),
    method: 'post',
})

export const cerrarCaja = {
    '/cajas/cerrar': cerrarCaja73c5abd5919c72672abb0e5a48540a5a,
    '/cajas/admin/cajas/{userId}/cerrar': cerrarCajaef3fe8974d016ca2e1977bd82b3208ba,
}

/**
* @see \App\Http\Controllers\CajaController::movimientosDia
 * @see app/Http/Controllers/CajaController.php:789
 * @route '/cajas/movimientos'
 */
const movimientosDia21e08be6727f5824ba332059b26c82b0 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosDia21e08be6727f5824ba332059b26c82b0.url(options),
    method: 'get',
})

movimientosDia21e08be6727f5824ba332059b26c82b0.definition = {
    methods: ["get","head"],
    url: '/cajas/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::movimientosDia
 * @see app/Http/Controllers/CajaController.php:789
 * @route '/cajas/movimientos'
 */
movimientosDia21e08be6727f5824ba332059b26c82b0.url = (options?: RouteQueryOptions) => {
    return movimientosDia21e08be6727f5824ba332059b26c82b0.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::movimientosDia
 * @see app/Http/Controllers/CajaController.php:789
 * @route '/cajas/movimientos'
 */
movimientosDia21e08be6727f5824ba332059b26c82b0.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosDia21e08be6727f5824ba332059b26c82b0.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::movimientosDia
 * @see app/Http/Controllers/CajaController.php:789
 * @route '/cajas/movimientos'
 */
movimientosDia21e08be6727f5824ba332059b26c82b0.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientosDia21e08be6727f5824ba332059b26c82b0.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::movimientosDia
 * @see app/Http/Controllers/CajaController.php:789
 * @route '/cajas/admin/cajas/{userId}/movimientos'
 */
const movimientosDia89c8f564b60506fa6f0e0986f6f4a6d0 = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosDia89c8f564b60506fa6f0e0986f6f4a6d0.url(args, options),
    method: 'get',
})

movimientosDia89c8f564b60506fa6f0e0986f6f4a6d0.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/cajas/{userId}/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::movimientosDia
 * @see app/Http/Controllers/CajaController.php:789
 * @route '/cajas/admin/cajas/{userId}/movimientos'
 */
movimientosDia89c8f564b60506fa6f0e0986f6f4a6d0.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    userId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userId: args.userId,
                }

    return movimientosDia89c8f564b60506fa6f0e0986f6f4a6d0.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::movimientosDia
 * @see app/Http/Controllers/CajaController.php:789
 * @route '/cajas/admin/cajas/{userId}/movimientos'
 */
movimientosDia89c8f564b60506fa6f0e0986f6f4a6d0.get = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosDia89c8f564b60506fa6f0e0986f6f4a6d0.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::movimientosDia
 * @see app/Http/Controllers/CajaController.php:789
 * @route '/cajas/admin/cajas/{userId}/movimientos'
 */
movimientosDia89c8f564b60506fa6f0e0986f6f4a6d0.head = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientosDia89c8f564b60506fa6f0e0986f6f4a6d0.url(args, options),
    method: 'head',
})

export const movimientosDia = {
    '/cajas/movimientos': movimientosDia21e08be6727f5824ba332059b26c82b0,
    '/cajas/admin/cajas/{userId}/movimientos': movimientosDia89c8f564b60506fa6f0e0986f6f4a6d0,
}

/**
* @see \App\Http\Controllers\CajaController::registrarMovimiento
 * @see app/Http/Controllers/CajaController.php:1618
 * @route '/cajas/movimientos'
 */
export const registrarMovimiento = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarMovimiento.url(options),
    method: 'post',
})

registrarMovimiento.definition = {
    methods: ["post"],
    url: '/cajas/movimientos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::registrarMovimiento
 * @see app/Http/Controllers/CajaController.php:1618
 * @route '/cajas/movimientos'
 */
registrarMovimiento.url = (options?: RouteQueryOptions) => {
    return registrarMovimiento.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::registrarMovimiento
 * @see app/Http/Controllers/CajaController.php:1618
 * @route '/cajas/movimientos'
 */
registrarMovimiento.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarMovimiento.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CajaController::registrarMovimientoJson
 * @see app/Http/Controllers/CajaController.php:1736
 * @route '/cajas/movimientos-json'
 */
export const registrarMovimientoJson = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarMovimientoJson.url(options),
    method: 'post',
})

registrarMovimientoJson.definition = {
    methods: ["post"],
    url: '/cajas/movimientos-json',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::registrarMovimientoJson
 * @see app/Http/Controllers/CajaController.php:1736
 * @route '/cajas/movimientos-json'
 */
registrarMovimientoJson.url = (options?: RouteQueryOptions) => {
    return registrarMovimientoJson.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::registrarMovimientoJson
 * @see app/Http/Controllers/CajaController.php:1736
 * @route '/cajas/movimientos-json'
 */
registrarMovimientoJson.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarMovimientoJson.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CajaController::movimientosApertura
 * @see app/Http/Controllers/CajaController.php:837
 * @route '/cajas/apertura/{aperturaId}/movimientos'
 */
export const movimientosApertura = (args: { aperturaId: string | number } | [aperturaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosApertura.url(args, options),
    method: 'get',
})

movimientosApertura.definition = {
    methods: ["get","head"],
    url: '/cajas/apertura/{aperturaId}/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::movimientosApertura
 * @see app/Http/Controllers/CajaController.php:837
 * @route '/cajas/apertura/{aperturaId}/movimientos'
 */
movimientosApertura.url = (args: { aperturaId: string | number } | [aperturaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aperturaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    aperturaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        aperturaId: args.aperturaId,
                }

    return movimientosApertura.definition.url
            .replace('{aperturaId}', parsedArgs.aperturaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::movimientosApertura
 * @see app/Http/Controllers/CajaController.php:837
 * @route '/cajas/apertura/{aperturaId}/movimientos'
 */
movimientosApertura.get = (args: { aperturaId: string | number } | [aperturaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosApertura.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::movimientosApertura
 * @see app/Http/Controllers/CajaController.php:837
 * @route '/cajas/apertura/{aperturaId}/movimientos'
 */
movimientosApertura.head = (args: { aperturaId: string | number } | [aperturaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientosApertura.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CajaController::imprimirCierre
 * @see app/Http/Controllers/CajaController.php:1854
 * @route '/cajas/{aperturaCaja}/cierre/imprimir'
 */
export const imprimirCierre = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirCierre.url(args, options),
    method: 'get',
})

imprimirCierre.definition = {
    methods: ["get","head"],
    url: '/cajas/{aperturaCaja}/cierre/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::imprimirCierre
 * @see app/Http/Controllers/CajaController.php:1854
 * @route '/cajas/{aperturaCaja}/cierre/imprimir'
 */
imprimirCierre.url = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aperturaCaja: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { aperturaCaja: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    aperturaCaja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        aperturaCaja: typeof args.aperturaCaja === 'object'
                ? args.aperturaCaja.id
                : args.aperturaCaja,
                }

    return imprimirCierre.definition.url
            .replace('{aperturaCaja}', parsedArgs.aperturaCaja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::imprimirCierre
 * @see app/Http/Controllers/CajaController.php:1854
 * @route '/cajas/{aperturaCaja}/cierre/imprimir'
 */
imprimirCierre.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirCierre.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::imprimirCierre
 * @see app/Http/Controllers/CajaController.php:1854
 * @route '/cajas/{aperturaCaja}/cierre/imprimir'
 */
imprimirCierre.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirCierre.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CajaController::exportarExcelCierre
 * @see app/Http/Controllers/CajaController.php:1886
 * @route '/cajas/{aperturaCaja}/cierre/exportar-excel'
 */
export const exportarExcelCierre = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcelCierre.url(args, options),
    method: 'get',
})

exportarExcelCierre.definition = {
    methods: ["get","head"],
    url: '/cajas/{aperturaCaja}/cierre/exportar-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::exportarExcelCierre
 * @see app/Http/Controllers/CajaController.php:1886
 * @route '/cajas/{aperturaCaja}/cierre/exportar-excel'
 */
exportarExcelCierre.url = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aperturaCaja: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { aperturaCaja: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    aperturaCaja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        aperturaCaja: typeof args.aperturaCaja === 'object'
                ? args.aperturaCaja.id
                : args.aperturaCaja,
                }

    return exportarExcelCierre.definition.url
            .replace('{aperturaCaja}', parsedArgs.aperturaCaja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::exportarExcelCierre
 * @see app/Http/Controllers/CajaController.php:1886
 * @route '/cajas/{aperturaCaja}/cierre/exportar-excel'
 */
exportarExcelCierre.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcelCierre.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::exportarExcelCierre
 * @see app/Http/Controllers/CajaController.php:1886
 * @route '/cajas/{aperturaCaja}/cierre/exportar-excel'
 */
exportarExcelCierre.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarExcelCierre.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CajaController::obtenerDatosCierre
 * @see app/Http/Controllers/CajaController.php:666
 * @route '/cajas/{aperturaCaja}/datos-cierre'
 */
export const obtenerDatosCierre = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDatosCierre.url(args, options),
    method: 'get',
})

obtenerDatosCierre.definition = {
    methods: ["get","head"],
    url: '/cajas/{aperturaCaja}/datos-cierre',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::obtenerDatosCierre
 * @see app/Http/Controllers/CajaController.php:666
 * @route '/cajas/{aperturaCaja}/datos-cierre'
 */
obtenerDatosCierre.url = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aperturaCaja: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { aperturaCaja: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    aperturaCaja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        aperturaCaja: typeof args.aperturaCaja === 'object'
                ? args.aperturaCaja.id
                : args.aperturaCaja,
                }

    return obtenerDatosCierre.definition.url
            .replace('{aperturaCaja}', parsedArgs.aperturaCaja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::obtenerDatosCierre
 * @see app/Http/Controllers/CajaController.php:666
 * @route '/cajas/{aperturaCaja}/datos-cierre'
 */
obtenerDatosCierre.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDatosCierre.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::obtenerDatosCierre
 * @see app/Http/Controllers/CajaController.php:666
 * @route '/cajas/{aperturaCaja}/datos-cierre'
 */
obtenerDatosCierre.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerDatosCierre.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CajaController::imprimirMovimientos
 * @see app/Http/Controllers/CajaController.php:1939
 * @route '/cajas/{aperturaCaja}/movimientos/imprimir'
 */
export const imprimirMovimientos = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirMovimientos.url(args, options),
    method: 'get',
})

imprimirMovimientos.definition = {
    methods: ["get","head"],
    url: '/cajas/{aperturaCaja}/movimientos/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::imprimirMovimientos
 * @see app/Http/Controllers/CajaController.php:1939
 * @route '/cajas/{aperturaCaja}/movimientos/imprimir'
 */
imprimirMovimientos.url = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aperturaCaja: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { aperturaCaja: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    aperturaCaja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        aperturaCaja: typeof args.aperturaCaja === 'object'
                ? args.aperturaCaja.id
                : args.aperturaCaja,
                }

    return imprimirMovimientos.definition.url
            .replace('{aperturaCaja}', parsedArgs.aperturaCaja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::imprimirMovimientos
 * @see app/Http/Controllers/CajaController.php:1939
 * @route '/cajas/{aperturaCaja}/movimientos/imprimir'
 */
imprimirMovimientos.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirMovimientos.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::imprimirMovimientos
 * @see app/Http/Controllers/CajaController.php:1939
 * @route '/cajas/{aperturaCaja}/movimientos/imprimir'
 */
imprimirMovimientos.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirMovimientos.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CajaController::imprimirMovimiento
 * @see app/Http/Controllers/CajaController.php:2053
 * @route '/cajas/movimiento/{movimiento}/imprimir'
 */
export const imprimirMovimiento = (args: { movimiento: number | { id: number } } | [movimiento: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirMovimiento.url(args, options),
    method: 'get',
})

imprimirMovimiento.definition = {
    methods: ["get","head"],
    url: '/cajas/movimiento/{movimiento}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::imprimirMovimiento
 * @see app/Http/Controllers/CajaController.php:2053
 * @route '/cajas/movimiento/{movimiento}/imprimir'
 */
imprimirMovimiento.url = (args: { movimiento: number | { id: number } } | [movimiento: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { movimiento: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { movimiento: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    movimiento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        movimiento: typeof args.movimiento === 'object'
                ? args.movimiento.id
                : args.movimiento,
                }

    return imprimirMovimiento.definition.url
            .replace('{movimiento}', parsedArgs.movimiento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::imprimirMovimiento
 * @see app/Http/Controllers/CajaController.php:2053
 * @route '/cajas/movimiento/{movimiento}/imprimir'
 */
imprimirMovimiento.get = (args: { movimiento: number | { id: number } } | [movimiento: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirMovimiento.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::imprimirMovimiento
 * @see app/Http/Controllers/CajaController.php:2053
 * @route '/cajas/movimiento/{movimiento}/imprimir'
 */
imprimirMovimiento.head = (args: { movimiento: number | { id: number } } | [movimiento: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirMovimiento.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CajaController::eliminarMovimiento
 * @see app/Http/Controllers/CajaController.php:2098
 * @route '/cajas/movimiento/{movimiento}/eliminar'
 */
export const eliminarMovimiento = (args: { movimiento: number | { id: number } } | [movimiento: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarMovimiento.url(args, options),
    method: 'delete',
})

eliminarMovimiento.definition = {
    methods: ["delete"],
    url: '/cajas/movimiento/{movimiento}/eliminar',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CajaController::eliminarMovimiento
 * @see app/Http/Controllers/CajaController.php:2098
 * @route '/cajas/movimiento/{movimiento}/eliminar'
 */
eliminarMovimiento.url = (args: { movimiento: number | { id: number } } | [movimiento: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { movimiento: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { movimiento: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    movimiento: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        movimiento: typeof args.movimiento === 'object'
                ? args.movimiento.id
                : args.movimiento,
                }

    return eliminarMovimiento.definition.url
            .replace('{movimiento}', parsedArgs.movimiento.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::eliminarMovimiento
 * @see app/Http/Controllers/CajaController.php:2098
 * @route '/cajas/movimiento/{movimiento}/eliminar'
 */
eliminarMovimiento.delete = (args: { movimiento: number | { id: number } } | [movimiento: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarMovimiento.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1992
 * @route '/cajas/{caja}/movimientos/exportar-excel'
 */
export const exportarExcel = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})

exportarExcel.definition = {
    methods: ["get","head"],
    url: '/cajas/{caja}/movimientos/exportar-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1992
 * @route '/cajas/{caja}/movimientos/exportar-excel'
 */
exportarExcel.url = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { caja: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { caja: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        caja: typeof args.caja === 'object'
                ? args.caja.id
                : args.caja,
                }

    return exportarExcel.definition.url
            .replace('{caja}', parsedArgs.caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1992
 * @route '/cajas/{caja}/movimientos/exportar-excel'
 */
exportarExcel.get = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1992
 * @route '/cajas/{caja}/movimientos/exportar-excel'
 */
exportarExcel.head = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarExcel.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CajaController::exportarPdf
 * @see app/Http/Controllers/CajaController.php:2014
 * @route '/cajas/{caja}/movimientos/exportar-pdf'
 */
export const exportarPdf = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})

exportarPdf.definition = {
    methods: ["get","head"],
    url: '/cajas/{caja}/movimientos/exportar-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::exportarPdf
 * @see app/Http/Controllers/CajaController.php:2014
 * @route '/cajas/{caja}/movimientos/exportar-pdf'
 */
exportarPdf.url = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { caja: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { caja: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        caja: typeof args.caja === 'object'
                ? args.caja.id
                : args.caja,
                }

    return exportarPdf.definition.url
            .replace('{caja}', parsedArgs.caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::exportarPdf
 * @see app/Http/Controllers/CajaController.php:2014
 * @route '/cajas/{caja}/movimientos/exportar-pdf'
 */
exportarPdf.get = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::exportarPdf
 * @see app/Http/Controllers/CajaController.php:2014
 * @route '/cajas/{caja}/movimientos/exportar-pdf'
 */
exportarPdf.head = (args: { caja: number | { id: number } } | [caja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarPdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CajaController::resumenPorTipoPago
 * @see app/Http/Controllers/CajaController.php:2156
 * @route '/cajas/resumen/por-tipo-pago'
 */
export const resumenPorTipoPago = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumenPorTipoPago.url(options),
    method: 'get',
})

resumenPorTipoPago.definition = {
    methods: ["get","head"],
    url: '/cajas/resumen/por-tipo-pago',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::resumenPorTipoPago
 * @see app/Http/Controllers/CajaController.php:2156
 * @route '/cajas/resumen/por-tipo-pago'
 */
resumenPorTipoPago.url = (options?: RouteQueryOptions) => {
    return resumenPorTipoPago.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::resumenPorTipoPago
 * @see app/Http/Controllers/CajaController.php:2156
 * @route '/cajas/resumen/por-tipo-pago'
 */
resumenPorTipoPago.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumenPorTipoPago.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::resumenPorTipoPago
 * @see app/Http/Controllers/CajaController.php:2156
 * @route '/cajas/resumen/por-tipo-pago'
 */
resumenPorTipoPago.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumenPorTipoPago.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CajaController::dashboard
 * @see app/Http/Controllers/CajaController.php:911
 * @route '/cajas/admin/dashboard'
 */
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::dashboard
 * @see app/Http/Controllers/CajaController.php:911
 * @route '/cajas/admin/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::dashboard
 * @see app/Http/Controllers/CajaController.php:911
 * @route '/cajas/admin/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::dashboard
 * @see app/Http/Controllers/CajaController.php:911
 * @route '/cajas/admin/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CajaController::cierreDiarioGeneral
 * @see app/Http/Controllers/CajaController.php:1451
 * @route '/cajas/admin/cierre-diario'
 */
export const cierreDiarioGeneral = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cierreDiarioGeneral.url(options),
    method: 'post',
})

cierreDiarioGeneral.definition = {
    methods: ["post"],
    url: '/cajas/admin/cierre-diario',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::cierreDiarioGeneral
 * @see app/Http/Controllers/CajaController.php:1451
 * @route '/cajas/admin/cierre-diario'
 */
cierreDiarioGeneral.url = (options?: RouteQueryOptions) => {
    return cierreDiarioGeneral.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::cierreDiarioGeneral
 * @see app/Http/Controllers/CajaController.php:1451
 * @route '/cajas/admin/cierre-diario'
 */
cierreDiarioGeneral.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cierreDiarioGeneral.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CajaController::cierreDiarioGeneralJson
 * @see app/Http/Controllers/CajaController.php:1271
 * @route '/cajas/admin/cierre-diario-json'
 */
export const cierreDiarioGeneralJson = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cierreDiarioGeneralJson.url(options),
    method: 'post',
})

cierreDiarioGeneralJson.definition = {
    methods: ["post"],
    url: '/cajas/admin/cierre-diario-json',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::cierreDiarioGeneralJson
 * @see app/Http/Controllers/CajaController.php:1271
 * @route '/cajas/admin/cierre-diario-json'
 */
cierreDiarioGeneralJson.url = (options?: RouteQueryOptions) => {
    return cierreDiarioGeneralJson.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::cierreDiarioGeneralJson
 * @see app/Http/Controllers/CajaController.php:1271
 * @route '/cajas/admin/cierre-diario-json'
 */
cierreDiarioGeneralJson.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cierreDiarioGeneralJson.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CajaController::detalle
 * @see app/Http/Controllers/CajaController.php:1013
 * @route '/cajas/admin/cajas/{userId}'
 */
export const detalle = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalle.url(args, options),
    method: 'get',
})

detalle.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/cajas/{userId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::detalle
 * @see app/Http/Controllers/CajaController.php:1013
 * @route '/cajas/admin/cajas/{userId}'
 */
detalle.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    userId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userId: args.userId,
                }

    return detalle.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::detalle
 * @see app/Http/Controllers/CajaController.php:1013
 * @route '/cajas/admin/cajas/{userId}'
 */
detalle.get = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalle.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::detalle
 * @see app/Http/Controllers/CajaController.php:1013
 * @route '/cajas/admin/cajas/{userId}'
 */
detalle.head = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detalle.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CajaController::consolidarCaja
 * @see app/Http/Controllers/CajaController.php:1174
 * @route '/cajas/admin/cajas/{userId}/consolidar'
 */
export const consolidarCaja = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidarCaja.url(args, options),
    method: 'post',
})

consolidarCaja.definition = {
    methods: ["post"],
    url: '/cajas/admin/cajas/{userId}/consolidar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::consolidarCaja
 * @see app/Http/Controllers/CajaController.php:1174
 * @route '/cajas/admin/cajas/{userId}/consolidar'
 */
consolidarCaja.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { userId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    userId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        userId: args.userId,
                }

    return consolidarCaja.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::consolidarCaja
 * @see app/Http/Controllers/CajaController.php:1174
 * @route '/cajas/admin/cajas/{userId}/consolidar'
 */
consolidarCaja.post = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidarCaja.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\CajaController::reportes
 * @see app/Http/Controllers/CajaController.php:1069
 * @route '/cajas/admin/reportes'
 */
export const reportes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})

reportes.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/reportes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::reportes
 * @see app/Http/Controllers/CajaController.php:1069
 * @route '/cajas/admin/reportes'
 */
reportes.url = (options?: RouteQueryOptions) => {
    return reportes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::reportes
 * @see app/Http/Controllers/CajaController.php:1069
 * @route '/cajas/admin/reportes'
 */
reportes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::reportes
 * @see app/Http/Controllers/CajaController.php:1069
 * @route '/cajas/admin/reportes'
 */
reportes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportes.url(options),
    method: 'head',
})
const CajaController = { index, abrirCaja, cerrarCaja, movimientosDia, registrarMovimiento, registrarMovimientoJson, movimientosApertura, imprimirCierre, exportarExcelCierre, obtenerDatosCierre, imprimirMovimientos, imprimirMovimiento, eliminarMovimiento, exportarExcel, exportarPdf, resumenPorTipoPago, dashboard, cierreDiarioGeneral, cierreDiarioGeneralJson, detalle, consolidarCaja, reportes }

export default CajaController