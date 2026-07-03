import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EntregaPdfController::descargar
 * @see app/Http/Controllers/EntregaPdfController.php:60
 * @route '/api/entregas/{entrega}/descargar'
 */
export const descargar = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargar.url(args, options),
    method: 'get',
})

descargar.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{entrega}/descargar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EntregaPdfController::descargar
 * @see app/Http/Controllers/EntregaPdfController.php:60
 * @route '/api/entregas/{entrega}/descargar'
 */
descargar.url = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entrega: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { entrega: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    entrega: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entrega: typeof args.entrega === 'object'
                ? args.entrega.id
                : args.entrega,
                }

    return descargar.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EntregaPdfController::descargar
 * @see app/Http/Controllers/EntregaPdfController.php:60
 * @route '/api/entregas/{entrega}/descargar'
 */
descargar.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EntregaPdfController::descargar
 * @see app/Http/Controllers/EntregaPdfController.php:60
 * @route '/api/entregas/{entrega}/descargar'
 */
descargar.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargar.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EntregaPdfController::preview
 * @see app/Http/Controllers/EntregaPdfController.php:254
 * @route '/api/entregas/{entrega}/preview'
 */
export const preview = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{entrega}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EntregaPdfController::preview
 * @see app/Http/Controllers/EntregaPdfController.php:254
 * @route '/api/entregas/{entrega}/preview'
 */
preview.url = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entrega: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { entrega: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    entrega: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entrega: typeof args.entrega === 'object'
                ? args.entrega.id
                : args.entrega,
                }

    return preview.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EntregaPdfController::preview
 * @see app/Http/Controllers/EntregaPdfController.php:254
 * @route '/api/entregas/{entrega}/preview'
 */
preview.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EntregaPdfController::preview
 * @see app/Http/Controllers/EntregaPdfController.php:254
 * @route '/api/entregas/{entrega}/preview'
 */
preview.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EntregaPdfController::exportarExcel
 * @see app/Http/Controllers/EntregaPdfController.php:705
 * @route '/api/entregas/{entrega}/exportar-excel'
 */
export const exportarExcel = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})

exportarExcel.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{entrega}/exportar-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EntregaPdfController::exportarExcel
 * @see app/Http/Controllers/EntregaPdfController.php:705
 * @route '/api/entregas/{entrega}/exportar-excel'
 */
exportarExcel.url = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entrega: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { entrega: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    entrega: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entrega: typeof args.entrega === 'object'
                ? args.entrega.id
                : args.entrega,
                }

    return exportarExcel.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EntregaPdfController::exportarExcel
 * @see app/Http/Controllers/EntregaPdfController.php:705
 * @route '/api/entregas/{entrega}/exportar-excel'
 */
exportarExcel.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EntregaPdfController::exportarExcel
 * @see app/Http/Controllers/EntregaPdfController.php:705
 * @route '/api/entregas/{entrega}/exportar-excel'
 */
exportarExcel.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarExcel.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EntregaPdfController::debug
 * @see app/Http/Controllers/EntregaPdfController.php:25
 * @route '/api/entregas/{entrega}/debug'
 */
export const debug = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: debug.url(args, options),
    method: 'get',
})

debug.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{entrega}/debug',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EntregaPdfController::debug
 * @see app/Http/Controllers/EntregaPdfController.php:25
 * @route '/api/entregas/{entrega}/debug'
 */
debug.url = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entrega: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { entrega: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    entrega: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entrega: typeof args.entrega === 'object'
                ? args.entrega.id
                : args.entrega,
                }

    return debug.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EntregaPdfController::debug
 * @see app/Http/Controllers/EntregaPdfController.php:25
 * @route '/api/entregas/{entrega}/debug'
 */
debug.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: debug.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EntregaPdfController::debug
 * @see app/Http/Controllers/EntregaPdfController.php:25
 * @route '/api/entregas/{entrega}/debug'
 */
debug.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: debug.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\EntregaPdfController::obtenerProductosAgrupados
 * @see app/Http/Controllers/EntregaPdfController.php:615
 * @route '/api/entregas/{entrega}/productos-agrupados'
 */
export const obtenerProductosAgrupados = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerProductosAgrupados.url(args, options),
    method: 'get',
})

obtenerProductosAgrupados.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{entrega}/productos-agrupados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EntregaPdfController::obtenerProductosAgrupados
 * @see app/Http/Controllers/EntregaPdfController.php:615
 * @route '/api/entregas/{entrega}/productos-agrupados'
 */
obtenerProductosAgrupados.url = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { entrega: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { entrega: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    entrega: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entrega: typeof args.entrega === 'object'
                ? args.entrega.id
                : args.entrega,
                }

    return obtenerProductosAgrupados.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EntregaPdfController::obtenerProductosAgrupados
 * @see app/Http/Controllers/EntregaPdfController.php:615
 * @route '/api/entregas/{entrega}/productos-agrupados'
 */
obtenerProductosAgrupados.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerProductosAgrupados.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EntregaPdfController::obtenerProductosAgrupados
 * @see app/Http/Controllers/EntregaPdfController.php:615
 * @route '/api/entregas/{entrega}/productos-agrupados'
 */
obtenerProductosAgrupados.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerProductosAgrupados.url(args, options),
    method: 'head',
})
const EntregaPdfController = { descargar, preview, exportarExcel, debug, obtenerProductosAgrupados }

export default EntregaPdfController