/**
 * WebSocket Event Types and Definitions
 * Define la estructura de todos los eventos disponibles en el sistema
 */

// ==================== NOTIFICATION TYPE ====================
export interface BaseNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: string;
  userId?: number;
  roles?: string[];
}

export type NotificationType =
  | 'proforma'
  | 'entrega'
  | 'ruta'
  | 'ubicacion'
  | 'novedad'
  | 'chofer'
  | 'creditos'
  | 'dashboard'
  | 'general';

// ==================== PROFORMA EVENTS ====================
export interface ProformaCreatedEvent {
  id: number;
  numero: string;
  clienteId: number;
  clienteNombre: string;
  monto: number;
  estado: string;
  creadoEn: string;
  creadoPor: string;
}

export interface ProformaApprovedEvent {
  id: number;
  numero: string;
  clienteNombre: string;
  aprobadoPor: string;
  aprobadoEn: string;
  monto: number;
}

export interface ProformaRejectedEvent {
  id: number;
  numero: string;
  clienteNombre: string;
  rechazadoPor: string;
  rechazadoEn: string;
  razon?: string;
}

export interface ProformaConvertedEvent {
  id: number;
  numero: string;
  ventaId: number;
  ventaNumero: string;
  clienteNombre: string;
  monto: number;
  convertidoEn: string;
}

export interface ProformaCoordinationEvent {
  id: number;
  numero: string;
  estado: string;
  actualizadoEn: string;
  detalles: string;
}

// ==================== ENTREGA EVENTS ====================
export interface EntregaAsignadaEvent {
  id: number;
  numero: string;
  choferId: number;
  choferNombre: string;
  clienteNombre: string;
  direccion: string;
  asignadoEn: string;
}

export interface EntregaEnCaminoEvent {
  id: number;
  numero: string;
  choferNombre: string;
  ubicacion: {
    latitud: number;
    longitud: number;
  };
  distanciaRestante?: number;
  tiempoEstimado?: string;
  cambioEn: string;
}

export interface EntregaConfirmadaEvent {
  id: number;
  numero: string;
  clienteNombre: string;
  confirmadoEn: string;
}

export interface EntregaCompletadaEvent {
  id: number;
  numero: string;
  clienteNombre: string;
  choferNombre: string;
  completadoEn: string;
  firma?: string;
  foto?: string;
}

export interface EntregaCreadaEvent {
  id: number;
  numero: string;
  ventaId?: number;
  clienteNombre: string;
  creadoEn: string;
  estado: string;
}

export interface EntregaRechazadaEvent {
  id: number;
  numero: string;
  razon: string;
  rechazadoPor: string;
  rechazadoEn: string;
  clienteNombre: string;
}

export interface EntregaEstadoCambioEvent {
  entrega_id: number;
  numero_entrega: string;
  estado_nuevo: string;
  chofer: {
    id: number;
    nombre: string;
  };
  vehiculo: {
    placa: string;
    marca: string;
  };
  cantidad_ventas: number;
  monto_total: number;
  fecha_cambio: string;
  destinatario: 'admins' | 'cajeros';
}

// ==================== UBICACION EVENTS ====================
export interface UbicacionActualizadaEvent {
  id: number;
  entregaId: number;
  choferId: number;
  choferNombre: string;
  latitud: number;
  longitud: number;
  precision: number;
  velocidad?: number;
  direccion?: string;
  actualizadoEn: string;
}

export interface MarcarLlegadaConfirmadaEvent {
  id: number;
  entregaId: number;
  choferId: number;
  choferNombre: string;
  clienteNombre: string;
  latitud: number;
  longitud: number;
  llegadaEn: string;
}

// ==================== RUTA EVENTS ====================
export interface RutaPlanificadaEvent {
  id: number;
  numero: string;
  choferId: number;
  choferNombre: string;
  cantidadParadas: number;
  distanciaTotal: number;
  horaInicio: string;
  horaFin?: string;
  planificadoEn: string;
}

export interface RutaDetalleActualizadoEvent {
  id: number;
  rutaId: number;
  detalle: string;
  cambioEn: string;
}

export interface RutaModificadaEvent {
  id: number;
  numero: string;
  razonModificacion: string;
  modificadoPor: string;
  modificadoEn: string;
  novedades?: string;
}

// ==================== NOVEDAD/ISSUE EVENTS ====================
export interface NovedadReportadaEvent {
  id: number;
  tipo: 'falta' | 'daño' | 'direccion_incorrecta' | 'cliente_rechaza' | 'otra';
  descripcion: string;
  entregaId?: number;
  entregaNumero?: string;
  reportadoPor: string;
  reportadoEn: string;
  estado: 'abierta' | 'en_proceso' | 'resuelta';
}

export interface NovedadEntregaReportadaEvent {
  id: number;
  entregaId: number;
  entregaNumero: string;
  tipo: string;
  descripcion: string;
  reportadoPor: string;
  reportadoEn: string;
  fotoURL?: string;
}

// ==================== CHOFER EVENTS ====================
export interface ChoferEnCaminoEvent {
  id: number;
  choferId: number;
  choferNombre: string;
  entregaId: number;
  rutaId: number;
  horaPartida: string;
  ubicacion: {
    latitud: number;
    longitud: number;
  };
}

export interface ChoferLlegoEvent {
  id: number;
  choferId: number;
  choferNombre: string;
  entregaId: number;
  clienteNombre: string;
  horaLlegada: string;
  ubicacion: {
    latitud: number;
    longitud: number;
  };
}

// ==================== PEDIDO EVENTS ====================
export interface PedidoEntregadoEvent {
  id: number;
  pedidoId: number;
  pedidoNumero: string;
  clienteNombre: string;
  entregaId: number;
  entregadoEn: string;
  choferNombre: string;
  firma?: string;
}

// ==================== DASHBOARD EVENTS ====================
export interface DashboardMetricsUpdatedEvent {
  timestamp: string;
  metrics: {
    ventasHoy: number;
    ventasEstaSemana: number;
    entregasCompletadas: number;
    clientesActivos: number;
    ingresos: number;
  };
}

// ==================== CREDITOS EVENTS ====================
export interface CreditoVencidoEvent {
  cuenta_por_cobrar_id: number;
  cliente_id: number;
  cliente_nombre: string;
  venta_id: number;
  numero_venta: string;
  saldo_pendiente: number;
  dias_vencido: number;
  fecha_vencimiento: string;
  timestamp: string;
}

export interface CreditoCriticoEvent {
  cliente_id: number;
  cliente_nombre: string;
  limite_credito: number;
  saldo_disponible: number;
  porcentaje_utilizado: number;
  cantidad_cuentas_pendientes: number;
  monto_total_pendiente: number;
  timestamp: string;
}

export interface CreditoPagoRegistradoEvent {
  pago_id: number;
  cuenta_por_cobrar_id: number;
  cliente_id: number;
  cliente_nombre: string;
  monto: number;
  tipo_pago: string;
  numero_recibo?: string;
  fecha_pago: string;
  usuario_nombre?: string;
  timestamp: string;
}

// ==================== UNION TYPE ====================
export type WebSocketEvent =
  | { event: 'proforma.creada'; data: ProformaCreatedEvent }
  | { event: 'proforma.aprobada'; data: ProformaApprovedEvent }
  | { event: 'proforma.rechazada'; data: ProformaRejectedEvent }
  | { event: 'proforma.convertida'; data: ProformaConvertedEvent }
  | { event: 'proforma.coordinacion-actualizada'; data: ProformaCoordinationEvent }
  | { event: 'entrega.asignada'; data: EntregaAsignadaEvent }
  | { event: 'entrega.en-camino'; data: EntregaEnCaminoEvent }
  | { event: 'entrega.confirmada'; data: EntregaConfirmadaEvent }
  | { event: 'entrega.completada'; data: EntregaCompletadaEvent }
  | { event: 'entrega.creada'; data: EntregaCreadaEvent }
  | { event: 'entrega.rechazada'; data: EntregaRechazadaEvent }
  | { event: 'entrega.estado-cambio'; data: EntregaEstadoCambioEvent }
  | { event: 'ubicacion.actualizada'; data: UbicacionActualizadaEvent }
  | { event: 'ubicacion.llegada-confirmada'; data: MarcarLlegadaConfirmadaEvent }
  | { event: 'ruta.planificada'; data: RutaPlanificadaEvent }
  | { event: 'ruta.detalle-actualizado'; data: RutaDetalleActualizadoEvent }
  | { event: 'ruta.modificada'; data: RutaModificadaEvent }
  | { event: 'novedad.reportada'; data: NovedadReportadaEvent }
  | { event: 'novedad.entrega-reportada'; data: NovedadEntregaReportadaEvent }
  | { event: 'chofer.en-camino'; data: ChoferEnCaminoEvent }
  | { event: 'chofer.llego'; data: ChoferLlegoEvent }
  | { event: 'pedido.entregado'; data: PedidoEntregadoEvent }
  | { event: 'credito.vencido'; data: CreditoVencidoEvent }
  | { event: 'credito.critico'; data: CreditoCriticoEvent }
  | { event: 'credito.pago-registrado'; data: CreditoPagoRegistradoEvent }
  | { event: 'dashboard.metrics-updated'; data: DashboardMetricsUpdatedEvent };

// ==================== EVENT HANDLERS ====================
export type EventHandler<T extends WebSocketEvent['data']> = (data: T) => void;

// ==================== ROLE-BASED VISIBILITY ====================
export const EVENT_ROLE_MAPPING: Record<string, string[]> = {
  'proforma.creada': ['preventista', 'cajero', 'manager', 'admin'],
  'proforma.aprobada': ['preventista', 'cajero', 'cliente', 'manager', 'admin'],
  'proforma.rechazada': ['preventista', 'cliente', 'manager', 'admin'],
  'proforma.convertida': ['preventista', 'logistica', 'cobrador', 'manager', 'admin'],
  'proforma.coordinacion-actualizada': ['manager', 'admin'],

  'entrega.asignada': ['chofer', 'logistica', 'manager', 'admin'],
  'entrega.en-camino': ['logistica', 'cobrador', 'manager', 'admin', 'cliente'],
  'entrega.confirmada': ['cliente', 'logistica', 'manager', 'admin'],
  'entrega.completada': ['cliente', 'logistica', 'cobrador', 'manager', 'admin'],
  'entrega.creada': ['logistica', 'manager', 'admin'],
  'entrega.rechazada': ['logistica', 'manager', 'admin', 'cliente'],
  'entrega.estado-cambio': ['logistica', 'cajero', 'manager', 'admin'],

  'ubicacion.actualizada': ['logistica', 'cobrador', 'manager', 'admin', 'cliente'],
  'ubicacion.llegada-confirmada': ['cliente', 'logistica', 'manager', 'admin'],

  'ruta.planificada': ['logistica', 'chofer', 'manager', 'admin'],
  'ruta.detalle-actualizado': ['logistica', 'manager', 'admin'],
  'ruta.modificada': ['logistica', 'chofer', 'manager', 'admin'],

  'novedad.reportada': ['manager', 'admin', 'logistica'],
  'novedad.entrega-reportada': ['logistica', 'chofer', 'manager', 'admin', 'cliente'],

  'chofer.en-camino': ['logistica', 'manager', 'admin', 'cliente'],
  'chofer.llego': ['logistica', 'manager', 'admin', 'cliente'],

  'pedido.entregado': ['cliente', 'logistica', 'cobrador', 'manager', 'admin'],

  'credito.vencido': ['cobrador', 'manager', 'admin', 'cliente'],
  'credito.critico': ['cobrador', 'manager', 'admin', 'cliente'],
  'credito.pago-registrado': ['cobrador', 'cajero', 'manager', 'admin', 'cliente'],

  'dashboard.metrics-updated': ['manager', 'admin'],
};

export const getEventCategory = (eventName: string): NotificationType => {
  if (eventName.startsWith('proforma')) return 'proforma';
  if (eventName.startsWith('entrega')) return 'entrega';
  if (eventName.startsWith('ruta')) return 'ruta';
  if (eventName.startsWith('ubicacion')) return 'ubicacion';
  if (eventName.startsWith('novedad')) return 'novedad';
  if (eventName.startsWith('chofer')) return 'chofer';
  if (eventName.startsWith('credito')) return 'creditos';
  if (eventName.startsWith('dashboard')) return 'dashboard';
  return 'general';
};
