import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EmpleadoApiController::determinarRol
 * @see app/Http/Controllers/Api/EmpleadoApiController.php:13
 * @route '/api/empleados/determinar-rol'
 */
export const determinarRol = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: determinarRol.url(options),
    method: 'get',
})

determinarRol.definition = {
    methods: ["get","head"],
    url: '/api/empleados/determinar-rol',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EmpleadoApiController::determinarRol
 * @see app/Http/Controllers/Api/EmpleadoApiController.php:13
 * @route '/api/empleados/determinar-rol'
 */
determinarRol.url = (options?: RouteQueryOptions) => {
    return determinarRol.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EmpleadoApiController::determinarRol
 * @see app/Http/Controllers/Api/EmpleadoApiController.php:13
 * @route '/api/empleados/determinar-rol'
 */
determinarRol.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: determinarRol.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EmpleadoApiController::determinarRol
 * @see app/Http/Controllers/Api/EmpleadoApiController.php:13
 * @route '/api/empleados/determinar-rol'
 */
determinarRol.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: determinarRol.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\EmpleadoApiController::determinarRol
 * @see app/Http/Controllers/Api/EmpleadoApiController.php:13
 * @route '/api/empleados/determinar-rol'
 */
    const determinarRolForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: determinarRol.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\EmpleadoApiController::determinarRol
 * @see app/Http/Controllers/Api/EmpleadoApiController.php:13
 * @route '/api/empleados/determinar-rol'
 */
        determinarRolForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: determinarRol.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\EmpleadoApiController::determinarRol
 * @see app/Http/Controllers/Api/EmpleadoApiController.php:13
 * @route '/api/empleados/determinar-rol'
 */
        determinarRolForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: determinarRol.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    determinarRol.form = determinarRolForm
const EmpleadoApiController = { determinarRol }

export default EmpleadoApiController