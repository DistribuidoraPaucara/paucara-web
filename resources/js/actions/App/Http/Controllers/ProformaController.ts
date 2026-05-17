import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
const imprimir125bf4b428ce963584075dbfa8f6f64d = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir125bf4b428ce963584075dbfa8f6f64d.url(args, options),
    method: 'get',
})

imprimir125bf4b428ce963584075dbfa8f6f64d.definition = {
    methods: ["get","head"],
    url: '/api/proformas/{proforma}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
imprimir125bf4b428ce963584075dbfa8f6f64d.url = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proforma: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { proforma: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    proforma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proforma: typeof args.proforma === 'object'
                ? args.proforma.id
                : args.proforma,
                }

    return imprimir125bf4b428ce963584075dbfa8f6f64d.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
imprimir125bf4b428ce963584075dbfa8f6f64d.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir125bf4b428ce963584075dbfa8f6f64d.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
imprimir125bf4b428ce963584075dbfa8f6f64d.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir125bf4b428ce963584075dbfa8f6f64d.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
    const imprimir125bf4b428ce963584075dbfa8f6f64dForm = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir125bf4b428ce963584075dbfa8f6f64d.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
        imprimir125bf4b428ce963584075dbfa8f6f64dForm.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir125bf4b428ce963584075dbfa8f6f64d.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
        imprimir125bf4b428ce963584075dbfa8f6f64dForm.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir125bf4b428ce963584075dbfa8f6f64d.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir125bf4b428ce963584075dbfa8f6f64d.form = imprimir125bf4b428ce963584075dbfa8f6f64dForm
    /**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/proformas/{proforma}/imprimir'
 */
const imprimir6149e35b40ee82ad9184bc1a0f70365f = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir6149e35b40ee82ad9184bc1a0f70365f.url(args, options),
    method: 'get',
})

imprimir6149e35b40ee82ad9184bc1a0f70365f.definition = {
    methods: ["get","head"],
    url: '/proformas/{proforma}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/proformas/{proforma}/imprimir'
 */
imprimir6149e35b40ee82ad9184bc1a0f70365f.url = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proforma: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { proforma: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    proforma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proforma: typeof args.proforma === 'object'
                ? args.proforma.id
                : args.proforma,
                }

    return imprimir6149e35b40ee82ad9184bc1a0f70365f.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/proformas/{proforma}/imprimir'
 */
imprimir6149e35b40ee82ad9184bc1a0f70365f.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir6149e35b40ee82ad9184bc1a0f70365f.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/proformas/{proforma}/imprimir'
 */
imprimir6149e35b40ee82ad9184bc1a0f70365f.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir6149e35b40ee82ad9184bc1a0f70365f.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/proformas/{proforma}/imprimir'
 */
    const imprimir6149e35b40ee82ad9184bc1a0f70365fForm = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir6149e35b40ee82ad9184bc1a0f70365f.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/proformas/{proforma}/imprimir'
 */
        imprimir6149e35b40ee82ad9184bc1a0f70365fForm.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir6149e35b40ee82ad9184bc1a0f70365f.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/proformas/{proforma}/imprimir'
 */
        imprimir6149e35b40ee82ad9184bc1a0f70365fForm.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir6149e35b40ee82ad9184bc1a0f70365f.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir6149e35b40ee82ad9184bc1a0f70365f.form = imprimir6149e35b40ee82ad9184bc1a0f70365fForm

export const imprimir = {
    '/api/proformas/{proforma}/imprimir': imprimir125bf4b428ce963584075dbfa8f6f64d,
    '/proformas/{proforma}/imprimir': imprimir6149e35b40ee82ad9184bc1a0f70365f,
}

/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
const preview068fc740980b3bd88a6f118f89ff5a90 = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview068fc740980b3bd88a6f118f89ff5a90.url(args, options),
    method: 'get',
})

preview068fc740980b3bd88a6f118f89ff5a90.definition = {
    methods: ["get","head"],
    url: '/api/proformas/{proforma}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
preview068fc740980b3bd88a6f118f89ff5a90.url = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proforma: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { proforma: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    proforma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proforma: typeof args.proforma === 'object'
                ? args.proforma.id
                : args.proforma,
                }

    return preview068fc740980b3bd88a6f118f89ff5a90.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
preview068fc740980b3bd88a6f118f89ff5a90.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview068fc740980b3bd88a6f118f89ff5a90.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
preview068fc740980b3bd88a6f118f89ff5a90.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview068fc740980b3bd88a6f118f89ff5a90.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
    const preview068fc740980b3bd88a6f118f89ff5a90Form = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview068fc740980b3bd88a6f118f89ff5a90.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
        preview068fc740980b3bd88a6f118f89ff5a90Form.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview068fc740980b3bd88a6f118f89ff5a90.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
        preview068fc740980b3bd88a6f118f89ff5a90Form.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview068fc740980b3bd88a6f118f89ff5a90.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview068fc740980b3bd88a6f118f89ff5a90.form = preview068fc740980b3bd88a6f118f89ff5a90Form
    /**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/proformas/{proforma}/preview'
 */
const previewd63ae53f9c6c4b70ea2bb5205141601d = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewd63ae53f9c6c4b70ea2bb5205141601d.url(args, options),
    method: 'get',
})

previewd63ae53f9c6c4b70ea2bb5205141601d.definition = {
    methods: ["get","head"],
    url: '/proformas/{proforma}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/proformas/{proforma}/preview'
 */
previewd63ae53f9c6c4b70ea2bb5205141601d.url = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proforma: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { proforma: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    proforma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proforma: typeof args.proforma === 'object'
                ? args.proforma.id
                : args.proforma,
                }

    return previewd63ae53f9c6c4b70ea2bb5205141601d.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/proformas/{proforma}/preview'
 */
previewd63ae53f9c6c4b70ea2bb5205141601d.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewd63ae53f9c6c4b70ea2bb5205141601d.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/proformas/{proforma}/preview'
 */
previewd63ae53f9c6c4b70ea2bb5205141601d.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewd63ae53f9c6c4b70ea2bb5205141601d.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/proformas/{proforma}/preview'
 */
    const previewd63ae53f9c6c4b70ea2bb5205141601dForm = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: previewd63ae53f9c6c4b70ea2bb5205141601d.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/proformas/{proforma}/preview'
 */
        previewd63ae53f9c6c4b70ea2bb5205141601dForm.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewd63ae53f9c6c4b70ea2bb5205141601d.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/proformas/{proforma}/preview'
 */
        previewd63ae53f9c6c4b70ea2bb5205141601dForm.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewd63ae53f9c6c4b70ea2bb5205141601d.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    previewd63ae53f9c6c4b70ea2bb5205141601d.form = previewd63ae53f9c6c4b70ea2bb5205141601dForm

export const preview = {
    '/api/proformas/{proforma}/preview': preview068fc740980b3bd88a6f118f89ff5a90,
    '/proformas/{proforma}/preview': previewd63ae53f9c6c4b70ea2bb5205141601d,
}

/**
* @see \App\Http\Controllers\ProformaController::index
 * @see app/Http/Controllers/ProformaController.php:53
 * @route '/proformas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/proformas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::index
 * @see app/Http/Controllers/ProformaController.php:53
 * @route '/proformas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::index
 * @see app/Http/Controllers/ProformaController.php:53
 * @route '/proformas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::index
 * @see app/Http/Controllers/ProformaController.php:53
 * @route '/proformas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProformaController::index
 * @see app/Http/Controllers/ProformaController.php:53
 * @route '/proformas'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProformaController::index
 * @see app/Http/Controllers/ProformaController.php:53
 * @route '/proformas'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProformaController::index
 * @see app/Http/Controllers/ProformaController.php:53
 * @route '/proformas'
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
* @see \App\Http\Controllers\ProformaController::create
 * @see app/Http/Controllers/ProformaController.php:238
 * @route '/proformas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/proformas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::create
 * @see app/Http/Controllers/ProformaController.php:238
 * @route '/proformas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::create
 * @see app/Http/Controllers/ProformaController.php:238
 * @route '/proformas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::create
 * @see app/Http/Controllers/ProformaController.php:238
 * @route '/proformas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProformaController::create
 * @see app/Http/Controllers/ProformaController.php:238
 * @route '/proformas/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProformaController::create
 * @see app/Http/Controllers/ProformaController.php:238
 * @route '/proformas/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProformaController::create
 * @see app/Http/Controllers/ProformaController.php:238
 * @route '/proformas/create'
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
* @see \App\Http\Controllers\ProformaController::store
 * @see app/Http/Controllers/ProformaController.php:528
 * @route '/proformas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/proformas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProformaController::store
 * @see app/Http/Controllers/ProformaController.php:528
 * @route '/proformas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::store
 * @see app/Http/Controllers/ProformaController.php:528
 * @route '/proformas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProformaController::store
 * @see app/Http/Controllers/ProformaController.php:528
 * @route '/proformas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProformaController::store
 * @see app/Http/Controllers/ProformaController.php:528
 * @route '/proformas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ProformaController::formatosDisponibles
 * @see app/Http/Controllers/ProformaController.php:1106
 * @route '/proformas/formatos-disponibles'
 */
export const formatosDisponibles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formatosDisponibles.url(options),
    method: 'get',
})

formatosDisponibles.definition = {
    methods: ["get","head"],
    url: '/proformas/formatos-disponibles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::formatosDisponibles
 * @see app/Http/Controllers/ProformaController.php:1106
 * @route '/proformas/formatos-disponibles'
 */
formatosDisponibles.url = (options?: RouteQueryOptions) => {
    return formatosDisponibles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::formatosDisponibles
 * @see app/Http/Controllers/ProformaController.php:1106
 * @route '/proformas/formatos-disponibles'
 */
formatosDisponibles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formatosDisponibles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::formatosDisponibles
 * @see app/Http/Controllers/ProformaController.php:1106
 * @route '/proformas/formatos-disponibles'
 */
formatosDisponibles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: formatosDisponibles.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProformaController::formatosDisponibles
 * @see app/Http/Controllers/ProformaController.php:1106
 * @route '/proformas/formatos-disponibles'
 */
    const formatosDisponiblesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: formatosDisponibles.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProformaController::formatosDisponibles
 * @see app/Http/Controllers/ProformaController.php:1106
 * @route '/proformas/formatos-disponibles'
 */
        formatosDisponiblesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: formatosDisponibles.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProformaController::formatosDisponibles
 * @see app/Http/Controllers/ProformaController.php:1106
 * @route '/proformas/formatos-disponibles'
 */
        formatosDisponiblesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: formatosDisponibles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    formatosDisponibles.form = formatosDisponiblesForm
/**
* @see \App\Http\Controllers\ProformaController::edit
 * @see app/Http/Controllers/ProformaController.php:267
 * @route '/proformas/{proforma}/edit'
 */
export const edit = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/proformas/{proforma}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::edit
 * @see app/Http/Controllers/ProformaController.php:267
 * @route '/proformas/{proforma}/edit'
 */
edit.url = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proforma: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { proforma: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    proforma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proforma: typeof args.proforma === 'object'
                ? args.proforma.id
                : args.proforma,
                }

    return edit.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::edit
 * @see app/Http/Controllers/ProformaController.php:267
 * @route '/proformas/{proforma}/edit'
 */
edit.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::edit
 * @see app/Http/Controllers/ProformaController.php:267
 * @route '/proformas/{proforma}/edit'
 */
edit.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProformaController::edit
 * @see app/Http/Controllers/ProformaController.php:267
 * @route '/proformas/{proforma}/edit'
 */
    const editForm = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProformaController::edit
 * @see app/Http/Controllers/ProformaController.php:267
 * @route '/proformas/{proforma}/edit'
 */
        editForm.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProformaController::edit
 * @see app/Http/Controllers/ProformaController.php:267
 * @route '/proformas/{proforma}/edit'
 */
        editForm.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProformaController::imprimirFiltrado
 * @see app/Http/Controllers/ProformaController.php:1188
 * @route '/proformas/imprimir-filtrado'
 */
export const imprimirFiltrado = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirFiltrado.url(options),
    method: 'get',
})

imprimirFiltrado.definition = {
    methods: ["get","head"],
    url: '/proformas/imprimir-filtrado',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::imprimirFiltrado
 * @see app/Http/Controllers/ProformaController.php:1188
 * @route '/proformas/imprimir-filtrado'
 */
imprimirFiltrado.url = (options?: RouteQueryOptions) => {
    return imprimirFiltrado.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::imprimirFiltrado
 * @see app/Http/Controllers/ProformaController.php:1188
 * @route '/proformas/imprimir-filtrado'
 */
imprimirFiltrado.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirFiltrado.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::imprimirFiltrado
 * @see app/Http/Controllers/ProformaController.php:1188
 * @route '/proformas/imprimir-filtrado'
 */
imprimirFiltrado.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirFiltrado.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProformaController::imprimirFiltrado
 * @see app/Http/Controllers/ProformaController.php:1188
 * @route '/proformas/imprimir-filtrado'
 */
    const imprimirFiltradoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirFiltrado.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProformaController::imprimirFiltrado
 * @see app/Http/Controllers/ProformaController.php:1188
 * @route '/proformas/imprimir-filtrado'
 */
        imprimirFiltradoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirFiltrado.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProformaController::imprimirFiltrado
 * @see app/Http/Controllers/ProformaController.php:1188
 * @route '/proformas/imprimir-filtrado'
 */
        imprimirFiltradoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirFiltrado.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirFiltrado.form = imprimirFiltradoForm
/**
* @see \App\Http\Controllers\ProformaController::show
 * @see app/Http/Controllers/ProformaController.php:588
 * @route '/proformas/{proforma}'
 */
export const show = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/proformas/{proforma}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::show
 * @see app/Http/Controllers/ProformaController.php:588
 * @route '/proformas/{proforma}'
 */
show.url = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proforma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    proforma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proforma: args.proforma,
                }

    return show.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::show
 * @see app/Http/Controllers/ProformaController.php:588
 * @route '/proformas/{proforma}'
 */
show.get = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::show
 * @see app/Http/Controllers/ProformaController.php:588
 * @route '/proformas/{proforma}'
 */
show.head = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProformaController::show
 * @see app/Http/Controllers/ProformaController.php:588
 * @route '/proformas/{proforma}'
 */
    const showForm = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProformaController::show
 * @see app/Http/Controllers/ProformaController.php:588
 * @route '/proformas/{proforma}'
 */
        showForm.get = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProformaController::show
 * @see app/Http/Controllers/ProformaController.php:588
 * @route '/proformas/{proforma}'
 */
        showForm.head = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\ProformaController::aprobar
 * @see app/Http/Controllers/ProformaController.php:622
 * @route '/proformas/{id}/aprobar'
 */
export const aprobar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

aprobar.definition = {
    methods: ["post"],
    url: '/proformas/{id}/aprobar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProformaController::aprobar
 * @see app/Http/Controllers/ProformaController.php:622
 * @route '/proformas/{id}/aprobar'
 */
aprobar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return aprobar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::aprobar
 * @see app/Http/Controllers/ProformaController.php:622
 * @route '/proformas/{id}/aprobar'
 */
aprobar.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProformaController::aprobar
 * @see app/Http/Controllers/ProformaController.php:622
 * @route '/proformas/{id}/aprobar'
 */
    const aprobarForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: aprobar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProformaController::aprobar
 * @see app/Http/Controllers/ProformaController.php:622
 * @route '/proformas/{id}/aprobar'
 */
        aprobarForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: aprobar.url(args, options),
            method: 'post',
        })
    
    aprobar.form = aprobarForm
/**
* @see \App\Http\Controllers\ProformaController::rechazar
 * @see app/Http/Controllers/ProformaController.php:661
 * @route '/proformas/{id}/rechazar'
 */
export const rechazar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

rechazar.definition = {
    methods: ["post"],
    url: '/proformas/{id}/rechazar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProformaController::rechazar
 * @see app/Http/Controllers/ProformaController.php:661
 * @route '/proformas/{id}/rechazar'
 */
rechazar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return rechazar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::rechazar
 * @see app/Http/Controllers/ProformaController.php:661
 * @route '/proformas/{id}/rechazar'
 */
rechazar.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProformaController::rechazar
 * @see app/Http/Controllers/ProformaController.php:661
 * @route '/proformas/{id}/rechazar'
 */
    const rechazarForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rechazar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProformaController::rechazar
 * @see app/Http/Controllers/ProformaController.php:661
 * @route '/proformas/{id}/rechazar'
 */
        rechazarForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rechazar.url(args, options),
            method: 'post',
        })
    
    rechazar.form = rechazarForm
/**
* @see \App\Http\Controllers\ProformaController::procesarVenta
 * @see app/Http/Controllers/ProformaController.php:782
 * @route '/proformas/{id}/procesar-venta'
 */
export const procesarVenta = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarVenta.url(args, options),
    method: 'post',
})

procesarVenta.definition = {
    methods: ["post"],
    url: '/proformas/{id}/procesar-venta',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProformaController::procesarVenta
 * @see app/Http/Controllers/ProformaController.php:782
 * @route '/proformas/{id}/procesar-venta'
 */
procesarVenta.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return procesarVenta.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::procesarVenta
 * @see app/Http/Controllers/ProformaController.php:782
 * @route '/proformas/{id}/procesar-venta'
 */
procesarVenta.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarVenta.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProformaController::procesarVenta
 * @see app/Http/Controllers/ProformaController.php:782
 * @route '/proformas/{id}/procesar-venta'
 */
    const procesarVentaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: procesarVenta.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProformaController::procesarVenta
 * @see app/Http/Controllers/ProformaController.php:782
 * @route '/proformas/{id}/procesar-venta'
 */
        procesarVentaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: procesarVenta.url(args, options),
            method: 'post',
        })
    
    procesarVenta.form = procesarVentaForm
/**
* @see \App\Http\Controllers\ProformaController::convertirAVenta
 * @see app/Http/Controllers/ProformaController.php:702
 * @route '/proformas/{id}/convertir-venta'
 */
export const convertirAVenta = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertirAVenta.url(args, options),
    method: 'post',
})

convertirAVenta.definition = {
    methods: ["post"],
    url: '/proformas/{id}/convertir-venta',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProformaController::convertirAVenta
 * @see app/Http/Controllers/ProformaController.php:702
 * @route '/proformas/{id}/convertir-venta'
 */
convertirAVenta.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return convertirAVenta.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::convertirAVenta
 * @see app/Http/Controllers/ProformaController.php:702
 * @route '/proformas/{id}/convertir-venta'
 */
convertirAVenta.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertirAVenta.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProformaController::convertirAVenta
 * @see app/Http/Controllers/ProformaController.php:702
 * @route '/proformas/{id}/convertir-venta'
 */
    const convertirAVentaForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: convertirAVenta.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProformaController::convertirAVenta
 * @see app/Http/Controllers/ProformaController.php:702
 * @route '/proformas/{id}/convertir-venta'
 */
        convertirAVentaForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: convertirAVenta.url(args, options),
            method: 'post',
        })
    
    convertirAVenta.form = convertirAVentaForm
/**
* @see \App\Http\Controllers\ProformaController::renovarReservas
 * @see app/Http/Controllers/ProformaController.php:874
 * @route '/proformas/{id}/renovar-reservas'
 */
export const renovarReservas = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renovarReservas.url(args, options),
    method: 'post',
})

renovarReservas.definition = {
    methods: ["post"],
    url: '/proformas/{id}/renovar-reservas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProformaController::renovarReservas
 * @see app/Http/Controllers/ProformaController.php:874
 * @route '/proformas/{id}/renovar-reservas'
 */
renovarReservas.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return renovarReservas.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::renovarReservas
 * @see app/Http/Controllers/ProformaController.php:874
 * @route '/proformas/{id}/renovar-reservas'
 */
renovarReservas.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renovarReservas.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ProformaController::renovarReservas
 * @see app/Http/Controllers/ProformaController.php:874
 * @route '/proformas/{id}/renovar-reservas'
 */
    const renovarReservasForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: renovarReservas.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ProformaController::renovarReservas
 * @see app/Http/Controllers/ProformaController.php:874
 * @route '/proformas/{id}/renovar-reservas'
 */
        renovarReservasForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: renovarReservas.url(args, options),
            method: 'post',
        })
    
    renovarReservas.form = renovarReservasForm
const ProformaController = { imprimir, preview, index, create, store, formatosDisponibles, edit, imprimirFiltrado, show, aprobar, rechazar, procesarVenta, convertirAVenta, renovarReservas }

export default ProformaController