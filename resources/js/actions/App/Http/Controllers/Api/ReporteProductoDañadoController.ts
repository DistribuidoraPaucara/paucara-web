import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::index
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:19
 * @route '/api/reportes-productos-danados'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/reportes-productos-danados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::index
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:19
 * @route '/api/reportes-productos-danados'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::index
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:19
 * @route '/api/reportes-productos-danados'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::index
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:19
 * @route '/api/reportes-productos-danados'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::index
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:19
 * @route '/api/reportes-productos-danados'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::index
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:19
 * @route '/api/reportes-productos-danados'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::index
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:19
 * @route '/api/reportes-productos-danados'
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
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::store
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:70
 * @route '/api/reportes-productos-danados'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/reportes-productos-danados',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::store
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:70
 * @route '/api/reportes-productos-danados'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::store
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:70
 * @route '/api/reportes-productos-danados'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::store
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:70
 * @route '/api/reportes-productos-danados'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::store
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:70
 * @route '/api/reportes-productos-danados'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::show
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:115
 * @route '/api/reportes-productos-danados/{id}'
 */
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/reportes-productos-danados/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::show
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:115
 * @route '/api/reportes-productos-danados/{id}'
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
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::show
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:115
 * @route '/api/reportes-productos-danados/{id}'
 */
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::show
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:115
 * @route '/api/reportes-productos-danados/{id}'
 */
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::show
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:115
 * @route '/api/reportes-productos-danados/{id}'
 */
    const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::show
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:115
 * @route '/api/reportes-productos-danados/{id}'
 */
        showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::show
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:115
 * @route '/api/reportes-productos-danados/{id}'
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
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::update
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:138
 * @route '/api/reportes-productos-danados/{id}'
 */
export const update = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/api/reportes-productos-danados/{id}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::update
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:138
 * @route '/api/reportes-productos-danados/{id}'
 */
update.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::update
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:138
 * @route '/api/reportes-productos-danados/{id}'
 */
update.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::update
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:138
 * @route '/api/reportes-productos-danados/{id}'
 */
    const updateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::update
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:138
 * @route '/api/reportes-productos-danados/{id}'
 */
        updateForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::destroy
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:262
 * @route '/api/reportes-productos-danados/{id}'
 */
export const destroy = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/reportes-productos-danados/{id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::destroy
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:262
 * @route '/api/reportes-productos-danados/{id}'
 */
destroy.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::destroy
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:262
 * @route '/api/reportes-productos-danados/{id}'
 */
destroy.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::destroy
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:262
 * @route '/api/reportes-productos-danados/{id}'
 */
    const destroyForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::destroy
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:262
 * @route '/api/reportes-productos-danados/{id}'
 */
        destroyForm.delete = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::subirImagen
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:173
 * @route '/api/reportes-productos-danados/{id}/imagenes'
 */
export const subirImagen = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subirImagen.url(args, options),
    method: 'post',
})

subirImagen.definition = {
    methods: ["post"],
    url: '/api/reportes-productos-danados/{id}/imagenes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::subirImagen
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:173
 * @route '/api/reportes-productos-danados/{id}/imagenes'
 */
subirImagen.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return subirImagen.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::subirImagen
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:173
 * @route '/api/reportes-productos-danados/{id}/imagenes'
 */
subirImagen.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: subirImagen.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::subirImagen
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:173
 * @route '/api/reportes-productos-danados/{id}/imagenes'
 */
    const subirImagenForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: subirImagen.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::subirImagen
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:173
 * @route '/api/reportes-productos-danados/{id}/imagenes'
 */
        subirImagenForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: subirImagen.url(args, options),
            method: 'post',
        })
    
    subirImagen.form = subirImagenForm
/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::eliminarImagen
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:233
 * @route '/api/reportes-productos-danados/imagenes/{imagenId}'
 */
export const eliminarImagen = (args: { imagenId: string | number } | [imagenId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarImagen.url(args, options),
    method: 'delete',
})

eliminarImagen.definition = {
    methods: ["delete"],
    url: '/api/reportes-productos-danados/imagenes/{imagenId}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::eliminarImagen
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:233
 * @route '/api/reportes-productos-danados/imagenes/{imagenId}'
 */
eliminarImagen.url = (args: { imagenId: string | number } | [imagenId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { imagenId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    imagenId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        imagenId: args.imagenId,
                }

    return eliminarImagen.definition.url
            .replace('{imagenId}', parsedArgs.imagenId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::eliminarImagen
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:233
 * @route '/api/reportes-productos-danados/imagenes/{imagenId}'
 */
eliminarImagen.delete = (args: { imagenId: string | number } | [imagenId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: eliminarImagen.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::eliminarImagen
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:233
 * @route '/api/reportes-productos-danados/imagenes/{imagenId}'
 */
    const eliminarImagenForm = (args: { imagenId: string | number } | [imagenId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: eliminarImagen.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::eliminarImagen
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:233
 * @route '/api/reportes-productos-danados/imagenes/{imagenId}'
 */
        eliminarImagenForm.delete = (args: { imagenId: string | number } | [imagenId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: eliminarImagen.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    eliminarImagen.form = eliminarImagenForm
/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::reportesPorVenta
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:293
 * @route '/api/reportes-productos-danados/venta/{ventaId}'
 */
export const reportesPorVenta = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportesPorVenta.url(args, options),
    method: 'get',
})

reportesPorVenta.definition = {
    methods: ["get","head"],
    url: '/api/reportes-productos-danados/venta/{ventaId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::reportesPorVenta
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:293
 * @route '/api/reportes-productos-danados/venta/{ventaId}'
 */
reportesPorVenta.url = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ventaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    ventaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        ventaId: args.ventaId,
                }

    return reportesPorVenta.definition.url
            .replace('{ventaId}', parsedArgs.ventaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::reportesPorVenta
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:293
 * @route '/api/reportes-productos-danados/venta/{ventaId}'
 */
reportesPorVenta.get = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportesPorVenta.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::reportesPorVenta
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:293
 * @route '/api/reportes-productos-danados/venta/{ventaId}'
 */
reportesPorVenta.head = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportesPorVenta.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::reportesPorVenta
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:293
 * @route '/api/reportes-productos-danados/venta/{ventaId}'
 */
    const reportesPorVentaForm = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reportesPorVenta.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::reportesPorVenta
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:293
 * @route '/api/reportes-productos-danados/venta/{ventaId}'
 */
        reportesPorVentaForm.get = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportesPorVenta.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\ReporteProductoDañadoController::reportesPorVenta
 * @see app/Http/Controllers/Api/ReporteProductoDañadoController.php:293
 * @route '/api/reportes-productos-danados/venta/{ventaId}'
 */
        reportesPorVentaForm.head = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportesPorVenta.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    reportesPorVenta.form = reportesPorVentaForm
const ReporteProductoDañadoController = { index, store, show, update, destroy, subirImagen, eliminarImagen, reportesPorVenta }

export default ReporteProductoDañadoController