import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
export const apiIndex = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})

apiIndex.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
apiIndex.url = (options?: RouteQueryOptions) => {
    return apiIndex.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
apiIndex.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndex.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
apiIndex.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiIndex.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
    const apiIndexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: apiIndex.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
        apiIndexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiIndex.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndex
 * @see app/Http/Controllers/ModuloSidebarController.php:281
 * @route '/api/modulos-sidebar'
 */
        apiIndexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiIndex.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    apiIndex.form = apiIndexForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndexAdmin
 * @see app/Http/Controllers/ModuloSidebarController.php:300
 * @route '/api/modulos-sidebar/admin'
 */
export const apiIndexAdmin = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndexAdmin.url(options),
    method: 'get',
})

apiIndexAdmin.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar/admin',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndexAdmin
 * @see app/Http/Controllers/ModuloSidebarController.php:300
 * @route '/api/modulos-sidebar/admin'
 */
apiIndexAdmin.url = (options?: RouteQueryOptions) => {
    return apiIndexAdmin.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndexAdmin
 * @see app/Http/Controllers/ModuloSidebarController.php:300
 * @route '/api/modulos-sidebar/admin'
 */
apiIndexAdmin.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: apiIndexAdmin.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndexAdmin
 * @see app/Http/Controllers/ModuloSidebarController.php:300
 * @route '/api/modulos-sidebar/admin'
 */
apiIndexAdmin.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: apiIndexAdmin.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndexAdmin
 * @see app/Http/Controllers/ModuloSidebarController.php:300
 * @route '/api/modulos-sidebar/admin'
 */
    const apiIndexAdminForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: apiIndexAdmin.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndexAdmin
 * @see app/Http/Controllers/ModuloSidebarController.php:300
 * @route '/api/modulos-sidebar/admin'
 */
        apiIndexAdminForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiIndexAdmin.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::apiIndexAdmin
 * @see app/Http/Controllers/ModuloSidebarController.php:300
 * @route '/api/modulos-sidebar/admin'
 */
        apiIndexAdminForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: apiIndexAdmin.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    apiIndexAdmin.form = apiIndexAdminForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::getPermisosDisponibles
 * @see app/Http/Controllers/ModuloSidebarController.php:336
 * @route '/api/modulos-sidebar/permisos/disponibles'
 */
export const getPermisosDisponibles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPermisosDisponibles.url(options),
    method: 'get',
})

getPermisosDisponibles.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar/permisos/disponibles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::getPermisosDisponibles
 * @see app/Http/Controllers/ModuloSidebarController.php:336
 * @route '/api/modulos-sidebar/permisos/disponibles'
 */
getPermisosDisponibles.url = (options?: RouteQueryOptions) => {
    return getPermisosDisponibles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::getPermisosDisponibles
 * @see app/Http/Controllers/ModuloSidebarController.php:336
 * @route '/api/modulos-sidebar/permisos/disponibles'
 */
getPermisosDisponibles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getPermisosDisponibles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::getPermisosDisponibles
 * @see app/Http/Controllers/ModuloSidebarController.php:336
 * @route '/api/modulos-sidebar/permisos/disponibles'
 */
getPermisosDisponibles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getPermisosDisponibles.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::getPermisosDisponibles
 * @see app/Http/Controllers/ModuloSidebarController.php:336
 * @route '/api/modulos-sidebar/permisos/disponibles'
 */
    const getPermisosDisponiblesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getPermisosDisponibles.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::getPermisosDisponibles
 * @see app/Http/Controllers/ModuloSidebarController.php:336
 * @route '/api/modulos-sidebar/permisos/disponibles'
 */
        getPermisosDisponiblesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPermisosDisponibles.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::getPermisosDisponibles
 * @see app/Http/Controllers/ModuloSidebarController.php:336
 * @route '/api/modulos-sidebar/permisos/disponibles'
 */
        getPermisosDisponiblesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getPermisosDisponibles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getPermisosDisponibles.form = getPermisosDisponiblesForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::getMatrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:356
 * @route '/api/modulos-sidebar/matriz-acceso'
 */
export const getMatrizAcceso = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMatrizAcceso.url(options),
    method: 'get',
})

getMatrizAcceso.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar/matriz-acceso',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::getMatrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:356
 * @route '/api/modulos-sidebar/matriz-acceso'
 */
getMatrizAcceso.url = (options?: RouteQueryOptions) => {
    return getMatrizAcceso.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::getMatrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:356
 * @route '/api/modulos-sidebar/matriz-acceso'
 */
getMatrizAcceso.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: getMatrizAcceso.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::getMatrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:356
 * @route '/api/modulos-sidebar/matriz-acceso'
 */
getMatrizAcceso.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: getMatrizAcceso.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::getMatrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:356
 * @route '/api/modulos-sidebar/matriz-acceso'
 */
    const getMatrizAccesoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: getMatrizAcceso.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::getMatrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:356
 * @route '/api/modulos-sidebar/matriz-acceso'
 */
        getMatrizAccesoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMatrizAcceso.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::getMatrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:356
 * @route '/api/modulos-sidebar/matriz-acceso'
 */
        getMatrizAccesoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: getMatrizAcceso.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    getMatrizAcceso.form = getMatrizAccesoForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerRoles
 * @see app/Http/Controllers/ModuloSidebarController.php:563
 * @route '/api/modulos-sidebar/roles'
 */
export const obtenerRoles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerRoles.url(options),
    method: 'get',
})

obtenerRoles.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerRoles
 * @see app/Http/Controllers/ModuloSidebarController.php:563
 * @route '/api/modulos-sidebar/roles'
 */
obtenerRoles.url = (options?: RouteQueryOptions) => {
    return obtenerRoles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerRoles
 * @see app/Http/Controllers/ModuloSidebarController.php:563
 * @route '/api/modulos-sidebar/roles'
 */
obtenerRoles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerRoles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerRoles
 * @see app/Http/Controllers/ModuloSidebarController.php:563
 * @route '/api/modulos-sidebar/roles'
 */
obtenerRoles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerRoles.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerRoles
 * @see app/Http/Controllers/ModuloSidebarController.php:563
 * @route '/api/modulos-sidebar/roles'
 */
    const obtenerRolesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerRoles.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerRoles
 * @see app/Http/Controllers/ModuloSidebarController.php:563
 * @route '/api/modulos-sidebar/roles'
 */
        obtenerRolesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerRoles.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerRoles
 * @see app/Http/Controllers/ModuloSidebarController.php:563
 * @route '/api/modulos-sidebar/roles'
 */
        obtenerRolesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerRoles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerRoles.form = obtenerRolesForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::previewPorRol
 * @see app/Http/Controllers/ModuloSidebarController.php:480
 * @route '/api/modulos-sidebar/preview/{rolName}'
 */
export const previewPorRol = (args: { rolName: string | number } | [rolName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewPorRol.url(args, options),
    method: 'get',
})

previewPorRol.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar/preview/{rolName}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::previewPorRol
 * @see app/Http/Controllers/ModuloSidebarController.php:480
 * @route '/api/modulos-sidebar/preview/{rolName}'
 */
previewPorRol.url = (args: { rolName: string | number } | [rolName: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { rolName: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    rolName: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        rolName: args.rolName,
                }

    return previewPorRol.definition.url
            .replace('{rolName}', parsedArgs.rolName.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::previewPorRol
 * @see app/Http/Controllers/ModuloSidebarController.php:480
 * @route '/api/modulos-sidebar/preview/{rolName}'
 */
previewPorRol.get = (args: { rolName: string | number } | [rolName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: previewPorRol.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::previewPorRol
 * @see app/Http/Controllers/ModuloSidebarController.php:480
 * @route '/api/modulos-sidebar/preview/{rolName}'
 */
previewPorRol.head = (args: { rolName: string | number } | [rolName: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: previewPorRol.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::previewPorRol
 * @see app/Http/Controllers/ModuloSidebarController.php:480
 * @route '/api/modulos-sidebar/preview/{rolName}'
 */
    const previewPorRolForm = (args: { rolName: string | number } | [rolName: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: previewPorRol.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::previewPorRol
 * @see app/Http/Controllers/ModuloSidebarController.php:480
 * @route '/api/modulos-sidebar/preview/{rolName}'
 */
        previewPorRolForm.get = (args: { rolName: string | number } | [rolName: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewPorRol.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::previewPorRol
 * @see app/Http/Controllers/ModuloSidebarController.php:480
 * @route '/api/modulos-sidebar/preview/{rolName}'
 */
        previewPorRolForm.head = (args: { rolName: string | number } | [rolName: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: previewPorRol.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    previewPorRol.form = previewPorRolForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerHistorial
 * @see app/Http/Controllers/ModuloSidebarController.php:635
 * @route '/api/modulos-sidebar/historial'
 */
export const obtenerHistorial = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerHistorial.url(options),
    method: 'get',
})

obtenerHistorial.definition = {
    methods: ["get","head"],
    url: '/api/modulos-sidebar/historial',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerHistorial
 * @see app/Http/Controllers/ModuloSidebarController.php:635
 * @route '/api/modulos-sidebar/historial'
 */
obtenerHistorial.url = (options?: RouteQueryOptions) => {
    return obtenerHistorial.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerHistorial
 * @see app/Http/Controllers/ModuloSidebarController.php:635
 * @route '/api/modulos-sidebar/historial'
 */
obtenerHistorial.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerHistorial.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerHistorial
 * @see app/Http/Controllers/ModuloSidebarController.php:635
 * @route '/api/modulos-sidebar/historial'
 */
obtenerHistorial.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerHistorial.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerHistorial
 * @see app/Http/Controllers/ModuloSidebarController.php:635
 * @route '/api/modulos-sidebar/historial'
 */
    const obtenerHistorialForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: obtenerHistorial.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerHistorial
 * @see app/Http/Controllers/ModuloSidebarController.php:635
 * @route '/api/modulos-sidebar/historial'
 */
        obtenerHistorialForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerHistorial.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::obtenerHistorial
 * @see app/Http/Controllers/ModuloSidebarController.php:635
 * @route '/api/modulos-sidebar/historial'
 */
        obtenerHistorialForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: obtenerHistorial.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    obtenerHistorial.form = obtenerHistorialForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdateMatrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:582
 * @route '/api/modulos-sidebar/matriz-acceso/bulk-update'
 */
export const bulkUpdateMatrizAcceso = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpdateMatrizAcceso.url(options),
    method: 'post',
})

bulkUpdateMatrizAcceso.definition = {
    methods: ["post"],
    url: '/api/modulos-sidebar/matriz-acceso/bulk-update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdateMatrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:582
 * @route '/api/modulos-sidebar/matriz-acceso/bulk-update'
 */
bulkUpdateMatrizAcceso.url = (options?: RouteQueryOptions) => {
    return bulkUpdateMatrizAcceso.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdateMatrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:582
 * @route '/api/modulos-sidebar/matriz-acceso/bulk-update'
 */
bulkUpdateMatrizAcceso.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpdateMatrizAcceso.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdateMatrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:582
 * @route '/api/modulos-sidebar/matriz-acceso/bulk-update'
 */
    const bulkUpdateMatrizAccesoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkUpdateMatrizAcceso.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdateMatrizAcceso
 * @see app/Http/Controllers/ModuloSidebarController.php:582
 * @route '/api/modulos-sidebar/matriz-acceso/bulk-update'
 */
        bulkUpdateMatrizAccesoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkUpdateMatrizAcceso.url(options),
            method: 'post',
        })
    
    bulkUpdateMatrizAcceso.form = bulkUpdateMatrizAccesoForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/modulos-sidebar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::index
 * @see app/Http/Controllers/ModuloSidebarController.php:16
 * @route '/modulos-sidebar'
 */
        indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index.form = indexForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/modulos-sidebar/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
    const createForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: create.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
        createForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::create
 * @see app/Http/Controllers/ModuloSidebarController.php:55
 * @route '/modulos-sidebar/create'
 */
        createForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: create.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    create.form = createForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::store
 * @see app/Http/Controllers/ModuloSidebarController.php:73
 * @route '/modulos-sidebar'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/modulos-sidebar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::store
 * @see app/Http/Controllers/ModuloSidebarController.php:73
 * @route '/modulos-sidebar'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::store
 * @see app/Http/Controllers/ModuloSidebarController.php:73
 * @route '/modulos-sidebar'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::store
 * @see app/Http/Controllers/ModuloSidebarController.php:73
 * @route '/modulos-sidebar'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::store
 * @see app/Http/Controllers/ModuloSidebarController.php:73
 * @route '/modulos-sidebar'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
export const show = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/modulos-sidebar/{moduloSidebar}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
show.url = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moduloSidebar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moduloSidebar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moduloSidebar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moduloSidebar: typeof args.moduloSidebar === 'object'
                ? args.moduloSidebar.id
                : args.moduloSidebar,
                }

    return show.definition.url
            .replace('{moduloSidebar}', parsedArgs.moduloSidebar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
show.get = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
show.head = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
    const showForm = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
        showForm.get = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::show
 * @see app/Http/Controllers/ModuloSidebarController.php:100
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
        showForm.head = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    show.form = showForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
export const edit = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/modulos-sidebar/{moduloSidebar}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
edit.url = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moduloSidebar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moduloSidebar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moduloSidebar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moduloSidebar: typeof args.moduloSidebar === 'object'
                ? args.moduloSidebar.id
                : args.moduloSidebar,
                }

    return edit.definition.url
            .replace('{moduloSidebar}', parsedArgs.moduloSidebar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
edit.get = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
edit.head = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
    const editForm = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: edit.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
        editForm.get = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::edit
 * @see app/Http/Controllers/ModuloSidebarController.php:112
 * @route '/modulos-sidebar/{moduloSidebar}/edit'
 */
        editForm.head = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: edit.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    edit.form = editForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
export const update = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put","patch"],
    url: '/modulos-sidebar/{moduloSidebar}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
update.url = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moduloSidebar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moduloSidebar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moduloSidebar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moduloSidebar: typeof args.moduloSidebar === 'object'
                ? args.moduloSidebar.id
                : args.moduloSidebar,
                }

    return update.definition.url
            .replace('{moduloSidebar}', parsedArgs.moduloSidebar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
update.put = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
update.patch = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
    const updateForm = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
        updateForm.put = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
            /**
* @see \App\Http\Controllers\ModuloSidebarController::update
 * @see app/Http/Controllers/ModuloSidebarController.php:186
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
        updateForm.patch = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::destroy
 * @see app/Http/Controllers/ModuloSidebarController.php:218
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
export const destroy = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/modulos-sidebar/{moduloSidebar}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::destroy
 * @see app/Http/Controllers/ModuloSidebarController.php:218
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
destroy.url = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moduloSidebar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moduloSidebar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moduloSidebar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moduloSidebar: typeof args.moduloSidebar === 'object'
                ? args.moduloSidebar.id
                : args.moduloSidebar,
                }

    return destroy.definition.url
            .replace('{moduloSidebar}', parsedArgs.moduloSidebar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::destroy
 * @see app/Http/Controllers/ModuloSidebarController.php:218
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
destroy.delete = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::destroy
 * @see app/Http/Controllers/ModuloSidebarController.php:218
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
    const destroyForm = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: destroy.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'DELETE',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::destroy
 * @see app/Http/Controllers/ModuloSidebarController.php:218
 * @route '/modulos-sidebar/{moduloSidebar}'
 */
        destroyForm.delete = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: destroy.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'DELETE',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    destroy.form = destroyForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::actualizarOrden
 * @see app/Http/Controllers/ModuloSidebarController.php:251
 * @route '/modulos-sidebar/actualizar-orden'
 */
export const actualizarOrden = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarOrden.url(options),
    method: 'post',
})

actualizarOrden.definition = {
    methods: ["post"],
    url: '/modulos-sidebar/actualizar-orden',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::actualizarOrden
 * @see app/Http/Controllers/ModuloSidebarController.php:251
 * @route '/modulos-sidebar/actualizar-orden'
 */
actualizarOrden.url = (options?: RouteQueryOptions) => {
    return actualizarOrden.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::actualizarOrden
 * @see app/Http/Controllers/ModuloSidebarController.php:251
 * @route '/modulos-sidebar/actualizar-orden'
 */
actualizarOrden.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarOrden.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::actualizarOrden
 * @see app/Http/Controllers/ModuloSidebarController.php:251
 * @route '/modulos-sidebar/actualizar-orden'
 */
    const actualizarOrdenForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarOrden.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::actualizarOrden
 * @see app/Http/Controllers/ModuloSidebarController.php:251
 * @route '/modulos-sidebar/actualizar-orden'
 */
        actualizarOrdenForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarOrden.url(options),
            method: 'post',
        })
    
    actualizarOrden.form = actualizarOrdenForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::toggleActivo
 * @see app/Http/Controllers/ModuloSidebarController.php:270
 * @route '/modulos-sidebar/{moduloSidebar}/toggle-activo'
 */
export const toggleActivo = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActivo.url(args, options),
    method: 'patch',
})

toggleActivo.definition = {
    methods: ["patch"],
    url: '/modulos-sidebar/{moduloSidebar}/toggle-activo',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::toggleActivo
 * @see app/Http/Controllers/ModuloSidebarController.php:270
 * @route '/modulos-sidebar/{moduloSidebar}/toggle-activo'
 */
toggleActivo.url = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { moduloSidebar: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { moduloSidebar: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    moduloSidebar: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        moduloSidebar: typeof args.moduloSidebar === 'object'
                ? args.moduloSidebar.id
                : args.moduloSidebar,
                }

    return toggleActivo.definition.url
            .replace('{moduloSidebar}', parsedArgs.moduloSidebar.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::toggleActivo
 * @see app/Http/Controllers/ModuloSidebarController.php:270
 * @route '/modulos-sidebar/{moduloSidebar}/toggle-activo'
 */
toggleActivo.patch = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: toggleActivo.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::toggleActivo
 * @see app/Http/Controllers/ModuloSidebarController.php:270
 * @route '/modulos-sidebar/{moduloSidebar}/toggle-activo'
 */
    const toggleActivoForm = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: toggleActivo.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::toggleActivo
 * @see app/Http/Controllers/ModuloSidebarController.php:270
 * @route '/modulos-sidebar/{moduloSidebar}/toggle-activo'
 */
        toggleActivoForm.patch = (args: { moduloSidebar: number | { id: number } } | [moduloSidebar: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: toggleActivo.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    toggleActivo.form = toggleActivoForm
/**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:685
 * @route '/modulos-sidebar/bulk-update'
 */
export const bulkUpdate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpdate.url(options),
    method: 'post',
})

bulkUpdate.definition = {
    methods: ["post"],
    url: '/modulos-sidebar/bulk-update',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:685
 * @route '/modulos-sidebar/bulk-update'
 */
bulkUpdate.url = (options?: RouteQueryOptions) => {
    return bulkUpdate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:685
 * @route '/modulos-sidebar/bulk-update'
 */
bulkUpdate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: bulkUpdate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:685
 * @route '/modulos-sidebar/bulk-update'
 */
    const bulkUpdateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: bulkUpdate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ModuloSidebarController::bulkUpdate
 * @see app/Http/Controllers/ModuloSidebarController.php:685
 * @route '/modulos-sidebar/bulk-update'
 */
        bulkUpdateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: bulkUpdate.url(options),
            method: 'post',
        })
    
    bulkUpdate.form = bulkUpdateForm
const ModuloSidebarController = { apiIndex, apiIndexAdmin, getPermisosDisponibles, getMatrizAcceso, obtenerRoles, previewPorRol, obtenerHistorial, bulkUpdateMatrizAcceso, index, create, store, show, edit, update, destroy, actualizarOrden, toggleActivo, bulkUpdate }

export default ModuloSidebarController