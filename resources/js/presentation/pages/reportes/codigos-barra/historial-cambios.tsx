import React, { useState } from 'react'
import { Head, Link, usePage, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import AppLayout from '@/layouts/app-layout'
import GenericPagination from '@/presentation/components/generic/generic-pagination'
import { Download, ArrowRight } from 'lucide-react'

interface HistorialEntry {
  id: number
  codigo_nuevo?: string
  codigo_anterior?: string
  tipo_evento: string
  fecha_evento: string
  usuario_nombre?: string
  usuario_id?: number
  producto_id?: number
  razon?: string
  valores_anteriores?: Record<string, any>
  valores_nuevos?: Record<string, any>
  producto?: {
    id: number
    nombre: string
    sku: string
  }
  usuario?: {
    id: number
    name: string
  }
}

interface Props extends PageProps {
  historial: {
    data: HistorialEntry[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    links: Array<{ url: string | null; label: string; active: boolean }>
  }
  stats: {
    total_eventos: number
    eventos_semana: number
    eventos_mes: number
    usuarios_activos: number
  }
  tiposEventos: Record<string, string>
  usuarios: Record<string, string>
  filters: {
    fecha_desde?: string
    fecha_hasta?: string
    usuario_id?: number
    tipo_evento?: string
    producto_id?: number
    q?: string
  }
}

export default function HistorialCambiosReporte() {
  const { historial, stats, tiposEventos, usuarios, filters } = usePage<Props>().props
  const [filterData, setFilterData] = useState(filters)

  const handleFilterChange = (key: string, value: any) => {
    setFilterData(prev => ({
      ...prev,
      [key]: value || undefined
    }))
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filterData.fecha_desde) params.append('fecha_desde', filterData.fecha_desde)
    if (filterData.fecha_hasta) params.append('fecha_hasta', filterData.fecha_hasta)
    if (filterData.usuario_id) params.append('usuario_id', String(filterData.usuario_id))
    if (filterData.tipo_evento) params.append('tipo_evento', filterData.tipo_evento)
    if (filterData.producto_id) params.append('producto_id', String(filterData.producto_id))
    if (filterData.q) params.append('q', filterData.q)

    router.get(`/reportes/codigos-barra/historial-cambios?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setFilterData({})
    router.get('/reportes/codigos-barra/historial-cambios')
  }

  const handleDownloadCSV = () => {
    window.location.href = '/reportes/codigos-barra/descargar/historial'
  }

  const getEventIcon = (tipoEvento: string): string => {
    const icons: Record<string, string> = {
      'CREADO': '✨',
      'ACTUALIZADO': '📝',
      'MARCADO_PRINCIPAL': '⭐',
      'DESMARCADO_PRINCIPAL': '✓',
      'INACTIVADO': '❌',
      'REACTIVADO': '✅'
    }
    return icons[tipoEvento] || '•'
  }

  const getEventColor = (tipoEvento: string): string => {
    const colors: Record<string, string> = {
      'CREADO': 'bg-green-50 border-l-4 border-green-500',
      'ACTUALIZADO': 'bg-blue-50 border-l-4 border-blue-500',
      'MARCADO_PRINCIPAL': 'bg-amber-50 border-l-4 border-amber-500',
      'DESMARCADO_PRINCIPAL': 'bg-gray-50 border-l-4 border-gray-500',
      'INACTIVADO': 'bg-red-50 border-l-4 border-red-500',
      'REACTIVADO': 'bg-green-50 border-l-4 border-green-500'
    }
    return colors[tipoEvento] || 'bg-gray-50 border-l-4 border-gray-500'
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <>
      <Head title="Reporte - Historial de Cambios" />

      <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/' },
        { title: 'Reportes', href: '/reportes' },
        { title: 'Códigos de Barra', href: '/reportes/codigos-barra' },
        { title: 'Historial de Cambios', href: '#' }
      ]}>
        <div className="space-y-6 py-6">
          {/* Encabezado */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Historial de Cambios en Códigos de Barra</h1>
            <p className="mt-2 text-sm text-gray-600">
              Registro de todas las operaciones realizadas sobre códigos de barra
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600">Total Eventos</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_eventos}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600">Esta Semana</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{stats.eventos_semana}</p>
              <p className="mt-1 text-xs text-gray-500">Últimos 7 días</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600">Este Mes</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{stats.eventos_mes}</p>
              <p className="mt-1 text-xs text-gray-500">Últimos 30 días</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600">Usuarios Activos</p>
              <p className="mt-2 text-3xl font-bold text-purple-600">{stats.usuarios_activos}</p>
            </div>
          </div>

          {/* Filtros */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Filtros</h3>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
                <input
                  type="date"
                  value={filterData.fecha_desde || ''}
                  onChange={(e) => handleFilterChange('fecha_desde', e.target.value || undefined)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
                <input
                  type="date"
                  value={filterData.fecha_hasta || ''}
                  onChange={(e) => handleFilterChange('fecha_hasta', e.target.value || undefined)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Evento</label>
                <select
                  value={filterData.tipo_evento || ''}
                  onChange={(e) => handleFilterChange('tipo_evento', e.target.value || undefined)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Todos los eventos</option>
                  {Object.entries(tiposEventos).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
                <select
                  value={String(filterData.usuario_id || '')}
                  onChange={(e) => handleFilterChange('usuario_id', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Todos los usuarios</option>
                  {Object.entries(usuarios).map(([id, nombre]) => (
                    <option key={id} value={id}>{nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
                <input
                  type="text"
                  placeholder="Código, producto o razón..."
                  value={filterData.q || ''}
                  onChange={(e) => handleFilterChange('q', e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Aplicar Filtros
              </button>
              <button
                onClick={handleClearFilters}
                className="inline-flex items-center gap-2 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Limpiar
              </button>
              <button
                onClick={handleDownloadCSV}
                className="inline-flex items-center gap-2 rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
              >
                <Download size={16} />
                Descargar CSV
              </button>
            </div>
          </div>

          {/* Historial */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Eventos ({historial.total})</h3>

            {historial.data.length > 0 ? (
              <>
                <div className="space-y-3">
                  {historial.data.map((evento) => (
                    <div
                      key={evento.id}
                      className={`rounded-lg p-4 ${getEventColor(evento.tipo_evento)}`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">
                              {getEventIcon(evento.tipo_evento)}
                            </span>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {tiposEventos[evento.tipo_evento] || evento.tipo_evento}
                              </p>
                              <p className="text-sm text-gray-600">
                                {formatDate(evento.fecha_evento)}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2">
                            {evento.codigo_anterior && evento.codigo_nuevo && (
                              <div className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-gray-700">Código:</span>
                                <code className="rounded bg-gray-200 px-2 py-0.5 font-mono">
                                  {evento.codigo_anterior}
                                </code>
                                <ArrowRight size={16} className="text-gray-500" />
                                <code className="rounded bg-gray-200 px-2 py-0.5 font-mono">
                                  {evento.codigo_nuevo}
                                </code>
                              </div>
                            )}

                            {evento.codigo_nuevo && !evento.codigo_anterior && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Código:</span>{' '}
                                <code className="rounded bg-gray-200 px-2 py-0.5 font-mono">
                                  {evento.codigo_nuevo}
                                </code>
                              </div>
                            )}

                            {evento.producto && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Producto:</span>{' '}
                                <Link href={`/productos/${evento.producto.id}/edit`} className="text-blue-600 hover:text-blue-800">
                                  {evento.producto.nombre}
                                </Link>
                                {' '}
                                <span className="text-gray-500">({evento.producto.sku})</span>
                              </div>
                            )}

                            {evento.usuario_nombre && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Usuario:</span>{' '}
                                <span className="text-gray-600">{evento.usuario_nombre}</span>
                              </div>
                            )}

                            {evento.razon && (
                              <div className="text-sm">
                                <span className="font-medium text-gray-700">Razón:</span>{' '}
                                <span className="text-gray-600">{evento.razon}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {historial.last_page > 1 && (
                  <div className="mt-4">
                    <GenericPagination
                      links={historial.links}
                      isLoading={false}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <p className="text-gray-500">No hay eventos que coincidan con los filtros</p>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex justify-between">
            <Link
              href="/reportes/codigos-barra"
              className="inline-flex items-center gap-2 rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              ← Volver
            </Link>
          </div>
        </div>
      </AppLayout>
    </>
  )
}
