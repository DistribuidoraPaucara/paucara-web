import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/clientes'
 */
export const clientes = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientes.url(options),
    method: 'get',
})

clientes.definition = {
    methods: ["get","head"],
    url: '/prestamos/ajustes/movimientos/clientes',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/clientes'
 */
clientes.url = (options?: RouteQueryOptions) => {
    return clientes.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/clientes'
 */
clientes.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: clientes.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/clientes'
 */
clientes.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: clientes.url(options),
    method: 'head',
})

    /**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/clientes'
 */
    const clientesForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: clientes.url(options),
        method: 'get',
    })

            /**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/clientes'
 */
        clientesForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: clientes.url(options),
            method: 'get',
        })
            /**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/clientes'
 */
        clientesForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: clientes.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    clientes.form = clientesForm
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/proveedores'
 */
export const proveedores = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedores.url(options),
    method: 'get',
})

proveedores.definition = {
    methods: ["get","head"],
    url: '/prestamos/ajustes/movimientos/proveedores',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/proveedores'
 */
proveedores.url = (options?: RouteQueryOptions) => {
    return proveedores.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/proveedores'
 */
proveedores.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: proveedores.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/proveedores'
 */
proveedores.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: proveedores.url(options),
    method: 'head',
})

    /**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/proveedores'
 */
    const proveedoresForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: proveedores.url(options),
        method: 'get',
    })

            /**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/proveedores'
 */
        proveedoresForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proveedores.url(options),
            method: 'get',
        })
            /**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/proveedores'
 */
        proveedoresForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: proveedores.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    proveedores.form = proveedoresForm
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/eventos'
 */
export const eventos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventos.url(options),
    method: 'get',
})

eventos.definition = {
    methods: ["get","head"],
    url: '/prestamos/ajustes/movimientos/eventos',
} satisfies RouteDefinition<["get","head"]>

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/eventos'
 */
eventos.url = (options?: RouteQueryOptions) => {
    return eventos.definition.url + queryParams(options)
}

/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/eventos'
 */
eventos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: eventos.url(options),
    method: 'get',
})
/**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/eventos'
 */
eventos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: eventos.url(options),
    method: 'head',
})

    /**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/eventos'
 */
    const eventosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: eventos.url(options),
        method: 'get',
    })

            /**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/eventos'
 */
        eventosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: eventos.url(options),
            method: 'get',
        })
            /**
 * @see [serialized-closure]:2
 * @route '/prestamos/ajustes/movimientos/eventos'
 */
        eventosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: eventos.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    eventos.form = eventosForm
const movimientos = {
    clientes,
proveedores,
eventos,
}

export default movimientos