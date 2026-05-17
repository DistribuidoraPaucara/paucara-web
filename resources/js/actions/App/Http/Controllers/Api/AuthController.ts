import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\AuthController::login
 * @see app/Http/Controllers/Api/AuthController.php:17
 * @route '/api/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/api/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::login
 * @see app/Http/Controllers/Api/AuthController.php:17
 * @route '/api/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::login
 * @see app/Http/Controllers/Api/AuthController.php:17
 * @route '/api/login'
 */
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::login
 * @see app/Http/Controllers/Api/AuthController.php:17
 * @route '/api/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: login.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::login
 * @see app/Http/Controllers/Api/AuthController.php:17
 * @route '/api/login'
 */
        loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: login.url(options),
            method: 'post',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\Api\AuthController::register
 * @see app/Http/Controllers/Api/AuthController.php:102
 * @route '/api/register'
 */
export const register = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

register.definition = {
    methods: ["post"],
    url: '/api/register',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::register
 * @see app/Http/Controllers/Api/AuthController.php:102
 * @route '/api/register'
 */
register.url = (options?: RouteQueryOptions) => {
    return register.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::register
 * @see app/Http/Controllers/Api/AuthController.php:102
 * @route '/api/register'
 */
register.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: register.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::register
 * @see app/Http/Controllers/Api/AuthController.php:102
 * @route '/api/register'
 */
    const registerForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: register.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::register
 * @see app/Http/Controllers/Api/AuthController.php:102
 * @route '/api/register'
 */
        registerForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: register.url(options),
            method: 'post',
        })
    
    register.form = registerForm
/**
* @see \App\Http\Controllers\Api\AuthController::logout
 * @see app/Http/Controllers/Api/AuthController.php:156
 * @route '/api/logout'
 */
export const logout = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

logout.definition = {
    methods: ["post"],
    url: '/api/logout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::logout
 * @see app/Http/Controllers/Api/AuthController.php:156
 * @route '/api/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
    return logout.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::logout
 * @see app/Http/Controllers/Api/AuthController.php:156
 * @route '/api/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: logout.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::logout
 * @see app/Http/Controllers/Api/AuthController.php:156
 * @route '/api/logout'
 */
    const logoutForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: logout.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::logout
 * @see app/Http/Controllers/Api/AuthController.php:156
 * @route '/api/logout'
 */
        logoutForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: logout.url(options),
            method: 'post',
        })
    
    logout.form = logoutForm
/**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:167
 * @route '/api/user'
 */
export const user = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(options),
    method: 'get',
})

user.definition = {
    methods: ["get","head"],
    url: '/api/user',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:167
 * @route '/api/user'
 */
user.url = (options?: RouteQueryOptions) => {
    return user.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:167
 * @route '/api/user'
 */
user.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: user.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:167
 * @route '/api/user'
 */
user.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: user.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:167
 * @route '/api/user'
 */
    const userForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: user.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:167
 * @route '/api/user'
 */
        userForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: user.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AuthController::user
 * @see app/Http/Controllers/Api/AuthController.php:167
 * @route '/api/user'
 */
        userForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: user.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    user.form = userForm
/**
* @see \App\Http\Controllers\Api\AuthController::refresh
 * @see app/Http/Controllers/Api/AuthController.php:204
 * @route '/api/refresh'
 */
export const refresh = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refresh.url(options),
    method: 'post',
})

refresh.definition = {
    methods: ["post"],
    url: '/api/refresh',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\AuthController::refresh
 * @see app/Http/Controllers/Api/AuthController.php:204
 * @route '/api/refresh'
 */
refresh.url = (options?: RouteQueryOptions) => {
    return refresh.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::refresh
 * @see app/Http/Controllers/Api/AuthController.php:204
 * @route '/api/refresh'
 */
refresh.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: refresh.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::refresh
 * @see app/Http/Controllers/Api/AuthController.php:204
 * @route '/api/refresh'
 */
    const refreshForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: refresh.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::refresh
 * @see app/Http/Controllers/Api/AuthController.php:204
 * @route '/api/refresh'
 */
        refreshForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: refresh.url(options),
            method: 'post',
        })
    
    refresh.form = refreshForm
/**
* @see \App\Http\Controllers\Api\AuthController::refreshPermissions
 * @see app/Http/Controllers/Api/AuthController.php:227
 * @route '/api/auth/refresh-permissions'
 */
export const refreshPermissions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: refreshPermissions.url(options),
    method: 'get',
})

refreshPermissions.definition = {
    methods: ["get","head"],
    url: '/api/auth/refresh-permissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\AuthController::refreshPermissions
 * @see app/Http/Controllers/Api/AuthController.php:227
 * @route '/api/auth/refresh-permissions'
 */
refreshPermissions.url = (options?: RouteQueryOptions) => {
    return refreshPermissions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\AuthController::refreshPermissions
 * @see app/Http/Controllers/Api/AuthController.php:227
 * @route '/api/auth/refresh-permissions'
 */
refreshPermissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: refreshPermissions.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\AuthController::refreshPermissions
 * @see app/Http/Controllers/Api/AuthController.php:227
 * @route '/api/auth/refresh-permissions'
 */
refreshPermissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: refreshPermissions.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\Api\AuthController::refreshPermissions
 * @see app/Http/Controllers/Api/AuthController.php:227
 * @route '/api/auth/refresh-permissions'
 */
    const refreshPermissionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: refreshPermissions.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\Api\AuthController::refreshPermissions
 * @see app/Http/Controllers/Api/AuthController.php:227
 * @route '/api/auth/refresh-permissions'
 */
        refreshPermissionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: refreshPermissions.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\Api\AuthController::refreshPermissions
 * @see app/Http/Controllers/Api/AuthController.php:227
 * @route '/api/auth/refresh-permissions'
 */
        refreshPermissionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: refreshPermissions.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    refreshPermissions.form = refreshPermissionsForm
const AuthController = { login, register, logout, user, refresh, refreshPermissions }

export default AuthController