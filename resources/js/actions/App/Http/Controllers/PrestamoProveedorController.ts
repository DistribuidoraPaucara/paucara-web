import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:320
 * @route '/api/prestamos-proveedor/{prestamo}/imprimir'
 */
const imprimir4e11d47c476c02e0e05a73b954d0b3ed = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir4e11d47c476c02e0e05a73b954d0b3ed.url(args, options),
    method: 'get',
})

imprimir4e11d47c476c02e0e05a73b954d0b3ed.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-proveedor/{prestamo}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:320
 * @route '/api/prestamos-proveedor/{prestamo}/imprimir'
 */
imprimir4e11d47c476c02e0e05a73b954d0b3ed.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return imprimir4e11d47c476c02e0e05a73b954d0b3ed.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:320
 * @route '/api/prestamos-proveedor/{prestamo}/imprimir'
 */
imprimir4e11d47c476c02e0e05a73b954d0b3ed.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir4e11d47c476c02e0e05a73b954d0b3ed.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:320
 * @route '/api/prestamos-proveedor/{prestamo}/imprimir'
 */
imprimir4e11d47c476c02e0e05a73b954d0b3ed.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir4e11d47c476c02e0e05a73b954d0b3ed.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:320
 * @route '/prestamos/proveedores/{prestamo}/imprimir'
 */
const imprimirce191a3ab05b0b481b226b35c344263f = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirce191a3ab05b0b481b226b35c344263f.url(args, options),
    method: 'get',
})

imprimirce191a3ab05b0b481b226b35c344263f.definition = {
    methods: ["get","head"],
    url: '/prestamos/proveedores/{prestamo}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:320
 * @route '/prestamos/proveedores/{prestamo}/imprimir'
 */
imprimirce191a3ab05b0b481b226b35c344263f.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return imprimirce191a3ab05b0b481b226b35c344263f.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:320
 * @route '/prestamos/proveedores/{prestamo}/imprimir'
 */
imprimirce191a3ab05b0b481b226b35c344263f.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirce191a3ab05b0b481b226b35c344263f.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimir
 * @see app/Http/Controllers/PrestamoProveedorController.php:320
 * @route '/prestamos/proveedores/{prestamo}/imprimir'
 */
imprimirce191a3ab05b0b481b226b35c344263f.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirce191a3ab05b0b481b226b35c344263f.url(args, options),
    method: 'head',
})

export const imprimir = {
    '/api/prestamos-proveedor/{prestamo}/imprimir': imprimir4e11d47c476c02e0e05a73b954d0b3ed,
    '/prestamos/proveedores/{prestamo}/imprimir': imprimirce191a3ab05b0b481b226b35c344263f,
}

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir'
 */
export const imprimirTodasLasDevoluciones = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTodasLasDevoluciones.url(args, options),
    method: 'get',
})

imprimirTodasLasDevoluciones.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir'
 */
imprimirTodasLasDevoluciones.url = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: args.prestamo,
                }

    return imprimirTodasLasDevoluciones.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir'
 */
imprimirTodasLasDevoluciones.get = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTodasLasDevoluciones.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/imprimir'
 */
imprimirTodasLasDevoluciones.head = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirTodasLasDevoluciones.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
export const imprimirDevolucion = (args: { prestamo: string | number, devolucion: string | number } | [prestamo: string | number, devolucion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirDevolucion.url(args, options),
    method: 'get',
})

imprimirDevolucion.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-proveedor/{prestamo}/devoluciones/{devolucion}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucion.url = (args: { prestamo: string | number, devolucion: string | number } | [prestamo: string | number, devolucion: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                    devolucion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: args.prestamo,
                                devolucion: args.devolucion,
                }

    return imprimirDevolucion.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace('{devolucion}', parsedArgs.devolucion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucion.get = (args: { prestamo: string | number, devolucion: string | number } | [prestamo: string | number, devolucion: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirDevolucion.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoProveedorController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoProveedorController.php:0
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucion.head = (args: { prestamo: string | number, devolucion: string | number } | [prestamo: string | number, devolucion: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirDevolucion.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamoProveedorController::index
 * @see app/Http/Controllers/PrestamoProveedorController.php:27
 * @route '/api/prestamos-proveedor'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-proveedor',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::index
 * @see app/Http/Controllers/PrestamoProveedorController.php:27
 * @route '/api/prestamos-proveedor'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoProveedorController::index
 * @see app/Http/Controllers/PrestamoProveedorController.php:27
 * @route '/api/prestamos-proveedor'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoProveedorController::index
 * @see app/Http/Controllers/PrestamoProveedorController.php:27
 * @route '/api/prestamos-proveedor'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamoProveedorController::store
 * @see app/Http/Controllers/PrestamoProveedorController.php:87
 * @route '/api/prestamos-proveedor'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/prestamos-proveedor',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::store
 * @see app/Http/Controllers/PrestamoProveedorController.php:87
 * @route '/api/prestamos-proveedor'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoProveedorController::store
 * @see app/Http/Controllers/PrestamoProveedorController.php:87
 * @route '/api/prestamos-proveedor'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrestamoProveedorController::obtenerActivosProveedor
 * @see app/Http/Controllers/PrestamoProveedorController.php:282
 * @route '/api/prestamos-proveedor/proveedor/{proveedorId}/activos'
 */
export const obtenerActivosProveedor = (args: { proveedorId: string | number } | [proveedorId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerActivosProveedor.url(args, options),
    method: 'get',
})

obtenerActivosProveedor.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-proveedor/proveedor/{proveedorId}/activos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::obtenerActivosProveedor
 * @see app/Http/Controllers/PrestamoProveedorController.php:282
 * @route '/api/prestamos-proveedor/proveedor/{proveedorId}/activos'
 */
obtenerActivosProveedor.url = (args: { proveedorId: string | number } | [proveedorId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proveedorId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    proveedorId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proveedorId: args.proveedorId,
                }

    return obtenerActivosProveedor.definition.url
            .replace('{proveedorId}', parsedArgs.proveedorId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoProveedorController::obtenerActivosProveedor
 * @see app/Http/Controllers/PrestamoProveedorController.php:282
 * @route '/api/prestamos-proveedor/proveedor/{proveedorId}/activos'
 */
obtenerActivosProveedor.get = (args: { proveedorId: string | number } | [proveedorId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerActivosProveedor.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoProveedorController::obtenerActivosProveedor
 * @see app/Http/Controllers/PrestamoProveedorController.php:282
 * @route '/api/prestamos-proveedor/proveedor/{proveedorId}/activos'
 */
obtenerActivosProveedor.head = (args: { proveedorId: string | number } | [proveedorId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerActivosProveedor.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamoProveedorController::obtenerDeuda
 * @see app/Http/Controllers/PrestamoProveedorController.php:301
 * @route '/api/prestamos-proveedor/proveedor/{proveedorId}/deuda'
 */
export const obtenerDeuda = (args: { proveedorId: string | number } | [proveedorId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDeuda.url(args, options),
    method: 'get',
})

obtenerDeuda.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-proveedor/proveedor/{proveedorId}/deuda',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::obtenerDeuda
 * @see app/Http/Controllers/PrestamoProveedorController.php:301
 * @route '/api/prestamos-proveedor/proveedor/{proveedorId}/deuda'
 */
obtenerDeuda.url = (args: { proveedorId: string | number } | [proveedorId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proveedorId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    proveedorId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proveedorId: args.proveedorId,
                }

    return obtenerDeuda.definition.url
            .replace('{proveedorId}', parsedArgs.proveedorId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoProveedorController::obtenerDeuda
 * @see app/Http/Controllers/PrestamoProveedorController.php:301
 * @route '/api/prestamos-proveedor/proveedor/{proveedorId}/deuda'
 */
obtenerDeuda.get = (args: { proveedorId: string | number } | [proveedorId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDeuda.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoProveedorController::obtenerDeuda
 * @see app/Http/Controllers/PrestamoProveedorController.php:301
 * @route '/api/prestamos-proveedor/proveedor/{proveedorId}/deuda'
 */
obtenerDeuda.head = (args: { proveedorId: string | number } | [proveedorId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerDeuda.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamoProveedorController::show
 * @see app/Http/Controllers/PrestamoProveedorController.php:148
 * @route '/api/prestamos-proveedor/{prestamo}'
 */
export const show = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-proveedor/{prestamo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::show
 * @see app/Http/Controllers/PrestamoProveedorController.php:148
 * @route '/api/prestamos-proveedor/{prestamo}'
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
* @see \App\Http\Controllers\PrestamoProveedorController::show
 * @see app/Http/Controllers/PrestamoProveedorController.php:148
 * @route '/api/prestamos-proveedor/{prestamo}'
 */
show.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoProveedorController::show
 * @see app/Http/Controllers/PrestamoProveedorController.php:148
 * @route '/api/prestamos-proveedor/{prestamo}'
 */
show.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PrestamoProveedorController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoProveedorController.php:188
 * @route '/api/prestamos-proveedor/{prestamo}/devolver'
 */
export const registrarDevolucion = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarDevolucion.url(args, options),
    method: 'post',
})

registrarDevolucion.definition = {
    methods: ["post"],
    url: '/api/prestamos-proveedor/{prestamo}/devolver',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoProveedorController.php:188
 * @route '/api/prestamos-proveedor/{prestamo}/devolver'
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
* @see \App\Http\Controllers\PrestamoProveedorController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoProveedorController.php:188
 * @route '/api/prestamos-proveedor/{prestamo}/devolver'
 */
registrarDevolucion.post = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarDevolucion.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrestamoProveedorController::anularDevolucion
 * @see app/Http/Controllers/PrestamoProveedorController.php:440
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/{devolucion}/anular'
 */
export const anularDevolucion = (args: { prestamo: number | { id: number }, devolucion: number | { id: number } } | [prestamo: number | { id: number }, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularDevolucion.url(args, options),
    method: 'post',
})

anularDevolucion.definition = {
    methods: ["post"],
    url: '/api/prestamos-proveedor/{prestamo}/devoluciones/{devolucion}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::anularDevolucion
 * @see app/Http/Controllers/PrestamoProveedorController.php:440
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/{devolucion}/anular'
 */
anularDevolucion.url = (args: { prestamo: number | { id: number }, devolucion: number | { id: number } } | [prestamo: number | { id: number }, devolucion: number | { id: number } ], options?: RouteQueryOptions) => {
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
                                devolucion: typeof args.devolucion === 'object'
                ? args.devolucion.id
                : args.devolucion,
                }

    return anularDevolucion.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace('{devolucion}', parsedArgs.devolucion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoProveedorController::anularDevolucion
 * @see app/Http/Controllers/PrestamoProveedorController.php:440
 * @route '/api/prestamos-proveedor/{prestamo}/devoluciones/{devolucion}/anular'
 */
anularDevolucion.post = (args: { prestamo: number | { id: number }, devolucion: number | { id: number } } | [prestamo: number | { id: number }, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularDevolucion.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PrestamoProveedorController::anularPrestamo
 * @see app/Http/Controllers/PrestamoProveedorController.php:386
 * @route '/api/prestamos-proveedor/{prestamo}/anular'
 */
export const anularPrestamo = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPrestamo.url(args, options),
    method: 'post',
})

anularPrestamo.definition = {
    methods: ["post"],
    url: '/api/prestamos-proveedor/{prestamo}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoProveedorController::anularPrestamo
 * @see app/Http/Controllers/PrestamoProveedorController.php:386
 * @route '/api/prestamos-proveedor/{prestamo}/anular'
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
* @see \App\Http\Controllers\PrestamoProveedorController::anularPrestamo
 * @see app/Http/Controllers/PrestamoProveedorController.php:386
 * @route '/api/prestamos-proveedor/{prestamo}/anular'
 */
anularPrestamo.post = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPrestamo.url(args, options),
    method: 'post',
})
const PrestamoProveedorController = { imprimir, imprimirTodasLasDevoluciones, imprimirDevolucion, index, store, obtenerActivosProveedor, obtenerDeuda, show, registrarDevolucion, anularDevolucion, anularPrestamo }

export default PrestamoProveedorController