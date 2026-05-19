import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
 * @see routes/web.php:113
 * @route '/productos/carga-masiva'
 */
export const cargaMasiva = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cargaMasiva.url(options),
    method: 'get',
})

cargaMasiva.definition = {
    methods: ["get","head"],
    url: '/productos/carga-masiva',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:113
 * @route '/productos/carga-masiva'
 */
cargaMasiva.url = (options?: RouteQueryOptions) => {
    return cargaMasiva.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:113
 * @route '/productos/carga-masiva'
 */
cargaMasiva.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: cargaMasiva.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:113
 * @route '/productos/carga-masiva'
 */
cargaMasiva.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: cargaMasiva.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:113
 * @route '/productos/carga-masiva'
 */
    const cargaMasivaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: cargaMasiva.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:113
 * @route '/productos/carga-masiva'
 */
        cargaMasivaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cargaMasiva.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:113
 * @route '/productos/carga-masiva'
 */
        cargaMasivaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: cargaMasiva.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    cargaMasiva.form = cargaMasivaForm
/**
 * @see routes/web.php:121
 * @route '/productos/historial-cargas'
 */
export const historialCargas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialCargas.url(options),
    method: 'get',
})

historialCargas.definition = {
    methods: ["get","head"],
    url: '/productos/historial-cargas',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see routes/web.php:121
 * @route '/productos/historial-cargas'
 */
historialCargas.url = (options?: RouteQueryOptions) => {
    return historialCargas.definition.url + queryParams(options)
}

/**
 * @see routes/web.php:121
 * @route '/productos/historial-cargas'
 */
historialCargas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialCargas.url(options),
    method: 'get',
})
/**
 * @see routes/web.php:121
 * @route '/productos/historial-cargas'
 */
historialCargas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historialCargas.url(options),
    method: 'head',
})

    /**
 * @see routes/web.php:121
 * @route '/productos/historial-cargas'
 */
    const historialCargasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historialCargas.url(options),
        method: 'get',
    })

            /**
 * @see routes/web.php:121
 * @route '/productos/historial-cargas'
 */
        historialCargasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialCargas.url(options),
            method: 'get',
        })
            /**
 * @see routes/web.php:121
 * @route '/productos/historial-cargas'
 */
        historialCargasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialCargas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historialCargas.form = historialCargasForm
/**
* @see \App\Http\Controllers\ProductoController::paginados
 * @see app/Http/Controllers/ProductoController.php:3893
 * @route '/productos/paginados/listar'
 */
export const paginados = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paginados.url(options),
    method: 'get',
})

paginados.definition = {
    methods: ["get","head"],
    url: '/productos/paginados/listar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::paginados
 * @see app/Http/Controllers/ProductoController.php:3893
 * @route '/productos/paginados/listar'
 */
paginados.url = (options?: RouteQueryOptions) => {
    return paginados.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::paginados
 * @see app/Http/Controllers/ProductoController.php:3893
 * @route '/productos/paginados/listar'
 */
paginados.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: paginados.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::paginados
 * @see app/Http/Controllers/ProductoController.php:3893
 * @route '/productos/paginados/listar'
 */
paginados.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: paginados.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::paginados
 * @see app/Http/Controllers/ProductoController.php:3893
 * @route '/productos/paginados/listar'
 */
    const paginadosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: paginados.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::paginados
 * @see app/Http/Controllers/ProductoController.php:3893
 * @route '/productos/paginados/listar'
 */
        paginadosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paginados.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::paginados
 * @see app/Http/Controllers/ProductoController.php:3893
 * @route '/productos/paginados/listar'
 */
        paginadosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: paginados.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    paginados.form = paginadosForm
/**
* @see \App\Http\Controllers\ProductoController::filtrosData
 * @see app/Http/Controllers/ProductoController.php:4011
 * @route '/productos/filtros/datos'
 */
export const filtrosData = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filtrosData.url(options),
    method: 'get',
})

filtrosData.definition = {
    methods: ["get","head"],
    url: '/productos/filtros/datos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::filtrosData
 * @see app/Http/Controllers/ProductoController.php:4011
 * @route '/productos/filtros/datos'
 */
filtrosData.url = (options?: RouteQueryOptions) => {
    return filtrosData.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::filtrosData
 * @see app/Http/Controllers/ProductoController.php:4011
 * @route '/productos/filtros/datos'
 */
filtrosData.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: filtrosData.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::filtrosData
 * @see app/Http/Controllers/ProductoController.php:4011
 * @route '/productos/filtros/datos'
 */
filtrosData.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: filtrosData.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::filtrosData
 * @see app/Http/Controllers/ProductoController.php:4011
 * @route '/productos/filtros/datos'
 */
    const filtrosDataForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: filtrosData.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::filtrosData
 * @see app/Http/Controllers/ProductoController.php:4011
 * @route '/productos/filtros/datos'
 */
        filtrosDataForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filtrosData.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::filtrosData
 * @see app/Http/Controllers/ProductoController.php:4011
 * @route '/productos/filtros/datos'
 */
        filtrosDataForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: filtrosData.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    filtrosData.form = filtrosDataForm
/**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/productos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::index
 * @see app/Http/Controllers/ProductoController.php:84
 * @route '/productos'
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
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/productos/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::create
 * @see app/Http/Controllers/ProductoController.php:267
 * @route '/productos/create'
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
* @see \App\Http\Controllers\ProductoController::store
 * @see app/Http/Controllers/ProductoController.php:333
 * @route '/productos'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/productos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProductoController::store
 * @see app/Http/Controllers/ProductoController.php:333
 * @route '/productos'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::store
 * @see app/Http/Controllers/ProductoController.php:333
 * @route '/productos'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProductoController::store
 * @see app/Http/Controllers/ProductoController.php:333
 * @route '/productos'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::store
 * @see app/Http/Controllers/ProductoController.php:333
 * @route '/productos'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
export const edit = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/productos/{producto}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
edit.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
edit.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
edit.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
    const editForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
        editForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::edit
 * @see app/Http/Controllers/ProductoController.php:649
 * @route '/productos/{producto}/edit'
 */
        editForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
export const update = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/productos/{producto}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
update.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
update.put = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
update.patch = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
    const updateForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
        updateForm.put = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ProductoController::update
 * @see app/Http/Controllers/ProductoController.php:878
 * @route '/productos/{producto}'
 */
        updateForm.patch = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ProductoController::destroy
 * @see app/Http/Controllers/ProductoController.php:1276
 * @route '/productos/{producto}'
 */
export const destroy = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/productos/{producto}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ProductoController::destroy
 * @see app/Http/Controllers/ProductoController.php:1276
 * @route '/productos/{producto}'
 */
destroy.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return destroy.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::destroy
 * @see app/Http/Controllers/ProductoController.php:1276
 * @route '/productos/{producto}'
 */
destroy.delete = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ProductoController::destroy
 * @see app/Http/Controllers/ProductoController.php:1276
 * @route '/productos/{producto}'
 */
    const destroyForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProductoController::destroy
 * @see app/Http/Controllers/ProductoController.php:1276
 * @route '/productos/{producto}'
 */
        destroyForm.delete = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
export const historialPrecios = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialPrecios.url(args, options),
    method: 'get',
})

historialPrecios.definition = {
    methods: ["get","head"],
    url: '/productos/{producto}/historial-precios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
historialPrecios.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return historialPrecios.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
historialPrecios.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialPrecios.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
historialPrecios.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historialPrecios.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
    const historialPreciosForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historialPrecios.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
        historialPreciosForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialPrecios.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProductoController::historialPrecios
 * @see app/Http/Controllers/ProductoController.php:57
 * @route '/productos/{producto}/historial-precios'
 */
        historialPreciosForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialPrecios.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historialPrecios.form = historialPreciosForm
const productos = {
    cargaMasiva,
historialCargas,
create,
paginados,
filtrosData,
index,
store,
edit,
update,
destroy,
historialPrecios,
}

export default productos