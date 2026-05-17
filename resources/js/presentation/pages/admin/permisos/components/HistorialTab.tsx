import { useEffect, useState } from 'react';
import type { PermisoAudit } from '@/domain/entities/admin-permisos';

interface EstadisticasHistorial {
  total_cambios: number;
  cambios_hoy: number;
  cambios_esta_semana: number;
  cambios_este_mes: number;
}

interface HistorialTabProps {
  historial: PermisoAudit[];
  estadisticas: EstadisticasHistorial | null;
  cargando: boolean;
  onLoadData: (filtro: string | null) => Promise<void>;
}

export function HistorialTab({
  historial,
  estadisticas,
  cargando,
  onLoadData,
}: HistorialTabProps) {
  const [filtro, setFiltro] = useState<string | null>(null);

  useEffect(() => {
    onLoadData(filtro);
  }, [filtro]);

  return (
    <>
      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Total de cambios</p>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {estadisticas.total_cambios}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Cambios hoy</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {estadisticas.cambios_hoy}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Esta semana</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {estadisticas.cambios_esta_semana}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-slate-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Este mes</p>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {estadisticas.cambios_este_mes}
            </p>
          </div>
        </div>
      )}

      {/* Tabla de historial */}
      {cargando ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin text-purple-600 dark:text-purple-400">
            <div className="text-3xl">⏳</div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Cargando historial...</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
          {historial.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg">No hay registros de auditoría</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-slate-700 border-b border-gray-200 dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Administrador
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Objetivo
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Cambios
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {historial.map((registro) => (
                    <tr key={registro.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {registro.admin.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {registro.ip_address}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">
                            {registro.target_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                            {registro.target_type}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {registro.descripcion}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block px-3 py-1 bg-yellow-50 dark:bg-slate-700 text-yellow-700 dark:text-yellow-300 rounded-full text-sm font-medium border border-yellow-200 dark:border-slate-600">
                          {registro.permisos_changed}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {new Date(registro.created_at).toLocaleString('es-ES')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </>
  );
}
