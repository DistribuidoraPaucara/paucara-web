import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ConteoFisicoController::conteos
 * @see app/Http/Controllers/ConteoFisicoController.php:240
 * @route '/inventario/conteos-fisicos/api/conteos'
 */
export const conteos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conteos.url(options),
    method: 'get',
})

conteos.definition = {
    methods: ["get","head"],
    url: '/inventario/conteos-fisicos/api/conteos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::conteos
 * @see app/Http/Controllers/ConteoFisicoController.php:240
 * @route '/inventario/conteos-fisicos/api/conteos'
 */
conteos.url = (options?: RouteQueryOptions) => {
    return conteos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::conteos
 * @see app/Http/Controllers/ConteoFisicoController.php:240
 * @route '/inventario/conteos-fisicos/api/conteos'
 */
conteos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conteos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConteoFisicoController::conteos
 * @see app/Http/Controllers/ConteoFisicoController.php:240
 * @route '/inventario/conteos-fisicos/api/conteos'
 */
conteos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: conteos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::conteos
 * @see app/Http/Controllers/ConteoFisicoController.php:240
 * @route '/inventario/conteos-fisicos/api/conteos'
 */
    const conteosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: conteos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::conteos
 * @see app/Http/Controllers/ConteoFisicoController.php:240
 * @route '/inventario/conteos-fisicos/api/conteos'
 */
        conteosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: conteos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ConteoFisicoController::conteos
 * @see app/Http/Controllers/ConteoFisicoController.php:240
 * @route '/inventario/conteos-fisicos/api/conteos'
 */
        conteosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: conteos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    conteos.form = conteosForm
/**
* @see \App\Http\Controllers\ConteoFisicoController::detalleConteo
 * @see app/Http/Controllers/ConteoFisicoController.php:263
 * @route '/inventario/conteos-fisicos/api/{conteoFisico}/detalle'
 */
export const detalleConteo = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalleConteo.url(args, options),
    method: 'get',
})

detalleConteo.definition = {
    methods: ["get","head"],
    url: '/inventario/conteos-fisicos/api/{conteoFisico}/detalle',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::detalleConteo
 * @see app/Http/Controllers/ConteoFisicoController.php:263
 * @route '/inventario/conteos-fisicos/api/{conteoFisico}/detalle'
 */
detalleConteo.url = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { conteoFisico: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { conteoFisico: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    conteoFisico: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        conteoFisico: typeof args.conteoFisico === 'object'
                ? args.conteoFisico.id
                : args.conteoFisico,
                }

    return detalleConteo.definition.url
            .replace('{conteoFisico}', parsedArgs.conteoFisico.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::detalleConteo
 * @see app/Http/Controllers/ConteoFisicoController.php:263
 * @route '/inventario/conteos-fisicos/api/{conteoFisico}/detalle'
 */
detalleConteo.get = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalleConteo.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ConteoFisicoController::detalleConteo
 * @see app/Http/Controllers/ConteoFisicoController.php:263
 * @route '/inventario/conteos-fisicos/api/{conteoFisico}/detalle'
 */
detalleConteo.head = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detalleConteo.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::detalleConteo
 * @see app/Http/Controllers/ConteoFisicoController.php:263
 * @route '/inventario/conteos-fisicos/api/{conteoFisico}/detalle'
 */
    const detalleConteoForm = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detalleConteo.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::detalleConteo
 * @see app/Http/Controllers/ConteoFisicoController.php:263
 * @route '/inventario/conteos-fisicos/api/{conteoFisico}/detalle'
 */
        detalleConteoForm.get = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalleConteo.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ConteoFisicoController::detalleConteo
 * @see app/Http/Controllers/ConteoFisicoController.php:263
 * @route '/inventario/conteos-fisicos/api/{conteoFisico}/detalle'
 */
        detalleConteoForm.head = (args: { conteoFisico: number | { id: number } } | [conteoFisico: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalleConteo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detalleConteo.form = detalleConteoForm
/**
* @see \App\Http\Controllers\ConteoFisicoController::programarCiclicos
 * @see app/Http/Controllers/ConteoFisicoController.php:296
 * @route '/inventario/conteos-fisicos/api/programar-ciclicos'
 */
export const programarCiclicos = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: programarCiclicos.url(options),
    method: 'post',
})

programarCiclicos.definition = {
    methods: ["post"],
    url: '/inventario/conteos-fisicos/api/programar-ciclicos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ConteoFisicoController::programarCiclicos
 * @see app/Http/Controllers/ConteoFisicoController.php:296
 * @route '/inventario/conteos-fisicos/api/programar-ciclicos'
 */
programarCiclicos.url = (options?: RouteQueryOptions) => {
    return programarCiclicos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConteoFisicoController::programarCiclicos
 * @see app/Http/Controllers/ConteoFisicoController.php:296
 * @route '/inventario/conteos-fisicos/api/programar-ciclicos'
 */
programarCiclicos.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: programarCiclicos.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ConteoFisicoController::programarCiclicos
 * @see app/Http/Controllers/ConteoFisicoController.php:296
 * @route '/inventario/conteos-fisicos/api/programar-ciclicos'
 */
    const programarCiclicosForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: programarCiclicos.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ConteoFisicoController::programarCiclicos
 * @see app/Http/Controllers/ConteoFisicoController.php:296
 * @route '/inventario/conteos-fisicos/api/programar-ciclicos'
 */
        programarCiclicosForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: programarCiclicos.url(options),
            method: 'post',
        })
    
    programarCiclicos.form = programarCiclicosForm
const api = {
    conteos,
detalleConteo,
programarCiclicos,
}

export default api