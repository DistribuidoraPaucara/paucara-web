import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PermissionController::getStructure
 * @see app/Http/Controllers/PermissionController.php:196
 * @route '/api/permisos/estructura'
 */
export const getStructure = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStructure.url(options),
    method: 'get',
})

getStructure.definition = {
    methods: ["get","head"],
    url: '/api/permisos/estructura',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::getStructure
 * @see app/Http/Controllers/PermissionController.php:196
 * @route '/api/permisos/estructura'
 */
getStructure.url = (options?: RouteQueryOptions) => {
    return getStructure.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::getStructure
 * @see app/Http/Controllers/PermissionController.php:196
 * @route '/api/permisos/estructura'
 */
getStructure.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getStructure.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::getStructure
 * @see app/Http/Controllers/PermissionController.php:196
 * @route '/api/permisos/estructura'
 */
getStructure.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getStructure.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PermissionController::getGrouped
 * @see app/Http/Controllers/PermissionController.php:210
 * @route '/api/permisos/agrupados'
 */
export const getGrouped = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getGrouped.url(options),
    method: 'get',
})

getGrouped.definition = {
    methods: ["get","head"],
    url: '/api/permisos/agrupados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::getGrouped
 * @see app/Http/Controllers/PermissionController.php:210
 * @route '/api/permisos/agrupados'
 */
getGrouped.url = (options?: RouteQueryOptions) => {
    return getGrouped.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::getGrouped
 * @see app/Http/Controllers/PermissionController.php:210
 * @route '/api/permisos/agrupados'
 */
getGrouped.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getGrouped.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::getGrouped
 * @see app/Http/Controllers/PermissionController.php:210
 * @route '/api/permisos/agrupados'
 */
getGrouped.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getGrouped.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PermissionController::editarUsuario
 * @see app/Http/Controllers/PermissionController.php:70
 * @route '/api/permisos/usuario/{user}'
 */
const editarUsuario9cf08b543857fc9bd418de868ac248cb = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editarUsuario9cf08b543857fc9bd418de868ac248cb.url(args, options),
    method: 'get',
})

editarUsuario9cf08b543857fc9bd418de868ac248cb.definition = {
    methods: ["get","head"],
    url: '/api/permisos/usuario/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::editarUsuario
 * @see app/Http/Controllers/PermissionController.php:70
 * @route '/api/permisos/usuario/{user}'
 */
editarUsuario9cf08b543857fc9bd418de868ac248cb.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return editarUsuario9cf08b543857fc9bd418de868ac248cb.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::editarUsuario
 * @see app/Http/Controllers/PermissionController.php:70
 * @route '/api/permisos/usuario/{user}'
 */
editarUsuario9cf08b543857fc9bd418de868ac248cb.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editarUsuario9cf08b543857fc9bd418de868ac248cb.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::editarUsuario
 * @see app/Http/Controllers/PermissionController.php:70
 * @route '/api/permisos/usuario/{user}'
 */
editarUsuario9cf08b543857fc9bd418de868ac248cb.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editarUsuario9cf08b543857fc9bd418de868ac248cb.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PermissionController::editarUsuario
 * @see app/Http/Controllers/PermissionController.php:70
 * @route '/permisos/usuario/{user}/editar'
 */
const editarUsuario2bee7011d8e7df97ab7a25035a15ff84 = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editarUsuario2bee7011d8e7df97ab7a25035a15ff84.url(args, options),
    method: 'get',
})

editarUsuario2bee7011d8e7df97ab7a25035a15ff84.definition = {
    methods: ["get","head"],
    url: '/permisos/usuario/{user}/editar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::editarUsuario
 * @see app/Http/Controllers/PermissionController.php:70
 * @route '/permisos/usuario/{user}/editar'
 */
editarUsuario2bee7011d8e7df97ab7a25035a15ff84.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return editarUsuario2bee7011d8e7df97ab7a25035a15ff84.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::editarUsuario
 * @see app/Http/Controllers/PermissionController.php:70
 * @route '/permisos/usuario/{user}/editar'
 */
editarUsuario2bee7011d8e7df97ab7a25035a15ff84.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editarUsuario2bee7011d8e7df97ab7a25035a15ff84.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::editarUsuario
 * @see app/Http/Controllers/PermissionController.php:70
 * @route '/permisos/usuario/{user}/editar'
 */
editarUsuario2bee7011d8e7df97ab7a25035a15ff84.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editarUsuario2bee7011d8e7df97ab7a25035a15ff84.url(args, options),
    method: 'head',
})

export const editarUsuario = {
    '/api/permisos/usuario/{user}': editarUsuario9cf08b543857fc9bd418de868ac248cb,
    '/permisos/usuario/{user}/editar': editarUsuario2bee7011d8e7df97ab7a25035a15ff84,
}

/**
* @see \App\Http\Controllers\PermissionController::actualizarUsuario
 * @see app/Http/Controllers/PermissionController.php:121
 * @route '/api/permisos/usuario/{user}'
 */
const actualizarUsuario9cf08b543857fc9bd418de868ac248cb = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarUsuario9cf08b543857fc9bd418de868ac248cb.url(args, options),
    method: 'patch',
})

actualizarUsuario9cf08b543857fc9bd418de868ac248cb.definition = {
    methods: ["patch"],
    url: '/api/permisos/usuario/{user}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PermissionController::actualizarUsuario
 * @see app/Http/Controllers/PermissionController.php:121
 * @route '/api/permisos/usuario/{user}'
 */
actualizarUsuario9cf08b543857fc9bd418de868ac248cb.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return actualizarUsuario9cf08b543857fc9bd418de868ac248cb.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::actualizarUsuario
 * @see app/Http/Controllers/PermissionController.php:121
 * @route '/api/permisos/usuario/{user}'
 */
actualizarUsuario9cf08b543857fc9bd418de868ac248cb.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarUsuario9cf08b543857fc9bd418de868ac248cb.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PermissionController::actualizarUsuario
 * @see app/Http/Controllers/PermissionController.php:121
 * @route '/permisos/usuario/{user}'
 */
const actualizarUsuariod5c3dd1f492157f16f47b6f0a163cb62 = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarUsuariod5c3dd1f492157f16f47b6f0a163cb62.url(args, options),
    method: 'patch',
})

actualizarUsuariod5c3dd1f492157f16f47b6f0a163cb62.definition = {
    methods: ["patch"],
    url: '/permisos/usuario/{user}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PermissionController::actualizarUsuario
 * @see app/Http/Controllers/PermissionController.php:121
 * @route '/permisos/usuario/{user}'
 */
actualizarUsuariod5c3dd1f492157f16f47b6f0a163cb62.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return actualizarUsuariod5c3dd1f492157f16f47b6f0a163cb62.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::actualizarUsuario
 * @see app/Http/Controllers/PermissionController.php:121
 * @route '/permisos/usuario/{user}'
 */
actualizarUsuariod5c3dd1f492157f16f47b6f0a163cb62.patch = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarUsuariod5c3dd1f492157f16f47b6f0a163cb62.url(args, options),
    method: 'patch',
})

export const actualizarUsuario = {
    '/api/permisos/usuario/{user}': actualizarUsuario9cf08b543857fc9bd418de868ac248cb,
    '/permisos/usuario/{user}': actualizarUsuariod5c3dd1f492157f16f47b6f0a163cb62,
}

/**
* @see \App\Http\Controllers\PermissionController::editarRol
 * @see app/Http/Controllers/PermissionController.php:159
 * @route '/api/permisos/rol/{role}'
 */
const editarRol0513cf81727e06dde4c0694f8d2c26e4 = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editarRol0513cf81727e06dde4c0694f8d2c26e4.url(args, options),
    method: 'get',
})

editarRol0513cf81727e06dde4c0694f8d2c26e4.definition = {
    methods: ["get","head"],
    url: '/api/permisos/rol/{role}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::editarRol
 * @see app/Http/Controllers/PermissionController.php:159
 * @route '/api/permisos/rol/{role}'
 */
editarRol0513cf81727e06dde4c0694f8d2c26e4.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return editarRol0513cf81727e06dde4c0694f8d2c26e4.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::editarRol
 * @see app/Http/Controllers/PermissionController.php:159
 * @route '/api/permisos/rol/{role}'
 */
editarRol0513cf81727e06dde4c0694f8d2c26e4.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editarRol0513cf81727e06dde4c0694f8d2c26e4.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::editarRol
 * @see app/Http/Controllers/PermissionController.php:159
 * @route '/api/permisos/rol/{role}'
 */
editarRol0513cf81727e06dde4c0694f8d2c26e4.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editarRol0513cf81727e06dde4c0694f8d2c26e4.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PermissionController::editarRol
 * @see app/Http/Controllers/PermissionController.php:159
 * @route '/permisos/rol/{role}/editar'
 */
const editarRol0b034d6e7dbfd63c90a1e18bb2dd4086 = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editarRol0b034d6e7dbfd63c90a1e18bb2dd4086.url(args, options),
    method: 'get',
})

editarRol0b034d6e7dbfd63c90a1e18bb2dd4086.definition = {
    methods: ["get","head"],
    url: '/permisos/rol/{role}/editar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::editarRol
 * @see app/Http/Controllers/PermissionController.php:159
 * @route '/permisos/rol/{role}/editar'
 */
editarRol0b034d6e7dbfd63c90a1e18bb2dd4086.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return editarRol0b034d6e7dbfd63c90a1e18bb2dd4086.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::editarRol
 * @see app/Http/Controllers/PermissionController.php:159
 * @route '/permisos/rol/{role}/editar'
 */
editarRol0b034d6e7dbfd63c90a1e18bb2dd4086.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editarRol0b034d6e7dbfd63c90a1e18bb2dd4086.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::editarRol
 * @see app/Http/Controllers/PermissionController.php:159
 * @route '/permisos/rol/{role}/editar'
 */
editarRol0b034d6e7dbfd63c90a1e18bb2dd4086.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editarRol0b034d6e7dbfd63c90a1e18bb2dd4086.url(args, options),
    method: 'head',
})

export const editarRol = {
    '/api/permisos/rol/{role}': editarRol0513cf81727e06dde4c0694f8d2c26e4,
    '/permisos/rol/{role}/editar': editarRol0b034d6e7dbfd63c90a1e18bb2dd4086,
}

/**
* @see \App\Http\Controllers\PermissionController::actualizarRol
 * @see app/Http/Controllers/PermissionController.php:175
 * @route '/api/permisos/rol/{role}'
 */
const actualizarRol0513cf81727e06dde4c0694f8d2c26e4 = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarRol0513cf81727e06dde4c0694f8d2c26e4.url(args, options),
    method: 'patch',
})

actualizarRol0513cf81727e06dde4c0694f8d2c26e4.definition = {
    methods: ["patch"],
    url: '/api/permisos/rol/{role}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PermissionController::actualizarRol
 * @see app/Http/Controllers/PermissionController.php:175
 * @route '/api/permisos/rol/{role}'
 */
actualizarRol0513cf81727e06dde4c0694f8d2c26e4.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return actualizarRol0513cf81727e06dde4c0694f8d2c26e4.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::actualizarRol
 * @see app/Http/Controllers/PermissionController.php:175
 * @route '/api/permisos/rol/{role}'
 */
actualizarRol0513cf81727e06dde4c0694f8d2c26e4.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarRol0513cf81727e06dde4c0694f8d2c26e4.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\PermissionController::actualizarRol
 * @see app/Http/Controllers/PermissionController.php:175
 * @route '/permisos/rol/{role}'
 */
const actualizarRola5f96a26c816b3f35c56c27b29edf11f = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarRola5f96a26c816b3f35c56c27b29edf11f.url(args, options),
    method: 'patch',
})

actualizarRola5f96a26c816b3f35c56c27b29edf11f.definition = {
    methods: ["patch"],
    url: '/permisos/rol/{role}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PermissionController::actualizarRol
 * @see app/Http/Controllers/PermissionController.php:175
 * @route '/permisos/rol/{role}'
 */
actualizarRola5f96a26c816b3f35c56c27b29edf11f.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return actualizarRola5f96a26c816b3f35c56c27b29edf11f.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::actualizarRol
 * @see app/Http/Controllers/PermissionController.php:175
 * @route '/permisos/rol/{role}'
 */
actualizarRola5f96a26c816b3f35c56c27b29edf11f.patch = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarRola5f96a26c816b3f35c56c27b29edf11f.url(args, options),
    method: 'patch',
})

export const actualizarRol = {
    '/api/permisos/rol/{role}': actualizarRol0513cf81727e06dde4c0694f8d2c26e4,
    '/permisos/rol/{role}': actualizarRola5f96a26c816b3f35c56c27b29edf11f,
}

/**
* @see \App\Http\Controllers\PermissionController::getUsuarios
 * @see app/Http/Controllers/PermissionController.php:224
 * @route '/api/usuarios'
 */
export const getUsuarios = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUsuarios.url(options),
    method: 'get',
})

getUsuarios.definition = {
    methods: ["get","head"],
    url: '/api/usuarios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::getUsuarios
 * @see app/Http/Controllers/PermissionController.php:224
 * @route '/api/usuarios'
 */
getUsuarios.url = (options?: RouteQueryOptions) => {
    return getUsuarios.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::getUsuarios
 * @see app/Http/Controllers/PermissionController.php:224
 * @route '/api/usuarios'
 */
getUsuarios.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUsuarios.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::getUsuarios
 * @see app/Http/Controllers/PermissionController.php:224
 * @route '/api/usuarios'
 */
getUsuarios.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getUsuarios.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PermissionController::getRoles
 * @see app/Http/Controllers/PermissionController.php:266
 * @route '/api/roles'
 */
export const getRoles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRoles.url(options),
    method: 'get',
})

getRoles.definition = {
    methods: ["get","head"],
    url: '/api/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::getRoles
 * @see app/Http/Controllers/PermissionController.php:266
 * @route '/api/roles'
 */
getRoles.url = (options?: RouteQueryOptions) => {
    return getRoles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::getRoles
 * @see app/Http/Controllers/PermissionController.php:266
 * @route '/api/roles'
 */
getRoles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRoles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::getRoles
 * @see app/Http/Controllers/PermissionController.php:266
 * @route '/api/roles'
 */
getRoles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRoles.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PermissionController::getHistorial
 * @see app/Http/Controllers/PermissionController.php:306
 * @route '/api/permisos/historial'
 */
export const getHistorial = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHistorial.url(options),
    method: 'get',
})

getHistorial.definition = {
    methods: ["get","head"],
    url: '/api/permisos/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::getHistorial
 * @see app/Http/Controllers/PermissionController.php:306
 * @route '/api/permisos/historial'
 */
getHistorial.url = (options?: RouteQueryOptions) => {
    return getHistorial.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::getHistorial
 * @see app/Http/Controllers/PermissionController.php:306
 * @route '/api/permisos/historial'
 */
getHistorial.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getHistorial.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::getHistorial
 * @see app/Http/Controllers/PermissionController.php:306
 * @route '/api/permisos/historial'
 */
getHistorial.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getHistorial.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PermissionController::bulkEdit
 * @see app/Http/Controllers/PermissionController.php:362
 * @route '/api/permisos/bulk-edit'
 */
export const bulkEdit = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkEdit.url(options),
    method: 'post',
})

bulkEdit.definition = {
    methods: ["post"],
    url: '/api/permisos/bulk-edit',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PermissionController::bulkEdit
 * @see app/Http/Controllers/PermissionController.php:362
 * @route '/api/permisos/bulk-edit'
 */
bulkEdit.url = (options?: RouteQueryOptions) => {
    return bulkEdit.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::bulkEdit
 * @see app/Http/Controllers/PermissionController.php:362
 * @route '/api/permisos/bulk-edit'
 */
bulkEdit.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkEdit.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PermissionController::getCapabilities
 * @see app/Http/Controllers/PermissionController.php:430
 * @route '/api/capacidades'
 */
export const getCapabilities = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCapabilities.url(options),
    method: 'get',
})

getCapabilities.definition = {
    methods: ["get","head"],
    url: '/api/capacidades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::getCapabilities
 * @see app/Http/Controllers/PermissionController.php:430
 * @route '/api/capacidades'
 */
getCapabilities.url = (options?: RouteQueryOptions) => {
    return getCapabilities.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::getCapabilities
 * @see app/Http/Controllers/PermissionController.php:430
 * @route '/api/capacidades'
 */
getCapabilities.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCapabilities.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::getCapabilities
 * @see app/Http/Controllers/PermissionController.php:430
 * @route '/api/capacidades'
 */
getCapabilities.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCapabilities.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PermissionController::getCapabilityTemplates
 * @see app/Http/Controllers/PermissionController.php:593
 * @route '/api/capacidades/plantillas'
 */
export const getCapabilityTemplates = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCapabilityTemplates.url(options),
    method: 'get',
})

getCapabilityTemplates.definition = {
    methods: ["get","head"],
    url: '/api/capacidades/plantillas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::getCapabilityTemplates
 * @see app/Http/Controllers/PermissionController.php:593
 * @route '/api/capacidades/plantillas'
 */
getCapabilityTemplates.url = (options?: RouteQueryOptions) => {
    return getCapabilityTemplates.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::getCapabilityTemplates
 * @see app/Http/Controllers/PermissionController.php:593
 * @route '/api/capacidades/plantillas'
 */
getCapabilityTemplates.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getCapabilityTemplates.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::getCapabilityTemplates
 * @see app/Http/Controllers/PermissionController.php:593
 * @route '/api/capacidades/plantillas'
 */
getCapabilityTemplates.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getCapabilityTemplates.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PermissionController::getUserCapabilities
 * @see app/Http/Controllers/PermissionController.php:446
 * @route '/api/capacidades/usuario/{user}'
 */
export const getUserCapabilities = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUserCapabilities.url(args, options),
    method: 'get',
})

getUserCapabilities.definition = {
    methods: ["get","head"],
    url: '/api/capacidades/usuario/{user}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::getUserCapabilities
 * @see app/Http/Controllers/PermissionController.php:446
 * @route '/api/capacidades/usuario/{user}'
 */
getUserCapabilities.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return getUserCapabilities.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::getUserCapabilities
 * @see app/Http/Controllers/PermissionController.php:446
 * @route '/api/capacidades/usuario/{user}'
 */
getUserCapabilities.get = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getUserCapabilities.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::getUserCapabilities
 * @see app/Http/Controllers/PermissionController.php:446
 * @route '/api/capacidades/usuario/{user}'
 */
getUserCapabilities.head = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getUserCapabilities.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PermissionController::assignCapabilityToUser
 * @see app/Http/Controllers/PermissionController.php:485
 * @route '/api/capacidades/usuario/{user}/asignar'
 */
export const assignCapabilityToUser = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignCapabilityToUser.url(args, options),
    method: 'post',
})

assignCapabilityToUser.definition = {
    methods: ["post"],
    url: '/api/capacidades/usuario/{user}/asignar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PermissionController::assignCapabilityToUser
 * @see app/Http/Controllers/PermissionController.php:485
 * @route '/api/capacidades/usuario/{user}/asignar'
 */
assignCapabilityToUser.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return assignCapabilityToUser.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::assignCapabilityToUser
 * @see app/Http/Controllers/PermissionController.php:485
 * @route '/api/capacidades/usuario/{user}/asignar'
 */
assignCapabilityToUser.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignCapabilityToUser.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PermissionController::removeCapabilityFromUser
 * @see app/Http/Controllers/PermissionController.php:539
 * @route '/api/capacidades/usuario/{user}/remover'
 */
export const removeCapabilityFromUser = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeCapabilityFromUser.url(args, options),
    method: 'post',
})

removeCapabilityFromUser.definition = {
    methods: ["post"],
    url: '/api/capacidades/usuario/{user}/remover',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PermissionController::removeCapabilityFromUser
 * @see app/Http/Controllers/PermissionController.php:539
 * @route '/api/capacidades/usuario/{user}/remover'
 */
removeCapabilityFromUser.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return removeCapabilityFromUser.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::removeCapabilityFromUser
 * @see app/Http/Controllers/PermissionController.php:539
 * @route '/api/capacidades/usuario/{user}/remover'
 */
removeCapabilityFromUser.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeCapabilityFromUser.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PermissionController::applyTemplateToUser
 * @see app/Http/Controllers/PermissionController.php:623
 * @route '/api/capacidades/usuario/{user}/aplicar-plantilla'
 */
export const applyTemplateToUser = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyTemplateToUser.url(args, options),
    method: 'post',
})

applyTemplateToUser.definition = {
    methods: ["post"],
    url: '/api/capacidades/usuario/{user}/aplicar-plantilla',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PermissionController::applyTemplateToUser
 * @see app/Http/Controllers/PermissionController.php:623
 * @route '/api/capacidades/usuario/{user}/aplicar-plantilla'
 */
applyTemplateToUser.url = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { user: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    user: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        user: typeof args.user === 'object'
                ? args.user.id
                : args.user,
                }

    return applyTemplateToUser.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::applyTemplateToUser
 * @see app/Http/Controllers/PermissionController.php:623
 * @route '/api/capacidades/usuario/{user}/aplicar-plantilla'
 */
applyTemplateToUser.post = (args: { user: number | { id: number } } | [user: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyTemplateToUser.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PermissionController::getRoleCapabilities
 * @see app/Http/Controllers/PermissionController.php:466
 * @route '/api/capacidades/rol/{role}'
 */
export const getRoleCapabilities = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRoleCapabilities.url(args, options),
    method: 'get',
})

getRoleCapabilities.definition = {
    methods: ["get","head"],
    url: '/api/capacidades/rol/{role}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::getRoleCapabilities
 * @see app/Http/Controllers/PermissionController.php:466
 * @route '/api/capacidades/rol/{role}'
 */
getRoleCapabilities.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return getRoleCapabilities.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::getRoleCapabilities
 * @see app/Http/Controllers/PermissionController.php:466
 * @route '/api/capacidades/rol/{role}'
 */
getRoleCapabilities.get = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRoleCapabilities.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::getRoleCapabilities
 * @see app/Http/Controllers/PermissionController.php:466
 * @route '/api/capacidades/rol/{role}'
 */
getRoleCapabilities.head = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRoleCapabilities.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PermissionController::assignCapabilityToRole
 * @see app/Http/Controllers/PermissionController.php:512
 * @route '/api/capacidades/rol/{role}/asignar'
 */
export const assignCapabilityToRole = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignCapabilityToRole.url(args, options),
    method: 'post',
})

assignCapabilityToRole.definition = {
    methods: ["post"],
    url: '/api/capacidades/rol/{role}/asignar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PermissionController::assignCapabilityToRole
 * @see app/Http/Controllers/PermissionController.php:512
 * @route '/api/capacidades/rol/{role}/asignar'
 */
assignCapabilityToRole.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return assignCapabilityToRole.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::assignCapabilityToRole
 * @see app/Http/Controllers/PermissionController.php:512
 * @route '/api/capacidades/rol/{role}/asignar'
 */
assignCapabilityToRole.post = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: assignCapabilityToRole.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PermissionController::removeCapabilityFromRole
 * @see app/Http/Controllers/PermissionController.php:566
 * @route '/api/capacidades/rol/{role}/remover'
 */
export const removeCapabilityFromRole = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeCapabilityFromRole.url(args, options),
    method: 'post',
})

removeCapabilityFromRole.definition = {
    methods: ["post"],
    url: '/api/capacidades/rol/{role}/remover',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PermissionController::removeCapabilityFromRole
 * @see app/Http/Controllers/PermissionController.php:566
 * @route '/api/capacidades/rol/{role}/remover'
 */
removeCapabilityFromRole.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return removeCapabilityFromRole.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::removeCapabilityFromRole
 * @see app/Http/Controllers/PermissionController.php:566
 * @route '/api/capacidades/rol/{role}/remover'
 */
removeCapabilityFromRole.post = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: removeCapabilityFromRole.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PermissionController::applyTemplateToRole
 * @see app/Http/Controllers/PermissionController.php:660
 * @route '/api/capacidades/rol/{role}/aplicar-plantilla'
 */
export const applyTemplateToRole = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyTemplateToRole.url(args, options),
    method: 'post',
})

applyTemplateToRole.definition = {
    methods: ["post"],
    url: '/api/capacidades/rol/{role}/aplicar-plantilla',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PermissionController::applyTemplateToRole
 * @see app/Http/Controllers/PermissionController.php:660
 * @route '/api/capacidades/rol/{role}/aplicar-plantilla'
 */
applyTemplateToRole.url = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { role: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { role: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    role: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        role: typeof args.role === 'object'
                ? args.role.id
                : args.role,
                }

    return applyTemplateToRole.definition.url
            .replace('{role}', parsedArgs.role.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::applyTemplateToRole
 * @see app/Http/Controllers/PermissionController.php:660
 * @route '/api/capacidades/rol/{role}/aplicar-plantilla'
 */
applyTemplateToRole.post = (args: { role: number | { id: number } } | [role: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: applyTemplateToRole.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PermissionController::index
 * @see app/Http/Controllers/PermissionController.php:28
 * @route '/permisos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/permisos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::index
 * @see app/Http/Controllers/PermissionController.php:28
 * @route '/permisos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::index
 * @see app/Http/Controllers/PermissionController.php:28
 * @route '/permisos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::index
 * @see app/Http/Controllers/PermissionController.php:28
 * @route '/permisos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PermissionController::create
 * @see app/Http/Controllers/PermissionController.php:697
 * @route '/permisos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/permisos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::create
 * @see app/Http/Controllers/PermissionController.php:697
 * @route '/permisos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::create
 * @see app/Http/Controllers/PermissionController.php:697
 * @route '/permisos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::create
 * @see app/Http/Controllers/PermissionController.php:697
 * @route '/permisos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PermissionController::store
 * @see app/Http/Controllers/PermissionController.php:716
 * @route '/permisos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/permisos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PermissionController::store
 * @see app/Http/Controllers/PermissionController.php:716
 * @route '/permisos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::store
 * @see app/Http/Controllers/PermissionController.php:716
 * @route '/permisos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PermissionController::edit
 * @see app/Http/Controllers/PermissionController.php:739
 * @route '/permisos/{permission}/edit'
 */
export const edit = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/permisos/{permission}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PermissionController::edit
 * @see app/Http/Controllers/PermissionController.php:739
 * @route '/permisos/{permission}/edit'
 */
edit.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { permission: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    permission: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        permission: typeof args.permission === 'object'
                ? args.permission.id
                : args.permission,
                }

    return edit.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::edit
 * @see app/Http/Controllers/PermissionController.php:739
 * @route '/permisos/{permission}/edit'
 */
edit.get = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PermissionController::edit
 * @see app/Http/Controllers/PermissionController.php:739
 * @route '/permisos/{permission}/edit'
 */
edit.head = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PermissionController::update
 * @see app/Http/Controllers/PermissionController.php:751
 * @route '/permisos/{permission}'
 */
export const update = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/permisos/{permission}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PermissionController::update
 * @see app/Http/Controllers/PermissionController.php:751
 * @route '/permisos/{permission}'
 */
update.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { permission: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    permission: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        permission: typeof args.permission === 'object'
                ? args.permission.id
                : args.permission,
                }

    return update.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::update
 * @see app/Http/Controllers/PermissionController.php:751
 * @route '/permisos/{permission}'
 */
update.put = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\PermissionController::destroy
 * @see app/Http/Controllers/PermissionController.php:768
 * @route '/permisos/{permission}'
 */
export const destroy = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/permisos/{permission}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\PermissionController::destroy
 * @see app/Http/Controllers/PermissionController.php:768
 * @route '/permisos/{permission}'
 */
destroy.url = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { permission: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { permission: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    permission: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        permission: typeof args.permission === 'object'
                ? args.permission.id
                : args.permission,
                }

    return destroy.definition.url
            .replace('{permission}', parsedArgs.permission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PermissionController::destroy
 * @see app/Http/Controllers/PermissionController.php:768
 * @route '/permisos/{permission}'
 */
destroy.delete = (args: { permission: number | { id: number } } | [permission: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const PermissionController = { getStructure, getGrouped, editarUsuario, actualizarUsuario, editarRol, actualizarRol, getUsuarios, getRoles, getHistorial, bulkEdit, getCapabilities, getCapabilityTemplates, getUserCapabilities, assignCapabilityToUser, removeCapabilityFromUser, applyTemplateToUser, getRoleCapabilities, assignCapabilityToRole, removeCapabilityFromRole, applyTemplateToRole, index, create, store, edit, update, destroy }

export default PermissionController