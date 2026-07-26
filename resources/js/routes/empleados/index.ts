import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
import data from './data'
/**
* @see \App\Http\Controllers\EmpleadoController::index
 * @see app/Http/Controllers/EmpleadoController.php:35
 * @route '/empleados'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/empleados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::index
 * @see app/Http/Controllers/EmpleadoController.php:35
 * @route '/empleados'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::index
 * @see app/Http/Controllers/EmpleadoController.php:35
 * @route '/empleados'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::index
 * @see app/Http/Controllers/EmpleadoController.php:35
 * @route '/empleados'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmpleadoController::create
 * @see app/Http/Controllers/EmpleadoController.php:103
 * @route '/empleados/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/empleados/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::create
 * @see app/Http/Controllers/EmpleadoController.php:103
 * @route '/empleados/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::create
 * @see app/Http/Controllers/EmpleadoController.php:103
 * @route '/empleados/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::create
 * @see app/Http/Controllers/EmpleadoController.php:103
 * @route '/empleados/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmpleadoController::store
 * @see app/Http/Controllers/EmpleadoController.php:149
 * @route '/empleados'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/empleados',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmpleadoController::store
 * @see app/Http/Controllers/EmpleadoController.php:149
 * @route '/empleados'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::store
 * @see app/Http/Controllers/EmpleadoController.php:149
 * @route '/empleados'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\EmpleadoController::show
 * @see app/Http/Controllers/EmpleadoController.php:283
 * @route '/empleados/{empleado}'
 */
export const show = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/empleados/{empleado}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::show
 * @see app/Http/Controllers/EmpleadoController.php:283
 * @route '/empleados/{empleado}'
 */
show.url = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empleado: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empleado: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empleado: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empleado: typeof args.empleado === 'object'
                ? args.empleado.id
                : args.empleado,
                }

    return show.definition.url
            .replace('{empleado}', parsedArgs.empleado.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::show
 * @see app/Http/Controllers/EmpleadoController.php:283
 * @route '/empleados/{empleado}'
 */
show.get = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::show
 * @see app/Http/Controllers/EmpleadoController.php:283
 * @route '/empleados/{empleado}'
 */
show.head = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmpleadoController::edit
 * @see app/Http/Controllers/EmpleadoController.php:295
 * @route '/empleados/{empleado}/edit'
 */
export const edit = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/empleados/{empleado}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::edit
 * @see app/Http/Controllers/EmpleadoController.php:295
 * @route '/empleados/{empleado}/edit'
 */
edit.url = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empleado: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empleado: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empleado: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empleado: typeof args.empleado === 'object'
                ? args.empleado.id
                : args.empleado,
                }

    return edit.definition.url
            .replace('{empleado}', parsedArgs.empleado.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::edit
 * @see app/Http/Controllers/EmpleadoController.php:295
 * @route '/empleados/{empleado}/edit'
 */
edit.get = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::edit
 * @see app/Http/Controllers/EmpleadoController.php:295
 * @route '/empleados/{empleado}/edit'
 */
edit.head = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EmpleadoController::update
 * @see app/Http/Controllers/EmpleadoController.php:345
 * @route '/empleados/{empleado}'
 */
export const update = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/empleados/{empleado}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\EmpleadoController::update
 * @see app/Http/Controllers/EmpleadoController.php:345
 * @route '/empleados/{empleado}'
 */
update.url = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empleado: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empleado: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empleado: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empleado: typeof args.empleado === 'object'
                ? args.empleado.id
                : args.empleado,
                }

    return update.definition.url
            .replace('{empleado}', parsedArgs.empleado.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::update
 * @see app/Http/Controllers/EmpleadoController.php:345
 * @route '/empleados/{empleado}'
 */
update.put = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\EmpleadoController::update
 * @see app/Http/Controllers/EmpleadoController.php:345
 * @route '/empleados/{empleado}'
 */
update.patch = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\EmpleadoController::destroy
 * @see app/Http/Controllers/EmpleadoController.php:525
 * @route '/empleados/{empleado}'
 */
export const destroy = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/empleados/{empleado}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\EmpleadoController::destroy
 * @see app/Http/Controllers/EmpleadoController.php:525
 * @route '/empleados/{empleado}'
 */
destroy.url = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empleado: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empleado: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empleado: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empleado: typeof args.empleado === 'object'
                ? args.empleado.id
                : args.empleado,
                }

    return destroy.definition.url
            .replace('{empleado}', parsedArgs.empleado.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::destroy
 * @see app/Http/Controllers/EmpleadoController.php:525
 * @route '/empleados/{empleado}'
 */
destroy.delete = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\EmpleadoController::toggleEstado
 * @see app/Http/Controllers/EmpleadoController.php:636
 * @route '/empleados/{empleado}/toggle-estado'
 */
export const toggleEstado = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleEstado.url(args, options),
    method: 'patch',
})

toggleEstado.definition = {
    methods: ["patch"],
    url: '/empleados/{empleado}/toggle-estado',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\EmpleadoController::toggleEstado
 * @see app/Http/Controllers/EmpleadoController.php:636
 * @route '/empleados/{empleado}/toggle-estado'
 */
toggleEstado.url = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empleado: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empleado: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empleado: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empleado: typeof args.empleado === 'object'
                ? args.empleado.id
                : args.empleado,
                }

    return toggleEstado.definition.url
            .replace('{empleado}', parsedArgs.empleado.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::toggleEstado
 * @see app/Http/Controllers/EmpleadoController.php:636
 * @route '/empleados/{empleado}/toggle-estado'
 */
toggleEstado.patch = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleEstado.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\EmpleadoController::toggleAccesoSistema
 * @see app/Http/Controllers/EmpleadoController.php:650
 * @route '/empleados/{empleado}/toggle-acceso-sistema'
 */
export const toggleAccesoSistema = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAccesoSistema.url(args, options),
    method: 'patch',
})

toggleAccesoSistema.definition = {
    methods: ["patch"],
    url: '/empleados/{empleado}/toggle-acceso-sistema',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\EmpleadoController::toggleAccesoSistema
 * @see app/Http/Controllers/EmpleadoController.php:650
 * @route '/empleados/{empleado}/toggle-acceso-sistema'
 */
toggleAccesoSistema.url = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { empleado: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { empleado: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    empleado: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        empleado: typeof args.empleado === 'object'
                ? args.empleado.id
                : args.empleado,
                }

    return toggleAccesoSistema.definition.url
            .replace('{empleado}', parsedArgs.empleado.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::toggleAccesoSistema
 * @see app/Http/Controllers/EmpleadoController.php:650
 * @route '/empleados/{empleado}/toggle-acceso-sistema'
 */
toggleAccesoSistema.patch = (args: { empleado: number | { id: number } } | [empleado: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleAccesoSistema.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\EmpleadoController::crearRapido
 * @see app/Http/Controllers/EmpleadoController.php:625
 * @route '/empleados/crear-rapido'
 */
export const crearRapido = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearRapido.url(options),
    method: 'post',
})

crearRapido.definition = {
    methods: ["post"],
    url: '/empleados/crear-rapido',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmpleadoController::crearRapido
 * @see app/Http/Controllers/EmpleadoController.php:625
 * @route '/empleados/crear-rapido'
 */
crearRapido.url = (options?: RouteQueryOptions) => {
    return crearRapido.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::crearRapido
 * @see app/Http/Controllers/EmpleadoController.php:625
 * @route '/empleados/crear-rapido'
 */
crearRapido.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearRapido.url(options),
    method: 'post',
})
const empleados = {
    index,
create,
store,
show,
edit,
update,
destroy,
toggleEstado,
toggleAccesoSistema,
crearRapido,
data,
}

export default empleados