import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\EgresosController::index
 * @see app/Http/Controllers/EgresosController.php:21
 * @route '/egresos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/egresos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EgresosController::index
 * @see app/Http/Controllers/EgresosController.php:21
 * @route '/egresos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EgresosController::index
 * @see app/Http/Controllers/EgresosController.php:21
 * @route '/egresos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EgresosController::index
 * @see app/Http/Controllers/EgresosController.php:21
 * @route '/egresos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EgresosController::index
 * @see app/Http/Controllers/EgresosController.php:21
 * @route '/egresos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EgresosController::index
 * @see app/Http/Controllers/EgresosController.php:21
 * @route '/egresos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EgresosController::index
 * @see app/Http/Controllers/EgresosController.php:21
 * @route '/egresos'
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
* @see \App\Http\Controllers\EgresosController::create
 * @see app/Http/Controllers/EgresosController.php:58
 * @route '/egresos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/egresos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EgresosController::create
 * @see app/Http/Controllers/EgresosController.php:58
 * @route '/egresos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EgresosController::create
 * @see app/Http/Controllers/EgresosController.php:58
 * @route '/egresos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EgresosController::create
 * @see app/Http/Controllers/EgresosController.php:58
 * @route '/egresos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EgresosController::create
 * @see app/Http/Controllers/EgresosController.php:58
 * @route '/egresos/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EgresosController::create
 * @see app/Http/Controllers/EgresosController.php:58
 * @route '/egresos/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EgresosController::create
 * @see app/Http/Controllers/EgresosController.php:58
 * @route '/egresos/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\EgresosController::imprimir
 * @see app/Http/Controllers/EgresosController.php:94
 * @route '/egresos/{egreso}/imprimir'
 */
export const imprimir = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/egresos/{egreso}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EgresosController::imprimir
 * @see app/Http/Controllers/EgresosController.php:94
 * @route '/egresos/{egreso}/imprimir'
 */
imprimir.url = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { egreso: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { egreso: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    egreso: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        egreso: typeof args.egreso === 'object'
                ? args.egreso.id
                : args.egreso,
                }

    return imprimir.definition.url
            .replace('{egreso}', parsedArgs.egreso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EgresosController::imprimir
 * @see app/Http/Controllers/EgresosController.php:94
 * @route '/egresos/{egreso}/imprimir'
 */
imprimir.get = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EgresosController::imprimir
 * @see app/Http/Controllers/EgresosController.php:94
 * @route '/egresos/{egreso}/imprimir'
 */
imprimir.head = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EgresosController::imprimir
 * @see app/Http/Controllers/EgresosController.php:94
 * @route '/egresos/{egreso}/imprimir'
 */
    const imprimirForm = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EgresosController::imprimir
 * @see app/Http/Controllers/EgresosController.php:94
 * @route '/egresos/{egreso}/imprimir'
 */
        imprimirForm.get = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EgresosController::imprimir
 * @see app/Http/Controllers/EgresosController.php:94
 * @route '/egresos/{egreso}/imprimir'
 */
        imprimirForm.head = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EgresosController::show
 * @see app/Http/Controllers/EgresosController.php:72
 * @route '/egresos/{egreso}'
 */
export const show = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/egresos/{egreso}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EgresosController::show
 * @see app/Http/Controllers/EgresosController.php:72
 * @route '/egresos/{egreso}'
 */
show.url = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { egreso: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { egreso: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    egreso: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        egreso: typeof args.egreso === 'object'
                ? args.egreso.id
                : args.egreso,
                }

    return show.definition.url
            .replace('{egreso}', parsedArgs.egreso.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EgresosController::show
 * @see app/Http/Controllers/EgresosController.php:72
 * @route '/egresos/{egreso}'
 */
show.get = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EgresosController::show
 * @see app/Http/Controllers/EgresosController.php:72
 * @route '/egresos/{egreso}'
 */
show.head = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EgresosController::show
 * @see app/Http/Controllers/EgresosController.php:72
 * @route '/egresos/{egreso}'
 */
    const showForm = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EgresosController::show
 * @see app/Http/Controllers/EgresosController.php:72
 * @route '/egresos/{egreso}'
 */
        showForm.get = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EgresosController::show
 * @see app/Http/Controllers/EgresosController.php:72
 * @route '/egresos/{egreso}'
 */
        showForm.head = (args: { egreso: number | { id: number } } | [egreso: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const egresos = {
    index,
create,
imprimir,
show,
}

export default egresos