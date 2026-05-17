import { useState, useEffect, useCallback, useRef } from 'react'

interface ProductoBusqueda {
    id: number
    nombre: string
    sku?: string
    codigo?: string
    codigo_barras?: string
    codigos_barra?: Array<{ codigo: string }>
    marca?: { nombre: string }
    categoria?: { nombre: string }
    unidad?: { nombre: string }
    precio?: number
    precio_venta?: number
    cantidad_disponible?: number
    stock_disponible?: number
}

interface UseBuscarProductosOptions {
    debounceMs?: number
}

export function useBuscarProductos(options: UseBuscarProductosOptions = {}) {
    const { debounceMs = 300 } = options

    const [searchTerm, setSearchTerm] = useState('')
    const [productos, setProductos] = useState<ProductoBusqueda[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Referencia para el timeout del debounce
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    // Referencia para cancelar requests previas
    const abortControllerRef = useRef<AbortController | null>(null)

    const buscarProductos = useCallback(async (term: string) => {
        // Cancelar request anterior si existe
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        // Si el término está vacío, limpiar resultados
        if (!term.trim()) {
            setProductos([])
            setError(null)
            return
        }

        // Si el término tiene menos de 2 caracteres, no buscar
        if (term.trim().length < 2) {
            setProductos([])
            return
        }

        setIsLoading(true)
        setError(null)

        try {
            // Crear nuevo AbortController para esta request
            abortControllerRef.current = new AbortController()

            const url = `/api/productos?q=${encodeURIComponent(term)}&per_page=20`
            console.log('🔍 [API] Buscando productos con endpoint:', url)

            const response = await fetch(url, {
                credentials: 'same-origin',
                signal: abortControllerRef.current.signal,
            })

            if (!response.ok) {
                console.warn(`⚠️ [API] Respuesta fallida: ${response.status} ${response.statusText}`)
                if (response.status === 401) {
                    setError('No autorizado')
                } else {
                    setError('Error al buscar productos')
                }
                setProductos([])
                return
            }

            const result = await response.json()
            console.log('✅ [API] Respuesta recibida:', result)
            const productosData = result.data?.data || result.data || []
            console.log(`📦 [API] ${productosData.length} productos encontrados`)
            setProductos(Array.isArray(productosData) ? productosData : [])
        } catch (err) {
            // No mostrar error si fue cancelado (normal en debounce)
            if (err instanceof Error && err.name !== 'AbortError') {
                console.error('Error buscando productos:', err)
                setError('Error al buscar productos')
                setProductos([])
            }
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Aplicar debounce a la búsqueda
    useEffect(() => {
        // Limpiar timeout previo si existe
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
        }

        // Establecer nuevo timeout
        debounceTimeoutRef.current = setTimeout(() => {
            buscarProductos(searchTerm)
        }, debounceMs)

        // Cleanup
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current)
            }
        }
    }, [searchTerm, debounceMs, buscarProductos])

    // Cleanup en unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [])

    return {
        searchTerm,
        setSearchTerm,
        productos,
        isLoading,
        error,
    }
}
