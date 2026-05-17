/**
 * EstadoMerma Configuration
 *
 * Propósito: Centralizar configuración para GenericCrudModal
 * Eliminando duplicidad entre EstadoMermaCrudModal + EstadoMermaFormModal
 *
 * Reducción: 2 componentes (270 líneas) → 1 config (40 líneas)
 */

import type { FormField } from '@/presentation/components/generic/simple-crud-form';
import type { EstadoMermaApi } from '@/stores/useEstadoMermas';
import { Badge } from '@/presentation/components/ui/badge';
import React from 'react';

export const ESTADO_MERMA_FORM_FIELDS: FormField[] = [
  {
    key: 'nombre',
    label: 'Nombre del Estado',
    type: 'text',
    required: true,
    placeholder: 'Ej: Parcialmente Dañado, Oxidado, Vencido',
    maxLength: 255,
    description: 'Nombre corto y descriptivo del estado de merma',
  },
  {
    key: 'descripcion',
    label: 'Descripción',
    type: 'textarea',
    placeholder: 'Descripción detallada del estado de merma',
    description: 'Explicación de cuándo aplicar este estado',
  },
  {
    key: 'activo',
    label: 'Estado Activo',
    type: 'checkbox',
    description: 'Desactiva si no usas más este estado',
  },
];

/**
 * Renderizar EstadoMerma en la lista del modal
 *
 * Muestra:
 * - Nombre en negrita
 * - Descripción en gris
 * - Badge con estado (Activo/Inactivo)
 */
export const renderEstadoMerma = (item: EstadoMermaApi) => (
  <div className="flex items-center justify-between w-full gap-4">
    <div className="flex-1">
      <p className="font-medium text-gray-900">{item.nombre}</p>
      {item.descripcion && (
        <p className="text-sm text-gray-600 line-clamp-2">{item.descripcion}</p>
      )}
    </div>
    <Badge variant={item.activo ? 'default' : 'secondary'}>
      {item.activo ? 'Activo' : 'Inactivo'}
    </Badge>
  </div>
);

// Alias para compatibilidad con otros patrones
export const ESTADO_MERMA_MODAL_CONFIG = {
  title: 'Gestionar Estados de Merma',
  singularTitle: 'Estado de Merma',
  formFields: ESTADO_MERMA_FORM_FIELDS,
  renderItem: renderEstadoMerma,
  emptyMessage: 'No hay estados de merma registrados',
};
