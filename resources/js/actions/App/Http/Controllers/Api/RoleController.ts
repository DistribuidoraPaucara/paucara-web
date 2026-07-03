import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\RoleController::getRolesWithDetails
 * @see app/Http/Controllers/Api/RoleController.php:207
 * @route '/api/roles/details'
 */
export const getRolesWithDetails = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRolesWithDetails.url(options),
    method: 'get',
})

getRolesWithDetails.definition = {
    methods: ["get","head"],
    url: '/api/roles/details',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\RoleController::getRolesWithDetails
 * @see app/Http/Controllers/Api/RoleController.php:207
 * @route '/api/roles/details'
 */
getRolesWithDetails.url = (options?: RouteQueryOptions) => {
    return getRolesWithDetails.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::getRolesWithDetails
 * @see app/Http/Controllers/Api/RoleController.php:207
 * @route '/api/roles/details'
 */
getRolesWithDetails.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getRolesWithDetails.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\RoleController::getRolesWithDetails
 * @see app/Http/Controllers/Api/RoleController.php:207
 * @route '/api/roles/details'
 */
getRolesWithDetails.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getRolesWithDetails.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\RoleController::getRolesWithDetails
 * @see app/Http/Controllers/Api/RoleController.php:207
 * @route '/api/roles/details'
 */
    const getRolesWithDetailsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getRolesWithDetails.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\RoleController::getRolesWithDetails
 * @see app/Http/Controllers/Api/RoleController.php:207
 * @route '/api/roles/details'
 */
        getRolesWithDetailsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRolesWithDetails.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\RoleController::getRolesWithDetails
 * @see app/Http/Controllers/Api/RoleController.php:207
 * @route '/api/roles/details'
 */
        getRolesWithDetailsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getRolesWithDetails.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getRolesWithDetails.form = getRolesWithDetailsForm
/**
* @see \App\Http\Controllers\Api\RoleController::validateRoleCombination
 * @see app/Http/Controllers/Api/RoleController.php:247
 * @route '/api/roles/validate-combination'
 */
export const validateRoleCombination = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validateRoleCombination.url(options),
    method: 'post',
})

validateRoleCombination.definition = {
    methods: ["post"],
    url: '/api/roles/validate-combination',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\RoleController::validateRoleCombination
 * @see app/Http/Controllers/Api/RoleController.php:247
 * @route '/api/roles/validate-combination'
 */
validateRoleCombination.url = (options?: RouteQueryOptions) => {
    return validateRoleCombination.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\RoleController::validateRoleCombination
 * @see app/Http/Controllers/Api/RoleController.php:247
 * @route '/api/roles/validate-combination'
 */
validateRoleCombination.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: validateRoleCombination.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\RoleController::validateRoleCombination
 * @see app/Http/Controllers/Api/RoleController.php:247
 * @route '/api/roles/validate-combination'
 */
    const validateRoleCombinationForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: validateRoleCombination.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\RoleController::validateRoleCombination
 * @see app/Http/Controllers/Api/RoleController.php:247
 * @route '/api/roles/validate-combination'
 */
        validateRoleCombinationForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: validateRoleCombination.url(options),
            method: 'post',
        })
    
    validateRoleCombination.form = validateRoleCombinationForm
const RoleController = { getRolesWithDetails, validateRoleCombination }

export default RoleController