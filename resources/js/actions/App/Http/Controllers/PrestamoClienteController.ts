import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:557
 * @route '/api/prestamos-cliente/{prestamo}/imprimir'
 */
const imprimire1f2d28e5f69b5fc37d7071600aa56ce = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimire1f2d28e5f69b5fc37d7071600aa56ce.url(args, options),
    method: 'get',
})

imprimire1f2d28e5f69b5fc37d7071600aa56ce.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-cliente/{prestamo}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:557
 * @route '/api/prestamos-cliente/{prestamo}/imprimir'
 */
imprimire1f2d28e5f69b5fc37d7071600aa56ce.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return imprimire1f2d28e5f69b5fc37d7071600aa56ce.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:557
 * @route '/api/prestamos-cliente/{prestamo}/imprimir'
 */
imprimire1f2d28e5f69b5fc37d7071600aa56ce.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimire1f2d28e5f69b5fc37d7071600aa56ce.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:557
 * @route '/api/prestamos-cliente/{prestamo}/imprimir'
 */
imprimire1f2d28e5f69b5fc37d7071600aa56ce.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimire1f2d28e5f69b5fc37d7071600aa56ce.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:557
 * @route '/prestamos/clientes/{prestamo}/imprimir'
 */
const imprimirdd1027a4fcd13c0536e736b0ebe3ae59 = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirdd1027a4fcd13c0536e736b0ebe3ae59.url(args, options),
    method: 'get',
})

imprimirdd1027a4fcd13c0536e736b0ebe3ae59.definition = {
    methods: ["get","head"],
    url: '/prestamos/clientes/{prestamo}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:557
 * @route '/prestamos/clientes/{prestamo}/imprimir'
 */
imprimirdd1027a4fcd13c0536e736b0ebe3ae59.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return imprimirdd1027a4fcd13c0536e736b0ebe3ae59.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:557
 * @route '/prestamos/clientes/{prestamo}/imprimir'
 */
imprimirdd1027a4fcd13c0536e736b0ebe3ae59.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirdd1027a4fcd13c0536e736b0ebe3ae59.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimir
 * @see app/Http/Controllers/PrestamoClienteController.php:557
 * @route '/prestamos/clientes/{prestamo}/imprimir'
 */
imprimirdd1027a4fcd13c0536e736b0ebe3ae59.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirdd1027a4fcd13c0536e736b0ebe3ae59.url(args, options),
    method: 'head',
})

export const imprimir = {
    '/api/prestamos-cliente/{prestamo}/imprimir': imprimire1f2d28e5f69b5fc37d7071600aa56ce,
    '/prestamos/clientes/{prestamo}/imprimir': imprimirdd1027a4fcd13c0536e736b0ebe3ae59,
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoClienteController.php:652
 * @route '/api/prestamos-cliente/{prestamo}/devoluciones/imprimir'
 */
const imprimirTodasLasDevoluciones010b0080b1cd0318cbb432dd215e4ebf = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTodasLasDevoluciones010b0080b1cd0318cbb432dd215e4ebf.url(args, options),
    method: 'get',
})

imprimirTodasLasDevoluciones010b0080b1cd0318cbb432dd215e4ebf.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-cliente/{prestamo}/devoluciones/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoClienteController.php:652
 * @route '/api/prestamos-cliente/{prestamo}/devoluciones/imprimir'
 */
imprimirTodasLasDevoluciones010b0080b1cd0318cbb432dd215e4ebf.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return imprimirTodasLasDevoluciones010b0080b1cd0318cbb432dd215e4ebf.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoClienteController.php:652
 * @route '/api/prestamos-cliente/{prestamo}/devoluciones/imprimir'
 */
imprimirTodasLasDevoluciones010b0080b1cd0318cbb432dd215e4ebf.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTodasLasDevoluciones010b0080b1cd0318cbb432dd215e4ebf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoClienteController.php:652
 * @route '/api/prestamos-cliente/{prestamo}/devoluciones/imprimir'
 */
imprimirTodasLasDevoluciones010b0080b1cd0318cbb432dd215e4ebf.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirTodasLasDevoluciones010b0080b1cd0318cbb432dd215e4ebf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoClienteController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoClienteController.php:652
 * @route '/prestamos/clientes/{prestamo}/devoluciones/imprimir'
 */
const imprimirTodasLasDevoluciones97ec5719040a1433f18c0944d798aeb3 = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTodasLasDevoluciones97ec5719040a1433f18c0944d798aeb3.url(args, options),
    method: 'get',
})

imprimirTodasLasDevoluciones97ec5719040a1433f18c0944d798aeb3.definition = {
    methods: ["get","head"],
    url: '/prestamos/clientes/{prestamo}/devoluciones/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoClienteController.php:652
 * @route '/prestamos/clientes/{prestamo}/devoluciones/imprimir'
 */
imprimirTodasLasDevoluciones97ec5719040a1433f18c0944d798aeb3.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return imprimirTodasLasDevoluciones97ec5719040a1433f18c0944d798aeb3.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoClienteController.php:652
 * @route '/prestamos/clientes/{prestamo}/devoluciones/imprimir'
 */
imprimirTodasLasDevoluciones97ec5719040a1433f18c0944d798aeb3.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTodasLasDevoluciones97ec5719040a1433f18c0944d798aeb3.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoClienteController.php:652
 * @route '/prestamos/clientes/{prestamo}/devoluciones/imprimir'
 */
imprimirTodasLasDevoluciones97ec5719040a1433f18c0944d798aeb3.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirTodasLasDevoluciones97ec5719040a1433f18c0944d798aeb3.url(args, options),
    method: 'head',
})

export const imprimirTodasLasDevoluciones = {
    '/api/prestamos-cliente/{prestamo}/devoluciones/imprimir': imprimirTodasLasDevoluciones010b0080b1cd0318cbb432dd215e4ebf,
    '/prestamos/clientes/{prestamo}/devoluciones/imprimir': imprimirTodasLasDevoluciones97ec5719040a1433f18c0944d798aeb3,
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoClienteController.php:609
 * @route '/api/prestamos-cliente/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
export const imprimirDevolucion = (args: { prestamo: number | { id: number }, devolucion: string | number } | [prestamo: number | { id: number }, devolucion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirDevolucion.url(args, options),
    method: 'get',
})

imprimirDevolucion.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-cliente/{prestamo}/devoluciones/{devolucion}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoClienteController.php:609
 * @route '/api/prestamos-cliente/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucion.url = (args: { prestamo: number | { id: number }, devolucion: string | number } | [prestamo: number | { id: number }, devolucion: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                    devolucion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                                devolucion: args.devolucion,
                }

    return imprimirDevolucion.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace('{devolucion}', parsedArgs.devolucion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoClienteController.php:609
 * @route '/api/prestamos-cliente/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucion.get = (args: { prestamo: number | { id: number }, devolucion: string | number } | [prestamo: number | { id: number }, devolucion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirDevolucion.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoClienteController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoClienteController.php:609
 * @route '/api/prestamos-cliente/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucion.head = (args: { prestamo: number | { id: number }, devolucion: string | number } | [prestamo: number | { id: number }, devolucion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirDevolucion.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamoClienteController::index
 * @see app/Http/Controllers/PrestamoClienteController.php:30
 * @route '/api/prestamos-cliente'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-cliente',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::index
 * @see app/Http/Controllers/PrestamoClienteController.php:30
 * @route '/api/prestamos-cliente'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::index
 * @see app/Http/Controllers/PrestamoClienteController.php:30
 * @route '/api/prestamos-cliente'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoClienteController::index
 * @see app/Http/Controllers/PrestamoClienteController.php:30
 * @route '/api/prestamos-cliente'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamoClienteController::store
 * @see app/Http/Controllers/PrestamoClienteController.php:102
 * @route '/api/prestamos-cliente'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/prestamos-cliente',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::store
 * @see app/Http/Controllers/PrestamoClienteController.php:102
 * @route '/api/prestamos-cliente'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::store
 * @see app/Http/Controllers/PrestamoClienteController.php:102
 * @route '/api/prestamos-cliente'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrestamoClienteController::show
 * @see app/Http/Controllers/PrestamoClienteController.php:280
 * @route '/api/prestamos-cliente/{prestamo}'
 */
export const show = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-cliente/{prestamo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::show
 * @see app/Http/Controllers/PrestamoClienteController.php:280
 * @route '/api/prestamos-cliente/{prestamo}'
 */
show.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return show.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::show
 * @see app/Http/Controllers/PrestamoClienteController.php:280
 * @route '/api/prestamos-cliente/{prestamo}'
 */
show.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoClienteController::show
 * @see app/Http/Controllers/PrestamoClienteController.php:280
 * @route '/api/prestamos-cliente/{prestamo}'
 */
show.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamoClienteController::update
 * @see app/Http/Controllers/PrestamoClienteController.php:335
 * @route '/api/prestamos-cliente/{prestamo}'
 */
export const update = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/api/prestamos-cliente/{prestamo}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::update
 * @see app/Http/Controllers/PrestamoClienteController.php:335
 * @route '/api/prestamos-cliente/{prestamo}'
 */
update.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return update.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::update
 * @see app/Http/Controllers/PrestamoClienteController.php:335
 * @route '/api/prestamos-cliente/{prestamo}'
 */
update.patch = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PrestamoClienteController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoClienteController.php:426
 * @route '/api/prestamos-cliente/{prestamo}/devolver'
 */
export const registrarDevolucion = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarDevolucion.url(args, options),
    method: 'post',
})

registrarDevolucion.definition = {
    methods: ["post"],
    url: '/api/prestamos-cliente/{prestamo}/devolver',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoClienteController.php:426
 * @route '/api/prestamos-cliente/{prestamo}/devolver'
 */
registrarDevolucion.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return registrarDevolucion.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoClienteController.php:426
 * @route '/api/prestamos-cliente/{prestamo}/devolver'
 */
registrarDevolucion.post = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarDevolucion.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrestamoClienteController::anularPrestamo
 * @see app/Http/Controllers/PrestamoClienteController.php:689
 * @route '/api/prestamos-cliente/{prestamo}/anular'
 */
export const anularPrestamo = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPrestamo.url(args, options),
    method: 'post',
})

anularPrestamo.definition = {
    methods: ["post"],
    url: '/api/prestamos-cliente/{prestamo}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::anularPrestamo
 * @see app/Http/Controllers/PrestamoClienteController.php:689
 * @route '/api/prestamos-cliente/{prestamo}/anular'
 */
anularPrestamo.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return anularPrestamo.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::anularPrestamo
 * @see app/Http/Controllers/PrestamoClienteController.php:689
 * @route '/api/prestamos-cliente/{prestamo}/anular'
 */
anularPrestamo.post = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPrestamo.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrestamoClienteController::anularDevolucion
 * @see app/Http/Controllers/PrestamoClienteController.php:749
 * @route '/api/prestamos-cliente/{prestamo}/devoluciones/{devolucion}/anular'
 */
export const anularDevolucion = (args: { prestamo: number | { id: number }, devolucion: string | number } | [prestamo: number | { id: number }, devolucion: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularDevolucion.url(args, options),
    method: 'post',
})

anularDevolucion.definition = {
    methods: ["post"],
    url: '/api/prestamos-cliente/{prestamo}/devoluciones/{devolucion}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::anularDevolucion
 * @see app/Http/Controllers/PrestamoClienteController.php:749
 * @route '/api/prestamos-cliente/{prestamo}/devoluciones/{devolucion}/anular'
 */
anularDevolucion.url = (args: { prestamo: number | { id: number }, devolucion: string | number } | [prestamo: number | { id: number }, devolucion: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                    devolucion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                                devolucion: args.devolucion,
                }

    return anularDevolucion.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace('{devolucion}', parsedArgs.devolucion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::anularDevolucion
 * @see app/Http/Controllers/PrestamoClienteController.php:749
 * @route '/api/prestamos-cliente/{prestamo}/devoluciones/{devolucion}/anular'
 */
anularDevolucion.post = (args: { prestamo: number | { id: number }, devolucion: string | number } | [prestamo: number | { id: number }, devolucion: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularDevolucion.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrestamoClienteController::obtenerPendientesChofer
 * @see app/Http/Controllers/PrestamoClienteController.php:519
 * @route '/api/prestamos-cliente/chofer/{choferId}/pendientes'
 */
export const obtenerPendientesChofer = (args: { choferId: string | number } | [choferId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerPendientesChofer.url(args, options),
    method: 'get',
})

obtenerPendientesChofer.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-cliente/chofer/{choferId}/pendientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::obtenerPendientesChofer
 * @see app/Http/Controllers/PrestamoClienteController.php:519
 * @route '/api/prestamos-cliente/chofer/{choferId}/pendientes'
 */
obtenerPendientesChofer.url = (args: { choferId: string | number } | [choferId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { choferId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    choferId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        choferId: args.choferId,
                }

    return obtenerPendientesChofer.definition.url
            .replace('{choferId}', parsedArgs.choferId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::obtenerPendientesChofer
 * @see app/Http/Controllers/PrestamoClienteController.php:519
 * @route '/api/prestamos-cliente/chofer/{choferId}/pendientes'
 */
obtenerPendientesChofer.get = (args: { choferId: string | number } | [choferId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerPendientesChofer.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoClienteController::obtenerPendientesChofer
 * @see app/Http/Controllers/PrestamoClienteController.php:519
 * @route '/api/prestamos-cliente/chofer/{choferId}/pendientes'
 */
obtenerPendientesChofer.head = (args: { choferId: string | number } | [choferId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerPendientesChofer.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamoClienteController::obtenerActivosCliente
 * @see app/Http/Controllers/PrestamoClienteController.php:538
 * @route '/api/prestamos-cliente/cliente/{clienteId}/activos'
 */
export const obtenerActivosCliente = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerActivosCliente.url(args, options),
    method: 'get',
})

obtenerActivosCliente.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-cliente/cliente/{clienteId}/activos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoClienteController::obtenerActivosCliente
 * @see app/Http/Controllers/PrestamoClienteController.php:538
 * @route '/api/prestamos-cliente/cliente/{clienteId}/activos'
 */
obtenerActivosCliente.url = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { clienteId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    clienteId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        clienteId: args.clienteId,
                }

    return obtenerActivosCliente.definition.url
            .replace('{clienteId}', parsedArgs.clienteId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoClienteController::obtenerActivosCliente
 * @see app/Http/Controllers/PrestamoClienteController.php:538
 * @route '/api/prestamos-cliente/cliente/{clienteId}/activos'
 */
obtenerActivosCliente.get = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerActivosCliente.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoClienteController::obtenerActivosCliente
 * @see app/Http/Controllers/PrestamoClienteController.php:538
 * @route '/api/prestamos-cliente/cliente/{clienteId}/activos'
 */
obtenerActivosCliente.head = (args: { clienteId: string | number } | [clienteId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerActivosCliente.url(args, options),
    method: 'head',
})
const PrestamoClienteController = { imprimir, imprimirTodasLasDevoluciones, imprimirDevolucion, index, store, show, update, registrarDevolucion, anularPrestamo, anularDevolucion, obtenerPendientesChofer, obtenerActivosCliente }

export default PrestamoClienteController