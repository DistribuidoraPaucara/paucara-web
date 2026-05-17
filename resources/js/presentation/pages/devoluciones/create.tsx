import AppLayout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import React, { useState, useMemo } from 'react'
import { useAuth } from '@/application/hooks/use-auth'
import { toast } from 'react-toastify'

interface VentaDetalle {
  id: number
  producto_id: number
  producto_nombre: string
  cantidad: number
  precio_unitario: number
  subtotal: number
}

interface Venta {
  id: number
  numero: string
  fecha: string
  total: number
  cliente_id: number
  cliente_nombre: string
  detalles: VentaDetalle[]
}

interface Producto {
  id: number
  nombre: string
  sku: string
  precio_venta: number
}

interface TipoPago {
  id: number
  codigo: string
  nombre: string
}

interface Props {
  venta: Venta
  productos: Producto[]
  tiposPago: TipoPago[]
}

export default function DevolucionesCreate({ venta, productos, tiposPago }: Props) {
  const [tipo, setTipo] = useState('DEVOLUCION')
  const [motivo, setMotivo] = useState('')
  const [tipoReembolso, setTipoReembolso] = useState('EFECTIVO')
  const [tipoPagoId, setTipoPagoId] = useState<number | null>(tiposPago.length > 0 ? tiposPago[0].id : null)
  const [observaciones, setObservaciones] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const [detallesSeleccionados, setDetallesSeleccionados] = useState<
    Map<number, number>
  >(new Map())
  const [cambiosSeleccionados, setChangiosSeleccionados] = useState<
    Array<{ producto_id: number; cantidad: number; precio_unitario: number }>
  >([])

  // Mostrar datos que llegan del backend
  React.useEffect(() => {
    console.log('📦 [DevolucionesCreate] Datos del backend:', {
      venta,
      productosCount: productos.length,
      productos: productos.slice(0, 5), // Mostrar primeros 5 productos
    })
  }, [venta, productos])

  // Calcular totales
  const subtotalDevuelto = useMemo(() => {
    return venta.detalles.reduce((sum, det) => {
      const cantidadDevuelta = detallesSeleccionados.get(det.id) || 0
      if (cantidadDevuelta > 0) {
        return sum + Number(cantidadDevuelta) * Number(det.precio_unitario)
      }
      return sum
    }, 0)
  }, [detallesSeleccionados])

  const subtotalCambio = useMemo(() => {
    return cambiosSeleccionados.reduce((sum, cambio) => {
      const producto = productos.find((p) => p.id === cambio.producto_id)
      return sum + (producto ? Number(cambio.cantidad) * Number(producto.precio_venta) : 0)
    }, 0)
  }, [cambiosSeleccionados])

  const diferencia = tipo === 'CAMBIO' ? subtotalCambio - subtotalDevuelto : 0

  const handleCantidadChange = (detalleId: number, cantidad: number, cantidadMaxima: number) => {
    setDetallesSeleccionados((prev) => {
      const newMap = new Map(prev)
      // Redondear a valor entero
      const cantidadEntera = Math.floor(cantidad)
      if (cantidadEntera <= 0) {
        newMap.delete(detalleId)
      } else if (cantidadEntera <= cantidadMaxima) {
        newMap.set(detalleId, cantidadEntera)
      }
      return newMap
    })
  }

  const handleAgregarCambio = (producto: Producto) => {
    setChangiosSeleccionados((prev) => [
      ...prev,
      {
        producto_id: producto.id,
        cantidad: 1,
        precio_unitario: producto.precio_venta,
      },
    ])
  }

  const handleRemoverCambio = (index: number) => {
    setChangiosSeleccionados((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (detallesSeleccionados.size === 0) {
      toast.error('Debe seleccionar al menos un producto para devolver')
      return
    }

    if (!motivo.trim()) {
      toast.error('Debe ingresar un motivo para la devolución')
      return
    }

    setIsProcessing(true)

    try {
      // Preparar detalles de devolución con cantidades específicas
      const detallesParaEnviar = venta.detalles
        .filter((det) => (detallesSeleccionados.get(det.id) || 0) > 0)
        .map((det) => ({
          detalle_venta_id: det.id,
          producto_id: det.producto_id,
          cantidad_devuelta: detallesSeleccionados.get(det.id) || 0,
          precio_unitario: det.precio_unitario,
        }))

      const response = await fetch(`/ventas/${venta.id}/devoluciones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          tipo,
          venta_id: venta.id,
          cliente_id: venta.cliente_id,
          motivo,
          tipo_reembolso: tipoReembolso,
          tipo_pago_id: tipoPagoId,
          detalles: detallesParaEnviar,
          detalles_cambio: tipo === 'CAMBIO' ? cambiosSeleccionados : [],
          observaciones,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        // Mostrar errores de validación o mensaje específico
        if (responseData.errors) {
          const errorMessages = Object.entries(responseData.errors)
            .map(([field, messages]) => {
              const msgText = Array.isArray(messages) ? messages.join(', ') : String(messages)
              return `${field}: ${msgText}`
            })
            .join('\n')
          toast.error(errorMessages || 'Error al crear devolución')
        } else {
          toast.error(responseData.message || 'Error al crear devolución')
        }
        return
      }

      toast.success(responseData.message || 'Devolución creada exitosamente')
      setTimeout(() => {
        window.location.href = `/devoluciones/${responseData.devolucion.id}`
      }, 1000)
    } catch (error) {
      console.error('Error al crear devolución:', error)
      toast.error('Error al crear devolución')
    } finally {
      setIsProcessing(false)
    }
  }

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Devoluciones', href: '/devoluciones' },
    { label: 'Nueva', href: '/devoluciones/create' },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva Devolución" />

      <div className="py-12">
        <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nueva Devolución</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Venta: <span className="font-medium">{venta.numero}</span> - Cliente:{' '}
              <span className="font-medium">{venta.cliente_nombre}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección 1: Tipo de devolución */}
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tipo de Operación</h2>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center cursor-pointer border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition bg-white dark:bg-gray-800">
                  <input
                    type="radio"
                    name="tipo"
                    value="DEVOLUCION"
                    checked={tipo === 'DEVOLUCION'}
                    onChange={(e) => setTipo(e.target.value)}
                    className="h-4 w-4"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-white">Devolución</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Cliente devuelve productos</p>
                  </div>
                </label>

                <label className="flex items-center cursor-pointer border-2 border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-blue-500 dark:hover:border-blue-400 transition bg-white dark:bg-gray-800">
                  <input
                    type="radio"
                    name="tipo"
                    value="CAMBIO"
                    checked={tipo === 'CAMBIO'}
                    onChange={(e) => setTipo(e.target.value)}
                    className="h-4 w-4"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-gray-900 dark:text-white">Cambio</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Devuelve e intercambia por otros</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Sección 2: Productos a devolver */}
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productos a Devolver</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Producto
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Disponible
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Precio
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        A Devolver
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {venta.detalles.map((detalle) => {
                      const cantidadDevuelta = detallesSeleccionados.get(detalle.id) || 0
                      const subtotalDevueltoItem = cantidadDevuelta * Number(detalle.precio_unitario)
                      return (
                        <tr key={detalle.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {detalle.producto_nombre}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                            {Number(detalle.cantidad).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                            Bs. {Number(detalle.precio_unitario).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <input
                              type="number"
                              min="0"
                              max={detalle.cantidad}
                              step="1"
                              value={cantidadDevuelta > 0 ? Math.floor(cantidadDevuelta) : ''}
                              onChange={(e) => handleCantidadChange(detalle.id, parseFloat(e.target.value) || 0, detalle.cantidad)}
                              placeholder="0"
                              className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                            {cantidadDevuelta > 0 ? `Bs. ${subtotalDevueltoItem.toFixed(2)}` : '-'}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <td colSpan={4} className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">
                        Total a devolver:
                      </td>
                      <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white text-right">
                        Bs. {Number(subtotalDevuelto).toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Sección 3: Productos de cambio (solo si tipo = CAMBIO) */}
            {tipo === 'CAMBIO' && (
              <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productos Nuevos (Cambio)</h2>

                {/* Tabla de cambios agregados */}
                {cambiosSeleccionados.length > 0 && (
                  <div className="mb-6 overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Producto
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Cantidad
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Precio Unitario
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Subtotal
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                            Acción
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {cambiosSeleccionados.map((cambio, idx) => {
                          const prod = productos.find((p) => p.id === cambio.producto_id)
                          const subtotalCambioItem = cambio.cantidad * Number(cambio.precio_unitario)
                          return (
                            <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                {prod?.nombre}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                                {Number(cambio.cantidad).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                                Bs. {Number(cambio.precio_unitario).toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                                Bs. {subtotalCambioItem.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoverCambio(idx)}
                                  className="text-red-600 hover:text-red-800 dark:hover:text-red-400 font-medium text-sm"
                                >
                                  Remover
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                      <tfoot className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">
                            Subtotal nuevos productos:
                          </td>
                          <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white text-right">
                            Bs. {Number(subtotalCambio).toFixed(2)}
                          </td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                )}

                {/* Selector de productos */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Agregar producto</label>
                  <select
                    onChange={(e) => {
                      const prod = productos.find((p) => p.id === parseInt(e.target.value))
                      if (prod) {
                        handleAgregarCambio(prod)
                        e.target.value = ''
                      }
                    }}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Elige un producto...</option>
                    {productos.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.nombre} - Bs. {Number(prod.precio_venta).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Sección 4: Motivo y reembolso */}
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detalles de Devolución</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Motivo de devolución</label>
                  <input
                    type="text"
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                    placeholder="Ej: Producto defectuoso, cambio de opinión..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tipo de Reembolso</label>
                  <div className="space-y-2">
                    {['EFECTIVO', 'CREDITO'].map((tipoReem) => (
                      <label key={tipoReem} className="flex items-center">
                        <input
                          type="radio"
                          name="tipo_reembolso"
                          value={tipoReem}
                          checked={tipoReembolso === tipoReem}
                          onChange={(e) => setTipoReembolso(e.target.value)}
                          className="h-4 w-4"
                        />
                        <span className="ml-2 text-gray-900 dark:text-gray-300">
                          {tipoReem === 'EFECTIVO' ? 'Efectivo (Dinero al cliente)' : 'Crédito (Nota de crédito)'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Selector de tipo de pago (solo si EFECTIVO) */}
                {tipoReembolso === 'EFECTIVO' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo de Pago</label>
                    <select
                      value={tipoPagoId || ''}
                      onChange={(e) => setTipoPagoId(parseInt(e.target.value) || null)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">-- Selecciona tipo de pago --</option>
                      {tiposPago.map((tp) => (
                        <option key={tp.id} value={tp.id}>
                          {tp.nombre} ({tp.codigo})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</label>
                  <textarea
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Notas adicionales..."
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección 5: Resumen */}
            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 sm:rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Resumen</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal a devolver:</span>
                  <span className="font-medium text-gray-900 dark:text-white">Bs. {Number(subtotalDevuelto).toFixed(2)}</span>
                </div>

                {tipo === 'CAMBIO' && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal de nuevos productos:</span>
                      <span className="font-medium text-gray-900 dark:text-white">Bs. {Number(subtotalCambio).toFixed(2)}</span>
                    </div>

                    <div className="border-t pt-2 flex justify-between text-base font-semibold">
                      <span>Diferencia:</span>
                      <span className={diferencia > 0 ? 'text-green-600' : 'text-red-600'}>
                        {diferencia > 0 ? '+' : ''} Bs. {Number(diferencia).toFixed(2)}
                        {diferencia > 0 && ' (Cliente paga)'}
                        {diferencia < 0 && ' (Se devuelve)'}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isProcessing || detallesSeleccionados.size === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md transition"
              >
                {isProcessing ? 'Procesando...' : 'Procesar Devolución'}
              </button>

              <a
                href={`/ventas/${venta.id}`}
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
