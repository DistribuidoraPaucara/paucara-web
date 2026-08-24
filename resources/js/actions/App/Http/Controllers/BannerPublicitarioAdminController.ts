import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::index
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:16
 * @route '/admin/banners-publicitarios'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/banners-publicitarios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::index
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:16
 * @route '/admin/banners-publicitarios'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::index
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:16
 * @route '/admin/banners-publicitarios'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::index
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:16
 * @route '/admin/banners-publicitarios'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::index
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:16
 * @route '/admin/banners-publicitarios'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::index
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:16
 * @route '/admin/banners-publicitarios'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::index
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:16
 * @route '/admin/banners-publicitarios'
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
* @see \App\Http\Controllers\BannerPublicitarioAdminController::store
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:107
 * @route '/admin/banners-publicitarios'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/admin/banners-publicitarios',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::store
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:107
 * @route '/admin/banners-publicitarios'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::store
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:107
 * @route '/admin/banners-publicitarios'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::store
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:107
 * @route '/admin/banners-publicitarios'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::store
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:107
 * @route '/admin/banners-publicitarios'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::update
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:166
 * @route '/admin/banners-publicitarios/{banner}'
 */
export const update = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/admin/banners-publicitarios/{banner}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::update
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:166
 * @route '/admin/banners-publicitarios/{banner}'
 */
update.url = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { banner: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { banner: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    banner: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        banner: typeof args.banner === 'object'
                ? args.banner.id
                : args.banner,
                }

    return update.definition.url
            .replace('{banner}', parsedArgs.banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::update
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:166
 * @route '/admin/banners-publicitarios/{banner}'
 */
update.post = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::update
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:166
 * @route '/admin/banners-publicitarios/{banner}'
 */
    const updateForm = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::update
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:166
 * @route '/admin/banners-publicitarios/{banner}'
 */
        updateForm.post = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, options),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::toggleActivo
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:222
 * @route '/admin/banners-publicitarios/{banner}/toggle'
 */
export const toggleActivo = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActivo.url(args, options),
    method: 'patch',
})

toggleActivo.definition = {
    methods: ["patch"],
    url: '/admin/banners-publicitarios/{banner}/toggle',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::toggleActivo
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:222
 * @route '/admin/banners-publicitarios/{banner}/toggle'
 */
toggleActivo.url = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { banner: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { banner: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    banner: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        banner: typeof args.banner === 'object'
                ? args.banner.id
                : args.banner,
                }

    return toggleActivo.definition.url
            .replace('{banner}', parsedArgs.banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::toggleActivo
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:222
 * @route '/admin/banners-publicitarios/{banner}/toggle'
 */
toggleActivo.patch = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActivo.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::toggleActivo
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:222
 * @route '/admin/banners-publicitarios/{banner}/toggle'
 */
    const toggleActivoForm = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleActivo.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::toggleActivo
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:222
 * @route '/admin/banners-publicitarios/{banner}/toggle'
 */
        toggleActivoForm.patch = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleActivo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleActivo.form = toggleActivoForm
/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::destroy
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:274
 * @route '/admin/banners-publicitarios/{banner}'
 */
export const destroy = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/admin/banners-publicitarios/{banner}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::destroy
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:274
 * @route '/admin/banners-publicitarios/{banner}'
 */
destroy.url = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { banner: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { banner: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    banner: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        banner: typeof args.banner === 'object'
                ? args.banner.id
                : args.banner,
                }

    return destroy.definition.url
            .replace('{banner}', parsedArgs.banner.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::destroy
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:274
 * @route '/admin/banners-publicitarios/{banner}'
 */
destroy.delete = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::destroy
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:274
 * @route '/admin/banners-publicitarios/{banner}'
 */
    const destroyForm = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::destroy
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:274
 * @route '/admin/banners-publicitarios/{banner}'
 */
        destroyForm.delete = (args: { banner: number | { id: number } } | [banner: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\BannerPublicitarioAdminController::actualizarOrden
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:247
 * @route '/admin/banners-publicitarios/actualizar-orden'
 */
export const actualizarOrden = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarOrden.url(options),
    method: 'post',
})

actualizarOrden.definition = {
    methods: ["post"],
    url: '/admin/banners-publicitarios/actualizar-orden',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::actualizarOrden
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:247
 * @route '/admin/banners-publicitarios/actualizar-orden'
 */
actualizarOrden.url = (options?: RouteQueryOptions) => {
    return actualizarOrden.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::actualizarOrden
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:247
 * @route '/admin/banners-publicitarios/actualizar-orden'
 */
actualizarOrden.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarOrden.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::actualizarOrden
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:247
 * @route '/admin/banners-publicitarios/actualizar-orden'
 */
    const actualizarOrdenForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarOrden.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\BannerPublicitarioAdminController::actualizarOrden
 * @see app/Http/Controllers/BannerPublicitarioAdminController.php:247
 * @route '/admin/banners-publicitarios/actualizar-orden'
 */
        actualizarOrdenForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarOrden.url(options),
            method: 'post',
        })
    
    actualizarOrden.form = actualizarOrdenForm
const BannerPublicitarioAdminController = { index, store, update, toggleActivo, destroy, actualizarOrden }

export default BannerPublicitarioAdminController