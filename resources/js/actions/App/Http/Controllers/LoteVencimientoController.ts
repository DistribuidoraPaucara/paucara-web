import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\LoteVencimientoController::duplicados
 * @see app/Http/Controllers/LoteVencimientoController.php:150
 * @route '/compras/lotes-vencimientos/duplicados'
 */
export const duplicados = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: duplicados.url(options),
    method: 'get',
})

duplicados.definition = {
    methods: ["get","head"],
    url: '/compras/lotes-vencimientos/duplicados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoteVencimientoController::duplicados
 * @see app/Http/Controllers/LoteVencimientoController.php:150
 * @route '/compras/lotes-vencimientos/duplicados'
 */
duplicados.url = (options?: RouteQueryOptions) => {
    return duplicados.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoteVencimientoController::duplicados
 * @see app/Http/Controllers/LoteVencimientoController.php:150
 * @route '/compras/lotes-vencimientos/duplicados'
 */
duplicados.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: duplicados.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoteVencimientoController::duplicados
 * @see app/Http/Controllers/LoteVencimientoController.php:150
 * @route '/compras/lotes-vencimientos/duplicados'
 */
duplicados.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: duplicados.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LoteVencimientoController::duplicados
 * @see app/Http/Controllers/LoteVencimientoController.php:150
 * @route '/compras/lotes-vencimientos/duplicados'
 */
    const duplicadosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: duplicados.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LoteVencimientoController::duplicados
 * @see app/Http/Controllers/LoteVencimientoController.php:150
 * @route '/compras/lotes-vencimientos/duplicados'
 */
        duplicadosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: duplicados.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LoteVencimientoController::duplicados
 * @see app/Http/Controllers/LoteVencimientoController.php:150
 * @route '/compras/lotes-vencimientos/duplicados'
 */
        duplicadosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: duplicados.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    duplicados.form = duplicadosForm
/**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/compras/lotes-vencimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LoteVencimientoController::index
 * @see app/Http/Controllers/LoteVencimientoController.php:13
 * @route '/compras/lotes-vencimientos'
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
/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarEstado
 * @see app/Http/Controllers/LoteVencimientoController.php:0
 * @route '/compras/lotes-vencimientos/{lote}/actualizar-estado'
 */
export const actualizarEstado = (args: { lote: string | number } | [lote: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEstado.url(args, options),
    method: 'patch',
})

actualizarEstado.definition = {
    methods: ["patch"],
    url: '/compras/lotes-vencimientos/{lote}/actualizar-estado',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarEstado
 * @see app/Http/Controllers/LoteVencimientoController.php:0
 * @route '/compras/lotes-vencimientos/{lote}/actualizar-estado'
 */
actualizarEstado.url = (args: { lote: string | number } | [lote: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lote: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    lote: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lote: args.lote,
                }

    return actualizarEstado.definition.url
            .replace('{lote}', parsedArgs.lote.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarEstado
 * @see app/Http/Controllers/LoteVencimientoController.php:0
 * @route '/compras/lotes-vencimientos/{lote}/actualizar-estado'
 */
actualizarEstado.patch = (args: { lote: string | number } | [lote: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEstado.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarEstado
 * @see app/Http/Controllers/LoteVencimientoController.php:0
 * @route '/compras/lotes-vencimientos/{lote}/actualizar-estado'
 */
    const actualizarEstadoForm = (args: { lote: string | number } | [lote: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarEstado.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarEstado
 * @see app/Http/Controllers/LoteVencimientoController.php:0
 * @route '/compras/lotes-vencimientos/{lote}/actualizar-estado'
 */
        actualizarEstadoForm.patch = (args: { lote: string | number } | [lote: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarEstado.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarEstado.form = actualizarEstadoForm
/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarCantidad
 * @see app/Http/Controllers/LoteVencimientoController.php:132
 * @route '/compras/lotes-vencimientos/{lote}/cantidad'
 */
export const actualizarCantidad = (args: { lote: string | number } | [lote: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarCantidad.url(args, options),
    method: 'patch',
})

actualizarCantidad.definition = {
    methods: ["patch"],
    url: '/compras/lotes-vencimientos/{lote}/cantidad',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarCantidad
 * @see app/Http/Controllers/LoteVencimientoController.php:132
 * @route '/compras/lotes-vencimientos/{lote}/cantidad'
 */
actualizarCantidad.url = (args: { lote: string | number } | [lote: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { lote: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    lote: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        lote: args.lote,
                }

    return actualizarCantidad.definition.url
            .replace('{lote}', parsedArgs.lote.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarCantidad
 * @see app/Http/Controllers/LoteVencimientoController.php:132
 * @route '/compras/lotes-vencimientos/{lote}/cantidad'
 */
actualizarCantidad.patch = (args: { lote: string | number } | [lote: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarCantidad.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarCantidad
 * @see app/Http/Controllers/LoteVencimientoController.php:132
 * @route '/compras/lotes-vencimientos/{lote}/cantidad'
 */
    const actualizarCantidadForm = (args: { lote: string | number } | [lote: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarCantidad.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarCantidad
 * @see app/Http/Controllers/LoteVencimientoController.php:132
 * @route '/compras/lotes-vencimientos/{lote}/cantidad'
 */
        actualizarCantidadForm.patch = (args: { lote: string | number } | [lote: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarCantidad.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarCantidad.form = actualizarCantidadForm
/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarLote
 * @see app/Http/Controllers/LoteVencimientoController.php:229
 * @route '/compras/lotes-vencimientos/{stock}/actualizar-lote'
 */
export const actualizarLote = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarLote.url(args, options),
    method: 'patch',
})

actualizarLote.definition = {
    methods: ["patch"],
    url: '/compras/lotes-vencimientos/{stock}/actualizar-lote',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarLote
 * @see app/Http/Controllers/LoteVencimientoController.php:229
 * @route '/compras/lotes-vencimientos/{stock}/actualizar-lote'
 */
actualizarLote.url = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stock: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stock: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stock: typeof args.stock === 'object'
                ? args.stock.id
                : args.stock,
                }

    return actualizarLote.definition.url
            .replace('{stock}', parsedArgs.stock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarLote
 * @see app/Http/Controllers/LoteVencimientoController.php:229
 * @route '/compras/lotes-vencimientos/{stock}/actualizar-lote'
 */
actualizarLote.patch = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarLote.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarLote
 * @see app/Http/Controllers/LoteVencimientoController.php:229
 * @route '/compras/lotes-vencimientos/{stock}/actualizar-lote'
 */
    const actualizarLoteForm = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarLote.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoteVencimientoController::actualizarLote
 * @see app/Http/Controllers/LoteVencimientoController.php:229
 * @route '/compras/lotes-vencimientos/{stock}/actualizar-lote'
 */
        actualizarLoteForm.patch = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarLote.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarLote.form = actualizarLoteForm
/**
* @see \App\Http\Controllers\LoteVencimientoController::darDeBaja
 * @see app/Http/Controllers/LoteVencimientoController.php:253
 * @route '/compras/lotes-vencimientos/{stock}/dar-de-baja'
 */
export const darDeBaja = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: darDeBaja.url(args, options),
    method: 'delete',
})

darDeBaja.definition = {
    methods: ["delete"],
    url: '/compras/lotes-vencimientos/{stock}/dar-de-baja',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\LoteVencimientoController::darDeBaja
 * @see app/Http/Controllers/LoteVencimientoController.php:253
 * @route '/compras/lotes-vencimientos/{stock}/dar-de-baja'
 */
darDeBaja.url = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stock: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stock: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stock: typeof args.stock === 'object'
                ? args.stock.id
                : args.stock,
                }

    return darDeBaja.definition.url
            .replace('{stock}', parsedArgs.stock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoteVencimientoController::darDeBaja
 * @see app/Http/Controllers/LoteVencimientoController.php:253
 * @route '/compras/lotes-vencimientos/{stock}/dar-de-baja'
 */
darDeBaja.delete = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: darDeBaja.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\LoteVencimientoController::darDeBaja
 * @see app/Http/Controllers/LoteVencimientoController.php:253
 * @route '/compras/lotes-vencimientos/{stock}/dar-de-baja'
 */
    const darDeBajaForm = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: darDeBaja.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoteVencimientoController::darDeBaja
 * @see app/Http/Controllers/LoteVencimientoController.php:253
 * @route '/compras/lotes-vencimientos/{stock}/dar-de-baja'
 */
        darDeBajaForm.delete = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: darDeBaja.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    darDeBaja.form = darDeBajaForm
/**
* @see \App\Http\Controllers\LoteVencimientoController::restaurar
 * @see app/Http/Controllers/LoteVencimientoController.php:270
 * @route '/compras/lotes-vencimientos/{stock}/restaurar'
 */
export const restaurar = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: restaurar.url(args, options),
    method: 'patch',
})

restaurar.definition = {
    methods: ["patch"],
    url: '/compras/lotes-vencimientos/{stock}/restaurar',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\LoteVencimientoController::restaurar
 * @see app/Http/Controllers/LoteVencimientoController.php:270
 * @route '/compras/lotes-vencimientos/{stock}/restaurar'
 */
restaurar.url = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { stock: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { stock: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    stock: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        stock: typeof args.stock === 'object'
                ? args.stock.id
                : args.stock,
                }

    return restaurar.definition.url
            .replace('{stock}', parsedArgs.stock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoteVencimientoController::restaurar
 * @see app/Http/Controllers/LoteVencimientoController.php:270
 * @route '/compras/lotes-vencimientos/{stock}/restaurar'
 */
restaurar.patch = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: restaurar.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\LoteVencimientoController::restaurar
 * @see app/Http/Controllers/LoteVencimientoController.php:270
 * @route '/compras/lotes-vencimientos/{stock}/restaurar'
 */
    const restaurarForm = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: restaurar.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\LoteVencimientoController::restaurar
 * @see app/Http/Controllers/LoteVencimientoController.php:270
 * @route '/compras/lotes-vencimientos/{stock}/restaurar'
 */
        restaurarForm.patch = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: restaurar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    restaurar.form = restaurarForm
/**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:287
 * @route '/compras/lotes-vencimientos/export'
 */
export const exportMethod = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/compras/lotes-vencimientos/export',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:287
 * @route '/compras/lotes-vencimientos/export'
 */
exportMethod.url = (options?: RouteQueryOptions) => {
    return exportMethod.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:287
 * @route '/compras/lotes-vencimientos/export'
 */
exportMethod.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:287
 * @route '/compras/lotes-vencimientos/export'
 */
exportMethod.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:287
 * @route '/compras/lotes-vencimientos/export'
 */
    const exportMethodForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:287
 * @route '/compras/lotes-vencimientos/export'
 */
        exportMethodForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\LoteVencimientoController::exportMethod
 * @see app/Http/Controllers/LoteVencimientoController.php:287
 * @route '/compras/lotes-vencimientos/export'
 */
        exportMethodForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
const LoteVencimientoController = { duplicados, index, actualizarEstado, actualizarCantidad, actualizarLote, darDeBaja, restaurar, exportMethod, export: exportMethod }

export default LoteVencimientoController