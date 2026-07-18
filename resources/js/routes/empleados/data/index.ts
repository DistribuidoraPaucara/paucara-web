import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\EmpleadoController::departamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
export const departamentos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: departamentos.url(options),
    method: 'get',
})

departamentos.definition = {
    methods: ["get","head"],
    url: '/empleados-data/departamentos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::departamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
departamentos.url = (options?: RouteQueryOptions) => {
    return departamentos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::departamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
departamentos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: departamentos.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::departamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
departamentos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: departamentos.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::departamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
    const departamentosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: departamentos.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::departamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
        departamentosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: departamentos.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::departamentos
 * @see app/Http/Controllers/EmpleadoController.php:695
 * @route '/empleados-data/departamentos'
 */
        departamentosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: departamentos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    departamentos.form = departamentosForm
/**
* @see \App\Http\Controllers\EmpleadoController::tiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
export const tiposContrato = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tiposContrato.url(options),
    method: 'get',
})

tiposContrato.definition = {
    methods: ["get","head"],
    url: '/empleados-data/tipos-contrato',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::tiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
tiposContrato.url = (options?: RouteQueryOptions) => {
    return tiposContrato.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::tiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
tiposContrato.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tiposContrato.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::tiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
tiposContrato.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tiposContrato.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::tiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
    const tiposContratoForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: tiposContrato.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::tiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
        tiposContratoForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tiposContrato.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::tiposContrato
 * @see app/Http/Controllers/EmpleadoController.php:705
 * @route '/empleados-data/tipos-contrato'
 */
        tiposContratoForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: tiposContrato.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    tiposContrato.form = tiposContratoForm
/**
* @see \App\Http\Controllers\EmpleadoController::estados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
export const estados = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estados.url(options),
    method: 'get',
})

estados.definition = {
    methods: ["get","head"],
    url: '/empleados-data/estados',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::estados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
estados.url = (options?: RouteQueryOptions) => {
    return estados.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::estados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
estados.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estados.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::estados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
estados.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estados.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::estados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
    const estadosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estados.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::estados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
        estadosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estados.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::estados
 * @see app/Http/Controllers/EmpleadoController.php:714
 * @route '/empleados-data/estados'
 */
        estadosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estados.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estados.form = estadosForm
/**
* @see \App\Http\Controllers\EmpleadoController::supervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
export const supervisores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: supervisores.url(options),
    method: 'get',
})

supervisores.definition = {
    methods: ["get","head"],
    url: '/empleados-data/supervisores',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::supervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
supervisores.url = (options?: RouteQueryOptions) => {
    return supervisores.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::supervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
supervisores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: supervisores.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::supervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
supervisores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: supervisores.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::supervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
    const supervisoresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: supervisores.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::supervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
        supervisoresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: supervisores.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::supervisores
 * @see app/Http/Controllers/EmpleadoController.php:729
 * @route '/empleados-data/supervisores'
 */
        supervisoresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: supervisores.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    supervisores.form = supervisoresForm
/**
* @see \App\Http\Controllers\EmpleadoController::roles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
export const roles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})

roles.definition = {
    methods: ["get","head"],
    url: '/empleados-data/roles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\EmpleadoController::roles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
roles.url = (options?: RouteQueryOptions) => {
    return roles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::roles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
roles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: roles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\EmpleadoController::roles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
roles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: roles.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::roles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
    const rolesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: roles.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::roles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
        rolesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: roles.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\EmpleadoController::roles
 * @see app/Http/Controllers/EmpleadoController.php:776
 * @route '/empleados-data/roles'
 */
        rolesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: roles.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    roles.form = rolesForm
/**
* @see \App\Http\Controllers\EmpleadoController::rolSugerido
 * @see app/Http/Controllers/EmpleadoController.php:902
 * @route '/empleados-data/rol-sugerido'
 */
export const rolSugerido = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rolSugerido.url(options),
    method: 'post',
})

rolSugerido.definition = {
    methods: ["post"],
    url: '/empleados-data/rol-sugerido',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\EmpleadoController::rolSugerido
 * @see app/Http/Controllers/EmpleadoController.php:902
 * @route '/empleados-data/rol-sugerido'
 */
rolSugerido.url = (options?: RouteQueryOptions) => {
    return rolSugerido.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\EmpleadoController::rolSugerido
 * @see app/Http/Controllers/EmpleadoController.php:902
 * @route '/empleados-data/rol-sugerido'
 */
rolSugerido.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rolSugerido.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\EmpleadoController::rolSugerido
 * @see app/Http/Controllers/EmpleadoController.php:902
 * @route '/empleados-data/rol-sugerido'
 */
    const rolSugeridoForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: rolSugerido.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\EmpleadoController::rolSugerido
 * @see app/Http/Controllers/EmpleadoController.php:902
 * @route '/empleados-data/rol-sugerido'
 */
        rolSugeridoForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: rolSugerido.url(options),
            method: 'post',
        })
    
    rolSugerido.form = rolSugeridoForm
const data = {
    departamentos,
tiposContrato,
estados,
supervisores,
roles,
rolSugerido,
}

export default data