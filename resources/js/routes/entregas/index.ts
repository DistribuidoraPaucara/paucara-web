import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import lote from './lote'
/**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/entregas/{id}/ubicacion'
 */
export const registrarUbicacion = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarUbicacion.url(args, options),
    method: 'post',
})

registrarUbicacion.definition = {
    methods: ["post"],
    url: '/api/entregas/{id}/ubicacion',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/entregas/{id}/ubicacion'
 */
registrarUbicacion.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return registrarUbicacion.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/entregas/{id}/ubicacion'
 */
registrarUbicacion.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarUbicacion.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/entregas/{id}/ubicacion'
 */
    const registrarUbicacionForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarUbicacion.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/entregas/{id}/ubicacion'
 */
        registrarUbicacionForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarUbicacion.url(args, options),
            method: 'post',
        })
    
    registrarUbicacion.form = registrarUbicacionForm
/**
* @see \App\Http\Controllers\Api\EntregaController::ubicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
export const ubicaciones = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ubicaciones.url(args, options),
    method: 'get',
})

ubicaciones.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{id}/ubicaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::ubicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
ubicaciones.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return ubicaciones.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::ubicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
ubicaciones.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ubicaciones.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::ubicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
ubicaciones.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ubicaciones.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::ubicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
    const ubicacionesForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ubicaciones.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::ubicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
        ubicacionesForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ubicaciones.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::ubicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
        ubicacionesForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ubicaciones.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ubicaciones.form = ubicacionesForm
/**
* @see \App\Http\Controllers\EntregaPdfController::descargar
 * @see app/Http/Controllers/EntregaPdfController.php:59
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
 * @see app/Http/Controllers/EntregaPdfController.php:59
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
 * @see app/Http/Controllers/EntregaPdfController.php:59
 * @route '/api/entregas/{entrega}/descargar'
 */
descargar.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: descargar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EntregaPdfController::descargar
 * @see app/Http/Controllers/EntregaPdfController.php:59
 * @route '/api/entregas/{entrega}/descargar'
 */
descargar.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: descargar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EntregaPdfController::descargar
 * @see app/Http/Controllers/EntregaPdfController.php:59
 * @route '/api/entregas/{entrega}/descargar'
 */
    const descargarForm = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: descargar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EntregaPdfController::descargar
 * @see app/Http/Controllers/EntregaPdfController.php:59
 * @route '/api/entregas/{entrega}/descargar'
 */
        descargarForm.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EntregaPdfController::descargar
 * @see app/Http/Controllers/EntregaPdfController.php:59
 * @route '/api/entregas/{entrega}/descargar'
 */
        descargarForm.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: descargar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    descargar.form = descargarForm
/**
* @see \App\Http\Controllers\EntregaPdfController::preview
 * @see app/Http/Controllers/EntregaPdfController.php:223
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
 * @see app/Http/Controllers/EntregaPdfController.php:223
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
 * @see app/Http/Controllers/EntregaPdfController.php:223
 * @route '/api/entregas/{entrega}/preview'
 */
preview.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EntregaPdfController::preview
 * @see app/Http/Controllers/EntregaPdfController.php:223
 * @route '/api/entregas/{entrega}/preview'
 */
preview.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EntregaPdfController::preview
 * @see app/Http/Controllers/EntregaPdfController.php:223
 * @route '/api/entregas/{entrega}/preview'
 */
    const previewForm = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EntregaPdfController::preview
 * @see app/Http/Controllers/EntregaPdfController.php:223
 * @route '/api/entregas/{entrega}/preview'
 */
        previewForm.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EntregaPdfController::preview
 * @see app/Http/Controllers/EntregaPdfController.php:223
 * @route '/api/entregas/{entrega}/preview'
 */
        previewForm.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\EntregaPdfController::exportarExcel
 * @see app/Http/Controllers/EntregaPdfController.php:643
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
 * @see app/Http/Controllers/EntregaPdfController.php:643
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
 * @see app/Http/Controllers/EntregaPdfController.php:643
 * @route '/api/entregas/{entrega}/exportar-excel'
 */
exportarExcel.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EntregaPdfController::exportarExcel
 * @see app/Http/Controllers/EntregaPdfController.php:643
 * @route '/api/entregas/{entrega}/exportar-excel'
 */
exportarExcel.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarExcel.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EntregaPdfController::exportarExcel
 * @see app/Http/Controllers/EntregaPdfController.php:643
 * @route '/api/entregas/{entrega}/exportar-excel'
 */
    const exportarExcelForm = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarExcel.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EntregaPdfController::exportarExcel
 * @see app/Http/Controllers/EntregaPdfController.php:643
 * @route '/api/entregas/{entrega}/exportar-excel'
 */
        exportarExcelForm.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarExcel.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EntregaPdfController::exportarExcel
 * @see app/Http/Controllers/EntregaPdfController.php:643
 * @route '/api/entregas/{entrega}/exportar-excel'
 */
        exportarExcelForm.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\EntregaPdfController::debug
 * @see app/Http/Controllers/EntregaPdfController.php:24
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
 * @see app/Http/Controllers/EntregaPdfController.php:24
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
 * @see app/Http/Controllers/EntregaPdfController.php:24
 * @route '/api/entregas/{entrega}/debug'
 */
debug.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: debug.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EntregaPdfController::debug
 * @see app/Http/Controllers/EntregaPdfController.php:24
 * @route '/api/entregas/{entrega}/debug'
 */
debug.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: debug.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EntregaPdfController::debug
 * @see app/Http/Controllers/EntregaPdfController.php:24
 * @route '/api/entregas/{entrega}/debug'
 */
    const debugForm = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: debug.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EntregaPdfController::debug
 * @see app/Http/Controllers/EntregaPdfController.php:24
 * @route '/api/entregas/{entrega}/debug'
 */
        debugForm.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: debug.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EntregaPdfController::debug
 * @see app/Http/Controllers/EntregaPdfController.php:24
 * @route '/api/entregas/{entrega}/debug'
 */
        debugForm.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: debug.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    debug.form = debugForm
/**
* @see \App\Http\Controllers\EntregaPdfController::productosAgrupados
 * @see app/Http/Controllers/EntregaPdfController.php:554
 * @route '/api/entregas/{entrega}/productos-agrupados'
 */
export const productosAgrupados = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosAgrupados.url(args, options),
    method: 'get',
})

productosAgrupados.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{entrega}/productos-agrupados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EntregaPdfController::productosAgrupados
 * @see app/Http/Controllers/EntregaPdfController.php:554
 * @route '/api/entregas/{entrega}/productos-agrupados'
 */
productosAgrupados.url = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return productosAgrupados.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EntregaPdfController::productosAgrupados
 * @see app/Http/Controllers/EntregaPdfController.php:554
 * @route '/api/entregas/{entrega}/productos-agrupados'
 */
productosAgrupados.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosAgrupados.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EntregaPdfController::productosAgrupados
 * @see app/Http/Controllers/EntregaPdfController.php:554
 * @route '/api/entregas/{entrega}/productos-agrupados'
 */
productosAgrupados.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productosAgrupados.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EntregaPdfController::productosAgrupados
 * @see app/Http/Controllers/EntregaPdfController.php:554
 * @route '/api/entregas/{entrega}/productos-agrupados'
 */
    const productosAgrupadosForm = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: productosAgrupados.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EntregaPdfController::productosAgrupados
 * @see app/Http/Controllers/EntregaPdfController.php:554
 * @route '/api/entregas/{entrega}/productos-agrupados'
 */
        productosAgrupadosForm.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosAgrupados.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EntregaPdfController::productosAgrupados
 * @see app/Http/Controllers/EntregaPdfController.php:554
 * @route '/api/entregas/{entrega}/productos-agrupados'
 */
        productosAgrupadosForm.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: productosAgrupados.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    productosAgrupados.form = productosAgrupadosForm
/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarCarga
 * @see app/Http/Controllers/Api/EntregaController.php:2058
 * @route '/api/entregas/{id}/confirmar-carga'
 */
export const confirmarCarga = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarCarga.url(args, options),
    method: 'post',
})

confirmarCarga.definition = {
    methods: ["post"],
    url: '/api/entregas/{id}/confirmar-carga',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarCarga
 * @see app/Http/Controllers/Api/EntregaController.php:2058
 * @route '/api/entregas/{id}/confirmar-carga'
 */
confirmarCarga.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return confirmarCarga.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarCarga
 * @see app/Http/Controllers/Api/EntregaController.php:2058
 * @route '/api/entregas/{id}/confirmar-carga'
 */
confirmarCarga.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarCarga.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::confirmarCarga
 * @see app/Http/Controllers/Api/EntregaController.php:2058
 * @route '/api/entregas/{id}/confirmar-carga'
 */
    const confirmarCargaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmarCarga.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::confirmarCarga
 * @see app/Http/Controllers/Api/EntregaController.php:2058
 * @route '/api/entregas/{id}/confirmar-carga'
 */
        confirmarCargaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmarCarga.url(args, options),
            method: 'post',
        })
    
    confirmarCarga.form = confirmarCargaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::listoParaEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2081
 * @route '/api/entregas/{id}/listo-para-entrega'
 */
export const listoParaEntrega = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: listoParaEntrega.url(args, options),
    method: 'post',
})

listoParaEntrega.definition = {
    methods: ["post"],
    url: '/api/entregas/{id}/listo-para-entrega',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::listoParaEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2081
 * @route '/api/entregas/{id}/listo-para-entrega'
 */
listoParaEntrega.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return listoParaEntrega.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::listoParaEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2081
 * @route '/api/entregas/{id}/listo-para-entrega'
 */
listoParaEntrega.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: listoParaEntrega.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::listoParaEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2081
 * @route '/api/entregas/{id}/listo-para-entrega'
 */
    const listoParaEntregaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: listoParaEntrega.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::listoParaEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2081
 * @route '/api/entregas/{id}/listo-para-entrega'
 */
        listoParaEntregaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: listoParaEntrega.url(args, options),
            method: 'post',
        })
    
    listoParaEntrega.form = listoParaEntregaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::iniciarTransito
 * @see app/Http/Controllers/Api/EntregaController.php:2104
 * @route '/api/entregas/{id}/iniciar-transito'
 */
export const iniciarTransito = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciarTransito.url(args, options),
    method: 'post',
})

iniciarTransito.definition = {
    methods: ["post"],
    url: '/api/entregas/{id}/iniciar-transito',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::iniciarTransito
 * @see app/Http/Controllers/Api/EntregaController.php:2104
 * @route '/api/entregas/{id}/iniciar-transito'
 */
iniciarTransito.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return iniciarTransito.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::iniciarTransito
 * @see app/Http/Controllers/Api/EntregaController.php:2104
 * @route '/api/entregas/{id}/iniciar-transito'
 */
iniciarTransito.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciarTransito.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::iniciarTransito
 * @see app/Http/Controllers/Api/EntregaController.php:2104
 * @route '/api/entregas/{id}/iniciar-transito'
 */
    const iniciarTransitoForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: iniciarTransito.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::iniciarTransito
 * @see app/Http/Controllers/Api/EntregaController.php:2104
 * @route '/api/entregas/{id}/iniciar-transito'
 */
        iniciarTransitoForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: iniciarTransito.url(args, options),
            method: 'post',
        })
    
    iniciarTransito.form = iniciarTransitoForm
/**
* @see \App\Http\Controllers\Api\EntregaController::ubicacionGps
 * @see app/Http/Controllers/Api/EntregaController.php:2136
 * @route '/api/entregas/{id}/ubicacion-gps'
 */
export const ubicacionGps = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: ubicacionGps.url(args, options),
    method: 'patch',
})

ubicacionGps.definition = {
    methods: ["patch"],
    url: '/api/entregas/{id}/ubicacion-gps',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::ubicacionGps
 * @see app/Http/Controllers/Api/EntregaController.php:2136
 * @route '/api/entregas/{id}/ubicacion-gps'
 */
ubicacionGps.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return ubicacionGps.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::ubicacionGps
 * @see app/Http/Controllers/Api/EntregaController.php:2136
 * @route '/api/entregas/{id}/ubicacion-gps'
 */
ubicacionGps.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: ubicacionGps.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::ubicacionGps
 * @see app/Http/Controllers/Api/EntregaController.php:2136
 * @route '/api/entregas/{id}/ubicacion-gps'
 */
    const ubicacionGpsForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: ubicacionGps.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::ubicacionGps
 * @see app/Http/Controllers/Api/EntregaController.php:2136
 * @route '/api/entregas/{id}/ubicacion-gps'
 */
        ubicacionGpsForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: ubicacionGps.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    ubicacionGps.form = ubicacionGpsForm
/**
* @see \App\Http\Controllers\Api\EntregaController::consolidarAutomatico
 * @see app/Http/Controllers/Api/EntregaController.php:2176
 * @route '/api/entregas/consolidar-automatico'
 */
export const consolidarAutomatico = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidarAutomatico.url(options),
    method: 'post',
})

consolidarAutomatico.definition = {
    methods: ["post"],
    url: '/api/entregas/consolidar-automatico',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::consolidarAutomatico
 * @see app/Http/Controllers/Api/EntregaController.php:2176
 * @route '/api/entregas/consolidar-automatico'
 */
consolidarAutomatico.url = (options?: RouteQueryOptions) => {
    return consolidarAutomatico.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::consolidarAutomatico
 * @see app/Http/Controllers/Api/EntregaController.php:2176
 * @route '/api/entregas/consolidar-automatico'
 */
consolidarAutomatico.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidarAutomatico.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::consolidarAutomatico
 * @see app/Http/Controllers/Api/EntregaController.php:2176
 * @route '/api/entregas/consolidar-automatico'
 */
    const consolidarAutomaticoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: consolidarAutomatico.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::consolidarAutomatico
 * @see app/Http/Controllers/Api/EntregaController.php:2176
 * @route '/api/entregas/consolidar-automatico'
 */
        consolidarAutomaticoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: consolidarAutomatico.url(options),
            method: 'post',
        })
    
    consolidarAutomatico.form = consolidarAutomaticoForm
/**
* @see \App\Http\Controllers\Api\EntregaController::crearConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:2212
 * @route '/api/entregas/crear-consolidada'
 */
export const crearConsolidada = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearConsolidada.url(options),
    method: 'post',
})

crearConsolidada.definition = {
    methods: ["post"],
    url: '/api/entregas/crear-consolidada',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::crearConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:2212
 * @route '/api/entregas/crear-consolidada'
 */
crearConsolidada.url = (options?: RouteQueryOptions) => {
    return crearConsolidada.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::crearConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:2212
 * @route '/api/entregas/crear-consolidada'
 */
crearConsolidada.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearConsolidada.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::crearConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:2212
 * @route '/api/entregas/crear-consolidada'
 */
    const crearConsolidadaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: crearConsolidada.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::crearConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:2212
 * @route '/api/entregas/crear-consolidada'
 */
        crearConsolidadaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: crearConsolidada.url(options),
            method: 'post',
        })
    
    crearConsolidada.form = crearConsolidadaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:3096
 * @route '/api/entregas/{entrega}'
 */
export const actualizarConsolidada = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarConsolidada.url(args, options),
    method: 'patch',
})

actualizarConsolidada.definition = {
    methods: ["patch"],
    url: '/api/entregas/{entrega}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:3096
 * @route '/api/entregas/{entrega}'
 */
actualizarConsolidada.url = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return actualizarConsolidada.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:3096
 * @route '/api/entregas/{entrega}'
 */
actualizarConsolidada.patch = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarConsolidada.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:3096
 * @route '/api/entregas/{entrega}'
 */
    const actualizarConsolidadaForm = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarConsolidada.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:3096
 * @route '/api/entregas/{entrega}'
 */
        actualizarConsolidadaForm.patch = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarConsolidada.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarConsolidada.form = actualizarConsolidadaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::cancelar
 * @see app/Http/Controllers/Api/EntregaController.php:2406
 * @route '/api/entregas/{id}/cancelar'
 */
export const cancelar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

cancelar.definition = {
    methods: ["post"],
    url: '/api/entregas/{id}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::cancelar
 * @see app/Http/Controllers/Api/EntregaController.php:2406
 * @route '/api/entregas/{id}/cancelar'
 */
cancelar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return cancelar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::cancelar
 * @see app/Http/Controllers/Api/EntregaController.php:2406
 * @route '/api/entregas/{id}/cancelar'
 */
cancelar.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::cancelar
 * @see app/Http/Controllers/Api/EntregaController.php:2406
 * @route '/api/entregas/{id}/cancelar'
 */
    const cancelarForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::cancelar
 * @see app/Http/Controllers/Api/EntregaController.php:2406
 * @route '/api/entregas/{id}/cancelar'
 */
        cancelarForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelar.url(args, options),
            method: 'post',
        })
    
    cancelar.form = cancelarForm
/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:2545
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
export const confirmarVenta = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarVenta.url(args, options),
    method: 'post',
})

confirmarVenta.definition = {
    methods: ["post"],
    url: '/api/entregas/{id}/confirmar-venta/{venta_id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:2545
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
confirmarVenta.url = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                    venta_id: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                                venta_id: args.venta_id,
                }

    return confirmarVenta.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{venta_id}', parsedArgs.venta_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:2545
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
confirmarVenta.post = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarVenta.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:2545
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
    const confirmarVentaForm = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmarVenta.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:2545
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
        confirmarVentaForm.post = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmarVenta.url(args, options),
            method: 'post',
        })
    
    confirmarVenta.form = confirmarVentaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::desmarcarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:2610
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
export const desmarcarVenta = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: desmarcarVenta.url(args, options),
    method: 'delete',
})

desmarcarVenta.definition = {
    methods: ["delete"],
    url: '/api/entregas/{id}/confirmar-venta/{venta_id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::desmarcarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:2610
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
desmarcarVenta.url = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                    venta_id: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                                venta_id: args.venta_id,
                }

    return desmarcarVenta.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{venta_id}', parsedArgs.venta_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::desmarcarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:2610
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
desmarcarVenta.delete = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: desmarcarVenta.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::desmarcarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:2610
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
    const desmarcarVentaForm = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: desmarcarVenta.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::desmarcarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:2610
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
        desmarcarVentaForm.delete = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: desmarcarVenta.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    desmarcarVenta.form = desmarcarVentaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::detalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
export const detalles = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalles.url(args, options),
    method: 'get',
})

detalles.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{id}/detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::detalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
detalles.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return detalles.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::detalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
detalles.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: detalles.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::detalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
detalles.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: detalles.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::detalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
    const detallesForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: detalles.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::detalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
        detallesForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalles.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::detalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
        detallesForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: detalles.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    detalles.form = detallesForm
/**
* @see \App\Http\Controllers\Api\EntregaController::progreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
export const progreso = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progreso.url(args, options),
    method: 'get',
})

progreso.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{id}/progreso',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::progreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
progreso.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return progreso.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::progreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
progreso.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: progreso.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::progreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
progreso.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: progreso.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::progreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
    const progresoForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: progreso.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::progreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
        progresoForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: progreso.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::progreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
        progresoForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: progreso.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    progreso.form = progresoForm
/**
* @see \App\Http\Controllers\Api\EntregaController::localidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
export const localidades = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: localidades.url(args, options),
    method: 'get',
})

localidades.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{entrega}/localidades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::localidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
localidades.url = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return localidades.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::localidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
localidades.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: localidades.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::localidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
localidades.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: localidades.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::localidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
    const localidadesForm = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: localidades.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::localidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
        localidadesForm.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: localidades.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::localidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
        localidadesForm.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: localidades.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    localidades.form = localidadesForm
/**
* @see \App\Http\Controllers\Api\EntregaController::corregirPago
 * @see app/Http/Controllers/Api/EntregaController.php:3227
 * @route '/api/entregas/{entrega}/ventas/{venta}/corregir-pago'
 */
export const corregirPago = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: corregirPago.url(args, options),
    method: 'patch',
})

corregirPago.definition = {
    methods: ["patch"],
    url: '/api/entregas/{entrega}/ventas/{venta}/corregir-pago',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::corregirPago
 * @see app/Http/Controllers/Api/EntregaController.php:3227
 * @route '/api/entregas/{entrega}/ventas/{venta}/corregir-pago'
 */
corregirPago.url = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    entrega: args[0],
                    venta: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entrega: args.entrega,
                                venta: args.venta,
                }

    return corregirPago.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::corregirPago
 * @see app/Http/Controllers/Api/EntregaController.php:3227
 * @route '/api/entregas/{entrega}/ventas/{venta}/corregir-pago'
 */
corregirPago.patch = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: corregirPago.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::corregirPago
 * @see app/Http/Controllers/Api/EntregaController.php:3227
 * @route '/api/entregas/{entrega}/ventas/{venta}/corregir-pago'
 */
    const corregirPagoForm = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: corregirPago.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::corregirPago
 * @see app/Http/Controllers/Api/EntregaController.php:3227
 * @route '/api/entregas/{entrega}/ventas/{venta}/corregir-pago'
 */
        corregirPagoForm.patch = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: corregirPago.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    corregirPago.form = corregirPagoForm
/**
* @see \App\Http\Controllers\Api\EntregaController::cambiarTipoEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3411
 * @route '/api/entregas/{entrega}/ventas/{venta}/cambiar-tipo-entrega'
 */
export const cambiarTipoEntrega = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cambiarTipoEntrega.url(args, options),
    method: 'patch',
})

cambiarTipoEntrega.definition = {
    methods: ["patch"],
    url: '/api/entregas/{entrega}/ventas/{venta}/cambiar-tipo-entrega',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::cambiarTipoEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3411
 * @route '/api/entregas/{entrega}/ventas/{venta}/cambiar-tipo-entrega'
 */
cambiarTipoEntrega.url = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    entrega: args[0],
                    venta: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        entrega: args.entrega,
                                venta: args.venta,
                }

    return cambiarTipoEntrega.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::cambiarTipoEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3411
 * @route '/api/entregas/{entrega}/ventas/{venta}/cambiar-tipo-entrega'
 */
cambiarTipoEntrega.patch = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cambiarTipoEntrega.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::cambiarTipoEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3411
 * @route '/api/entregas/{entrega}/ventas/{venta}/cambiar-tipo-entrega'
 */
    const cambiarTipoEntregaForm = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cambiarTipoEntrega.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::cambiarTipoEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3411
 * @route '/api/entregas/{entrega}/ventas/{venta}/cambiar-tipo-entrega'
 */
        cambiarTipoEntregaForm.patch = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cambiarTipoEntrega.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    cambiarTipoEntrega.form = cambiarTipoEntregaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::show
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::show
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::show
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::show
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::show
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::show
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::show
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
        showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const entregas = {
    registrarUbicacion,
ubicaciones,
lote,
descargar,
preview,
exportarExcel,
debug,
productosAgrupados,
confirmarCarga,
listoParaEntrega,
iniciarTransito,
ubicacionGps,
consolidarAutomatico,
crearConsolidada,
actualizarConsolidada,
cancelar,
confirmarVenta,
desmarcarVenta,
detalles,
progreso,
localidades,
corregirPago,
cambiarTipoEntrega,
show,
}

export default entregas