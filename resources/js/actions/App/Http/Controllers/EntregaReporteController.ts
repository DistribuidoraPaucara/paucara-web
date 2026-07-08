import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\EntregaReporteController::choferEntregas
 * @see app/Http/Controllers/EntregaReporteController.php:23
 * @route '/api/choferes/{chofer}/entregas-reporte'
 */
export const choferEntregas = (args: { chofer: string | number } | [chofer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: choferEntregas.url(args, options),
    method: 'get',
})

choferEntregas.definition = {
    methods: ["get","head"],
    url: '/api/choferes/{chofer}/entregas-reporte',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EntregaReporteController::choferEntregas
 * @see app/Http/Controllers/EntregaReporteController.php:23
 * @route '/api/choferes/{chofer}/entregas-reporte'
 */
choferEntregas.url = (args: { chofer: string | number } | [chofer: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { chofer: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    chofer: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        chofer: args.chofer,
                }

    return choferEntregas.definition.url
            .replace('{chofer}', parsedArgs.chofer.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\EntregaReporteController::choferEntregas
 * @see app/Http/Controllers/EntregaReporteController.php:23
 * @route '/api/choferes/{chofer}/entregas-reporte'
 */
choferEntregas.get = (args: { chofer: string | number } | [chofer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: choferEntregas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EntregaReporteController::choferEntregas
 * @see app/Http/Controllers/EntregaReporteController.php:23
 * @route '/api/choferes/{chofer}/entregas-reporte'
 */
choferEntregas.head = (args: { chofer: string | number } | [chofer: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: choferEntregas.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EntregaReporteController::choferEntregas
 * @see app/Http/Controllers/EntregaReporteController.php:23
 * @route '/api/choferes/{chofer}/entregas-reporte'
 */
    const choferEntregasForm = (args: { chofer: string | number } | [chofer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: choferEntregas.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EntregaReporteController::choferEntregas
 * @see app/Http/Controllers/EntregaReporteController.php:23
 * @route '/api/choferes/{chofer}/entregas-reporte'
 */
        choferEntregasForm.get = (args: { chofer: string | number } | [chofer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: choferEntregas.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EntregaReporteController::choferEntregas
 * @see app/Http/Controllers/EntregaReporteController.php:23
 * @route '/api/choferes/{chofer}/entregas-reporte'
 */
        choferEntregasForm.head = (args: { chofer: string | number } | [chofer: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: choferEntregas.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    choferEntregas.form = choferEntregasForm
const EntregaReporteController = { choferEntregas }

export default EntregaReporteController