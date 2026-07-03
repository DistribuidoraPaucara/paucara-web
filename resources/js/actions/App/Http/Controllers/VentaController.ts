import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\VentaController::ventasCliente
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/api/app/cliente/ventas'
 */
export const ventasCliente = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ventasCliente.url(options),
    method: 'get',
})

ventasCliente.definition = {
    methods: ["get","head"],
    url: '/api/app/cliente/ventas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::ventasCliente
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/api/app/cliente/ventas'
 */
ventasCliente.url = (options?: RouteQueryOptions) => {
    return ventasCliente.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::ventasCliente
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/api/app/cliente/ventas'
 */
ventasCliente.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ventasCliente.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::ventasCliente
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/api/app/cliente/ventas'
 */
ventasCliente.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ventasCliente.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1576
 * @route '/api/app/ventas/{venta}/pagos'
 */
const registrarPago3af764f1a59ea1a3a14549546c4d57d5 = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago3af764f1a59ea1a3a14549546c4d57d5.url(args, options),
    method: 'post',
})

registrarPago3af764f1a59ea1a3a14549546c4d57d5.definition = {
    methods: ["post"],
    url: '/api/app/ventas/{venta}/pagos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1576
 * @route '/api/app/ventas/{venta}/pagos'
 */
registrarPago3af764f1a59ea1a3a14549546c4d57d5.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return registrarPago3af764f1a59ea1a3a14549546c4d57d5.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1576
 * @route '/api/app/ventas/{venta}/pagos'
 */
registrarPago3af764f1a59ea1a3a14549546c4d57d5.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPago3af764f1a59ea1a3a14549546c4d57d5.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1576
 * @route '/ventas/{venta}/registrar-pago'
 */
const registrarPagoee0a4c20f6ebeab09b767419c88f44b8 = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPagoee0a4c20f6ebeab09b767419c88f44b8.url(args, options),
    method: 'post',
})

registrarPagoee0a4c20f6ebeab09b767419c88f44b8.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/registrar-pago',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1576
 * @route '/ventas/{venta}/registrar-pago'
 */
registrarPagoee0a4c20f6ebeab09b767419c88f44b8.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return registrarPagoee0a4c20f6ebeab09b767419c88f44b8.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::registrarPago
 * @see app/Http/Controllers/VentaController.php:1576
 * @route '/ventas/{venta}/registrar-pago'
 */
registrarPagoee0a4c20f6ebeab09b767419c88f44b8.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: registrarPagoee0a4c20f6ebeab09b767419c88f44b8.url(args, options),
    method: 'post',
})

export const registrarPago = {
    '/api/app/ventas/{venta}/pagos': registrarPago3af764f1a59ea1a3a14549546c4d57d5,
    '/ventas/{venta}/registrar-pago': registrarPagoee0a4c20f6ebeab09b767419c88f44b8,
}

/**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1807
 * @route '/api/ventas/{venta}/imprimir'
 */
const imprimir27b644b341d4f39f9a6c6408d35bf196 = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir27b644b341d4f39f9a6c6408d35bf196.url(args, options),
    method: 'get',
})

imprimir27b644b341d4f39f9a6c6408d35bf196.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1807
 * @route '/api/ventas/{venta}/imprimir'
 */
imprimir27b644b341d4f39f9a6c6408d35bf196.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return imprimir27b644b341d4f39f9a6c6408d35bf196.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1807
 * @route '/api/ventas/{venta}/imprimir'
 */
imprimir27b644b341d4f39f9a6c6408d35bf196.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir27b644b341d4f39f9a6c6408d35bf196.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1807
 * @route '/api/ventas/{venta}/imprimir'
 */
imprimir27b644b341d4f39f9a6c6408d35bf196.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir27b644b341d4f39f9a6c6408d35bf196.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1807
 * @route '/ventas/{venta}/imprimir'
 */
const imprimir4ad68826c38954639f69db21939b471f = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir4ad68826c38954639f69db21939b471f.url(args, options),
    method: 'get',
})

imprimir4ad68826c38954639f69db21939b471f.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1807
 * @route '/ventas/{venta}/imprimir'
 */
imprimir4ad68826c38954639f69db21939b471f.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return imprimir4ad68826c38954639f69db21939b471f.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1807
 * @route '/ventas/{venta}/imprimir'
 */
imprimir4ad68826c38954639f69db21939b471f.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir4ad68826c38954639f69db21939b471f.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::imprimir
 * @see app/Http/Controllers/VentaController.php:1807
 * @route '/ventas/{venta}/imprimir'
 */
imprimir4ad68826c38954639f69db21939b471f.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir4ad68826c38954639f69db21939b471f.url(args, options),
    method: 'head',
})

export const imprimir = {
    '/api/ventas/{venta}/imprimir': imprimir27b644b341d4f39f9a6c6408d35bf196,
    '/ventas/{venta}/imprimir': imprimir4ad68826c38954639f69db21939b471f,
}

/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1895
 * @route '/api/ventas/{venta}/preview'
 */
const preview76bded3e32859fe97a52bb19ac4376af = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview76bded3e32859fe97a52bb19ac4376af.url(args, options),
    method: 'get',
})

preview76bded3e32859fe97a52bb19ac4376af.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1895
 * @route '/api/ventas/{venta}/preview'
 */
preview76bded3e32859fe97a52bb19ac4376af.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return preview76bded3e32859fe97a52bb19ac4376af.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1895
 * @route '/api/ventas/{venta}/preview'
 */
preview76bded3e32859fe97a52bb19ac4376af.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview76bded3e32859fe97a52bb19ac4376af.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1895
 * @route '/api/ventas/{venta}/preview'
 */
preview76bded3e32859fe97a52bb19ac4376af.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview76bded3e32859fe97a52bb19ac4376af.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1895
 * @route '/ventas/{venta}/preview'
 */
const preview030aad733cd31e4e2604dcd0dce6e484 = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview030aad733cd31e4e2604dcd0dce6e484.url(args, options),
    method: 'get',
})

preview030aad733cd31e4e2604dcd0dce6e484.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1895
 * @route '/ventas/{venta}/preview'
 */
preview030aad733cd31e4e2604dcd0dce6e484.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return preview030aad733cd31e4e2604dcd0dce6e484.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1895
 * @route '/ventas/{venta}/preview'
 */
preview030aad733cd31e4e2604dcd0dce6e484.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview030aad733cd31e4e2604dcd0dce6e484.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::preview
 * @see app/Http/Controllers/VentaController.php:1895
 * @route '/ventas/{venta}/preview'
 */
preview030aad733cd31e4e2604dcd0dce6e484.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview030aad733cd31e4e2604dcd0dce6e484.url(args, options),
    method: 'head',
})

export const preview = {
    '/api/ventas/{venta}/preview': preview76bded3e32859fe97a52bb19ac4376af,
    '/ventas/{venta}/preview': preview030aad733cd31e4e2604dcd0dce6e484,
}

/**
* @see \App\Http\Controllers\VentaController::ventasParaImpresion
 * @see app/Http/Controllers/VentaController.php:2198
 * @route '/api/ventas/para-impresion'
 */
export const ventasParaImpresion = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ventasParaImpresion.url(options),
    method: 'get',
})

ventasParaImpresion.definition = {
    methods: ["get","head"],
    url: '/api/ventas/para-impresion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::ventasParaImpresion
 * @see app/Http/Controllers/VentaController.php:2198
 * @route '/api/ventas/para-impresion'
 */
ventasParaImpresion.url = (options?: RouteQueryOptions) => {
    return ventasParaImpresion.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::ventasParaImpresion
 * @see app/Http/Controllers/VentaController.php:2198
 * @route '/api/ventas/para-impresion'
 */
ventasParaImpresion.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ventasParaImpresion.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::ventasParaImpresion
 * @see app/Http/Controllers/VentaController.php:2198
 * @route '/api/ventas/para-impresion'
 */
ventasParaImpresion.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ventasParaImpresion.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VentaController::search
 * @see app/Http/Controllers/VentaController.php:2584
 * @route '/api/ventas/search'
 */
export const search = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})

search.definition = {
    methods: ["get","head"],
    url: '/api/ventas/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::search
 * @see app/Http/Controllers/VentaController.php:2584
 * @route '/api/ventas/search'
 */
search.url = (options?: RouteQueryOptions) => {
    return search.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::search
 * @see app/Http/Controllers/VentaController.php:2584
 * @route '/api/ventas/search'
 */
search.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: search.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::search
 * @see app/Http/Controllers/VentaController.php:2584
 * @route '/api/ventas/search'
 */
search.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: search.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VentaController::searchWithPrestables
 * @see app/Http/Controllers/VentaController.php:107
 * @route '/api/ventas/con-prestables/search'
 */
export const searchWithPrestables = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchWithPrestables.url(options),
    method: 'get',
})

searchWithPrestables.definition = {
    methods: ["get","head"],
    url: '/api/ventas/con-prestables/search',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::searchWithPrestables
 * @see app/Http/Controllers/VentaController.php:107
 * @route '/api/ventas/con-prestables/search'
 */
searchWithPrestables.url = (options?: RouteQueryOptions) => {
    return searchWithPrestables.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::searchWithPrestables
 * @see app/Http/Controllers/VentaController.php:107
 * @route '/api/ventas/con-prestables/search'
 */
searchWithPrestables.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: searchWithPrestables.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::searchWithPrestables
 * @see app/Http/Controllers/VentaController.php:107
 * @route '/api/ventas/con-prestables/search'
 */
searchWithPrestables.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: searchWithPrestables.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:789
 * @route '/api/ventas/{id}/detalles'
 */
const show4ef3bdaf30af0bedb0ce7d739d92fb7b = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show4ef3bdaf30af0bedb0ce7d739d92fb7b.url(args, options),
    method: 'get',
})

show4ef3bdaf30af0bedb0ce7d739d92fb7b.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{id}/detalles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:789
 * @route '/api/ventas/{id}/detalles'
 */
show4ef3bdaf30af0bedb0ce7d739d92fb7b.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return show4ef3bdaf30af0bedb0ce7d739d92fb7b.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:789
 * @route '/api/ventas/{id}/detalles'
 */
show4ef3bdaf30af0bedb0ce7d739d92fb7b.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show4ef3bdaf30af0bedb0ce7d739d92fb7b.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:789
 * @route '/api/ventas/{id}/detalles'
 */
show4ef3bdaf30af0bedb0ce7d739d92fb7b.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show4ef3bdaf30af0bedb0ce7d739d92fb7b.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:789
 * @route '/api/ventas/{venta}'
 */
const show8a5319b95720abf558e2089cc13e71ec = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show8a5319b95720abf558e2089cc13e71ec.url(args, options),
    method: 'get',
})

show8a5319b95720abf558e2089cc13e71ec.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:789
 * @route '/api/ventas/{venta}'
 */
show8a5319b95720abf558e2089cc13e71ec.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return show8a5319b95720abf558e2089cc13e71ec.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:789
 * @route '/api/ventas/{venta}'
 */
show8a5319b95720abf558e2089cc13e71ec.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show8a5319b95720abf558e2089cc13e71ec.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:789
 * @route '/api/ventas/{venta}'
 */
show8a5319b95720abf558e2089cc13e71ec.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show8a5319b95720abf558e2089cc13e71ec.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:789
 * @route '/ventas/{id}'
 */
const showee84ecb1c01a6e60954e3bb60fb8ae07 = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showee84ecb1c01a6e60954e3bb60fb8ae07.url(args, options),
    method: 'get',
})

showee84ecb1c01a6e60954e3bb60fb8ae07.definition = {
    methods: ["get","head"],
    url: '/ventas/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:789
 * @route '/ventas/{id}'
 */
showee84ecb1c01a6e60954e3bb60fb8ae07.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return showee84ecb1c01a6e60954e3bb60fb8ae07.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:789
 * @route '/ventas/{id}'
 */
showee84ecb1c01a6e60954e3bb60fb8ae07.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: showee84ecb1c01a6e60954e3bb60fb8ae07.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::show
 * @see app/Http/Controllers/VentaController.php:789
 * @route '/ventas/{id}'
 */
showee84ecb1c01a6e60954e3bb60fb8ae07.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: showee84ecb1c01a6e60954e3bb60fb8ae07.url(args, options),
    method: 'head',
})

export const show = {
    '/api/ventas/{id}/detalles': show4ef3bdaf30af0bedb0ce7d739d92fb7b,
    '/api/ventas/{venta}': show8a5319b95720abf558e2089cc13e71ec,
    '/ventas/{id}': showee84ecb1c01a6e60954e3bb60fb8ae07,
}

/**
* @see \App\Http\Controllers\VentaController::verificarStock
 * @see app/Http/Controllers/VentaController.php:1677
 * @route '/api/ventas/verificar-stock'
 */
const verificarStock7a87796bd2849517a48df1ab60ff5975 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verificarStock7a87796bd2849517a48df1ab60ff5975.url(options),
    method: 'post',
})

verificarStock7a87796bd2849517a48df1ab60ff5975.definition = {
    methods: ["post"],
    url: '/api/ventas/verificar-stock',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::verificarStock
 * @see app/Http/Controllers/VentaController.php:1677
 * @route '/api/ventas/verificar-stock'
 */
verificarStock7a87796bd2849517a48df1ab60ff5975.url = (options?: RouteQueryOptions) => {
    return verificarStock7a87796bd2849517a48df1ab60ff5975.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::verificarStock
 * @see app/Http/Controllers/VentaController.php:1677
 * @route '/api/ventas/verificar-stock'
 */
verificarStock7a87796bd2849517a48df1ab60ff5975.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verificarStock7a87796bd2849517a48df1ab60ff5975.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::verificarStock
 * @see app/Http/Controllers/VentaController.php:1677
 * @route '/ventas/stock/verificar'
 */
const verificarStockfd91eea2fd95a6c7de6a2ce0b83e27d1 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verificarStockfd91eea2fd95a6c7de6a2ce0b83e27d1.url(options),
    method: 'post',
})

verificarStockfd91eea2fd95a6c7de6a2ce0b83e27d1.definition = {
    methods: ["post"],
    url: '/ventas/stock/verificar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::verificarStock
 * @see app/Http/Controllers/VentaController.php:1677
 * @route '/ventas/stock/verificar'
 */
verificarStockfd91eea2fd95a6c7de6a2ce0b83e27d1.url = (options?: RouteQueryOptions) => {
    return verificarStockfd91eea2fd95a6c7de6a2ce0b83e27d1.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::verificarStock
 * @see app/Http/Controllers/VentaController.php:1677
 * @route '/ventas/stock/verificar'
 */
verificarStockfd91eea2fd95a6c7de6a2ce0b83e27d1.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: verificarStockfd91eea2fd95a6c7de6a2ce0b83e27d1.url(options),
    method: 'post',
})

export const verificarStock = {
    '/api/ventas/verificar-stock': verificarStock7a87796bd2849517a48df1ab60ff5975,
    '/ventas/stock/verificar': verificarStockfd91eea2fd95a6c7de6a2ce0b83e27d1,
}

/**
* @see \App\Http\Controllers\VentaController::productosStockBajo
 * @see app/Http/Controllers/VentaController.php:1606
 * @route '/api/ventas/productos/stock-bajo'
 */
const productosStockBajo51b656bf5a19adf08db710b26069883b = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosStockBajo51b656bf5a19adf08db710b26069883b.url(options),
    method: 'get',
})

productosStockBajo51b656bf5a19adf08db710b26069883b.definition = {
    methods: ["get","head"],
    url: '/api/ventas/productos/stock-bajo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::productosStockBajo
 * @see app/Http/Controllers/VentaController.php:1606
 * @route '/api/ventas/productos/stock-bajo'
 */
productosStockBajo51b656bf5a19adf08db710b26069883b.url = (options?: RouteQueryOptions) => {
    return productosStockBajo51b656bf5a19adf08db710b26069883b.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::productosStockBajo
 * @see app/Http/Controllers/VentaController.php:1606
 * @route '/api/ventas/productos/stock-bajo'
 */
productosStockBajo51b656bf5a19adf08db710b26069883b.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosStockBajo51b656bf5a19adf08db710b26069883b.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::productosStockBajo
 * @see app/Http/Controllers/VentaController.php:1606
 * @route '/api/ventas/productos/stock-bajo'
 */
productosStockBajo51b656bf5a19adf08db710b26069883b.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productosStockBajo51b656bf5a19adf08db710b26069883b.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::productosStockBajo
 * @see app/Http/Controllers/VentaController.php:1606
 * @route '/ventas/stock/bajo'
 */
const productosStockBajoce5d9a17272226541db9102efbe90f0f = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosStockBajoce5d9a17272226541db9102efbe90f0f.url(options),
    method: 'get',
})

productosStockBajoce5d9a17272226541db9102efbe90f0f.definition = {
    methods: ["get","head"],
    url: '/ventas/stock/bajo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::productosStockBajo
 * @see app/Http/Controllers/VentaController.php:1606
 * @route '/ventas/stock/bajo'
 */
productosStockBajoce5d9a17272226541db9102efbe90f0f.url = (options?: RouteQueryOptions) => {
    return productosStockBajoce5d9a17272226541db9102efbe90f0f.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::productosStockBajo
 * @see app/Http/Controllers/VentaController.php:1606
 * @route '/ventas/stock/bajo'
 */
productosStockBajoce5d9a17272226541db9102efbe90f0f.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: productosStockBajoce5d9a17272226541db9102efbe90f0f.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::productosStockBajo
 * @see app/Http/Controllers/VentaController.php:1606
 * @route '/ventas/stock/bajo'
 */
productosStockBajoce5d9a17272226541db9102efbe90f0f.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: productosStockBajoce5d9a17272226541db9102efbe90f0f.url(options),
    method: 'head',
})

export const productosStockBajo = {
    '/api/ventas/productos/stock-bajo': productosStockBajo51b656bf5a19adf08db710b26069883b,
    '/ventas/stock/bajo': productosStockBajoce5d9a17272226541db9102efbe90f0f,
}

/**
* @see \App\Http\Controllers\VentaController::obtenerStockProducto
 * @see app/Http/Controllers/VentaController.php:1639
 * @route '/api/ventas/{producto}/stock'
 */
const obtenerStockProductof871834c3677537f452fd093d4e5e38d = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerStockProductof871834c3677537f452fd093d4e5e38d.url(args, options),
    method: 'get',
})

obtenerStockProductof871834c3677537f452fd093d4e5e38d.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{producto}/stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::obtenerStockProducto
 * @see app/Http/Controllers/VentaController.php:1639
 * @route '/api/ventas/{producto}/stock'
 */
obtenerStockProductof871834c3677537f452fd093d4e5e38d.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return obtenerStockProductof871834c3677537f452fd093d4e5e38d.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::obtenerStockProducto
 * @see app/Http/Controllers/VentaController.php:1639
 * @route '/api/ventas/{producto}/stock'
 */
obtenerStockProductof871834c3677537f452fd093d4e5e38d.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerStockProductof871834c3677537f452fd093d4e5e38d.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::obtenerStockProducto
 * @see app/Http/Controllers/VentaController.php:1639
 * @route '/api/ventas/{producto}/stock'
 */
obtenerStockProductof871834c3677537f452fd093d4e5e38d.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerStockProductof871834c3677537f452fd093d4e5e38d.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::obtenerStockProducto
 * @see app/Http/Controllers/VentaController.php:1639
 * @route '/ventas/stock/producto/{producto}'
 */
const obtenerStockProductoa80d4f4a6788a762379a84a99ab2f35a = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerStockProductoa80d4f4a6788a762379a84a99ab2f35a.url(args, options),
    method: 'get',
})

obtenerStockProductoa80d4f4a6788a762379a84a99ab2f35a.definition = {
    methods: ["get","head"],
    url: '/ventas/stock/producto/{producto}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::obtenerStockProducto
 * @see app/Http/Controllers/VentaController.php:1639
 * @route '/ventas/stock/producto/{producto}'
 */
obtenerStockProductoa80d4f4a6788a762379a84a99ab2f35a.url = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return obtenerStockProductoa80d4f4a6788a762379a84a99ab2f35a.definition.url
            .replace('{producto}', parsedArgs.producto.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::obtenerStockProducto
 * @see app/Http/Controllers/VentaController.php:1639
 * @route '/ventas/stock/producto/{producto}'
 */
obtenerStockProductoa80d4f4a6788a762379a84a99ab2f35a.get = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerStockProductoa80d4f4a6788a762379a84a99ab2f35a.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::obtenerStockProducto
 * @see app/Http/Controllers/VentaController.php:1639
 * @route '/ventas/stock/producto/{producto}'
 */
obtenerStockProductoa80d4f4a6788a762379a84a99ab2f35a.head = (args: { producto: number | { id: number } } | [producto: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerStockProductoa80d4f4a6788a762379a84a99ab2f35a.url(args, options),
    method: 'head',
})

export const obtenerStockProducto = {
    '/api/ventas/{producto}/stock': obtenerStockProductof871834c3677537f452fd093d4e5e38d,
    '/ventas/stock/producto/{producto}': obtenerStockProductoa80d4f4a6788a762379a84a99ab2f35a,
}

/**
* @see \App\Http\Controllers\VentaController::obtenerResumenStock
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/api/ventas/{venta}/resumen-stock'
 */
const obtenerResumenStock0916b55df9ab499401caedde44c06420 = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumenStock0916b55df9ab499401caedde44c06420.url(args, options),
    method: 'get',
})

obtenerResumenStock0916b55df9ab499401caedde44c06420.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/resumen-stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::obtenerResumenStock
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/api/ventas/{venta}/resumen-stock'
 */
obtenerResumenStock0916b55df9ab499401caedde44c06420.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return obtenerResumenStock0916b55df9ab499401caedde44c06420.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::obtenerResumenStock
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/api/ventas/{venta}/resumen-stock'
 */
obtenerResumenStock0916b55df9ab499401caedde44c06420.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumenStock0916b55df9ab499401caedde44c06420.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::obtenerResumenStock
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/api/ventas/{venta}/resumen-stock'
 */
obtenerResumenStock0916b55df9ab499401caedde44c06420.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerResumenStock0916b55df9ab499401caedde44c06420.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::obtenerResumenStock
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/ventas/{venta}/stock/resumen'
 */
const obtenerResumenStock14e4faae2d52d40c4c7233a664660927 = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumenStock14e4faae2d52d40c4c7233a664660927.url(args, options),
    method: 'get',
})

obtenerResumenStock14e4faae2d52d40c4c7233a664660927.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/stock/resumen',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::obtenerResumenStock
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/ventas/{venta}/stock/resumen'
 */
obtenerResumenStock14e4faae2d52d40c4c7233a664660927.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return obtenerResumenStock14e4faae2d52d40c4c7233a664660927.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::obtenerResumenStock
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/ventas/{venta}/stock/resumen'
 */
obtenerResumenStock14e4faae2d52d40c4c7233a664660927.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: obtenerResumenStock14e4faae2d52d40c4c7233a664660927.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::obtenerResumenStock
 * @see app/Http/Controllers/VentaController.php:0
 * @route '/ventas/{venta}/stock/resumen'
 */
obtenerResumenStock14e4faae2d52d40c4c7233a664660927.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: obtenerResumenStock14e4faae2d52d40c4c7233a664660927.url(args, options),
    method: 'head',
})

export const obtenerResumenStock = {
    '/api/ventas/{venta}/resumen-stock': obtenerResumenStock0916b55df9ab499401caedde44c06420,
    '/ventas/{venta}/stock/resumen': obtenerResumenStock14e4faae2d52d40c4c7233a664660927,
}

/**
* @see \App\Http\Controllers\VentaController::anular
 * @see app/Http/Controllers/VentaController.php:1093
 * @route '/api/ventas/{venta}/anular'
 */
const anulara95a658c27231fa294facfb449783679 = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anulara95a658c27231fa294facfb449783679.url(args, options),
    method: 'post',
})

anulara95a658c27231fa294facfb449783679.definition = {
    methods: ["post"],
    url: '/api/ventas/{venta}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::anular
 * @see app/Http/Controllers/VentaController.php:1093
 * @route '/api/ventas/{venta}/anular'
 */
anulara95a658c27231fa294facfb449783679.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return anulara95a658c27231fa294facfb449783679.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::anular
 * @see app/Http/Controllers/VentaController.php:1093
 * @route '/api/ventas/{venta}/anular'
 */
anulara95a658c27231fa294facfb449783679.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anulara95a658c27231fa294facfb449783679.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::anular
 * @see app/Http/Controllers/VentaController.php:1093
 * @route '/ventas/{venta}/anular'
 */
const anularbd695711014b1e126c408af4e254c30b = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularbd695711014b1e126c408af4e254c30b.url(args, options),
    method: 'post',
})

anularbd695711014b1e126c408af4e254c30b.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/anular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::anular
 * @see app/Http/Controllers/VentaController.php:1093
 * @route '/ventas/{venta}/anular'
 */
anularbd695711014b1e126c408af4e254c30b.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return anularbd695711014b1e126c408af4e254c30b.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::anular
 * @see app/Http/Controllers/VentaController.php:1093
 * @route '/ventas/{venta}/anular'
 */
anularbd695711014b1e126c408af4e254c30b.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: anularbd695711014b1e126c408af4e254c30b.url(args, options),
    method: 'post',
})

export const anular = {
    '/api/ventas/{venta}/anular': anulara95a658c27231fa294facfb449783679,
    '/ventas/{venta}/anular': anularbd695711014b1e126c408af4e254c30b,
}

/**
* @see \App\Http\Controllers\VentaController::verificarReversionStock
 * @see app/Http/Controllers/VentaController.php:2351
 * @route '/api/ventas/{venta}/verificar-reversion-stock'
 */
export const verificarReversionStock = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verificarReversionStock.url(args, options),
    method: 'get',
})

verificarReversionStock.definition = {
    methods: ["get","head"],
    url: '/api/ventas/{venta}/verificar-reversion-stock',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::verificarReversionStock
 * @see app/Http/Controllers/VentaController.php:2351
 * @route '/api/ventas/{venta}/verificar-reversion-stock'
 */
verificarReversionStock.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return verificarReversionStock.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::verificarReversionStock
 * @see app/Http/Controllers/VentaController.php:2351
 * @route '/api/ventas/{venta}/verificar-reversion-stock'
 */
verificarReversionStock.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: verificarReversionStock.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::verificarReversionStock
 * @see app/Http/Controllers/VentaController.php:2351
 * @route '/api/ventas/{venta}/verificar-reversion-stock'
 */
verificarReversionStock.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: verificarReversionStock.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VentaController::ejecutarReversionStock
 * @see app/Http/Controllers/VentaController.php:2459
 * @route '/api/ventas/{venta}/ejecutar-reversion-stock'
 */
export const ejecutarReversionStock = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ejecutarReversionStock.url(args, options),
    method: 'post',
})

ejecutarReversionStock.definition = {
    methods: ["post"],
    url: '/api/ventas/{venta}/ejecutar-reversion-stock',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::ejecutarReversionStock
 * @see app/Http/Controllers/VentaController.php:2459
 * @route '/api/ventas/{venta}/ejecutar-reversion-stock'
 */
ejecutarReversionStock.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return ejecutarReversionStock.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::ejecutarReversionStock
 * @see app/Http/Controllers/VentaController.php:2459
 * @route '/api/ventas/{venta}/ejecutar-reversion-stock'
 */
ejecutarReversionStock.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: ejecutarReversionStock.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:213
 * @route '/api/ventas'
 */
const index2095395a67e3a716b06f7426c7cb10aa = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index2095395a67e3a716b06f7426c7cb10aa.url(options),
    method: 'get',
})

index2095395a67e3a716b06f7426c7cb10aa.definition = {
    methods: ["get","head"],
    url: '/api/ventas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:213
 * @route '/api/ventas'
 */
index2095395a67e3a716b06f7426c7cb10aa.url = (options?: RouteQueryOptions) => {
    return index2095395a67e3a716b06f7426c7cb10aa.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:213
 * @route '/api/ventas'
 */
index2095395a67e3a716b06f7426c7cb10aa.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index2095395a67e3a716b06f7426c7cb10aa.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:213
 * @route '/api/ventas'
 */
index2095395a67e3a716b06f7426c7cb10aa.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index2095395a67e3a716b06f7426c7cb10aa.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:213
 * @route '/ventas'
 */
const index62656055d2cbb9a98ec927b8a0af2335 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index62656055d2cbb9a98ec927b8a0af2335.url(options),
    method: 'get',
})

index62656055d2cbb9a98ec927b8a0af2335.definition = {
    methods: ["get","head"],
    url: '/ventas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:213
 * @route '/ventas'
 */
index62656055d2cbb9a98ec927b8a0af2335.url = (options?: RouteQueryOptions) => {
    return index62656055d2cbb9a98ec927b8a0af2335.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:213
 * @route '/ventas'
 */
index62656055d2cbb9a98ec927b8a0af2335.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index62656055d2cbb9a98ec927b8a0af2335.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::index
 * @see app/Http/Controllers/VentaController.php:213
 * @route '/ventas'
 */
index62656055d2cbb9a98ec927b8a0af2335.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index62656055d2cbb9a98ec927b8a0af2335.url(options),
    method: 'head',
})

export const index = {
    '/api/ventas': index2095395a67e3a716b06f7426c7cb10aa,
    '/ventas': index62656055d2cbb9a98ec927b8a0af2335,
}

/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:608
 * @route '/api/ventas'
 */
const store2095395a67e3a716b06f7426c7cb10aa = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store2095395a67e3a716b06f7426c7cb10aa.url(options),
    method: 'post',
})

store2095395a67e3a716b06f7426c7cb10aa.definition = {
    methods: ["post"],
    url: '/api/ventas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:608
 * @route '/api/ventas'
 */
store2095395a67e3a716b06f7426c7cb10aa.url = (options?: RouteQueryOptions) => {
    return store2095395a67e3a716b06f7426c7cb10aa.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:608
 * @route '/api/ventas'
 */
store2095395a67e3a716b06f7426c7cb10aa.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store2095395a67e3a716b06f7426c7cb10aa.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:608
 * @route '/ventas'
 */
const store62656055d2cbb9a98ec927b8a0af2335 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store62656055d2cbb9a98ec927b8a0af2335.url(options),
    method: 'post',
})

store62656055d2cbb9a98ec927b8a0af2335.definition = {
    methods: ["post"],
    url: '/ventas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:608
 * @route '/ventas'
 */
store62656055d2cbb9a98ec927b8a0af2335.url = (options?: RouteQueryOptions) => {
    return store62656055d2cbb9a98ec927b8a0af2335.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::store
 * @see app/Http/Controllers/VentaController.php:608
 * @route '/ventas'
 */
store62656055d2cbb9a98ec927b8a0af2335.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store62656055d2cbb9a98ec927b8a0af2335.url(options),
    method: 'post',
})

export const store = {
    '/api/ventas': store2095395a67e3a716b06f7426c7cb10aa,
    '/ventas': store62656055d2cbb9a98ec927b8a0af2335,
}

/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:1034
 * @route '/api/ventas/{venta}'
 */
const update8a5319b95720abf558e2089cc13e71ec = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update8a5319b95720abf558e2089cc13e71ec.url(args, options),
    method: 'put',
})

update8a5319b95720abf558e2089cc13e71ec.definition = {
    methods: ["put","patch"],
    url: '/api/ventas/{venta}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:1034
 * @route '/api/ventas/{venta}'
 */
update8a5319b95720abf558e2089cc13e71ec.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return update8a5319b95720abf558e2089cc13e71ec.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:1034
 * @route '/api/ventas/{venta}'
 */
update8a5319b95720abf558e2089cc13e71ec.put = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update8a5319b95720abf558e2089cc13e71ec.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:1034
 * @route '/api/ventas/{venta}'
 */
update8a5319b95720abf558e2089cc13e71ec.patch = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update8a5319b95720abf558e2089cc13e71ec.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:1034
 * @route '/ventas/{venta}'
 */
const update62967f9ad1b2d371e97b4ac4abfbeb93 = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update62967f9ad1b2d371e97b4ac4abfbeb93.url(args, options),
    method: 'put',
})

update62967f9ad1b2d371e97b4ac4abfbeb93.definition = {
    methods: ["put","patch"],
    url: '/ventas/{venta}',
} satisfies RouteDefinition<["put","patch"]>

/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:1034
 * @route '/ventas/{venta}'
 */
update62967f9ad1b2d371e97b4ac4abfbeb93.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return update62967f9ad1b2d371e97b4ac4abfbeb93.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:1034
 * @route '/ventas/{venta}'
 */
update62967f9ad1b2d371e97b4ac4abfbeb93.put = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: update62967f9ad1b2d371e97b4ac4abfbeb93.url(args, options),
    method: 'put',
})
/**
* @see \App\Http\Controllers\VentaController::update
 * @see app/Http/Controllers/VentaController.php:1034
 * @route '/ventas/{venta}'
 */
update62967f9ad1b2d371e97b4ac4abfbeb93.patch = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update62967f9ad1b2d371e97b4ac4abfbeb93.url(args, options),
    method: 'patch',
})

export const update = {
    '/api/ventas/{venta}': update8a5319b95720abf558e2089cc13e71ec,
    '/ventas/{venta}': update62967f9ad1b2d371e97b4ac4abfbeb93,
}

/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:1067
 * @route '/api/ventas/{venta}'
 */
const destroy8a5319b95720abf558e2089cc13e71ec = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy8a5319b95720abf558e2089cc13e71ec.url(args, options),
    method: 'delete',
})

destroy8a5319b95720abf558e2089cc13e71ec.definition = {
    methods: ["delete"],
    url: '/api/ventas/{venta}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:1067
 * @route '/api/ventas/{venta}'
 */
destroy8a5319b95720abf558e2089cc13e71ec.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return destroy8a5319b95720abf558e2089cc13e71ec.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:1067
 * @route '/api/ventas/{venta}'
 */
destroy8a5319b95720abf558e2089cc13e71ec.delete = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy8a5319b95720abf558e2089cc13e71ec.url(args, options),
    method: 'delete',
})

    /**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:1067
 * @route '/ventas/{venta}'
 */
const destroy62967f9ad1b2d371e97b4ac4abfbeb93 = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy62967f9ad1b2d371e97b4ac4abfbeb93.url(args, options),
    method: 'delete',
})

destroy62967f9ad1b2d371e97b4ac4abfbeb93.definition = {
    methods: ["delete"],
    url: '/ventas/{venta}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:1067
 * @route '/ventas/{venta}'
 */
destroy62967f9ad1b2d371e97b4ac4abfbeb93.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return destroy62967f9ad1b2d371e97b4ac4abfbeb93.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::destroy
 * @see app/Http/Controllers/VentaController.php:1067
 * @route '/ventas/{venta}'
 */
destroy62967f9ad1b2d371e97b4ac4abfbeb93.delete = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy62967f9ad1b2d371e97b4ac4abfbeb93.url(args, options),
    method: 'delete',
})

export const destroy = {
    '/api/ventas/{venta}': destroy8a5319b95720abf558e2089cc13e71ec,
    '/ventas/{venta}': destroy62967f9ad1b2d371e97b4ac4abfbeb93,
}

/**
* @see \App\Http\Controllers\VentaController::checkCajaAbierta
 * @see app/Http/Controllers/VentaController.php:531
 * @route '/ventas/check-caja-abierta'
 */
export const checkCajaAbierta = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkCajaAbierta.url(options),
    method: 'get',
})

checkCajaAbierta.definition = {
    methods: ["get","head"],
    url: '/ventas/check-caja-abierta',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::checkCajaAbierta
 * @see app/Http/Controllers/VentaController.php:531
 * @route '/ventas/check-caja-abierta'
 */
checkCajaAbierta.url = (options?: RouteQueryOptions) => {
    return checkCajaAbierta.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::checkCajaAbierta
 * @see app/Http/Controllers/VentaController.php:531
 * @route '/ventas/check-caja-abierta'
 */
checkCajaAbierta.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: checkCajaAbierta.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::checkCajaAbierta
 * @see app/Http/Controllers/VentaController.php:531
 * @route '/ventas/check-caja-abierta'
 */
checkCajaAbierta.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: checkCajaAbierta.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VentaController::create
 * @see app/Http/Controllers/VentaController.php:462
 * @route '/ventas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/ventas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::create
 * @see app/Http/Controllers/VentaController.php:462
 * @route '/ventas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::create
 * @see app/Http/Controllers/VentaController.php:462
 * @route '/ventas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::create
 * @see app/Http/Controllers/VentaController.php:462
 * @route '/ventas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VentaController::edit
 * @see app/Http/Controllers/VentaController.php:1006
 * @route '/ventas/{venta}/edit'
 */
export const edit = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::edit
 * @see app/Http/Controllers/VentaController.php:1006
 * @route '/ventas/{venta}/edit'
 */
edit.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return edit.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::edit
 * @see app/Http/Controllers/VentaController.php:1006
 * @route '/ventas/{venta}/edit'
 */
edit.get = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::edit
 * @see app/Http/Controllers/VentaController.php:1006
 * @route '/ventas/{venta}/edit'
 */
edit.head = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VentaController::formatosDisponibles
 * @see app/Http/Controllers/VentaController.php:1976
 * @route '/ventas/formatos-disponibles'
 */
export const formatosDisponibles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formatosDisponibles.url(options),
    method: 'get',
})

formatosDisponibles.definition = {
    methods: ["get","head"],
    url: '/ventas/formatos-disponibles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::formatosDisponibles
 * @see app/Http/Controllers/VentaController.php:1976
 * @route '/ventas/formatos-disponibles'
 */
formatosDisponibles.url = (options?: RouteQueryOptions) => {
    return formatosDisponibles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::formatosDisponibles
 * @see app/Http/Controllers/VentaController.php:1976
 * @route '/ventas/formatos-disponibles'
 */
formatosDisponibles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formatosDisponibles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::formatosDisponibles
 * @see app/Http/Controllers/VentaController.php:1976
 * @route '/ventas/formatos-disponibles'
 */
formatosDisponibles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: formatosDisponibles.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VentaController::aprobar
 * @see app/Http/Controllers/VentaController.php:1526
 * @route '/ventas/{venta}/aprobar'
 */
export const aprobar = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

aprobar.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/aprobar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::aprobar
 * @see app/Http/Controllers/VentaController.php:1526
 * @route '/ventas/{venta}/aprobar'
 */
aprobar.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return aprobar.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::aprobar
 * @see app/Http/Controllers/VentaController.php:1526
 * @route '/ventas/{venta}/aprobar'
 */
aprobar.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VentaController::rechazar
 * @see app/Http/Controllers/VentaController.php:1553
 * @route '/ventas/{venta}/rechazar'
 */
export const rechazar = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

rechazar.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/rechazar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::rechazar
 * @see app/Http/Controllers/VentaController.php:1553
 * @route '/ventas/{venta}/rechazar'
 */
rechazar.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return rechazar.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::rechazar
 * @see app/Http/Controllers/VentaController.php:1553
 * @route '/ventas/{venta}/rechazar'
 */
rechazar.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VentaController::exportarExcel
 * @see app/Http/Controllers/VentaController.php:2000
 * @route '/ventas/{venta}/exportar-excel'
 */
export const exportarExcel = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})

exportarExcel.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/exportar-excel',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::exportarExcel
 * @see app/Http/Controllers/VentaController.php:2000
 * @route '/ventas/{venta}/exportar-excel'
 */
exportarExcel.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return exportarExcel.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::exportarExcel
 * @see app/Http/Controllers/VentaController.php:2000
 * @route '/ventas/{venta}/exportar-excel'
 */
exportarExcel.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarExcel.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::exportarExcel
 * @see app/Http/Controllers/VentaController.php:2000
 * @route '/ventas/{venta}/exportar-excel'
 */
exportarExcel.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarExcel.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VentaController::exportarPdf
 * @see app/Http/Controllers/VentaController.php:2036
 * @route '/ventas/{venta}/exportar-pdf'
 */
export const exportarPdf = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})

exportarPdf.definition = {
    methods: ["get","head"],
    url: '/ventas/{venta}/exportar-pdf',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\VentaController::exportarPdf
 * @see app/Http/Controllers/VentaController.php:2036
 * @route '/ventas/{venta}/exportar-pdf'
 */
exportarPdf.url = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { venta: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: typeof args.venta === 'object'
                ? args.venta.id
                : args.venta,
                }

    return exportarPdf.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::exportarPdf
 * @see app/Http/Controllers/VentaController.php:2036
 * @route '/ventas/{venta}/exportar-pdf'
 */
exportarPdf.get = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportarPdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\VentaController::exportarPdf
 * @see app/Http/Controllers/VentaController.php:2036
 * @route '/ventas/{venta}/exportar-pdf'
 */
exportarPdf.head = (args: { venta: number | { id: number } } | [venta: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportarPdf.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\VentaController::storeConfirmacion
 * @see app/Http/Controllers/VentaController.php:2622
 * @route '/ventas/{venta}/confirmaciones'
 */
export const storeConfirmacion = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConfirmacion.url(args, options),
    method: 'post',
})

storeConfirmacion.definition = {
    methods: ["post"],
    url: '/ventas/{venta}/confirmaciones',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\VentaController::storeConfirmacion
 * @see app/Http/Controllers/VentaController.php:2622
 * @route '/ventas/{venta}/confirmaciones'
 */
storeConfirmacion.url = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { venta: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                }

    return storeConfirmacion.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::storeConfirmacion
 * @see app/Http/Controllers/VentaController.php:2622
 * @route '/ventas/{venta}/confirmaciones'
 */
storeConfirmacion.post = (args: { venta: string | number } | [venta: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: storeConfirmacion.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\VentaController::destroyConfirmacion
 * @see app/Http/Controllers/VentaController.php:2777
 * @route '/ventas/{venta}/confirmaciones/{confirmacion}'
 */
export const destroyConfirmacion = (args: { venta: string | number, confirmacion: string | number } | [venta: string | number, confirmacion: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyConfirmacion.url(args, options),
    method: 'delete',
})

destroyConfirmacion.definition = {
    methods: ["delete"],
    url: '/ventas/{venta}/confirmaciones/{confirmacion}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\VentaController::destroyConfirmacion
 * @see app/Http/Controllers/VentaController.php:2777
 * @route '/ventas/{venta}/confirmaciones/{confirmacion}'
 */
destroyConfirmacion.url = (args: { venta: string | number, confirmacion: string | number } | [venta: string | number, confirmacion: string | number ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
                    venta: args[0],
                    confirmacion: args[1],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        venta: args.venta,
                                confirmacion: args.confirmacion,
                }

    return destroyConfirmacion.definition.url
            .replace('{venta}', parsedArgs.venta.toString())
            .replace('{confirmacion}', parsedArgs.confirmacion.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\VentaController::destroyConfirmacion
 * @see app/Http/Controllers/VentaController.php:2777
 * @route '/ventas/{venta}/confirmaciones/{confirmacion}'
 */
destroyConfirmacion.delete = (args: { venta: string | number, confirmacion: string | number } | [venta: string | number, confirmacion: string | number ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroyConfirmacion.url(args, options),
    method: 'delete',
})
const VentaController = { ventasCliente, registrarPago, imprimir, preview, ventasParaImpresion, search, searchWithPrestables, show, verificarStock, productosStockBajo, obtenerStockProducto, obtenerResumenStock, anular, verificarReversionStock, ejecutarReversionStock, index, store, update, destroy, checkCajaAbierta, create, edit, formatosDisponibles, aprobar, rechazar, exportarExcel, exportarPdf, storeConfirmacion, destroyConfirmacion }

export default VentaController