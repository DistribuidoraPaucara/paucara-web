import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario/inventario-inicial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioInicialController::index
 * @see app/Http/Controllers/InventarioInicialController.php:22
 * @route '/inventario/inventario-inicial'
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
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:63
 * @route '/inventario/inventario-inicial'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:63
 * @route '/inventario/inventario-inicial'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:63
 * @route '/inventario/inventario-inicial'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:63
 * @route '/inventario/inventario-inicial'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::store
 * @see app/Http/Controllers/InventarioInicialController.php:63
 * @route '/inventario/inventario-inicial'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\InventarioInicialController::createOrGetDraft
 * @see app/Http/Controllers/InventarioInicialController.php:190
 * @route '/inventario/inventario-inicial/draft/create'
 */
export const createOrGetDraft = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createOrGetDraft.url(options),
    method: 'post',
})

createOrGetDraft.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/create',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::createOrGetDraft
 * @see app/Http/Controllers/InventarioInicialController.php:190
 * @route '/inventario/inventario-inicial/draft/create'
 */
createOrGetDraft.url = (options?: RouteQueryOptions) => {
    return createOrGetDraft.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::createOrGetDraft
 * @see app/Http/Controllers/InventarioInicialController.php:190
 * @route '/inventario/inventario-inicial/draft/create'
 */
createOrGetDraft.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: createOrGetDraft.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::createOrGetDraft
 * @see app/Http/Controllers/InventarioInicialController.php:190
 * @route '/inventario/inventario-inicial/draft/create'
 */
    const createOrGetDraftForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: createOrGetDraft.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::createOrGetDraft
 * @see app/Http/Controllers/InventarioInicialController.php:190
 * @route '/inventario/inventario-inicial/draft/create'
 */
        createOrGetDraftForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: createOrGetDraft.url(options),
            method: 'post',
        })
    
    createOrGetDraft.form = createOrGetDraftForm
/**
* @see \App\Http\Controllers\InventarioInicialController::getDraft
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
export const getDraft = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDraft.url(args, options),
    method: 'get',
})

getDraft.definition = {
    methods: ["get","head"],
    url: '/inventario/inventario-inicial/draft/{borrador}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::getDraft
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
getDraft.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return getDraft.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::getDraft
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
getDraft.get = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getDraft.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioInicialController::getDraft
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
getDraft.head = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getDraft.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::getDraft
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
    const getDraftForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getDraft.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::getDraft
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
        getDraftForm.get = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDraft.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioInicialController::getDraft
 * @see app/Http/Controllers/InventarioInicialController.php:251
 * @route '/inventario/inventario-inicial/draft/{borrador}'
 */
        getDraftForm.head = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getDraft.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getDraft.form = getDraftForm
/**
* @see \App\Http\Controllers\InventarioInicialController::storeDraftItem
 * @see app/Http/Controllers/InventarioInicialController.php:212
 * @route '/inventario/inventario-inicial/draft/{borrador}/items'
 */
export const storeDraftItem = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDraftItem.url(args, options),
    method: 'post',
})

storeDraftItem.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/{borrador}/items',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::storeDraftItem
 * @see app/Http/Controllers/InventarioInicialController.php:212
 * @route '/inventario/inventario-inicial/draft/{borrador}/items'
 */
storeDraftItem.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return storeDraftItem.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::storeDraftItem
 * @see app/Http/Controllers/InventarioInicialController.php:212
 * @route '/inventario/inventario-inicial/draft/{borrador}/items'
 */
storeDraftItem.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeDraftItem.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::storeDraftItem
 * @see app/Http/Controllers/InventarioInicialController.php:212
 * @route '/inventario/inventario-inicial/draft/{borrador}/items'
 */
    const storeDraftItemForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeDraftItem.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::storeDraftItem
 * @see app/Http/Controllers/InventarioInicialController.php:212
 * @route '/inventario/inventario-inicial/draft/{borrador}/items'
 */
        storeDraftItemForm.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeDraftItem.url(args, options),
            method: 'post',
        })
    
    storeDraftItem.form = storeDraftItemForm
/**
* @see \App\Http\Controllers\InventarioInicialController::addProductosToDraft
 * @see app/Http/Controllers/InventarioInicialController.php:294
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos'
 */
export const addProductosToDraft = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addProductosToDraft.url(args, options),
    method: 'post',
})

addProductosToDraft.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/{borrador}/productos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::addProductosToDraft
 * @see app/Http/Controllers/InventarioInicialController.php:294
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos'
 */
addProductosToDraft.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return addProductosToDraft.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::addProductosToDraft
 * @see app/Http/Controllers/InventarioInicialController.php:294
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos'
 */
addProductosToDraft.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: addProductosToDraft.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::addProductosToDraft
 * @see app/Http/Controllers/InventarioInicialController.php:294
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos'
 */
    const addProductosToDraftForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: addProductosToDraft.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::addProductosToDraft
 * @see app/Http/Controllers/InventarioInicialController.php:294
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos'
 */
        addProductosToDraftForm.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: addProductosToDraft.url(args, options),
            method: 'post',
        })
    
    addProductosToDraft.form = addProductosToDraftForm
/**
* @see \App\Http\Controllers\InventarioInicialController::loadProductsPaginated
 * @see app/Http/Controllers/InventarioInicialController.php:542
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/load-paginated'
 */
export const loadProductsPaginated = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: loadProductsPaginated.url(args, options),
    method: 'post',
})

loadProductsPaginated.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/{borrador}/productos/load-paginated',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::loadProductsPaginated
 * @see app/Http/Controllers/InventarioInicialController.php:542
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/load-paginated'
 */
loadProductsPaginated.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return loadProductsPaginated.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::loadProductsPaginated
 * @see app/Http/Controllers/InventarioInicialController.php:542
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/load-paginated'
 */
loadProductsPaginated.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: loadProductsPaginated.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::loadProductsPaginated
 * @see app/Http/Controllers/InventarioInicialController.php:542
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/load-paginated'
 */
    const loadProductsPaginatedForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: loadProductsPaginated.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::loadProductsPaginated
 * @see app/Http/Controllers/InventarioInicialController.php:542
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/load-paginated'
 */
        loadProductsPaginatedForm.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: loadProductsPaginated.url(args, options),
            method: 'post',
        })
    
    loadProductsPaginated.form = loadProductsPaginatedForm
/**
* @see \App\Http\Controllers\InventarioInicialController::searchProductosForSuggestions
 * @see app/Http/Controllers/InventarioInicialController.php:725
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/suggestions'
 */
export const searchProductosForSuggestions = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: searchProductosForSuggestions.url(args, options),
    method: 'post',
})

searchProductosForSuggestions.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/{borrador}/productos/suggestions',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::searchProductosForSuggestions
 * @see app/Http/Controllers/InventarioInicialController.php:725
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/suggestions'
 */
searchProductosForSuggestions.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return searchProductosForSuggestions.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::searchProductosForSuggestions
 * @see app/Http/Controllers/InventarioInicialController.php:725
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/suggestions'
 */
searchProductosForSuggestions.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: searchProductosForSuggestions.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::searchProductosForSuggestions
 * @see app/Http/Controllers/InventarioInicialController.php:725
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/suggestions'
 */
    const searchProductosForSuggestionsForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: searchProductosForSuggestions.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::searchProductosForSuggestions
 * @see app/Http/Controllers/InventarioInicialController.php:725
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/suggestions'
 */
        searchProductosForSuggestionsForm.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: searchProductosForSuggestions.url(args, options),
            method: 'post',
        })
    
    searchProductosForSuggestions.form = searchProductosForSuggestionsForm
/**
* @see \App\Http\Controllers\InventarioInicialController::searchProductoInDraft
 * @see app/Http/Controllers/InventarioInicialController.php:769
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/search'
 */
export const searchProductoInDraft = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: searchProductoInDraft.url(args, options),
    method: 'post',
})

searchProductoInDraft.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/{borrador}/productos/search',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::searchProductoInDraft
 * @see app/Http/Controllers/InventarioInicialController.php:769
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/search'
 */
searchProductoInDraft.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return searchProductoInDraft.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::searchProductoInDraft
 * @see app/Http/Controllers/InventarioInicialController.php:769
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/search'
 */
searchProductoInDraft.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: searchProductoInDraft.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::searchProductoInDraft
 * @see app/Http/Controllers/InventarioInicialController.php:769
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/search'
 */
    const searchProductoInDraftForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: searchProductoInDraft.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::searchProductoInDraft
 * @see app/Http/Controllers/InventarioInicialController.php:769
 * @route '/inventario/inventario-inicial/draft/{borrador}/productos/search'
 */
        searchProductoInDraftForm.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: searchProductoInDraft.url(args, options),
            method: 'post',
        })
    
    searchProductoInDraft.form = searchProductoInDraftForm
/**
* @see \App\Http\Controllers\InventarioInicialController::deleteDraftItem
 * @see app/Http/Controllers/InventarioInicialController.php:370
 * @route '/inventario/inventario-inicial/draft/{borrador}/items/{item}'
 */
export const deleteDraftItem = (args: { borrador: string | number, item: string | number } | [borrador: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteDraftItem.url(args, options),
    method: 'delete',
})

deleteDraftItem.definition = {
    methods: ["delete"],
    url: '/inventario/inventario-inicial/draft/{borrador}/items/{item}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::deleteDraftItem
 * @see app/Http/Controllers/InventarioInicialController.php:370
 * @route '/inventario/inventario-inicial/draft/{borrador}/items/{item}'
 */
deleteDraftItem.url = (args: { borrador: string | number, item: string | number } | [borrador: string | number, item: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    borrador: args[0],
                    item: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        borrador: args.borrador,
                                item: args.item,
                }

    return deleteDraftItem.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace('{item}', parsedArgs.item.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::deleteDraftItem
 * @see app/Http/Controllers/InventarioInicialController.php:370
 * @route '/inventario/inventario-inicial/draft/{borrador}/items/{item}'
 */
deleteDraftItem.delete = (args: { borrador: string | number, item: string | number } | [borrador: string | number, item: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: deleteDraftItem.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::deleteDraftItem
 * @see app/Http/Controllers/InventarioInicialController.php:370
 * @route '/inventario/inventario-inicial/draft/{borrador}/items/{item}'
 */
    const deleteDraftItemForm = (args: { borrador: string | number, item: string | number } | [borrador: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: deleteDraftItem.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::deleteDraftItem
 * @see app/Http/Controllers/InventarioInicialController.php:370
 * @route '/inventario/inventario-inicial/draft/{borrador}/items/{item}'
 */
        deleteDraftItemForm.delete = (args: { borrador: string | number, item: string | number } | [borrador: string | number, item: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: deleteDraftItem.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    deleteDraftItem.form = deleteDraftItemForm
/**
* @see \App\Http\Controllers\InventarioInicialController::completeDraft
 * @see app/Http/Controllers/InventarioInicialController.php:391
 * @route '/inventario/inventario-inicial/draft/{borrador}/complete'
 */
export const completeDraft = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeDraft.url(args, options),
    method: 'post',
})

completeDraft.definition = {
    methods: ["post"],
    url: '/inventario/inventario-inicial/draft/{borrador}/complete',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioInicialController::completeDraft
 * @see app/Http/Controllers/InventarioInicialController.php:391
 * @route '/inventario/inventario-inicial/draft/{borrador}/complete'
 */
completeDraft.url = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return completeDraft.definition.url
            .replace('{borrador}', parsedArgs.borrador.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioInicialController::completeDraft
 * @see app/Http/Controllers/InventarioInicialController.php:391
 * @route '/inventario/inventario-inicial/draft/{borrador}/complete'
 */
completeDraft.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: completeDraft.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioInicialController::completeDraft
 * @see app/Http/Controllers/InventarioInicialController.php:391
 * @route '/inventario/inventario-inicial/draft/{borrador}/complete'
 */
    const completeDraftForm = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: completeDraft.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioInicialController::completeDraft
 * @see app/Http/Controllers/InventarioInicialController.php:391
 * @route '/inventario/inventario-inicial/draft/{borrador}/complete'
 */
        completeDraftForm.post = (args: { borrador: string | number } | [borrador: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: completeDraft.url(args, options),
            method: 'post',
        })
    
    completeDraft.form = completeDraftForm
const InventarioInicialController = { index, store, createOrGetDraft, getDraft, storeDraftItem, addProductosToDraft, loadProductsPaginated, searchProductosForSuggestions, searchProductoInDraft, deleteDraftItem, completeDraft }

export default InventarioInicialController