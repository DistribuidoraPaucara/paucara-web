import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ClienteController::anular
 * @see app/Http/Controllers/ClienteController.php:1419
 * @route '/api/clientes/pagos/{pago}/anular'
 */
export const anular = (args: { pago: string | number } | [pago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anular.url(args, options),
    method: 'post',
})

anular.definition = {
    methods: ["post"],
    url: '/api/clientes/pagos/{pago}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ClienteController::anular
 * @see app/Http/Controllers/ClienteController.php:1419
 * @route '/api/clientes/pagos/{pago}/anular'
 */
anular.url = (args: { pago: string | number } | [pago: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { pago: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    pago: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        pago: args.pago,
                }

    return anular.definition.url
            .replace('{pago}', parsedArgs.pago.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ClienteController::anular
 * @see app/Http/Controllers/ClienteController.php:1419
 * @route '/api/clientes/pagos/{pago}/anular'
 */
anular.post = (args: { pago: string | number } | [pago: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anular.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ClienteController::anular
 * @see app/Http/Controllers/ClienteController.php:1419
 * @route '/api/clientes/pagos/{pago}/anular'
 */
    const anularForm = (args: { pago: string | number } | [pago: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: anular.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ClienteController::anular
 * @see app/Http/Controllers/ClienteController.php:1419
 * @route '/api/clientes/pagos/{pago}/anular'
 */
        anularForm.post = (args: { pago: string | number } | [pago: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: anular.url(args, options),
            method: 'post',
        })
    
    anular.form = anularForm
const pago = {
    anular,
}

export default pago