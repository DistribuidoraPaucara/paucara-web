import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import movimientos from './movimientos'
import gastos from './gastos'
import cierre from './cierre'
import movimiento from './movimiento'
import resumen from './resumen'
import admin from './admin'
/**
* @see \App\Http\Controllers\CajaController::user
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/user/{userId}'
 */
export const user = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(args, options),
    method: 'get',
})

user.definition = {
    methods: ["get","head"],
    url: '/cajas/user/{userId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::user
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/user/{userId}'
 */
user.url = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return user.definition.url
            .replace('{userId}', parsedArgs.userId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::user
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/user/{userId}'
 */
user.get = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::user
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/user/{userId}'
 */
user.head = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: user.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::user
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/user/{userId}'
 */
    const userForm = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: user.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::user
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/user/{userId}'
 */
        userForm.get = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: user.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::user
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/user/{userId}'
 */
        userForm.head = (args: { userId: string | number } | [userId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: user.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    user.form = userForm
/**
* @see \App\Http\Controllers\CajaController::show
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/{aperturaCaja}'
 */
export const show = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/cajas/{aperturaCaja}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::show
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/{aperturaCaja}'
 */
show.url = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{aperturaCaja}', parsedArgs.aperturaCaja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::show
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/{aperturaCaja}'
 */
show.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::show
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/{aperturaCaja}'
 */
show.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::show
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/{aperturaCaja}'
 */
    const showForm = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::show
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/{aperturaCaja}'
 */
        showForm.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::show
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas/{aperturaCaja}'
 */
        showForm.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/cajas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::index
 * @see app/Http/Controllers/CajaController.php:53
 * @route '/cajas'
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
* @see \App\Http\Controllers\CajaController::abrir
 * @see app/Http/Controllers/CajaController.php:371
 * @route '/cajas/abrir'
 */
export const abrir = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: abrir.url(options),
    method: 'post',
})

abrir.definition = {
    methods: ["post"],
    url: '/cajas/abrir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::abrir
 * @see app/Http/Controllers/CajaController.php:371
 * @route '/cajas/abrir'
 */
abrir.url = (options?: RouteQueryOptions) => {
    return abrir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::abrir
 * @see app/Http/Controllers/CajaController.php:371
 * @route '/cajas/abrir'
 */
abrir.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: abrir.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CajaController::abrir
 * @see app/Http/Controllers/CajaController.php:371
 * @route '/cajas/abrir'
 */
    const abrirForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: abrir.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CajaController::abrir
 * @see app/Http/Controllers/CajaController.php:371
 * @route '/cajas/abrir'
 */
        abrirForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: abrir.url(options),
            method: 'post',
        })
    
    abrir.form = abrirForm
/**
* @see \App\Http\Controllers\CajaController::cerrar
 * @see app/Http/Controllers/CajaController.php:467
 * @route '/cajas/cerrar'
 */
export const cerrar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cerrar.url(options),
    method: 'post',
})

cerrar.definition = {
    methods: ["post"],
    url: '/cajas/cerrar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CajaController::cerrar
 * @see app/Http/Controllers/CajaController.php:467
 * @route '/cajas/cerrar'
 */
cerrar.url = (options?: RouteQueryOptions) => {
    return cerrar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::cerrar
 * @see app/Http/Controllers/CajaController.php:467
 * @route '/cajas/cerrar'
 */
cerrar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cerrar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CajaController::cerrar
 * @see app/Http/Controllers/CajaController.php:467
 * @route '/cajas/cerrar'
 */
    const cerrarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cerrar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CajaController::cerrar
 * @see app/Http/Controllers/CajaController.php:467
 * @route '/cajas/cerrar'
 */
        cerrarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cerrar.url(options),
            method: 'post',
        })
    
    cerrar.form = cerrarForm
/**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/movimientos'
 */
export const movimientos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(options),
    method: 'get',
})

movimientos.definition = {
    methods: ["get","head"],
    url: '/cajas/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/movimientos'
 */
movimientos.url = (options?: RouteQueryOptions) => {
    return movimientos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/movimientos'
 */
movimientos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/movimientos'
 */
movimientos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/movimientos'
 */
    const movimientosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: movimientos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/movimientos'
 */
        movimientosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::movimientos
 * @see app/Http/Controllers/CajaController.php:731
 * @route '/cajas/movimientos'
 */
        movimientosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    movimientos.form = movimientosForm
/**
* @see \App\Http\Controllers\CajaController::registrarMovimiento
 * @see app/Http/Controllers/CajaController.php:1547
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
 * @see app/Http/Controllers/CajaController.php:1547
 * @route '/cajas/movimientos'
 */
registrarMovimiento.url = (options?: RouteQueryOptions) => {
    return registrarMovimiento.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::registrarMovimiento
 * @see app/Http/Controllers/CajaController.php:1547
 * @route '/cajas/movimientos'
 */
registrarMovimiento.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarMovimiento.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CajaController::registrarMovimiento
 * @see app/Http/Controllers/CajaController.php:1547
 * @route '/cajas/movimientos'
 */
    const registrarMovimientoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarMovimiento.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CajaController::registrarMovimiento
 * @see app/Http/Controllers/CajaController.php:1547
 * @route '/cajas/movimientos'
 */
        registrarMovimientoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarMovimiento.url(options),
            method: 'post',
        })
    
    registrarMovimiento.form = registrarMovimientoForm
/**
* @see \App\Http\Controllers\CajaController::registrarMovimientoJson
 * @see app/Http/Controllers/CajaController.php:1663
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
 * @see app/Http/Controllers/CajaController.php:1663
 * @route '/cajas/movimientos-json'
 */
registrarMovimientoJson.url = (options?: RouteQueryOptions) => {
    return registrarMovimientoJson.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::registrarMovimientoJson
 * @see app/Http/Controllers/CajaController.php:1663
 * @route '/cajas/movimientos-json'
 */
registrarMovimientoJson.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarMovimientoJson.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CajaController::registrarMovimientoJson
 * @see app/Http/Controllers/CajaController.php:1663
 * @route '/cajas/movimientos-json'
 */
    const registrarMovimientoJsonForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarMovimientoJson.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CajaController::registrarMovimientoJson
 * @see app/Http/Controllers/CajaController.php:1663
 * @route '/cajas/movimientos-json'
 */
        registrarMovimientoJsonForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarMovimientoJson.url(options),
            method: 'post',
        })
    
    registrarMovimientoJson.form = registrarMovimientoJsonForm
/**
* @see \App\Http\Controllers\CajaController::aperturaMovimientos
 * @see app/Http/Controllers/CajaController.php:779
 * @route '/cajas/apertura/{aperturaId}/movimientos'
 */
export const aperturaMovimientos = (args: { aperturaId: string | number } | [aperturaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: aperturaMovimientos.url(args, options),
    method: 'get',
})

aperturaMovimientos.definition = {
    methods: ["get","head"],
    url: '/cajas/apertura/{aperturaId}/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::aperturaMovimientos
 * @see app/Http/Controllers/CajaController.php:779
 * @route '/cajas/apertura/{aperturaId}/movimientos'
 */
aperturaMovimientos.url = (args: { aperturaId: string | number } | [aperturaId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return aperturaMovimientos.definition.url
            .replace('{aperturaId}', parsedArgs.aperturaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::aperturaMovimientos
 * @see app/Http/Controllers/CajaController.php:779
 * @route '/cajas/apertura/{aperturaId}/movimientos'
 */
aperturaMovimientos.get = (args: { aperturaId: string | number } | [aperturaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: aperturaMovimientos.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::aperturaMovimientos
 * @see app/Http/Controllers/CajaController.php:779
 * @route '/cajas/apertura/{aperturaId}/movimientos'
 */
aperturaMovimientos.head = (args: { aperturaId: string | number } | [aperturaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: aperturaMovimientos.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::aperturaMovimientos
 * @see app/Http/Controllers/CajaController.php:779
 * @route '/cajas/apertura/{aperturaId}/movimientos'
 */
    const aperturaMovimientosForm = (args: { aperturaId: string | number } | [aperturaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: aperturaMovimientos.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::aperturaMovimientos
 * @see app/Http/Controllers/CajaController.php:779
 * @route '/cajas/apertura/{aperturaId}/movimientos'
 */
        aperturaMovimientosForm.get = (args: { aperturaId: string | number } | [aperturaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: aperturaMovimientos.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::aperturaMovimientos
 * @see app/Http/Controllers/CajaController.php:779
 * @route '/cajas/apertura/{aperturaId}/movimientos'
 */
        aperturaMovimientosForm.head = (args: { aperturaId: string | number } | [aperturaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: aperturaMovimientos.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    aperturaMovimientos.form = aperturaMovimientosForm
/**
* @see \App\Http\Controllers\CajaController::datosCierre
 * @see app/Http/Controllers/CajaController.php:618
 * @route '/cajas/{aperturaCaja}/datos-cierre'
 */
export const datosCierre = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: datosCierre.url(args, options),
    method: 'get',
})

datosCierre.definition = {
    methods: ["get","head"],
    url: '/cajas/{aperturaCaja}/datos-cierre',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::datosCierre
 * @see app/Http/Controllers/CajaController.php:618
 * @route '/cajas/{aperturaCaja}/datos-cierre'
 */
datosCierre.url = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return datosCierre.definition.url
            .replace('{aperturaCaja}', parsedArgs.aperturaCaja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::datosCierre
 * @see app/Http/Controllers/CajaController.php:618
 * @route '/cajas/{aperturaCaja}/datos-cierre'
 */
datosCierre.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: datosCierre.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::datosCierre
 * @see app/Http/Controllers/CajaController.php:618
 * @route '/cajas/{aperturaCaja}/datos-cierre'
 */
datosCierre.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: datosCierre.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CajaController::datosCierre
 * @see app/Http/Controllers/CajaController.php:618
 * @route '/cajas/{aperturaCaja}/datos-cierre'
 */
    const datosCierreForm = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: datosCierre.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CajaController::datosCierre
 * @see app/Http/Controllers/CajaController.php:618
 * @route '/cajas/{aperturaCaja}/datos-cierre'
 */
        datosCierreForm.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: datosCierre.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CajaController::datosCierre
 * @see app/Http/Controllers/CajaController.php:618
 * @route '/cajas/{aperturaCaja}/datos-cierre'
 */
        datosCierreForm.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: datosCierre.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    datosCierre.form = datosCierreForm
const cajas = {
    user,
show,
index,
abrir,
cerrar,
movimientos,
registrarMovimiento,
registrarMovimientoJson,
gastos,
aperturaMovimientos,
cierre,
datosCierre,
movimiento,
resumen,
admin,
}

export default cajas