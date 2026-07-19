import { useState, useCallback } from 'react'
import type { Cliente } from '@/domain/entities/clientes'

export interface ClienteDeuda {
    cliente: Cliente & {
        limite_credito: number
        foto_perfil?: string
        direcciones: Array<{ id: number; direccion: string; localidad_id: number }>
    }
    deuda: {
        cuentas_por_cobrar: number
        proformas_pendientes: number
        total_deuda: number
        disponible_credito: number
        puede_hacer_credito: boolean
    }
}

/**
 * ✅ NUEVO (2026-07-18): Hook para obtener información de deuda del cliente
 * Calcula:
 * - Deuda de cuentas_por_cobrar (ACTIVA, PENDIENTE, PARCIAL)
 * - Deuda de proformas pendientes
 * - Total deuda
 * - Disponible para crédito
 */
export function useClienteDeuda() {
    const [clienteDeuda, setClienteDeuda] = useState<ClienteDeuda | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const obtenerClienteDeuda = useCallback(async (clienteId: number) => {
        setLoading(true)
        setError(null)
        try {
            const response = await fetch(`/api/proformas/cliente/${clienteId}/deuda`)
            if (!response.ok) {
                throw new Error('Error al obtener información del cliente')
            }
            const data = await response.json()

            // ✅ NUEVO (2026-07-18): Log completo del JSON sin separar
            console.group('💳 DEUDA CLIENTE - JSON COMPLETO DEL ENDPOINT')
            console.log(JSON.stringify(data, null, 2))
            console.log('Estructura:', data)
            console.groupEnd()

            setClienteDeuda(data)
            return data
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Error desconocido'
            setError(errorMsg)
            console.error('❌ Error en useClienteDeuda:', errorMsg)
            return null
        } finally {
            setLoading(false)
        }
    }, [])

    const limpiar = useCallback(() => {
        setClienteDeuda(null)
        setError(null)
    }, [])

    return {
        clienteDeuda,
        loading,
        error,
        obtenerClienteDeuda,
        limpiar,
    }
}
