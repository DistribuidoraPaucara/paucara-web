/**
 * Component: Grid de Sectores Agrupados por Almacén
 *
 * Muestra todos los sectores organizados por almacén
 * Útil para visualizar la estructura completa
 */

import { useState, useEffect } from 'react';
import SectorCard from './SectorCard';
import type { Sector } from '@/domain/entities/sectores';
import type { Almacen } from '@/domain/entities/almacenes';

interface SectoresGridProps {
  sectores: Sector[];
  almacenes: Almacen[];
  onEdit?: (sector: Sector) => void;
  onDelete?: (sectorId: number) => void;
  loading?: boolean;
}

/**
 * Grid que agrupa sectores por almacén
 *
 * Propiedades:
 * - sectores: Lista de sectores a mostrar
 * - almacenes: Lista de almacenes para obtener nombres
 * - onEdit: Callback para editar
 * - onDelete: Callback para eliminar
 * - loading: Estado de carga
 *
 * Ejemplo:
 * ```tsx
 * <SectoresGrid
 *   sectores={sectores}
 *   almacenes={almacenes}
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export default function SectoresGrid({
  sectores,
  almacenes,
  onEdit,
  onDelete,
  loading = false
}: SectoresGridProps) {
  const [agrupadosPorAlmacen, setAgrupadosPorAlmacen] = useState<
    Record<number, { almacen: Almacen; sectores: Sector[] }>
  >({});

  // Agrupar sectores por almacén
  useEffect(() => {
    const agrupado: Record<number, { almacen: Almacen; sectores: Sector[] }> = {};

    almacenes.forEach((almacen) => {
      agrupado[almacen.id as number] = {
        almacen,
        sectores: sectores.filter((s) => s.almacen_id === almacen.id)
      };
    });

    setAgrupadosPorAlmacen(agrupado);
  }, [sectores, almacenes]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-500 dark:text-gray-400">Cargando sectores...</div>
      </div>
    );
  }

  const almacenesConSectores = Object.values(agrupadosPorAlmacen).filter(
    (item) => item.sectores.length > 0
  );

  if (almacenesConSectores.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No hay sectores registrados</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {almacenesConSectores.map(({ almacen, sectores: sectoresDelAlmacen }) => (
        <div key={almacen.id}>
          {/* Header del Almacén */}
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🏢 {almacen.nombre}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {sectoresDelAlmacen.length}{' '}
              {sectoresDelAlmacen.length === 1 ? 'sector' : 'sectores'}
            </p>
          </div>

          {/* Grid de Sectores */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectoresDelAlmacen.map((sector) => (
              <SectorCard
                key={sector.id}
                sector={sector}
                almacenNombre={almacen.nombre}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
