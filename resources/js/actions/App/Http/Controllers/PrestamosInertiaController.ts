import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
export const prestables = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: prestables.url(options),
    method: 'get',
})

prestables.definition = {
    methods: ["get","head"],
    url: '/prestamos/prestables',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
prestables.url = (options?: RouteQueryOptions) => {
    return prestables.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
prestables.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: prestables.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
prestables.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: prestables.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
    const prestablesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: prestables.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
        prestablesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: prestables.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::prestables
 * @see app/Http/Controllers/PrestamosInertiaController.php:27
 * @route '/prestamos/prestables'
 */
        prestablesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: prestables.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    prestables.form = prestablesForm
/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
export const clientesIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientesIndex.url(options),
    method: 'get',
})

clientesIndex.definition = {
    methods: ["get","head"],
    url: '/prestamos/clientes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
clientesIndex.url = (options?: RouteQueryOptions) => {
    return clientesIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
clientesIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientesIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
clientesIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: clientesIndex.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
    const clientesIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: clientesIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
        clientesIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: clientesIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:43
 * @route '/prestamos/clientes'
 */
        clientesIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: clientesIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    clientesIndex.form = clientesIndexForm
/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
export const clientesCrear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientesCrear.url(options),
    method: 'get',
})

clientesCrear.definition = {
    methods: ["get","head"],
    url: '/prestamos/clientes/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
clientesCrear.url = (options?: RouteQueryOptions) => {
    return clientesCrear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
clientesCrear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientesCrear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
clientesCrear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: clientesCrear.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
    const clientesCrearForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: clientesCrear.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
        clientesCrearForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: clientesCrear.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:51
 * @route '/prestamos/clientes/crear'
 */
        clientesCrearForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: clientesCrear.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    clientesCrear.form = clientesCrearForm
/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:81
 * @route '/prestamos/clientes'
 */
export const clientesStore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clientesStore.url(options),
    method: 'post',
})

clientesStore.definition = {
    methods: ["post"],
    url: '/prestamos/clientes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:81
 * @route '/prestamos/clientes'
 */
clientesStore.url = (options?: RouteQueryOptions) => {
    return clientesStore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:81
 * @route '/prestamos/clientes'
 */
clientesStore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: clientesStore.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:81
 * @route '/prestamos/clientes'
 */
    const clientesStoreForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: clientesStore.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::clientesStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:81
 * @route '/prestamos/clientes'
 */
        clientesStoreForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: clientesStore.url(options),
            method: 'post',
        })
    
    clientesStore.form = clientesStoreForm
/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
export const proveedoresIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedoresIndex.url(options),
    method: 'get',
})

proveedoresIndex.definition = {
    methods: ["get","head"],
    url: '/prestamos/proveedores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
proveedoresIndex.url = (options?: RouteQueryOptions) => {
    return proveedoresIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
proveedoresIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedoresIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
proveedoresIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proveedoresIndex.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
    const proveedoresIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: proveedoresIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
        proveedoresIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proveedoresIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresIndex
 * @see app/Http/Controllers/PrestamosInertiaController.php:90
 * @route '/prestamos/proveedores'
 */
        proveedoresIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proveedoresIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    proveedoresIndex.form = proveedoresIndexForm
/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresPrestamosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
export const proveedoresPrestamosCrear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedoresPrestamosCrear.url(options),
    method: 'get',
})

proveedoresPrestamosCrear.definition = {
    methods: ["get","head"],
    url: '/prestamos/proveedores/prestamos/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresPrestamosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
proveedoresPrestamosCrear.url = (options?: RouteQueryOptions) => {
    return proveedoresPrestamosCrear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresPrestamosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
proveedoresPrestamosCrear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedoresPrestamosCrear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresPrestamosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
proveedoresPrestamosCrear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proveedoresPrestamosCrear.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresPrestamosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
    const proveedoresPrestamosCrearForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: proveedoresPrestamosCrear.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresPrestamosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
        proveedoresPrestamosCrearForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proveedoresPrestamosCrear.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresPrestamosCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:101
 * @route '/prestamos/proveedores/prestamos/crear'
 */
        proveedoresPrestamosCrearForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proveedoresPrestamosCrear.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    proveedoresPrestamosCrear.form = proveedoresPrestamosCrearForm
/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresComprasCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:186
 * @route '/prestamos/proveedores/compras/crear'
 */
export const proveedoresComprasCrear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedoresComprasCrear.url(options),
    method: 'get',
})

proveedoresComprasCrear.definition = {
    methods: ["get","head"],
    url: '/prestamos/proveedores/compras/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresComprasCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:186
 * @route '/prestamos/proveedores/compras/crear'
 */
proveedoresComprasCrear.url = (options?: RouteQueryOptions) => {
    return proveedoresComprasCrear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresComprasCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:186
 * @route '/prestamos/proveedores/compras/crear'
 */
proveedoresComprasCrear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedoresComprasCrear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresComprasCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:186
 * @route '/prestamos/proveedores/compras/crear'
 */
proveedoresComprasCrear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proveedoresComprasCrear.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresComprasCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:186
 * @route '/prestamos/proveedores/compras/crear'
 */
    const proveedoresComprasCrearForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: proveedoresComprasCrear.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresComprasCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:186
 * @route '/prestamos/proveedores/compras/crear'
 */
        proveedoresComprasCrearForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proveedoresComprasCrear.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresComprasCrear
 * @see app/Http/Controllers/PrestamosInertiaController.php:186
 * @route '/prestamos/proveedores/compras/crear'
 */
        proveedoresComprasCrearForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proveedoresComprasCrear.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    proveedoresComprasCrear.form = proveedoresComprasCrearForm
/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:217
 * @route '/prestamos/proveedores'
 */
export const proveedoresStore = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proveedoresStore.url(options),
    method: 'post',
})

proveedoresStore.definition = {
    methods: ["post"],
    url: '/prestamos/proveedores',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:217
 * @route '/prestamos/proveedores'
 */
proveedoresStore.url = (options?: RouteQueryOptions) => {
    return proveedoresStore.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:217
 * @route '/prestamos/proveedores'
 */
proveedoresStore.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: proveedoresStore.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:217
 * @route '/prestamos/proveedores'
 */
    const proveedoresStoreForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: proveedoresStore.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::proveedoresStore
 * @see app/Http/Controllers/PrestamosInertiaController.php:217
 * @route '/prestamos/proveedores'
 */
        proveedoresStoreForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: proveedoresStore.url(options),
            method: 'post',
        })
    
    proveedoresStore.form = proveedoresStoreForm
/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
 */
export const reportes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})

reportes.definition = {
    methods: ["get","head"],
    url: '/prestamos/reportes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
 */
reportes.url = (options?: RouteQueryOptions) => {
    return reportes.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
 */
reportes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: reportes.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
 */
reportes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: reportes.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
 */
    const reportesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: reportes.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
 */
        reportesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: reportes.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamosInertiaController::reportes
 * @see app/Http/Controllers/PrestamosInertiaController.php:226
 * @route '/prestamos/reportes'
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
const PrestamosInertiaController = { prestables, clientesIndex, clientesCrear, clientesStore, proveedoresIndex, proveedoresPrestamosCrear, proveedoresComprasCrear, proveedoresStore, reportes }

export default PrestamosInertiaController