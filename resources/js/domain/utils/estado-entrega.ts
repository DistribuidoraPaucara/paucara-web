/**
 * Utilidad para mapear estados de entrega a sus etiquetas en español
 *
 * Estados disponibles:
 * - PROGRAMADO: Estado inicial, entrega programada
 * - ASIGNADA: Vehículo y chofer asignados
 * - PREPARACION_CARGA: Reporte de carga generado, esperando carga física
 * - EN_CARGA: Carga física en progreso
 * - LISTO_PARA_ENTREGA: Carga completada, listo para partir
 * - EN_TRANSITO: En ruta con seguimiento GPS
 * - EN_CAMINO: (Legacy) En ruta
 * - ENTREGADO: Entrega completada
 * - LLEGO: (Legacy) Llegó al destino
 * - RECHAZADO: Entrega rechazada
 * - NOVEDAD: Hay novedad/incidente
 * - CANCELADA: Entrega cancelada
 */

type EstadoEntrega =
  | 'PROGRAMADO'
  | 'ASIGNADA'
  | 'PREPARACION_CARGA'
  | 'EN_CARGA'
  | 'LISTO_PARA_ENTREGA'
  | 'EN_TRANSITO'
  | 'EN_CAMINO'
  | 'ENTREGADO'
  | 'LLEGO'
  | 'RECHAZADO'
  | 'NOVEDAD'
  | 'CANCELADA'
  | string;

/**
 * Mapear estado de entrega a etiqueta en español
 * @param estado - Estado de la entrega
 * @returns Etiqueta en español
 */
export function getEstadoLabel(estado: EstadoEntrega): string {
  const estadoMap: Record<EstadoEntrega, string> = {
    PROGRAMADO: 'Programada',
    ASIGNADA: 'Asignada',
    PREPARACION_CARGA: 'Preparación de Carga',
    EN_CARGA: 'En Carga',
    LISTO_PARA_ENTREGA: 'Listo para Entrega',
    EN_TRANSITO: 'En Tránsito',
    EN_CAMINO: 'En Camino',
    ENTREGADO: 'Entregado',
    LLEGO: 'Llegó',
    RECHAZADO: 'Rechazado',
    NOVEDAD: 'Novedad',
    CANCELADA: 'Cancelada',
  };

  return estadoMap[estado] || estado;
}

/**
 * Mapear estado de entrega a descripción detallada
 * @param estado - Estado de la entrega
 * @returns Descripción detallada del estado
 */
export function getEstadoDescripcion(estado: EstadoEntrega): string {
  const descripcionMap: Record<EstadoEntrega, string> = {
    PROGRAMADO: 'Entrega programada, aguardando asignación',
    ASIGNADA: 'Vehículo y chofer asignados',
    PREPARACION_CARGA: 'Reporte generado, esperando carga física',
    EN_CARGA: 'Carga física en progreso',
    LISTO_PARA_ENTREGA: 'Carga completada, listo para partir',
    EN_TRANSITO: 'En ruta con seguimiento GPS',
    EN_CAMINO: 'En ruta hacia el destino',
    ENTREGADO: 'Entrega completada',
    LLEGO: 'Llegó al destino',
    RECHAZADO: 'Entrega rechazada',
    NOVEDAD: 'Hay novedad o incidente',
    CANCELADA: 'Entrega cancelada',
  };

  return descripcionMap[estado] || estado;
}

/**
 * Colores para badges de estados
 */
export const estadoColorMap: Record<EstadoEntrega | string, string> = {
  PROGRAMADO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  ASIGNADA: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
  PREPARACION_CARGA: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  EN_CARGA: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-200',
  LISTO_PARA_ENTREGA: 'bg-lime-100 text-lime-800 dark:bg-lime-900/30 dark:text-lime-200',
  EN_TRANSITO: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
  EN_CAMINO: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
  ENTREGADO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
  LLEGO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
  RECHAZADO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
  NOVEDAD: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
  CANCELADA: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
};
