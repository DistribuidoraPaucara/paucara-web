import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/api/tipo-operacion-caja'
 */
const index6b30bac62c927cd99dd8ad115709748d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index6b30bac62c927cd99dd8ad115709748d.url(options),
    method: 'get',
})

index6b30bac62c927cd99dd8ad115709748d.definition = {
    methods: ["get","head"],
    url: '/api/tipo-operacion-caja',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/api/tipo-operacion-caja'
 */
index6b30bac62c927cd99dd8ad115709748d.url = (options?: RouteQueryOptions) => {
    return index6b30bac62c927cd99dd8ad115709748d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/api/tipo-operacion-caja'
 */
index6b30bac62c927cd99dd8ad115709748d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index6b30bac62c927cd99dd8ad115709748d.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/api/tipo-operacion-caja'
 */
index6b30bac62c927cd99dd8ad115709748d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index6b30bac62c927cd99dd8ad115709748d.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/api/tipo-operacion-caja'
 */
    const index6b30bac62c927cd99dd8ad115709748dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index6b30bac62c927cd99dd8ad115709748d.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/api/tipo-operacion-caja'
 */
        index6b30bac62c927cd99dd8ad115709748dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index6b30bac62c927cd99dd8ad115709748d.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/api/tipo-operacion-caja'
 */
        index6b30bac62c927cd99dd8ad115709748dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index6b30bac62c927cd99dd8ad115709748d.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index6b30bac62c927cd99dd8ad115709748d.form = index6b30bac62c927cd99dd8ad115709748dForm
    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/tipo-operacion-caja'
 */
const indexb18f28aa9328dee4a5a2bae5218874dd = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb18f28aa9328dee4a5a2bae5218874dd.url(options),
    method: 'get',
})

indexb18f28aa9328dee4a5a2bae5218874dd.definition = {
    methods: ["get","head"],
    url: '/tipo-operacion-caja',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/tipo-operacion-caja'
 */
indexb18f28aa9328dee4a5a2bae5218874dd.url = (options?: RouteQueryOptions) => {
    return indexb18f28aa9328dee4a5a2bae5218874dd.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/tipo-operacion-caja'
 */
indexb18f28aa9328dee4a5a2bae5218874dd.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexb18f28aa9328dee4a5a2bae5218874dd.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/tipo-operacion-caja'
 */
indexb18f28aa9328dee4a5a2bae5218874dd.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexb18f28aa9328dee4a5a2bae5218874dd.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/tipo-operacion-caja'
 */
    const indexb18f28aa9328dee4a5a2bae5218874ddForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexb18f28aa9328dee4a5a2bae5218874dd.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/tipo-operacion-caja'
 */
        indexb18f28aa9328dee4a5a2bae5218874ddForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexb18f28aa9328dee4a5a2bae5218874dd.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::index
 * @see app/Http/Controllers/TipoOperacionCajaController.php:68
 * @route '/tipo-operacion-caja'
 */
        indexb18f28aa9328dee4a5a2bae5218874ddForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexb18f28aa9328dee4a5a2bae5218874dd.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexb18f28aa9328dee4a5a2bae5218874dd.form = indexb18f28aa9328dee4a5a2bae5218874ddForm

export const index = {
    '/api/tipo-operacion-caja': index6b30bac62c927cd99dd8ad115709748d,
    '/tipo-operacion-caja': indexb18f28aa9328dee4a5a2bae5218874dd,
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/api/tipo-operacion-caja'
 */
const store6b30bac62c927cd99dd8ad115709748d = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store6b30bac62c927cd99dd8ad115709748d.url(options),
    method: 'post',
})

store6b30bac62c927cd99dd8ad115709748d.definition = {
    methods: ["post"],
    url: '/api/tipo-operacion-caja',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/api/tipo-operacion-caja'
 */
store6b30bac62c927cd99dd8ad115709748d.url = (options?: RouteQueryOptions) => {
    return store6b30bac62c927cd99dd8ad115709748d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/api/tipo-operacion-caja'
 */
store6b30bac62c927cd99dd8ad115709748d.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store6b30bac62c927cd99dd8ad115709748d.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/api/tipo-operacion-caja'
 */
    const store6b30bac62c927cd99dd8ad115709748dForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store6b30bac62c927cd99dd8ad115709748d.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/api/tipo-operacion-caja'
 */
        store6b30bac62c927cd99dd8ad115709748dForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store6b30bac62c927cd99dd8ad115709748d.url(options),
            method: 'post',
        })
    
    store6b30bac62c927cd99dd8ad115709748d.form = store6b30bac62c927cd99dd8ad115709748dForm
    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/tipo-operacion-caja'
 */
const storeb18f28aa9328dee4a5a2bae5218874dd = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeb18f28aa9328dee4a5a2bae5218874dd.url(options),
    method: 'post',
})

storeb18f28aa9328dee4a5a2bae5218874dd.definition = {
    methods: ["post"],
    url: '/tipo-operacion-caja',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/tipo-operacion-caja'
 */
storeb18f28aa9328dee4a5a2bae5218874dd.url = (options?: RouteQueryOptions) => {
    return storeb18f28aa9328dee4a5a2bae5218874dd.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/tipo-operacion-caja'
 */
storeb18f28aa9328dee4a5a2bae5218874dd.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeb18f28aa9328dee4a5a2bae5218874dd.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/tipo-operacion-caja'
 */
    const storeb18f28aa9328dee4a5a2bae5218874ddForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: storeb18f28aa9328dee4a5a2bae5218874dd.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::store
 * @see app/Http/Controllers/TipoOperacionCajaController.php:177
 * @route '/tipo-operacion-caja'
 */
        storeb18f28aa9328dee4a5a2bae5218874ddForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: storeb18f28aa9328dee4a5a2bae5218874dd.url(options),
            method: 'post',
        })
    
    storeb18f28aa9328dee4a5a2bae5218874dd.form = storeb18f28aa9328dee4a5a2bae5218874ddForm

export const store = {
    '/api/tipo-operacion-caja': store6b30bac62c927cd99dd8ad115709748d,
    '/tipo-operacion-caja': storeb18f28aa9328dee4a5a2bae5218874dd,
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
const show7010b75504de8b3e5fb5d3fb86639f0f = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show7010b75504de8b3e5fb5d3fb86639f0f.url(args, options),
    method: 'get',
})

show7010b75504de8b3e5fb5d3fb86639f0f.definition = {
    methods: ["get","head"],
    url: '/api/tipo-operacion-caja/{tipo_operacion_caja}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
show7010b75504de8b3e5fb5d3fb86639f0f.url = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_operacion_caja: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_operacion_caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_operacion_caja: args.tipo_operacion_caja,
                }

    return show7010b75504de8b3e5fb5d3fb86639f0f.definition.url
            .replace('{tipo_operacion_caja}', parsedArgs.tipo_operacion_caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
show7010b75504de8b3e5fb5d3fb86639f0f.get = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show7010b75504de8b3e5fb5d3fb86639f0f.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
show7010b75504de8b3e5fb5d3fb86639f0f.head = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show7010b75504de8b3e5fb5d3fb86639f0f.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
    const show7010b75504de8b3e5fb5d3fb86639f0fForm = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show7010b75504de8b3e5fb5d3fb86639f0f.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
        show7010b75504de8b3e5fb5d3fb86639f0fForm.get = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show7010b75504de8b3e5fb5d3fb86639f0f.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
        show7010b75504de8b3e5fb5d3fb86639f0fForm.head = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show7010b75504de8b3e5fb5d3fb86639f0f.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show7010b75504de8b3e5fb5d3fb86639f0f.form = show7010b75504de8b3e5fb5d3fb86639f0fForm
    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
const show8055b499e70eb7ce96e1bb4736306dd9 = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show8055b499e70eb7ce96e1bb4736306dd9.url(args, options),
    method: 'get',
})

show8055b499e70eb7ce96e1bb4736306dd9.definition = {
    methods: ["get","head"],
    url: '/tipo-operacion-caja/{tipo_operacion_caja}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
show8055b499e70eb7ce96e1bb4736306dd9.url = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_operacion_caja: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_operacion_caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_operacion_caja: args.tipo_operacion_caja,
                }

    return show8055b499e70eb7ce96e1bb4736306dd9.definition.url
            .replace('{tipo_operacion_caja}', parsedArgs.tipo_operacion_caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
show8055b499e70eb7ce96e1bb4736306dd9.get = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show8055b499e70eb7ce96e1bb4736306dd9.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
show8055b499e70eb7ce96e1bb4736306dd9.head = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show8055b499e70eb7ce96e1bb4736306dd9.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
    const show8055b499e70eb7ce96e1bb4736306dd9Form = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show8055b499e70eb7ce96e1bb4736306dd9.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
        show8055b499e70eb7ce96e1bb4736306dd9Form.get = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show8055b499e70eb7ce96e1bb4736306dd9.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::show
 * @see app/Http/Controllers/TipoOperacionCajaController.php:0
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
        show8055b499e70eb7ce96e1bb4736306dd9Form.head = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show8055b499e70eb7ce96e1bb4736306dd9.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show8055b499e70eb7ce96e1bb4736306dd9.form = show8055b499e70eb7ce96e1bb4736306dd9Form

export const show = {
    '/api/tipo-operacion-caja/{tipo_operacion_caja}': show7010b75504de8b3e5fb5d3fb86639f0f,
    '/tipo-operacion-caja/{tipo_operacion_caja}': show8055b499e70eb7ce96e1bb4736306dd9,
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
const update7010b75504de8b3e5fb5d3fb86639f0f = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update7010b75504de8b3e5fb5d3fb86639f0f.url(args, options),
    method: 'put',
})

update7010b75504de8b3e5fb5d3fb86639f0f.definition = {
    methods: ["put","patch"],
    url: '/api/tipo-operacion-caja/{tipo_operacion_caja}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
update7010b75504de8b3e5fb5d3fb86639f0f.url = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_operacion_caja: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_operacion_caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_operacion_caja: args.tipo_operacion_caja,
                }

    return update7010b75504de8b3e5fb5d3fb86639f0f.definition.url
            .replace('{tipo_operacion_caja}', parsedArgs.tipo_operacion_caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
update7010b75504de8b3e5fb5d3fb86639f0f.put = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update7010b75504de8b3e5fb5d3fb86639f0f.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
update7010b75504de8b3e5fb5d3fb86639f0f.patch = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update7010b75504de8b3e5fb5d3fb86639f0f.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
    const update7010b75504de8b3e5fb5d3fb86639f0fForm = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update7010b75504de8b3e5fb5d3fb86639f0f.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
        update7010b75504de8b3e5fb5d3fb86639f0fForm.put = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update7010b75504de8b3e5fb5d3fb86639f0f.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
        update7010b75504de8b3e5fb5d3fb86639f0fForm.patch = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update7010b75504de8b3e5fb5d3fb86639f0f.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update7010b75504de8b3e5fb5d3fb86639f0f.form = update7010b75504de8b3e5fb5d3fb86639f0fForm
    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
const update8055b499e70eb7ce96e1bb4736306dd9 = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update8055b499e70eb7ce96e1bb4736306dd9.url(args, options),
    method: 'put',
})

update8055b499e70eb7ce96e1bb4736306dd9.definition = {
    methods: ["put","patch"],
    url: '/tipo-operacion-caja/{tipo_operacion_caja}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
update8055b499e70eb7ce96e1bb4736306dd9.url = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_operacion_caja: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_operacion_caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_operacion_caja: args.tipo_operacion_caja,
                }

    return update8055b499e70eb7ce96e1bb4736306dd9.definition.url
            .replace('{tipo_operacion_caja}', parsedArgs.tipo_operacion_caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
update8055b499e70eb7ce96e1bb4736306dd9.put = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update8055b499e70eb7ce96e1bb4736306dd9.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
update8055b499e70eb7ce96e1bb4736306dd9.patch = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update8055b499e70eb7ce96e1bb4736306dd9.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
    const update8055b499e70eb7ce96e1bb4736306dd9Form = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update8055b499e70eb7ce96e1bb4736306dd9.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
        update8055b499e70eb7ce96e1bb4736306dd9Form.put = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update8055b499e70eb7ce96e1bb4736306dd9.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::update
 * @see app/Http/Controllers/TipoOperacionCajaController.php:222
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
        update8055b499e70eb7ce96e1bb4736306dd9Form.patch = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update8055b499e70eb7ce96e1bb4736306dd9.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update8055b499e70eb7ce96e1bb4736306dd9.form = update8055b499e70eb7ce96e1bb4736306dd9Form

export const update = {
    '/api/tipo-operacion-caja/{tipo_operacion_caja}': update7010b75504de8b3e5fb5d3fb86639f0f,
    '/tipo-operacion-caja/{tipo_operacion_caja}': update8055b499e70eb7ce96e1bb4736306dd9,
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
const destroy7010b75504de8b3e5fb5d3fb86639f0f = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy7010b75504de8b3e5fb5d3fb86639f0f.url(args, options),
    method: 'delete',
})

destroy7010b75504de8b3e5fb5d3fb86639f0f.definition = {
    methods: ["delete"],
    url: '/api/tipo-operacion-caja/{tipo_operacion_caja}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
destroy7010b75504de8b3e5fb5d3fb86639f0f.url = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_operacion_caja: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_operacion_caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_operacion_caja: args.tipo_operacion_caja,
                }

    return destroy7010b75504de8b3e5fb5d3fb86639f0f.definition.url
            .replace('{tipo_operacion_caja}', parsedArgs.tipo_operacion_caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
destroy7010b75504de8b3e5fb5d3fb86639f0f.delete = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy7010b75504de8b3e5fb5d3fb86639f0f.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
    const destroy7010b75504de8b3e5fb5d3fb86639f0fForm = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy7010b75504de8b3e5fb5d3fb86639f0f.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/api/tipo-operacion-caja/{tipo_operacion_caja}'
 */
        destroy7010b75504de8b3e5fb5d3fb86639f0fForm.delete = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy7010b75504de8b3e5fb5d3fb86639f0f.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy7010b75504de8b3e5fb5d3fb86639f0f.form = destroy7010b75504de8b3e5fb5d3fb86639f0fForm
    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
const destroy8055b499e70eb7ce96e1bb4736306dd9 = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy8055b499e70eb7ce96e1bb4736306dd9.url(args, options),
    method: 'delete',
})

destroy8055b499e70eb7ce96e1bb4736306dd9.definition = {
    methods: ["delete"],
    url: '/tipo-operacion-caja/{tipo_operacion_caja}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
destroy8055b499e70eb7ce96e1bb4736306dd9.url = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_operacion_caja: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_operacion_caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_operacion_caja: args.tipo_operacion_caja,
                }

    return destroy8055b499e70eb7ce96e1bb4736306dd9.definition.url
            .replace('{tipo_operacion_caja}', parsedArgs.tipo_operacion_caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
destroy8055b499e70eb7ce96e1bb4736306dd9.delete = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy8055b499e70eb7ce96e1bb4736306dd9.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
    const destroy8055b499e70eb7ce96e1bb4736306dd9Form = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy8055b499e70eb7ce96e1bb4736306dd9.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::destroy
 * @see app/Http/Controllers/TipoOperacionCajaController.php:244
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}'
 */
        destroy8055b499e70eb7ce96e1bb4736306dd9Form.delete = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy8055b499e70eb7ce96e1bb4736306dd9.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy8055b499e70eb7ce96e1bb4736306dd9.form = destroy8055b499e70eb7ce96e1bb4736306dd9Form

export const destroy = {
    '/api/tipo-operacion-caja/{tipo_operacion_caja}': destroy7010b75504de8b3e5fb5d3fb86639f0f,
    '/tipo-operacion-caja/{tipo_operacion_caja}': destroy8055b499e70eb7ce96e1bb4736306dd9,
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::create
 * @see app/Http/Controllers/TipoOperacionCajaController.php:162
 * @route '/tipo-operacion-caja/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/tipo-operacion-caja/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::create
 * @see app/Http/Controllers/TipoOperacionCajaController.php:162
 * @route '/tipo-operacion-caja/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::create
 * @see app/Http/Controllers/TipoOperacionCajaController.php:162
 * @route '/tipo-operacion-caja/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::create
 * @see app/Http/Controllers/TipoOperacionCajaController.php:162
 * @route '/tipo-operacion-caja/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::create
 * @see app/Http/Controllers/TipoOperacionCajaController.php:162
 * @route '/tipo-operacion-caja/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::create
 * @see app/Http/Controllers/TipoOperacionCajaController.php:162
 * @route '/tipo-operacion-caja/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::create
 * @see app/Http/Controllers/TipoOperacionCajaController.php:162
 * @route '/tipo-operacion-caja/create'
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
* @see \App\Http\Controllers\TipoOperacionCajaController::edit
 * @see app/Http/Controllers/TipoOperacionCajaController.php:203
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}/edit'
 */
export const edit = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/tipo-operacion-caja/{tipo_operacion_caja}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::edit
 * @see app/Http/Controllers/TipoOperacionCajaController.php:203
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}/edit'
 */
edit.url = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { tipo_operacion_caja: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    tipo_operacion_caja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        tipo_operacion_caja: args.tipo_operacion_caja,
                }

    return edit.definition.url
            .replace('{tipo_operacion_caja}', parsedArgs.tipo_operacion_caja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\TipoOperacionCajaController::edit
 * @see app/Http/Controllers/TipoOperacionCajaController.php:203
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}/edit'
 */
edit.get = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\TipoOperacionCajaController::edit
 * @see app/Http/Controllers/TipoOperacionCajaController.php:203
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}/edit'
 */
edit.head = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\TipoOperacionCajaController::edit
 * @see app/Http/Controllers/TipoOperacionCajaController.php:203
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}/edit'
 */
    const editForm = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::edit
 * @see app/Http/Controllers/TipoOperacionCajaController.php:203
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}/edit'
 */
        editForm.get = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\TipoOperacionCajaController::edit
 * @see app/Http/Controllers/TipoOperacionCajaController.php:203
 * @route '/tipo-operacion-caja/{tipo_operacion_caja}/edit'
 */
        editForm.head = (args: { tipo_operacion_caja: string | number } | [tipo_operacion_caja: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
const TipoOperacionCajaController = { index, store, show, update, destroy, create, edit }

export default TipoOperacionCajaController