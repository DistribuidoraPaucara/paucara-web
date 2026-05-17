import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import React from 'react'

interface DetalleDevolucion {
  id: number
  producto_id: number
  cantidad_devuelta: number
  precio_unitario: number
  subtotal: number
  producto: {
    id: number
    nombre: string
  }
}

interface DetalleCambio {
  id: number
  producto_id: number
  cantidad: number
  precio_unitario: number
  subtotal: number
  producto: {
    id: number
    nombre: string
  }
}

interface Devolucion {
  id: number
  numero: string
  fecha: string
  tipo: string
  venta_id: number
  cliente_id: number
  motivo: string
  subtotal_devuelto: number
  total_devuelto: number
  tipo_reembolso: string
  monto_reembolso: number
  subtotal_cambio?: number
  diferencia?: number
  observaciones?: string
  detalles: DetalleDevolucion[]
  detallesCambio: DetalleCambio[]
  venta?: {
    id: number
    numero: string
    fecha: string
    total: number
  }
  cliente?: {
    id: number
    nombre?: string
    razon_social?: string
  }
  usuario?: {
    id: number
    name: string
  }
}

interface Props {
  devolucion: Devolucion
}

export default function DevolucionesShow({ devolucion }: Props) {
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Devoluciones', href: '/devoluciones' },
    { label: devolucion.numero, href: `/devoluciones/${devolucion.id}` },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Devolución ${devolucion.numero}`} />

      <div className="py-12">
        <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{devolucion.numero}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {devolucion.tipo === 'DEVOLUCION' ? 'Devolución' : 'Cambio'} registrada el{' '}
                {new Date(devolucion.fecha).toLocaleDateString()}
              </p>
            </div>

            <Link
              href={`/ventas/${devolucion.venta_id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              Ver venta original
            </Link>
          </div>

          {/* Información general */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Cliente</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {devolucion.cliente?.nombre || devolucion.cliente?.razon_social || 'N/A'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Tipo</h3>
              <p
                className={`text-2xl font-bold mt-2 ${
                  devolucion.tipo === 'DEVOLUCION' ? 'text-red-600' : 'text-blue-600'
                }`}
              >
                {devolucion.tipo === 'DEVOLUCION' ? 'Devolución' : 'Cambio'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Reembolso</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                Bs. {Number(devolucion.monto_reembolso || 0).toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">({devolucion.tipo_reembolso})</p>
            </div>
          </div>

          {/* Productos devueltos */}
          <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productos Devueltos</h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cantidad</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Precio</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {devolucion.detalles.map((detalle) => (
                    <tr key={detalle.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {detalle.producto?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                        {detalle.cantidad_devuelta}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                        Bs. {Number(detalle.precio_unitario)?.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                        Bs. {Number(detalle.subtotal || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">
                      Total devuelto:
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white text-right">
                      Bs. {Number(devolucion.total_devuelto || 0).toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Productos de cambio */}
          {devolucion.tipo === 'CAMBIO' && devolucion.detallesCambio.length > 0 && (
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productos Nuevos (Cambio)</h2>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Producto</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Cantidad</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Precio</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {devolucion.detallesCambio.map((cambio) => (
                      <tr key={cambio.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {cambio.producto?.nombre}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                          {cambio.cantidad}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600 dark:text-gray-400">
                          Bs. {Number(cambio.precio_unitario)?.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900 dark:text-white">
                          Bs. {Number(cambio.subtotal || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">
                        Subtotal nuevos productos:
                      </td>
                      <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white text-right">
                        Bs. {Number(devolucion.subtotal_cambio || 0).toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-6 py-3 text-sm font-semibold text-gray-900 dark:text-white text-right">
                        Diferencia:
                      </td>
                      <td
                        className={`px-6 py-3 text-sm font-bold text-right ${
                          devolucion.diferencia! > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        Bs. {Math.abs(devolucion.diferencia!).toFixed(2)}
                        {devolucion.diferencia! > 0 && ' (Cliente paga)'}
                        {devolucion.diferencia! < 0 && ' (Se devuelve)'}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Motivo y observaciones */}
          <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Detalles Adicionales</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Motivo</label>
                <p className="mt-1 text-gray-900 dark:text-white">{devolucion.motivo}</p>
              </div>

              {devolucion.observaciones && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Observaciones</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{devolucion.observaciones}</p>
                </div>
              )}
            </div>
          </div>

          {/* Auditoría */}
          <div className="bg-gray-50 dark:bg-gray-800 sm:rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información de Auditoría</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Usuario:</span>
                <span className="text-gray-900 dark:text-white">{devolucion.usuario?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Venta original:</span>
                <Link href={`/ventas/${devolucion.venta_id}`} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  {devolucion.venta?.numero}
                </Link>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Fecha de venta:</span>
                <span className="text-gray-900 dark:text-white">{new Date(devolucion.venta?.fecha || '').toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
