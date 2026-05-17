/**
 * Component: Tarjeta de Sector
 *
 * Muestra información del sector de forma visual
 * Con opciones para editar y eliminar
 */

import { useState } from 'react';
import type { Sector } from '@/domain/entities/sectores';

interface SectorCardProps {
  sector: Sector;
  almacenNombre?: string;
  onEdit?: (sector: Sector) => void;
  onDelete?: (sectorId: number) => void;
  readonly?: boolean;
}

/**
 * Tarjeta visual para mostrar información del sector
 *
 * Propiedades:
 * - sector: Objeto sector a mostrar
 * - almacenNombre: Nombre del almacén (para mostrar contexto)
 * - onEdit: Callback para editar el sector
 * - onDelete: Callback para eliminar el sector
 * - readonly: Si es true, no muestra botones de acción
 *
 * Ejemplo:
 * ```tsx
 * <SectorCard
 *   sector={sector}
 *   almacenNombre="Almacén Central"
 *   onEdit={handleEdit}
 *   onDelete={handleDelete}
 * />
 * ```
 */
export default function SectorCard({
  sector,
  almacenNombre,
  onEdit,
  onDelete,
  readonly = false
}: SectorCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    if (sector.es_generico) {
      alert('No se puede eliminar el sector genérico del almacén');
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete?.(sector.id as number);
    setShowDeleteConfirm(false);
  };

  return (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-lg border border-gray-200 dark:border-gray-700
        p-4 mb-4
        hover:shadow-md transition-shadow
        ${readonly ? '' : 'cursor-pointer'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {sector.nombre}
            </h3>
            {sector.es_generico && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                ✅ General
              </span>
            )}
          </div>
          {almacenNombre && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Almacén: {almacenNombre}
            </p>
          )}
        </div>

        {/* Actions */}
        {!readonly && !sector.es_generico && (
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={() => onEdit(sector)}
                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md transition-colors"
                title="Editar sector"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-colors"
                title="Eliminar sector"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>

      {/* Description */}
      {sector.descripcion && (
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          {sector.descripcion}
        </p>
      )}

      {/* Footer */}
      <div className="pt-3 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
        <p>ID: {sector.id}</p>
        {sector.created_at && (
          <p>Creado: {new Date(sector.created_at).toLocaleDateString('es-ES')}</p>
        )}
      </div>

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
          <p className="text-sm text-red-800 dark:text-red-200 mb-3">
            ¿Está seguro de que desea eliminar este sector?
            Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleConfirmDelete}
              className="px-3 py-1 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Eliminar
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
