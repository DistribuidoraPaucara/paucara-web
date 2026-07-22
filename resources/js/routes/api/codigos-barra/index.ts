import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CodigoBarraController::buscar
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
export const buscar = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscar.url(args, options),
    method: 'get',
})

buscar.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/buscar/{codigo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::buscar
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
buscar.url = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo: args.codigo,
                }

    return buscar.definition.url
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::buscar
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
buscar.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::buscar
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
buscar.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::buscar
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
    const buscarForm = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::buscar
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
        buscarForm.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::buscar
 * @see app/Http/Controllers/CodigoBarraController.php:199
 * @route '/api/codigos-barra/buscar/{codigo}'
 */
        buscarForm.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscar.form = buscarForm
/**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
export const validar = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: validar.url(args, options),
    method: 'get',
})

validar.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/validar/{codigo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
validar.url = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo: args.codigo,
                }

    return validar.definition.url
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
validar.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: validar.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
validar.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: validar.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
    const validarForm = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: validar.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
        validarForm.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: validar.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::validar
 * @see app/Http/Controllers/CodigoBarraController.php:227
 * @route '/api/codigos-barra/validar/{codigo}'
 */
        validarForm.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: validar.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    validar.form = validarForm
/**
* @see \App\Http\Controllers\CodigoBarraController::generar
 * @see app/Http/Controllers/CodigoBarraController.php:251
 * @route '/api/codigos-barra/generar'
 */
export const generar = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generar.url(options),
    method: 'post',
})

generar.definition = {
    methods: ["post"],
    url: '/api/codigos-barra/generar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::generar
 * @see app/Http/Controllers/CodigoBarraController.php:251
 * @route '/api/codigos-barra/generar'
 */
generar.url = (options?: RouteQueryOptions) => {
    return generar.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::generar
 * @see app/Http/Controllers/CodigoBarraController.php:251
 * @route '/api/codigos-barra/generar'
 */
generar.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generar.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::generar
 * @see app/Http/Controllers/CodigoBarraController.php:251
 * @route '/api/codigos-barra/generar'
 */
    const generarForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generar.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::generar
 * @see app/Http/Controllers/CodigoBarraController.php:251
 * @route '/api/codigos-barra/generar'
 */
        generarForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generar.url(options),
            method: 'post',
        })
    
    generar.form = generarForm
/**
* @see \App\Http\Controllers\CodigoBarraController::producto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
export const producto = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: producto.url(args, options),
    method: 'get',
})

producto.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/producto/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::producto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
producto.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { producto: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { producto: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    producto: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        producto: typeof args.producto === 'object'
                ? args.producto.id
                : args.producto,
                }

    return producto.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::producto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
producto.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: producto.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::producto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
producto.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: producto.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::producto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
    const productoForm = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: producto.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::producto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
        productoForm.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: producto.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::producto
 * @see app/Http/Controllers/CodigoBarraController.php:296
 * @route '/api/codigos-barra/producto/{producto}'
 */
        productoForm.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: producto.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    producto.form = productoForm
/**
* @see \App\Http\Controllers\CodigoBarraController::imagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
export const imagen = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imagen.url(args, options),
    method: 'get',
})

imagen.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/imagen/{codigo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::imagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
imagen.url = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo: args.codigo,
                }

    return imagen.definition.url
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::imagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
imagen.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imagen.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::imagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
imagen.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imagen.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::imagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
    const imagenForm = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imagen.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::imagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
        imagenForm.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imagen.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::imagen
 * @see app/Http/Controllers/CodigoBarraController.php:319
 * @route '/api/codigos-barra/imagen/{codigo}'
 */
        imagenForm.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imagen.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imagen.form = imagenForm
/**
* @see \App\Http\Controllers\CodigoBarraController::imagenSvg
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
export const imagenSvg = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imagenSvg.url(args, options),
    method: 'get',
})

imagenSvg.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/imagen-svg/{codigo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::imagenSvg
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
imagenSvg.url = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo: args.codigo,
                }

    return imagenSvg.definition.url
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::imagenSvg
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
imagenSvg.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imagenSvg.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::imagenSvg
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
imagenSvg.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imagenSvg.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::imagenSvg
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
    const imagenSvgForm = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imagenSvg.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::imagenSvg
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
        imagenSvgForm.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imagenSvg.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::imagenSvg
 * @see app/Http/Controllers/CodigoBarraController.php:338
 * @route '/api/codigos-barra/imagen-svg/{codigo}'
 */
        imagenSvgForm.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imagenSvg.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imagenSvg.form = imagenSvgForm
/**
* @see \App\Http\Controllers\CodigoBarraController::buscarRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
export const buscarRapido = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarRapido.url(args, options),
    method: 'get',
})

buscarRapido.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/buscar-rapido/{codigo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::buscarRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
buscarRapido.url = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { codigo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    codigo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        codigo: args.codigo,
                }

    return buscarRapido.definition.url
            .replace('{codigo}', parsedArgs.codigo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::buscarRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
buscarRapido.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: buscarRapido.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::buscarRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
buscarRapido.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: buscarRapido.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::buscarRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
    const buscarRapidoForm = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: buscarRapido.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::buscarRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
        buscarRapidoForm.get = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarRapido.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::buscarRapido
 * @see app/Http/Controllers/CodigoBarraController.php:357
 * @route '/api/codigos-barra/buscar-rapido/{codigo}'
 */
        buscarRapidoForm.head = (args: { codigo: string | number } | [codigo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: buscarRapido.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    buscarRapido.form = buscarRapidoForm
/**
* @see \App\Http\Controllers\CodigoBarraController::precalentarCache
 * @see app/Http/Controllers/CodigoBarraController.php:387
 * @route '/api/codigos-barra/precalentar-cache'
 */
export const precalentarCache = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: precalentarCache.url(options),
    method: 'post',
})

precalentarCache.definition = {
    methods: ["post"],
    url: '/api/codigos-barra/precalentar-cache',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::precalentarCache
 * @see app/Http/Controllers/CodigoBarraController.php:387
 * @route '/api/codigos-barra/precalentar-cache'
 */
precalentarCache.url = (options?: RouteQueryOptions) => {
    return precalentarCache.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::precalentarCache
 * @see app/Http/Controllers/CodigoBarraController.php:387
 * @route '/api/codigos-barra/precalentar-cache'
 */
precalentarCache.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: precalentarCache.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::precalentarCache
 * @see app/Http/Controllers/CodigoBarraController.php:387
 * @route '/api/codigos-barra/precalentar-cache'
 */
    const precalentarCacheForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: precalentarCache.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::precalentarCache
 * @see app/Http/Controllers/CodigoBarraController.php:387
 * @route '/api/codigos-barra/precalentar-cache'
 */
        precalentarCacheForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: precalentarCache.url(options),
            method: 'post',
        })
    
    precalentarCache.form = precalentarCacheForm
/**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
export const estadisticasCache = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasCache.url(options),
    method: 'get',
})

estadisticasCache.definition = {
    methods: ["get","head"],
    url: '/api/codigos-barra/estadisticas-cache',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
estadisticasCache.url = (options?: RouteQueryOptions) => {
    return estadisticasCache.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
estadisticasCache.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: estadisticasCache.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
estadisticasCache.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: estadisticasCache.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
    const estadisticasCacheForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: estadisticasCache.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
        estadisticasCacheForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticasCache.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\CodigoBarraController::estadisticasCache
 * @see app/Http/Controllers/CodigoBarraController.php:408
 * @route '/api/codigos-barra/estadisticas-cache'
 */
        estadisticasCacheForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: estadisticasCache.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    estadisticasCache.form = estadisticasCacheForm
const codigosBarra = {
    buscar,
validar,
generar,
producto,
imagen,
imagenSvg,
buscarRapido,
precalentarCache,
estadisticasCache,
}

export default codigosBarra