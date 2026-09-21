import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:582
 * @route '/api/modulos-sidebar/matriz-acceso/bulk-update'
 */
export const bulkUpdate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpdate.url(options),
    method: 'post',
})

bulkUpdate.definition = {
    methods: ["post"],
    url: '/api/modulos-sidebar/matriz-acceso/bulk-update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:582
 * @route '/api/modulos-sidebar/matriz-acceso/bulk-update'
 */
bulkUpdate.url = (options?: RouteQueryOptions) => {
    return bulkUpdate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:582
 * @route '/api/modulos-sidebar/matriz-acceso/bulk-update'
 */
bulkUpdate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpdate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:582
 * @route '/api/modulos-sidebar/matriz-acceso/bulk-update'
 */
    const bulkUpdateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkUpdate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:582
 * @route '/api/modulos-sidebar/matriz-acceso/bulk-update'
 */
        bulkUpdateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkUpdate.url(options),
            method: 'post',
        })
    
    bulkUpdate.form = bulkUpdateForm
const matrizAcceso = {
    bulkUpdate,
}

export default matrizAcceso