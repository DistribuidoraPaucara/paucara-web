import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
export const download = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/api/admin/logs/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
download.url = (options?: RouteQueryOptions) => {
    return download.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
download.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
download.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
    const downloadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
        downloadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
        downloadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download.form = downloadForm
/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
export const view = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/api/admin/logs/view',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
view.url = (options?: RouteQueryOptions) => {
    return view.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
view.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
view.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
    const viewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
        viewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
        viewForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    view.form = viewForm
const logs = {
    download,
view,
}

export default logs