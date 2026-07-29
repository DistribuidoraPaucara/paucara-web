import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::store
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:29
 * @route '/api/visitas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/visitas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::store
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:29
 * @route '/api/visitas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::store
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:29
 * @route '/api/visitas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::store
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:29
 * @route '/api/visitas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::store
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:29
 * @route '/api/visitas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::index
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:65
 * @route '/api/visitas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/visitas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::index
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:65
 * @route '/api/visitas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::index
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:65
 * @route '/api/visitas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::index
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:65
 * @route '/api/visitas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::index
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:65
 * @route '/api/visitas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::index
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:65
 * @route '/api/visitas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::index
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:65
 * @route '/api/visitas'
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
* @see \App\Http\Controllers\Api\VisitaPreventistaController::estadisticas
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:140
 * @route '/api/visitas/estadisticas'
 */
export const estadisticas = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/api/visitas/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::estadisticas
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:140
 * @route '/api/visitas/estadisticas'
 */
estadisticas.url = (options?: RouteQueryOptions) => {
    return estadisticas.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::estadisticas
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:140
 * @route '/api/visitas/estadisticas'
 */
estadisticas.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::estadisticas
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:140
 * @route '/api/visitas/estadisticas'
 */
estadisticas.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::estadisticas
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:140
 * @route '/api/visitas/estadisticas'
 */
    const estadisticasForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticas.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::estadisticas
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:140
 * @route '/api/visitas/estadisticas'
 */
        estadisticasForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::estadisticas
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:140
 * @route '/api/visitas/estadisticas'
 */
        estadisticasForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticas.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticas.form = estadisticasForm
/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::dashboardStats
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:209
 * @route '/api/visitas/dashboard-stats'
 */
export const dashboardStats = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardStats.url(options),
    method: 'get',
})

dashboardStats.definition = {
    methods: ["get","head"],
    url: '/api/visitas/dashboard-stats',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::dashboardStats
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:209
 * @route '/api/visitas/dashboard-stats'
 */
dashboardStats.url = (options?: RouteQueryOptions) => {
    return dashboardStats.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::dashboardStats
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:209
 * @route '/api/visitas/dashboard-stats'
 */
dashboardStats.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboardStats.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::dashboardStats
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:209
 * @route '/api/visitas/dashboard-stats'
 */
dashboardStats.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboardStats.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::dashboardStats
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:209
 * @route '/api/visitas/dashboard-stats'
 */
    const dashboardStatsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: dashboardStats.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::dashboardStats
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:209
 * @route '/api/visitas/dashboard-stats'
 */
        dashboardStatsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardStats.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::dashboardStats
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:209
 * @route '/api/visitas/dashboard-stats'
 */
        dashboardStatsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: dashboardStats.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    dashboardStats.form = dashboardStatsForm
/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::ordenDelDia
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:318
 * @route '/api/visitas/orden-del-dia'
 */
export const ordenDelDia = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ordenDelDia.url(options),
    method: 'get',
})

ordenDelDia.definition = {
    methods: ["get","head"],
    url: '/api/visitas/orden-del-dia',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::ordenDelDia
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:318
 * @route '/api/visitas/orden-del-dia'
 */
ordenDelDia.url = (options?: RouteQueryOptions) => {
    return ordenDelDia.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::ordenDelDia
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:318
 * @route '/api/visitas/orden-del-dia'
 */
ordenDelDia.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ordenDelDia.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::ordenDelDia
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:318
 * @route '/api/visitas/orden-del-dia'
 */
ordenDelDia.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ordenDelDia.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::ordenDelDia
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:318
 * @route '/api/visitas/orden-del-dia'
 */
    const ordenDelDiaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: ordenDelDia.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::ordenDelDia
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:318
 * @route '/api/visitas/orden-del-dia'
 */
        ordenDelDiaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ordenDelDia.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::ordenDelDia
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:318
 * @route '/api/visitas/orden-del-dia'
 */
        ordenDelDiaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: ordenDelDia.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    ordenDelDia.form = ordenDelDiaForm
/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::validarHorario
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:277
 * @route '/api/visitas/validar-horario'
 */
export const validarHorario = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: validarHorario.url(options),
    method: 'get',
})

validarHorario.definition = {
    methods: ["get","head"],
    url: '/api/visitas/validar-horario',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::validarHorario
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:277
 * @route '/api/visitas/validar-horario'
 */
validarHorario.url = (options?: RouteQueryOptions) => {
    return validarHorario.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::validarHorario
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:277
 * @route '/api/visitas/validar-horario'
 */
validarHorario.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: validarHorario.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::validarHorario
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:277
 * @route '/api/visitas/validar-horario'
 */
validarHorario.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: validarHorario.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::validarHorario
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:277
 * @route '/api/visitas/validar-horario'
 */
    const validarHorarioForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: validarHorario.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::validarHorario
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:277
 * @route '/api/visitas/validar-horario'
 */
        validarHorarioForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: validarHorario.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::validarHorario
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:277
 * @route '/api/visitas/validar-horario'
 */
        validarHorarioForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: validarHorario.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    validarHorario.form = validarHorarioForm
/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::show
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:123
 * @route '/api/visitas/{visita}'
 */
export const show = (args: { visita: number | { id: number } } | [visita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/visitas/{visita}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::show
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:123
 * @route '/api/visitas/{visita}'
 */
show.url = (args: { visita: number | { id: number } } | [visita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { visita: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { visita: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    visita: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        visita: typeof args.visita === 'object'
                ? args.visita.id
                : args.visita,
                }

    return show.definition.url
            .replace('{visita}', parsedArgs.visita.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::show
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:123
 * @route '/api/visitas/{visita}'
 */
show.get = (args: { visita: number | { id: number } } | [visita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::show
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:123
 * @route '/api/visitas/{visita}'
 */
show.head = (args: { visita: number | { id: number } } | [visita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::show
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:123
 * @route '/api/visitas/{visita}'
 */
    const showForm = (args: { visita: number | { id: number } } | [visita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::show
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:123
 * @route '/api/visitas/{visita}'
 */
        showForm.get = (args: { visita: number | { id: number } } | [visita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\VisitaPreventistaController::show
 * @see app/Http/Controllers/Api/VisitaPreventistaController.php:123
 * @route '/api/visitas/{visita}'
 */
        showForm.head = (args: { visita: number | { id: number } } | [visita: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
const VisitaPreventistaController = { store, index, estadisticas, dashboardStats, ordenDelDia, validarHorario, show }

export default VisitaPreventistaController