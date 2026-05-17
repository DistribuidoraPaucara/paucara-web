import AppLayout from '@/layouts/app-layout'
import { Head, Link } from '@inertiajs/react'
import React from 'react'

interface Servicio {
  id: number
  numero: string
  fecha: string
  descripcion: string
  monto: number
  observaciones?: string
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
  caja?: {
    id: number
    nombre: string
  }
}

interface Props {
  servicio: Servicio
}

export default function ServiciosShow({ servicio }: Props) {
  const breadcrumbs = [
    { label: 'Inicio', href: '/' },
    { label: 'Servicios', href: '/servicios' },
    { label: servicio.numero, href: `/servicios/${servicio.id}` },
  ]

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Servicio ${servicio.numero}`} />

      <div className="py-12">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{servicio.numero}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Registrado el {new Date(servicio.fecha).toLocaleDateString()}
              </p>
            </div>

            <Link
              href="/servicios"
              className="bg-gray-300 hover:bg-gray-400 text-gray-900 px-4 py-2 rounded-md transition"
            >
              Volver
            </Link>
          </div>

          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Descripción</h3>
              <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">{servicio.descripcion}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">Monto Cobrado</h3>
              <p className="text-3xl font-bold text-green-600 mt-2">Bs. {Number(servicio.monto).toFixed(2)}</p>
            </div>
          </div>

          {/* Detalles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-4">Cliente</h3>
              <p className="text-gray-900 dark:text-white">
                {servicio.cliente?.nombre || servicio.cliente?.razon_social || 'Sin cliente'}
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-4">Tipo de Pago</h3>
              <div>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                  {servicio.tipoPago?.nombre} ({servicio.tipoPago?.codigo})
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-4">Registrado por</h3>
              <p className="text-gray-900 dark:text-white">{servicio.usuario?.name}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-4">Caja</h3>
              <p className="text-gray-900 dark:text-white">{servicio.caja?.nombre}</p>
            </div>
          </div>

          {/* Observaciones */}
          {servicio.observaciones && (
            <div className="bg-white dark:bg-gray-900 shadow sm:rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Observaciones</h2>
              <p className="text-gray-600 dark:text-gray-400">{servicio.observaciones}</p>
            </div>
          )}

          {/* Auditoría */}
          <div className="bg-gray-50 dark:bg-gray-800 sm:rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Información de Auditoría</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Número:</span>
                <span className="text-gray-900 dark:text-white">{servicio.numero}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Fecha:</span>
                <span className="text-gray-900 dark:text-white">{new Date(servicio.fecha).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Usuario:</span>
                <span className="text-gray-900 dark:text-white">{servicio.usuario?.name}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
