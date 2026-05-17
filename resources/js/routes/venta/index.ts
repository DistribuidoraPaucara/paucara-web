import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\VentaPublicController::preview
 * @see app/Http/Controllers/VentaPublicController.php:61
 * @route '/venta/preview/{token}'
 */
export const preview = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/venta/preview/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaPublicController::preview
 * @see app/Http/Controllers/VentaPublicController.php:61
 * @route '/venta/preview/{token}'
 */
preview.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    token: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        token: args.token,
                }

    return preview.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaPublicController::preview
 * @see app/Http/Controllers/VentaPublicController.php:61
 * @route '/venta/preview/{token}'
 */
preview.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaPublicController::preview
 * @see app/Http/Controllers/VentaPublicController.php:61
 * @route '/venta/preview/{token}'
 */
preview.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaPublicController::preview
 * @see app/Http/Controllers/VentaPublicController.php:61
 * @route '/venta/preview/{token}'
 */
    const previewForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaPublicController::preview
 * @see app/Http/Controllers/VentaPublicController.php:61
 * @route '/venta/preview/{token}'
 */
        previewForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaPublicController::preview
 * @see app/Http/Controllers/VentaPublicController.php:61
 * @route '/venta/preview/{token}'
 */
        previewForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\VentaPublicController::download
 * @see app/Http/Controllers/VentaPublicController.php:14
 * @route '/venta/download/{token}'
 */
export const download = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/venta/download/{token}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaPublicController::download
 * @see app/Http/Controllers/VentaPublicController.php:14
 * @route '/venta/download/{token}'
 */
download.url = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { token: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    token: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        token: args.token,
                }

    return download.definition.url
            .replace('{token}', parsedArgs.token.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaPublicController::download
 * @see app/Http/Controllers/VentaPublicController.php:14
 * @route '/venta/download/{token}'
 */
download.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaPublicController::download
 * @see app/Http/Controllers/VentaPublicController.php:14
 * @route '/venta/download/{token}'
 */
download.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaPublicController::download
 * @see app/Http/Controllers/VentaPublicController.php:14
 * @route '/venta/download/{token}'
 */
    const downloadForm = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\VentaPublicController::download
 * @see app/Http/Controllers/VentaPublicController.php:14
 * @route '/venta/download/{token}'
 */
        downloadForm.get = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\VentaPublicController::download
 * @see app/Http/Controllers/VentaPublicController.php:14
 * @route '/venta/download/{token}'
 */
        downloadForm.head = (args: { token: string | number } | [token: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
const venta = {
    preview,
download,
}

export default venta