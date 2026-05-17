import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/inventario/transferencias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::index
 * @see app/Http/Controllers/InventarioController.php:1491
 * @route '/inventario/transferencias'
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
* @see \App\Http\Controllers\InventarioController::crear
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
export const crear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})

crear.definition = {
    methods: ["get","head"],
    url: '/inventario/transferencias/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::crear
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
crear.url = (options?: RouteQueryOptions) => {
    return crear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::crear
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
crear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::crear
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
crear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: crear.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::crear
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
    const crearForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: crear.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::crear
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
        crearForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: crear.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::crear
 * @see app/Http/Controllers/InventarioController.php:1710
 * @route '/inventario/transferencias/crear'
 */
        crearForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: crear.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    crear.form = crearForm
/**
* @see \App\Http\Controllers\InventarioController::store
 * @see app/Http/Controllers/InventarioController.php:1535
 * @route '/inventario/transferencias/crear'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/inventario/transferencias/crear',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::store
 * @see app/Http/Controllers/InventarioController.php:1535
 * @route '/inventario/transferencias/crear'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::store
 * @see app/Http/Controllers/InventarioController.php:1535
 * @route '/inventario/transferencias/crear'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::store
 * @see app/Http/Controllers/InventarioController.php:1535
 * @route '/inventario/transferencias/crear'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::store
 * @see app/Http/Controllers/InventarioController.php:1535
 * @route '/inventario/transferencias/crear'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
export const show = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/inventario/transferencias/{transferencia}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
show.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
show.get = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
show.head = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
    const showForm = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
        showForm.get = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::show
 * @see app/Http/Controllers/InventarioController.php:1750
 * @route '/inventario/transferencias/{transferencia}'
 */
        showForm.head = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\InventarioController::edit
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
export const edit = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/inventario/transferencias/{transferencia}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\InventarioController::edit
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
edit.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return edit.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::edit
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
edit.get = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\InventarioController::edit
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
edit.head = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\InventarioController::edit
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
    const editForm = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\InventarioController::edit
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
        editForm.get = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\InventarioController::edit
 * @see app/Http/Controllers/InventarioController.php:1979
 * @route '/inventario/transferencias/{transferencia}/edit'
 */
        editForm.head = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\InventarioController::update
 * @see app/Http/Controllers/InventarioController.php:1998
 * @route '/inventario/transferencias/{transferencia}'
 */
export const update = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/inventario/transferencias/{transferencia}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\InventarioController::update
 * @see app/Http/Controllers/InventarioController.php:1998
 * @route '/inventario/transferencias/{transferencia}'
 */
update.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::update
 * @see app/Http/Controllers/InventarioController.php:1998
 * @route '/inventario/transferencias/{transferencia}'
 */
update.put = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\InventarioController::update
 * @see app/Http/Controllers/InventarioController.php:1998
 * @route '/inventario/transferencias/{transferencia}'
 */
    const updateForm = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::update
 * @see app/Http/Controllers/InventarioController.php:1998
 * @route '/inventario/transferencias/{transferencia}'
 */
        updateForm.put = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\InventarioController::enviar
 * @see app/Http/Controllers/InventarioController.php:1769
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
export const enviar = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviar.url(args, options),
    method: 'post',
})

enviar.definition = {
    methods: ["post"],
    url: '/inventario/transferencias/{transferencia}/enviar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::enviar
 * @see app/Http/Controllers/InventarioController.php:1769
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
enviar.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return enviar.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::enviar
 * @see app/Http/Controllers/InventarioController.php:1769
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
enviar.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: enviar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::enviar
 * @see app/Http/Controllers/InventarioController.php:1769
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
    const enviarForm = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: enviar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::enviar
 * @see app/Http/Controllers/InventarioController.php:1769
 * @route '/inventario/transferencias/{transferencia}/enviar'
 */
        enviarForm.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: enviar.url(args, options),
            method: 'post',
        })
    
    enviar.form = enviarForm
/**
* @see \App\Http\Controllers\InventarioController::recibir
 * @see app/Http/Controllers/InventarioController.php:1790
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
export const recibir = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recibir.url(args, options),
    method: 'post',
})

recibir.definition = {
    methods: ["post"],
    url: '/inventario/transferencias/{transferencia}/recibir',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::recibir
 * @see app/Http/Controllers/InventarioController.php:1790
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
recibir.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return recibir.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::recibir
 * @see app/Http/Controllers/InventarioController.php:1790
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
recibir.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: recibir.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::recibir
 * @see app/Http/Controllers/InventarioController.php:1790
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
    const recibirForm = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: recibir.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::recibir
 * @see app/Http/Controllers/InventarioController.php:1790
 * @route '/inventario/transferencias/{transferencia}/recibir'
 */
        recibirForm.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: recibir.url(args, options),
            method: 'post',
        })
    
    recibir.form = recibirForm
/**
* @see \App\Http\Controllers\InventarioController::cancelar
 * @see app/Http/Controllers/InventarioController.php:1811
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
export const cancelar = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

cancelar.definition = {
    methods: ["post"],
    url: '/inventario/transferencias/{transferencia}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\InventarioController::cancelar
 * @see app/Http/Controllers/InventarioController.php:1811
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
cancelar.url = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return cancelar.definition.url
            .replace('{transferencia}', parsedArgs.transferencia.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\InventarioController::cancelar
 * @see app/Http/Controllers/InventarioController.php:1811
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
cancelar.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\InventarioController::cancelar
 * @see app/Http/Controllers/InventarioController.php:1811
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
    const cancelarForm = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\InventarioController::cancelar
 * @see app/Http/Controllers/InventarioController.php:1811
 * @route '/inventario/transferencias/{transferencia}/cancelar'
 */
        cancelarForm.post = (args: { transferencia: number | { id: number } } | [transferencia: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelar.url(args, options),
            method: 'post',
        })
    
    cancelar.form = cancelarForm
const transferencias = {
    index,
crear,
store,
show,
edit,
update,
enviar,
recibir,
cancelar,
}

export default transferencias