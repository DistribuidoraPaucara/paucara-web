import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
import imprimir from './imprimir'
/**
* @see \App\Http\Controllers\Api\ApiProformaController::confirmar
 * @see app/Http/Controllers/Api/ApiProformaController.php:2500
 * @route '/api/proformas/{proforma}/confirmar'
 */
export const confirmar = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmar.url(args, options),
    method: 'post',
})

confirmar.definition = {
    methods: ["post"],
    url: '/api/proformas/{proforma}/confirmar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ApiProformaController::confirmar
 * @see app/Http/Controllers/Api/ApiProformaController.php:2500
 * @route '/api/proformas/{proforma}/confirmar'
 */
confirmar.url = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return confirmar.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiProformaController::confirmar
 * @see app/Http/Controllers/Api/ApiProformaController.php:2500
 * @route '/api/proformas/{proforma}/confirmar'
 */
confirmar.post = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: confirmar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ApiProformaController::confirmar
 * @see app/Http/Controllers/Api/ApiProformaController.php:2500
 * @route '/api/proformas/{proforma}/confirmar'
 */
    const confirmarForm = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: confirmar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ApiProformaController::confirmar
 * @see app/Http/Controllers/Api/ApiProformaController.php:2500
 * @route '/api/proformas/{proforma}/confirmar'
 */
        confirmarForm.post = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: confirmar.url(args, options),
            method: 'post',
        })
    
    confirmar.form = confirmarForm
/**
* @see \App\Http\Controllers\Api\ApiProformaController::coordinar
 * @see app/Http/Controllers/Api/ApiProformaController.php:1710
 * @route '/api/proformas/{proforma}/coordinar'
 */
export const coordinar = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: coordinar.url(args, options),
    method: 'post',
})

coordinar.definition = {
    methods: ["post"],
    url: '/api/proformas/{proforma}/coordinar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ApiProformaController::coordinar
 * @see app/Http/Controllers/Api/ApiProformaController.php:1710
 * @route '/api/proformas/{proforma}/coordinar'
 */
coordinar.url = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return coordinar.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiProformaController::coordinar
 * @see app/Http/Controllers/Api/ApiProformaController.php:1710
 * @route '/api/proformas/{proforma}/coordinar'
 */
coordinar.post = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: coordinar.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ApiProformaController::coordinar
 * @see app/Http/Controllers/Api/ApiProformaController.php:1710
 * @route '/api/proformas/{proforma}/coordinar'
 */
    const coordinarForm = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: coordinar.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ApiProformaController::coordinar
 * @see app/Http/Controllers/Api/ApiProformaController.php:1710
 * @route '/api/proformas/{proforma}/coordinar'
 */
        coordinarForm.post = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: coordinar.url(args, options),
            method: 'post',
        })
    
    coordinar.form = coordinarForm
/**
* @see \App\Http\Controllers\Api\ApiProformaController::actualizarDetalles
 * @see app/Http/Controllers/Api/ApiProformaController.php:4776
 * @route '/api/proformas/{proforma}/actualizar-detalles'
 */
export const actualizarDetalles = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarDetalles.url(args, options),
    method: 'post',
})

actualizarDetalles.definition = {
    methods: ["post"],
    url: '/api/proformas/{proforma}/actualizar-detalles',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\ApiProformaController::actualizarDetalles
 * @see app/Http/Controllers/Api/ApiProformaController.php:4776
 * @route '/api/proformas/{proforma}/actualizar-detalles'
 */
actualizarDetalles.url = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
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

    return actualizarDetalles.definition.url
            .replace('{proforma}', parsedArgs.proforma.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\ApiProformaController::actualizarDetalles
 * @see app/Http/Controllers/Api/ApiProformaController.php:4776
 * @route '/api/proformas/{proforma}/actualizar-detalles'
 */
actualizarDetalles.post = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: actualizarDetalles.url(args, options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\Api\ApiProformaController::actualizarDetalles
 * @see app/Http/Controllers/Api/ApiProformaController.php:4776
 * @route '/api/proformas/{proforma}/actualizar-detalles'
 */
    const actualizarDetallesForm = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: actualizarDetalles.url(args, options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\Api\ApiProformaController::actualizarDetalles
 * @see app/Http/Controllers/Api/ApiProformaController.php:4776
 * @route '/api/proformas/{proforma}/actualizar-detalles'
 */
        actualizarDetallesForm.post = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: actualizarDetalles.url(args, options),
            method: 'post',
        })
    
    actualizarDetalles.form = actualizarDetallesForm
/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
export const preview = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})

preview.definition = {
    methods: ["get","head"],
    url: '/api/proformas/{proforma}/preview',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
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
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
preview.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: preview.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
preview.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: preview.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
    const previewForm = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: preview.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
        previewForm.get = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ProformaController::preview
 * @see app/Http/Controllers/ProformaController.php:1053
 * @route '/api/proformas/{proforma}/preview'
 */
        previewForm.head = (args: { proforma: number | { id: number } } | [proforma: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: preview.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    preview.form = previewForm
const proformas = {
    imprimir,
confirmar,
coordinar,
actualizarDetalles,
preview,
}

export default proformas