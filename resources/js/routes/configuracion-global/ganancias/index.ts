import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::update
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:100
 * @route '/configuracion-global/ganancias'
 */
export const update = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/configuracion-global/ganancias',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::update
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:100
 * @route '/configuracion-global/ganancias'
 */
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguracionGlobalController::update
 * @see app/Http/Controllers/ConfiguracionGlobalController.php:100
 * @route '/configuracion-global/ganancias'
 */
update.put = (options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(options),
    method: 'put',
})
const ganancias = {
    update,
}

export default ganancias