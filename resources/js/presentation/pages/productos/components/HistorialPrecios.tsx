import type { HistorialPrecio } from '@/domain/entities/productos';
import React from 'react';

interface HistorialPreciosProps {
  historial: HistorialPrecio[];
}

/**
 * Muestra el historial de precios agrupado por tipo de precio.
 */
export const HistorialPrecios: React.FC<HistorialPreciosProps> = ({ historial }) => {
  if (!historial || historial.length === 0) {
    return null;
  }

  // Agrupar por tipo_precio_id
  const agrupado = historial.reduce<Record<number, { nombre: string; items: HistorialPrecio[] }>>((acc, h) => {
    if (!acc[h.tipo_precio_id]) {
      acc[h.tipo_precio_id] = { nombre: h.tipo_precio_nombre, items: [] };
    }
    acc[h.tipo_precio_id].items.push(h);
    return acc;
  }, {});

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">Historial de precios</h3>
      {Object.entries(agrupado).map(([tipoId, grupo]) => (
        <div key={tipoId} className="mb-4">
          <div className="font-medium text-blue-700 dark:text-blue-300">{grupo.nombre}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border mt-1">
              <thead>
                <tr className="bg-blue-50 dark:bg-blue-900/30">
                  <th className="p-1">Fecha</th>
                  <th className="p-1">Anterior</th>
                  <th className="p-1">Nuevo</th>
                  <th className="p-1">% Cambio</th>
                  <th className="p-1">Motivo</th>
                  <th className="p-1">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {grupo.items.map((h) => (
                  <tr key={h.id}>
                    <td className="p-1 whitespace-nowrap">{h.fecha_cambio}</td>
                    <td className="p-1">{h.valor_anterior}</td>
                    <td className="p-1">{h.valor_nuevo}</td>
                    <td className="p-1">{h.porcentaje_cambio?.toFixed(2)}%</td>
                    <td className="p-1">{h.motivo}</td>
                    <td className="p-1">{h.usuario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

