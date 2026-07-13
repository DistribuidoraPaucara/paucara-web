import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EntregaBatchController::preview
 * @see app/Http/Controllers/Api/EntregaBatchController.php:169
 * @route '/api/entregas/lote/preview'
 */
export const preview = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(options),
    method: 'post',
})

preview.definition = {
    methods: ["post"],
    url: '/api/entregas/lote/preview',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::preview
 * @see app/Http/Controllers/Api/EntregaBatchController.php:169
 * @route '/api/entregas/lote/preview'
 */
preview.url = (options?: RouteQueryOptions) => {
    return preview.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::preview
 * @see app/Http/Controllers/Api/EntregaBatchController.php:169
 * @route '/api/entregas/lote/preview'
 */
preview.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: preview.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaBatchController::preview
 * @see app/Http/Controllers/Api/EntregaBatchController.php:169
 * @route '/api/entregas/lote/preview'
 */
    const previewForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: preview.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaBatchController::preview
 * @see app/Http/Controllers/Api/EntregaBatchController.php:169
 * @route '/api/entregas/lote/preview'
 */
        previewForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: preview.url(options),
            method: 'post',
        })
    
    preview.form = previewForm
/**
* @see \App\Http\Controllers\Api\EntregaBatchController::store
 * @see app/Http/Controllers/Api/EntregaBatchController.php:37
 * @route '/api/entregas/lote'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/entregas/lote',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::store
 * @see app/Http/Controllers/Api/EntregaBatchController.php:37
 * @route '/api/entregas/lote'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::store
 * @see app/Http/Controllers/Api/EntregaBatchController.php:37
 * @route '/api/entregas/lote'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaBatchController::store
 * @see app/Http/Controllers/Api/EntregaBatchController.php:37
 * @route '/api/entregas/lote'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaBatchController::store
 * @see app/Http/Controllers/Api/EntregaBatchController.php:37
 * @route '/api/entregas/lote'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\Api\EntregaBatchController::optimizar
 * @see app/Http/Controllers/Api/EntregaBatchController.php:304
 * @route '/api/entregas/lote/optimizar'
 */
export const optimizar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: optimizar.url(options),
    method: 'post',
})

optimizar.definition = {
    methods: ["post"],
    url: '/api/entregas/lote/optimizar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::optimizar
 * @see app/Http/Controllers/Api/EntregaBatchController.php:304
 * @route '/api/entregas/lote/optimizar'
 */
optimizar.url = (options?: RouteQueryOptions) => {
    return optimizar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaBatchController::optimizar
 * @see app/Http/Controllers/Api/EntregaBatchController.php:304
 * @route '/api/entregas/lote/optimizar'
 */
optimizar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: optimizar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaBatchController::optimizar
 * @see app/Http/Controllers/Api/EntregaBatchController.php:304
 * @route '/api/entregas/lote/optimizar'
 */
    const optimizarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: optimizar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaBatchController::optimizar
 * @see app/Http/Controllers/Api/EntregaBatchController.php:304
 * @route '/api/entregas/lote/optimizar'
 */
        optimizarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: optimizar.url(options),
            method: 'post',
        })
    
    optimizar.form = optimizarForm
const EntregaBatchController = { preview, store, optimizar }

export default EntregaBatchController