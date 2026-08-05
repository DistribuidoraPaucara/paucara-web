import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\TipoOperacionController::index
 * @see app/Http/Controllers/Api/TipoOperacionController.php:49
 * @route '/api/inventario/tipos-operacion'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/inventario/tipos-operacion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TipoOperacionController::index
 * @see app/Http/Controllers/Api/TipoOperacionController.php:49
 * @route '/api/inventario/tipos-operacion'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoOperacionController::index
 * @see app/Http/Controllers/Api/TipoOperacionController.php:49
 * @route '/api/inventario/tipos-operacion'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TipoOperacionController::index
 * @see app/Http/Controllers/Api/TipoOperacionController.php:49
 * @route '/api/inventario/tipos-operacion'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TipoOperacionController::index
 * @see app/Http/Controllers/Api/TipoOperacionController.php:49
 * @route '/api/inventario/tipos-operacion'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TipoOperacionController::index
 * @see app/Http/Controllers/Api/TipoOperacionController.php:49
 * @route '/api/inventario/tipos-operacion'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TipoOperacionController::index
 * @see app/Http/Controllers/Api/TipoOperacionController.php:49
 * @route '/api/inventario/tipos-operacion'
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
* @see \App\Http\Controllers\Api\TipoOperacionController::show
 * @see app/Http/Controllers/Api/TipoOperacionController.php:76
 * @route '/api/inventario/tipos-operacion/{tipoOperacion}'
 */
export const show = (args: { tipoOperacion: number | { id: number } } | [tipoOperacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/inventario/tipos-operacion/{tipoOperacion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TipoOperacionController::show
 * @see app/Http/Controllers/Api/TipoOperacionController.php:76
 * @route '/api/inventario/tipos-operacion/{tipoOperacion}'
 */
show.url = (args: { tipoOperacion: number | { id: number } } | [tipoOperacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipoOperacion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { tipoOperacion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    tipoOperacion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipoOperacion: typeof args.tipoOperacion === 'object'
                ? args.tipoOperacion.id
                : args.tipoOperacion,
                }

    return show.definition.url
            .replace('{tipoOperacion}', parsedArgs.tipoOperacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoOperacionController::show
 * @see app/Http/Controllers/Api/TipoOperacionController.php:76
 * @route '/api/inventario/tipos-operacion/{tipoOperacion}'
 */
show.get = (args: { tipoOperacion: number | { id: number } } | [tipoOperacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TipoOperacionController::show
 * @see app/Http/Controllers/Api/TipoOperacionController.php:76
 * @route '/api/inventario/tipos-operacion/{tipoOperacion}'
 */
show.head = (args: { tipoOperacion: number | { id: number } } | [tipoOperacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TipoOperacionController::show
 * @see app/Http/Controllers/Api/TipoOperacionController.php:76
 * @route '/api/inventario/tipos-operacion/{tipoOperacion}'
 */
    const showForm = (args: { tipoOperacion: number | { id: number } } | [tipoOperacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TipoOperacionController::show
 * @see app/Http/Controllers/Api/TipoOperacionController.php:76
 * @route '/api/inventario/tipos-operacion/{tipoOperacion}'
 */
        showForm.get = (args: { tipoOperacion: number | { id: number } } | [tipoOperacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TipoOperacionController::show
 * @see app/Http/Controllers/Api/TipoOperacionController.php:76
 * @route '/api/inventario/tipos-operacion/{tipoOperacion}'
 */
        showForm.head = (args: { tipoOperacion: number | { id: number } } | [tipoOperacion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\TipoOperacionController::porDireccion
 * @see app/Http/Controllers/Api/TipoOperacionController.php:98
 * @route '/api/inventario/tipos-operacion/por-direccion/{direccion}'
 */
export const porDireccion = (args: { direccion: string | number } | [direccion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porDireccion.url(args, options),
    method: 'get',
})

porDireccion.definition = {
    methods: ["get","head"],
    url: '/api/inventario/tipos-operacion/por-direccion/{direccion}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TipoOperacionController::porDireccion
 * @see app/Http/Controllers/Api/TipoOperacionController.php:98
 * @route '/api/inventario/tipos-operacion/por-direccion/{direccion}'
 */
porDireccion.url = (args: { direccion: string | number } | [direccion: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { direccion: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    direccion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        direccion: args.direccion,
                }

    return porDireccion.definition.url
            .replace('{direccion}', parsedArgs.direccion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoOperacionController::porDireccion
 * @see app/Http/Controllers/Api/TipoOperacionController.php:98
 * @route '/api/inventario/tipos-operacion/por-direccion/{direccion}'
 */
porDireccion.get = (args: { direccion: string | number } | [direccion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porDireccion.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TipoOperacionController::porDireccion
 * @see app/Http/Controllers/Api/TipoOperacionController.php:98
 * @route '/api/inventario/tipos-operacion/por-direccion/{direccion}'
 */
porDireccion.head = (args: { direccion: string | number } | [direccion: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: porDireccion.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TipoOperacionController::porDireccion
 * @see app/Http/Controllers/Api/TipoOperacionController.php:98
 * @route '/api/inventario/tipos-operacion/por-direccion/{direccion}'
 */
    const porDireccionForm = (args: { direccion: string | number } | [direccion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: porDireccion.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TipoOperacionController::porDireccion
 * @see app/Http/Controllers/Api/TipoOperacionController.php:98
 * @route '/api/inventario/tipos-operacion/por-direccion/{direccion}'
 */
        porDireccionForm.get = (args: { direccion: string | number } | [direccion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porDireccion.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TipoOperacionController::porDireccion
 * @see app/Http/Controllers/Api/TipoOperacionController.php:98
 * @route '/api/inventario/tipos-operacion/por-direccion/{direccion}'
 */
        porDireccionForm.head = (args: { direccion: string | number } | [direccion: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: porDireccion.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    porDireccion.form = porDireccionForm
/**
* @see \App\Http\Controllers\Api\TipoOperacionController::conRequisitos
 * @see app/Http/Controllers/Api/TipoOperacionController.php:135
 * @route '/api/inventario/tipos-operacion/con-requisitos'
 */
export const conRequisitos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conRequisitos.url(options),
    method: 'get',
})

conRequisitos.definition = {
    methods: ["get","head"],
    url: '/api/inventario/tipos-operacion/con-requisitos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\TipoOperacionController::conRequisitos
 * @see app/Http/Controllers/Api/TipoOperacionController.php:135
 * @route '/api/inventario/tipos-operacion/con-requisitos'
 */
conRequisitos.url = (options?: RouteQueryOptions) => {
    return conRequisitos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\TipoOperacionController::conRequisitos
 * @see app/Http/Controllers/Api/TipoOperacionController.php:135
 * @route '/api/inventario/tipos-operacion/con-requisitos'
 */
conRequisitos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: conRequisitos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\TipoOperacionController::conRequisitos
 * @see app/Http/Controllers/Api/TipoOperacionController.php:135
 * @route '/api/inventario/tipos-operacion/con-requisitos'
 */
conRequisitos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: conRequisitos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\TipoOperacionController::conRequisitos
 * @see app/Http/Controllers/Api/TipoOperacionController.php:135
 * @route '/api/inventario/tipos-operacion/con-requisitos'
 */
    const conRequisitosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: conRequisitos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\TipoOperacionController::conRequisitos
 * @see app/Http/Controllers/Api/TipoOperacionController.php:135
 * @route '/api/inventario/tipos-operacion/con-requisitos'
 */
        conRequisitosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: conRequisitos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\TipoOperacionController::conRequisitos
 * @see app/Http/Controllers/Api/TipoOperacionController.php:135
 * @route '/api/inventario/tipos-operacion/con-requisitos'
 */
        conRequisitosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: conRequisitos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    conRequisitos.form = conRequisitosForm
const TipoOperacionController = { index, show, porDireccion, conRequisitos }

export default TipoOperacionController