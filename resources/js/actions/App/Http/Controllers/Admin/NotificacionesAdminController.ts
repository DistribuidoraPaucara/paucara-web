import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::index
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:33
 * @route '/admin/notificaciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/notificaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::index
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:33
 * @route '/admin/notificaciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::index
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:33
 * @route '/admin/notificaciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::index
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:33
 * @route '/admin/notificaciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::index
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:33
 * @route '/admin/notificaciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::index
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:33
 * @route '/admin/notificaciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::index
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:33
 * @route '/admin/notificaciones'
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
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::resumen
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:41
 * @route '/admin/notificaciones/data/resumen'
 */
export const resumen = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(options),
    method: 'get',
})

resumen.definition = {
    methods: ["get","head"],
    url: '/admin/notificaciones/data/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::resumen
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:41
 * @route '/admin/notificaciones/data/resumen'
 */
resumen.url = (options?: RouteQueryOptions) => {
    return resumen.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::resumen
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:41
 * @route '/admin/notificaciones/data/resumen'
 */
resumen.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumen.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::resumen
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:41
 * @route '/admin/notificaciones/data/resumen'
 */
resumen.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumen.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::resumen
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:41
 * @route '/admin/notificaciones/data/resumen'
 */
    const resumenForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: resumen.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::resumen
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:41
 * @route '/admin/notificaciones/data/resumen'
 */
        resumenForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::resumen
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:41
 * @route '/admin/notificaciones/data/resumen'
 */
        resumenForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: resumen.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    resumen.form = resumenForm
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::eventos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:93
 * @route '/admin/notificaciones/data/eventos'
 */
export const eventos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventos.url(options),
    method: 'get',
})

eventos.definition = {
    methods: ["get","head"],
    url: '/admin/notificaciones/data/eventos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::eventos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:93
 * @route '/admin/notificaciones/data/eventos'
 */
eventos.url = (options?: RouteQueryOptions) => {
    return eventos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::eventos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:93
 * @route '/admin/notificaciones/data/eventos'
 */
eventos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::eventos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:93
 * @route '/admin/notificaciones/data/eventos'
 */
eventos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eventos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::eventos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:93
 * @route '/admin/notificaciones/data/eventos'
 */
    const eventosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: eventos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::eventos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:93
 * @route '/admin/notificaciones/data/eventos'
 */
        eventosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: eventos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::eventos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:93
 * @route '/admin/notificaciones/data/eventos'
 */
        eventosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: eventos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    eventos.form = eventosForm
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::destinatarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:156
 * @route '/admin/notificaciones/data/eventos/destinatarios'
 */
export const destinatarios = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: destinatarios.url(options),
    method: 'get',
})

destinatarios.definition = {
    methods: ["get","head"],
    url: '/admin/notificaciones/data/eventos/destinatarios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::destinatarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:156
 * @route '/admin/notificaciones/data/eventos/destinatarios'
 */
destinatarios.url = (options?: RouteQueryOptions) => {
    return destinatarios.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::destinatarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:156
 * @route '/admin/notificaciones/data/eventos/destinatarios'
 */
destinatarios.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: destinatarios.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::destinatarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:156
 * @route '/admin/notificaciones/data/eventos/destinatarios'
 */
destinatarios.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: destinatarios.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::destinatarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:156
 * @route '/admin/notificaciones/data/eventos/destinatarios'
 */
    const destinatariosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: destinatarios.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::destinatarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:156
 * @route '/admin/notificaciones/data/eventos/destinatarios'
 */
        destinatariosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: destinatarios.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::destinatarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:156
 * @route '/admin/notificaciones/data/eventos/destinatarios'
 */
        destinatariosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: destinatarios.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    destinatarios.form = destinatariosForm
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::envios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:200
 * @route '/admin/notificaciones/data/envios'
 */
export const envios = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: envios.url(options),
    method: 'get',
})

envios.definition = {
    methods: ["get","head"],
    url: '/admin/notificaciones/data/envios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::envios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:200
 * @route '/admin/notificaciones/data/envios'
 */
envios.url = (options?: RouteQueryOptions) => {
    return envios.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::envios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:200
 * @route '/admin/notificaciones/data/envios'
 */
envios.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: envios.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::envios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:200
 * @route '/admin/notificaciones/data/envios'
 */
envios.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: envios.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::envios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:200
 * @route '/admin/notificaciones/data/envios'
 */
    const enviosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: envios.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::envios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:200
 * @route '/admin/notificaciones/data/envios'
 */
        enviosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: envios.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::envios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:200
 * @route '/admin/notificaciones/data/envios'
 */
        enviosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: envios.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    envios.form = enviosForm
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::dispositivos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:237
 * @route '/admin/notificaciones/data/dispositivos'
 */
export const dispositivos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dispositivos.url(options),
    method: 'get',
})

dispositivos.definition = {
    methods: ["get","head"],
    url: '/admin/notificaciones/data/dispositivos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::dispositivos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:237
 * @route '/admin/notificaciones/data/dispositivos'
 */
dispositivos.url = (options?: RouteQueryOptions) => {
    return dispositivos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::dispositivos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:237
 * @route '/admin/notificaciones/data/dispositivos'
 */
dispositivos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dispositivos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::dispositivos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:237
 * @route '/admin/notificaciones/data/dispositivos'
 */
dispositivos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dispositivos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::dispositivos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:237
 * @route '/admin/notificaciones/data/dispositivos'
 */
    const dispositivosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dispositivos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::dispositivos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:237
 * @route '/admin/notificaciones/data/dispositivos'
 */
        dispositivosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dispositivos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::dispositivos
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:237
 * @route '/admin/notificaciones/data/dispositivos'
 */
        dispositivosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dispositivos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dispositivos.form = dispositivosForm
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::usuarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:273
 * @route '/admin/notificaciones/data/usuarios'
 */
export const usuarios = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: usuarios.url(options),
    method: 'get',
})

usuarios.definition = {
    methods: ["get","head"],
    url: '/admin/notificaciones/data/usuarios',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::usuarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:273
 * @route '/admin/notificaciones/data/usuarios'
 */
usuarios.url = (options?: RouteQueryOptions) => {
    return usuarios.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::usuarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:273
 * @route '/admin/notificaciones/data/usuarios'
 */
usuarios.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: usuarios.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::usuarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:273
 * @route '/admin/notificaciones/data/usuarios'
 */
usuarios.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: usuarios.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::usuarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:273
 * @route '/admin/notificaciones/data/usuarios'
 */
    const usuariosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: usuarios.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::usuarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:273
 * @route '/admin/notificaciones/data/usuarios'
 */
        usuariosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: usuarios.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Admin\NotificacionesAdminController::usuarios
 * @see app/Http/Controllers/Admin/NotificacionesAdminController.php:273
 * @route '/admin/notificaciones/data/usuarios'
 */
        usuariosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: usuarios.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    usuarios.form = usuariosForm
const NotificacionesAdminController = { index, resumen, eventos, destinatarios, envios, dispositivos, usuarios }

export default NotificacionesAdminController