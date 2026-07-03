import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LocalidadController::indexApi
 * @see app/Http/Controllers/LocalidadController.php:15
 * @route '/api/localidades'
 */
export const indexApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi.url(options),
    method: 'get',
})

indexApi.definition = {
    methods: ["get","head"],
    url: '/api/localidades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::indexApi
 * @see app/Http/Controllers/LocalidadController.php:15
 * @route '/api/localidades'
 */
indexApi.url = (options?: RouteQueryOptions) => {
    return indexApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::indexApi
 * @see app/Http/Controllers/LocalidadController.php:15
 * @route '/api/localidades'
 */
indexApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::indexApi
 * @see app/Http/Controllers/LocalidadController.php:15
 * @route '/api/localidades'
 */
indexApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexApi.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LocalidadController::storeApi
 * @see app/Http/Controllers/LocalidadController.php:50
 * @route '/api/localidades'
 */
export const storeApi = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApi.url(options),
    method: 'post',
})

storeApi.definition = {
    methods: ["post"],
    url: '/api/localidades',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LocalidadController::storeApi
 * @see app/Http/Controllers/LocalidadController.php:50
 * @route '/api/localidades'
 */
storeApi.url = (options?: RouteQueryOptions) => {
    return storeApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::storeApi
 * @see app/Http/Controllers/LocalidadController.php:50
 * @route '/api/localidades'
 */
storeApi.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeApi.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LocalidadController::showApi
 * @see app/Http/Controllers/LocalidadController.php:42
 * @route '/api/localidades/{localidad}'
 */
export const showApi = (args: { localidad: number | { id: number } } | [localidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})

showApi.definition = {
    methods: ["get","head"],
    url: '/api/localidades/{localidad}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::showApi
 * @see app/Http/Controllers/LocalidadController.php:42
 * @route '/api/localidades/{localidad}'
 */
showApi.url = (args: { localidad: number | { id: number } } | [localidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidad: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { localidad: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    localidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidad: typeof args.localidad === 'object'
                ? args.localidad.id
                : args.localidad,
                }

    return showApi.definition.url
            .replace('{localidad}', parsedArgs.localidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::showApi
 * @see app/Http/Controllers/LocalidadController.php:42
 * @route '/api/localidades/{localidad}'
 */
showApi.get = (args: { localidad: number | { id: number } } | [localidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showApi.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::showApi
 * @see app/Http/Controllers/LocalidadController.php:42
 * @route '/api/localidades/{localidad}'
 */
showApi.head = (args: { localidad: number | { id: number } } | [localidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showApi.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LocalidadController::updateApi
 * @see app/Http/Controllers/LocalidadController.php:76
 * @route '/api/localidades/{localidad}'
 */
export const updateApi = (args: { localidad: number | { id: number } } | [localidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateApi.url(args, options),
    method: 'put',
})

updateApi.definition = {
    methods: ["put"],
    url: '/api/localidades/{localidad}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\LocalidadController::updateApi
 * @see app/Http/Controllers/LocalidadController.php:76
 * @route '/api/localidades/{localidad}'
 */
updateApi.url = (args: { localidad: number | { id: number } } | [localidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidad: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { localidad: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    localidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidad: typeof args.localidad === 'object'
                ? args.localidad.id
                : args.localidad,
                }

    return updateApi.definition.url
            .replace('{localidad}', parsedArgs.localidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::updateApi
 * @see app/Http/Controllers/LocalidadController.php:76
 * @route '/api/localidades/{localidad}'
 */
updateApi.put = (args: { localidad: number | { id: number } } | [localidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updateApi.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\LocalidadController::destroyApi
 * @see app/Http/Controllers/LocalidadController.php:99
 * @route '/api/localidades/{localidad}'
 */
export const destroyApi = (args: { localidad: number | { id: number } } | [localidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyApi.url(args, options),
    method: 'delete',
})

destroyApi.definition = {
    methods: ["delete"],
    url: '/api/localidades/{localidad}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LocalidadController::destroyApi
 * @see app/Http/Controllers/LocalidadController.php:99
 * @route '/api/localidades/{localidad}'
 */
destroyApi.url = (args: { localidad: number | { id: number } } | [localidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidad: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { localidad: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    localidad: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidad: typeof args.localidad === 'object'
                ? args.localidad.id
                : args.localidad,
                }

    return destroyApi.definition.url
            .replace('{localidad}', parsedArgs.localidad.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::destroyApi
 * @see app/Http/Controllers/LocalidadController.php:99
 * @route '/api/localidades/{localidad}'
 */
destroyApi.delete = (args: { localidad: number | { id: number } } | [localidad: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyApi.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\LocalidadController::index
 * @see app/Http/Controllers/LocalidadController.php:118
 * @route '/localidades'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/localidades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::index
 * @see app/Http/Controllers/LocalidadController.php:118
 * @route '/localidades'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::index
 * @see app/Http/Controllers/LocalidadController.php:118
 * @route '/localidades'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::index
 * @see app/Http/Controllers/LocalidadController.php:118
 * @route '/localidades'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LocalidadController::create
 * @see app/Http/Controllers/LocalidadController.php:136
 * @route '/localidades/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/localidades/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::create
 * @see app/Http/Controllers/LocalidadController.php:136
 * @route '/localidades/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::create
 * @see app/Http/Controllers/LocalidadController.php:136
 * @route '/localidades/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::create
 * @see app/Http/Controllers/LocalidadController.php:136
 * @route '/localidades/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LocalidadController::store
 * @see app/Http/Controllers/LocalidadController.php:143
 * @route '/localidades'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/localidades',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LocalidadController::store
 * @see app/Http/Controllers/LocalidadController.php:143
 * @route '/localidades'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::store
 * @see app/Http/Controllers/LocalidadController.php:143
 * @route '/localidades'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\LocalidadController::show
 * @see app/Http/Controllers/LocalidadController.php:157
 * @route '/localidades/{localidade}'
 */
export const show = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/localidades/{localidade}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::show
 * @see app/Http/Controllers/LocalidadController.php:157
 * @route '/localidades/{localidade}'
 */
show.url = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidade: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    localidade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidade: args.localidade,
                }

    return show.definition.url
            .replace('{localidade}', parsedArgs.localidade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::show
 * @see app/Http/Controllers/LocalidadController.php:157
 * @route '/localidades/{localidade}'
 */
show.get = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::show
 * @see app/Http/Controllers/LocalidadController.php:157
 * @route '/localidades/{localidade}'
 */
show.head = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LocalidadController::edit
 * @see app/Http/Controllers/LocalidadController.php:164
 * @route '/localidades/{localidade}/edit'
 */
export const edit = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/localidades/{localidade}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::edit
 * @see app/Http/Controllers/LocalidadController.php:164
 * @route '/localidades/{localidade}/edit'
 */
edit.url = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidade: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    localidade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidade: args.localidade,
                }

    return edit.definition.url
            .replace('{localidade}', parsedArgs.localidade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::edit
 * @see app/Http/Controllers/LocalidadController.php:164
 * @route '/localidades/{localidade}/edit'
 */
edit.get = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::edit
 * @see app/Http/Controllers/LocalidadController.php:164
 * @route '/localidades/{localidade}/edit'
 */
edit.head = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LocalidadController::update
 * @see app/Http/Controllers/LocalidadController.php:171
 * @route '/localidades/{localidade}'
 */
export const update = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/localidades/{localidade}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\LocalidadController::update
 * @see app/Http/Controllers/LocalidadController.php:171
 * @route '/localidades/{localidade}'
 */
update.url = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidade: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    localidade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidade: args.localidade,
                }

    return update.definition.url
            .replace('{localidade}', parsedArgs.localidade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::update
 * @see app/Http/Controllers/LocalidadController.php:171
 * @route '/localidades/{localidade}'
 */
update.put = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\LocalidadController::update
 * @see app/Http/Controllers/LocalidadController.php:171
 * @route '/localidades/{localidade}'
 */
update.patch = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\LocalidadController::destroy
 * @see app/Http/Controllers/LocalidadController.php:184
 * @route '/localidades/{localidade}'
 */
export const destroy = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/localidades/{localidade}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LocalidadController::destroy
 * @see app/Http/Controllers/LocalidadController.php:184
 * @route '/localidades/{localidade}'
 */
destroy.url = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { localidade: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    localidade: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        localidade: args.localidade,
                }

    return destroy.definition.url
            .replace('{localidade}', parsedArgs.localidade.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::destroy
 * @see app/Http/Controllers/LocalidadController.php:184
 * @route '/localidades/{localidade}'
 */
destroy.delete = (args: { localidade: string | number } | [localidade: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\LocalidadController::getActiveLocalidades
 * @see app/Http/Controllers/LocalidadController.php:27
 * @route '/localidades/api/active'
 */
export const getActiveLocalidades = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getActiveLocalidades.url(options),
    method: 'get',
})

getActiveLocalidades.definition = {
    methods: ["get","head"],
    url: '/localidades/api/active',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LocalidadController::getActiveLocalidades
 * @see app/Http/Controllers/LocalidadController.php:27
 * @route '/localidades/api/active'
 */
getActiveLocalidades.url = (options?: RouteQueryOptions) => {
    return getActiveLocalidades.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocalidadController::getActiveLocalidades
 * @see app/Http/Controllers/LocalidadController.php:27
 * @route '/localidades/api/active'
 */
getActiveLocalidades.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getActiveLocalidades.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LocalidadController::getActiveLocalidades
 * @see app/Http/Controllers/LocalidadController.php:27
 * @route '/localidades/api/active'
 */
getActiveLocalidades.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getActiveLocalidades.url(options),
    method: 'head',
})
const LocalidadController = { indexApi, storeApi, showApi, updateApi, destroyApi, index, create, store, show, edit, update, destroy, getActiveLocalidades }

export default LocalidadController