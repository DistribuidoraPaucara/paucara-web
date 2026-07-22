import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrecioController::listadoApi
 * @see app/Http/Controllers/PrecioController.php:61
 * @route '/api/precios'
 */
export const listadoApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listadoApi.url(options),
    method: 'get',
})

listadoApi.definition = {
    methods: ["get","head"],
    url: '/api/precios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::listadoApi
 * @see app/Http/Controllers/PrecioController.php:61
 * @route '/api/precios'
 */
listadoApi.url = (options?: RouteQueryOptions) => {
    return listadoApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::listadoApi
 * @see app/Http/Controllers/PrecioController.php:61
 * @route '/api/precios'
 */
listadoApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listadoApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::listadoApi
 * @see app/Http/Controllers/PrecioController.php:61
 * @route '/api/precios'
 */
listadoApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listadoApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrecioController::listadoApi
 * @see app/Http/Controllers/PrecioController.php:61
 * @route '/api/precios'
 */
    const listadoApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listadoApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrecioController::listadoApi
 * @see app/Http/Controllers/PrecioController.php:61
 * @route '/api/precios'
 */
        listadoApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listadoApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrecioController::listadoApi
 * @see app/Http/Controllers/PrecioController.php:61
 * @route '/api/precios'
 */
        listadoApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listadoApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listadoApi.form = listadoApiForm
/**
* @see \App\Http\Controllers\PrecioController::mostrarProducto
 * @see app/Http/Controllers/PrecioController.php:252
 * @route '/api/precios/producto/{producto}'
 */
export const mostrarProducto = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mostrarProducto.url(args, options),
    method: 'get',
})

mostrarProducto.definition = {
    methods: ["get","head"],
    url: '/api/precios/producto/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::mostrarProducto
 * @see app/Http/Controllers/PrecioController.php:252
 * @route '/api/precios/producto/{producto}'
 */
mostrarProducto.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { producto: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                }

    return mostrarProducto.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::mostrarProducto
 * @see app/Http/Controllers/PrecioController.php:252
 * @route '/api/precios/producto/{producto}'
 */
mostrarProducto.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mostrarProducto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::mostrarProducto
 * @see app/Http/Controllers/PrecioController.php:252
 * @route '/api/precios/producto/{producto}'
 */
mostrarProducto.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mostrarProducto.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrecioController::mostrarProducto
 * @see app/Http/Controllers/PrecioController.php:252
 * @route '/api/precios/producto/{producto}'
 */
    const mostrarProductoForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: mostrarProducto.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrecioController::mostrarProducto
 * @see app/Http/Controllers/PrecioController.php:252
 * @route '/api/precios/producto/{producto}'
 */
        mostrarProductoForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mostrarProducto.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrecioController::mostrarProducto
 * @see app/Http/Controllers/PrecioController.php:252
 * @route '/api/precios/producto/{producto}'
 */
        mostrarProductoForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mostrarProducto.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    mostrarProducto.form = mostrarProductoForm
/**
* @see \App\Http\Controllers\PrecioController::obtenerComprasConDiferenciaCosto
 * @see app/Http/Controllers/PrecioController.php:404
 * @route '/api/precios/producto/{productoId}/compras-diferencia-costo'
 */
export const obtenerComprasConDiferenciaCosto = (args: { productoId: string | number } | [productoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerComprasConDiferenciaCosto.url(args, options),
    method: 'get',
})

obtenerComprasConDiferenciaCosto.definition = {
    methods: ["get","head"],
    url: '/api/precios/producto/{productoId}/compras-diferencia-costo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::obtenerComprasConDiferenciaCosto
 * @see app/Http/Controllers/PrecioController.php:404
 * @route '/api/precios/producto/{productoId}/compras-diferencia-costo'
 */
obtenerComprasConDiferenciaCosto.url = (args: { productoId: string | number } | [productoId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { productoId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    productoId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        productoId: args.productoId,
                }

    return obtenerComprasConDiferenciaCosto.definition.url
            .replace('{productoId}', parsedArgs.productoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::obtenerComprasConDiferenciaCosto
 * @see app/Http/Controllers/PrecioController.php:404
 * @route '/api/precios/producto/{productoId}/compras-diferencia-costo'
 */
obtenerComprasConDiferenciaCosto.get = (args: { productoId: string | number } | [productoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerComprasConDiferenciaCosto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::obtenerComprasConDiferenciaCosto
 * @see app/Http/Controllers/PrecioController.php:404
 * @route '/api/precios/producto/{productoId}/compras-diferencia-costo'
 */
obtenerComprasConDiferenciaCosto.head = (args: { productoId: string | number } | [productoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerComprasConDiferenciaCosto.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrecioController::obtenerComprasConDiferenciaCosto
 * @see app/Http/Controllers/PrecioController.php:404
 * @route '/api/precios/producto/{productoId}/compras-diferencia-costo'
 */
    const obtenerComprasConDiferenciaCostoForm = (args: { productoId: string | number } | [productoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerComprasConDiferenciaCosto.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrecioController::obtenerComprasConDiferenciaCosto
 * @see app/Http/Controllers/PrecioController.php:404
 * @route '/api/precios/producto/{productoId}/compras-diferencia-costo'
 */
        obtenerComprasConDiferenciaCostoForm.get = (args: { productoId: string | number } | [productoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerComprasConDiferenciaCosto.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrecioController::obtenerComprasConDiferenciaCosto
 * @see app/Http/Controllers/PrecioController.php:404
 * @route '/api/precios/producto/{productoId}/compras-diferencia-costo'
 */
        obtenerComprasConDiferenciaCostoForm.head = (args: { productoId: string | number } | [productoId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerComprasConDiferenciaCosto.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerComprasConDiferenciaCosto.form = obtenerComprasConDiferenciaCostoForm
/**
* @see \App\Http\Controllers\PrecioController::update
 * @see app/Http/Controllers/PrecioController.php:286
 * @route '/api/precios/{precio}'
 */
export const update = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/precios/{precio}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PrecioController::update
 * @see app/Http/Controllers/PrecioController.php:286
 * @route '/api/precios/{precio}'
 */
update.url = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { precio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { precio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    precio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        precio: typeof args.precio === 'object'
                ? args.precio.id
                : args.precio,
                }

    return update.definition.url
            .replace('{precio}', parsedArgs.precio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::update
 * @see app/Http/Controllers/PrecioController.php:286
 * @route '/api/precios/{precio}'
 */
update.put = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PrecioController::update
 * @see app/Http/Controllers/PrecioController.php:286
 * @route '/api/precios/{precio}'
 */
    const updateForm = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrecioController::update
 * @see app/Http/Controllers/PrecioController.php:286
 * @route '/api/precios/{precio}'
 */
        updateForm.put = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\PrecioController::historial
 * @see app/Http/Controllers/PrecioController.php:318
 * @route '/api/precios/{precio}/historial'
 */
export const historial = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(args, options),
    method: 'get',
})

historial.definition = {
    methods: ["get","head"],
    url: '/api/precios/{precio}/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::historial
 * @see app/Http/Controllers/PrecioController.php:318
 * @route '/api/precios/{precio}/historial'
 */
historial.url = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { precio: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { precio: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    precio: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        precio: typeof args.precio === 'object'
                ? args.precio.id
                : args.precio,
                }

    return historial.definition.url
            .replace('{precio}', parsedArgs.precio.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::historial
 * @see app/Http/Controllers/PrecioController.php:318
 * @route '/api/precios/{precio}/historial'
 */
historial.get = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::historial
 * @see app/Http/Controllers/PrecioController.php:318
 * @route '/api/precios/{precio}/historial'
 */
historial.head = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historial.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrecioController::historial
 * @see app/Http/Controllers/PrecioController.php:318
 * @route '/api/precios/{precio}/historial'
 */
    const historialForm = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historial.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrecioController::historial
 * @see app/Http/Controllers/PrecioController.php:318
 * @route '/api/precios/{precio}/historial'
 */
        historialForm.get = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historial.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrecioController::historial
 * @see app/Http/Controllers/PrecioController.php:318
 * @route '/api/precios/{precio}/historial'
 */
        historialForm.head = (args: { precio: number | { id: number } } | [precio: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historial.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historial.form = historialForm
/**
* @see \App\Http\Controllers\PrecioController::cambiosRecientes
 * @see app/Http/Controllers/PrecioController.php:337
 * @route '/api/precios/resumen/cambios-recientes'
 */
export const cambiosRecientes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cambiosRecientes.url(options),
    method: 'get',
})

cambiosRecientes.definition = {
    methods: ["get","head"],
    url: '/api/precios/resumen/cambios-recientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::cambiosRecientes
 * @see app/Http/Controllers/PrecioController.php:337
 * @route '/api/precios/resumen/cambios-recientes'
 */
cambiosRecientes.url = (options?: RouteQueryOptions) => {
    return cambiosRecientes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::cambiosRecientes
 * @see app/Http/Controllers/PrecioController.php:337
 * @route '/api/precios/resumen/cambios-recientes'
 */
cambiosRecientes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cambiosRecientes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::cambiosRecientes
 * @see app/Http/Controllers/PrecioController.php:337
 * @route '/api/precios/resumen/cambios-recientes'
 */
cambiosRecientes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cambiosRecientes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrecioController::cambiosRecientes
 * @see app/Http/Controllers/PrecioController.php:337
 * @route '/api/precios/resumen/cambios-recientes'
 */
    const cambiosRecientesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cambiosRecientes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrecioController::cambiosRecientes
 * @see app/Http/Controllers/PrecioController.php:337
 * @route '/api/precios/resumen/cambios-recientes'
 */
        cambiosRecientesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cambiosRecientes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrecioController::cambiosRecientes
 * @see app/Http/Controllers/PrecioController.php:337
 * @route '/api/precios/resumen/cambios-recientes'
 */
        cambiosRecientesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cambiosRecientes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cambiosRecientes.form = cambiosRecientesForm
/**
* @see \App\Http\Controllers\PrecioController::resumen
 * @see app/Http/Controllers/PrecioController.php:363
 * @route '/api/precios/resumen'
 */
export const resumen = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(options),
    method: 'get',
})

resumen.definition = {
    methods: ["get","head"],
    url: '/api/precios/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::resumen
 * @see app/Http/Controllers/PrecioController.php:363
 * @route '/api/precios/resumen'
 */
resumen.url = (options?: RouteQueryOptions) => {
    return resumen.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::resumen
 * @see app/Http/Controllers/PrecioController.php:363
 * @route '/api/precios/resumen'
 */
resumen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::resumen
 * @see app/Http/Controllers/PrecioController.php:363
 * @route '/api/precios/resumen'
 */
resumen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumen.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrecioController::resumen
 * @see app/Http/Controllers/PrecioController.php:363
 * @route '/api/precios/resumen'
 */
    const resumenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resumen.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrecioController::resumen
 * @see app/Http/Controllers/PrecioController.php:363
 * @route '/api/precios/resumen'
 */
        resumenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrecioController::resumen
 * @see app/Http/Controllers/PrecioController.php:363
 * @route '/api/precios/resumen'
 */
        resumenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    resumen.form = resumenForm
/**
* @see \App\Http\Controllers\PrecioController::actualizarLote
 * @see app/Http/Controllers/PrecioController.php:579
 * @route '/api/precios/actualizar-lote'
 */
export const actualizarLote = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarLote.url(options),
    method: 'post',
})

actualizarLote.definition = {
    methods: ["post"],
    url: '/api/precios/actualizar-lote',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrecioController::actualizarLote
 * @see app/Http/Controllers/PrecioController.php:579
 * @route '/api/precios/actualizar-lote'
 */
actualizarLote.url = (options?: RouteQueryOptions) => {
    return actualizarLote.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::actualizarLote
 * @see app/Http/Controllers/PrecioController.php:579
 * @route '/api/precios/actualizar-lote'
 */
actualizarLote.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarLote.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrecioController::actualizarLote
 * @see app/Http/Controllers/PrecioController.php:579
 * @route '/api/precios/actualizar-lote'
 */
    const actualizarLoteForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarLote.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrecioController::actualizarLote
 * @see app/Http/Controllers/PrecioController.php:579
 * @route '/api/precios/actualizar-lote'
 */
        actualizarLoteForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarLote.url(options),
            method: 'post',
        })
    
    actualizarLote.form = actualizarLoteForm
/**
* @see \App\Http\Controllers\PrecioController::index
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/precios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrecioController::index
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrecioController::index
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrecioController::index
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrecioController::index
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrecioController::index
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrecioController::index
 * @see app/Http/Controllers/PrecioController.php:27
 * @route '/precios'
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
const PrecioController = { listadoApi, mostrarProducto, obtenerComprasConDiferenciaCosto, update, historial, cambiosRecientes, resumen, actualizarLote, index }

export default PrecioController