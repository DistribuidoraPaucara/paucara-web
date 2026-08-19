import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/api/prestamos-evento/{prestamo}/imprimir'
 */
const imprimir61fef75617315f7202849e4d46f90a9a = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir61fef75617315f7202849e4d46f90a9a.url(args, options),
    method: 'get',
})

imprimir61fef75617315f7202849e4d46f90a9a.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-evento/{prestamo}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/api/prestamos-evento/{prestamo}/imprimir'
 */
imprimir61fef75617315f7202849e4d46f90a9a.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return imprimir61fef75617315f7202849e4d46f90a9a.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/api/prestamos-evento/{prestamo}/imprimir'
 */
imprimir61fef75617315f7202849e4d46f90a9a.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir61fef75617315f7202849e4d46f90a9a.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/api/prestamos-evento/{prestamo}/imprimir'
 */
imprimir61fef75617315f7202849e4d46f90a9a.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir61fef75617315f7202849e4d46f90a9a.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/api/prestamos-evento/{prestamo}/imprimir'
 */
    const imprimir61fef75617315f7202849e4d46f90a9aForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimir61fef75617315f7202849e4d46f90a9a.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/api/prestamos-evento/{prestamo}/imprimir'
 */
        imprimir61fef75617315f7202849e4d46f90a9aForm.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir61fef75617315f7202849e4d46f90a9a.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/api/prestamos-evento/{prestamo}/imprimir'
 */
        imprimir61fef75617315f7202849e4d46f90a9aForm.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimir61fef75617315f7202849e4d46f90a9a.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimir61fef75617315f7202849e4d46f90a9a.form = imprimir61fef75617315f7202849e4d46f90a9aForm
    /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
const imprimira44f786251fc0177abc1524da3c3ffcb = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimira44f786251fc0177abc1524da3c3ffcb.url(args, options),
    method: 'get',
})

imprimira44f786251fc0177abc1524da3c3ffcb.definition = {
    methods: ["get","head"],
    url: '/prestamos/eventos/{prestamo}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
imprimira44f786251fc0177abc1524da3c3ffcb.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return imprimira44f786251fc0177abc1524da3c3ffcb.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
imprimira44f786251fc0177abc1524da3c3ffcb.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimira44f786251fc0177abc1524da3c3ffcb.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
imprimira44f786251fc0177abc1524da3c3ffcb.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimira44f786251fc0177abc1524da3c3ffcb.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
    const imprimira44f786251fc0177abc1524da3c3ffcbForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimira44f786251fc0177abc1524da3c3ffcb.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
        imprimira44f786251fc0177abc1524da3c3ffcbForm.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimira44f786251fc0177abc1524da3c3ffcb.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimir
 * @see app/Http/Controllers/PrestamoEventoController.php:675
 * @route '/prestamos/eventos/{prestamo}/imprimir'
 */
        imprimira44f786251fc0177abc1524da3c3ffcbForm.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimira44f786251fc0177abc1524da3c3ffcb.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimira44f786251fc0177abc1524da3c3ffcb.form = imprimira44f786251fc0177abc1524da3c3ffcbForm

export const imprimir = {
    '/api/prestamos-evento/{prestamo}/imprimir': imprimir61fef75617315f7202849e4d46f90a9a,
    '/prestamos/eventos/{prestamo}/imprimir': imprimira44f786251fc0177abc1524da3c3ffcb,
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoEventoController.php:0
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/imprimir'
 */
export const imprimirTodasLasDevoluciones = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTodasLasDevoluciones.url(args, options),
    method: 'get',
})

imprimirTodasLasDevoluciones.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-evento/{prestamo}/devoluciones/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoEventoController.php:0
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/imprimir'
 */
imprimirTodasLasDevoluciones.url = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: args.prestamo,
                }

    return imprimirTodasLasDevoluciones.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoEventoController.php:0
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/imprimir'
 */
imprimirTodasLasDevoluciones.get = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirTodasLasDevoluciones.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoEventoController.php:0
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/imprimir'
 */
imprimirTodasLasDevoluciones.head = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirTodasLasDevoluciones.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoEventoController.php:0
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/imprimir'
 */
    const imprimirTodasLasDevolucionesForm = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirTodasLasDevoluciones.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoEventoController.php:0
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/imprimir'
 */
        imprimirTodasLasDevolucionesForm.get = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirTodasLasDevoluciones.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirTodasLasDevoluciones
 * @see app/Http/Controllers/PrestamoEventoController.php:0
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/imprimir'
 */
        imprimirTodasLasDevolucionesForm.head = (args: { prestamo: string | number } | [prestamo: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirTodasLasDevoluciones.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirTodasLasDevoluciones.form = imprimirTodasLasDevolucionesForm
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
const imprimirDevolucion5256b313905fe581aad99082a7fb0070 = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirDevolucion5256b313905fe581aad99082a7fb0070.url(args, options),
    method: 'get',
})

imprimirDevolucion5256b313905fe581aad99082a7fb0070.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucion5256b313905fe581aad99082a7fb0070.url = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                    devolucion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: args.prestamo,
                                devolucion: typeof args.devolucion === 'object'
                ? args.devolucion.id
                : args.devolucion,
                }

    return imprimirDevolucion5256b313905fe581aad99082a7fb0070.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace('{devolucion}', parsedArgs.devolucion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucion5256b313905fe581aad99082a7fb0070.get = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirDevolucion5256b313905fe581aad99082a7fb0070.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucion5256b313905fe581aad99082a7fb0070.head = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirDevolucion5256b313905fe581aad99082a7fb0070.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
    const imprimirDevolucion5256b313905fe581aad99082a7fb0070Form = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirDevolucion5256b313905fe581aad99082a7fb0070.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
        imprimirDevolucion5256b313905fe581aad99082a7fb0070Form.get = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirDevolucion5256b313905fe581aad99082a7fb0070.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir'
 */
        imprimirDevolucion5256b313905fe581aad99082a7fb0070Form.head = (args: { prestamo: string | number, devolucion: number | { id: number } } | [prestamo: string | number, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirDevolucion5256b313905fe581aad99082a7fb0070.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirDevolucion5256b313905fe581aad99082a7fb0070.form = imprimirDevolucion5256b313905fe581aad99082a7fb0070Form
    /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
const imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d.url(args, options),
    method: 'get',
})

imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d.definition = {
    methods: ["get","head"],
    url: '/prestamos/eventos/devoluciones/{devolucion}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d.url = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { devolucion: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { devolucion: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    devolucion: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        devolucion: typeof args.devolucion === 'object'
                ? args.devolucion.id
                : args.devolucion,
                }

    return imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d.definition.url
            .replace('{devolucion}', parsedArgs.devolucion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d.get = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d.head = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
    const imprimirDevolucionf04dd621edbf800439ea7f3e06010d3dForm = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
        imprimirDevolucionf04dd621edbf800439ea7f3e06010d3dForm.get = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoEventoController::imprimirDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:731
 * @route '/prestamos/eventos/devoluciones/{devolucion}/imprimir'
 */
        imprimirDevolucionf04dd621edbf800439ea7f3e06010d3dForm.head = (args: { devolucion: number | { id: number } } | [devolucion: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d.form = imprimirDevolucionf04dd621edbf800439ea7f3e06010d3dForm

export const imprimirDevolucion = {
    '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/imprimir': imprimirDevolucion5256b313905fe581aad99082a7fb0070,
    '/prestamos/eventos/devoluciones/{devolucion}/imprimir': imprimirDevolucionf04dd621edbf800439ea7f3e06010d3d,
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:29
 * @route '/api/prestamos-evento'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-evento',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:29
 * @route '/api/prestamos-evento'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:29
 * @route '/api/prestamos-evento'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:29
 * @route '/api/prestamos-evento'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:29
 * @route '/api/prestamos-evento'
 */
    const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:29
 * @route '/api/prestamos-evento'
 */
        indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoEventoController::index
 * @see app/Http/Controllers/PrestamoEventoController.php:29
 * @route '/api/prestamos-evento'
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
* @see \App\Http\Controllers\PrestamoEventoController::store
 * @see app/Http/Controllers/PrestamoEventoController.php:150
 * @route '/api/prestamos-evento'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/prestamos-evento',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::store
 * @see app/Http/Controllers/PrestamoEventoController.php:150
 * @route '/api/prestamos-evento'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::store
 * @see app/Http/Controllers/PrestamoEventoController.php:150
 * @route '/api/prestamos-evento'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::store
 * @see app/Http/Controllers/PrestamoEventoController.php:150
 * @route '/api/prestamos-evento'
 */
    const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: store.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::store
 * @see app/Http/Controllers/PrestamoEventoController.php:150
 * @route '/api/prestamos-evento'
 */
        storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: store.url(options),
            method: 'post',
        })
    
    store.form = storeForm
/**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:311
 * @route '/api/prestamos-evento/{prestamo}'
 */
export const show = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/prestamos-evento/{prestamo}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:311
 * @route '/api/prestamos-evento/{prestamo}'
 */
show.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return show.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:311
 * @route '/api/prestamos-evento/{prestamo}'
 */
show.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:311
 * @route '/api/prestamos-evento/{prestamo}'
 */
show.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:311
 * @route '/api/prestamos-evento/{prestamo}'
 */
    const showForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: show.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:311
 * @route '/api/prestamos-evento/{prestamo}'
 */
        showForm.get = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: show.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PrestamoEventoController::show
 * @see app/Http/Controllers/PrestamoEventoController.php:311
 * @route '/api/prestamos-evento/{prestamo}'
 */
        showForm.head = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\PrestamoEventoController::update
 * @see app/Http/Controllers/PrestamoEventoController.php:356
 * @route '/api/prestamos-evento/{prestamo}'
 */
export const update = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

update.definition = {
    methods: ["put"],
    url: '/api/prestamos-evento/{prestamo}',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::update
 * @see app/Http/Controllers/PrestamoEventoController.php:356
 * @route '/api/prestamos-evento/{prestamo}'
 */
update.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return update.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::update
 * @see app/Http/Controllers/PrestamoEventoController.php:356
 * @route '/api/prestamos-evento/{prestamo}'
 */
update.put = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::update
 * @see app/Http/Controllers/PrestamoEventoController.php:356
 * @route '/api/prestamos-evento/{prestamo}'
 */
    const updateForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: update.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PUT',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::update
 * @see app/Http/Controllers/PrestamoEventoController.php:356
 * @route '/api/prestamos-evento/{prestamo}'
 */
        updateForm.put = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: update.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PUT',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    update.form = updateForm
/**
* @see \App\Http\Controllers\PrestamoEventoController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:456
 * @route '/api/prestamos-evento/{prestamo}/devolver'
 */
export const registrarDevolucion = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarDevolucion.url(args, options),
    method: 'post',
})

registrarDevolucion.definition = {
    methods: ["post"],
    url: '/api/prestamos-evento/{prestamo}/devolver',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:456
 * @route '/api/prestamos-evento/{prestamo}/devolver'
 */
registrarDevolucion.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return registrarDevolucion.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:456
 * @route '/api/prestamos-evento/{prestamo}/devolver'
 */
registrarDevolucion.post = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarDevolucion.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:456
 * @route '/api/prestamos-evento/{prestamo}/devolver'
 */
    const registrarDevolucionForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: registrarDevolucion.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::registrarDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:456
 * @route '/api/prestamos-evento/{prestamo}/devolver'
 */
        registrarDevolucionForm.post = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: registrarDevolucion.url(args, options),
            method: 'post',
        })
    
    registrarDevolucion.form = registrarDevolucionForm
/**
* @see \App\Http\Controllers\PrestamoEventoController::anularDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:620
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/anular'
 */
export const anularDevolucion = (args: { prestamo: number | { id: number }, devolucion: number | { id: number } } | [prestamo: number | { id: number }, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularDevolucion.url(args, options),
    method: 'post',
})

anularDevolucion.definition = {
    methods: ["post"],
    url: '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::anularDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:620
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/anular'
 */
anularDevolucion.url = (args: { prestamo: number | { id: number }, devolucion: number | { id: number } } | [prestamo: number | { id: number }, devolucion: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                    devolucion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                                devolucion: typeof args.devolucion === 'object'
                ? args.devolucion.id
                : args.devolucion,
                }

    return anularDevolucion.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace('{devolucion}', parsedArgs.devolucion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::anularDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:620
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/anular'
 */
anularDevolucion.post = (args: { prestamo: number | { id: number }, devolucion: number | { id: number } } | [prestamo: number | { id: number }, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularDevolucion.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::anularDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:620
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/anular'
 */
    const anularDevolucionForm = (args: { prestamo: number | { id: number }, devolucion: number | { id: number } } | [prestamo: number | { id: number }, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: anularDevolucion.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::anularDevolucion
 * @see app/Http/Controllers/PrestamoEventoController.php:620
 * @route '/api/prestamos-evento/{prestamo}/devoluciones/{devolucion}/anular'
 */
        anularDevolucionForm.post = (args: { prestamo: number | { id: number }, devolucion: number | { id: number } } | [prestamo: number | { id: number }, devolucion: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: anularDevolucion.url(args, options),
            method: 'post',
        })
    
    anularDevolucion.form = anularDevolucionForm
/**
* @see \App\Http\Controllers\PrestamoEventoController::anularPrestamo
 * @see app/Http/Controllers/PrestamoEventoController.php:568
 * @route '/api/prestamos-evento/{prestamo}/anular'
 */
export const anularPrestamo = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPrestamo.url(args, options),
    method: 'post',
})

anularPrestamo.definition = {
    methods: ["post"],
    url: '/api/prestamos-evento/{prestamo}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PrestamoEventoController::anularPrestamo
 * @see app/Http/Controllers/PrestamoEventoController.php:568
 * @route '/api/prestamos-evento/{prestamo}/anular'
 */
anularPrestamo.url = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { prestamo: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { prestamo: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    prestamo: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        prestamo: typeof args.prestamo === 'object'
                ? args.prestamo.id
                : args.prestamo,
                }

    return anularPrestamo.definition.url
            .replace('{prestamo}', parsedArgs.prestamo.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PrestamoEventoController::anularPrestamo
 * @see app/Http/Controllers/PrestamoEventoController.php:568
 * @route '/api/prestamos-evento/{prestamo}/anular'
 */
anularPrestamo.post = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularPrestamo.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\PrestamoEventoController::anularPrestamo
 * @see app/Http/Controllers/PrestamoEventoController.php:568
 * @route '/api/prestamos-evento/{prestamo}/anular'
 */
    const anularPrestamoForm = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: anularPrestamo.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\PrestamoEventoController::anularPrestamo
 * @see app/Http/Controllers/PrestamoEventoController.php:568
 * @route '/api/prestamos-evento/{prestamo}/anular'
 */
        anularPrestamoForm.post = (args: { prestamo: number | { id: number } } | [prestamo: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: anularPrestamo.url(args, options),
            method: 'post',
        })
    
    anularPrestamo.form = anularPrestamoForm
const PrestamoEventoController = { imprimir, imprimirTodasLasDevoluciones, imprimirDevolucion, index, store, show, update, registrarDevolucion, anularDevolucion, anularPrestamo }

export default PrestamoEventoController