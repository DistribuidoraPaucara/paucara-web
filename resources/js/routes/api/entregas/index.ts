import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EntregaController::testNotificacionVenta
 * @see app/Http/Controllers/Api/EntregaController.php:43
 * @route '/api/entregas/test-notificacion-venta'
 */
export const testNotificacionVenta = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testNotificacionVenta.url(options),
    method: 'post',
})

testNotificacionVenta.definition = {
    methods: ["post"],
    url: '/api/entregas/test-notificacion-venta',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\EntregaController::testNotificacionVenta
 * @see app/Http/Controllers/Api/EntregaController.php:43
 * @route '/api/entregas/test-notificacion-venta'
 */
testNotificacionVenta.url = (options?: RouteQueryOptions) => {
    return testNotificacionVenta.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EntregaController::testNotificacionVenta
 * @see app/Http/Controllers/Api/EntregaController.php:43
 * @route '/api/entregas/test-notificacion-venta'
 */
testNotificacionVenta.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: testNotificacionVenta.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\EntregaController::testNotificacionVenta
 * @see app/Http/Controllers/Api/EntregaController.php:43
 * @route '/api/entregas/test-notificacion-venta'
 */
    const testNotificacionVentaForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: testNotificacionVenta.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\EntregaController::testNotificacionVenta
 * @see app/Http/Controllers/Api/EntregaController.php:43
 * @route '/api/entregas/test-notificacion-venta'
 */
        testNotificacionVentaForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: testNotificacionVenta.url(options),
            method: 'post',
        })
    
    testNotificacionVenta.form = testNotificacionVentaForm
/**
* @see \App\Http\Controllers\EntregaController::store
 * @see app/Http/Controllers/EntregaController.php:1152
 * @route '/api/entregas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/entregas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EntregaController::store
 * @see app/Http/Controllers/EntregaController.php:1152
 * @route '/api/entregas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EntregaController::store
 * @see app/Http/Controllers/EntregaController.php:1152
 * @route '/api/entregas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EntregaController::store
 * @see app/Http/Controllers/EntregaController.php:1152
 * @route '/api/entregas'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EntregaController::store
 * @see app/Http/Controllers/EntregaController.php:1152
 * @route '/api/entregas'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
const entregas = {
    testNotificacionVenta,
store,
}

export default entregas