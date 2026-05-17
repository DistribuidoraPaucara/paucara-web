import {
  TipoMovimientoUnificado,
  SubtipoMovimiento,
  EstadoTransferencia,
  TipoMerma,
  EstadoMerma,
} from '@/domain/entities';

// Configuración de tipos de movimiento
export interface ConfiguracionTipoMovimiento {
  tipo: TipoMovimientoUnificado;
  label: string;
  bgColor: string;
  textColor: string;
  requiereAprobacion: boolean;
  subtipos?: SubtipoMovimiento[];
}

export const CONFIGURACION_MOVIMIENTOS: Record<TipoMovimientoUnificado, ConfiguracionTipoMovimiento> = {
  ENTRADA: {
    tipo: 'ENTRADA',
    label: 'Entrada',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    textColor: 'text-green-800 dark:text-green-300',
    requiereAprobacion: false,
  },
  SALIDA: {
    tipo: 'SALIDA',
    label: 'Salida',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    textColor: 'text-red-800 dark:text-red-300',
    requiereAprobacion: false,
  },
  AJUSTE: {
    tipo: 'AJUSTE',
    label: 'Ajuste',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    textColor: 'text-blue-800 dark:text-blue-300',
    requiereAprobacion: true,
  },
  TRANSFERENCIA: {
    tipo: 'TRANSFERENCIA',
    label: 'Transferencia',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    textColor: 'text-purple-800 dark:text-purple-300',
    requiereAprobacion: false,
  },
  MERMA: {
    tipo: 'MERMA',
    label: 'Merma',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    textColor: 'text-orange-800 dark:text-orange-300',
    requiereAprobacion: true,
  },
  PRODUCCION: {
    tipo: 'PRODUCCION',
    label: 'Producción',
    bgColor: 'bg-indigo-100 dark:bg-indigo-900/20',
    textColor: 'text-indigo-800 dark:text-indigo-300',
    requiereAprobacion: false,
  },
  DEVOLUCION: {
    tipo: 'DEVOLUCION',
    label: 'Devolución',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
    textColor: 'text-gray-800 dark:text-gray-300',
    requiereAprobacion: true,
  },
};

// Configuración de estados de transferencia
export interface EstadoConfig {
  estado: EstadoTransferencia;
  label: string;
  bgColor: string;
  textColor: string;
}

export const ESTADOS_TRANSFERENCIA: Record<EstadoTransferencia, EstadoConfig> = {
  BORRADOR: {
    estado: 'BORRADOR',
    label: 'Borrador',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
    textColor: 'text-gray-800 dark:text-gray-300',
  },
  ENVIADO: {
    estado: 'ENVIADO',
    label: 'Enviado',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    textColor: 'text-blue-800 dark:text-blue-300',
  },
  RECIBIDO: {
    estado: 'RECIBIDO',
    label: 'Recibido',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    textColor: 'text-green-800 dark:text-green-300',
  },
  CANCELADO: {
    estado: 'CANCELADO',
    label: 'Cancelado',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    textColor: 'text-red-800 dark:text-red-300',
  },
};

// Configuración de tipos de merma
export interface TipoMermaConfig {
  tipo: TipoMerma;
  label: string;
  bgColor: string;
  textColor: string;
  descripcion: string;
}

export const TIPOS_MERMA: Record<TipoMerma, TipoMermaConfig> = {
  VENCIMIENTO: {
    tipo: 'VENCIMIENTO',
    label: 'Vencimiento',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    textColor: 'text-red-800 dark:text-red-300',
    descripcion: 'Productos vencidos o próximos a vencer',
  },
  DETERIORO: {
    tipo: 'DETERIORO',
    label: 'Deterioro',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    textColor: 'text-orange-800 dark:text-orange-300',
    descripcion: 'Productos deteriorados o en mal estado',
  },
  ROBO: {
    tipo: 'ROBO',
    label: 'Robo',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    textColor: 'text-purple-800 dark:text-purple-300',
    descripcion: 'Productos sustraídos o robados',
  },
  PERDIDA: {
    tipo: 'PERDIDA',
    label: 'Pérdida',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    textColor: 'text-yellow-800 dark:text-yellow-300',
    descripcion: 'Productos extraviados o perdidos',
  },
  DANO: {
    tipo: 'DANO',
    label: 'Daño',
    bgColor: 'bg-pink-100 dark:bg-pink-900/20',
    textColor: 'text-pink-800 dark:text-pink-300',
    descripcion: 'Productos dañados durante manipulación o transporte',
  },
  OTROS: {
    tipo: 'OTROS',
    label: 'Otros',
    bgColor: 'bg-gray-100 dark:bg-gray-900/20',
    textColor: 'text-gray-800 dark:text-gray-300',
    descripcion: 'Otras causas de merma',
  },
};

// Configuración de estados de merma
export interface EstadoMermaConfig {
  estado: EstadoMerma;
  label: string;
  bgColor: string;
  textColor: string;
}

export const ESTADOS_MERMA: Record<EstadoMerma, EstadoMermaConfig> = {
  PENDIENTE: {
    estado: 'PENDIENTE',
    label: 'Pendiente',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    textColor: 'text-yellow-800 dark:text-yellow-300',
  },
  APROBADO: {
    estado: 'APROBADO',
    label: 'Aprobado',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    textColor: 'text-green-800 dark:text-green-300',
  },
  RECHAZADO: {
    estado: 'RECHAZADO',
    label: 'Rechazado',
    bgColor: 'bg-red-100 dark:bg-red-900/20',
    textColor: 'text-red-800 dark:text-red-300',
  },
};
