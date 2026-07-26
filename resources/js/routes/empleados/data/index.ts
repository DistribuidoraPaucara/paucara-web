import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
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
const data = {
    departamentos,
tiposContrato,
estados,
supervisores,
roles,
rolSugerido,
}

export default data