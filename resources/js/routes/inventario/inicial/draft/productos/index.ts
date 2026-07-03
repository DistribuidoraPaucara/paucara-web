import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\InventarioInicialController::add
 * @see app/Http/Controllers/InventarioInicialController.php:294
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos'
 */
export const add = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(args, options),
    method: 'post',
})

add.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/{borrador}/productos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::add
 * @see app/Http/Controllers/InventarioInicialController.php:294
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos'
 */
add.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { borrador: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    borrador: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        borrador: args.borrador,
                }

    return add.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::add
 * @see app/Http/Controllers/InventarioInicialController.php:294
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos'
 */
add.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: add.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::add
 * @see app/Http/Controllers/InventarioInicialController.php:294
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos'
 */
    const addForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: add.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::add
 * @see app/Http/Controllers/InventarioInicialController.php:294
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos'
 */
        addForm.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: add.url(args, options),
            method: 'post',
        })
    
    add.form = addForm
/**
* @see \App\Http\Controllers\InventarioInicialController::loadPaginated
 * @see app/Http/Controllers/InventarioInicialController.php:542
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/load-paginated'
 */
export const loadPaginated = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: loadPaginated.url(args, options),
    method: 'post',
})

loadPaginated.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/{borrador}/productos/load-paginated',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::loadPaginated
 * @see app/Http/Controllers/InventarioInicialController.php:542
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/load-paginated'
 */
loadPaginated.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { borrador: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    borrador: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        borrador: args.borrador,
                }

    return loadPaginated.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::loadPaginated
 * @see app/Http/Controllers/InventarioInicialController.php:542
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/load-paginated'
 */
loadPaginated.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: loadPaginated.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::loadPaginated
 * @see app/Http/Controllers/InventarioInicialController.php:542
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/load-paginated'
 */
    const loadPaginatedForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: loadPaginated.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::loadPaginated
 * @see app/Http/Controllers/InventarioInicialController.php:542
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/load-paginated'
 */
        loadPaginatedForm.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: loadPaginated.url(args, options),
            method: 'post',
        })
    
    loadPaginated.form = loadPaginatedForm
/**
* @see \App\Http\Controllers\InventarioInicialController::suggestions
 * @see app/Http/Controllers/InventarioInicialController.php:725
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/suggestions'
 */
export const suggestions = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestions.url(args, options),
    method: 'post',
})

suggestions.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/{borrador}/productos/suggestions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::suggestions
 * @see app/Http/Controllers/InventarioInicialController.php:725
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/suggestions'
 */
suggestions.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { borrador: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    borrador: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        borrador: args.borrador,
                }

    return suggestions.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::suggestions
 * @see app/Http/Controllers/InventarioInicialController.php:725
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/suggestions'
 */
suggestions.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: suggestions.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::suggestions
 * @see app/Http/Controllers/InventarioInicialController.php:725
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/suggestions'
 */
    const suggestionsForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: suggestions.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::suggestions
 * @see app/Http/Controllers/InventarioInicialController.php:725
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/suggestions'
 */
        suggestionsForm.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: suggestions.url(args, options),
            method: 'post',
        })
    
    suggestions.form = suggestionsForm
/**
* @see \App\Http\Controllers\InventarioInicialController::search
 * @see app/Http/Controllers/InventarioInicialController.php:769
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/search'
 */
export const search = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: search.url(args, options),
    method: 'post',
})

search.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/{borrador}/productos/search',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::search
 * @see app/Http/Controllers/InventarioInicialController.php:769
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/search'
 */
search.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { borrador: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    borrador: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        borrador: args.borrador,
                }

    return search.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::search
 * @see app/Http/Controllers/InventarioInicialController.php:769
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/search'
 */
search.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: search.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::search
 * @see app/Http/Controllers/InventarioInicialController.php:769
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/search'
 */
    const searchForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: search.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::search
 * @see app/Http/Controllers/InventarioInicialController.php:769
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/search'
 */
        searchForm.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: search.url(args, options),
            method: 'post',
        })
    
    search.form = searchForm
const productos = {
    add,
loadPaginated,
suggestions,
search,
}

export default productos