import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Visit {
  id: number;
  fecha_hora_visita: string;
  preventista: {
    nombre: string;
  };
  cliente: {
    nombre: string;
  };
  tipo_visita: string;
  estado_visita: string;
  motivo_no_atencion: string | null;
  dentro_ventana_horaria: boolean;
  latitud: number;
  longitud: number;
  observaciones: string | null;
}

interface Props {
  visitas: {
    data: Visit[];
    links: any;
  };
  metricas: {
    total_visitas: number;
    visitas_exitosas: number;
    visitas_no_atendidas: number;
    visitas_fuera_horario: number;
    porcentaje_exitosas: number;
    porcentaje_no_atendidas: number;
    porcentaje_fuera_horario: number;
  };
  preventistas: Array<{
    id: number;
    user: {
      name: string;
    };
  }>;
  filters: {
    preventista_id?: number;
    fecha_inicio?: string;
    fecha_fin?: string;
    estado_visita?: string;
    tipo_visita?: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Admin',
    href: '/admin/dashboard',
  },
  {
    title: 'Reportes',
    href: '/reportes',
  },
  {
    title: 'Visitas de Preventistas',
    href: '/reportes/visitas',
  },
];

export default function VisitasReport({
  visitas,
  metricas,
  preventistas,
  filters,
}: Props) {
  const [filtersPrev, setFilters] = useState(filters);

  const handleFilterChange = (key: string, value: any) => {
    setFilters({ ...filtersPrev, [key]: value });
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filtersPrev).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    window.location.href = `/reportes/visitas?${params.toString()}`;
  };

  const exportExcel = () => {
    const params = new URLSearchParams();
    Object.entries(filtersPrev).forEach(([key, value]) => {
      if (value) params.append(key, String(value));
    });

    window.location.href = `/reportes/visitas/exportar-excel?${params.toString()}`;
  };

  const getEstadoBadgeColor = (estado: string) => {
    if (estado === 'EXITOSA') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
  };

  const getTipoVisitaColor = (tipo: string) => {
    switch (tipo) {
      case 'COBRO':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'TOMA_PEDIDO':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'ENTREGA':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'SUPERVISION':
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200';
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    }
  };

  const getTipoLabel = (tipo: string) => {
    const labels: { [key: string]: string } = {
      COBRO: 'Cobro',
      TOMA_PEDIDO: 'Toma de Pedido',
      ENTREGA: 'Entrega',
      SUPERVISION: 'Supervisión',
      OTRO: 'Otro',
    };
    return labels[tipo] || tipo;
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reportes de Visitas de Preventistas" />

      <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            Reportes de Visitas de Preventistas
          </h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-400">
            Control de visitas realizadas por preventistas a clientes
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-lg bg-white p-6 shadow dark:bg-neutral-900">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Total de Visitas</div>
            <div className="mt-2 text-3xl font-bold text-neutral-900 dark:text-neutral-100">
              {metricas.total_visitas}
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-neutral-900">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Visitadas Exitosamente</div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                {metricas.porcentaje_exitosas}%
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {metricas.visitas_exitosas} visitas
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-neutral-900">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">No Atendidas</div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                {metricas.porcentaje_no_atendidas}%
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {metricas.visitas_no_atendidas} visitas
              </div>
            </div>
          </div>

          <div className="rounded-lg bg-white p-6 shadow dark:bg-neutral-900">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">Fuera de Horario</div>
            <div className="mt-2">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {metricas.porcentaje_fuera_horario}%
              </div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                {metricas.visitas_fuera_horario} visitas
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="rounded-lg bg-white p-6 shadow dark:bg-neutral-900">
          <h2 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Filtros</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {/* Preventista */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Preventista
              </label>
              <select
                value={filtersPrev.preventista_id || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'preventista_id',
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value="">Todos</option>
                {preventistas.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.user.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha Inicio */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={filtersPrev.fecha_inicio || ''}
                onChange={(e) =>
                  handleFilterChange('fecha_inicio', e.target.value || undefined)
                }
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>

            {/* Fecha Fin */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Fecha Fin
              </label>
              <input
                type="date"
                value={filtersPrev.fecha_fin || ''}
                onChange={(e) =>
                  handleFilterChange('fecha_fin', e.target.value || undefined)
                }
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
              />
            </div>

            {/* Estado */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Estado
              </label>
              <select
                value={filtersPrev.estado_visita || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'estado_visita',
                    e.target.value || undefined
                  )
                }
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value="">Todos</option>
                <option value="EXITOSA">Exitosa</option>
                <option value="NO_ATENDIDO">No Atendido</option>
              </select>
            </div>

            {/* Tipo */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Tipo
              </label>
              <select
                value={filtersPrev.tipo_visita || ''}
                onChange={(e) =>
                  handleFilterChange('tipo_visita', e.target.value || undefined)
                }
                className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
              >
                <option value="">Todos</option>
                <option value="COBRO">Cobro</option>
                <option value="TOMA_PEDIDO">Toma de Pedido</option>
                <option value="ENTREGA">Entrega</option>
                <option value="SUPERVISION">Supervisión</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={applyFilters}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-500"
            >
              Aplicar Filtros
            </button>
            <button
              onClick={exportExcel}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 dark:hover:bg-green-500"
            >
              Exportar Excel
            </button>
          </div>
        </div>

        {/* Tabla de Visitas */}
        <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-neutral-900">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Fecha/Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Preventista
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                    Horario
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {visitas.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-neutral-500 dark:text-neutral-400">
                      No hay visitas registradas
                    </td>
                  </tr>
                ) : (
                  visitas.data.map((visita) => (
                    <tr key={visita.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800">
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100">
                        {format(
                          new Date(visita.fecha_hora_visita),
                          'dd/MM/yyyy HH:mm',
                          { locale: es }
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100">
                        {visita.preventista.nombre}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100">
                        {visita.cliente.nombre}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getTipoVisitaColor(
                            visita.tipo_visita
                          )}`}
                        >
                          {getTipoLabel(visita.tipo_visita)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getEstadoBadgeColor(
                            visita.estado_visita
                          )}`}
                        >
                          {visita.estado_visita === 'EXITOSA'
                            ? 'Exitosa'
                            : 'No Atendido'}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm">
                        {visita.dentro_ventana_horaria ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                            On Time
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                            Fuera de Horario
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-4 py-3 dark:border-neutral-700 dark:bg-neutral-900 sm:px-6">
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Mostrando <span className="font-medium">{visitas.data.length}</span> visitas
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
