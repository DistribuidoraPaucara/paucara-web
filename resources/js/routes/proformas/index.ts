import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ProformaController::index
 * @see app/Http/Controllers/ProformaController.php:53
 * @route '/proformas'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/proformas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::index
 * @see app/Http/Controllers/ProformaController.php:53
 * @route '/proformas'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::index
 * @see app/Http/Controllers/ProformaController.php:53
 * @route '/proformas'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::index
 * @see app/Http/Controllers/ProformaController.php:53
 * @route '/proformas'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProformaController::create
 * @see app/Http/Controllers/ProformaController.php:238
 * @route '/proformas/create'
 */
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/proformas/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::create
 * @see app/Http/Controllers/ProformaController.php:238
 * @route '/proformas/create'
 */
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::create
 * @see app/Http/Controllers/ProformaController.php:238
 * @route '/proformas/create'
 */
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::create
 * @see app/Http/Controllers/ProformaController.php:238
 * @route '/proformas/create'
 */
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProformaController::store
 * @see app/Http/Controllers/ProformaController.php:586
 * @route '/proformas'
 */
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/proformas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProformaController::store
 * @see app/Http/Controllers/ProformaController.php:586
 * @route '/proformas'
 */
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::store
 * @see app/Http/Controllers/ProformaController.php:586
 * @route '/proformas'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProformaController::formatosDisponibles
 * @see app/Http/Controllers/ProformaController.php:1199
 * @route '/proformas/formatos-disponibles'
 */
export const formatosDisponibles = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formatosDisponibles.url(options),
    method: 'get',
})

formatosDisponibles.definition = {
    methods: ["get","head"],
    url: '/proformas/formatos-disponibles',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::formatosDisponibles
 * @see app/Http/Controllers/ProformaController.php:1199
 * @route '/proformas/formatos-disponibles'
 */
formatosDisponibles.url = (options?: RouteQueryOptions) => {
    return formatosDisponibles.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::formatosDisponibles
 * @see app/Http/Controllers/ProformaController.php:1199
 * @route '/proformas/formatos-disponibles'
 */
formatosDisponibles.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: formatosDisponibles.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::formatosDisponibles
 * @see app/Http/Controllers/ProformaController.php:1199
 * @route '/proformas/formatos-disponibles'
 */
formatosDisponibles.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: formatosDisponibles.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProformaController::edit
 * @see app/Http/Controllers/ProformaController.php:286
 * @route '/proformas/{proforma}/edit'
 */
export const edit = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/proformas/{proforma}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::edit
 * @see app/Http/Controllers/ProformaController.php:286
 * @route '/proformas/{proforma}/edit'
 */
edit.url = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proforma: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { proforma: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    proforma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proforma: typeof args.proforma === 'object'
                ? args.proforma.id
                : args.proforma,
                }

    return edit.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::edit
 * @see app/Http/Controllers/ProformaController.php:286
 * @route '/proformas/{proforma}/edit'
 */
edit.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::edit
 * @see app/Http/Controllers/ProformaController.php:286
 * @route '/proformas/{proforma}/edit'
 */
edit.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProformaController::imprimirFiltrado
 * @see app/Http/Controllers/ProformaController.php:1281
 * @route '/proformas/imprimir-filtrado'
 */
export const imprimirFiltrado = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirFiltrado.url(options),
    method: 'get',
})

imprimirFiltrado.definition = {
    methods: ["get","head"],
    url: '/proformas/imprimir-filtrado',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::imprimirFiltrado
 * @see app/Http/Controllers/ProformaController.php:1281
 * @route '/proformas/imprimir-filtrado'
 */
imprimirFiltrado.url = (options?: RouteQueryOptions) => {
    return imprimirFiltrado.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::imprimirFiltrado
 * @see app/Http/Controllers/ProformaController.php:1281
 * @route '/proformas/imprimir-filtrado'
 */
imprimirFiltrado.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirFiltrado.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::imprimirFiltrado
 * @see app/Http/Controllers/ProformaController.php:1281
 * @route '/proformas/imprimir-filtrado'
 */
imprimirFiltrado.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirFiltrado.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ImpresionProformasController::imprimirBatch
 * @see app/Http/Controllers/ImpresionProformasController.php:16
 * @route '/proformas/imprimir'
 */
export const imprimirBatch = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirBatch.url(options),
    method: 'get',
})

imprimirBatch.definition = {
    methods: ["get","head"],
    url: '/proformas/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ImpresionProformasController::imprimirBatch
 * @see app/Http/Controllers/ImpresionProformasController.php:16
 * @route '/proformas/imprimir'
 */
imprimirBatch.url = (options?: RouteQueryOptions) => {
    return imprimirBatch.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ImpresionProformasController::imprimirBatch
 * @see app/Http/Controllers/ImpresionProformasController.php:16
 * @route '/proformas/imprimir'
 */
imprimirBatch.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimirBatch.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ImpresionProformasController::imprimirBatch
 * @see app/Http/Controllers/ImpresionProformasController.php:16
 * @route '/proformas/imprimir'
 */
imprimirBatch.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimirBatch.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:1089
 * @route '/proformas/{proforma}/imprimir'
 */
export const imprimir = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})

imprimir.definition = {
    methods: ["get","head"],
    url: '/proformas/{proforma}/imprimir',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:1089
 * @route '/proformas/{proforma}/imprimir'
 */
imprimir.url = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proforma: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { proforma: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    proforma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proforma: typeof args.proforma === 'object'
                ? args.proforma.id
                : args.proforma,
                }

    return imprimir.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:1089
 * @route '/proformas/{proforma}/imprimir'
 */
imprimir.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: imprimir.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::imprimir
 * @see app/Http/Controllers/ProformaController.php:1089
 * @route '/proformas/{proforma}/imprimir'
 */
imprimir.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: imprimir.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1146
 * @route '/proformas/{proforma}/preview'
 */
export const preview = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/proformas/{proforma}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1146
 * @route '/proformas/{proforma}/preview'
 */
preview.url = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proforma: args }
    }

            if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
            args = { proforma: args.id }
        }
    
    if (Array.isArray(args)) {
        args = {
                    proforma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proforma: typeof args.proforma === 'object'
                ? args.proforma.id
                : args.proforma,
                }

    return preview.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1146
 * @route '/proformas/{proforma}/preview'
 */
preview.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1146
 * @route '/proformas/{proforma}/preview'
 */
preview.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProformaController::show
 * @see app/Http/Controllers/ProformaController.php:646
 * @route '/proformas/{proforma}'
 */
export const show = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/proformas/{proforma}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::show
 * @see app/Http/Controllers/ProformaController.php:646
 * @route '/proformas/{proforma}'
 */
show.url = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proforma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    proforma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proforma: args.proforma,
                }

    return show.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::show
 * @see app/Http/Controllers/ProformaController.php:646
 * @route '/proformas/{proforma}'
 */
show.get = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::show
 * @see app/Http/Controllers/ProformaController.php:646
 * @route '/proformas/{proforma}'
 */
show.head = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProformaController::resumenCredito
 * @see app/Http/Controllers/ProformaController.php:684
 * @route '/proformas/{proforma}/resumen-credito'
 */
export const resumenCredito = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumenCredito.url(args, options),
    method: 'get',
})

resumenCredito.definition = {
    methods: ["get","head"],
    url: '/proformas/{proforma}/resumen-credito',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::resumenCredito
 * @see app/Http/Controllers/ProformaController.php:684
 * @route '/proformas/{proforma}/resumen-credito'
 */
resumenCredito.url = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { proforma: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    proforma: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        proforma: args.proforma,
                }

    return resumenCredito.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::resumenCredito
 * @see app/Http/Controllers/ProformaController.php:684
 * @route '/proformas/{proforma}/resumen-credito'
 */
resumenCredito.get = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: resumenCredito.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::resumenCredito
 * @see app/Http/Controllers/ProformaController.php:684
 * @route '/proformas/{proforma}/resumen-credito'
 */
resumenCredito.head = (args: { proforma: string | number } | [proforma: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: resumenCredito.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProformaController::aprobar
 * @see app/Http/Controllers/ProformaController.php:715
 * @route '/proformas/{id}/aprobar'
 */
export const aprobar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

aprobar.definition = {
    methods: ["post"],
    url: '/proformas/{id}/aprobar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProformaController::aprobar
 * @see app/Http/Controllers/ProformaController.php:715
 * @route '/proformas/{id}/aprobar'
 */
aprobar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return aprobar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::aprobar
 * @see app/Http/Controllers/ProformaController.php:715
 * @route '/proformas/{id}/aprobar'
 */
aprobar.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: aprobar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProformaController::rechazar
 * @see app/Http/Controllers/ProformaController.php:754
 * @route '/proformas/{id}/rechazar'
 */
export const rechazar = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

rechazar.definition = {
    methods: ["post"],
    url: '/proformas/{id}/rechazar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProformaController::rechazar
 * @see app/Http/Controllers/ProformaController.php:754
 * @route '/proformas/{id}/rechazar'
 */
rechazar.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return rechazar.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::rechazar
 * @see app/Http/Controllers/ProformaController.php:754
 * @route '/proformas/{id}/rechazar'
 */
rechazar.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rechazar.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProformaController::procesarVenta
 * @see app/Http/Controllers/ProformaController.php:875
 * @route '/proformas/{id}/procesar-venta'
 */
export const procesarVenta = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarVenta.url(args, options),
    method: 'post',
})

procesarVenta.definition = {
    methods: ["post"],
    url: '/proformas/{id}/procesar-venta',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProformaController::procesarVenta
 * @see app/Http/Controllers/ProformaController.php:875
 * @route '/proformas/{id}/procesar-venta'
 */
procesarVenta.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return procesarVenta.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::procesarVenta
 * @see app/Http/Controllers/ProformaController.php:875
 * @route '/proformas/{id}/procesar-venta'
 */
procesarVenta.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: procesarVenta.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProformaController::convertirVenta
 * @see app/Http/Controllers/ProformaController.php:795
 * @route '/proformas/{id}/convertir-venta'
 */
export const convertirVenta = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertirVenta.url(args, options),
    method: 'post',
})

convertirVenta.definition = {
    methods: ["post"],
    url: '/proformas/{id}/convertir-venta',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProformaController::convertirVenta
 * @see app/Http/Controllers/ProformaController.php:795
 * @route '/proformas/{id}/convertir-venta'
 */
convertirVenta.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return convertirVenta.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::convertirVenta
 * @see app/Http/Controllers/ProformaController.php:795
 * @route '/proformas/{id}/convertir-venta'
 */
convertirVenta.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: convertirVenta.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\ProformaController::renovarReservas
 * @see app/Http/Controllers/ProformaController.php:967
 * @route '/proformas/{id}/renovar-reservas'
 */
export const renovarReservas = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renovarReservas.url(args, options),
    method: 'post',
})

renovarReservas.definition = {
    methods: ["post"],
    url: '/proformas/{id}/renovar-reservas',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ProformaController::renovarReservas
 * @see app/Http/Controllers/ProformaController.php:967
 * @route '/proformas/{id}/renovar-reservas'
 */
renovarReservas.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return renovarReservas.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProformaController::renovarReservas
 * @see app/Http/Controllers/ProformaController.php:967
 * @route '/proformas/{id}/renovar-reservas'
 */
renovarReservas.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: renovarReservas.url(args, options),
    method: 'post',
})
const proformas = {
    index,
create,
store,
formatosDisponibles,
edit,
imprimirFiltrado,
imprimirBatch,
imprimir,
preview,
show,
resumenCredito,
aprobar,
rechazar,
procesarVenta,
convertirVenta,
renovarReservas,
}

export default proformas