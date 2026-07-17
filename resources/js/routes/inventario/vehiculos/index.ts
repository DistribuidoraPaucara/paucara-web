import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\VehiculoController::index
 * @see app/Http/Controllers/VehiculoController.php:16
 * @route '/inventario/vehiculos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario/vehiculos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VehiculoController::index
 * @see app/Http/Controllers/VehiculoController.php:16
 * @route '/inventario/vehiculos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::index
 * @see app/Http/Controllers/VehiculoController.php:16
 * @route '/inventario/vehiculos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VehiculoController::index
 * @see app/Http/Controllers/VehiculoController.php:16
 * @route '/inventario/vehiculos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VehiculoController::create
 * @see app/Http/Controllers/VehiculoController.php:51
 * @route '/inventario/vehiculos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/inventario/vehiculos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VehiculoController::create
 * @see app/Http/Controllers/VehiculoController.php:51
 * @route '/inventario/vehiculos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::create
 * @see app/Http/Controllers/VehiculoController.php:51
 * @route '/inventario/vehiculos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VehiculoController::create
 * @see app/Http/Controllers/VehiculoController.php:51
 * @route '/inventario/vehiculos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VehiculoController::store
 * @see app/Http/Controllers/VehiculoController.php:87
 * @route '/inventario/vehiculos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventario/vehiculos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VehiculoController::store
 * @see app/Http/Controllers/VehiculoController.php:87
 * @route '/inventario/vehiculos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::store
 * @see app/Http/Controllers/VehiculoController.php:87
 * @route '/inventario/vehiculos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VehiculoController::edit
 * @see app/Http/Controllers/VehiculoController.php:97
 * @route '/inventario/vehiculos/{vehiculo}/edit'
 */
export const edit = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/inventario/vehiculos/{vehiculo}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VehiculoController::edit
 * @see app/Http/Controllers/VehiculoController.php:97
 * @route '/inventario/vehiculos/{vehiculo}/edit'
 */
edit.url = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehiculo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehiculo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehiculo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehiculo: typeof args.vehiculo === 'object'
                ? args.vehiculo.id
                : args.vehiculo,
                }

    return edit.definition.url
            .replace('{vehiculo}', parsedArgs.vehiculo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::edit
 * @see app/Http/Controllers/VehiculoController.php:97
 * @route '/inventario/vehiculos/{vehiculo}/edit'
 */
edit.get = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VehiculoController::edit
 * @see app/Http/Controllers/VehiculoController.php:97
 * @route '/inventario/vehiculos/{vehiculo}/edit'
 */
edit.head = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VehiculoController::update
 * @see app/Http/Controllers/VehiculoController.php:133
 * @route '/inventario/vehiculos/{vehiculo}'
 */
export const update = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/inventario/vehiculos/{vehiculo}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\VehiculoController::update
 * @see app/Http/Controllers/VehiculoController.php:133
 * @route '/inventario/vehiculos/{vehiculo}'
 */
update.url = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehiculo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehiculo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehiculo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehiculo: typeof args.vehiculo === 'object'
                ? args.vehiculo.id
                : args.vehiculo,
                }

    return update.definition.url
            .replace('{vehiculo}', parsedArgs.vehiculo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::update
 * @see app/Http/Controllers/VehiculoController.php:133
 * @route '/inventario/vehiculos/{vehiculo}'
 */
update.put = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\VehiculoController::destroy
 * @see app/Http/Controllers/VehiculoController.php:140
 * @route '/inventario/vehiculos/{vehiculo}'
 */
export const destroy = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/inventario/vehiculos/{vehiculo}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VehiculoController::destroy
 * @see app/Http/Controllers/VehiculoController.php:140
 * @route '/inventario/vehiculos/{vehiculo}'
 */
destroy.url = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { vehiculo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { vehiculo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    vehiculo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        vehiculo: typeof args.vehiculo === 'object'
                ? args.vehiculo.id
                : args.vehiculo,
                }

    return destroy.definition.url
            .replace('{vehiculo}', parsedArgs.vehiculo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VehiculoController::destroy
 * @see app/Http/Controllers/VehiculoController.php:140
 * @route '/inventario/vehiculos/{vehiculo}'
 */
destroy.delete = (args: { vehiculo: number | { id: number } } | [vehiculo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const vehiculos = {
    index,
create,
store,
edit,
update,
destroy,
}

export default vehiculos