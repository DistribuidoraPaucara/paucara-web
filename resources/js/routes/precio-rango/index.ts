import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\PrecioRangoController::index
 * @see app/Http/Controllers/PrecioRangoController.php:27
 * @route '/precio-rango'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/precio-rango',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioRangoController::index
 * @see app/Http/Controllers/PrecioRangoController.php:27
 * @route '/precio-rango'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioRangoController::index
 * @see app/Http/Controllers/PrecioRangoController.php:27
 * @route '/precio-rango'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioRangoController::index
 * @see app/Http/Controllers/PrecioRangoController.php:27
 * @route '/precio-rango'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrecioRangoController::index
 * @see app/Http/Controllers/PrecioRangoController.php:27
 * @route '/precio-rango'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrecioRangoController::index
 * @see app/Http/Controllers/PrecioRangoController.php:27
 * @route '/precio-rango'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrecioRangoController::index
 * @see app/Http/Controllers/PrecioRangoController.php:27
 * @route '/precio-rango'
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
* @see \App\Http\Controllers\PrecioRangoController::create
 * @see app/Http/Controllers/PrecioRangoController.php:68
 * @route '/precio-rango/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/precio-rango/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioRangoController::create
 * @see app/Http/Controllers/PrecioRangoController.php:68
 * @route '/precio-rango/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioRangoController::create
 * @see app/Http/Controllers/PrecioRangoController.php:68
 * @route '/precio-rango/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioRangoController::create
 * @see app/Http/Controllers/PrecioRangoController.php:68
 * @route '/precio-rango/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrecioRangoController::create
 * @see app/Http/Controllers/PrecioRangoController.php:68
 * @route '/precio-rango/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrecioRangoController::create
 * @see app/Http/Controllers/PrecioRangoController.php:68
 * @route '/precio-rango/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrecioRangoController::create
 * @see app/Http/Controllers/PrecioRangoController.php:68
 * @route '/precio-rango/create'
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
* @see \App\Http\Controllers\PrecioRangoController::importCsv
 * @see app/Http/Controllers/PrecioRangoController.php:151
 * @route '/precio-rango/import-csv'
 */
export const importCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importCsv.url(options),
    method: 'get',
})

importCsv.definition = {
    methods: ["get","head"],
    url: '/precio-rango/import-csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioRangoController::importCsv
 * @see app/Http/Controllers/PrecioRangoController.php:151
 * @route '/precio-rango/import-csv'
 */
importCsv.url = (options?: RouteQueryOptions) => {
    return importCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioRangoController::importCsv
 * @see app/Http/Controllers/PrecioRangoController.php:151
 * @route '/precio-rango/import-csv'
 */
importCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioRangoController::importCsv
 * @see app/Http/Controllers/PrecioRangoController.php:151
 * @route '/precio-rango/import-csv'
 */
importCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: importCsv.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrecioRangoController::importCsv
 * @see app/Http/Controllers/PrecioRangoController.php:151
 * @route '/precio-rango/import-csv'
 */
    const importCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: importCsv.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrecioRangoController::importCsv
 * @see app/Http/Controllers/PrecioRangoController.php:151
 * @route '/precio-rango/import-csv'
 */
        importCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importCsv.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrecioRangoController::importCsv
 * @see app/Http/Controllers/PrecioRangoController.php:151
 * @route '/precio-rango/import-csv'
 */
        importCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importCsv.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    importCsv.form = importCsvForm
/**
* @see \App\Http\Controllers\PrecioRangoController::edit
 * @see app/Http/Controllers/PrecioRangoController.php:95
 * @route '/precio-rango/{rango}/edit'
 */
export const edit = (args: { rango: number | { id: number } } | [rango: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/precio-rango/{rango}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioRangoController::edit
 * @see app/Http/Controllers/PrecioRangoController.php:95
 * @route '/precio-rango/{rango}/edit'
 */
edit.url = (args: { rango: number | { id: number } } | [rango: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { rango: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { rango: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    rango: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        rango: typeof args.rango === 'object'
                ? args.rango.id
                : args.rango,
                }

    return edit.definition.url
            .replace('{rango}', parsedArgs.rango.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioRangoController::edit
 * @see app/Http/Controllers/PrecioRangoController.php:95
 * @route '/precio-rango/{rango}/edit'
 */
edit.get = (args: { rango: number | { id: number } } | [rango: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioRangoController::edit
 * @see app/Http/Controllers/PrecioRangoController.php:95
 * @route '/precio-rango/{rango}/edit'
 */
edit.head = (args: { rango: number | { id: number } } | [rango: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrecioRangoController::edit
 * @see app/Http/Controllers/PrecioRangoController.php:95
 * @route '/precio-rango/{rango}/edit'
 */
    const editForm = (args: { rango: number | { id: number } } | [rango: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrecioRangoController::edit
 * @see app/Http/Controllers/PrecioRangoController.php:95
 * @route '/precio-rango/{rango}/edit'
 */
        editForm.get = (args: { rango: number | { id: number } } | [rango: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrecioRangoController::edit
 * @see app/Http/Controllers/PrecioRangoController.php:95
 * @route '/precio-rango/{rango}/edit'
 */
        editForm.head = (args: { rango: number | { id: number } } | [rango: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
const precioRango = {
    index,
create,
importCsv,
edit,
}

export default precioRango