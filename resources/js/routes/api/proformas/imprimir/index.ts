import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProformaController::publicMethod
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
export const publicMethod = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicMethod.url(args, options),
    method: 'get',
})

publicMethod.definition = {
    methods: ["get","head"],
    url: '/api/proformas/{proforma}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::publicMethod
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
publicMethod.url = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return publicMethod.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::publicMethod
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
publicMethod.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::publicMethod
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
publicMethod.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: publicMethod.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProformaController::publicMethod
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
    const publicMethodForm = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: publicMethod.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProformaController::publicMethod
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
        publicMethodForm.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: publicMethod.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProformaController::publicMethod
 * @see app/Http/Controllers/ProformaController.php:996
 * @route '/api/proformas/{proforma}/imprimir'
 */
        publicMethodForm.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: publicMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    publicMethod.form = publicMethodForm
const imprimir = {
    public: publicMethod,
}

export default imprimir