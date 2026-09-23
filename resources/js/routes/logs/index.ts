import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
export const view = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(options),
    method: 'get',
})

view.definition = {
    methods: ["get","head"],
    url: '/logs/view',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
view.url = (options?: RouteQueryOptions) => {
    return view.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
view.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
view.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
    const viewForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
        viewForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
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
/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
export const download = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/logs/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
download.url = (options?: RouteQueryOptions) => {
    return download.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
download.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
download.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
    const downloadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
        downloadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
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
const logs = {
    view,
download,
}

export default logs