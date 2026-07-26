import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntregaPorVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3550
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
 * @see app/Http/Controllers/Api/EntregaController.php:3550
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
 * @see app/Http/Controllers/Api/EntregaController.php:3550
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
obtenerEntregaPorVenta.get = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerEntregaPorVenta.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerEntregaPorVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3550
 * @route '/api/app/ventas/{ventaId}/entrega'
 */
obtenerEntregaPorVenta.head = (args: { ventaId: string | number } | [ventaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerEntregaPorVenta.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerConfirmacionesVenta
 * @see app/Http/Controllers/Api/EntregaController.php:4090
 * @route '/api/ventas/{venta_id}/entregas-confirmaciones'
 */
export const obtenerConfirmacionesVenta = (args: { venta_id: string | number } | [venta_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerConfirmacionesVenta.url(args, options),
    method: 'get',
})

obtenerConfirmacionesVenta.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta_id}/entregas-confirmaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerConfirmacionesVenta
 * @see app/Http/Controllers/Api/EntregaController.php:4090
 * @route '/api/ventas/{venta_id}/entregas-confirmaciones'
 */
obtenerConfirmacionesVenta.url = (args: { venta_id: string | number } | [venta_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta_id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta_id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta_id: args.venta_id,
                }

    return obtenerConfirmacionesVenta.definition.url
            .replace('{venta_id}', parsedArgs.venta_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerConfirmacionesVenta
 * @see app/Http/Controllers/Api/EntregaController.php:4090
 * @route '/api/ventas/{venta_id}/entregas-confirmaciones'
 */
obtenerConfirmacionesVenta.get = (args: { venta_id: string | number } | [venta_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerConfirmacionesVenta.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerConfirmacionesVenta
 * @see app/Http/Controllers/Api/EntregaController.php:4090
 * @route '/api/ventas/{venta_id}/entregas-confirmaciones'
 */
obtenerConfirmacionesVenta.head = (args: { venta_id: string | number } | [venta_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerConfirmacionesVenta.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacionPorId
 * @see app/Http/Controllers/Api/EntregaController.php:4517
 * @route '/api/confirmaciones/{confirmacion_id}'
 */
const actualizarConfirmacionPorId23a99afcd315f07e4a3ff8920b0c6a82 = (args: { confirmacion_id: string | number } | [confirmacion_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarConfirmacionPorId23a99afcd315f07e4a3ff8920b0c6a82.url(args, options),
    method: 'put',
})

actualizarConfirmacionPorId23a99afcd315f07e4a3ff8920b0c6a82.definition = {
    methods: ["put"],
    url: '/api/confirmaciones/{confirmacion_id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacionPorId
 * @see app/Http/Controllers/Api/EntregaController.php:4517
 * @route '/api/confirmaciones/{confirmacion_id}'
 */
actualizarConfirmacionPorId23a99afcd315f07e4a3ff8920b0c6a82.url = (args: { confirmacion_id: string | number } | [confirmacion_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { confirmacion_id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    confirmacion_id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        confirmacion_id: args.confirmacion_id,
                }

    return actualizarConfirmacionPorId23a99afcd315f07e4a3ff8920b0c6a82.definition.url
            .replace('{confirmacion_id}', parsedArgs.confirmacion_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacionPorId
 * @see app/Http/Controllers/Api/EntregaController.php:4517
 * @route '/api/confirmaciones/{confirmacion_id}'
 */
actualizarConfirmacionPorId23a99afcd315f07e4a3ff8920b0c6a82.put = (args: { confirmacion_id: string | number } | [confirmacion_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarConfirmacionPorId23a99afcd315f07e4a3ff8920b0c6a82.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacionPorId
 * @see app/Http/Controllers/Api/EntregaController.php:4517
 * @route '/api/chofer/confirmaciones/{confirmacion_id}'
 */
const actualizarConfirmacionPorId2046c2a2f0ec4f05ab2be655d085a3ef = (args: { confirmacion_id: string | number } | [confirmacion_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarConfirmacionPorId2046c2a2f0ec4f05ab2be655d085a3ef.url(args, options),
    method: 'put',
})

actualizarConfirmacionPorId2046c2a2f0ec4f05ab2be655d085a3ef.definition = {
    methods: ["put"],
    url: '/api/chofer/confirmaciones/{confirmacion_id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacionPorId
 * @see app/Http/Controllers/Api/EntregaController.php:4517
 * @route '/api/chofer/confirmaciones/{confirmacion_id}'
 */
actualizarConfirmacionPorId2046c2a2f0ec4f05ab2be655d085a3ef.url = (args: { confirmacion_id: string | number } | [confirmacion_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { confirmacion_id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    confirmacion_id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        confirmacion_id: args.confirmacion_id,
                }

    return actualizarConfirmacionPorId2046c2a2f0ec4f05ab2be655d085a3ef.definition.url
            .replace('{confirmacion_id}', parsedArgs.confirmacion_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacionPorId
 * @see app/Http/Controllers/Api/EntregaController.php:4517
 * @route '/api/chofer/confirmaciones/{confirmacion_id}'
 */
actualizarConfirmacionPorId2046c2a2f0ec4f05ab2be655d085a3ef.put = (args: { confirmacion_id: string | number } | [confirmacion_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarConfirmacionPorId2046c2a2f0ec4f05ab2be655d085a3ef.url(args, options),
    method: 'put',
})

export const actualizarConfirmacionPorId = {
    '/api/confirmaciones/{confirmacion_id}': actualizarConfirmacionPorId23a99afcd315f07e4a3ff8920b0c6a82,
    '/api/chofer/confirmaciones/{confirmacion_id}': actualizarConfirmacionPorId2046c2a2f0ec4f05ab2be655d085a3ef,
}

/**
* @see \App\Http\Controllers\Api\EntregaController::estadisticasChofer
 * @see app/Http/Controllers/Api/EntregaController.php:445
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
 * @see app/Http/Controllers/Api/EntregaController.php:445
 * @route '/api/chofer/estadisticas'
 */
estadisticasChofer.url = (options?: RouteQueryOptions) => {
    return estadisticasChofer.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::estadisticasChofer
 * @see app/Http/Controllers/Api/EntregaController.php:445
 * @route '/api/chofer/estadisticas'
 */
estadisticasChofer.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasChofer.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::estadisticasChofer
 * @see app/Http/Controllers/Api/EntregaController.php:445
 * @route '/api/chofer/estadisticas'
 */
estadisticasChofer.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticasChofer.url(options),
    method: 'head',
})

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
* @see \App\Http\Controllers\Api\EntregaController::entregasAsignadas
 * @see app/Http/Controllers/Api/EntregaController.php:602
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
 * @see app/Http/Controllers/Api/EntregaController.php:602
 * @route '/api/chofer/entregas'
 */
entregasAsignadas.url = (options?: RouteQueryOptions) => {
    return entregasAsignadas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::entregasAsignadas
 * @see app/Http/Controllers/Api/EntregaController.php:602
 * @route '/api/chofer/entregas'
 */
entregasAsignadas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasAsignadas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::entregasAsignadas
 * @see app/Http/Controllers/Api/EntregaController.php:602
 * @route '/api/chofer/entregas'
 */
entregasAsignadas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregasAsignadas.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:640
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
 * @see app/Http/Controllers/Api/EntregaController.php:640
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
 * @see app/Http/Controllers/Api/EntregaController.php:640
 * @route '/api/chofer/entregas/{id}'
 */
showEntrega99966fc58ef488bb366bec129ad31105.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showEntrega99966fc58ef488bb366bec129ad31105.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:640
 * @route '/api/chofer/entregas/{id}'
 */
showEntrega99966fc58ef488bb366bec129ad31105.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showEntrega99966fc58ef488bb366bec129ad31105.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:640
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
 * @see app/Http/Controllers/Api/EntregaController.php:640
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
 * @see app/Http/Controllers/Api/EntregaController.php:640
 * @route '/api/entregas/{id}'
 */
showEntrega1e6ef048b02be613ee2091b53c41cf2e.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showEntrega1e6ef048b02be613ee2091b53c41cf2e.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::showEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:640
 * @route '/api/entregas/{id}'
 */
showEntrega1e6ef048b02be613ee2091b53c41cf2e.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showEntrega1e6ef048b02be613ee2091b53c41cf2e.url(args, options),
    method: 'head',
})

export const showEntrega = {
    '/api/chofer/entregas/{id}': showEntrega99966fc58ef488bb366bec129ad31105,
    '/api/entregas/{id}': showEntrega1e6ef048b02be613ee2091b53c41cf2e,
}

/**
* @see \App\Http\Controllers\Api\EntregaController::iniciarRuta
 * @see app/Http/Controllers/Api/EntregaController.php:772
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
 * @see app/Http/Controllers/Api/EntregaController.php:772
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
 * @see app/Http/Controllers/Api/EntregaController.php:772
 * @route '/api/chofer/entregas/{id}/iniciar-ruta'
 */
iniciarRuta.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciarRuta.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarEstado
 * @see app/Http/Controllers/Api/EntregaController.php:864
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
 * @see app/Http/Controllers/Api/EntregaController.php:864
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
 * @see app/Http/Controllers/Api/EntregaController.php:864
 * @route '/api/chofer/entregas/{id}/actualizar-estado'
 */
actualizarEstado.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarEstado.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::marcarLlegada
 * @see app/Http/Controllers/Api/EntregaController.php:915
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
 * @see app/Http/Controllers/Api/EntregaController.php:915
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
 * @see app/Http/Controllers/Api/EntregaController.php:915
 * @route '/api/chofer/entregas/{id}/marcar-llegada'
 */
marcarLlegada.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarLlegada.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVentaEntregada
 * @see app/Http/Controllers/Api/EntregaController.php:982
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
 * @see app/Http/Controllers/Api/EntregaController.php:982
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
 * @see app/Http/Controllers/Api/EntregaController.php:982
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmar-entrega'
 */
confirmarVentaEntregada.post = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarVentaEntregada.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::crearConfirmacion
 * @see app/Http/Controllers/Api/EntregaController.php:4704
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/crear-confirmacion'
 */
export const crearConfirmacion = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearConfirmacion.url(args, options),
    method: 'post',
})

crearConfirmacion.definition = {
    methods: ["post"],
    url: '/api/chofer/entregas/{id}/ventas/{venta_id}/crear-confirmacion',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::crearConfirmacion
 * @see app/Http/Controllers/Api/EntregaController.php:4704
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/crear-confirmacion'
 */
crearConfirmacion.url = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions) => {
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

    return crearConfirmacion.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{venta_id}', parsedArgs.venta_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::crearConfirmacion
 * @see app/Http/Controllers/Api/EntregaController.php:4704
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/crear-confirmacion'
 */
crearConfirmacion.post = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearConfirmacion.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacion
 * @see app/Http/Controllers/Api/EntregaController.php:4988
 * @route '/api/chofer/entregas/confirmaciones/{confirmacion_id}'
 */
export const actualizarConfirmacion = (args: { confirmacion_id: string | number } | [confirmacion_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarConfirmacion.url(args, options),
    method: 'put',
})

actualizarConfirmacion.definition = {
    methods: ["put"],
    url: '/api/chofer/entregas/confirmaciones/{confirmacion_id}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacion
 * @see app/Http/Controllers/Api/EntregaController.php:4988
 * @route '/api/chofer/entregas/confirmaciones/{confirmacion_id}'
 */
actualizarConfirmacion.url = (args: { confirmacion_id: string | number } | [confirmacion_id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { confirmacion_id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    confirmacion_id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        confirmacion_id: args.confirmacion_id,
                }

    return actualizarConfirmacion.definition.url
            .replace('{confirmacion_id}', parsedArgs.confirmacion_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacion
 * @see app/Http/Controllers/Api/EntregaController.php:4988
 * @route '/api/chofer/entregas/confirmaciones/{confirmacion_id}'
 */
actualizarConfirmacion.put = (args: { confirmacion_id: string | number } | [confirmacion_id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarConfirmacion.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarConfirmacionVenta
 * @see app/Http/Controllers/Api/EntregaController.php:1363
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
 * @see app/Http/Controllers/Api/EntregaController.php:1363
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
 * @see app/Http/Controllers/Api/EntregaController.php:1363
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}/confirmaciones/{confirmacion_id}'
 */
actualizarConfirmacionVenta.put = (args: { id: string | number, venta_id: string | number, confirmacion_id: string | number } | [id: string | number, venta_id: string | number, confirmacion_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: actualizarConfirmacionVenta.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::finalizarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1619
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
 * @see app/Http/Controllers/Api/EntregaController.php:1619
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
 * @see app/Http/Controllers/Api/EntregaController.php:1619
 * @route '/api/chofer/entregas/{id}/finalizar-entrega'
 */
finalizarEntrega.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: finalizarEntrega.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:1739
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
 * @see app/Http/Controllers/Api/EntregaController.php:1739
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
 * @see app/Http/Controllers/Api/EntregaController.php:1739
 * @route '/api/chofer/entregas/{id}/confirmar-entrega'
 */
confirmarEntrega.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarEntrega.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::reportarNovedad
 * @see app/Http/Controllers/Api/EntregaController.php:1813
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
 * @see app/Http/Controllers/Api/EntregaController.php:1813
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
 * @see app/Http/Controllers/Api/EntregaController.php:1813
 * @route '/api/chofer/entregas/{id}/reportar-novedad'
 */
reportarNovedad.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: reportarNovedad.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1877
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
 * @see app/Http/Controllers/Api/EntregaController.php:1877
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
 * @see app/Http/Controllers/Api/EntregaController.php:1877
 * @route '/api/chofer/entregas/{id}/ubicacion'
 */
registrarUbicacionad3754bc340c83999f6ded5b3a54a778.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarUbicacionad3754bc340c83999f6ded5b3a54a778.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::registrarUbicacion
 * @see app/Http/Controllers/Api/EntregaController.php:1877
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
 * @see app/Http/Controllers/Api/EntregaController.php:1877
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
 * @see app/Http/Controllers/Api/EntregaController.php:1877
 * @route '/api/entregas/{id}/ubicacion'
 */
registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8.url(args, options),
    method: 'post',
})

export const registrarUbicacion = {
    '/api/chofer/entregas/{id}/ubicacion': registrarUbicacionad3754bc340c83999f6ded5b3a54a778,
    '/api/entregas/{id}/ubicacion': registrarUbicacion079f6e0dafb99bdbbd8d8c46cc96bcc8,
}

/**
* @see \App\Http\Controllers\Api\EntregaController::historialEntregas
 * @see app/Http/Controllers/Api/EntregaController.php:1955
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
 * @see app/Http/Controllers/Api/EntregaController.php:1955
 * @route '/api/chofer/historial'
 */
historialEntregas.url = (options?: RouteQueryOptions) => {
    return historialEntregas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::historialEntregas
 * @see app/Http/Controllers/Api/EntregaController.php:1955
 * @route '/api/chofer/historial'
 */
historialEntregas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historialEntregas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::historialEntregas
 * @see app/Http/Controllers/Api/EntregaController.php:1955
 * @route '/api/chofer/historial'
 */
historialEntregas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historialEntregas.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerResumenPagos
 * @see app/Http/Controllers/Api/EntregaController.php:2898
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
 * @see app/Http/Controllers/Api/EntregaController.php:2898
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
 * @see app/Http/Controllers/Api/EntregaController.php:2898
 * @route '/api/chofer/entregas/{id}/resumen-pagos'
 */
obtenerResumenPagos.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumenPagos.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerResumenPagos
 * @see app/Http/Controllers/Api/EntregaController.php:2898
 * @route '/api/chofer/entregas/{id}/resumen-pagos'
 */
obtenerResumenPagos.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerResumenPagos.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::entregasDisponiblesParaReasignar
 * @see app/Http/Controllers/Api/EntregaController.php:3799
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
 * @see app/Http/Controllers/Api/EntregaController.php:3799
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
 * @see app/Http/Controllers/Api/EntregaController.php:3799
 * @route '/api/chofer/entregas/{id}/entregas-disponibles'
 */
entregasDisponiblesParaReasignar.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasDisponiblesParaReasignar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::entregasDisponiblesParaReasignar
 * @see app/Http/Controllers/Api/EntregaController.php:3799
 * @route '/api/chofer/entregas/{id}/entregas-disponibles'
 */
entregasDisponiblesParaReasignar.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregasDisponiblesParaReasignar.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::reasignarVenta
 * @see app/Http/Controllers/Api/EntregaController.php:3861
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
 * @see app/Http/Controllers/Api/EntregaController.php:3861
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
 * @see app/Http/Controllers/Api/EntregaController.php:3861
 * @route '/api/chofer/entregas/{id}/reasignar-venta'
 */
reasignarVenta.put = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: reasignarVenta.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::quitarVentaDeEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3996
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}'
 */
export const quitarVentaDeEntrega = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: quitarVentaDeEntrega.url(args, options),
    method: 'delete',
})

quitarVentaDeEntrega.definition = {
    methods: ["delete"],
    url: '/api/chofer/entregas/{id}/ventas/{venta_id}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::quitarVentaDeEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3996
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}'
 */
quitarVentaDeEntrega.url = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions) => {
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

    return quitarVentaDeEntrega.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace('{venta_id}', parsedArgs.venta_id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::quitarVentaDeEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3996
 * @route '/api/chofer/entregas/{id}/ventas/{venta_id}'
 */
quitarVentaDeEntrega.delete = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: quitarVentaDeEntrega.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerTracking
 * @see app/Http/Controllers/Api/EntregaController.php:1989
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
 * @see app/Http/Controllers/Api/EntregaController.php:1989
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
 * @see app/Http/Controllers/Api/EntregaController.php:1989
 * @route '/api/cliente/pedidos/{proformaId}/tracking'
 */
obtenerTracking.get = (args: { proformaId: string | number } | [proformaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerTracking.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerTracking
 * @see app/Http/Controllers/Api/EntregaController.php:1989
 * @route '/api/cliente/pedidos/{proformaId}/tracking'
 */
obtenerTracking.head = (args: { proformaId: string | number } | [proformaId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerTracking.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::indexAdmin
 * @see app/Http/Controllers/Api/EntregaController.php:2062
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
 * @see app/Http/Controllers/Api/EntregaController.php:2062
 * @route '/api/admin/entregas'
 */
indexAdmin.url = (options?: RouteQueryOptions) => {
    return indexAdmin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::indexAdmin
 * @see app/Http/Controllers/Api/EntregaController.php:2062
 * @route '/api/admin/entregas'
 */
indexAdmin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexAdmin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::indexAdmin
 * @see app/Http/Controllers/Api/EntregaController.php:2062
 * @route '/api/admin/entregas'
 */
indexAdmin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexAdmin.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::asignarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2097
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
 * @see app/Http/Controllers/Api/EntregaController.php:2097
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
 * @see app/Http/Controllers/Api/EntregaController.php:2097
 * @route '/api/admin/entregas/{id}/asignar'
 */
asignarEntrega.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: asignarEntrega.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::entregasActivas
 * @see app/Http/Controllers/Api/EntregaController.php:2138
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
 * @see app/Http/Controllers/Api/EntregaController.php:2138
 * @route '/api/admin/entregas/activas'
 */
entregasActivas.url = (options?: RouteQueryOptions) => {
    return entregasActivas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::entregasActivas
 * @see app/Http/Controllers/Api/EntregaController.php:2138
 * @route '/api/admin/entregas/activas'
 */
entregasActivas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: entregasActivas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::entregasActivas
 * @see app/Http/Controllers/Api/EntregaController.php:2138
 * @route '/api/admin/entregas/activas'
 */
entregasActivas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: entregasActivas.url(options),
    method: 'head',
})

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
* @see \App\Http\Controllers\Api\EntregaController::confirmarCarga
 * @see app/Http/Controllers/Api/EntregaController.php:2176
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
 * @see app/Http/Controllers/Api/EntregaController.php:2176
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
 * @see app/Http/Controllers/Api/EntregaController.php:2176
 * @route '/api/entregas/{id}/confirmar-carga'
 */
confirmarCarga.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarCarga.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::marcarListoParaEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2199
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
 * @see app/Http/Controllers/Api/EntregaController.php:2199
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
 * @see app/Http/Controllers/Api/EntregaController.php:2199
 * @route '/api/entregas/{id}/listo-para-entrega'
 */
marcarListoParaEntrega.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: marcarListoParaEntrega.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::iniciarTransito
 * @see app/Http/Controllers/Api/EntregaController.php:2253
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
 * @see app/Http/Controllers/Api/EntregaController.php:2253
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
 * @see app/Http/Controllers/Api/EntregaController.php:2253
 * @route '/api/entregas/{id}/iniciar-transito'
 */
iniciarTransito.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: iniciarTransito.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarUbicacionGPS
 * @see app/Http/Controllers/Api/EntregaController.php:2285
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
 * @see app/Http/Controllers/Api/EntregaController.php:2285
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
 * @see app/Http/Controllers/Api/EntregaController.php:2285
 * @route '/api/entregas/{id}/ubicacion-gps'
 */
actualizarUbicacionGPS.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarUbicacionGPS.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::consolidarAutomatico
 * @see app/Http/Controllers/Api/EntregaController.php:2325
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
 * @see app/Http/Controllers/Api/EntregaController.php:2325
 * @route '/api/entregas/consolidar-automatico'
 */
consolidarAutomatico.url = (options?: RouteQueryOptions) => {
    return consolidarAutomatico.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::consolidarAutomatico
 * @see app/Http/Controllers/Api/EntregaController.php:2325
 * @route '/api/entregas/consolidar-automatico'
 */
consolidarAutomatico.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: consolidarAutomatico.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::crearEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:2361
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
 * @see app/Http/Controllers/Api/EntregaController.php:2361
 * @route '/api/entregas/crear-consolidada'
 */
crearEntregaConsolidada.url = (options?: RouteQueryOptions) => {
    return crearEntregaConsolidada.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::crearEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:2361
 * @route '/api/entregas/crear-consolidada'
 */
crearEntregaConsolidada.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: crearEntregaConsolidada.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::actualizarEntregaConsolidada
 * @see app/Http/Controllers/Api/EntregaController.php:3259
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
 * @see app/Http/Controllers/Api/EntregaController.php:3259
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
 * @see app/Http/Controllers/Api/EntregaController.php:3259
 * @route '/api/entregas/{entrega}'
 */
actualizarEntregaConsolidada.patch = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: actualizarEntregaConsolidada.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::cancelarEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:2555
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
 * @see app/Http/Controllers/Api/EntregaController.php:2555
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
 * @see app/Http/Controllers/Api/EntregaController.php:2555
 * @route '/api/entregas/{id}/cancelar'
 */
cancelarEntrega.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: cancelarEntrega.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::confirmarVentaCargada
 * @see app/Http/Controllers/Api/EntregaController.php:2694
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
 * @see app/Http/Controllers/Api/EntregaController.php:2694
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
 * @see app/Http/Controllers/Api/EntregaController.php:2694
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
confirmarVentaCargada.post = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmarVentaCargada.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::desmarcarVentaCargada
 * @see app/Http/Controllers/Api/EntregaController.php:2759
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
 * @see app/Http/Controllers/Api/EntregaController.php:2759
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
 * @see app/Http/Controllers/Api/EntregaController.php:2759
 * @route '/api/entregas/{id}/confirmar-venta/{venta_id}'
 */
desmarcarVentaCargada.delete = (args: { id: string | number, venta_id: string | number } | [id: string | number, venta_id: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: desmarcarVentaCargada.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerDetalles
 * @see app/Http/Controllers/Api/EntregaController.php:2801
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
 * @see app/Http/Controllers/Api/EntregaController.php:2801
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
 * @see app/Http/Controllers/Api/EntregaController.php:2801
 * @route '/api/entregas/{id}/detalles'
 */
obtenerDetalles.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerDetalles.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerDetalles
 * @see app/Http/Controllers/Api/EntregaController.php:2801
 * @route '/api/entregas/{id}/detalles'
 */
obtenerDetalles.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerDetalles.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerProgreso
 * @see app/Http/Controllers/Api/EntregaController.php:2861
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
 * @see app/Http/Controllers/Api/EntregaController.php:2861
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
 * @see app/Http/Controllers/Api/EntregaController.php:2861
 * @route '/api/entregas/{id}/progreso'
 */
obtenerProgreso.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerProgreso.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerProgreso
 * @see app/Http/Controllers/Api/EntregaController.php:2861
 * @route '/api/entregas/{id}/progreso'
 */
obtenerProgreso.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerProgreso.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerLocalidades
 * @see app/Http/Controllers/Api/EntregaController.php:729
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
 * @see app/Http/Controllers/Api/EntregaController.php:729
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
 * @see app/Http/Controllers/Api/EntregaController.php:729
 * @route '/api/entregas/{entrega}/localidades'
 */
obtenerLocalidades.get = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerLocalidades.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::obtenerLocalidades
 * @see app/Http/Controllers/Api/EntregaController.php:729
 * @route '/api/entregas/{entrega}/localidades'
 */
obtenerLocalidades.head = (args: { entrega: number | { id: number } } | [entrega: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerLocalidades.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::corregirPagoConfirmacion
 * @see app/Http/Controllers/Api/EntregaController.php:3458
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
 * @see app/Http/Controllers/Api/EntregaController.php:3458
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
 * @see app/Http/Controllers/Api/EntregaController.php:3458
 * @route '/api/entregas/{entrega}/ventas/{venta}/corregir-pago'
 */
corregirPagoConfirmacion.patch = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: corregirPagoConfirmacion.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::cambiarTipoEntrega
 * @see app/Http/Controllers/Api/EntregaController.php:3642
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
 * @see app/Http/Controllers/Api/EntregaController.php:3642
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
 * @see app/Http/Controllers/Api/EntregaController.php:3642
 * @route '/api/entregas/{entrega}/ventas/{venta}/cambiar-tipo-entrega'
 */
cambiarTipoEntrega.patch = (args: { entrega: string | number, venta: string | number } | [entrega: string | number, venta: string | number ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: cambiarTipoEntrega.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Api\EntregaController::ventasResumidas
 * @see app/Http/Controllers/Api/EntregaController.php:4275
 * @route '/api/entregas/{id}/ventas-resumidas'
 */
export const ventasResumidas = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ventasResumidas.url(args, options),
    method: 'get',
})

ventasResumidas.definition = {
    methods: ["get","head"],
    url: '/api/entregas/{id}/ventas-resumidas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::ventasResumidas
 * @see app/Http/Controllers/Api/EntregaController.php:4275
 * @route '/api/entregas/{id}/ventas-resumidas'
 */
ventasResumidas.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return ventasResumidas.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::ventasResumidas
 * @see app/Http/Controllers/Api/EntregaController.php:4275
 * @route '/api/entregas/{id}/ventas-resumidas'
 */
ventasResumidas.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ventasResumidas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EntregaController::ventasResumidas
 * @see app/Http/Controllers/Api/EntregaController.php:4275
 * @route '/api/entregas/{id}/ventas-resumidas'
 */
ventasResumidas.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ventasResumidas.url(args, options),
    method: 'head',
})
const EntregaController = { obtenerEntregaPorVenta, obtenerConfirmacionesVenta, actualizarConfirmacionPorId, estadisticasChofer, misTrabjos, entregasAsignadas, showEntrega, iniciarRuta, actualizarEstado, marcarLlegada, confirmarVentaEntregada, crearConfirmacion, actualizarConfirmacion, actualizarConfirmacionVenta, finalizarEntrega, confirmarEntrega, reportarNovedad, registrarUbicacion, historialEntregas, obtenerResumenPagos, entregasDisponiblesParaReasignar, reasignarVenta, quitarVentaDeEntrega, obtenerTracking, indexAdmin, asignarEntrega, entregasActivas, obtenerUbicaciones, testVentaNotificacion, confirmarCarga, marcarListoParaEntrega, iniciarTransito, actualizarUbicacionGPS, consolidarAutomatico, crearEntregaConsolidada, actualizarEntregaConsolidada, cancelarEntrega, confirmarVentaCargada, desmarcarVentaCargada, obtenerDetalles, obtenerProgreso, obtenerLocalidades, corregirPagoConfirmacion, cambiarTipoEntrega, ventasResumidas }

export default EntregaController