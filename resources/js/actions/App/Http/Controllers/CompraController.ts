import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2064
 * @route '/api/compras/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/compras/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2064
 * @route '/api/compras/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2064
 * @route '/api/compras/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2064
 * @route '/api/compras/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2064
 * @route '/api/compras/search'
 */
    const searchForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: search.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2064
 * @route '/api/compras/search'
 */
        searchForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::search
 * @see app/Http/Controllers/CompraController.php:2064
 * @route '/api/compras/search'
 */
        searchForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: search.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    search.form = searchForm
/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{id}/detalles'
 */
const show659ef1c8e787b2e9fa7ea9391bf1c532 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show659ef1c8e787b2e9fa7ea9391bf1c532.url(args, options),
    method: 'get',
})

show659ef1c8e787b2e9fa7ea9391bf1c532.definition = {
    methods: ["get","head"],
    url: '/api/compras/{id}/detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{id}/detalles'
 */
show659ef1c8e787b2e9fa7ea9391bf1c532.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return show659ef1c8e787b2e9fa7ea9391bf1c532.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{id}/detalles'
 */
show659ef1c8e787b2e9fa7ea9391bf1c532.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show659ef1c8e787b2e9fa7ea9391bf1c532.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{id}/detalles'
 */
show659ef1c8e787b2e9fa7ea9391bf1c532.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show659ef1c8e787b2e9fa7ea9391bf1c532.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{id}/detalles'
 */
    const show659ef1c8e787b2e9fa7ea9391bf1c532Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show659ef1c8e787b2e9fa7ea9391bf1c532.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{id}/detalles'
 */
        show659ef1c8e787b2e9fa7ea9391bf1c532Form.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show659ef1c8e787b2e9fa7ea9391bf1c532.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{id}/detalles'
 */
        show659ef1c8e787b2e9fa7ea9391bf1c532Form.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show659ef1c8e787b2e9fa7ea9391bf1c532.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show659ef1c8e787b2e9fa7ea9391bf1c532.form = show659ef1c8e787b2e9fa7ea9391bf1c532Form
    /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
const show393676824d4f9c447fe0b228852aaa0e = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show393676824d4f9c447fe0b228852aaa0e.url(args, options),
    method: 'get',
})

show393676824d4f9c447fe0b228852aaa0e.definition = {
    methods: ["get","head"],
    url: '/api/compras/{compra}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
show393676824d4f9c447fe0b228852aaa0e.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return show393676824d4f9c447fe0b228852aaa0e.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
show393676824d4f9c447fe0b228852aaa0e.get = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show393676824d4f9c447fe0b228852aaa0e.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
show393676824d4f9c447fe0b228852aaa0e.head = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show393676824d4f9c447fe0b228852aaa0e.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
    const show393676824d4f9c447fe0b228852aaa0eForm = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show393676824d4f9c447fe0b228852aaa0e.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
        show393676824d4f9c447fe0b228852aaa0eForm.get = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show393676824d4f9c447fe0b228852aaa0e.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/api/compras/{compra}'
 */
        show393676824d4f9c447fe0b228852aaa0eForm.head = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show393676824d4f9c447fe0b228852aaa0e.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show393676824d4f9c447fe0b228852aaa0e.form = show393676824d4f9c447fe0b228852aaa0eForm
    /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/compras/{compra}'
 */
const show38f98b93ecee7d377531798daf1d6db6 = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show38f98b93ecee7d377531798daf1d6db6.url(args, options),
    method: 'get',
})

show38f98b93ecee7d377531798daf1d6db6.definition = {
    methods: ["get","head"],
    url: '/compras/{compra}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/compras/{compra}'
 */
show38f98b93ecee7d377531798daf1d6db6.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return show38f98b93ecee7d377531798daf1d6db6.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/compras/{compra}'
 */
show38f98b93ecee7d377531798daf1d6db6.get = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show38f98b93ecee7d377531798daf1d6db6.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/compras/{compra}'
 */
show38f98b93ecee7d377531798daf1d6db6.head = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show38f98b93ecee7d377531798daf1d6db6.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/compras/{compra}'
 */
    const show38f98b93ecee7d377531798daf1d6db6Form = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show38f98b93ecee7d377531798daf1d6db6.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/compras/{compra}'
 */
        show38f98b93ecee7d377531798daf1d6db6Form.get = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show38f98b93ecee7d377531798daf1d6db6.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::show
 * @see app/Http/Controllers/CompraController.php:250
 * @route '/compras/{compra}'
 */
        show38f98b93ecee7d377531798daf1d6db6Form.head = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show38f98b93ecee7d377531798daf1d6db6.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show38f98b93ecee7d377531798daf1d6db6.form = show38f98b93ecee7d377531798daf1d6db6Form

export const show = {
    '/api/compras/{id}/detalles': show659ef1c8e787b2e9fa7ea9391bf1c532,
    '/api/compras/{compra}': show393676824d4f9c447fe0b228852aaa0e,
    '/compras/{compra}': show38f98b93ecee7d377531798daf1d6db6,
}

/**
* @see \App\Http\Controllers\CompraController::comprasParaImpresion
 * @see app/Http/Controllers/CompraController.php:1982
 * @route '/api/compras/para-impresion'
 */
export const comprasParaImpresion = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: comprasParaImpresion.url(options),
    method: 'get',
})

comprasParaImpresion.definition = {
    methods: ["get","head"],
    url: '/api/compras/para-impresion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::comprasParaImpresion
 * @see app/Http/Controllers/CompraController.php:1982
 * @route '/api/compras/para-impresion'
 */
comprasParaImpresion.url = (options?: RouteQueryOptions) => {
    return comprasParaImpresion.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::comprasParaImpresion
 * @see app/Http/Controllers/CompraController.php:1982
 * @route '/api/compras/para-impresion'
 */
comprasParaImpresion.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: comprasParaImpresion.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::comprasParaImpresion
 * @see app/Http/Controllers/CompraController.php:1982
 * @route '/api/compras/para-impresion'
 */
comprasParaImpresion.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: comprasParaImpresion.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::comprasParaImpresion
 * @see app/Http/Controllers/CompraController.php:1982
 * @route '/api/compras/para-impresion'
 */
    const comprasParaImpresionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: comprasParaImpresion.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::comprasParaImpresion
 * @see app/Http/Controllers/CompraController.php:1982
 * @route '/api/compras/para-impresion'
 */
        comprasParaImpresionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: comprasParaImpresion.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::comprasParaImpresion
 * @see app/Http/Controllers/CompraController.php:1982
 * @route '/api/compras/para-impresion'
 */
        comprasParaImpresionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: comprasParaImpresion.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    comprasParaImpresion.form = comprasParaImpresionForm
/**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
const index4669aa2d439683f739a27d1674132542 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index4669aa2d439683f739a27d1674132542.url(options),
    method: 'get',
})

index4669aa2d439683f739a27d1674132542.definition = {
    methods: ["get","head"],
    url: '/api/compras',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
index4669aa2d439683f739a27d1674132542.url = (options?: RouteQueryOptions) => {
    return index4669aa2d439683f739a27d1674132542.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
index4669aa2d439683f739a27d1674132542.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index4669aa2d439683f739a27d1674132542.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
index4669aa2d439683f739a27d1674132542.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index4669aa2d439683f739a27d1674132542.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
    const index4669aa2d439683f739a27d1674132542Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index4669aa2d439683f739a27d1674132542.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
        index4669aa2d439683f739a27d1674132542Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index4669aa2d439683f739a27d1674132542.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/api/compras'
 */
        index4669aa2d439683f739a27d1674132542Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index4669aa2d439683f739a27d1674132542.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index4669aa2d439683f739a27d1674132542.form = index4669aa2d439683f739a27d1674132542Form
    /**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/compras'
 */
const index9cbbd7839a2ac09dbcdb834730c30725 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index9cbbd7839a2ac09dbcdb834730c30725.url(options),
    method: 'get',
})

index9cbbd7839a2ac09dbcdb834730c30725.definition = {
    methods: ["get","head"],
    url: '/compras',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/compras'
 */
index9cbbd7839a2ac09dbcdb834730c30725.url = (options?: RouteQueryOptions) => {
    return index9cbbd7839a2ac09dbcdb834730c30725.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/compras'
 */
index9cbbd7839a2ac09dbcdb834730c30725.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index9cbbd7839a2ac09dbcdb834730c30725.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/compras'
 */
index9cbbd7839a2ac09dbcdb834730c30725.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index9cbbd7839a2ac09dbcdb834730c30725.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/compras'
 */
    const index9cbbd7839a2ac09dbcdb834730c30725Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index9cbbd7839a2ac09dbcdb834730c30725.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/compras'
 */
        index9cbbd7839a2ac09dbcdb834730c30725Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index9cbbd7839a2ac09dbcdb834730c30725.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::index
 * @see app/Http/Controllers/CompraController.php:52
 * @route '/compras'
 */
        index9cbbd7839a2ac09dbcdb834730c30725Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index9cbbd7839a2ac09dbcdb834730c30725.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index9cbbd7839a2ac09dbcdb834730c30725.form = index9cbbd7839a2ac09dbcdb834730c30725Form

export const index = {
    '/api/compras': index4669aa2d439683f739a27d1674132542,
    '/compras': index9cbbd7839a2ac09dbcdb834730c30725,
}

/**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/api/compras'
 */
const store4669aa2d439683f739a27d1674132542 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store4669aa2d439683f739a27d1674132542.url(options),
    method: 'post',
})

store4669aa2d439683f739a27d1674132542.definition = {
    methods: ["post"],
    url: '/api/compras',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/api/compras'
 */
store4669aa2d439683f739a27d1674132542.url = (options?: RouteQueryOptions) => {
    return store4669aa2d439683f739a27d1674132542.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/api/compras'
 */
store4669aa2d439683f739a27d1674132542.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store4669aa2d439683f739a27d1674132542.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/api/compras'
 */
    const store4669aa2d439683f739a27d1674132542Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store4669aa2d439683f739a27d1674132542.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/api/compras'
 */
        store4669aa2d439683f739a27d1674132542Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store4669aa2d439683f739a27d1674132542.url(options),
            method: 'post',
        })
    
    store4669aa2d439683f739a27d1674132542.form = store4669aa2d439683f739a27d1674132542Form
    /**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/compras'
 */
const store9cbbd7839a2ac09dbcdb834730c30725 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store9cbbd7839a2ac09dbcdb834730c30725.url(options),
    method: 'post',
})

store9cbbd7839a2ac09dbcdb834730c30725.definition = {
    methods: ["post"],
    url: '/compras',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/compras'
 */
store9cbbd7839a2ac09dbcdb834730c30725.url = (options?: RouteQueryOptions) => {
    return store9cbbd7839a2ac09dbcdb834730c30725.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/compras'
 */
store9cbbd7839a2ac09dbcdb834730c30725.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store9cbbd7839a2ac09dbcdb834730c30725.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/compras'
 */
    const store9cbbd7839a2ac09dbcdb834730c30725Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store9cbbd7839a2ac09dbcdb834730c30725.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraController::store
 * @see app/Http/Controllers/CompraController.php:476
 * @route '/compras'
 */
        store9cbbd7839a2ac09dbcdb834730c30725Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store9cbbd7839a2ac09dbcdb834730c30725.url(options),
            method: 'post',
        })
    
    store9cbbd7839a2ac09dbcdb834730c30725.form = store9cbbd7839a2ac09dbcdb834730c30725Form

export const store = {
    '/api/compras': store4669aa2d439683f739a27d1674132542,
    '/compras': store9cbbd7839a2ac09dbcdb834730c30725,
}

/**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
const update393676824d4f9c447fe0b228852aaa0e = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update393676824d4f9c447fe0b228852aaa0e.url(args, options),
    method: 'put',
})

update393676824d4f9c447fe0b228852aaa0e.definition = {
    methods: ["put","patch"],
    url: '/api/compras/{compra}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
update393676824d4f9c447fe0b228852aaa0e.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return update393676824d4f9c447fe0b228852aaa0e.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
update393676824d4f9c447fe0b228852aaa0e.put = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update393676824d4f9c447fe0b228852aaa0e.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
update393676824d4f9c447fe0b228852aaa0e.patch = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update393676824d4f9c447fe0b228852aaa0e.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
    const update393676824d4f9c447fe0b228852aaa0eForm = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update393676824d4f9c447fe0b228852aaa0e.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
        update393676824d4f9c447fe0b228852aaa0eForm.put = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update393676824d4f9c447fe0b228852aaa0e.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/api/compras/{compra}'
 */
        update393676824d4f9c447fe0b228852aaa0eForm.patch = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update393676824d4f9c447fe0b228852aaa0e.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update393676824d4f9c447fe0b228852aaa0e.form = update393676824d4f9c447fe0b228852aaa0eForm
    /**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/compras/{compra}'
 */
const update38f98b93ecee7d377531798daf1d6db6 = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update38f98b93ecee7d377531798daf1d6db6.url(args, options),
    method: 'put',
})

update38f98b93ecee7d377531798daf1d6db6.definition = {
    methods: ["put","patch"],
    url: '/compras/{compra}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/compras/{compra}'
 */
update38f98b93ecee7d377531798daf1d6db6.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return update38f98b93ecee7d377531798daf1d6db6.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/compras/{compra}'
 */
update38f98b93ecee7d377531798daf1d6db6.put = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update38f98b93ecee7d377531798daf1d6db6.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/compras/{compra}'
 */
update38f98b93ecee7d377531798daf1d6db6.patch = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update38f98b93ecee7d377531798daf1d6db6.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/compras/{compra}'
 */
    const update38f98b93ecee7d377531798daf1d6db6Form = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update38f98b93ecee7d377531798daf1d6db6.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/compras/{compra}'
 */
        update38f98b93ecee7d377531798daf1d6db6Form.put = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update38f98b93ecee7d377531798daf1d6db6.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\CompraController::update
 * @see app/Http/Controllers/CompraController.php:640
 * @route '/compras/{compra}'
 */
        update38f98b93ecee7d377531798daf1d6db6Form.patch = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update38f98b93ecee7d377531798daf1d6db6.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update38f98b93ecee7d377531798daf1d6db6.form = update38f98b93ecee7d377531798daf1d6db6Form

export const update = {
    '/api/compras/{compra}': update393676824d4f9c447fe0b228852aaa0e,
    '/compras/{compra}': update38f98b93ecee7d377531798daf1d6db6,
}

/**
* @see \App\Http\Controllers\CompraController::destroy
 * @see app/Http/Controllers/CompraController.php:1116
 * @route '/api/compras/{compra}'
 */
export const destroy = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/compras/{compra}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\CompraController::destroy
 * @see app/Http/Controllers/CompraController.php:1116
 * @route '/api/compras/{compra}'
 */
destroy.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return destroy.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::destroy
 * @see app/Http/Controllers/CompraController.php:1116
 * @route '/api/compras/{compra}'
 */
destroy.delete = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\CompraController::destroy
 * @see app/Http/Controllers/CompraController.php:1116
 * @route '/api/compras/{compra}'
 */
    const destroyForm = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraController::destroy
 * @see app/Http/Controllers/CompraController.php:1116
 * @route '/api/compras/{compra}'
 */
        destroyForm.delete = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\CompraController::anular
 * @see app/Http/Controllers/CompraController.php:1325
 * @route '/compras/{compra}/anular'
 */
export const anular = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anular.url(args, options),
    method: 'post',
})

anular.definition = {
    methods: ["post"],
    url: '/compras/{compra}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CompraController::anular
 * @see app/Http/Controllers/CompraController.php:1325
 * @route '/compras/{compra}/anular'
 */
anular.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return anular.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::anular
 * @see app/Http/Controllers/CompraController.php:1325
 * @route '/compras/{compra}/anular'
 */
anular.post = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anular.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CompraController::anular
 * @see app/Http/Controllers/CompraController.php:1325
 * @route '/compras/{compra}/anular'
 */
    const anularForm = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: anular.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CompraController::anular
 * @see app/Http/Controllers/CompraController.php:1325
 * @route '/compras/{compra}/anular'
 */
        anularForm.post = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: anular.url(args, options),
            method: 'post',
        })
    
    anular.form = anularForm
/**
* @see \App\Http\Controllers\CompraController::create
 * @see app/Http/Controllers/CompraController.php:157
 * @route '/compras/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/compras/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::create
 * @see app/Http/Controllers/CompraController.php:157
 * @route '/compras/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::create
 * @see app/Http/Controllers/CompraController.php:157
 * @route '/compras/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::create
 * @see app/Http/Controllers/CompraController.php:157
 * @route '/compras/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::create
 * @see app/Http/Controllers/CompraController.php:157
 * @route '/compras/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::create
 * @see app/Http/Controllers/CompraController.php:157
 * @route '/compras/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::create
 * @see app/Http/Controllers/CompraController.php:157
 * @route '/compras/create'
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
* @see \App\Http\Controllers\CompraController::edit
 * @see app/Http/Controllers/CompraController.php:312
 * @route '/compras/{compra}/edit'
 */
export const edit = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/compras/{compra}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::edit
 * @see app/Http/Controllers/CompraController.php:312
 * @route '/compras/{compra}/edit'
 */
edit.url = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: args.compra,
                }

    return edit.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::edit
 * @see app/Http/Controllers/CompraController.php:312
 * @route '/compras/{compra}/edit'
 */
edit.get = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::edit
 * @see app/Http/Controllers/CompraController.php:312
 * @route '/compras/{compra}/edit'
 */
edit.head = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::edit
 * @see app/Http/Controllers/CompraController.php:312
 * @route '/compras/{compra}/edit'
 */
    const editForm = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::edit
 * @see app/Http/Controllers/CompraController.php:312
 * @route '/compras/{compra}/edit'
 */
        editForm.get = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::edit
 * @see app/Http/Controllers/CompraController.php:312
 * @route '/compras/{compra}/edit'
 */
        editForm.head = (args: { compra: string | number } | [compra: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\CompraController::previewCompra
 * @see app/Http/Controllers/CompraController.php:1773
 * @route '/compras/{compra}/preview'
 */
export const previewCompra = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewCompra.url(args, options),
    method: 'get',
})

previewCompra.definition = {
    methods: ["get","head"],
    url: '/compras/{compra}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::previewCompra
 * @see app/Http/Controllers/CompraController.php:1773
 * @route '/compras/{compra}/preview'
 */
previewCompra.url = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { compra: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: typeof args.compra === 'object'
                ? args.compra.id
                : args.compra,
                }

    return previewCompra.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::previewCompra
 * @see app/Http/Controllers/CompraController.php:1773
 * @route '/compras/{compra}/preview'
 */
previewCompra.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewCompra.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::previewCompra
 * @see app/Http/Controllers/CompraController.php:1773
 * @route '/compras/{compra}/preview'
 */
previewCompra.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewCompra.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::previewCompra
 * @see app/Http/Controllers/CompraController.php:1773
 * @route '/compras/{compra}/preview'
 */
    const previewCompraForm = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: previewCompra.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::previewCompra
 * @see app/Http/Controllers/CompraController.php:1773
 * @route '/compras/{compra}/preview'
 */
        previewCompraForm.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewCompra.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::previewCompra
 * @see app/Http/Controllers/CompraController.php:1773
 * @route '/compras/{compra}/preview'
 */
        previewCompraForm.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewCompra.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    previewCompra.form = previewCompraForm
/**
* @see \App\Http\Controllers\CompraController::exportarExcel
 * @see app/Http/Controllers/CompraController.php:1879
 * @route '/compras/{compra}/exportar-excel'
 */
export const exportarExcel = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})

exportarExcel.definition = {
    methods: ["get","head"],
    url: '/compras/{compra}/exportar-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::exportarExcel
 * @see app/Http/Controllers/CompraController.php:1879
 * @route '/compras/{compra}/exportar-excel'
 */
exportarExcel.url = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { compra: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: typeof args.compra === 'object'
                ? args.compra.id
                : args.compra,
                }

    return exportarExcel.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::exportarExcel
 * @see app/Http/Controllers/CompraController.php:1879
 * @route '/compras/{compra}/exportar-excel'
 */
exportarExcel.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::exportarExcel
 * @see app/Http/Controllers/CompraController.php:1879
 * @route '/compras/{compra}/exportar-excel'
 */
exportarExcel.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarExcel.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::exportarExcel
 * @see app/Http/Controllers/CompraController.php:1879
 * @route '/compras/{compra}/exportar-excel'
 */
    const exportarExcelForm = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarExcel.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::exportarExcel
 * @see app/Http/Controllers/CompraController.php:1879
 * @route '/compras/{compra}/exportar-excel'
 */
        exportarExcelForm.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarExcel.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::exportarExcel
 * @see app/Http/Controllers/CompraController.php:1879
 * @route '/compras/{compra}/exportar-excel'
 */
        exportarExcelForm.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarExcel.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportarExcel.form = exportarExcelForm
/**
* @see \App\Http\Controllers\CompraController::exportarPdf
 * @see app/Http/Controllers/CompraController.php:1903
 * @route '/compras/{compra}/exportar-pdf'
 */
export const exportarPdf = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})

exportarPdf.definition = {
    methods: ["get","head"],
    url: '/compras/{compra}/exportar-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CompraController::exportarPdf
 * @see app/Http/Controllers/CompraController.php:1903
 * @route '/compras/{compra}/exportar-pdf'
 */
exportarPdf.url = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { compra: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { compra: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    compra: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        compra: typeof args.compra === 'object'
                ? args.compra.id
                : args.compra,
                }

    return exportarPdf.definition.url
            .replace('{compra}', parsedArgs.compra.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CompraController::exportarPdf
 * @see app/Http/Controllers/CompraController.php:1903
 * @route '/compras/{compra}/exportar-pdf'
 */
exportarPdf.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CompraController::exportarPdf
 * @see app/Http/Controllers/CompraController.php:1903
 * @route '/compras/{compra}/exportar-pdf'
 */
exportarPdf.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CompraController::exportarPdf
 * @see app/Http/Controllers/CompraController.php:1903
 * @route '/compras/{compra}/exportar-pdf'
 */
    const exportarPdfForm = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CompraController::exportarPdf
 * @see app/Http/Controllers/CompraController.php:1903
 * @route '/compras/{compra}/exportar-pdf'
 */
        exportarPdfForm.get = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CompraController::exportarPdf
 * @see app/Http/Controllers/CompraController.php:1903
 * @route '/compras/{compra}/exportar-pdf'
 */
        exportarPdfForm.head = (args: { compra: number | { id: number } } | [compra: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportarPdf.form = exportarPdfForm
const CompraController = { search, show, comprasParaImpresion, index, store, update, destroy, anular, create, edit, previewCompra, exportarExcel, exportarPdf }

export default CompraController