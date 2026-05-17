import React, { useState } from 'react'
import { Head, Link, usePage, router } from '@inertiajs/react'
import { PageProps } from '@/types'
import AppLayout from '@/layouts/app-layout'
import GenericPagination from '@/presentation/components/generic/generic-pagination'
import { Download, ChevronRight } from 'lucide-react'

interface Producto {
  id: number
  nombre: string
  sku: string
  categoria_id: number
  marca_id: number
  precio_base: number
  categoria?: { id: number; nombre: string }
  marca?: { id: number; nombre: string }
}

interface Props extends PageProps {
  productos: {
    data: Producto[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
    links: Array<{ url: string | null; label: string; active: boolean }>
  }
  stats: {
    total_productos: number
    sin_codigo: number
    con_codigo: number
  }
  filters: {
    categoria_id?: number
    marca_id?: number
    q?: string
  }
  categorias: Record<string, string>
  marcas: Record<string, string>
}

export default function ProductosSinCodigoReporte() {
  const { productos, stats, filters, categorias, marcas } = usePage<Props>().props
  const [filterData, setFilterData] = useState(filters)

  const handleFilterChange = (key: string, value: any) => {
    setFilterData(prev => ({
      ...prev,
      [key]: value || undefined
    }))
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (filterData.categoria_id) params.append('categoria_id', String(filterData.categoria_id))
    if (filterData.marca_id) params.append('marca_id', String(filterData.marca_id))
    if (filterData.q) params.append('q', filterData.q)

    router.get(`/reportes/codigos-barra/productos-sin-codigo?${params.toString()}`)
  }

  const handleClearFilters = () => {
    setFilterData({})
    router.get('/reportes/codigos-barra/productos-sin-codigo')
  }

  const handleDownloadCSV = () => {
    const params = new URLSearchParams()
    if (filterData.categoria_id) params.append('categoria_id', String(filterData.categoria_id))
    if (filterData.marca_id) params.append('marca_id', String(filterData.marca_id))
    if (filterData.q) params.append('q', filterData.q)

    window.location.href = `/reportes/codigos-barra/descargar/productos-sin-codigo?${params.toString()}`
  }

  const porcentajeSinCodigo = stats.total_productos > 0
    ? Math.round((stats.sin_codigo / stats.total_productos) * 100)
    : 0

  const porcentajeConCodigo = stats.total_productos > 0
    ? Math.round((stats.con_codigo / stats.total_productos) * 100)
    : 0

  return (
    <>
      <Head title="Reporte - Productos sin Código de Barra" />

      <AppLayout breadcrumbs={[
        { title: 'Dashboard', href: '/' },
        { title: 'Reportes', href: '/reportes' },
        { title: 'Códigos de Barra', href: '/reportes/codigos-barra' },
        { title: 'Productos sin Código', href: '#' }
      ]}>
        <div className="space-y-6 py-6">
          {/* Encabezado */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Productos sin Código de Barra</h1>
              <p className="mt-2 text-sm text-gray-600">
                Listado de productos activos que no tienen códigos de barra asignados
              </p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-600">Total Productos</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total_productos}</p>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-600">Con Código</p>
                <p className="mt-2 text-3xl font-bold text-green-600">{stats.con_codigo}</p>
                <p className="mt-1 text-xs text-gray-500">{porcentajeConCodigo}% del total</p>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-600">Sin Código</p>
                <p className="mt-2 text-3xl font-bold text-amber-600">{stats.sin_codigo}</p>
                <p className="mt-1 text-xs text-gray-500">{porcentajeSinCodigo}% del total</p>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-600">En Reporte</p>
                <p className="mt-2 text-3xl font-bold text-blue-600">{productos.total}</p>
                <p className="mt-1 text-xs text-gray-500">Página {productos.current_page}</p>
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                <select
                  value={String(filterData.categoria_id || '')}
                  onChange={(e) => handleFilterChange('categoria_id', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Todas las categorías</option>
                  {Object.entries(categorias).map(([id, nombre]) => (
                    <option key={id} value={id}>{nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Marca</label>
                <select
                  value={String(filterData.marca_id || '')}
                  onChange={(e) => handleFilterChange('marca_id', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Todas las marcas</option>
                  {Object.entries(marcas).map(([id, nombre]) => (
                    <option key={id} value={id}>{nombre}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Buscar por nombre o SKU</label>
                <input
                  type="text"
                  placeholder="Nombre o SKU..."
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

          {/* Tabla de Productos */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos ({productos.total})</h3>

            {productos.data.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">SKU</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Categoría</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-700">Marca</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-700">Precio Base</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-700">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {productos.data.map((p, idx) => (
                        <tr key={p.id} className={`border-b border-gray-100 transition ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                          <td className="px-4 py-3 text-sm text-gray-600">{p.id}</td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.nombre}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{p.sku}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{p.categoria?.nombre || '-'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{p.marca?.nombre || '-'}</td>
                          <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                            ${parseFloat(String(p.precio_base)).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <Link
                              href={`/productos/${p.id}/edit`}
                              className="inline-flex items-center gap-1 rounded bg-blue-50 px-3 py-1 text-sm font-medium text-blue-600 hover:bg-blue-100 transition"
                            >
                              Editar
                              <ChevronRight size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {productos.last_page > 1 && (
                  <div className="mt-4">
                    <GenericPagination
                      links={productos.links}
                      isLoading={false}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                <p className="text-gray-500">✓ Excelente, todos los productos tienen código de barra</p>
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
