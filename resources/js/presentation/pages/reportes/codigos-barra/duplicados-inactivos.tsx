import React, { useState } from 'react'
import { Head, Link, usePage, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import AppLayout from '@/layouts/app-layout'
import GenericPagination from '@/presentation/components/generic/generic-pagination'
import { Edit, ChevronRight } from 'lucide-react'

interface CodigoBarra {
  id: number
  codigo: string
  tipo: string
  es_principal: boolean
  activo: boolean
  producto_id: number
  producto?: {
    id: number
    nombre: string
    sku: string
  }
}

interface Props extends PageProps {
  codigos: {
    data: CodigoBarra[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    links: Array<{ url: string | null; label: string; active: boolean }>
  }
  stats: {
    total_codigos: number
    total_activos: number
    total_inactivos: number
    total_duplicados: number
    porcentaje_duplicados: number
  }
  titulo: string
  tipo: 'duplicados' | 'inactivos' | 'todos'
  tiposDisponibles: Record<string, string>
}

export default function DuplicadosInactivosReporte() {
  const { codigos, stats, titulo, tipo, tiposDisponibles } = usePage<Props>().props
  const [searchQuery, setSearchQuery] = useState('')

  const handleTipoChange = (nuevoTipo: string) => {
    const params = new URLSearchParams()
    params.append('tipo', nuevoTipo)
    if (searchQuery) params.append('q', searchQuery)
    router.get(`/reportes/codigos-barra/duplicados-inactivos?${params.toString()}`)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    params.append('tipo', tipo)
    if (searchQuery) params.append('q', searchQuery)
    router.get(`/reportes/codigos-barra/duplicados-inactivos?${params.toString()}`)
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    const params = new URLSearchParams()
    params.append('tipo', tipo)
    router.get(`/reportes/codigos-barra/duplicados-inactivos?${params.toString()}`)
  }

  const getStatusBadgeClass = (codigo: CodigoBarra): string => {
    if (!codigo.activo) return 'bg-red-100 text-red-800'
    if (codigo.es_principal) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (codigo: CodigoBarra): string => {
    if (!codigo.activo) return '❌ Inactivo'
    if (codigo.es_principal) return '⭐ Principal'
    return '✓ Activo'
  }

  const tabs = [
    { key: 'duplicados', label: 'Códigos Duplicados' },
    { key: 'inactivos', label: 'Códigos Inactivos' },
    { key: 'todos', label: 'Todos los Códigos' }
  ]

  return (
    <>
      <Head title={`Reporte - ${titulo}`} />

      <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/' },
        { title: 'Reportes', href: '/reportes' },
        { title: 'Códigos de Barra', href: '/reportes/codigos-barra' },
        { title: titulo, href: '#' }
      ]}>
        <div className="space-y-6 py-6">
          {/* Encabezado */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{titulo}</h1>
            <p className="mt-2 text-sm text-gray-600">
              {tipo === 'duplicados' && 'Códigos de barra que aparecen múltiples veces en productos activos'}
              {tipo === 'inactivos' && 'Códigos de barra que han sido marcados como inactivos'}
              {tipo === 'todos' && 'Análisis completo de todos los códigos de barra del sistema'}
            </p>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600">Total Códigos</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_codigos}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="mt-2 text-3xl font-bold text-green-600">{stats.total_activos}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600">Inactivos</p>
              <p className="mt-2 text-3xl font-bold text-red-600">{stats.total_inactivos}</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600">Duplicados</p>
              <p className="mt-2 text-3xl font-bold text-amber-600">{stats.total_duplicados}</p>
              <p className="mt-1 text-xs text-gray-500">{stats.porcentaje_duplicados}% activos</p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600">En Reporte</p>
              <p className="mt-2 text-3xl font-bold text-blue-600">{codigos.total}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => handleTipoChange(tab.key)}
                  className={`px-1 py-4 text-sm font-medium border-b-2 transition ${
                    tipo === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Búsqueda */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Búsqueda</h3>

            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Ingrese búsqueda (código, producto o SKU)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSearch}
                className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Buscar
              </button>
              <button
                onClick={handleClearSearch}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              {tipo === 'duplicados' && 'Códigos Duplicados'}
              {tipo === 'inactivos' && 'Códigos Inactivos'}
              {tipo === 'todos' && 'Todos los Códigos'}
              {' '}({codigos.total})
            </h3>

            {codigos.data.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Código</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Tipo</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Producto</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">SKU</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Estado</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {codigos.data.map((codigo, idx) => (
                        <tr
                          key={codigo.id}
                          className={`border-b border-gray-100 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}
                        >
                          <td className="px-4 py-3">
                            <code className="rounded bg-gray-100 px-2 py-1 font-mono text-sm font-semibold">
                              {codigo.codigo}
                            </code>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
                              {codigo.tipo}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Link href={`/productos/${codigo.producto_id}/edit`} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                              {codigo.producto?.nombre || '-'}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {codigo.producto?.sku || '-'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${getStatusBadgeClass(codigo)}`}>
                              {getStatusLabel(codigo)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Link
                              href={`/codigos-barra/${codigo.id}/edit`}
                              className="inline-flex items-center gap-1 rounded bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
                            >
                              <Edit size={14} />
                              Editar
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {codigos.last_page > 1 && (
                  <div className="mt-4">
                    <GenericPagination
                      links={codigos.links}
                      isLoading={false}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                {tipo === 'duplicados' && (
                  <p className="text-gray-500">✓ Excelente, no hay códigos duplicados</p>
                )}
                {tipo === 'inactivos' && (
                  <p className="text-gray-500">✓ No hay códigos inactivos</p>
                )}
                {tipo === 'todos' && (
                  <p className="text-gray-500">No hay códigos registrados</p>
                )}
              </div>
            )}
          </div>

          {/* Volver */}
          <div>
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
