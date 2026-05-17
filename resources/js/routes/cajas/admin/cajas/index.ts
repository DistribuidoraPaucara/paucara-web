import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CajaController::detalle
 * @see app/Http/Controllers/CajaController.php:942
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
 * @see app/Http/Controllers/CajaController.php:942
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
 * @see app/Http/Controllers/CajaController.php:942
 * @route '/cajas/admin/cajas/{userId}'
 */
detalle.get = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalle.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::detalle
 * @see app/Http/Controllers/CajaController.php:942
 * @route '/cajas/admin/cajas/{userId}'
 */
detalle.head = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detalle.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::detalle
 * @see app/Http/Controllers/CajaController.php:942
 * @route '/cajas/admin/cajas/{userId}'
 */
    const detalleForm = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detalle.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::detalle
 * @see app/Http/Controllers/CajaController.php:942
 * @route '/cajas/admin/cajas/{userId}'
 */
        detalleForm.get = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalle.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::detalle
 * @see app/Http/Controllers/CajaController.php:942
 * @route '/cajas/admin/cajas/{userId}'
 */
        detalleForm.head = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detalle.form = detalleForm
/**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/admin/cajas/{userId}/movimientos'
 */
export const movimientos = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(args, options),
    method: 'get',
})

movimientos.definition = {
    methods: ["get","head"],
    url: '/cajas/admin/cajas/{userId}/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/admin/cajas/{userId}/movimientos'
 */
movimientos.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return movimientos.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/admin/cajas/{userId}/movimientos'
 */
movimientos.get = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/admin/cajas/{userId}/movimientos'
 */
movimientos.head = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientos.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/admin/cajas/{userId}/movimientos'
 */
    const movimientosForm = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: movimientos.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/admin/cajas/{userId}/movimientos'
 */
        movimientosForm.get = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientos.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/admin/cajas/{userId}/movimientos'
 */
        movimientosForm.head = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientos.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    movimientos.form = movimientosForm
/**
* @see \App\Http\Controllers\CajaController::abrir
 * @see app/Http/Controllers/CajaController.php:371
 * @route '/cajas/admin/cajas/{userId}/abrir'
 */
export const abrir = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: abrir.url(args, options),
    method: 'post',
})

abrir.definition = {
    methods: ["post"],
    url: '/cajas/admin/cajas/{userId}/abrir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::abrir
 * @see app/Http/Controllers/CajaController.php:371
 * @route '/cajas/admin/cajas/{userId}/abrir'
 */
abrir.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return abrir.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::abrir
 * @see app/Http/Controllers/CajaController.php:371
 * @route '/cajas/admin/cajas/{userId}/abrir'
 */
abrir.post = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: abrir.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CajaController::abrir
 * @see app/Http/Controllers/CajaController.php:371
 * @route '/cajas/admin/cajas/{userId}/abrir'
 */
    const abrirForm = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: abrir.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CajaController::abrir
 * @see app/Http/Controllers/CajaController.php:371
 * @route '/cajas/admin/cajas/{userId}/abrir'
 */
        abrirForm.post = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: abrir.url(args, options),
            method: 'post',
        })
    
    abrir.form = abrirForm
/**
* @see \App\Http\Controllers\CajaController::cerrar
 * @see app/Http/Controllers/CajaController.php:467
 * @route '/cajas/admin/cajas/{userId}/cerrar'
 */
export const cerrar = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cerrar.url(args, options),
    method: 'post',
})

cerrar.definition = {
    methods: ["post"],
    url: '/cajas/admin/cajas/{userId}/cerrar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::cerrar
 * @see app/Http/Controllers/CajaController.php:467
 * @route '/cajas/admin/cajas/{userId}/cerrar'
 */
cerrar.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return cerrar.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::cerrar
 * @see app/Http/Controllers/CajaController.php:467
 * @route '/cajas/admin/cajas/{userId}/cerrar'
 */
cerrar.post = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cerrar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CajaController::cerrar
 * @see app/Http/Controllers/CajaController.php:467
 * @route '/cajas/admin/cajas/{userId}/cerrar'
 */
    const cerrarForm = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cerrar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CajaController::cerrar
 * @see app/Http/Controllers/CajaController.php:467
 * @route '/cajas/admin/cajas/{userId}/cerrar'
 */
        cerrarForm.post = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cerrar.url(args, options),
            method: 'post',
        })
    
    cerrar.form = cerrarForm
/**
* @see \App\Http\Controllers\CajaController::consolidar
 * @see app/Http/Controllers/CajaController.php:1103
 * @route '/cajas/admin/cajas/{userId}/consolidar'
 */
export const consolidar = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidar.url(args, options),
    method: 'post',
})

consolidar.definition = {
    methods: ["post"],
    url: '/cajas/admin/cajas/{userId}/consolidar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::consolidar
 * @see app/Http/Controllers/CajaController.php:1103
 * @route '/cajas/admin/cajas/{userId}/consolidar'
 */
consolidar.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return consolidar.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::consolidar
 * @see app/Http/Controllers/CajaController.php:1103
 * @route '/cajas/admin/cajas/{userId}/consolidar'
 */
consolidar.post = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CajaController::consolidar
 * @see app/Http/Controllers/CajaController.php:1103
 * @route '/cajas/admin/cajas/{userId}/consolidar'
 */
    const consolidarForm = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: consolidar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CajaController::consolidar
 * @see app/Http/Controllers/CajaController.php:1103
 * @route '/cajas/admin/cajas/{userId}/consolidar'
 */
        consolidarForm.post = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: consolidar.url(args, options),
            method: 'post',
        })
    
    consolidar.form = consolidarForm
const cajas = {
    detalle,
movimientos,
abrir,
cerrar,
consolidar,
}

export default cajas