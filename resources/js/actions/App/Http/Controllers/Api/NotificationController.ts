import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:29
 * @route '/api/notificaciones'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:29
 * @route '/api/notificaciones'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:29
 * @route '/api/notificaciones'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::index
 * @see app/Http/Controllers/Api/NotificationController.php:29
 * @route '/api/notificaciones'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:64
 * @route '/api/notificaciones/no-leidas'
 */
export const unread = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unread.url(options),
    method: 'get',
})

unread.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/no-leidas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:64
 * @route '/api/notificaciones/no-leidas'
 */
unread.url = (options?: RouteQueryOptions) => {
    return unread.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:64
 * @route '/api/notificaciones/no-leidas'
 */
unread.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: unread.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::unread
 * @see app/Http/Controllers/Api/NotificationController.php:64
 * @route '/api/notificaciones/no-leidas'
 */
unread.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: unread.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::stats
 * @see app/Http/Controllers/Api/NotificationController.php:270
 * @route '/api/notificaciones/estadisticas'
 */
export const stats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})

stats.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::stats
 * @see app/Http/Controllers/Api/NotificationController.php:270
 * @route '/api/notificaciones/estadisticas'
 */
stats.url = (options?: RouteQueryOptions) => {
    return stats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::stats
 * @see app/Http/Controllers/Api/NotificationController.php:270
 * @route '/api/notificaciones/estadisticas'
 */
stats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: stats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::stats
 * @see app/Http/Controllers/Api/NotificationController.php:270
 * @route '/api/notificaciones/estadisticas'
 */
stats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: stats.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::byType
 * @see app/Http/Controllers/Api/NotificationController.php:299
 * @route '/api/notificaciones/por-tipo/{type}'
 */
export const byType = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byType.url(args, options),
    method: 'get',
})

byType.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/por-tipo/{type}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::byType
 * @see app/Http/Controllers/Api/NotificationController.php:299
 * @route '/api/notificaciones/por-tipo/{type}'
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
 * @see app/Http/Controllers/Api/NotificationController.php:299
 * @route '/api/notificaciones/por-tipo/{type}'
 */
byType.get = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: byType.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::byType
 * @see app/Http/Controllers/Api/NotificationController.php:299
 * @route '/api/notificaciones/por-tipo/{type}'
 */
byType.head = (args: { type: string | number } | [type: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: byType.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:172
 * @route '/api/notificaciones/marcar-todas-leidas'
 */
export const markAllAsRead = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

markAllAsRead.definition = {
    methods: ["post"],
    url: '/api/notificaciones/marcar-todas-leidas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:172
 * @route '/api/notificaciones/marcar-todas-leidas'
 */
markAllAsRead.url = (options?: RouteQueryOptions) => {
    return markAllAsRead.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::markAllAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:172
 * @route '/api/notificaciones/marcar-todas-leidas'
 */
markAllAsRead.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAllAsRead.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::destroyAll
 * @see app/Http/Controllers/Api/NotificationController.php:238
 * @route '/api/notificaciones/eliminar-todas'
 */
export const destroyAll = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

destroyAll.definition = {
    methods: ["delete"],
    url: '/api/notificaciones/eliminar-todas',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::destroyAll
 * @see app/Http/Controllers/Api/NotificationController.php:238
 * @route '/api/notificaciones/eliminar-todas'
 */
destroyAll.url = (options?: RouteQueryOptions) => {
    return destroyAll.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\NotificationController::destroyAll
 * @see app/Http/Controllers/Api/NotificationController.php:238
 * @route '/api/notificaciones/eliminar-todas'
 */
destroyAll.delete = (options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyAll.url(options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::show
 * @see app/Http/Controllers/Api/NotificationController.php:340
 * @route '/api/notificaciones/{notification}'
 */
export const show = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/notificaciones/{notification}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::show
 * @see app/Http/Controllers/Api/NotificationController.php:340
 * @route '/api/notificaciones/{notification}'
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
 * @see app/Http/Controllers/Api/NotificationController.php:340
 * @route '/api/notificaciones/{notification}'
 */
show.get = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\NotificationController::show
 * @see app/Http/Controllers/Api/NotificationController.php:340
 * @route '/api/notificaciones/{notification}'
 */
show.head = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:96
 * @route '/api/notificaciones/{notification}/marcar-leida'
 */
export const markAsRead = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

markAsRead.definition = {
    methods: ["post"],
    url: '/api/notificaciones/{notification}/marcar-leida',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsRead
 * @see app/Http/Controllers/Api/NotificationController.php:96
 * @route '/api/notificaciones/{notification}/marcar-leida'
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
 * @see app/Http/Controllers/Api/NotificationController.php:96
 * @route '/api/notificaciones/{notification}/marcar-leida'
 */
markAsRead.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsRead.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsUnread
 * @see app/Http/Controllers/Api/NotificationController.php:134
 * @route '/api/notificaciones/{notification}/marcar-no-leida'
 */
export const markAsUnread = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsUnread.url(args, options),
    method: 'post',
})

markAsUnread.definition = {
    methods: ["post"],
    url: '/api/notificaciones/{notification}/marcar-no-leida',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::markAsUnread
 * @see app/Http/Controllers/Api/NotificationController.php:134
 * @route '/api/notificaciones/{notification}/marcar-no-leida'
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
 * @see app/Http/Controllers/Api/NotificationController.php:134
 * @route '/api/notificaciones/{notification}/marcar-no-leida'
 */
markAsUnread.post = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: markAsUnread.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\NotificationController::destroy
 * @see app/Http/Controllers/Api/NotificationController.php:201
 * @route '/api/notificaciones/{notification}'
 */
export const destroy = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/api/notificaciones/{notification}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Api\NotificationController::destroy
 * @see app/Http/Controllers/Api/NotificationController.php:201
 * @route '/api/notificaciones/{notification}'
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
 * @see app/Http/Controllers/Api/NotificationController.php:201
 * @route '/api/notificaciones/{notification}'
 */
destroy.delete = (args: { notification: number | { id: number } } | [notification: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})
const NotificationController = { index, unread, stats, byType, markAllAsRead, destroyAll, show, markAsRead, markAsUnread, destroy }

export default NotificationController