/**
 * TipoMerma Configuration
 *
 * Propósito: Centralizar configuración para GenericCrudModal
 * Eliminando duplicidad entre TipoMermaCrudModal + TipoMermaFormModal
 *
 * Reducción: 2 componentes (250 líneas) → 1 config (35 líneas)
 */

import type { FormField } from '@/presentation/components/generic/simple-crud-form';
import type { TipoMermaApi } from '@/stores/useTipoMermas';
import { Badge } from '@/presentation/components/ui/badge';

export const TIPO_MERMA_FORM_FIELDS: FormField[] = [
  {
    key: 'nombre',
    label: 'Nombre del Tipo',
    type: 'text',
    required: true,
    placeholder: 'Ej: Rotura, Evaporación, Deterioro',
    maxLength: 255,
    description: 'Clasificación del tipo de merma',
  },
  {
    key: 'descripcion',
    label: 'Descripción',
    type: 'textarea',
    placeholder: 'Detalles sobre este tipo de merma',
  },
  {
    key: 'porcentaje_maximo',
    label: 'Porcentaje Máximo Permitido (%)',
    type: 'number',
    min: 0,
    max: 100,
    description: 'Máximo porcentaje de merma permitido',
  },
  {
    key: 'requiere_autorizacion',
    label: 'Requiere Autorización',
    type: 'checkbox',
    description: 'Si está marcado, la merma necesita aprobación',
  },
  {
    key: 'activo',
    label: 'Tipo Activo',
    type: 'checkbox',
  },
];

export const renderTipoMerma = (item: TipoMermaApi) => (
  <div className="flex items-center justify-between w-full gap-4">
    <div className="flex-1">
      <p className="font-medium text-gray-900">{item.nombre}</p>
      {item.descripcion && (
        <p className="text-sm text-gray-600 line-clamp-2">{item.descripcion}</p>
      )}
      {item.porcentaje_maximo !== undefined && (
        <p className="text-xs text-gray-500 mt-1">
          Máximo permitido: {item.porcentaje_maximo}%
        </p>
      )}
    </div>
    <div className="flex gap-2">
      {item.requiere_autorizacion && (
        <Badge variant="warning">Requiere Auth.</Badge>
      )}
      <Badge variant={item.activo ? 'default' : 'secondary'}>
        {item.activo ? 'Activo' : 'Inactivo'}
      </Badge>
    </div>
  </div>
);

export const TIPO_MERMA_MODAL_CONFIG = {
  title: 'Gestionar Tipos de Merma',
  singularTitle: 'Tipo de Merma',
  formFields: TIPO_MERMA_FORM_FIELDS,
  renderItem: renderTipoMerma,
  emptyMessage: 'No hay tipos de merma registrados',
};
