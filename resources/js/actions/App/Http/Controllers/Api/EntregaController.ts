import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntregaPorVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
export const obtenerEntregaPorVenta = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerEntregaPorVenta.url(args, options),
    method: 'get',
})

obtenerEntregaPorVenta.definition = {
    methods: ["get","head"],
    url: '/api/app/ventas/{ventaId}/entrega',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntregaPorVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
obtenerEntregaPorVenta.url = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return obtenerEntregaPorVenta.definition.url
            .replace('{ventaId}', parsedArgs.ventaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntregaPorVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
obtenerEntregaPorVenta.get = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerEntregaPorVenta.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntregaPorVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
obtenerEntregaPorVenta.head = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerEntregaPorVenta.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntregaPorVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
    const obtenerEntregaPorVentaForm = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerEntregaPorVenta.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntregaPorVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
        obtenerEntregaPorVentaForm.get = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerEntregaPorVenta.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntregaPorVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3319
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
        obtenerEntregaPorVentaForm.head = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerEntregaPorVenta.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerEntregaPorVenta.form = obtenerEntregaPorVentaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::estadisticasChofer
 * @see app/Http/Controllers/Api/EntregaController.php:397
 * @route '/api/chofer/estadisticas'
 */
export const estadisticasChofer = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasChofer.url(options),
    method: 'get',
})

estadisticasChofer.definition = {
    methods: ["get","head"],
    url: '/api/chofer/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::estadisticasChofer
 * @see app/Http/Controllers/Api/EntregaController.php:397
 * @route '/api/chofer/estadisticas'
 */
estadisticasChofer.url = (options?: RouteQueryOptions) => {
    return estadisticasChofer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::estadisticasChofer
 * @see app/Http/Controllers/Api/EntregaController.php:397
 * @route '/api/chofer/estadisticas'
 */
estadisticasChofer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasChofer.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::estadisticasChofer
 * @see app/Http/Controllers/Api/EntregaController.php:397
 * @route '/api/chofer/estadisticas'
 */
estadisticasChofer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticasChofer.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::estadisticasChofer
 * @see app/Http/Controllers/Api/EntregaController.php:397
 * @route '/api/chofer/estadisticas'
 */
    const estadisticasChoferForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticasChofer.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::estadisticasChofer
 * @see app/Http/Controllers/Api/EntregaController.php:397
 * @route '/api/chofer/estadisticas'
 */
        estadisticasChoferForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticasChofer.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::estadisticasChofer
 * @see app/Http/Controllers/Api/EntregaController.php:397
 * @route '/api/chofer/estadisticas'
 */
        estadisticasChoferForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticasChofer.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticasChofer.form = estadisticasChoferForm
/**
* @see \App\Http\Controllers\Api\EntregaController::misTrabjos
 * @see app/Http/Controllers/Api/EntregaController.php:141
 * @route '/api/chofer/trabajos'
 */
export const misTrabjos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: misTrabjos.url(options),
    method: 'get',
})

misTrabjos.definition = {
    methods: ["get","head"],
    url: '/api/chofer/trabajos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::misTrabjos
 * @see app/Http/Controllers/Api/EntregaController.php:141
 * @route '/api/chofer/trabajos'
 */
misTrabjos.url = (options?: RouteQueryOptions) => {
    return misTrabjos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::misTrabjos
 * @see app/Http/Controllers/Api/EntregaController.php:141
 * @route '/api/chofer/trabajos'
 */
misTrabjos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: misTrabjos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::misTrabjos
 * @see app/Http/Controllers/Api/EntregaController.php:141
 * @route '/api/chofer/trabajos'
 */
misTrabjos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: misTrabjos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::misTrabjos
 * @see app/Http/Controllers/Api/EntregaController.php:141
 * @route '/api/chofer/trabajos'
 */
    const misTrabjosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: misTrabjos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::misTrabjos
 * @see app/Http/Controllers/Api/EntregaController.php:141
 * @route '/api/chofer/trabajos'
 */
        misTrabjosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: misTrabjos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::misTrabjos
 * @see app/Http/Controllers/Api/EntregaController.php:141
 * @route '/api/chofer/trabajos'
 */
        misTrabjosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: misTrabjos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    misTrabjos.form = misTrabjosForm
/**
* @see \App\Http\Controllers\Api\EntregaController::entregasAsignadas
 * @see app/Http/Controllers/Api/EntregaController.php:554
 * @route '/api/chofer/entregas'
 */
export const entregasAsignadas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasAsignadas.url(options),
    method: 'get',
})

entregasAsignadas.definition = {
    methods: ["get","head"],
    url: '/api/chofer/entregas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::entregasAsignadas
 * @see app/Http/Controllers/Api/EntregaController.php:554
 * @route '/api/chofer/entregas'
 */
entregasAsignadas.url = (options?: RouteQueryOptions) => {
    return entregasAsignadas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::entregasAsignadas
 * @see app/Http/Controllers/Api/EntregaController.php:554
 * @route '/api/chofer/entregas'
 */
entregasAsignadas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasAsignadas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::entregasAsignadas
 * @see app/Http/Controllers/Api/EntregaController.php:554
 * @route '/api/chofer/entregas'
 */
entregasAsignadas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregasAsignadas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::entregasAsignadas
 * @see app/Http/Controllers/Api/EntregaController.php:554
 * @route '/api/chofer/entregas'
 */
    const entregasAsignadasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: entregasAsignadas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::entregasAsignadas
 * @see app/Http/Controllers/Api/EntregaController.php:554
 * @route '/api/chofer/entregas'
 */
        entregasAsignadasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregasAsignadas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::entregasAsignadas
 * @see app/Http/Controllers/Api/EntregaController.php:554
 * @route '/api/chofer/entregas'
 */
        entregasAsignadasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregasAsignadas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    entregasAsignadas.form = entregasAsignadasForm
/**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/chofer/entregas/{id}'
 */
const showEntrega99966fc58ef488bb366bec129ad31105 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showEntrega99966fc58ef488bb366bec129ad31105.url(args, options),
    method: 'get',
})

showEntrega99966fc58ef488bb366bec129ad31105.definition = {
    methods: ["get","head"],
    url: '/api/chofer/entregas/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/chofer/entregas/{id}'
 */
showEntrega99966fc58ef488bb366bec129ad31105.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showEntrega99966fc58ef488bb366bec129ad31105.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/chofer/entregas/{id}'
 */
showEntrega99966fc58ef488bb366bec129ad31105.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showEntrega99966fc58ef488bb366bec129ad31105.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/chofer/entregas/{id}'
 */
showEntrega99966fc58ef488bb366bec129ad31105.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showEntrega99966fc58ef488bb366bec129ad31105.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/chofer/entregas/{id}'
 */
    const showEntrega99966fc58ef488bb366bec129ad31105Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showEntrega99966fc58ef488bb366bec129ad31105.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/chofer/entregas/{id}'
 */
        showEntrega99966fc58ef488bb366bec129ad31105Form.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showEntrega99966fc58ef488bb366bec129ad31105.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/chofer/entregas/{id}'
 */
        showEntrega99966fc58ef488bb366bec129ad31105Form.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showEntrega99966fc58ef488bb366bec129ad31105.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showEntrega99966fc58ef488bb366bec129ad31105.form = showEntrega99966fc58ef488bb366bec129ad31105Form
    /**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
const showEntrega1e6ef048b02be613ee2091b53c41cf2e = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showEntrega1e6ef048b02be613ee2091b53c41cf2e.url(args, options),
    method: 'get',
})

showEntrega1e6ef048b02be613ee2091b53c41cf2e.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
showEntrega1e6ef048b02be613ee2091b53c41cf2e.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return showEntrega1e6ef048b02be613ee2091b53c41cf2e.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
showEntrega1e6ef048b02be613ee2091b53c41cf2e.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showEntrega1e6ef048b02be613ee2091b53c41cf2e.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
showEntrega1e6ef048b02be613ee2091b53c41cf2e.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showEntrega1e6ef048b02be613ee2091b53c41cf2e.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
    const showEntrega1e6ef048b02be613ee2091b53c41cf2eForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: showEntrega1e6ef048b02be613ee2091b53c41cf2e.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
        showEntrega1e6ef048b02be613ee2091b53c41cf2eForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showEntrega1e6ef048b02be613ee2091b53c41cf2e.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:592
 * @route '/api/entregas/{id}'
 */
        showEntrega1e6ef048b02be613ee2091b53c41cf2eForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: showEntrega1e6ef048b02be613ee2091b53c41cf2e.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    showEntrega1e6ef048b02be613ee2091b53c41cf2e.form = showEntrega1e6ef048b02be613ee2091b53c41cf2eForm

export const showEntrega = {
    '/api/chofer/entregas/{id}': showEntrega99966fc58ef488bb366bec129ad31105,
    '/api/entregas/{id}': showEntrega1e6ef048b02be613ee2091b53c41cf2e,
}

/**
* @see \App\Http\Controllers\Api\EntregaController::iniciarRuta
 * @see app/Http/Controllers/Api/EntregaController.php:739
 * @route '/api/chofer/entregas/{id}/iniciar-ruta'
 */
export const iniciarRuta = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciarRuta.url(args, options),
    method: 'post',
})

iniciarRuta.definition = {
    methods: ["post"],
    url: '/api/chofer/entregas/{id}/iniciar-ruta',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::iniciarRuta
 * @see app/Http/Controllers/Api/EntregaController.php:739
 * @route '/api/chofer/entregas/{id}/iniciar-ruta'
 */
iniciarRuta.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return iniciarRuta.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::iniciarRuta
 * @see app/Http/Controllers/Api/EntregaController.php:739
 * @route '/api/chofer/entregas/{id}/iniciar-ruta'
 */
iniciarRuta.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciarRuta.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::iniciarRuta
 * @see app/Http/Controllers/Api/EntregaController.php:739
 * @route '/api/chofer/entregas/{id}/iniciar-ruta'
 */
    const iniciarRutaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: iniciarRuta.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::iniciarRuta
 * @see app/Http/Controllers/Api/EntregaController.php:739
 * @route '/api/chofer/entregas/{id}/iniciar-ruta'
 */
        iniciarRutaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: iniciarRuta.url(args, options),
            method: 'post',
        })
    
    iniciarRuta.form = iniciarRutaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarEstado
 * @see app/Http/Controllers/Api/EntregaController.php:836
 * @route '/api/chofer/entregas/{id}/actualizar-estado'
 */
export const actualizarEstado = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarEstado.url(args, options),
    method: 'post',
})

actualizarEstado.definition = {
    methods: ["post"],
    url: '/api/chofer/entregas/{id}/actualizar-estado',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarEstado
 * @see app/Http/Controllers/Api/EntregaController.php:836
 * @route '/api/chofer/entregas/{id}/actualizar-estado'
 */
actualizarEstado.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return actualizarEstado.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarEstado
 * @see app/Http/Controllers/Api/EntregaController.php:836
 * @route '/api/chofer/entregas/{id}/actualizar-estado'
 */
actualizarEstado.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarEstado.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::actualizarEstado
 * @see app/Http/Controllers/Api/EntregaController.php:836
 * @route '/api/chofer/entregas/{id}/actualizar-estado'
 */
    const actualizarEstadoForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarEstado.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::actualizarEstado
 * @see app/Http/Controllers/Api/EntregaController.php:836
 * @route '/api/chofer/entregas/{id}/actualizar-estado'
 */
        actualizarEstadoForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarEstado.url(args, options),
            method: 'post',
        })
    
    actualizarEstado.form = actualizarEstadoForm
/**
* @see \App\Http\Controllers\Api\EntregaController::marcarLlegada
 * @see app/Http/Controllers/Api/EntregaController.php:887
 * @route '/api/chofer/entregas/{id}/marcar-llegada'
 */
export const marcarLlegada = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarLlegada.url(args, options),
    method: 'post',
})

marcarLlegada.definition = {
    methods: ["post"],
    url: '/api/chofer/entregas/{id}/marcar-llegada',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::marcarLlegada
 * @see app/Http/Controllers/Api/EntregaController.php:887
 * @route '/api/chofer/entregas/{id}/marcar-llegada'
 */
marcarLlegada.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return marcarLlegada.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::marcarLlegada
 * @see app/Http/Controllers/Api/EntregaController.php:887
 * @route '/api/chofer/entregas/{id}/marcar-llegada'
 */
marcarLlegada.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarLlegada.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::marcarLlegada
 * @see app/Http/Controllers/Api/EntregaController.php:887
 * @route '/api/chofer/entregas/{id}/marcar-llegada'
 */
    const marcarLlegadaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: marcarLlegada.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::marcarLlegada
 * @see app/Http/Controllers/Api/EntregaController.php:887
 * @route '/api/chofer/entregas/{id}/marcar-llegada'
 */
        marcarLlegadaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: marcarLlegada.url(args, options),
            method: 'post',
        })
    
    marcarLlegada.form = marcarLlegadaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVentaEntregada
 * @see app/Http/Controllers/Api/EntregaController.php:954
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmar-entrega'
 */
export const confirmarVentaEntregada = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarVentaEntregada.url(args, options),
    method: 'post',
})

confirmarVentaEntregada.definition = {
    methods: ["post"],
    url: '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmar-entrega',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVentaEntregada
 * @see app/Http/Controllers/Api/EntregaController.php:954
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmar-entrega'
 */
confirmarVentaEntregada.url = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions) => {
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

    return confirmarVentaEntregada.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{venta_id}', parsedArgs.venta_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVentaEntregada
 * @see app/Http/Controllers/Api/EntregaController.php:954
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmar-entrega'
 */
confirmarVentaEntregada.post = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarVentaEntregada.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVentaEntregada
 * @see app/Http/Controllers/Api/EntregaController.php:954
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmar-entrega'
 */
    const confirmarVentaEntregadaForm = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmarVentaEntregada.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVentaEntregada
 * @see app/Http/Controllers/Api/EntregaController.php:954
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmar-entrega'
 */
        confirmarVentaEntregadaForm.post = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmarVentaEntregada.url(args, options),
            method: 'post',
        })
    
    confirmarVentaEntregada.form = confirmarVentaEntregadaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacionVenta
 * @see app/Http/Controllers/Api/EntregaController.php:1284
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmaciones/{confirmacion_id}'
 */
export const actualizarConfirmacionVenta = (args: { id: string | number, venta_id: string | number, confirmacion_id: string | number } | [id: string | number, venta_id: string | number, confirmacion_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarConfirmacionVenta.url(args, options),
    method: 'put',
})

actualizarConfirmacionVenta.definition = {
    methods: ["put"],
    url: '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmaciones/{confirmacion_id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacionVenta
 * @see app/Http/Controllers/Api/EntregaController.php:1284
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmaciones/{confirmacion_id}'
 */
actualizarConfirmacionVenta.url = (args: { id: string | number, venta_id: string | number, confirmacion_id: string | number } | [id: string | number, venta_id: string | number, confirmacion_id: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                    venta_id: args[1],
                    confirmacion_id: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                                venta_id: args.venta_id,
                                confirmacion_id: args.confirmacion_id,
                }

    return actualizarConfirmacionVenta.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{venta_id}', parsedArgs.venta_id.toString())
            .replace('{confirmacion_id}', parsedArgs.confirmacion_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacionVenta
 * @see app/Http/Controllers/Api/EntregaController.php:1284
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmaciones/{confirmacion_id}'
 */
actualizarConfirmacionVenta.put = (args: { id: string | number, venta_id: string | number, confirmacion_id: string | number } | [id: string | number, venta_id: string | number, confirmacion_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarConfirmacionVenta.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacionVenta
 * @see app/Http/Controllers/Api/EntregaController.php:1284
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmaciones/{confirmacion_id}'
 */
    const actualizarConfirmacionVentaForm = (args: { id: string | number, venta_id: string | number, confirmacion_id: string | number } | [id: string | number, venta_id: string | number, confirmacion_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarConfirmacionVenta.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacionVenta
 * @see app/Http/Controllers/Api/EntregaController.php:1284
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmaciones/{confirmacion_id}'
 */
        actualizarConfirmacionVentaForm.put = (args: { id: string | number, venta_id: string | number, confirmacion_id: string | number } | [id: string | number, venta_id: string | number, confirmacion_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarConfirmacionVenta.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarConfirmacionVenta.form = actualizarConfirmacionVentaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::finalizarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1497
 * @route '/api/chofer/entregas/{id}/finalizar-entrega'
 */
export const finalizarEntrega = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalizarEntrega.url(args, options),
    method: 'post',
})

finalizarEntrega.definition = {
    methods: ["post"],
    url: '/api/chofer/entregas/{id}/finalizar-entrega',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::finalizarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1497
 * @route '/api/chofer/entregas/{id}/finalizar-entrega'
 */
finalizarEntrega.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return finalizarEntrega.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::finalizarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1497
 * @route '/api/chofer/entregas/{id}/finalizar-entrega'
 */
finalizarEntrega.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalizarEntrega.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::finalizarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1497
 * @route '/api/chofer/entregas/{id}/finalizar-entrega'
 */
    const finalizarEntregaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: finalizarEntrega.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::finalizarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1497
 * @route '/api/chofer/entregas/{id}/finalizar-entrega'
 */
        finalizarEntregaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: finalizarEntrega.url(args, options),
            method: 'post',
        })
    
    finalizarEntrega.form = finalizarEntregaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1621
 * @route '/api/chofer/entregas/{id}/confirmar-entrega'
 */
export const confirmarEntrega = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarEntrega.url(args, options),
    method: 'post',
})

confirmarEntrega.definition = {
    methods: ["post"],
    url: '/api/chofer/entregas/{id}/confirmar-entrega',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1621
 * @route '/api/chofer/entregas/{id}/confirmar-entrega'
 */
confirmarEntrega.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return confirmarEntrega.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1621
 * @route '/api/chofer/entregas/{id}/confirmar-entrega'
 */
confirmarEntrega.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarEntrega.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::confirmarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1621
 * @route '/api/chofer/entregas/{id}/confirmar-entrega'
 */
    const confirmarEntregaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmarEntrega.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::confirmarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1621
 * @route '/api/chofer/entregas/{id}/confirmar-entrega'
 */
        confirmarEntregaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmarEntrega.url(args, options),
            method: 'post',
        })
    
    confirmarEntrega.form = confirmarEntregaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::reportarNovedad
 * @see app/Http/Controllers/Api/EntregaController.php:1695
 * @route '/api/chofer/entregas/{id}/reportar-novedad'
 */
export const reportarNovedad = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reportarNovedad.url(args, options),
    method: 'post',
})

reportarNovedad.definition = {
    methods: ["post"],
    url: '/api/chofer/entregas/{id}/reportar-novedad',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::reportarNovedad
 * @see app/Http/Controllers/Api/EntregaController.php:1695
 * @route '/api/chofer/entregas/{id}/reportar-novedad'
 */
reportarNovedad.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return reportarNovedad.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::reportarNovedad
 * @see app/Http/Controllers/Api/EntregaController.php:1695
 * @route '/api/chofer/entregas/{id}/reportar-novedad'
 */
reportarNovedad.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reportarNovedad.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::reportarNovedad
 * @see app/Http/Controllers/Api/EntregaController.php:1695
 * @route '/api/chofer/entregas/{id}/reportar-novedad'
 */
    const reportarNovedadForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reportarNovedad.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::reportarNovedad
 * @see app/Http/Controllers/Api/EntregaController.php:1695
 * @route '/api/chofer/entregas/{id}/reportar-novedad'
 */
        reportarNovedadForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reportarNovedad.url(args, options),
            method: 'post',
        })
    
    reportarNovedad.form = reportarNovedadForm
/**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/chofer/entregas/{id}/ubicacion'
 */
const registrarUbicacionad3754bc340c83999f6ded5b3a54a778 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarUbicacionad3754bc340c83999f6ded5b3a54a778.url(args, options),
    method: 'post',
})

registrarUbicacionad3754bc340c83999f6ded5b3a54a778.definition = {
    methods: ["post"],
    url: '/api/chofer/entregas/{id}/ubicacion',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/chofer/entregas/{id}/ubicacion'
 */
registrarUbicacionad3754bc340c83999f6ded5b3a54a778.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return registrarUbicacionad3754bc340c83999f6ded5b3a54a778.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/chofer/entregas/{id}/ubicacion'
 */
registrarUbicacionad3754bc340c83999f6ded5b3a54a778.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarUbicacionad3754bc340c83999f6ded5b3a54a778.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/chofer/entregas/{id}/ubicacion'
 */
    const registrarUbicacionad3754bc340c83999f6ded5b3a54a778Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarUbicacionad3754bc340c83999f6ded5b3a54a778.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/chofer/entregas/{id}/ubicacion'
 */
        registrarUbicacionad3754bc340c83999f6ded5b3a54a778Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarUbicacionad3754bc340c83999f6ded5b3a54a778.url(args, options),
            method: 'post',
        })
    
    registrarUbicacionad3754bc340c83999f6ded5b3a54a778.form = registrarUbicacionad3754bc340c83999f6ded5b3a54a778Form
    /**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/entregas/{id}/ubicacion'
 */
const registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8.url(args, options),
    method: 'post',
})

registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8.definition = {
    methods: ["post"],
    url: '/api/entregas/{id}/ubicacion',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/entregas/{id}/ubicacion'
 */
registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/entregas/{id}/ubicacion'
 */
registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/entregas/{id}/ubicacion'
 */
    const registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8Form = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1759
 * @route '/api/entregas/{id}/ubicacion'
 */
        registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8Form.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8.url(args, options),
            method: 'post',
        })
    
    registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8.form = registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8Form

export const registrarUbicacion = {
    '/api/chofer/entregas/{id}/ubicacion': registrarUbicacionad3754bc340c83999f6ded5b3a54a778,
    '/api/entregas/{id}/ubicacion': registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8,
}

/**
* @see \App\Http\Controllers\Api\EntregaController::historialEntregas
 * @see app/Http/Controllers/Api/EntregaController.php:1837
 * @route '/api/chofer/historial'
 */
export const historialEntregas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialEntregas.url(options),
    method: 'get',
})

historialEntregas.definition = {
    methods: ["get","head"],
    url: '/api/chofer/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::historialEntregas
 * @see app/Http/Controllers/Api/EntregaController.php:1837
 * @route '/api/chofer/historial'
 */
historialEntregas.url = (options?: RouteQueryOptions) => {
    return historialEntregas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::historialEntregas
 * @see app/Http/Controllers/Api/EntregaController.php:1837
 * @route '/api/chofer/historial'
 */
historialEntregas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialEntregas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::historialEntregas
 * @see app/Http/Controllers/Api/EntregaController.php:1837
 * @route '/api/chofer/historial'
 */
historialEntregas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historialEntregas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::historialEntregas
 * @see app/Http/Controllers/Api/EntregaController.php:1837
 * @route '/api/chofer/historial'
 */
    const historialEntregasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historialEntregas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::historialEntregas
 * @see app/Http/Controllers/Api/EntregaController.php:1837
 * @route '/api/chofer/historial'
 */
        historialEntregasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialEntregas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::historialEntregas
 * @see app/Http/Controllers/Api/EntregaController.php:1837
 * @route '/api/chofer/historial'
 */
        historialEntregasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historialEntregas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historialEntregas.form = historialEntregasForm
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerResumenPagos
 * @see app/Http/Controllers/Api/EntregaController.php:2749
 * @route '/api/chofer/entregas/{id}/resumen-pagos'
 */
export const obtenerResumenPagos = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumenPagos.url(args, options),
    method: 'get',
})

obtenerResumenPagos.definition = {
    methods: ["get","head"],
    url: '/api/chofer/entregas/{id}/resumen-pagos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerResumenPagos
 * @see app/Http/Controllers/Api/EntregaController.php:2749
 * @route '/api/chofer/entregas/{id}/resumen-pagos'
 */
obtenerResumenPagos.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return obtenerResumenPagos.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerResumenPagos
 * @see app/Http/Controllers/Api/EntregaController.php:2749
 * @route '/api/chofer/entregas/{id}/resumen-pagos'
 */
obtenerResumenPagos.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumenPagos.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerResumenPagos
 * @see app/Http/Controllers/Api/EntregaController.php:2749
 * @route '/api/chofer/entregas/{id}/resumen-pagos'
 */
obtenerResumenPagos.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerResumenPagos.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerResumenPagos
 * @see app/Http/Controllers/Api/EntregaController.php:2749
 * @route '/api/chofer/entregas/{id}/resumen-pagos'
 */
    const obtenerResumenPagosForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerResumenPagos.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerResumenPagos
 * @see app/Http/Controllers/Api/EntregaController.php:2749
 * @route '/api/chofer/entregas/{id}/resumen-pagos'
 */
        obtenerResumenPagosForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerResumenPagos.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerResumenPagos
 * @see app/Http/Controllers/Api/EntregaController.php:2749
 * @route '/api/chofer/entregas/{id}/resumen-pagos'
 */
        obtenerResumenPagosForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerResumenPagos.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerResumenPagos.form = obtenerResumenPagosForm
/**
* @see \App\Http\Controllers\Api\EntregaController::entregasDisponiblesParaReasignar
 * @see app/Http/Controllers/Api/EntregaController.php:3568
 * @route '/api/chofer/entregas/{id}/entregas-disponibles'
 */
export const entregasDisponiblesParaReasignar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasDisponiblesParaReasignar.url(args, options),
    method: 'get',
})

entregasDisponiblesParaReasignar.definition = {
    methods: ["get","head"],
    url: '/api/chofer/entregas/{id}/entregas-disponibles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::entregasDisponiblesParaReasignar
 * @see app/Http/Controllers/Api/EntregaController.php:3568
 * @route '/api/chofer/entregas/{id}/entregas-disponibles'
 */
entregasDisponiblesParaReasignar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return entregasDisponiblesParaReasignar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::entregasDisponiblesParaReasignar
 * @see app/Http/Controllers/Api/EntregaController.php:3568
 * @route '/api/chofer/entregas/{id}/entregas-disponibles'
 */
entregasDisponiblesParaReasignar.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasDisponiblesParaReasignar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::entregasDisponiblesParaReasignar
 * @see app/Http/Controllers/Api/EntregaController.php:3568
 * @route '/api/chofer/entregas/{id}/entregas-disponibles'
 */
entregasDisponiblesParaReasignar.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregasDisponiblesParaReasignar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::entregasDisponiblesParaReasignar
 * @see app/Http/Controllers/Api/EntregaController.php:3568
 * @route '/api/chofer/entregas/{id}/entregas-disponibles'
 */
    const entregasDisponiblesParaReasignarForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: entregasDisponiblesParaReasignar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::entregasDisponiblesParaReasignar
 * @see app/Http/Controllers/Api/EntregaController.php:3568
 * @route '/api/chofer/entregas/{id}/entregas-disponibles'
 */
        entregasDisponiblesParaReasignarForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregasDisponiblesParaReasignar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::entregasDisponiblesParaReasignar
 * @see app/Http/Controllers/Api/EntregaController.php:3568
 * @route '/api/chofer/entregas/{id}/entregas-disponibles'
 */
        entregasDisponiblesParaReasignarForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregasDisponiblesParaReasignar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    entregasDisponiblesParaReasignar.form = entregasDisponiblesParaReasignarForm
/**
* @see \App\Http\Controllers\Api\EntregaController::reasignarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3609
 * @route '/api/chofer/entregas/{id}/reasignar-venta'
 */
export const reasignarVenta = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reasignarVenta.url(args, options),
    method: 'put',
})

reasignarVenta.definition = {
    methods: ["put"],
    url: '/api/chofer/entregas/{id}/reasignar-venta',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::reasignarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3609
 * @route '/api/chofer/entregas/{id}/reasignar-venta'
 */
reasignarVenta.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return reasignarVenta.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::reasignarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3609
 * @route '/api/chofer/entregas/{id}/reasignar-venta'
 */
reasignarVenta.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reasignarVenta.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::reasignarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3609
 * @route '/api/chofer/entregas/{id}/reasignar-venta'
 */
    const reasignarVentaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: reasignarVenta.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::reasignarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3609
 * @route '/api/chofer/entregas/{id}/reasignar-venta'
 */
        reasignarVentaForm.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: reasignarVenta.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    reasignarVenta.form = reasignarVentaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerTracking
 * @see app/Http/Controllers/Api/EntregaController.php:1871
 * @route '/api/cliente/pedidos/{proformaId}/tracking'
 */
export const obtenerTracking = (args: { proformaId: string | number } | [proformaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerTracking.url(args, options),
    method: 'get',
})

obtenerTracking.definition = {
    methods: ["get","head"],
    url: '/api/cliente/pedidos/{proformaId}/tracking',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerTracking
 * @see app/Http/Controllers/Api/EntregaController.php:1871
 * @route '/api/cliente/pedidos/{proformaId}/tracking'
 */
obtenerTracking.url = (args: { proformaId: string | number } | [proformaId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proformaId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    proformaId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proformaId: args.proformaId,
                }

    return obtenerTracking.definition.url
            .replace('{proformaId}', parsedArgs.proformaId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerTracking
 * @see app/Http/Controllers/Api/EntregaController.php:1871
 * @route '/api/cliente/pedidos/{proformaId}/tracking'
 */
obtenerTracking.get = (args: { proformaId: string | number } | [proformaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerTracking.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerTracking
 * @see app/Http/Controllers/Api/EntregaController.php:1871
 * @route '/api/cliente/pedidos/{proformaId}/tracking'
 */
obtenerTracking.head = (args: { proformaId: string | number } | [proformaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerTracking.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerTracking
 * @see app/Http/Controllers/Api/EntregaController.php:1871
 * @route '/api/cliente/pedidos/{proformaId}/tracking'
 */
    const obtenerTrackingForm = (args: { proformaId: string | number } | [proformaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerTracking.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerTracking
 * @see app/Http/Controllers/Api/EntregaController.php:1871
 * @route '/api/cliente/pedidos/{proformaId}/tracking'
 */
        obtenerTrackingForm.get = (args: { proformaId: string | number } | [proformaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerTracking.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerTracking
 * @see app/Http/Controllers/Api/EntregaController.php:1871
 * @route '/api/cliente/pedidos/{proformaId}/tracking'
 */
        obtenerTrackingForm.head = (args: { proformaId: string | number } | [proformaId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerTracking.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerTracking.form = obtenerTrackingForm
/**
* @see \App\Http\Controllers\Api\EntregaController::indexAdmin
 * @see app/Http/Controllers/Api/EntregaController.php:1944
 * @route '/api/admin/entregas'
 */
export const indexAdmin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexAdmin.url(options),
    method: 'get',
})

indexAdmin.definition = {
    methods: ["get","head"],
    url: '/api/admin/entregas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::indexAdmin
 * @see app/Http/Controllers/Api/EntregaController.php:1944
 * @route '/api/admin/entregas'
 */
indexAdmin.url = (options?: RouteQueryOptions) => {
    return indexAdmin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::indexAdmin
 * @see app/Http/Controllers/Api/EntregaController.php:1944
 * @route '/api/admin/entregas'
 */
indexAdmin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexAdmin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::indexAdmin
 * @see app/Http/Controllers/Api/EntregaController.php:1944
 * @route '/api/admin/entregas'
 */
indexAdmin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexAdmin.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::indexAdmin
 * @see app/Http/Controllers/Api/EntregaController.php:1944
 * @route '/api/admin/entregas'
 */
    const indexAdminForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: indexAdmin.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::indexAdmin
 * @see app/Http/Controllers/Api/EntregaController.php:1944
 * @route '/api/admin/entregas'
 */
        indexAdminForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexAdmin.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::indexAdmin
 * @see app/Http/Controllers/Api/EntregaController.php:1944
 * @route '/api/admin/entregas'
 */
        indexAdminForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: indexAdmin.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    indexAdmin.form = indexAdminForm
/**
* @see \App\Http\Controllers\Api\EntregaController::asignarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1979
 * @route '/api/admin/entregas/{id}/asignar'
 */
export const asignarEntrega = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: asignarEntrega.url(args, options),
    method: 'post',
})

asignarEntrega.definition = {
    methods: ["post"],
    url: '/api/admin/entregas/{id}/asignar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::asignarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1979
 * @route '/api/admin/entregas/{id}/asignar'
 */
asignarEntrega.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return asignarEntrega.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::asignarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1979
 * @route '/api/admin/entregas/{id}/asignar'
 */
asignarEntrega.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: asignarEntrega.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::asignarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1979
 * @route '/api/admin/entregas/{id}/asignar'
 */
    const asignarEntregaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: asignarEntrega.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::asignarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1979
 * @route '/api/admin/entregas/{id}/asignar'
 */
        asignarEntregaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: asignarEntrega.url(args, options),
            method: 'post',
        })
    
    asignarEntrega.form = asignarEntregaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::entregasActivas
 * @see app/Http/Controllers/Api/EntregaController.php:2020
 * @route '/api/admin/entregas/activas'
 */
export const entregasActivas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasActivas.url(options),
    method: 'get',
})

entregasActivas.definition = {
    methods: ["get","head"],
    url: '/api/admin/entregas/activas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::entregasActivas
 * @see app/Http/Controllers/Api/EntregaController.php:2020
 * @route '/api/admin/entregas/activas'
 */
entregasActivas.url = (options?: RouteQueryOptions) => {
    return entregasActivas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::entregasActivas
 * @see app/Http/Controllers/Api/EntregaController.php:2020
 * @route '/api/admin/entregas/activas'
 */
entregasActivas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasActivas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::entregasActivas
 * @see app/Http/Controllers/Api/EntregaController.php:2020
 * @route '/api/admin/entregas/activas'
 */
entregasActivas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregasActivas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::entregasActivas
 * @see app/Http/Controllers/Api/EntregaController.php:2020
 * @route '/api/admin/entregas/activas'
 */
    const entregasActivasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: entregasActivas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::entregasActivas
 * @see app/Http/Controllers/Api/EntregaController.php:2020
 * @route '/api/admin/entregas/activas'
 */
        entregasActivasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregasActivas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::entregasActivas
 * @see app/Http/Controllers/Api/EntregaController.php:2020
 * @route '/api/admin/entregas/activas'
 */
        entregasActivasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: entregasActivas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    entregasActivas.form = entregasActivasForm
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
export const obtenerUbicaciones = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerUbicaciones.url(args, options),
    method: 'get',
})

obtenerUbicaciones.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{id}/ubicaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
obtenerUbicaciones.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return obtenerUbicaciones.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
obtenerUbicaciones.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerUbicaciones.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
obtenerUbicaciones.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerUbicaciones.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
    const obtenerUbicacionesForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerUbicaciones.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
        obtenerUbicacionesForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerUbicaciones.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerUbicaciones
 * @see app/Http/Controllers/Api/EntregaController.php:0
 * @route '/api/entregas/{id}/ubicaciones'
 */
        obtenerUbicacionesForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerUbicaciones.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerUbicaciones.form = obtenerUbicacionesForm
/**
* @see \App\Http\Controllers\Api\EntregaController::testVentaNotificacion
 * @see app/Http/Controllers/Api/EntregaController.php:43
 * @route '/api/entregas/test-notificacion-venta'
 */
export const testVentaNotificacion = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testVentaNotificacion.url(options),
    method: 'post',
})

testVentaNotificacion.definition = {
    methods: ["post"],
    url: '/api/entregas/test-notificacion-venta',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::testVentaNotificacion
 * @see app/Http/Controllers/Api/EntregaController.php:43
 * @route '/api/entregas/test-notificacion-venta'
 */
testVentaNotificacion.url = (options?: RouteQueryOptions) => {
    return testVentaNotificacion.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::testVentaNotificacion
 * @see app/Http/Controllers/Api/EntregaController.php:43
 * @route '/api/entregas/test-notificacion-venta'
 */
testVentaNotificacion.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testVentaNotificacion.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::testVentaNotificacion
 * @see app/Http/Controllers/Api/EntregaController.php:43
 * @route '/api/entregas/test-notificacion-venta'
 */
    const testVentaNotificacionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testVentaNotificacion.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::testVentaNotificacion
 * @see app/Http/Controllers/Api/EntregaController.php:43
 * @route '/api/entregas/test-notificacion-venta'
 */
        testVentaNotificacionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testVentaNotificacion.url(options),
            method: 'post',
        })
    
    testVentaNotificacion.form = testVentaNotificacionForm
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
* @see \App\Http\Controllers\Api\EntregaController::marcarListoParaEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2081
 * @route '/api/entregas/{id}/listo-para-entrega'
 */
export const marcarListoParaEntrega = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarListoParaEntrega.url(args, options),
    method: 'post',
})

marcarListoParaEntrega.definition = {
    methods: ["post"],
    url: '/api/entregas/{id}/listo-para-entrega',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::marcarListoParaEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2081
 * @route '/api/entregas/{id}/listo-para-entrega'
 */
marcarListoParaEntrega.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return marcarListoParaEntrega.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::marcarListoParaEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2081
 * @route '/api/entregas/{id}/listo-para-entrega'
 */
marcarListoParaEntrega.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarListoParaEntrega.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::marcarListoParaEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2081
 * @route '/api/entregas/{id}/listo-para-entrega'
 */
    const marcarListoParaEntregaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: marcarListoParaEntrega.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::marcarListoParaEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2081
 * @route '/api/entregas/{id}/listo-para-entrega'
 */
        marcarListoParaEntregaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: marcarListoParaEntrega.url(args, options),
            method: 'post',
        })
    
    marcarListoParaEntrega.form = marcarListoParaEntregaForm
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
* @see \App\Http\Controllers\Api\EntregaController::actualizarUbicacionGPS
 * @see app/Http/Controllers/Api/EntregaController.php:2136
 * @route '/api/entregas/{id}/ubicacion-gps'
 */
export const actualizarUbicacionGPS = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarUbicacionGPS.url(args, options),
    method: 'patch',
})

actualizarUbicacionGPS.definition = {
    methods: ["patch"],
    url: '/api/entregas/{id}/ubicacion-gps',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarUbicacionGPS
 * @see app/Http/Controllers/Api/EntregaController.php:2136
 * @route '/api/entregas/{id}/ubicacion-gps'
 */
actualizarUbicacionGPS.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return actualizarUbicacionGPS.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarUbicacionGPS
 * @see app/Http/Controllers/Api/EntregaController.php:2136
 * @route '/api/entregas/{id}/ubicacion-gps'
 */
actualizarUbicacionGPS.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarUbicacionGPS.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::actualizarUbicacionGPS
 * @see app/Http/Controllers/Api/EntregaController.php:2136
 * @route '/api/entregas/{id}/ubicacion-gps'
 */
    const actualizarUbicacionGPSForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarUbicacionGPS.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::actualizarUbicacionGPS
 * @see app/Http/Controllers/Api/EntregaController.php:2136
 * @route '/api/entregas/{id}/ubicacion-gps'
 */
        actualizarUbicacionGPSForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarUbicacionGPS.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarUbicacionGPS.form = actualizarUbicacionGPSForm
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
* @see \App\Http\Controllers\Api\EntregaController::crearEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:2212
 * @route '/api/entregas/crear-consolidada'
 */
export const crearEntregaConsolidada = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearEntregaConsolidada.url(options),
    method: 'post',
})

crearEntregaConsolidada.definition = {
    methods: ["post"],
    url: '/api/entregas/crear-consolidada',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::crearEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:2212
 * @route '/api/entregas/crear-consolidada'
 */
crearEntregaConsolidada.url = (options?: RouteQueryOptions) => {
    return crearEntregaConsolidada.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::crearEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:2212
 * @route '/api/entregas/crear-consolidada'
 */
crearEntregaConsolidada.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearEntregaConsolidada.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::crearEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:2212
 * @route '/api/entregas/crear-consolidada'
 */
    const crearEntregaConsolidadaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: crearEntregaConsolidada.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::crearEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:2212
 * @route '/api/entregas/crear-consolidada'
 */
        crearEntregaConsolidadaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: crearEntregaConsolidada.url(options),
            method: 'post',
        })
    
    crearEntregaConsolidada.form = crearEntregaConsolidadaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:3096
 * @route '/api/entregas/{entrega}'
 */
export const actualizarEntregaConsolidada = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEntregaConsolidada.url(args, options),
    method: 'patch',
})

actualizarEntregaConsolidada.definition = {
    methods: ["patch"],
    url: '/api/entregas/{entrega}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:3096
 * @route '/api/entregas/{entrega}'
 */
actualizarEntregaConsolidada.url = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return actualizarEntregaConsolidada.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:3096
 * @route '/api/entregas/{entrega}'
 */
actualizarEntregaConsolidada.patch = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEntregaConsolidada.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::actualizarEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:3096
 * @route '/api/entregas/{entrega}'
 */
    const actualizarEntregaConsolidadaForm = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarEntregaConsolidada.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::actualizarEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:3096
 * @route '/api/entregas/{entrega}'
 */
        actualizarEntregaConsolidadaForm.patch = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarEntregaConsolidada.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    actualizarEntregaConsolidada.form = actualizarEntregaConsolidadaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::cancelarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2406
 * @route '/api/entregas/{id}/cancelar'
 */
export const cancelarEntrega = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelarEntrega.url(args, options),
    method: 'post',
})

cancelarEntrega.definition = {
    methods: ["post"],
    url: '/api/entregas/{id}/cancelar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::cancelarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2406
 * @route '/api/entregas/{id}/cancelar'
 */
cancelarEntrega.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return cancelarEntrega.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::cancelarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2406
 * @route '/api/entregas/{id}/cancelar'
 */
cancelarEntrega.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelarEntrega.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::cancelarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2406
 * @route '/api/entregas/{id}/cancelar'
 */
    const cancelarEntregaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: cancelarEntrega.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::cancelarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2406
 * @route '/api/entregas/{id}/cancelar'
 */
        cancelarEntregaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: cancelarEntrega.url(args, options),
            method: 'post',
        })
    
    cancelarEntrega.form = cancelarEntregaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVentaCargada
 * @see app/Http/Controllers/Api/EntregaController.php:2545
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
export const confirmarVentaCargada = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarVentaCargada.url(args, options),
    method: 'post',
})

confirmarVentaCargada.definition = {
    methods: ["post"],
    url: '/api/entregas/{id}/confirmar-venta/{venta_id}',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVentaCargada
 * @see app/Http/Controllers/Api/EntregaController.php:2545
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
confirmarVentaCargada.url = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions) => {
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

    return confirmarVentaCargada.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{venta_id}', parsedArgs.venta_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVentaCargada
 * @see app/Http/Controllers/Api/EntregaController.php:2545
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
confirmarVentaCargada.post = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarVentaCargada.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVentaCargada
 * @see app/Http/Controllers/Api/EntregaController.php:2545
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
    const confirmarVentaCargadaForm = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmarVentaCargada.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVentaCargada
 * @see app/Http/Controllers/Api/EntregaController.php:2545
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
        confirmarVentaCargadaForm.post = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmarVentaCargada.url(args, options),
            method: 'post',
        })
    
    confirmarVentaCargada.form = confirmarVentaCargadaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::desmarcarVentaCargada
 * @see app/Http/Controllers/Api/EntregaController.php:2610
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
export const desmarcarVentaCargada = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: desmarcarVentaCargada.url(args, options),
    method: 'delete',
})

desmarcarVentaCargada.definition = {
    methods: ["delete"],
    url: '/api/entregas/{id}/confirmar-venta/{venta_id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::desmarcarVentaCargada
 * @see app/Http/Controllers/Api/EntregaController.php:2610
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
desmarcarVentaCargada.url = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions) => {
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

    return desmarcarVentaCargada.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{venta_id}', parsedArgs.venta_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::desmarcarVentaCargada
 * @see app/Http/Controllers/Api/EntregaController.php:2610
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
desmarcarVentaCargada.delete = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: desmarcarVentaCargada.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::desmarcarVentaCargada
 * @see app/Http/Controllers/Api/EntregaController.php:2610
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
    const desmarcarVentaCargadaForm = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: desmarcarVentaCargada.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::desmarcarVentaCargada
 * @see app/Http/Controllers/Api/EntregaController.php:2610
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
        desmarcarVentaCargadaForm.delete = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: desmarcarVentaCargada.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    desmarcarVentaCargada.form = desmarcarVentaCargadaForm
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerDetalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
export const obtenerDetalles = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetalles.url(args, options),
    method: 'get',
})

obtenerDetalles.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{id}/detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerDetalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
obtenerDetalles.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return obtenerDetalles.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerDetalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
obtenerDetalles.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetalles.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerDetalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
obtenerDetalles.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerDetalles.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerDetalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
    const obtenerDetallesForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerDetalles.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerDetalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
        obtenerDetallesForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDetalles.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerDetalles
 * @see app/Http/Controllers/Api/EntregaController.php:2652
 * @route '/api/entregas/{id}/detalles'
 */
        obtenerDetallesForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerDetalles.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerDetalles.form = obtenerDetallesForm
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerProgreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
export const obtenerProgreso = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerProgreso.url(args, options),
    method: 'get',
})

obtenerProgreso.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{id}/progreso',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerProgreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
obtenerProgreso.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return obtenerProgreso.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerProgreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
obtenerProgreso.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerProgreso.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerProgreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
obtenerProgreso.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerProgreso.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerProgreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
    const obtenerProgresoForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerProgreso.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerProgreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
        obtenerProgresoForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerProgreso.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerProgreso
 * @see app/Http/Controllers/Api/EntregaController.php:2712
 * @route '/api/entregas/{id}/progreso'
 */
        obtenerProgresoForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerProgreso.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerProgreso.form = obtenerProgresoForm
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerLocalidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
export const obtenerLocalidades = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerLocalidades.url(args, options),
    method: 'get',
})

obtenerLocalidades.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{entrega}/localidades',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerLocalidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
obtenerLocalidades.url = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return obtenerLocalidades.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerLocalidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
obtenerLocalidades.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerLocalidades.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerLocalidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
obtenerLocalidades.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerLocalidades.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerLocalidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
    const obtenerLocalidadesForm = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerLocalidades.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerLocalidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
        obtenerLocalidadesForm.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerLocalidades.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EntregaController::obtenerLocalidades
 * @see app/Http/Controllers/Api/EntregaController.php:696
 * @route '/api/entregas/{entrega}/localidades'
 */
        obtenerLocalidadesForm.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerLocalidades.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerLocalidades.form = obtenerLocalidadesForm
/**
* @see \App\Http\Controllers\Api\EntregaController::corregirPagoConfirmacion
 * @see app/Http/Controllers/Api/EntregaController.php:3227
 * @route '/api/entregas/{entrega}/ventas/{venta}/corregir-pago'
 */
export const corregirPagoConfirmacion = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: corregirPagoConfirmacion.url(args, options),
    method: 'patch',
})

corregirPagoConfirmacion.definition = {
    methods: ["patch"],
    url: '/api/entregas/{entrega}/ventas/{venta}/corregir-pago',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::corregirPagoConfirmacion
 * @see app/Http/Controllers/Api/EntregaController.php:3227
 * @route '/api/entregas/{entrega}/ventas/{venta}/corregir-pago'
 */
corregirPagoConfirmacion.url = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions) => {
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

    return corregirPagoConfirmacion.definition.url
            .replace('{entrega}', parsedArgs.entrega.toString())
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::corregirPagoConfirmacion
 * @see app/Http/Controllers/Api/EntregaController.php:3227
 * @route '/api/entregas/{entrega}/ventas/{venta}/corregir-pago'
 */
corregirPagoConfirmacion.patch = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: corregirPagoConfirmacion.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::corregirPagoConfirmacion
 * @see app/Http/Controllers/Api/EntregaController.php:3227
 * @route '/api/entregas/{entrega}/ventas/{venta}/corregir-pago'
 */
    const corregirPagoConfirmacionForm = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: corregirPagoConfirmacion.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::corregirPagoConfirmacion
 * @see app/Http/Controllers/Api/EntregaController.php:3227
 * @route '/api/entregas/{entrega}/ventas/{venta}/corregir-pago'
 */
        corregirPagoConfirmacionForm.patch = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: corregirPagoConfirmacion.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    corregirPagoConfirmacion.form = corregirPagoConfirmacionForm
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
const EntregaController = { obtenerEntregaPorVenta, estadisticasChofer, misTrabjos, entregasAsignadas, showEntrega, iniciarRuta, actualizarEstado, marcarLlegada, confirmarVentaEntregada, actualizarConfirmacionVenta, finalizarEntrega, confirmarEntrega, reportarNovedad, registrarUbicacion, historialEntregas, obtenerResumenPagos, entregasDisponiblesParaReasignar, reasignarVenta, obtenerTracking, indexAdmin, asignarEntrega, entregasActivas, obtenerUbicaciones, testVentaNotificacion, confirmarCarga, marcarListoParaEntrega, iniciarTransito, actualizarUbicacionGPS, consolidarAutomatico, crearEntregaConsolidada, actualizarEntregaConsolidada, cancelarEntrega, confirmarVentaCargada, desmarcarVentaCargada, obtenerDetalles, obtenerProgreso, obtenerLocalidades, corregirPagoConfirmacion, cambiarTipoEntrega }

export default EntregaController