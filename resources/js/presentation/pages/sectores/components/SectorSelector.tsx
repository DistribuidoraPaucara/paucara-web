/**
 * Component: Selector de Sector
 *
 * Permite seleccionar un sector filtrado por almacén
 * Carga dinámicamente los sectores del almacén seleccionado
 */

import { useEffect, useState } from 'react';
import sectoresService from '@/infrastructure/services/sectores.service';
import type { Sector } from '@/domain/entities/sectores';
import type { Id } from '@/domain/entities/shared';

interface SectorSelectorProps {
  almacenId?: Id;
  value?: Id;
  onChange: (sectorId: Id) => void;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  error?: string;
}

/**
 * Selector de Sector con carga dinámica
 *
 * Propiedades:
 * - almacenId: ID del almacén para filtrar sectores
 * - value: Sector seleccionado actual
 * - onChange: Callback cuando se selecciona un sector
 * - disabled: Deshabilitar el selector
 * - label: Etiqueta del campo
 * - placeholder: Texto de placeholder
 * - error: Mensaje de error a mostrar
 *
 * Ejemplo de uso:
 * ```tsx
 * <SectorSelector
 *   almacenId={2}
 *   value={sectorId}
 *   onChange={(id) => setSectorId(id)}
 *   label="Seleccionar Sector"
 * />
 * ```
 */
export default function SectorSelector({
  almacenId,
  value,
  onChange,
  disabled = false,
  label = 'Sector',
  placeholder = 'Seleccionar sector...',
  error
}: SectorSelectorProps) {
  const [sectores, setSectores] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(false);

  // Cargar sectores cuando cambia el almacén
  useEffect(() => {
    if (!almacenId) {
      setSectores([]);
      return;
    }

    setLoading(true);
    sectoresService
      .listarPorAlmacen(almacenId)
      .then((data) => {
        setSectores(data);
        // Si no hay sector seleccionado y hay sectores, seleccionar el genérico
        if (!value && data.length > 0) {
          const generico = data.find(s => s.es_generico);
          if (generico) {
            onChange(generico.id);
          }
        }
      })
      .catch((err) => {
        console.error('Error al cargar sectores:', err);
        setSectores([]);
      })
      .finally(() => setLoading(false));
  }, [almacenId]);

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}

      <select
        value={value || ''}
        onChange={(e) => onChange(Number(e.target.value) as Id)}
        disabled={disabled || loading || sectores.length === 0}
        className={`
          block w-full px-3 py-2 border rounded-md
          text-sm font-medium
          transition-colors
          ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }
          ${disabled || loading ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white'}
          dark:bg-gray-800 dark:border-gray-600
          focus:outline-none focus:ring-1
        `}
      >
        <option value="">{placeholder}</option>
        {sectores.map((sector) => (
          <option key={sector.id} value={sector.id}>
            {sector.nombre}
            {sector.es_generico ? ' (General)' : ''}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
      )}

      {loading && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Cargando sectores...
        </p>
      )}

      {!loading && sectores.length === 0 && almacenId && (
        <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
          No hay sectores disponibles para este almacén
        </p>
      )}
    </div>
  );
}
