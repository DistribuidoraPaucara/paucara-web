import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:27
 * @route '/api/prestamos-evento'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-evento',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:27
 * @route '/api/prestamos-evento'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:27
 * @route '/api/prestamos-evento'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:27
 * @route '/api/prestamos-evento'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:27
 * @route '/api/prestamos-evento'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:27
 * @route '/api/prestamos-evento'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:27
 * @route '/api/prestamos-evento'
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
* @see \App\Http\Controllers\PrestamoEventoController::store
 * @see app/Http/Controllers/PrestamoEventoController.php:119
 * @route '/api/prestamos-evento'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/prestamos-evento',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::store
 * @see app/Http/Controllers/PrestamoEventoController.php:119
 * @route '/api/prestamos-evento'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::store
 * @see app/Http/Controllers/PrestamoEventoController.php:119
 * @route '/api/prestamos-evento'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::store
 * @see app/Http/Controllers/PrestamoEventoController.php:119
 * @route '/api/prestamos-evento'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::store
 * @see app/Http/Controllers/PrestamoEventoController.php:119
 * @route '/api/prestamos-evento'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:246
 * @route '/api/prestamos-evento/{prestamo}'
 */
export const show = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-evento/{prestamo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:246
 * @route '/api/prestamos-evento/{prestamo}'
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
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:246
 * @route '/api/prestamos-evento/{prestamo}'
 */
show.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:246
 * @route '/api/prestamos-evento/{prestamo}'
 */
show.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:246
 * @route '/api/prestamos-evento/{prestamo}'
 */
    const showForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:246
 * @route '/api/prestamos-evento/{prestamo}'
 */
        showForm.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:246
 * @route '/api/prestamos-evento/{prestamo}'
 */
        showForm.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PrestamoEventoController::update
 * @see app/Http/Controllers/PrestamoEventoController.php:281
 * @route '/api/prestamos-evento/{prestamo}'
 */
export const update = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/prestamos-evento/{prestamo}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::update
 * @see app/Http/Controllers/PrestamoEventoController.php:281
 * @route '/api/prestamos-evento/{prestamo}'
 */
update.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return update.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::update
 * @see app/Http/Controllers/PrestamoEventoController.php:281
 * @route '/api/prestamos-evento/{prestamo}'
 */
update.put = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::update
 * @see app/Http/Controllers/PrestamoEventoController.php:281
 * @route '/api/prestamos-evento/{prestamo}'
 */
    const updateForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::update
 * @see app/Http/Controllers/PrestamoEventoController.php:281
 * @route '/api/prestamos-evento/{prestamo}'
 */
        updateForm.put = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
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
* @see \App\Http\Controllers\PrestamoEventoController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:342
 * @route '/api/prestamos-evento/{prestamo}/devolver'
 */
export const registrarDevolucion = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarDevolucion.url(args, options),
    method: 'post',
})

registrarDevolucion.definition = {
    methods: ["post"],
    url: '/api/prestamos-evento/{prestamo}/devolver',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:342
 * @route '/api/prestamos-evento/{prestamo}/devolver'
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
* @see \App\Http\Controllers\PrestamoEventoController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:342
 * @route '/api/prestamos-evento/{prestamo}/devolver'
 */
registrarDevolucion.post = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarDevolucion.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:342
 * @route '/api/prestamos-evento/{prestamo}/devolver'
 */
    const registrarDevolucionForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarDevolucion.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:342
 * @route '/api/prestamos-evento/{prestamo}/devolver'
 */
        registrarDevolucionForm.post = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarDevolucion.url(args, options),
            method: 'post',
        })
    
    registrarDevolucion.form = registrarDevolucionForm
/**
* @see \App\Http\Controllers\PrestamoEventoController::anularPrestamo
 * @see app/Http/Controllers/PrestamoEventoController.php:453
 * @route '/api/prestamos-evento/{prestamo}/anular'
 */
export const anularPrestamo = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPrestamo.url(args, options),
    method: 'post',
})

anularPrestamo.definition = {
    methods: ["post"],
    url: '/api/prestamos-evento/{prestamo}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::anularPrestamo
 * @see app/Http/Controllers/PrestamoEventoController.php:453
 * @route '/api/prestamos-evento/{prestamo}/anular'
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
* @see \App\Http\Controllers\PrestamoEventoController::anularPrestamo
 * @see app/Http/Controllers/PrestamoEventoController.php:453
 * @route '/api/prestamos-evento/{prestamo}/anular'
 */
anularPrestamo.post = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPrestamo.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::anularPrestamo
 * @see app/Http/Controllers/PrestamoEventoController.php:453
 * @route '/api/prestamos-evento/{prestamo}/anular'
 */
    const anularPrestamoForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: anularPrestamo.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::anularPrestamo
 * @see app/Http/Controllers/PrestamoEventoController.php:453
 * @route '/api/prestamos-evento/{prestamo}/anular'
 */
        anularPrestamoForm.post = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: anularPrestamo.url(args, options),
            method: 'post',
        })
    
    anularPrestamo.form = anularPrestamoForm
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:505
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
export const imprimir = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/prestamos/eventos/{prestamo}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:505
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
imprimir.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return imprimir.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:505
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
imprimir.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:505
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
imprimir.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:505
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
    const imprimirForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:505
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
        imprimirForm.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:505
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
        imprimirForm.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir.form = imprimirForm
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:537
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
export const imprimirDevolucion = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirDevolucion.url(args, options),
    method: 'get',
})

imprimirDevolucion.definition = {
    methods: ["get","head"],
    url: '/prestamos/eventos/devoluciones/{devolucion}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:537
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucion.url = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { devolucion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { devolucion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    devolucion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        devolucion: typeof args.devolucion === 'object'
                ? args.devolucion.id
                : args.devolucion,
                }

    return imprimirDevolucion.definition.url
            .replace('{devolucion}', parsedArgs.devolucion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:537
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucion.get = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirDevolucion.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:537
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucion.head = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirDevolucion.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:537
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
    const imprimirDevolucionForm = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirDevolucion.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:537
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
        imprimirDevolucionForm.get = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirDevolucion.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:537
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
        imprimirDevolucionForm.head = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirDevolucion.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirDevolucion.form = imprimirDevolucionForm
const PrestamoEventoController = { index, store, show, update, registrarDevolucion, anularPrestamo, imprimir, imprimirDevolucion }

export default PrestamoEventoController