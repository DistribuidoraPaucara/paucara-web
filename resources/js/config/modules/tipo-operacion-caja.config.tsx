// Config: Configuración del módulo de Tipos de Operación de Caja
import { CreditCard } from 'lucide-react';
import type { ModuleConfig } from '@/config/module.types';

export const tipoOperacionCajaConfig: ModuleConfig = {
  id: 'tipo-operacion-caja',
  name: 'Tipos de Operación de Caja',
  description: 'Gestión de tipos de operación para movimientos de caja',
  icon: CreditCard,
  path: '/admin/tipo-operacion-caja',
  permission: 'tipo-operacion-caja.manage',

  routes: {
    index: 'tipo-operacion-caja.index',
    create: 'tipo-operacion-caja.create',
    show: 'tipo-operacion-caja.show',
    edit: 'tipo-operacion-caja.edit',
  },

  actions: {
    list: 'tipo-operacion-caja.index',
    create: 'tipo-operacion-caja.create',
    update: 'tipo-operacion-caja.update',
    delete: 'tipo-operacion-caja.destroy',
  },

  fields: {
    codigo: {
      label: 'Código',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el código',
    },
    nombre: {
      label: 'Nombre',
      type: 'text',
      required: true,
      placeholder: 'Ingrese el nombre',
    },
    descripcion: {
      label: 'Descripción',
      type: 'textarea',
      required: false,
      placeholder: 'Ingrese una descripción',
    },
    direccion: {
      label: 'Dirección',
      type: 'text',
      required: false,
      placeholder: 'Ej: ENTRADA, SALIDA',
    },
    activo: {
      label: 'Activo',
      type: 'checkbox',
      required: false,
      default: true,
    },
  },

  validation: {
    codigo: ['required', 'max:50'],
    nombre: ['required', 'max:255'],
    descripcion: ['nullable', 'string'],
    direccion: ['nullable', 'max:50'],
    activo: ['boolean'],
  },
};

export default tipoOperacionCajaConfig;
