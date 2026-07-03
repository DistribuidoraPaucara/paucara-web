import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::index
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:12
 * @route '/prestamos/prestables'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/prestamos/prestables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::index
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:12
 * @route '/prestamos/prestables'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::index
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:12
 * @route '/prestamos/prestables'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::index
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:12
 * @route '/prestamos/prestables'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Presentacion\PrestablesController::index
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:12
 * @route '/prestamos/prestables'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Presentacion\PrestablesController::index
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:12
 * @route '/prestamos/prestables'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Presentacion\PrestablesController::index
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:12
 * @route '/prestamos/prestables'
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
* @see \App\Http\Controllers\Presentacion\PrestablesController::create
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:17
 * @route '/prestamos/prestables/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/prestamos/prestables/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::create
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:17
 * @route '/prestamos/prestables/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::create
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:17
 * @route '/prestamos/prestables/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::create
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:17
 * @route '/prestamos/prestables/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Presentacion\PrestablesController::create
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:17
 * @route '/prestamos/prestables/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Presentacion\PrestablesController::create
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:17
 * @route '/prestamos/prestables/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Presentacion\PrestablesController::create
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:17
 * @route '/prestamos/prestables/create'
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
* @see \App\Http\Controllers\Presentacion\PrestablesController::show
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:37
 * @route '/prestamos/prestables/{prestable}'
 */
export const show = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/prestamos/prestables/{prestable}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::show
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:37
 * @route '/prestamos/prestables/{prestable}'
 */
show.url = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestable: typeof args.prestable === 'object'
                ? args.prestable.id
                : args.prestable,
                }

    return show.definition.url
            .replace('{prestable}', parsedArgs.prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::show
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:37
 * @route '/prestamos/prestables/{prestable}'
 */
show.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::show
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:37
 * @route '/prestamos/prestables/{prestable}'
 */
show.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Presentacion\PrestablesController::show
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:37
 * @route '/prestamos/prestables/{prestable}'
 */
    const showForm = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Presentacion\PrestablesController::show
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:37
 * @route '/prestamos/prestables/{prestable}'
 */
        showForm.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Presentacion\PrestablesController::show
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:37
 * @route '/prestamos/prestables/{prestable}'
 */
        showForm.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Presentacion\PrestablesController::edit
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:22
 * @route '/prestamos/prestables/{prestable}/edit'
 */
export const edit = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/prestamos/prestables/{prestable}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::edit
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:22
 * @route '/prestamos/prestables/{prestable}/edit'
 */
edit.url = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestable: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestable: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestable: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestable: typeof args.prestable === 'object'
                ? args.prestable.id
                : args.prestable,
                }

    return edit.definition.url
            .replace('{prestable}', parsedArgs.prestable.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::edit
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:22
 * @route '/prestamos/prestables/{prestable}/edit'
 */
edit.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Presentacion\PrestablesController::edit
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:22
 * @route '/prestamos/prestables/{prestable}/edit'
 */
edit.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Presentacion\PrestablesController::edit
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:22
 * @route '/prestamos/prestables/{prestable}/edit'
 */
    const editForm = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Presentacion\PrestablesController::edit
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:22
 * @route '/prestamos/prestables/{prestable}/edit'
 */
        editForm.get = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Presentacion\PrestablesController::edit
 * @see app/Http/Controllers/Presentacion/PrestablesController.php:22
 * @route '/prestamos/prestables/{prestable}/edit'
 */
        editForm.head = (args: { prestable: number | { id: number } } | [prestable: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
const PrestablesController = { index, create, show, edit }

export default PrestablesController