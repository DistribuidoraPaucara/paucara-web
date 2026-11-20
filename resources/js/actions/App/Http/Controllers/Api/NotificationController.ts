import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:30
 * @route '/api/mis-notificaciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/mis-notificaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:30
 * @route '/api/mis-notificaciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:30
 * @route '/api/mis-notificaciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:30
 * @route '/api/mis-notificaciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:30
 * @route '/api/mis-notificaciones'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:30
 * @route '/api/mis-notificaciones'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:30
 * @route '/api/mis-notificaciones'
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
* @see \App\Http\Controllers\Api\NotificationController::bandeja
 * @see app/Http/Controllers/Api/NotificationController.php:65
 * @route '/api/mis-notificaciones/bandeja'
 */
export const bandeja = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bandeja.url(options),
    method: 'get',
})

bandeja.definition = {
    methods: ["get","head"],
    url: '/api/mis-notificaciones/bandeja',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::bandeja
 * @see app/Http/Controllers/Api/NotificationController.php:65
 * @route '/api/mis-notificaciones/bandeja'
 */
bandeja.url = (options?: RouteQueryOptions) => {
    return bandeja.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::bandeja
 * @see app/Http/Controllers/Api/NotificationController.php:65
 * @route '/api/mis-notificaciones/bandeja'
 */
bandeja.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: bandeja.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::bandeja
 * @see app/Http/Controllers/Api/NotificationController.php:65
 * @route '/api/mis-notificaciones/bandeja'
 */
bandeja.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: bandeja.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::bandeja
 * @see app/Http/Controllers/Api/NotificationController.php:65
 * @route '/api/mis-notificaciones/bandeja'
 */
    const bandejaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: bandeja.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::bandeja
 * @see app/Http/Controllers/Api/NotificationController.php:65
 * @route '/api/mis-notificaciones/bandeja'
 */
        bandejaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bandeja.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificationController::bandeja
 * @see app/Http/Controllers/Api/NotificationController.php:65
 * @route '/api/mis-notificaciones/bandeja'
 */
        bandejaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: bandeja.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    bandeja.form = bandejaForm
/**
* @see \App\Http\Controllers\Api\NotificationController::historial
 * @see app/Http/Controllers/Api/NotificationController.php:100
 * @route '/api/mis-notificaciones/historial'
 */
export const historial = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})

historial.definition = {
    methods: ["get","head"],
    url: '/api/mis-notificaciones/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::historial
 * @see app/Http/Controllers/Api/NotificationController.php:100
 * @route '/api/mis-notificaciones/historial'
 */
historial.url = (options?: RouteQueryOptions) => {
    return historial.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::historial
 * @see app/Http/Controllers/Api/NotificationController.php:100
 * @route '/api/mis-notificaciones/historial'
 */
historial.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: historial.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::historial
 * @see app/Http/Controllers/Api/NotificationController.php:100
 * @route '/api/mis-notificaciones/historial'
 */
historial.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: historial.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::historial
 * @see app/Http/Controllers/Api/NotificationController.php:100
 * @route '/api/mis-notificaciones/historial'
 */
    const historialForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: historial.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::historial
 * @see app/Http/Controllers/Api/NotificationController.php:100
 * @route '/api/mis-notificaciones/historial'
 */
        historialForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historial.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificationController::historial
 * @see app/Http/Controllers/Api/NotificationController.php:100
 * @route '/api/mis-notificaciones/historial'
 */
        historialForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: historial.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    historial.form = historialForm
/**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:148
 * @route '/api/mis-notificaciones/no-leidas'
 */
export const unread = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unread.url(options),
    method: 'get',
})

unread.definition = {
    methods: ["get","head"],
    url: '/api/mis-notificaciones/no-leidas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:148
 * @route '/api/mis-notificaciones/no-leidas'
 */
unread.url = (options?: RouteQueryOptions) => {
    return unread.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:148
 * @route '/api/mis-notificaciones/no-leidas'
 */
unread.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unread.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:148
 * @route '/api/mis-notificaciones/no-leidas'
 */
unread.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unread.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:148
 * @route '/api/mis-notificaciones/no-leidas'
 */
    const unreadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: unread.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:148
 * @route '/api/mis-notificaciones/no-leidas'
 */
        unreadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: unread.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:148
 * @route '/api/mis-notificaciones/no-leidas'
 */
        unreadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: unread.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    unread.form = unreadForm
/**
* @see \App\Http\Controllers\Api\NotificationController::stats
 * @see app/Http/Controllers/Api/NotificationController.php:354
 * @route '/api/mis-notificaciones/estadisticas'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/api/mis-notificaciones/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::stats
 * @see app/Http/Controllers/Api/NotificationController.php:354
 * @route '/api/mis-notificaciones/estadisticas'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::stats
 * @see app/Http/Controllers/Api/NotificationController.php:354
 * @route '/api/mis-notificaciones/estadisticas'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::stats
 * @see app/Http/Controllers/Api/NotificationController.php:354
 * @route '/api/mis-notificaciones/estadisticas'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::stats
 * @see app/Http/Controllers/Api/NotificationController.php:354
 * @route '/api/mis-notificaciones/estadisticas'
 */
    const statsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: stats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::stats
 * @see app/Http/Controllers/Api/NotificationController.php:354
 * @route '/api/mis-notificaciones/estadisticas'
 */
        statsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificationController::stats
 * @see app/Http/Controllers/Api/NotificationController.php:354
 * @route '/api/mis-notificaciones/estadisticas'
 */
        statsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: stats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    stats.form = statsForm
/**
* @see \App\Http\Controllers\Api\NotificationController::byType
 * @see app/Http/Controllers/Api/NotificationController.php:422
 * @route '/api/mis-notificaciones/por-tipo/{type}'
 */
export const byType = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byType.url(args, options),
    method: 'get',
})

byType.definition = {
    methods: ["get","head"],
    url: '/api/mis-notificaciones/por-tipo/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::byType
 * @see app/Http/Controllers/Api/NotificationController.php:422
 * @route '/api/mis-notificaciones/por-tipo/{type}'
 */
byType.url = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { type: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    type: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        type: args.type,
                }

    return byType.definition.url
            .replace('{type}', parsedArgs.type.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::byType
 * @see app/Http/Controllers/Api/NotificationController.php:422
 * @route '/api/mis-notificaciones/por-tipo/{type}'
 */
byType.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byType.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::byType
 * @see app/Http/Controllers/Api/NotificationController.php:422
 * @route '/api/mis-notificaciones/por-tipo/{type}'
 */
byType.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byType.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::byType
 * @see app/Http/Controllers/Api/NotificationController.php:422
 * @route '/api/mis-notificaciones/por-tipo/{type}'
 */
    const byTypeForm = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: byType.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::byType
 * @see app/Http/Controllers/Api/NotificationController.php:422
 * @route '/api/mis-notificaciones/por-tipo/{type}'
 */
        byTypeForm.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byType.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificationController::byType
 * @see app/Http/Controllers/Api/NotificationController.php:422
 * @route '/api/mis-notificaciones/por-tipo/{type}'
 */
        byTypeForm.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: byType.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    byType.form = byTypeForm
/**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:256
 * @route '/api/mis-notificaciones/marcar-todas-leidas'
 */
export const markAllAsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

markAllAsRead.definition = {
    methods: ["post"],
    url: '/api/mis-notificaciones/marcar-todas-leidas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:256
 * @route '/api/mis-notificaciones/marcar-todas-leidas'
 */
markAllAsRead.url = (options?: RouteQueryOptions) => {
    return markAllAsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:256
 * @route '/api/mis-notificaciones/marcar-todas-leidas'
 */
markAllAsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:256
 * @route '/api/mis-notificaciones/marcar-todas-leidas'
 */
    const markAllAsReadForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAllAsRead.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:256
 * @route '/api/mis-notificaciones/marcar-todas-leidas'
 */
        markAllAsReadForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAllAsRead.url(options),
            method: 'post',
        })
    
    markAllAsRead.form = markAllAsReadForm
/**
* @see \App\Http\Controllers\Api\NotificationController::destroyAll
 * @see app/Http/Controllers/Api/NotificationController.php:322
 * @route '/api/mis-notificaciones/eliminar-todas'
 */
export const destroyAll = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

destroyAll.definition = {
    methods: ["delete"],
    url: '/api/mis-notificaciones/eliminar-todas',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::destroyAll
 * @see app/Http/Controllers/Api/NotificationController.php:322
 * @route '/api/mis-notificaciones/eliminar-todas'
 */
destroyAll.url = (options?: RouteQueryOptions) => {
    return destroyAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::destroyAll
 * @see app/Http/Controllers/Api/NotificationController.php:322
 * @route '/api/mis-notificaciones/eliminar-todas'
 */
destroyAll.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::destroyAll
 * @see app/Http/Controllers/Api/NotificationController.php:322
 * @route '/api/mis-notificaciones/eliminar-todas'
 */
    const destroyAllForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroyAll.url({
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::destroyAll
 * @see app/Http/Controllers/Api/NotificationController.php:322
 * @route '/api/mis-notificaciones/eliminar-todas'
 */
        destroyAllForm.delete = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroyAll.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroyAll.form = destroyAllForm
/**
* @see \App\Http\Controllers\Api\NotificationController::show
 * @see app/Http/Controllers/Api/NotificationController.php:463
 * @route '/api/mis-notificaciones/{notification}'
 */
export const show = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/mis-notificaciones/{notification}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::show
 * @see app/Http/Controllers/Api/NotificationController.php:463
 * @route '/api/mis-notificaciones/{notification}'
 */
show.url = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return show.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::show
 * @see app/Http/Controllers/Api/NotificationController.php:463
 * @route '/api/mis-notificaciones/{notification}'
 */
show.get = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::show
 * @see app/Http/Controllers/Api/NotificationController.php:463
 * @route '/api/mis-notificaciones/{notification}'
 */
show.head = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::show
 * @see app/Http/Controllers/Api/NotificationController.php:463
 * @route '/api/mis-notificaciones/{notification}'
 */
    const showForm = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::show
 * @see app/Http/Controllers/Api/NotificationController.php:463
 * @route '/api/mis-notificaciones/{notification}'
 */
        showForm.get = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\NotificationController::show
 * @see app/Http/Controllers/Api/NotificationController.php:463
 * @route '/api/mis-notificaciones/{notification}'
 */
        showForm.head = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:180
 * @route '/api/mis-notificaciones/{notification}/marcar-leida'
 */
export const markAsRead = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

markAsRead.definition = {
    methods: ["post"],
    url: '/api/mis-notificaciones/{notification}/marcar-leida',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:180
 * @route '/api/mis-notificaciones/{notification}/marcar-leida'
 */
markAsRead.url = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return markAsRead.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:180
 * @route '/api/mis-notificaciones/{notification}/marcar-leida'
 */
markAsRead.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:180
 * @route '/api/mis-notificaciones/{notification}/marcar-leida'
 */
    const markAsReadForm = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsRead.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:180
 * @route '/api/mis-notificaciones/{notification}/marcar-leida'
 */
        markAsReadForm.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsRead.url(args, options),
            method: 'post',
        })
    
    markAsRead.form = markAsReadForm
/**
* @see \App\Http\Controllers\Api\NotificationController::markAsUnread
 * @see app/Http/Controllers/Api/NotificationController.php:218
 * @route '/api/mis-notificaciones/{notification}/marcar-no-leida'
 */
export const markAsUnread = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsUnread.url(args, options),
    method: 'post',
})

markAsUnread.definition = {
    methods: ["post"],
    url: '/api/mis-notificaciones/{notification}/marcar-no-leida',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsUnread
 * @see app/Http/Controllers/Api/NotificationController.php:218
 * @route '/api/mis-notificaciones/{notification}/marcar-no-leida'
 */
markAsUnread.url = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return markAsUnread.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsUnread
 * @see app/Http/Controllers/Api/NotificationController.php:218
 * @route '/api/mis-notificaciones/{notification}/marcar-no-leida'
 */
markAsUnread.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsUnread.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::markAsUnread
 * @see app/Http/Controllers/Api/NotificationController.php:218
 * @route '/api/mis-notificaciones/{notification}/marcar-no-leida'
 */
    const markAsUnreadForm = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: markAsUnread.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::markAsUnread
 * @see app/Http/Controllers/Api/NotificationController.php:218
 * @route '/api/mis-notificaciones/{notification}/marcar-no-leida'
 */
        markAsUnreadForm.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: markAsUnread.url(args, options),
            method: 'post',
        })
    
    markAsUnread.form = markAsUnreadForm
/**
* @see \App\Http\Controllers\Api\NotificationController::destroy
 * @see app/Http/Controllers/Api/NotificationController.php:285
 * @route '/api/mis-notificaciones/{notification}'
 */
export const destroy = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/mis-notificaciones/{notification}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::destroy
 * @see app/Http/Controllers/Api/NotificationController.php:285
 * @route '/api/mis-notificaciones/{notification}'
 */
destroy.url = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { notification: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { notification: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    notification: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        notification: typeof args.notification === 'object'
                ? args.notification.id
                : args.notification,
                }

    return destroy.definition.url
            .replace('{notification}', parsedArgs.notification.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::destroy
 * @see app/Http/Controllers/Api/NotificationController.php:285
 * @route '/api/mis-notificaciones/{notification}'
 */
destroy.delete = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\Api\NotificationController::destroy
 * @see app/Http/Controllers/Api/NotificationController.php:285
 * @route '/api/mis-notificaciones/{notification}'
 */
    const destroyForm = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\NotificationController::destroy
 * @see app/Http/Controllers/Api/NotificationController.php:285
 * @route '/api/mis-notificaciones/{notification}'
 */
        destroyForm.delete = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
const NotificationController = { index, bandeja, historial, unread, stats, byType, markAllAsRead, destroyAll, show, markAsRead, markAsUnread, destroy }

export default NotificationController