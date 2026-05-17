import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import React, { useMemo, useState } from 'react'

interface Devolucion {
  id: number
  numero: string
  fecha: string
  tipo: string
  venta_id: number
  cliente_id: number
  total_devuelto: number
  tipo_reembolso: string
  cliente?: {
    id: number
    nombre?: string
    razon_social?: string
  }
  venta?: {
    id: number
    numero: string
  }
}

interface Props {
  devoluciones: {
    data: Devolucion[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  filters: Record<string, any>
}

export default function DevolucionesIndex({ devoluciones, filters }: Props) {
  const [searchTerm, setSearchTerm] = useState(filters.numero || '')
  const [tipoFilter, setTipoFilter] = useState(filters.tipo || '')

  const tiposDisponibles = ['DEVOLUCION', 'CAMBIO']

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Implementar búsqueda
  }

  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Devoluciones', href: '/devoluciones' },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Devoluciones" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Devoluciones y Cambios</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Gestiona devoluciones parciales, totales y cambios de productos</p>
          </div>

          {/* Filtros */}
          <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Búsqueda por número */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número de devolución</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="DEV2026..."
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Filtro por tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tipo</label>
                  <select
                    value={tipoFilter}
                    onChange={(e) => setTipoFilter(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos</option>
                    {tiposDisponibles.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo === 'DEVOLUCION' ? 'Devolución' : 'Cambio'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Botón buscar */}
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
                  >
                    Buscar
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Tabla de devoluciones */}
          <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-lg">
            {devoluciones.data.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <p>No hay devoluciones registradas</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Número
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tipo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Venta
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reembolso
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {devoluciones.data.map((devolucion) => (
                      <tr key={devolucion.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {devolucion.numero}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {new Date(devolucion.fecha).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              devolucion.tipo === 'DEVOLUCION'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {devolucion.tipo === 'DEVOLUCION' ? 'Devolución' : 'Cambio'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {devolucion.cliente?.nombre || devolucion.cliente?.razon_social || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400">
                          <Link href={`/ventas/${devolucion.venta_id}`}>
                            {devolucion.venta?.numero}
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          Bs. {Number(devolucion.total_devuelto || 0).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              devolucion.tipo_reembolso === 'EFECTIVO'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {devolucion.tipo_reembolso}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/devoluciones/${devolucion.id}`} className="text-blue-600 hover:text-blue-900">
                            Ver detalles
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Paginación */}
          {devoluciones.last_page > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: devoluciones.last_page }, (_, i) => i + 1).map((page) => (
                  <a
                    key={page}
                    href={`/devoluciones?page=${page}`}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === devoluciones.current_page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
