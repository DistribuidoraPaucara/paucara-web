import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import AsyncSearchSelect from '@/presentation/components/ui/async-search-select'

interface TipoPago {
  id: number
  codigo: string
  nombre: string
}

interface Props {
  defaultClienteId: number | null
  defaultClienteName: string | null
  tiposPago: TipoPago[]
}

export default function ServiciosCreate({ defaultClienteId, defaultClienteName, tiposPago }: Props) {
  const [clienteId, setClienteId] = useState<number | null>(defaultClienteId || null)
  const [descripcion, setDescripcion] = useState('INYECCION DE AMPOLLA')
  const [monto, setMonto] = useState('10')
  const [tipoPagoId, setTipoPagoId] = useState<number | null>(tiposPago.length > 0 ? tiposPago[0].id : null)
  const [observaciones, setObservaciones] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!descripcion.trim()) {
      toast.error('La descripción es requerida')
      return
    }

    if (!monto || parseFloat(monto) <= 0) {
      toast.error('El monto debe ser mayor a 0')
      return
    }

    if (!tipoPagoId) {
      toast.error('Selecciona un tipo de pago')
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch('/servicios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          cliente_id: clienteId,
          descripcion,
          monto: parseFloat(monto),
          tipo_pago_id: tipoPagoId,
          observaciones,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        if (responseData.errors) {
          const errorMessages = Object.entries(responseData.errors)
            .map(([field, messages]) => {
              const msgText = Array.isArray(messages) ? messages.join(', ') : String(messages)
              return `${field}: ${msgText}`
            })
            .join('\n')
          toast.error(errorMessages || 'Error al crear servicio')
        } else {
          toast.error(responseData.message || 'Error al crear servicio')
        }
        return
      }

      toast.success(responseData.message || 'Servicio registrado exitosamente')
      setTimeout(() => {
        window.location.href = `/servicios/${responseData.servicio.id}`
      }, 1000)
    } catch (error) {
      console.error('Error al crear servicio:', error)
      toast.error('Error al crear servicio')
    } finally {
      setIsProcessing(false)
    }
  }

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Nuevo', href: '/servicios/create' },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nuevo Servicio" />

      <div className="py-12">
        <div className="sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Registrar Servicio</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Registra servicios como inyecciones, consultas, etc.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cliente (búsqueda) */}
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <AsyncSearchSelect
                id="cliente"
                label="Cliente"
                placeholder={defaultClienteName || 'Buscar cliente...'}
                value={clienteId?.toString() || ''}
                onChange={(value) => setClienteId(value ? parseInt(String(value)) : null)}
                searchEndpoint="/api/clientes/search"
                initialOptions={
                  defaultClienteId && defaultClienteName
                    ? [{ value: defaultClienteId.toString(), label: defaultClienteName }]
                    : []
                }
                minSearchLength={1}
                debounceMs={300}
                allowClear
              />
            </div>

            {/* Descripción */}
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Descripción del Servicio *
              </label>
              <input
                type="text"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Ej: Inyección de ampolla, Consulta médica..."
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Monto */}
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto Cobrado (Bs.) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Tipo de Pago */}
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipo de Pago *
              </label>
              <select
                value={tipoPagoId || ''}
                onChange={(e) => setTipoPagoId(parseInt(e.target.value) || null)}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">-- Selecciona tipo de pago --</option>
                {tiposPago.map((tp) => (
                  <option key={tp.id} value={tp.id}>
                    {tp.nombre} ({tp.codigo})
                  </option>
                ))}
              </select>
            </div>

            {/* Observaciones */}
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observaciones
              </label>
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Notas adicionales..."
                rows={3}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Resumen */}
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 sm:rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Monto a cobrar:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    Bs. {monto ? parseFloat(monto).toFixed(2) : '0.00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isProcessing}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition"
              >
                {isProcessing ? 'Procesando...' : 'Registrar Servicio'}
              </button>

              <a
                href="/servicios"
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-900 font-medium py-2 px-4 rounded-md text-center transition"
              >
                Cancelar
              </a>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
