import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
import logistica from './logistica'
import reporteProductosVendidos from './reporte-productos-vendidos'
import reportes from './reportes'
import cuentasPorCobrar from './cuentas-por-cobrar'
import stock from './stock'
import detalles from './detalles'
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
export const entregas = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregas.url(args, options),
    method: 'get',
})

entregas.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/entregas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
entregas.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return entregas.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
entregas.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
entregas.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
    const entregasForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: entregas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
        entregasForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\VentaLogisticaController::entregas
 * @see app/Http/Controllers/Api/VentaLogisticaController.php:71
 * @route '/api/ventas/{venta}/entregas'
 */
        entregasForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    entregas.form = entregasForm
/**
* @see \App\Http\Controllers\VentaController::checkCajaAbierta
 * @see app/Http/Controllers/VentaController.php:447
 * @route '/ventas/check-caja-abierta'
 */
export const checkCajaAbierta = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkCajaAbierta.url(options),
    method: 'get',
})

checkCajaAbierta.definition = {
    methods: ["get","head"],
    url: '/ventas/check-caja-abierta',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::checkCajaAbierta
 * @see app/Http/Controllers/VentaController.php:447
 * @route '/ventas/check-caja-abierta'
 */
checkCajaAbierta.url = (options?: RouteQueryOptions) => {
    return checkCajaAbierta.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::checkCajaAbierta
 * @see app/Http/Controllers/VentaController.php:447
 * @route '/ventas/check-caja-abierta'
 */
checkCajaAbierta.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkCajaAbierta.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::checkCajaAbierta
 * @see app/Http/Controllers/VentaController.php:447
 * @route '/ventas/check-caja-abierta'
 */
checkCajaAbierta.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkCajaAbierta.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::checkCajaAbierta
 * @see app/Http/Controllers/VentaController.php:447
 * @route '/ventas/check-caja-abierta'
 */
    const checkCajaAbiertaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: checkCajaAbierta.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::checkCajaAbierta
 * @see app/Http/Controllers/VentaController.php:447
 * @route '/ventas/check-caja-abierta'
 */
        checkCajaAbiertaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkCajaAbierta.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::checkCajaAbierta
 * @see app/Http/Controllers/VentaController.php:447
 * @route '/ventas/check-caja-abierta'
 */
        checkCajaAbiertaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: checkCajaAbierta.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    checkCajaAbierta.form = checkCajaAbiertaForm
/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/ventas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/ventas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/ventas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/ventas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/ventas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/ventas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/ventas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:95
 * @route '/ventas'
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
* @see \App\Http\Controllers\VentaController::create
 * @see app/Http/Controllers/VentaController.php:378
 * @route '/ventas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/ventas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::create
 * @see app/Http/Controllers/VentaController.php:378
 * @route '/ventas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::create
 * @see app/Http/Controllers/VentaController.php:378
 * @route '/ventas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::create
 * @see app/Http/Controllers/VentaController.php:378
 * @route '/ventas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::create
 * @see app/Http/Controllers/VentaController.php:378
 * @route '/ventas/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::create
 * @see app/Http/Controllers/VentaController.php:378
 * @route '/ventas/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::create
 * @see app/Http/Controllers/VentaController.php:378
 * @route '/ventas/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:524
 * @route '/ventas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/ventas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:524
 * @route '/ventas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:524
 * @route '/ventas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:524
 * @route '/ventas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:524
 * @route '/ventas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\VentaController::edit
 * @see app/Http/Controllers/VentaController.php:697
 * @route '/ventas/{venta}/edit'
 */
export const edit = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::edit
 * @see app/Http/Controllers/VentaController.php:697
 * @route '/ventas/{venta}/edit'
 */
edit.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return edit.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::edit
 * @see app/Http/Controllers/VentaController.php:697
 * @route '/ventas/{venta}/edit'
 */
edit.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::edit
 * @see app/Http/Controllers/VentaController.php:697
 * @route '/ventas/{venta}/edit'
 */
edit.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::edit
 * @see app/Http/Controllers/VentaController.php:697
 * @route '/ventas/{venta}/edit'
 */
    const editForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::edit
 * @see app/Http/Controllers/VentaController.php:697
 * @route '/ventas/{venta}/edit'
 */
        editForm.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::edit
 * @see app/Http/Controllers/VentaController.php:697
 * @route '/ventas/{venta}/edit'
 */
        editForm.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/ventas/{venta}'
 */
export const update = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/ventas/{venta}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/ventas/{venta}'
 */
update.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return update.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/ventas/{venta}'
 */
update.put = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/ventas/{venta}'
 */
update.patch = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/ventas/{venta}'
 */
    const updateForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/ventas/{venta}'
 */
        updateForm.put = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:725
 * @route '/ventas/{venta}'
 */
        updateForm.patch = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:758
 * @route '/ventas/{venta}'
 */
export const destroy = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/ventas/{venta}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:758
 * @route '/ventas/{venta}'
 */
destroy.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return destroy.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:758
 * @route '/ventas/{venta}'
 */
destroy.delete = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:758
 * @route '/ventas/{venta}'
 */
    const destroyForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:758
 * @route '/ventas/{venta}'
 */
        destroyForm.delete = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\ReporteVentasController::reporteProductosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
export const reporteProductosVendidos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteProductosVendidos.url(options),
    method: 'get',
})

reporteProductosVendidos.definition = {
    methods: ["get","head"],
    url: '/ventas/reporte-productos-vendidos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReporteVentasController::reporteProductosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
reporteProductosVendidos.url = (options?: RouteQueryOptions) => {
    return reporteProductosVendidos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReporteVentasController::reporteProductosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
reporteProductosVendidos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reporteProductosVendidos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ReporteVentasController::reporteProductosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
reporteProductosVendidos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reporteProductosVendidos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ReporteVentasController::reporteProductosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
    const reporteProductosVendidosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reporteProductosVendidos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ReporteVentasController::reporteProductosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
        reporteProductosVendidosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteProductosVendidos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ReporteVentasController::reporteProductosVendidos
 * @see app/Http/Controllers/ReporteVentasController.php:21
 * @route '/ventas/reporte-productos-vendidos'
 */
        reporteProductosVendidosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reporteProductosVendidos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reporteProductosVendidos.form = reporteProductosVendidosForm
/**
* @see \App\Http\Controllers\VentaController::formatosDisponibles
 * @see app/Http/Controllers/VentaController.php:1507
 * @route '/ventas/formatos-disponibles'
 */
export const formatosDisponibles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formatosDisponibles.url(options),
    method: 'get',
})

formatosDisponibles.definition = {
    methods: ["get","head"],
    url: '/ventas/formatos-disponibles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::formatosDisponibles
 * @see app/Http/Controllers/VentaController.php:1507
 * @route '/ventas/formatos-disponibles'
 */
formatosDisponibles.url = (options?: RouteQueryOptions) => {
    return formatosDisponibles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::formatosDisponibles
 * @see app/Http/Controllers/VentaController.php:1507
 * @route '/ventas/formatos-disponibles'
 */
formatosDisponibles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formatosDisponibles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::formatosDisponibles
 * @see app/Http/Controllers/VentaController.php:1507
 * @route '/ventas/formatos-disponibles'
 */
formatosDisponibles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: formatosDisponibles.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::formatosDisponibles
 * @see app/Http/Controllers/VentaController.php:1507
 * @route '/ventas/formatos-disponibles'
 */
    const formatosDisponiblesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: formatosDisponibles.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::formatosDisponibles
 * @see app/Http/Controllers/VentaController.php:1507
 * @route '/ventas/formatos-disponibles'
 */
        formatosDisponiblesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: formatosDisponibles.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::formatosDisponibles
 * @see app/Http/Controllers/VentaController.php:1507
 * @route '/ventas/formatos-disponibles'
 */
        formatosDisponiblesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: formatosDisponibles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    formatosDisponibles.form = formatosDisponiblesForm
/**
* @see \App\Http\Controllers\VentaController::anular
 * @see app/Http/Controllers/VentaController.php:784
 * @route '/ventas/{venta}/anular'
 */
export const anular = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anular.url(args, options),
    method: 'post',
})

anular.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::anular
 * @see app/Http/Controllers/VentaController.php:784
 * @route '/ventas/{venta}/anular'
 */
anular.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return anular.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::anular
 * @see app/Http/Controllers/VentaController.php:784
 * @route '/ventas/{venta}/anular'
 */
anular.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anular.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::anular
 * @see app/Http/Controllers/VentaController.php:784
 * @route '/ventas/{venta}/anular'
 */
    const anularForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: anular.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::anular
 * @see app/Http/Controllers/VentaController.php:784
 * @route '/ventas/{venta}/anular'
 */
        anularForm.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: anular.url(args, options),
            method: 'post',
        })
    
    anular.form = anularForm
/**
* @see \App\Http\Controllers\VentaController::aprobar
 * @see app/Http/Controllers/VentaController.php:1062
 * @route '/ventas/{venta}/aprobar'
 */
export const aprobar = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

aprobar.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/aprobar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::aprobar
 * @see app/Http/Controllers/VentaController.php:1062
 * @route '/ventas/{venta}/aprobar'
 */
aprobar.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return aprobar.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::aprobar
 * @see app/Http/Controllers/VentaController.php:1062
 * @route '/ventas/{venta}/aprobar'
 */
aprobar.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::aprobar
 * @see app/Http/Controllers/VentaController.php:1062
 * @route '/ventas/{venta}/aprobar'
 */
    const aprobarForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: aprobar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::aprobar
 * @see app/Http/Controllers/VentaController.php:1062
 * @route '/ventas/{venta}/aprobar'
 */
        aprobarForm.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: aprobar.url(args, options),
            method: 'post',
        })
    
    aprobar.form = aprobarForm
/**
* @see \App\Http\Controllers\VentaController::rechazar
 * @see app/Http/Controllers/VentaController.php:1089
 * @route '/ventas/{venta}/rechazar'
 */
export const rechazar = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

rechazar.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/rechazar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::rechazar
 * @see app/Http/Controllers/VentaController.php:1089
 * @route '/ventas/{venta}/rechazar'
 */
rechazar.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return rechazar.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::rechazar
 * @see app/Http/Controllers/VentaController.php:1089
 * @route '/ventas/{venta}/rechazar'
 */
rechazar.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::rechazar
 * @see app/Http/Controllers/VentaController.php:1089
 * @route '/ventas/{venta}/rechazar'
 */
    const rechazarForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rechazar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::rechazar
 * @see app/Http/Controllers/VentaController.php:1089
 * @route '/ventas/{venta}/rechazar'
 */
        rechazarForm.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rechazar.url(args, options),
            method: 'post',
        })
    
    rechazar.form = rechazarForm
/**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1112
 * @route '/ventas/{venta}/registrar-pago'
 */
export const registrarPago = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago.url(args, options),
    method: 'post',
})

registrarPago.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/registrar-pago',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1112
 * @route '/ventas/{venta}/registrar-pago'
 */
registrarPago.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return registrarPago.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1112
 * @route '/ventas/{venta}/registrar-pago'
 */
registrarPago.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1112
 * @route '/ventas/{venta}/registrar-pago'
 */
    const registrarPagoForm = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarPago.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1112
 * @route '/ventas/{venta}/registrar-pago'
 */
        registrarPagoForm.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarPago.url(args, options),
            method: 'post',
        })
    
    registrarPago.form = registrarPagoForm
/**
* @see \App\Http\Controllers\VentaController::imprimirVenta
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/ventas/{venta}/imprimir'
 */
export const imprimirVenta = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirVenta.url(args, options),
    method: 'get',
})

imprimirVenta.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::imprimirVenta
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/ventas/{venta}/imprimir'
 */
imprimirVenta.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return imprimirVenta.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::imprimirVenta
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/ventas/{venta}/imprimir'
 */
imprimirVenta.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirVenta.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::imprimirVenta
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/ventas/{venta}/imprimir'
 */
imprimirVenta.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirVenta.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::imprimirVenta
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/ventas/{venta}/imprimir'
 */
    const imprimirVentaForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirVenta.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::imprimirVenta
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/ventas/{venta}/imprimir'
 */
        imprimirVentaForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirVenta.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::imprimirVenta
 * @see app/Http/Controllers/VentaController.php:1343
 * @route '/ventas/{venta}/imprimir'
 */
        imprimirVentaForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirVenta.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirVenta.form = imprimirVentaForm
/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/ventas/{venta}/preview'
 */
export const preview = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/ventas/{venta}/preview'
 */
preview.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return preview.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/ventas/{venta}/preview'
 */
preview.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/ventas/{venta}/preview'
 */
preview.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/ventas/{venta}/preview'
 */
    const previewForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/ventas/{venta}/preview'
 */
        previewForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1426
 * @route '/ventas/{venta}/preview'
 */
        previewForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\VentaController::exportarExcel
 * @see app/Http/Controllers/VentaController.php:1531
 * @route '/ventas/{venta}/exportar-excel'
 */
export const exportarExcel = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})

exportarExcel.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/exportar-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::exportarExcel
 * @see app/Http/Controllers/VentaController.php:1531
 * @route '/ventas/{venta}/exportar-excel'
 */
exportarExcel.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return exportarExcel.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::exportarExcel
 * @see app/Http/Controllers/VentaController.php:1531
 * @route '/ventas/{venta}/exportar-excel'
 */
exportarExcel.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::exportarExcel
 * @see app/Http/Controllers/VentaController.php:1531
 * @route '/ventas/{venta}/exportar-excel'
 */
exportarExcel.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarExcel.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::exportarExcel
 * @see app/Http/Controllers/VentaController.php:1531
 * @route '/ventas/{venta}/exportar-excel'
 */
    const exportarExcelForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarExcel.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::exportarExcel
 * @see app/Http/Controllers/VentaController.php:1531
 * @route '/ventas/{venta}/exportar-excel'
 */
        exportarExcelForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarExcel.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::exportarExcel
 * @see app/Http/Controllers/VentaController.php:1531
 * @route '/ventas/{venta}/exportar-excel'
 */
        exportarExcelForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\VentaController::exportarPdf
 * @see app/Http/Controllers/VentaController.php:1567
 * @route '/ventas/{venta}/exportar-pdf'
 */
export const exportarPdf = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})

exportarPdf.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/exportar-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::exportarPdf
 * @see app/Http/Controllers/VentaController.php:1567
 * @route '/ventas/{venta}/exportar-pdf'
 */
exportarPdf.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return exportarPdf.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::exportarPdf
 * @see app/Http/Controllers/VentaController.php:1567
 * @route '/ventas/{venta}/exportar-pdf'
 */
exportarPdf.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::exportarPdf
 * @see app/Http/Controllers/VentaController.php:1567
 * @route '/ventas/{venta}/exportar-pdf'
 */
exportarPdf.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarPdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::exportarPdf
 * @see app/Http/Controllers/VentaController.php:1567
 * @route '/ventas/{venta}/exportar-pdf'
 */
    const exportarPdfForm = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportarPdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::exportarPdf
 * @see app/Http/Controllers/VentaController.php:1567
 * @route '/ventas/{venta}/exportar-pdf'
 */
        exportarPdfForm.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportarPdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::exportarPdf
 * @see app/Http/Controllers/VentaController.php:1567
 * @route '/ventas/{venta}/exportar-pdf'
 */
        exportarPdfForm.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/ventas/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/ventas/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/ventas/{id}'
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
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/ventas/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/ventas/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/ventas/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/ventas/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:666
 * @route '/ventas/{id}'
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
/**
* @see \App\Http\Controllers\ImpresionVentasController::imprimir
 * @see app/Http/Controllers/ImpresionVentasController.php:58
 * @route '/ventas/imprimir'
 */
export const imprimir = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/ventas/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionVentasController::imprimir
 * @see app/Http/Controllers/ImpresionVentasController.php:58
 * @route '/ventas/imprimir'
 */
imprimir.url = (options?: RouteQueryOptions) => {
    return imprimir.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionVentasController::imprimir
 * @see app/Http/Controllers/ImpresionVentasController.php:58
 * @route '/ventas/imprimir'
 */
imprimir.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionVentasController::imprimir
 * @see app/Http/Controllers/ImpresionVentasController.php:58
 * @route '/ventas/imprimir'
 */
imprimir.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ImpresionVentasController::imprimir
 * @see app/Http/Controllers/ImpresionVentasController.php:58
 * @route '/ventas/imprimir'
 */
    const imprimirForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ImpresionVentasController::imprimir
 * @see app/Http/Controllers/ImpresionVentasController.php:58
 * @route '/ventas/imprimir'
 */
        imprimirForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ImpresionVentasController::imprimir
 * @see app/Http/Controllers/ImpresionVentasController.php:58
 * @route '/ventas/imprimir'
 */
        imprimirForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir.form = imprimirForm
const ventas = {
    logistica,
entregas,
checkCajaAbierta,
index,
create,
store,
edit,
update,
destroy,
reporteProductosVendidos,
reportes,
formatosDisponibles,
cuentasPorCobrar,
anular,
aprobar,
rechazar,
registrarPago,
imprimirVenta,
preview,
exportarExcel,
exportarPdf,
show,
stock,
detalles,
imprimir,
}

export default ventas