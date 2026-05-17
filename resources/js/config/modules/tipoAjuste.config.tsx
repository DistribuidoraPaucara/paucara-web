/**
 * TipoAjuste Configuration
 *
 * Propósito: Centralizar configuración para GenericCrudModal
 * Eliminando duplicidad entre TipoAjusteCrudModal + TipoAjusteFormModal
 *
 * Reducción: 2 componentes (270 líneas) → 1 config (40 líneas)
 */

import type { FormField } from '@/presentation/components/generic/simple-crud-form';
import type { TipoAjusteApi } from '@/stores/useTipoAjustes';
import { Badge } from '@/presentation/components/ui/badge';

export const TIPO_AJUSTE_FORM_FIELDS: FormField[] = [
  {
    key: 'nombre',
    label: 'Nombre del Tipo',
    type: 'text',
    required: true,
    placeholder: 'Ej: Reconteo, Corrección Inventario, Donación',
    maxLength: 255,
    description: 'Clasificación del tipo de ajuste',
  },
  {
    key: 'descripcion',
    label: 'Descripción',
    type: 'textarea',
    placeholder: 'Detalles sobre este tipo de ajuste',
  },
  {
    key: 'tipo_movimiento',
    label: 'Tipo de Movimiento',
    type: 'select',
    required: true,
    options: [
      { value: 'entrada', label: 'Entrada (Aumenta Stock)' },
      { value: 'salida', label: 'Salida (Reduce Stock)' },
      { value: 'ajuste', label: 'Ajuste (Sin Cambio Neto)' },
    ],
    description: 'Cómo afecta este tipo al inventario',
  },
  {
    key: 'requiere_documento',
    label: 'Requiere Documento Soporte',
    type: 'checkbox',
    description: 'Si está marcado, hay que adjuntar documento',
  },
  {
    key: 'requiere_aprobacion',
    label: 'Requiere Aprobación',
    type: 'checkbox',
    description: 'Si está marcado, necesita supervisor',
  },
  {
    key: 'activo',
    label: 'Tipo Activo',
    type: 'checkbox',
  },
];

export const renderTipoAjuste = (item: TipoAjusteApi) => (
  <div className="flex items-center justify-between w-full gap-4">
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <p className="font-medium text-gray-900">{item.nombre}</p>
        <Badge variant="outline" className="text-xs">
          {item.tipo_movimiento === 'entrada' && '↑ Entrada'}
          {item.tipo_movimiento === 'salida' && '↓ Salida'}
          {item.tipo_movimiento === 'ajuste' && '↔ Ajuste'}
        </Badge>
      </div>
      {item.descripcion && (
        <p className="text-sm text-gray-600 line-clamp-2 mt-1">{item.descripcion}</p>
      )}
    </div>
    <div className="flex gap-2 flex-shrink-0">
      {item.requiere_documento && (
        <Badge variant="secondary" className="text-xs">Doc</Badge>
      )}
      {item.requiere_aprobacion && (
        <Badge variant="warning" className="text-xs">Auth</Badge>
      )}
      <Badge variant={item.activo ? 'default' : 'secondary'}>
        {item.activo ? 'Activo' : 'Inactivo'}
      </Badge>
    </div>
  </div>
);

export const TIPO_AJUSTE_MODAL_CONFIG = {
  title: 'Gestionar Tipos de Ajuste',
  singularTitle: 'Tipo de Ajuste',
  formFields: TIPO_AJUSTE_FORM_FIELDS,
  renderItem: renderTipoAjuste,
  emptyMessage: 'No hay tipos de ajuste registrados',
};
