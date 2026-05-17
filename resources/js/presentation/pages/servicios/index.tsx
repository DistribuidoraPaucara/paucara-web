import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import React, { useState } from 'react'

interface Servicio {
  id: number
  numero: string
  fecha: string
  descripcion: string
  monto: number
  cliente?: {
    id: number
    nombre?: string
    razon_social?: string
  }
  usuario?: {
    id: number
    name: string
  }
  tipoPago?: {
    id: number
    nombre: string
    codigo: string
  }
}

interface Props {
  servicios: {
    data: Servicio[]
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  filters: Record<string, any>
}

export default function ServiciosIndex({ servicios, filters }: Props) {
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/servicios' },
  ]

  const totalRecaudado = servicios.data.reduce((sum, s) => sum + Number(s.monto), 0)

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Servicios" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Servicios</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Inyecciones, consultas y otros servicios registrados
              </p>
            </div>

            <Link
              href="/servicios/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition font-medium"
            >
              + Nuevo Servicio
            </Link>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Total Servicios</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{servicios.total}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Total Recaudado</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">Bs. {Number(totalRecaudado).toFixed(2)}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Promedio por Servicio</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                Bs. {servicios.total > 0 ? (Number(totalRecaudado) / servicios.total).toFixed(2) : '0.00'}
              </p>
            </div>
          </div>

          {/* Tabla de servicios */}
          <div className="bg-white dark:bg-gray-900 shadow overflow-hidden sm:rounded-lg">
            {servicios.data.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <p>No hay servicios registrados</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Número
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Tipo Pago
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {servicios.data.map((servicio) => (
                      <tr key={servicio.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {servicio.numero}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {new Date(servicio.fecha).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                          {servicio.descripcion}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          {servicio.cliente?.nombre || servicio.cliente?.razon_social || 'Sin cliente'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                            {servicio.tipoPago?.nombre}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white text-right">
                          Bs. {Number(servicio.monto).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link href={`/servicios/${servicio.id}`} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
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
          {servicios.last_page > 1 && (
            <div className="mt-6 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                {Array.from({ length: servicios.last_page }, (_, i) => i + 1).map((page) => (
                  <a
                    key={page}
                    href={`/servicios?page=${page}`}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === servicios.current_page
                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900 dark:border-blue-400 dark:text-blue-200'
                        : 'bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
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
