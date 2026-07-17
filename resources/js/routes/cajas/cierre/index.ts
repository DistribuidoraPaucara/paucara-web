import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CajaController::imprimir
 * @see app/Http/Controllers/CajaController.php:1841
 * @route '/cajas/{aperturaCaja}/cierre/imprimir'
 */
export const imprimir = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/cajas/{aperturaCaja}/cierre/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::imprimir
 * @see app/Http/Controllers/CajaController.php:1841
 * @route '/cajas/{aperturaCaja}/cierre/imprimir'
 */
imprimir.url = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aperturaCaja: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { aperturaCaja: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    aperturaCaja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        aperturaCaja: typeof args.aperturaCaja === 'object'
                ? args.aperturaCaja.id
                : args.aperturaCaja,
                }

    return imprimir.definition.url
            .replace('{aperturaCaja}', parsedArgs.aperturaCaja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::imprimir
 * @see app/Http/Controllers/CajaController.php:1841
 * @route '/cajas/{aperturaCaja}/cierre/imprimir'
 */
imprimir.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::imprimir
 * @see app/Http/Controllers/CajaController.php:1841
 * @route '/cajas/{aperturaCaja}/cierre/imprimir'
 */
imprimir.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1873
 * @route '/cajas/{aperturaCaja}/cierre/exportar-excel'
 */
export const exportarExcel = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})

exportarExcel.definition = {
    methods: ["get","head"],
    url: '/cajas/{aperturaCaja}/cierre/exportar-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1873
 * @route '/cajas/{aperturaCaja}/cierre/exportar-excel'
 */
exportarExcel.url = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { aperturaCaja: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { aperturaCaja: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    aperturaCaja: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        aperturaCaja: typeof args.aperturaCaja === 'object'
                ? args.aperturaCaja.id
                : args.aperturaCaja,
                }

    return exportarExcel.definition.url
            .replace('{aperturaCaja}', parsedArgs.aperturaCaja.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1873
 * @route '/cajas/{aperturaCaja}/cierre/exportar-excel'
 */
exportarExcel.get = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CajaController::exportarExcel
 * @see app/Http/Controllers/CajaController.php:1873
 * @route '/cajas/{aperturaCaja}/cierre/exportar-excel'
 */
exportarExcel.head = (args: { aperturaCaja: number | { id: number } } | [aperturaCaja: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarExcel.url(args, options),
    method: 'head',
})
const cierre = {
    imprimir,
exportarExcel,
}

export default cierre