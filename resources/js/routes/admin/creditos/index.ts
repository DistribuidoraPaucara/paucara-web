import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
 * @see [serialized-closure]:2
 * @route '/admin/creditos/importar'
 */
export const importar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importar.url(options),
    method: 'get',
})

importar.definition = {
    methods: ["get","head"],
    url: '/admin/creditos/importar',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/admin/creditos/importar'
 */
importar.url = (options?: RouteQueryOptions) => {
    return importar.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/admin/creditos/importar'
 */
importar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: importar.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/admin/creditos/importar'
 */
importar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: importar.url(options),
    method: 'head',
})

    /**
 * @see [serialized-closure]:2
 * @route '/admin/creditos/importar'
 */
    const importarForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: importar.url(options),
        method: 'get',
    })

            /**
 * @see [serialized-closure]:2
 * @route '/admin/creditos/importar'
 */
        importarForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importar.url(options),
            method: 'get',
        })
            /**
 * @see [serialized-closure]:2
 * @route '/admin/creditos/importar'
 */
        importarForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: importar.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    importar.form = importarForm
/**
* @see \App\Http\Controllers\CreditoController::crear
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
export const crear = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})

crear.definition = {
    methods: ["get","head"],
    url: '/admin/creditos/crear',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CreditoController::crear
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
crear.url = (options?: RouteQueryOptions) => {
    return crear.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CreditoController::crear
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
crear.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: crear.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CreditoController::crear
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
crear.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: crear.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CreditoController::crear
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
    const crearForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: crear.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CreditoController::crear
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
        crearForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: crear.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CreditoController::crear
 * @see app/Http/Controllers/CreditoController.php:20
 * @route '/admin/creditos/crear'
 */
        crearForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: crear.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    crear.form = crearForm
const creditos = {
    importar,
crear,
}

export default creditos