import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
const download3fb49398e623987746956eb1980fa4f6 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download3fb49398e623987746956eb1980fa4f6.url(options),
    method: 'get',
})

download3fb49398e623987746956eb1980fa4f6.definition = {
    methods: ["get","head"],
    url: '/api/admin/logs/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
download3fb49398e623987746956eb1980fa4f6.url = (options?: RouteQueryOptions) => {
    return download3fb49398e623987746956eb1980fa4f6.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
download3fb49398e623987746956eb1980fa4f6.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download3fb49398e623987746956eb1980fa4f6.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
download3fb49398e623987746956eb1980fa4f6.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download3fb49398e623987746956eb1980fa4f6.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
    const download3fb49398e623987746956eb1980fa4f6Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: download3fb49398e623987746956eb1980fa4f6.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
        download3fb49398e623987746956eb1980fa4f6Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download3fb49398e623987746956eb1980fa4f6.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/api/admin/logs/download'
 */
        download3fb49398e623987746956eb1980fa4f6Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: download3fb49398e623987746956eb1980fa4f6.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    download3fb49398e623987746956eb1980fa4f6.form = download3fb49398e623987746956eb1980fa4f6Form
    /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
const downloada9746e0f4976ac79a49326cd6b5a0b48 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloada9746e0f4976ac79a49326cd6b5a0b48.url(options),
    method: 'get',
})

downloada9746e0f4976ac79a49326cd6b5a0b48.definition = {
    methods: ["get","head"],
    url: '/logs/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
downloada9746e0f4976ac79a49326cd6b5a0b48.url = (options?: RouteQueryOptions) => {
    return downloada9746e0f4976ac79a49326cd6b5a0b48.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
downloada9746e0f4976ac79a49326cd6b5a0b48.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloada9746e0f4976ac79a49326cd6b5a0b48.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
downloada9746e0f4976ac79a49326cd6b5a0b48.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloada9746e0f4976ac79a49326cd6b5a0b48.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
    const downloada9746e0f4976ac79a49326cd6b5a0b48Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: downloada9746e0f4976ac79a49326cd6b5a0b48.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
        downloada9746e0f4976ac79a49326cd6b5a0b48Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloada9746e0f4976ac79a49326cd6b5a0b48.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\LogsController::download
 * @see app/Http/Controllers/Api/LogsController.php:16
 * @route '/logs/download'
 */
        downloada9746e0f4976ac79a49326cd6b5a0b48Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: downloada9746e0f4976ac79a49326cd6b5a0b48.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    downloada9746e0f4976ac79a49326cd6b5a0b48.form = downloada9746e0f4976ac79a49326cd6b5a0b48Form

export const download = {
    '/api/admin/logs/download': download3fb49398e623987746956eb1980fa4f6,
    '/logs/download': downloada9746e0f4976ac79a49326cd6b5a0b48,
}

/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
const view849577fb32b23c281f0d0fb012d2ac2a = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view849577fb32b23c281f0d0fb012d2ac2a.url(options),
    method: 'get',
})

view849577fb32b23c281f0d0fb012d2ac2a.definition = {
    methods: ["get","head"],
    url: '/api/admin/logs/view',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
view849577fb32b23c281f0d0fb012d2ac2a.url = (options?: RouteQueryOptions) => {
    return view849577fb32b23c281f0d0fb012d2ac2a.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
view849577fb32b23c281f0d0fb012d2ac2a.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: view849577fb32b23c281f0d0fb012d2ac2a.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
view849577fb32b23c281f0d0fb012d2ac2a.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: view849577fb32b23c281f0d0fb012d2ac2a.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
    const view849577fb32b23c281f0d0fb012d2ac2aForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: view849577fb32b23c281f0d0fb012d2ac2a.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
        view849577fb32b23c281f0d0fb012d2ac2aForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view849577fb32b23c281f0d0fb012d2ac2a.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/api/admin/logs/view'
 */
        view849577fb32b23c281f0d0fb012d2ac2aForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: view849577fb32b23c281f0d0fb012d2ac2a.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    view849577fb32b23c281f0d0fb012d2ac2a.form = view849577fb32b23c281f0d0fb012d2ac2aForm
    /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
const viewd02f6ba5f8e2f069e274ae8e12d5b3a2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: viewd02f6ba5f8e2f069e274ae8e12d5b3a2.url(options),
    method: 'get',
})

viewd02f6ba5f8e2f069e274ae8e12d5b3a2.definition = {
    methods: ["get","head"],
    url: '/logs/view',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
viewd02f6ba5f8e2f069e274ae8e12d5b3a2.url = (options?: RouteQueryOptions) => {
    return viewd02f6ba5f8e2f069e274ae8e12d5b3a2.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
viewd02f6ba5f8e2f069e274ae8e12d5b3a2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: viewd02f6ba5f8e2f069e274ae8e12d5b3a2.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
viewd02f6ba5f8e2f069e274ae8e12d5b3a2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: viewd02f6ba5f8e2f069e274ae8e12d5b3a2.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
    const viewd02f6ba5f8e2f069e274ae8e12d5b3a2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: viewd02f6ba5f8e2f069e274ae8e12d5b3a2.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
        viewd02f6ba5f8e2f069e274ae8e12d5b3a2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: viewd02f6ba5f8e2f069e274ae8e12d5b3a2.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\LogsController::view
 * @see app/Http/Controllers/Api/LogsController.php:54
 * @route '/logs/view'
 */
        viewd02f6ba5f8e2f069e274ae8e12d5b3a2Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: viewd02f6ba5f8e2f069e274ae8e12d5b3a2.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    viewd02f6ba5f8e2f069e274ae8e12d5b3a2.form = viewd02f6ba5f8e2f069e274ae8e12d5b3a2Form

export const view = {
    '/api/admin/logs/view': view849577fb32b23c281f0d0fb012d2ac2a,
    '/logs/view': viewd02f6ba5f8e2f069e274ae8e12d5b3a2,
}

const LogsController = { download, view }

export default LogsController