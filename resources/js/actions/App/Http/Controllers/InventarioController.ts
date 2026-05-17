import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\InventarioController::importarAjustesMasivos
 * @see app/Http/Controllers/InventarioController.php:2447
 * @route '/api/inventario/ajustes-masivos'
 */
export const importarAjustesMasivos = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importarAjustesMasivos.url(options),
    method: 'post',
})

importarAjustesMasivos.definition = {
    methods: ["post"],
    url: '/api/inventario/ajustes-masivos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::importarAjustesMasivos
 * @see app/Http/Controllers/InventarioController.php:2447
 * @route '/api/inventario/ajustes-masivos'
 */
importarAjustesMasivos.url = (options?: RouteQueryOptions) => {
    return importarAjustesMasivos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::importarAjustesMasivos
 * @see app/Http/Controllers/InventarioController.php:2447
 * @route '/api/inventario/ajustes-masivos'
 */
importarAjustesMasivos.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: importarAjustesMasivos.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::importarAjustesMasivos
 * @see app/Http/Controllers/InventarioController.php:2447
 * @route '/api/inventario/ajustes-masivos'
 */
    const importarAjustesMasivosForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: importarAjustesMasivos.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::importarAjustesMasivos
 * @see app/Http/Controllers/InventarioController.php:2447
 * @route '/api/inventario/ajustes-masivos'
 */
        importarAjustesMasivosForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: importarAjustesMasivos.url(options),
            method: 'post',
        })
    
    importarAjustesMasivos.form = importarAjustesMasivosForm
/**
* @see \App\Http\Controllers\InventarioController::listarCargosCsv
 * @see app/Http/Controllers/InventarioController.php:2651
 * @route '/api/inventario/cargos-csv'
 */
export const listarCargosCsv = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listarCargosCsv.url(options),
    method: 'get',
})

listarCargosCsv.definition = {
    methods: ["get","head"],
    url: '/api/inventario/cargos-csv',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::listarCargosCsv
 * @see app/Http/Controllers/InventarioController.php:2651
 * @route '/api/inventario/cargos-csv'
 */
listarCargosCsv.url = (options?: RouteQueryOptions) => {
    return listarCargosCsv.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::listarCargosCsv
 * @see app/Http/Controllers/InventarioController.php:2651
 * @route '/api/inventario/cargos-csv'
 */
listarCargosCsv.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: listarCargosCsv.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::listarCargosCsv
 * @see app/Http/Controllers/InventarioController.php:2651
 * @route '/api/inventario/cargos-csv'
 */
listarCargosCsv.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: listarCargosCsv.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::listarCargosCsv
 * @see app/Http/Controllers/InventarioController.php:2651
 * @route '/api/inventario/cargos-csv'
 */
    const listarCargosCsvForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: listarCargosCsv.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::listarCargosCsv
 * @see app/Http/Controllers/InventarioController.php:2651
 * @route '/api/inventario/cargos-csv'
 */
        listarCargosCsvForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listarCargosCsv.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::listarCargosCsv
 * @see app/Http/Controllers/InventarioController.php:2651
 * @route '/api/inventario/cargos-csv'
 */
        listarCargosCsvForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: listarCargosCsv.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    listarCargosCsv.form = listarCargosCsvForm
/**
* @see \App\Http\Controllers\InventarioController::obtenerDetalleCargo
 * @see app/Http/Controllers/InventarioController.php:2695
 * @route '/api/inventario/cargos-csv/{cargo}'
 */
export const obtenerDetalleCargo = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetalleCargo.url(args, options),
    method: 'get',
})

obtenerDetalleCargo.definition = {
    methods: ["get","head"],
    url: '/api/inventario/cargos-csv/{cargo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::obtenerDetalleCargo
 * @see app/Http/Controllers/InventarioController.php:2695
 * @route '/api/inventario/cargos-csv/{cargo}'
 */
obtenerDetalleCargo.url = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cargo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cargo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cargo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cargo: typeof args.cargo === 'object'
                ? args.cargo.id
                : args.cargo,
                }

    return obtenerDetalleCargo.definition.url
            .replace('{cargo}', parsedArgs.cargo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::obtenerDetalleCargo
 * @see app/Http/Controllers/InventarioController.php:2695
 * @route '/api/inventario/cargos-csv/{cargo}'
 */
obtenerDetalleCargo.get = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetalleCargo.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::obtenerDetalleCargo
 * @see app/Http/Controllers/InventarioController.php:2695
 * @route '/api/inventario/cargos-csv/{cargo}'
 */
obtenerDetalleCargo.head = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerDetalleCargo.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::obtenerDetalleCargo
 * @see app/Http/Controllers/InventarioController.php:2695
 * @route '/api/inventario/cargos-csv/{cargo}'
 */
    const obtenerDetalleCargoForm = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerDetalleCargo.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::obtenerDetalleCargo
 * @see app/Http/Controllers/InventarioController.php:2695
 * @route '/api/inventario/cargos-csv/{cargo}'
 */
        obtenerDetalleCargoForm.get = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDetalleCargo.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::obtenerDetalleCargo
 * @see app/Http/Controllers/InventarioController.php:2695
 * @route '/api/inventario/cargos-csv/{cargo}'
 */
        obtenerDetalleCargoForm.head = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDetalleCargo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerDetalleCargo.form = obtenerDetalleCargoForm
/**
* @see \App\Http\Controllers\InventarioController::revertirCargo
 * @see app/Http/Controllers/InventarioController.php:2735
 * @route '/api/inventario/cargos-csv/{cargo}/revertir'
 */
export const revertirCargo = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revertirCargo.url(args, options),
    method: 'post',
})

revertirCargo.definition = {
    methods: ["post"],
    url: '/api/inventario/cargos-csv/{cargo}/revertir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::revertirCargo
 * @see app/Http/Controllers/InventarioController.php:2735
 * @route '/api/inventario/cargos-csv/{cargo}/revertir'
 */
revertirCargo.url = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { cargo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { cargo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    cargo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        cargo: typeof args.cargo === 'object'
                ? args.cargo.id
                : args.cargo,
                }

    return revertirCargo.definition.url
            .replace('{cargo}', parsedArgs.cargo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::revertirCargo
 * @see app/Http/Controllers/InventarioController.php:2735
 * @route '/api/inventario/cargos-csv/{cargo}/revertir'
 */
revertirCargo.post = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: revertirCargo.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::revertirCargo
 * @see app/Http/Controllers/InventarioController.php:2735
 * @route '/api/inventario/cargos-csv/{cargo}/revertir'
 */
    const revertirCargoForm = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: revertirCargo.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::revertirCargo
 * @see app/Http/Controllers/InventarioController.php:2735
 * @route '/api/inventario/cargos-csv/{cargo}/revertir'
 */
        revertirCargoForm.post = (args: { cargo: number | { id: number } } | [cargo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: revertirCargo.url(args, options),
            method: 'post',
        })
    
    revertirCargo.form = revertirCargoForm
/**
* @see \App\Http\Controllers\InventarioController::prepararImpresionAjustes
 * @see app/Http/Controllers/InventarioController.php:3674
 * @route '/api/inventario/ajuste/preparar-impresion'
 */
export const prepararImpresionAjustes = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prepararImpresionAjustes.url(options),
    method: 'post',
})

prepararImpresionAjustes.definition = {
    methods: ["post"],
    url: '/api/inventario/ajuste/preparar-impresion',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::prepararImpresionAjustes
 * @see app/Http/Controllers/InventarioController.php:3674
 * @route '/api/inventario/ajuste/preparar-impresion'
 */
prepararImpresionAjustes.url = (options?: RouteQueryOptions) => {
    return prepararImpresionAjustes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::prepararImpresionAjustes
 * @see app/Http/Controllers/InventarioController.php:3674
 * @route '/api/inventario/ajuste/preparar-impresion'
 */
prepararImpresionAjustes.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: prepararImpresionAjustes.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::prepararImpresionAjustes
 * @see app/Http/Controllers/InventarioController.php:3674
 * @route '/api/inventario/ajuste/preparar-impresion'
 */
    const prepararImpresionAjustesForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: prepararImpresionAjustes.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::prepararImpresionAjustes
 * @see app/Http/Controllers/InventarioController.php:3674
 * @route '/api/inventario/ajuste/preparar-impresion'
 */
        prepararImpresionAjustesForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: prepararImpresionAjustes.url(options),
            method: 'post',
        })
    
    prepararImpresionAjustes.form = prepararImpresionAjustesForm
/**
* @see \App\Http\Controllers\InventarioController::anularAjuste
 * @see app/Http/Controllers/InventarioController.php:3755
 * @route '/api/inventario/ajuste/{ajuste}/anular'
 */
export const anularAjuste = (args: { ajuste: number | { id: number } } | [ajuste: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularAjuste.url(args, options),
    method: 'post',
})

anularAjuste.definition = {
    methods: ["post"],
    url: '/api/inventario/ajuste/{ajuste}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::anularAjuste
 * @see app/Http/Controllers/InventarioController.php:3755
 * @route '/api/inventario/ajuste/{ajuste}/anular'
 */
anularAjuste.url = (args: { ajuste: number | { id: number } } | [ajuste: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ajuste: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { ajuste: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    ajuste: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ajuste: typeof args.ajuste === 'object'
                ? args.ajuste.id
                : args.ajuste,
                }

    return anularAjuste.definition.url
            .replace('{ajuste}', parsedArgs.ajuste.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::anularAjuste
 * @see app/Http/Controllers/InventarioController.php:3755
 * @route '/api/inventario/ajuste/{ajuste}/anular'
 */
anularAjuste.post = (args: { ajuste: number | { id: number } } | [ajuste: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularAjuste.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::anularAjuste
 * @see app/Http/Controllers/InventarioController.php:3755
 * @route '/api/inventario/ajuste/{ajuste}/anular'
 */
    const anularAjusteForm = (args: { ajuste: number | { id: number } } | [ajuste: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: anularAjuste.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::anularAjuste
 * @see app/Http/Controllers/InventarioController.php:3755
 * @route '/api/inventario/ajuste/{ajuste}/anular'
 */
        anularAjusteForm.post = (args: { ajuste: number | { id: number } } | [ajuste: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: anularAjuste.url(args, options),
            method: 'post',
        })
    
    anularAjuste.form = anularAjusteForm
/**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:1425
 * @route '/api/inventario/buscar-productos'
 */
export const buscarProductos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarProductos.url(options),
    method: 'get',
})

buscarProductos.definition = {
    methods: ["get","head"],
    url: '/api/inventario/buscar-productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:1425
 * @route '/api/inventario/buscar-productos'
 */
buscarProductos.url = (options?: RouteQueryOptions) => {
    return buscarProductos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:1425
 * @route '/api/inventario/buscar-productos'
 */
buscarProductos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarProductos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:1425
 * @route '/api/inventario/buscar-productos'
 */
buscarProductos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarProductos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:1425
 * @route '/api/inventario/buscar-productos'
 */
    const buscarProductosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarProductos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:1425
 * @route '/api/inventario/buscar-productos'
 */
        buscarProductosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarProductos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::buscarProductos
 * @see app/Http/Controllers/InventarioController.php:1425
 * @route '/api/inventario/buscar-productos'
 */
        buscarProductosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarProductos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarProductos.form = buscarProductosForm
/**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:1452
 * @route '/api/inventario/stock-producto/{producto}'
 */
export const stockProducto = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockProducto.url(args, options),
    method: 'get',
})

stockProducto.definition = {
    methods: ["get","head"],
    url: '/api/inventario/stock-producto/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:1452
 * @route '/api/inventario/stock-producto/{producto}'
 */
stockProducto.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return stockProducto.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:1452
 * @route '/api/inventario/stock-producto/{producto}'
 */
stockProducto.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockProducto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:1452
 * @route '/api/inventario/stock-producto/{producto}'
 */
stockProducto.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockProducto.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:1452
 * @route '/api/inventario/stock-producto/{producto}'
 */
    const stockProductoForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockProducto.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:1452
 * @route '/api/inventario/stock-producto/{producto}'
 */
        stockProductoForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockProducto.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::stockProducto
 * @see app/Http/Controllers/InventarioController.php:1452
 * @route '/api/inventario/stock-producto/{producto}'
 */
        stockProductoForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockProducto.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockProducto.form = stockProductoForm
/**
* @see \App\Http\Controllers\InventarioController::apiStockFiltrado
 * @see app/Http/Controllers/InventarioController.php:2964
 * @route '/api/inventario/stock-filtrado'
 */
export const apiStockFiltrado = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiStockFiltrado.url(options),
    method: 'get',
})

apiStockFiltrado.definition = {
    methods: ["get","head"],
    url: '/api/inventario/stock-filtrado',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::apiStockFiltrado
 * @see app/Http/Controllers/InventarioController.php:2964
 * @route '/api/inventario/stock-filtrado'
 */
apiStockFiltrado.url = (options?: RouteQueryOptions) => {
    return apiStockFiltrado.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::apiStockFiltrado
 * @see app/Http/Controllers/InventarioController.php:2964
 * @route '/api/inventario/stock-filtrado'
 */
apiStockFiltrado.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiStockFiltrado.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::apiStockFiltrado
 * @see app/Http/Controllers/InventarioController.php:2964
 * @route '/api/inventario/stock-filtrado'
 */
apiStockFiltrado.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiStockFiltrado.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::apiStockFiltrado
 * @see app/Http/Controllers/InventarioController.php:2964
 * @route '/api/inventario/stock-filtrado'
 */
    const apiStockFiltradoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: apiStockFiltrado.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::apiStockFiltrado
 * @see app/Http/Controllers/InventarioController.php:2964
 * @route '/api/inventario/stock-filtrado'
 */
        apiStockFiltradoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiStockFiltrado.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::apiStockFiltrado
 * @see app/Http/Controllers/InventarioController.php:2964
 * @route '/api/inventario/stock-filtrado'
 */
        apiStockFiltradoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiStockFiltrado.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    apiStockFiltrado.form = apiStockFiltradoForm
/**
* @see \App\Http\Controllers\InventarioController::apiLotes
 * @see app/Http/Controllers/InventarioController.php:3216
 * @route '/api/inventario/lotes'
 */
export const apiLotes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiLotes.url(options),
    method: 'get',
})

apiLotes.definition = {
    methods: ["get","head"],
    url: '/api/inventario/lotes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::apiLotes
 * @see app/Http/Controllers/InventarioController.php:3216
 * @route '/api/inventario/lotes'
 */
apiLotes.url = (options?: RouteQueryOptions) => {
    return apiLotes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::apiLotes
 * @see app/Http/Controllers/InventarioController.php:3216
 * @route '/api/inventario/lotes'
 */
apiLotes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiLotes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::apiLotes
 * @see app/Http/Controllers/InventarioController.php:3216
 * @route '/api/inventario/lotes'
 */
apiLotes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiLotes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::apiLotes
 * @see app/Http/Controllers/InventarioController.php:3216
 * @route '/api/inventario/lotes'
 */
    const apiLotesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: apiLotes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::apiLotes
 * @see app/Http/Controllers/InventarioController.php:3216
 * @route '/api/inventario/lotes'
 */
        apiLotesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiLotes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::apiLotes
 * @see app/Http/Controllers/InventarioController.php:3216
 * @route '/api/inventario/lotes'
 */
        apiLotesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiLotes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    apiLotes.form = apiLotesForm
/**
* @see \App\Http\Controllers\InventarioController::procesarAjusteApi
 * @see app/Http/Controllers/InventarioController.php:1115
 * @route '/api/inventario/ajustes'
 */
export const procesarAjusteApi = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarAjusteApi.url(options),
    method: 'post',
})

procesarAjusteApi.definition = {
    methods: ["post"],
    url: '/api/inventario/ajustes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::procesarAjusteApi
 * @see app/Http/Controllers/InventarioController.php:1115
 * @route '/api/inventario/ajustes'
 */
procesarAjusteApi.url = (options?: RouteQueryOptions) => {
    return procesarAjusteApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::procesarAjusteApi
 * @see app/Http/Controllers/InventarioController.php:1115
 * @route '/api/inventario/ajustes'
 */
procesarAjusteApi.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarAjusteApi.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::procesarAjusteApi
 * @see app/Http/Controllers/InventarioController.php:1115
 * @route '/api/inventario/ajustes'
 */
    const procesarAjusteApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: procesarAjusteApi.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::procesarAjusteApi
 * @see app/Http/Controllers/InventarioController.php:1115
 * @route '/api/inventario/ajustes'
 */
        procesarAjusteApiForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: procesarAjusteApi.url(options),
            method: 'post',
        })
    
    procesarAjusteApi.form = procesarAjusteApiForm
/**
* @see \App\Http\Controllers\InventarioController::procesarAjusteTabla
 * @see app/Http/Controllers/InventarioController.php:1141
 * @route '/api/inventario/ajuste'
 */
export const procesarAjusteTabla = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarAjusteTabla.url(options),
    method: 'post',
})

procesarAjusteTabla.definition = {
    methods: ["post"],
    url: '/api/inventario/ajuste',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::procesarAjusteTabla
 * @see app/Http/Controllers/InventarioController.php:1141
 * @route '/api/inventario/ajuste'
 */
procesarAjusteTabla.url = (options?: RouteQueryOptions) => {
    return procesarAjusteTabla.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::procesarAjusteTabla
 * @see app/Http/Controllers/InventarioController.php:1141
 * @route '/api/inventario/ajuste'
 */
procesarAjusteTabla.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarAjusteTabla.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::procesarAjusteTabla
 * @see app/Http/Controllers/InventarioController.php:1141
 * @route '/api/inventario/ajuste'
 */
    const procesarAjusteTablaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: procesarAjusteTabla.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::procesarAjusteTabla
 * @see app/Http/Controllers/InventarioController.php:1141
 * @route '/api/inventario/ajuste'
 */
        procesarAjusteTablaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: procesarAjusteTabla.url(options),
            method: 'post',
        })
    
    procesarAjusteTabla.form = procesarAjusteTablaForm
/**
* @see \App\Http\Controllers\InventarioController::buscarProductosAlmacen
 * @see app/Http/Controllers/InventarioController.php:3274
 * @route '/api/inventario/productos-almacen/{almacen_id}'
 */
export const buscarProductosAlmacen = (args: { almacen_id: string | number } | [almacen_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarProductosAlmacen.url(args, options),
    method: 'get',
})

buscarProductosAlmacen.definition = {
    methods: ["get","head"],
    url: '/api/inventario/productos-almacen/{almacen_id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::buscarProductosAlmacen
 * @see app/Http/Controllers/InventarioController.php:3274
 * @route '/api/inventario/productos-almacen/{almacen_id}'
 */
buscarProductosAlmacen.url = (args: { almacen_id: string | number } | [almacen_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { almacen_id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    almacen_id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        almacen_id: args.almacen_id,
                }

    return buscarProductosAlmacen.definition.url
            .replace('{almacen_id}', parsedArgs.almacen_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::buscarProductosAlmacen
 * @see app/Http/Controllers/InventarioController.php:3274
 * @route '/api/inventario/productos-almacen/{almacen_id}'
 */
buscarProductosAlmacen.get = (args: { almacen_id: string | number } | [almacen_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarProductosAlmacen.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::buscarProductosAlmacen
 * @see app/Http/Controllers/InventarioController.php:3274
 * @route '/api/inventario/productos-almacen/{almacen_id}'
 */
buscarProductosAlmacen.head = (args: { almacen_id: string | number } | [almacen_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarProductosAlmacen.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::buscarProductosAlmacen
 * @see app/Http/Controllers/InventarioController.php:3274
 * @route '/api/inventario/productos-almacen/{almacen_id}'
 */
    const buscarProductosAlmacenForm = (args: { almacen_id: string | number } | [almacen_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarProductosAlmacen.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::buscarProductosAlmacen
 * @see app/Http/Controllers/InventarioController.php:3274
 * @route '/api/inventario/productos-almacen/{almacen_id}'
 */
        buscarProductosAlmacenForm.get = (args: { almacen_id: string | number } | [almacen_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarProductosAlmacen.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::buscarProductosAlmacen
 * @see app/Http/Controllers/InventarioController.php:3274
 * @route '/api/inventario/productos-almacen/{almacen_id}'
 */
        buscarProductosAlmacenForm.head = (args: { almacen_id: string | number } | [almacen_id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarProductosAlmacen.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarProductosAlmacen.form = buscarProductosAlmacenForm
/**
* @see \App\Http\Controllers\InventarioController::crearStockProducto
 * @see app/Http/Controllers/InventarioController.php:3488
 * @route '/api/inventario/crear-stock-producto'
 */
export const crearStockProducto = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearStockProducto.url(options),
    method: 'post',
})

crearStockProducto.definition = {
    methods: ["post"],
    url: '/api/inventario/crear-stock-producto',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::crearStockProducto
 * @see app/Http/Controllers/InventarioController.php:3488
 * @route '/api/inventario/crear-stock-producto'
 */
crearStockProducto.url = (options?: RouteQueryOptions) => {
    return crearStockProducto.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::crearStockProducto
 * @see app/Http/Controllers/InventarioController.php:3488
 * @route '/api/inventario/crear-stock-producto'
 */
crearStockProducto.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearStockProducto.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::crearStockProducto
 * @see app/Http/Controllers/InventarioController.php:3488
 * @route '/api/inventario/crear-stock-producto'
 */
    const crearStockProductoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: crearStockProducto.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::crearStockProducto
 * @see app/Http/Controllers/InventarioController.php:3488
 * @route '/api/inventario/crear-stock-producto'
 */
        crearStockProductoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: crearStockProducto.url(options),
            method: 'post',
        })
    
    crearStockProducto.form = crearStockProductoForm
/**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:1321
 * @route '/api/inventario/movimientos'
 */
export const movimientosApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosApi.url(options),
    method: 'get',
})

movimientosApi.definition = {
    methods: ["get","head"],
    url: '/api/inventario/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:1321
 * @route '/api/inventario/movimientos'
 */
movimientosApi.url = (options?: RouteQueryOptions) => {
    return movimientosApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:1321
 * @route '/api/inventario/movimientos'
 */
movimientosApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:1321
 * @route '/api/inventario/movimientos'
 */
movimientosApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientosApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:1321
 * @route '/api/inventario/movimientos'
 */
    const movimientosApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: movimientosApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:1321
 * @route '/api/inventario/movimientos'
 */
        movimientosApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientosApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::movimientosApi
 * @see app/Http/Controllers/InventarioController.php:1321
 * @route '/api/inventario/movimientos'
 */
        movimientosApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientosApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    movimientosApi.form = movimientosApiForm
/**
* @see \App\Http\Controllers\InventarioController::movimientosParaImpresion
 * @see app/Http/Controllers/InventarioController.php:1351
 * @route '/api/inventario/movimientos-para-impresion'
 */
export const movimientosParaImpresion = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosParaImpresion.url(options),
    method: 'get',
})

movimientosParaImpresion.definition = {
    methods: ["get","head"],
    url: '/api/inventario/movimientos-para-impresion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::movimientosParaImpresion
 * @see app/Http/Controllers/InventarioController.php:1351
 * @route '/api/inventario/movimientos-para-impresion'
 */
movimientosParaImpresion.url = (options?: RouteQueryOptions) => {
    return movimientosParaImpresion.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::movimientosParaImpresion
 * @see app/Http/Controllers/InventarioController.php:1351
 * @route '/api/inventario/movimientos-para-impresion'
 */
movimientosParaImpresion.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientosParaImpresion.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::movimientosParaImpresion
 * @see app/Http/Controllers/InventarioController.php:1351
 * @route '/api/inventario/movimientos-para-impresion'
 */
movimientosParaImpresion.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientosParaImpresion.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::movimientosParaImpresion
 * @see app/Http/Controllers/InventarioController.php:1351
 * @route '/api/inventario/movimientos-para-impresion'
 */
    const movimientosParaImpresionForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: movimientosParaImpresion.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::movimientosParaImpresion
 * @see app/Http/Controllers/InventarioController.php:1351
 * @route '/api/inventario/movimientos-para-impresion'
 */
        movimientosParaImpresionForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientosParaImpresion.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::movimientosParaImpresion
 * @see app/Http/Controllers/InventarioController.php:1351
 * @route '/api/inventario/movimientos-para-impresion'
 */
        movimientosParaImpresionForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientosParaImpresion.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    movimientosParaImpresion.form = movimientosParaImpresionForm
/**
* @see \App\Http\Controllers\InventarioController::crearMovimiento
 * @see app/Http/Controllers/InventarioController.php:1394
 * @route '/api/inventario/movimientos'
 */
export const crearMovimiento = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearMovimiento.url(options),
    method: 'post',
})

crearMovimiento.definition = {
    methods: ["post"],
    url: '/api/inventario/movimientos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::crearMovimiento
 * @see app/Http/Controllers/InventarioController.php:1394
 * @route '/api/inventario/movimientos'
 */
crearMovimiento.url = (options?: RouteQueryOptions) => {
    return crearMovimiento.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::crearMovimiento
 * @see app/Http/Controllers/InventarioController.php:1394
 * @route '/api/inventario/movimientos'
 */
crearMovimiento.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearMovimiento.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::crearMovimiento
 * @see app/Http/Controllers/InventarioController.php:1394
 * @route '/api/inventario/movimientos'
 */
    const crearMovimientoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: crearMovimiento.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::crearMovimiento
 * @see app/Http/Controllers/InventarioController.php:1394
 * @route '/api/inventario/movimientos'
 */
        crearMovimientoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: crearMovimiento.url(options),
            method: 'post',
        })
    
    crearMovimiento.form = crearMovimientoForm
/**
* @see \App\Http\Controllers\InventarioController::estadisticasApi
 * @see app/Http/Controllers/InventarioController.php:2779
 * @route '/api/inventario/estadisticas'
 */
export const estadisticasApi = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasApi.url(options),
    method: 'get',
})

estadisticasApi.definition = {
    methods: ["get","head"],
    url: '/api/inventario/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::estadisticasApi
 * @see app/Http/Controllers/InventarioController.php:2779
 * @route '/api/inventario/estadisticas'
 */
estadisticasApi.url = (options?: RouteQueryOptions) => {
    return estadisticasApi.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::estadisticasApi
 * @see app/Http/Controllers/InventarioController.php:2779
 * @route '/api/inventario/estadisticas'
 */
estadisticasApi.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasApi.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::estadisticasApi
 * @see app/Http/Controllers/InventarioController.php:2779
 * @route '/api/inventario/estadisticas'
 */
estadisticasApi.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticasApi.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::estadisticasApi
 * @see app/Http/Controllers/InventarioController.php:2779
 * @route '/api/inventario/estadisticas'
 */
    const estadisticasApiForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticasApi.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::estadisticasApi
 * @see app/Http/Controllers/InventarioController.php:2779
 * @route '/api/inventario/estadisticas'
 */
        estadisticasApiForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticasApi.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::estadisticasApi
 * @see app/Http/Controllers/InventarioController.php:2779
 * @route '/api/inventario/estadisticas'
 */
        estadisticasApiForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticasApi.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticasApi.form = estadisticasApiForm
/**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
export const exportarExcel = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})

exportarExcel.definition = {
    methods: ["get","head"],
    url: '/stock/{stock}/exportar-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
exportarExcel.url = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return exportarExcel.definition.url
            .replace('{stock}', parsedArgs.stock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
exportarExcel.get = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
exportarExcel.head = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarExcel.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
    const exportarExcelForm = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarExcel.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
        exportarExcelForm.get = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarExcel.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::exportarExcel
 * @see app/Http/Controllers/InventarioController.php:2904
 * @route '/stock/{stock}/exportar-excel'
 */
        exportarExcelForm.head = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
export const exportarPdf = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})

exportarPdf.definition = {
    methods: ["get","head"],
    url: '/stock/{stock}/exportar-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
exportarPdf.url = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return exportarPdf.definition.url
            .replace('{stock}', parsedArgs.stock.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
exportarPdf.get = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
exportarPdf.head = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
    const exportarPdfForm = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
        exportarPdfForm.get = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::exportarPdf
 * @see app/Http/Controllers/InventarioController.php:2926
 * @route '/stock/{stock}/exportar-pdf'
 */
        exportarPdfForm.head = (args: { stock: number | { id: number } } | [stock: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarPdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportarPdf.form = exportarPdfForm
/**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
const dashboarda7d559eadbfce810b70b2659eca78e47 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboarda7d559eadbfce810b70b2659eca78e47.url(options),
    method: 'get',
})

dashboarda7d559eadbfce810b70b2659eca78e47.definition = {
    methods: ["get","head"],
    url: '/inventario',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
dashboarda7d559eadbfce810b70b2659eca78e47.url = (options?: RouteQueryOptions) => {
    return dashboarda7d559eadbfce810b70b2659eca78e47.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
dashboarda7d559eadbfce810b70b2659eca78e47.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboarda7d559eadbfce810b70b2659eca78e47.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
dashboarda7d559eadbfce810b70b2659eca78e47.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboarda7d559eadbfce810b70b2659eca78e47.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
    const dashboarda7d559eadbfce810b70b2659eca78e47Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboarda7d559eadbfce810b70b2659eca78e47.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
        dashboarda7d559eadbfce810b70b2659eca78e47Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboarda7d559eadbfce810b70b2659eca78e47.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario'
 */
        dashboarda7d559eadbfce810b70b2659eca78e47Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboarda7d559eadbfce810b70b2659eca78e47.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboarda7d559eadbfce810b70b2659eca78e47.form = dashboarda7d559eadbfce810b70b2659eca78e47Form
    /**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
const dashboardb28409eff5a40d1acfd198fc09449f6b = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardb28409eff5a40d1acfd198fc09449f6b.url(options),
    method: 'get',
})

dashboardb28409eff5a40d1acfd198fc09449f6b.definition = {
    methods: ["get","head"],
    url: '/inventario/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
dashboardb28409eff5a40d1acfd198fc09449f6b.url = (options?: RouteQueryOptions) => {
    return dashboardb28409eff5a40d1acfd198fc09449f6b.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
dashboardb28409eff5a40d1acfd198fc09449f6b.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardb28409eff5a40d1acfd198fc09449f6b.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
dashboardb28409eff5a40d1acfd198fc09449f6b.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboardb28409eff5a40d1acfd198fc09449f6b.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
    const dashboardb28409eff5a40d1acfd198fc09449f6bForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboardb28409eff5a40d1acfd198fc09449f6b.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
        dashboardb28409eff5a40d1acfd198fc09449f6bForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardb28409eff5a40d1acfd198fc09449f6b.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::dashboard
 * @see app/Http/Controllers/InventarioController.php:101
 * @route '/inventario/dashboard'
 */
        dashboardb28409eff5a40d1acfd198fc09449f6bForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardb28409eff5a40d1acfd198fc09449f6b.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboardb28409eff5a40d1acfd198fc09449f6b.form = dashboardb28409eff5a40d1acfd198fc09449f6bForm

export const dashboard = {
    '/inventario': dashboarda7d559eadbfce810b70b2659eca78e47,
    '/inventario/dashboard': dashboardb28409eff5a40d1acfd198fc09449f6b,
}

/**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
export const stockBajo = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockBajo.url(options),
    method: 'get',
})

stockBajo.definition = {
    methods: ["get","head"],
    url: '/inventario/stock-bajo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
stockBajo.url = (options?: RouteQueryOptions) => {
    return stockBajo.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
stockBajo.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stockBajo.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
stockBajo.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stockBajo.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
    const stockBajoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stockBajo.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
        stockBajoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockBajo.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::stockBajo
 * @see app/Http/Controllers/InventarioController.php:355
 * @route '/inventario/stock-bajo'
 */
        stockBajoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stockBajo.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stockBajo.form = stockBajoForm
/**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
export const proximosVencer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proximosVencer.url(options),
    method: 'get',
})

proximosVencer.definition = {
    methods: ["get","head"],
    url: '/inventario/proximos-vencer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
proximosVencer.url = (options?: RouteQueryOptions) => {
    return proximosVencer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
proximosVencer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proximosVencer.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
proximosVencer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proximosVencer.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
    const proximosVencerForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: proximosVencer.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
        proximosVencerForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proximosVencer.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::proximosVencer
 * @see app/Http/Controllers/InventarioController.php:417
 * @route '/inventario/proximos-vencer'
 */
        proximosVencerForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proximosVencer.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    proximosVencer.form = proximosVencerForm
/**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
export const vencidos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vencidos.url(options),
    method: 'get',
})

vencidos.definition = {
    methods: ["get","head"],
    url: '/inventario/vencidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
vencidos.url = (options?: RouteQueryOptions) => {
    return vencidos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
vencidos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: vencidos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
vencidos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: vencidos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
    const vencidosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: vencidos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
        vencidosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vencidos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::vencidos
 * @see app/Http/Controllers/InventarioController.php:476
 * @route '/inventario/vencidos'
 */
        vencidosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: vencidos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    vencidos.form = vencidosForm
/**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
export const movimientos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(options),
    method: 'get',
})

movimientos.definition = {
    methods: ["get","head"],
    url: '/inventario/movimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
movimientos.url = (options?: RouteQueryOptions) => {
    return movimientos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
movimientos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: movimientos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
movimientos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: movimientos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
    const movimientosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: movimientos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
        movimientosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::movimientos
 * @see app/Http/Controllers/InventarioController.php:530
 * @route '/inventario/movimientos'
 */
        movimientosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: movimientos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    movimientos.form = movimientosForm
/**
* @see \App\Http\Controllers\InventarioController::ajusteForm
 * @see app/Http/Controllers/InventarioController.php:919
 * @route '/inventario/ajuste'
 */
export const ajusteForm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ajusteForm.url(options),
    method: 'get',
})

ajusteForm.definition = {
    methods: ["get","head"],
    url: '/inventario/ajuste',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::ajusteForm
 * @see app/Http/Controllers/InventarioController.php:919
 * @route '/inventario/ajuste'
 */
ajusteForm.url = (options?: RouteQueryOptions) => {
    return ajusteForm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::ajusteForm
 * @see app/Http/Controllers/InventarioController.php:919
 * @route '/inventario/ajuste'
 */
ajusteForm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ajusteForm.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::ajusteForm
 * @see app/Http/Controllers/InventarioController.php:919
 * @route '/inventario/ajuste'
 */
ajusteForm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ajusteForm.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::ajusteForm
 * @see app/Http/Controllers/InventarioController.php:919
 * @route '/inventario/ajuste'
 */
    const ajusteFormForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ajusteForm.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::ajusteForm
 * @see app/Http/Controllers/InventarioController.php:919
 * @route '/inventario/ajuste'
 */
        ajusteFormForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ajusteForm.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::ajusteForm
 * @see app/Http/Controllers/InventarioController.php:919
 * @route '/inventario/ajuste'
 */
        ajusteFormForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ajusteForm.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ajusteForm.form = ajusteFormForm
/**
* @see \App\Http\Controllers\InventarioController::procesarAjuste
 * @see app/Http/Controllers/InventarioController.php:1086
 * @route '/inventario/ajuste'
 */
export const procesarAjuste = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarAjuste.url(options),
    method: 'post',
})

procesarAjuste.definition = {
    methods: ["post"],
    url: '/inventario/ajuste',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::procesarAjuste
 * @see app/Http/Controllers/InventarioController.php:1086
 * @route '/inventario/ajuste'
 */
procesarAjuste.url = (options?: RouteQueryOptions) => {
    return procesarAjuste.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::procesarAjuste
 * @see app/Http/Controllers/InventarioController.php:1086
 * @route '/inventario/ajuste'
 */
procesarAjuste.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarAjuste.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::procesarAjuste
 * @see app/Http/Controllers/InventarioController.php:1086
 * @route '/inventario/ajuste'
 */
    const procesarAjusteForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: procesarAjuste.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::procesarAjuste
 * @see app/Http/Controllers/InventarioController.php:1086
 * @route '/inventario/ajuste'
 */
        procesarAjusteForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: procesarAjuste.url(options),
            method: 'post',
        })
    
    procesarAjuste.form = procesarAjusteForm
/**
* @see \App\Http\Controllers\InventarioController::ajusteMasivoForm
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
export const ajusteMasivoForm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ajusteMasivoForm.url(options),
    method: 'get',
})

ajusteMasivoForm.definition = {
    methods: ["get","head"],
    url: '/inventario/ajuste-masivo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::ajusteMasivoForm
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
ajusteMasivoForm.url = (options?: RouteQueryOptions) => {
    return ajusteMasivoForm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::ajusteMasivoForm
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
ajusteMasivoForm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ajusteMasivoForm.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::ajusteMasivoForm
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
ajusteMasivoForm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ajusteMasivoForm.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::ajusteMasivoForm
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
    const ajusteMasivoFormForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ajusteMasivoForm.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::ajusteMasivoForm
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
        ajusteMasivoFormForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ajusteMasivoForm.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::ajusteMasivoForm
 * @see app/Http/Controllers/InventarioController.php:2423
 * @route '/inventario/ajuste-masivo'
 */
        ajusteMasivoFormForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ajusteMasivoForm.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ajusteMasivoForm.form = ajusteMasivoFormForm
/**
* @see \App\Http\Controllers\InventarioController::historialCargasForm
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
export const historialCargasForm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialCargasForm.url(options),
    method: 'get',
})

historialCargasForm.definition = {
    methods: ["get","head"],
    url: '/inventario/historial-cargas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::historialCargasForm
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
historialCargasForm.url = (options?: RouteQueryOptions) => {
    return historialCargasForm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::historialCargasForm
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
historialCargasForm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialCargasForm.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::historialCargasForm
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
historialCargasForm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historialCargasForm.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::historialCargasForm
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
    const historialCargasFormForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historialCargasForm.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::historialCargasForm
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
        historialCargasFormForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialCargasForm.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::historialCargasForm
 * @see app/Http/Controllers/InventarioController.php:2641
 * @route '/inventario/historial-cargas'
 */
        historialCargasFormForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialCargasForm.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historialCargasForm.form = historialCargasFormForm
/**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
export const reportes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})

reportes.definition = {
    methods: ["get","head"],
    url: '/inventario/reportes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
reportes.url = (options?: RouteQueryOptions) => {
    return reportes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
reportes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
reportes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
    const reportesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reportes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
        reportesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::reportes
 * @see app/Http/Controllers/InventarioController.php:1477
 * @route '/inventario/reportes'
 */
        reportesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reportes.form = reportesForm
/**
* @see \App\Http\Controllers\InventarioController::imprimirAjustes
 * @see app/Http/Controllers/InventarioController.php:3575
 * @route '/inventario/ajuste/imprimir'
 */
export const imprimirAjustes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirAjustes.url(options),
    method: 'get',
})

imprimirAjustes.definition = {
    methods: ["get","head"],
    url: '/inventario/ajuste/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::imprimirAjustes
 * @see app/Http/Controllers/InventarioController.php:3575
 * @route '/inventario/ajuste/imprimir'
 */
imprimirAjustes.url = (options?: RouteQueryOptions) => {
    return imprimirAjustes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::imprimirAjustes
 * @see app/Http/Controllers/InventarioController.php:3575
 * @route '/inventario/ajuste/imprimir'
 */
imprimirAjustes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirAjustes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::imprimirAjustes
 * @see app/Http/Controllers/InventarioController.php:3575
 * @route '/inventario/ajuste/imprimir'
 */
imprimirAjustes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirAjustes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::imprimirAjustes
 * @see app/Http/Controllers/InventarioController.php:3575
 * @route '/inventario/ajuste/imprimir'
 */
    const imprimirAjustesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirAjustes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::imprimirAjustes
 * @see app/Http/Controllers/InventarioController.php:3575
 * @route '/inventario/ajuste/imprimir'
 */
        imprimirAjustesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirAjustes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::imprimirAjustes
 * @see app/Http/Controllers/InventarioController.php:3575
 * @route '/inventario/ajuste/imprimir'
 */
        imprimirAjustesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirAjustes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirAjustes.form = imprimirAjustesForm
/**
* @see \App\Http\Controllers\InventarioController::mermaForm
 * @see app/Http/Controllers/InventarioController.php:989
 * @route '/inventario/merma'
 */
export const mermaForm = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mermaForm.url(options),
    method: 'get',
})

mermaForm.definition = {
    methods: ["get","head"],
    url: '/inventario/merma',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::mermaForm
 * @see app/Http/Controllers/InventarioController.php:989
 * @route '/inventario/merma'
 */
mermaForm.url = (options?: RouteQueryOptions) => {
    return mermaForm.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::mermaForm
 * @see app/Http/Controllers/InventarioController.php:989
 * @route '/inventario/merma'
 */
mermaForm.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mermaForm.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::mermaForm
 * @see app/Http/Controllers/InventarioController.php:989
 * @route '/inventario/merma'
 */
mermaForm.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mermaForm.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::mermaForm
 * @see app/Http/Controllers/InventarioController.php:989
 * @route '/inventario/merma'
 */
    const mermaFormForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: mermaForm.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::mermaForm
 * @see app/Http/Controllers/InventarioController.php:989
 * @route '/inventario/merma'
 */
        mermaFormForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mermaForm.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::mermaForm
 * @see app/Http/Controllers/InventarioController.php:989
 * @route '/inventario/merma'
 */
        mermaFormForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mermaForm.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    mermaForm.form = mermaFormForm
/**
* @see \App\Http\Controllers\InventarioController::transferencias
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
export const transferencias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transferencias.url(options),
    method: 'get',
})

transferencias.definition = {
    methods: ["get","head"],
    url: '/inventario/transferencias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::transferencias
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
transferencias.url = (options?: RouteQueryOptions) => {
    return transferencias.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::transferencias
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
transferencias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transferencias.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::transferencias
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
transferencias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transferencias.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::transferencias
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
    const transferenciasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: transferencias.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::transferencias
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
        transferenciasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: transferencias.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::transferencias
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
        transferenciasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: transferencias.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    transferencias.form = transferenciasForm
/**
* @see \App\Http\Controllers\InventarioController::formularioCrearTransferencia
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
export const formularioCrearTransferencia = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formularioCrearTransferencia.url(options),
    method: 'get',
})

formularioCrearTransferencia.definition = {
    methods: ["get","head"],
    url: '/inventario/transferencias/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::formularioCrearTransferencia
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
formularioCrearTransferencia.url = (options?: RouteQueryOptions) => {
    return formularioCrearTransferencia.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::formularioCrearTransferencia
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
formularioCrearTransferencia.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formularioCrearTransferencia.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::formularioCrearTransferencia
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
formularioCrearTransferencia.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: formularioCrearTransferencia.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::formularioCrearTransferencia
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
    const formularioCrearTransferenciaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: formularioCrearTransferencia.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::formularioCrearTransferencia
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
        formularioCrearTransferenciaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: formularioCrearTransferencia.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::formularioCrearTransferencia
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
        formularioCrearTransferenciaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: formularioCrearTransferencia.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    formularioCrearTransferencia.form = formularioCrearTransferenciaForm
/**
* @see \App\Http\Controllers\InventarioController::crearTransferencia
 * @see app/Http/Controllers/InventarioController.php:1535
 * @route '/inventario/transferencias/crear'
 */
export const crearTransferencia = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearTransferencia.url(options),
    method: 'post',
})

crearTransferencia.definition = {
    methods: ["post"],
    url: '/inventario/transferencias/crear',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::crearTransferencia
 * @see app/Http/Controllers/InventarioController.php:1535
 * @route '/inventario/transferencias/crear'
 */
crearTransferencia.url = (options?: RouteQueryOptions) => {
    return crearTransferencia.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::crearTransferencia
 * @see app/Http/Controllers/InventarioController.php:1535
 * @route '/inventario/transferencias/crear'
 */
crearTransferencia.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearTransferencia.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::crearTransferencia
 * @see app/Http/Controllers/InventarioController.php:1535
 * @route '/inventario/transferencias/crear'
 */
    const crearTransferenciaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: crearTransferencia.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::crearTransferencia
 * @see app/Http/Controllers/InventarioController.php:1535
 * @route '/inventario/transferencias/crear'
 */
        crearTransferenciaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: crearTransferencia.url(options),
            method: 'post',
        })
    
    crearTransferencia.form = crearTransferenciaForm
/**
* @see \App\Http\Controllers\InventarioController::verTransferencia
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
export const verTransferencia = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verTransferencia.url(args, options),
    method: 'get',
})

verTransferencia.definition = {
    methods: ["get","head"],
    url: '/inventario/transferencias/{transferencia}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::verTransferencia
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
verTransferencia.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transferencia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transferencia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transferencia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transferencia: typeof args.transferencia === 'object'
                ? args.transferencia.id
                : args.transferencia,
                }

    return verTransferencia.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::verTransferencia
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
verTransferencia.get = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verTransferencia.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::verTransferencia
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
verTransferencia.head = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verTransferencia.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::verTransferencia
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
    const verTransferenciaForm = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verTransferencia.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::verTransferencia
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
        verTransferenciaForm.get = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verTransferencia.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::verTransferencia
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
        verTransferenciaForm.head = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verTransferencia.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    verTransferencia.form = verTransferenciaForm
/**
* @see \App\Http\Controllers\InventarioController::editarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
export const editarTransferencia = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editarTransferencia.url(args, options),
    method: 'get',
})

editarTransferencia.definition = {
    methods: ["get","head"],
    url: '/inventario/transferencias/{transferencia}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::editarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
editarTransferencia.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transferencia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transferencia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transferencia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transferencia: typeof args.transferencia === 'object'
                ? args.transferencia.id
                : args.transferencia,
                }

    return editarTransferencia.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::editarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
editarTransferencia.get = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: editarTransferencia.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::editarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
editarTransferencia.head = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: editarTransferencia.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::editarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
    const editarTransferenciaForm = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: editarTransferencia.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::editarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
        editarTransferenciaForm.get = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editarTransferencia.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::editarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
        editarTransferenciaForm.head = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: editarTransferencia.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    editarTransferencia.form = editarTransferenciaForm
/**
* @see \App\Http\Controllers\InventarioController::actualizarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1998
 * @route '/inventario/transferencias/{transferencia}'
 */
export const actualizarTransferencia = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarTransferencia.url(args, options),
    method: 'put',
})

actualizarTransferencia.definition = {
    methods: ["put"],
    url: '/inventario/transferencias/{transferencia}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\InventarioController::actualizarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1998
 * @route '/inventario/transferencias/{transferencia}'
 */
actualizarTransferencia.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transferencia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transferencia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transferencia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transferencia: typeof args.transferencia === 'object'
                ? args.transferencia.id
                : args.transferencia,
                }

    return actualizarTransferencia.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::actualizarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1998
 * @route '/inventario/transferencias/{transferencia}'
 */
actualizarTransferencia.put = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarTransferencia.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\InventarioController::actualizarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1998
 * @route '/inventario/transferencias/{transferencia}'
 */
    const actualizarTransferenciaForm = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarTransferencia.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::actualizarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1998
 * @route '/inventario/transferencias/{transferencia}'
 */
        actualizarTransferenciaForm.put = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarTransferencia.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarTransferencia.form = actualizarTransferenciaForm
/**
* @see \App\Http\Controllers\InventarioController::enviarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1769
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
export const enviarTransferencia = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviarTransferencia.url(args, options),
    method: 'post',
})

enviarTransferencia.definition = {
    methods: ["post"],
    url: '/inventario/transferencias/{transferencia}/enviar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::enviarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1769
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
enviarTransferencia.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transferencia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transferencia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transferencia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transferencia: typeof args.transferencia === 'object'
                ? args.transferencia.id
                : args.transferencia,
                }

    return enviarTransferencia.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::enviarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1769
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
enviarTransferencia.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviarTransferencia.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::enviarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1769
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
    const enviarTransferenciaForm = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: enviarTransferencia.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::enviarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1769
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
        enviarTransferenciaForm.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: enviarTransferencia.url(args, options),
            method: 'post',
        })
    
    enviarTransferencia.form = enviarTransferenciaForm
/**
* @see \App\Http\Controllers\InventarioController::recibirTransferencia
 * @see app/Http/Controllers/InventarioController.php:1790
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
export const recibirTransferencia = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recibirTransferencia.url(args, options),
    method: 'post',
})

recibirTransferencia.definition = {
    methods: ["post"],
    url: '/inventario/transferencias/{transferencia}/recibir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::recibirTransferencia
 * @see app/Http/Controllers/InventarioController.php:1790
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
recibirTransferencia.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transferencia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transferencia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transferencia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transferencia: typeof args.transferencia === 'object'
                ? args.transferencia.id
                : args.transferencia,
                }

    return recibirTransferencia.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::recibirTransferencia
 * @see app/Http/Controllers/InventarioController.php:1790
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
recibirTransferencia.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recibirTransferencia.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::recibirTransferencia
 * @see app/Http/Controllers/InventarioController.php:1790
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
    const recibirTransferenciaForm = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: recibirTransferencia.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::recibirTransferencia
 * @see app/Http/Controllers/InventarioController.php:1790
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
        recibirTransferenciaForm.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: recibirTransferencia.url(args, options),
            method: 'post',
        })
    
    recibirTransferencia.form = recibirTransferenciaForm
/**
* @see \App\Http\Controllers\InventarioController::cancelarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1811
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
export const cancelarTransferencia = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelarTransferencia.url(args, options),
    method: 'post',
})

cancelarTransferencia.definition = {
    methods: ["post"],
    url: '/inventario/transferencias/{transferencia}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::cancelarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1811
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
cancelarTransferencia.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { transferencia: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { transferencia: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    transferencia: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        transferencia: typeof args.transferencia === 'object'
                ? args.transferencia.id
                : args.transferencia,
                }

    return cancelarTransferencia.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::cancelarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1811
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
cancelarTransferencia.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelarTransferencia.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::cancelarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1811
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
    const cancelarTransferenciaForm = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelarTransferencia.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::cancelarTransferencia
 * @see app/Http/Controllers/InventarioController.php:1811
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
        cancelarTransferenciaForm.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelarTransferencia.url(args, options),
            method: 'post',
        })
    
    cancelarTransferencia.form = cancelarTransferenciaForm
/**
* @see \App\Http\Controllers\InventarioController::mermas
 * @see app/Http/Controllers/InventarioController.php:1836
 * @route '/inventario/mermas'
 */
export const mermas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mermas.url(options),
    method: 'get',
})

mermas.definition = {
    methods: ["get","head"],
    url: '/inventario/mermas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::mermas
 * @see app/Http/Controllers/InventarioController.php:1836
 * @route '/inventario/mermas'
 */
mermas.url = (options?: RouteQueryOptions) => {
    return mermas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::mermas
 * @see app/Http/Controllers/InventarioController.php:1836
 * @route '/inventario/mermas'
 */
mermas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mermas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::mermas
 * @see app/Http/Controllers/InventarioController.php:1836
 * @route '/inventario/mermas'
 */
mermas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mermas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::mermas
 * @see app/Http/Controllers/InventarioController.php:1836
 * @route '/inventario/mermas'
 */
    const mermasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: mermas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::mermas
 * @see app/Http/Controllers/InventarioController.php:1836
 * @route '/inventario/mermas'
 */
        mermasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mermas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::mermas
 * @see app/Http/Controllers/InventarioController.php:1836
 * @route '/inventario/mermas'
 */
        mermasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: mermas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    mermas.form = mermasForm
/**
* @see \App\Http\Controllers\InventarioController::formularioRegistrarMerma
 * @see app/Http/Controllers/InventarioController.php:1941
 * @route '/inventario/mermas/registrar'
 */
export const formularioRegistrarMerma = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formularioRegistrarMerma.url(options),
    method: 'get',
})

formularioRegistrarMerma.definition = {
    methods: ["get","head"],
    url: '/inventario/mermas/registrar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::formularioRegistrarMerma
 * @see app/Http/Controllers/InventarioController.php:1941
 * @route '/inventario/mermas/registrar'
 */
formularioRegistrarMerma.url = (options?: RouteQueryOptions) => {
    return formularioRegistrarMerma.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::formularioRegistrarMerma
 * @see app/Http/Controllers/InventarioController.php:1941
 * @route '/inventario/mermas/registrar'
 */
formularioRegistrarMerma.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formularioRegistrarMerma.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::formularioRegistrarMerma
 * @see app/Http/Controllers/InventarioController.php:1941
 * @route '/inventario/mermas/registrar'
 */
formularioRegistrarMerma.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: formularioRegistrarMerma.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::formularioRegistrarMerma
 * @see app/Http/Controllers/InventarioController.php:1941
 * @route '/inventario/mermas/registrar'
 */
    const formularioRegistrarMermaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: formularioRegistrarMerma.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::formularioRegistrarMerma
 * @see app/Http/Controllers/InventarioController.php:1941
 * @route '/inventario/mermas/registrar'
 */
        formularioRegistrarMermaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: formularioRegistrarMerma.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::formularioRegistrarMerma
 * @see app/Http/Controllers/InventarioController.php:1941
 * @route '/inventario/mermas/registrar'
 */
        formularioRegistrarMermaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: formularioRegistrarMerma.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    formularioRegistrarMerma.form = formularioRegistrarMermaForm
/**
* @see \App\Http\Controllers\InventarioController::registrarMerma
 * @see app/Http/Controllers/InventarioController.php:1590
 * @route '/inventario/mermas/registrar'
 */
export const registrarMerma = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarMerma.url(options),
    method: 'post',
})

registrarMerma.definition = {
    methods: ["post"],
    url: '/inventario/mermas/registrar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::registrarMerma
 * @see app/Http/Controllers/InventarioController.php:1590
 * @route '/inventario/mermas/registrar'
 */
registrarMerma.url = (options?: RouteQueryOptions) => {
    return registrarMerma.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::registrarMerma
 * @see app/Http/Controllers/InventarioController.php:1590
 * @route '/inventario/mermas/registrar'
 */
registrarMerma.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarMerma.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::registrarMerma
 * @see app/Http/Controllers/InventarioController.php:1590
 * @route '/inventario/mermas/registrar'
 */
    const registrarMermaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarMerma.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::registrarMerma
 * @see app/Http/Controllers/InventarioController.php:1590
 * @route '/inventario/mermas/registrar'
 */
        registrarMermaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarMerma.url(options),
            method: 'post',
        })
    
    registrarMerma.form = registrarMermaForm
/**
* @see \App\Http\Controllers\InventarioController::verMerma
 * @see app/Http/Controllers/InventarioController.php:2180
 * @route '/inventario/mermas/{merma}'
 */
export const verMerma = (args: { merma: number | { id: number } } | [merma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verMerma.url(args, options),
    method: 'get',
})

verMerma.definition = {
    methods: ["get","head"],
    url: '/inventario/mermas/{merma}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::verMerma
 * @see app/Http/Controllers/InventarioController.php:2180
 * @route '/inventario/mermas/{merma}'
 */
verMerma.url = (args: { merma: number | { id: number } } | [merma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { merma: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { merma: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    merma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        merma: typeof args.merma === 'object'
                ? args.merma.id
                : args.merma,
                }

    return verMerma.definition.url
            .replace('{merma}', parsedArgs.merma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::verMerma
 * @see app/Http/Controllers/InventarioController.php:2180
 * @route '/inventario/mermas/{merma}'
 */
verMerma.get = (args: { merma: number | { id: number } } | [merma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verMerma.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::verMerma
 * @see app/Http/Controllers/InventarioController.php:2180
 * @route '/inventario/mermas/{merma}'
 */
verMerma.head = (args: { merma: number | { id: number } } | [merma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verMerma.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::verMerma
 * @see app/Http/Controllers/InventarioController.php:2180
 * @route '/inventario/mermas/{merma}'
 */
    const verMermaForm = (args: { merma: number | { id: number } } | [merma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: verMerma.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::verMerma
 * @see app/Http/Controllers/InventarioController.php:2180
 * @route '/inventario/mermas/{merma}'
 */
        verMermaForm.get = (args: { merma: number | { id: number } } | [merma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verMerma.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::verMerma
 * @see app/Http/Controllers/InventarioController.php:2180
 * @route '/inventario/mermas/{merma}'
 */
        verMermaForm.head = (args: { merma: number | { id: number } } | [merma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: verMerma.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    verMerma.form = verMermaForm
/**
* @see \App\Http\Controllers\InventarioController::aprobarMerma
 * @see app/Http/Controllers/InventarioController.php:2328
 * @route '/inventario/mermas/{merma}/aprobar'
 */
export const aprobarMerma = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobarMerma.url(args, options),
    method: 'post',
})

aprobarMerma.definition = {
    methods: ["post"],
    url: '/inventario/mermas/{merma}/aprobar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::aprobarMerma
 * @see app/Http/Controllers/InventarioController.php:2328
 * @route '/inventario/mermas/{merma}/aprobar'
 */
aprobarMerma.url = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { merma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    merma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        merma: args.merma,
                }

    return aprobarMerma.definition.url
            .replace('{merma}', parsedArgs.merma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::aprobarMerma
 * @see app/Http/Controllers/InventarioController.php:2328
 * @route '/inventario/mermas/{merma}/aprobar'
 */
aprobarMerma.post = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobarMerma.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::aprobarMerma
 * @see app/Http/Controllers/InventarioController.php:2328
 * @route '/inventario/mermas/{merma}/aprobar'
 */
    const aprobarMermaForm = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: aprobarMerma.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::aprobarMerma
 * @see app/Http/Controllers/InventarioController.php:2328
 * @route '/inventario/mermas/{merma}/aprobar'
 */
        aprobarMermaForm.post = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: aprobarMerma.url(args, options),
            method: 'post',
        })
    
    aprobarMerma.form = aprobarMermaForm
/**
* @see \App\Http\Controllers\InventarioController::rechazarMerma
 * @see app/Http/Controllers/InventarioController.php:2378
 * @route '/inventario/mermas/{merma}/rechazar'
 */
export const rechazarMerma = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazarMerma.url(args, options),
    method: 'post',
})

rechazarMerma.definition = {
    methods: ["post"],
    url: '/inventario/mermas/{merma}/rechazar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::rechazarMerma
 * @see app/Http/Controllers/InventarioController.php:2378
 * @route '/inventario/mermas/{merma}/rechazar'
 */
rechazarMerma.url = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { merma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    merma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        merma: args.merma,
                }

    return rechazarMerma.definition.url
            .replace('{merma}', parsedArgs.merma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::rechazarMerma
 * @see app/Http/Controllers/InventarioController.php:2378
 * @route '/inventario/mermas/{merma}/rechazar'
 */
rechazarMerma.post = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazarMerma.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::rechazarMerma
 * @see app/Http/Controllers/InventarioController.php:2378
 * @route '/inventario/mermas/{merma}/rechazar'
 */
    const rechazarMermaForm = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rechazarMerma.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::rechazarMerma
 * @see app/Http/Controllers/InventarioController.php:2378
 * @route '/inventario/mermas/{merma}/rechazar'
 */
        rechazarMermaForm.post = (args: { merma: string | number } | [merma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rechazarMerma.url(args, options),
            method: 'post',
        })
    
    rechazarMerma.form = rechazarMermaForm
/**
* @see \App\Http\Controllers\InventarioController::imprimirMerma
 * @see app/Http/Controllers/InventarioController.php:3958
 * @route '/inventario/mermas/{id}/imprimir'
 */
export const imprimirMerma = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirMerma.url(args, options),
    method: 'get',
})

imprimirMerma.definition = {
    methods: ["get","head"],
    url: '/inventario/mermas/{id}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::imprimirMerma
 * @see app/Http/Controllers/InventarioController.php:3958
 * @route '/inventario/mermas/{id}/imprimir'
 */
imprimirMerma.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return imprimirMerma.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::imprimirMerma
 * @see app/Http/Controllers/InventarioController.php:3958
 * @route '/inventario/mermas/{id}/imprimir'
 */
imprimirMerma.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirMerma.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::imprimirMerma
 * @see app/Http/Controllers/InventarioController.php:3958
 * @route '/inventario/mermas/{id}/imprimir'
 */
imprimirMerma.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirMerma.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::imprimirMerma
 * @see app/Http/Controllers/InventarioController.php:3958
 * @route '/inventario/mermas/{id}/imprimir'
 */
    const imprimirMermaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirMerma.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::imprimirMerma
 * @see app/Http/Controllers/InventarioController.php:3958
 * @route '/inventario/mermas/{id}/imprimir'
 */
        imprimirMermaForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirMerma.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::imprimirMerma
 * @see app/Http/Controllers/InventarioController.php:3958
 * @route '/inventario/mermas/{id}/imprimir'
 */
        imprimirMermaForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirMerma.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirMerma.form = imprimirMermaForm
const InventarioController = { importarAjustesMasivos, listarCargosCsv, obtenerDetalleCargo, revertirCargo, prepararImpresionAjustes, anularAjuste, buscarProductos, stockProducto, apiStockFiltrado, apiLotes, procesarAjusteApi, procesarAjusteTabla, buscarProductosAlmacen, crearStockProducto, movimientosApi, movimientosParaImpresion, crearMovimiento, estadisticasApi, exportarExcel, exportarPdf, dashboard, stockBajo, proximosVencer, vencidos, movimientos, ajusteForm, procesarAjuste, ajusteMasivoForm, historialCargasForm, reportes, imprimirAjustes, mermaForm, transferencias, formularioCrearTransferencia, crearTransferencia, verTransferencia, editarTransferencia, actualizarTransferencia, enviarTransferencia, recibirTransferencia, cancelarTransferencia, mermas, formularioRegistrarMerma, registrarMerma, verMerma, aprobarMerma, rechazarMerma, imprimirMerma }

export default InventarioController