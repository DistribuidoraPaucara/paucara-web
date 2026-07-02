import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::categorias
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:264
 * @route '/api/estados/categorias'
 */
export const categorias = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: categorias.url(options),
    method: 'get',
})

categorias.definition = {
    methods: ["get","head"],
    url: '/api/estados/categorias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::categorias
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:264
 * @route '/api/estados/categorias'
 */
categorias.url = (options?: RouteQueryOptions) => {
    return categorias.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::categorias
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:264
 * @route '/api/estados/categorias'
 */
categorias.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: categorias.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::categorias
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:264
 * @route '/api/estados/categorias'
 */
categorias.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: categorias.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::buscar
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:325
 * @route '/api/estados/buscar'
 */
export const buscar = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscar.url(options),
    method: 'get',
})

buscar.definition = {
    methods: ["get","head"],
    url: '/api/estados/buscar',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::buscar
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:325
 * @route '/api/estados/buscar'
 */
buscar.url = (options?: RouteQueryOptions) => {
    return buscar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::buscar
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:325
 * @route '/api/estados/buscar'
 */
buscar.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscar.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::buscar
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:325
 * @route '/api/estados/buscar'
 */
buscar.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscar.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::transicionesPorId
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:157
 * @route '/api/estados/{estadoId}/transiciones'
 */
export const transicionesPorId = (args: { estadoId: string | number } | [estadoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transicionesPorId.url(args, options),
    method: 'get',
})

transicionesPorId.definition = {
    methods: ["get","head"],
    url: '/api/estados/{estadoId}/transiciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::transicionesPorId
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:157
 * @route '/api/estados/{estadoId}/transiciones'
 */
transicionesPorId.url = (args: { estadoId: string | number } | [estadoId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { estadoId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    estadoId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        estadoId: args.estadoId,
                }

    return transicionesPorId.definition.url
            .replace('{estadoId}', parsedArgs.estadoId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::transicionesPorId
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:157
 * @route '/api/estados/{estadoId}/transiciones'
 */
transicionesPorId.get = (args: { estadoId: string | number } | [estadoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transicionesPorId.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::transicionesPorId
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:157
 * @route '/api/estados/{estadoId}/transiciones'
 */
transicionesPorId.head = (args: { estadoId: string | number } | [estadoId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transicionesPorId.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::porCategoria
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:27
 * @route '/api/estados/{categoria}'
 */
export const porCategoria = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porCategoria.url(args, options),
    method: 'get',
})

porCategoria.definition = {
    methods: ["get","head"],
    url: '/api/estados/{categoria}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::porCategoria
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:27
 * @route '/api/estados/{categoria}'
 */
porCategoria.url = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categoria: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    categoria: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        categoria: args.categoria,
                }

    return porCategoria.definition.url
            .replace('{categoria}', parsedArgs.categoria.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::porCategoria
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:27
 * @route '/api/estados/{categoria}'
 */
porCategoria.get = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porCategoria.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::porCategoria
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:27
 * @route '/api/estados/{categoria}'
 */
porCategoria.head = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: porCategoria.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::porCodigo
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:78
 * @route '/api/estados/{categoria}/{codigo}'
 */
export const porCodigo = (args: { categoria: string | number, codigo: string | number } | [categoria: string | number, codigo: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porCodigo.url(args, options),
    method: 'get',
})

porCodigo.definition = {
    methods: ["get","head"],
    url: '/api/estados/{categoria}/{codigo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::porCodigo
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:78
 * @route '/api/estados/{categoria}/{codigo}'
 */
porCodigo.url = (args: { categoria: string | number, codigo: string | number } | [categoria: string | number, codigo: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    categoria: args[0],
                    codigo: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        categoria: args.categoria,
                                codigo: args.codigo,
                }

    return porCodigo.definition.url
            .replace('{categoria}', parsedArgs.categoria.toString())
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::porCodigo
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:78
 * @route '/api/estados/{categoria}/{codigo}'
 */
porCodigo.get = (args: { categoria: string | number, codigo: string | number } | [categoria: string | number, codigo: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: porCodigo.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::porCodigo
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:78
 * @route '/api/estados/{categoria}/{codigo}'
 */
porCodigo.head = (args: { categoria: string | number, codigo: string | number } | [categoria: string | number, codigo: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: porCodigo.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::estadisticas
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:301
 * @route '/api/estados/{categoria}/estadisticas'
 */
export const estadisticas = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(args, options),
    method: 'get',
})

estadisticas.definition = {
    methods: ["get","head"],
    url: '/api/estados/{categoria}/estadisticas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::estadisticas
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:301
 * @route '/api/estados/{categoria}/estadisticas'
 */
estadisticas.url = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { categoria: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    categoria: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        categoria: args.categoria,
                }

    return estadisticas.definition.url
            .replace('{categoria}', parsedArgs.categoria.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::estadisticas
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:301
 * @route '/api/estados/{categoria}/estadisticas'
 */
estadisticas.get = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticas.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::estadisticas
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:301
 * @route '/api/estados/{categoria}/estadisticas'
 */
estadisticas.head = (args: { categoria: string | number } | [categoria: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticas.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::transicionesDisponibles
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:122
 * @route '/api/estados/{categoria}/{codigo}/transiciones'
 */
export const transicionesDisponibles = (args: { categoria: string | number, codigo: string | number } | [categoria: string | number, codigo: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transicionesDisponibles.url(args, options),
    method: 'get',
})

transicionesDisponibles.definition = {
    methods: ["get","head"],
    url: '/api/estados/{categoria}/{codigo}/transiciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::transicionesDisponibles
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:122
 * @route '/api/estados/{categoria}/{codigo}/transiciones'
 */
transicionesDisponibles.url = (args: { categoria: string | number, codigo: string | number } | [categoria: string | number, codigo: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    categoria: args[0],
                    codigo: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        categoria: args.categoria,
                                codigo: args.codigo,
                }

    return transicionesDisponibles.definition.url
            .replace('{categoria}', parsedArgs.categoria.toString())
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::transicionesDisponibles
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:122
 * @route '/api/estados/{categoria}/{codigo}/transiciones'
 */
transicionesDisponibles.get = (args: { categoria: string | number, codigo: string | number } | [categoria: string | number, codigo: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: transicionesDisponibles.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::transicionesDisponibles
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:122
 * @route '/api/estados/{categoria}/{codigo}/transiciones'
 */
transicionesDisponibles.head = (args: { categoria: string | number, codigo: string | number } | [categoria: string | number, codigo: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: transicionesDisponibles.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::obtenerMapeo
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:208
 * @route '/api/mapeos/{categoriaOrigen}/{codigoOrigen}/{categoriaDestino}'
 */
export const obtenerMapeo = (args: { categoriaOrigen: string | number, codigoOrigen: string | number, categoriaDestino: string | number } | [categoriaOrigen: string | number, codigoOrigen: string | number, categoriaDestino: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerMapeo.url(args, options),
    method: 'get',
})

obtenerMapeo.definition = {
    methods: ["get","head"],
    url: '/api/mapeos/{categoriaOrigen}/{codigoOrigen}/{categoriaDestino}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::obtenerMapeo
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:208
 * @route '/api/mapeos/{categoriaOrigen}/{codigoOrigen}/{categoriaDestino}'
 */
obtenerMapeo.url = (args: { categoriaOrigen: string | number, codigoOrigen: string | number, categoriaDestino: string | number } | [categoriaOrigen: string | number, codigoOrigen: string | number, categoriaDestino: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    categoriaOrigen: args[0],
                    codigoOrigen: args[1],
                    categoriaDestino: args[2],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        categoriaOrigen: args.categoriaOrigen,
                                codigoOrigen: args.codigoOrigen,
                                categoriaDestino: args.categoriaDestino,
                }

    return obtenerMapeo.definition.url
            .replace('{categoriaOrigen}', parsedArgs.categoriaOrigen.toString())
            .replace('{codigoOrigen}', parsedArgs.codigoOrigen.toString())
            .replace('{categoriaDestino}', parsedArgs.categoriaDestino.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::obtenerMapeo
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:208
 * @route '/api/mapeos/{categoriaOrigen}/{codigoOrigen}/{categoriaDestino}'
 */
obtenerMapeo.get = (args: { categoriaOrigen: string | number, codigoOrigen: string | number, categoriaDestino: string | number } | [categoriaOrigen: string | number, codigoOrigen: string | number, categoriaDestino: string | number ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerMapeo.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\Api\EstadoLogisticoController::obtenerMapeo
 * @see app/Http/Controllers/Api/EstadoLogisticoController.php:208
 * @route '/api/mapeos/{categoriaOrigen}/{codigoOrigen}/{categoriaDestino}'
 */
obtenerMapeo.head = (args: { categoriaOrigen: string | number, codigoOrigen: string | number, categoriaDestino: string | number } | [categoriaOrigen: string | number, codigoOrigen: string | number, categoriaDestino: string | number ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerMapeo.url(args, options),
    method: 'head',
})
const EstadoLogisticoController = { categorias, buscar, transicionesPorId, porCategoria, porCodigo, estadisticas, transicionesDisponibles, obtenerMapeo }

export default EstadoLogisticoController