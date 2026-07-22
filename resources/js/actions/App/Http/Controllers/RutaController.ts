import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\RutaController::index
 * @see app/Http/Controllers/RutaController.php:48
 * @route '/rutas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/rutas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RutaController::index
 * @see app/Http/Controllers/RutaController.php:48
 * @route '/rutas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::index
 * @see app/Http/Controllers/RutaController.php:48
 * @route '/rutas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RutaController::index
 * @see app/Http/Controllers/RutaController.php:48
 * @route '/rutas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RutaController::create
 * @see app/Http/Controllers/RutaController.php:78
 * @route '/rutas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/rutas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RutaController::create
 * @see app/Http/Controllers/RutaController.php:78
 * @route '/rutas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::create
 * @see app/Http/Controllers/RutaController.php:78
 * @route '/rutas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RutaController::create
 * @see app/Http/Controllers/RutaController.php:78
 * @route '/rutas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RutaController::store
 * @see app/Http/Controllers/RutaController.php:104
 * @route '/rutas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/rutas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RutaController::store
 * @see app/Http/Controllers/RutaController.php:104
 * @route '/rutas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::store
 * @see app/Http/Controllers/RutaController.php:104
 * @route '/rutas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RutaController::planificar
 * @see app/Http/Controllers/RutaController.php:173
 * @route '/rutas/planificar'
 */
export const planificar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: planificar.url(options),
    method: 'post',
})

planificar.definition = {
    methods: ["post"],
    url: '/rutas/planificar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RutaController::planificar
 * @see app/Http/Controllers/RutaController.php:173
 * @route '/rutas/planificar'
 */
planificar.url = (options?: RouteQueryOptions) => {
    return planificar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::planificar
 * @see app/Http/Controllers/RutaController.php:173
 * @route '/rutas/planificar'
 */
planificar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: planificar.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RutaController::show
 * @see app/Http/Controllers/RutaController.php:140
 * @route '/rutas/{ruta}'
 */
export const show = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/rutas/{ruta}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\RutaController::show
 * @see app/Http/Controllers/RutaController.php:140
 * @route '/rutas/{ruta}'
 */
show.url = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ruta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ruta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ruta: args.ruta,
                }

    return show.definition.url
            .replace('{ruta}', parsedArgs.ruta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::show
 * @see app/Http/Controllers/RutaController.php:140
 * @route '/rutas/{ruta}'
 */
show.get = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\RutaController::show
 * @see app/Http/Controllers/RutaController.php:140
 * @route '/rutas/{ruta}'
 */
show.head = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\RutaController::iniciar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/iniciar'
 */
export const iniciar = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciar.url(args, options),
    method: 'post',
})

iniciar.definition = {
    methods: ["post"],
    url: '/rutas/{ruta}/iniciar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RutaController::iniciar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/iniciar'
 */
iniciar.url = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ruta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ruta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ruta: args.ruta,
                }

    return iniciar.definition.url
            .replace('{ruta}', parsedArgs.ruta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::iniciar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/iniciar'
 */
iniciar.post = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RutaController::completar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/completar'
 */
export const completar = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completar.url(args, options),
    method: 'post',
})

completar.definition = {
    methods: ["post"],
    url: '/rutas/{ruta}/completar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RutaController::completar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/completar'
 */
completar.url = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ruta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ruta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ruta: args.ruta,
                }

    return completar.definition.url
            .replace('{ruta}', parsedArgs.ruta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::completar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/completar'
 */
completar.post = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RutaController::cancelar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/cancelar'
 */
export const cancelar = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

cancelar.definition = {
    methods: ["post"],
    url: '/rutas/{ruta}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RutaController::cancelar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/cancelar'
 */
cancelar.url = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ruta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ruta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ruta: args.ruta,
                }

    return cancelar.definition.url
            .replace('{ruta}', parsedArgs.ruta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::cancelar
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/{ruta}/cancelar'
 */
cancelar.post = (args: { ruta: string | number } | [ruta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\RutaController::registrarEntrega
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/detalles/{detalle}/registrar-entrega'
 */
export const registrarEntrega = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarEntrega.url(args, options),
    method: 'post',
})

registrarEntrega.definition = {
    methods: ["post"],
    url: '/rutas/detalles/{detalle}/registrar-entrega',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\RutaController::registrarEntrega
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/detalles/{detalle}/registrar-entrega'
 */
registrarEntrega.url = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { detalle: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    detalle: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        detalle: args.detalle,
                }

    return registrarEntrega.definition.url
            .replace('{detalle}', parsedArgs.detalle.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\RutaController::registrarEntrega
 * @see app/Http/Controllers/RutaController.php:0
 * @route '/rutas/detalles/{detalle}/registrar-entrega'
 */
registrarEntrega.post = (args: { detalle: string | number } | [detalle: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarEntrega.url(args, options),
    method: 'post',
})
const RutaController = { index, create, store, planificar, show, iniciar, completar, cancelar, registrarEntrega }

export default RutaController