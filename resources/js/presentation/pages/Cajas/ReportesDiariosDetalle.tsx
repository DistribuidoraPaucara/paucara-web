/**
 * Page: Cajas/ReportesDiariosDetalle
 *
 * Página de detalle completo de un cierre de caja
 * Muestra todos los movimientos entre apertura y cierre con filtros interactivos
 */

import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  ArrowLeft,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Search,
  X,
  Printer,
  Eye,
} from 'lucide-react';
import { OutputSelectionModal, type TipoDocumento } from '@/presentation/components/impresion/OutputSelectionModal';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import { Badge } from '@/presentation/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface TipoOperacion {
  id: number;
  codigo: string;
  nombre: string;
}

interface TipoPago {
  id: number;
  nombre: string;
}

interface Movimiento {
  id: number;
  fecha: string;
  usuario: {
    id: number;
    name: string;
  };
  tipo_operacion: {
    codigo: string;
    nombre: string;
  };
  numero_documento: string;
  monto: number;
  observaciones?: string;
  venta_id?: number;
  pago_id?: number;
  tipo_pago_id?: number;
  tipo_pago?: TipoPago;
  venta?: {
    id: number;
    numero_documento: string;
    total?: number;
    monto_pagado?: number;
    monto_pendiente?: number;
    tipo_pago_id?: number;
    estado_documento?: {
      id: number;
      codigo: string;
      nombre: string;
    };
    cliente?: {
      id: number;
      nombre: string;
    };
    detallesPagoVenta?: Array<{
      id: number;
      monto: number;
      tipo_pago_id: number;
      tipoPago?: TipoPago;
    }>;
  };
}

interface TotalPorTipo {
  codigo: string;
  nombre: string;
  cantidad: number;
  total: number;
}

interface Cierre {
  id: number;
  usuario_id: number;
  usuario: {
    id: number;
    name: string;
  };
  caja: {
    id: number;
    nombre: string;
  };
  fecha_apertura: string;
  fecha_cierre: string;
  monto_apertura: number;
  monto_esperado: number;
  monto_real: number;
  diferencia: number;
}

interface DatosResumen {
  totalVentas: number;
  ventasAnuladas: number;
  pagosCredito: number;
  totalIngresos: number;
  totalEgresos: number;
  sumatorialGastos: number;
  sumatorialPagosSueldo: number;
  sumatorialAnticipos: number;
  sumatorialCompras: number;
  sumatorialServicio: number;
  sumatorialDevoluciones: number;
  detallesPagosVentaPorTipo: Array<{
    tipo: string;
    codigo: string;
    total: number;
    cantidad: number;
  }>;
}

interface Props {
  cierre: Cierre;
  movimientos: Movimiento[];
  totales_por_tipo: TotalPorTipo[];
  tipos_operacion: TipoOperacion[];
  tipos_pago?: TipoPago[];
  datosResumen?: DatosResumen;
}

export default function ReportesDiariosDetalle({
  cierre,
  movimientos,
  totales_por_tipo,
  tipos_operacion,
  tipos_pago = [],
  datosResumen,
}: Props) {
  // ✅ DEBUG: Mostrar qué llega del backend
  console.log('🔍 [ReportesDiariosDetalle] DATOS DEL BACKEND:', {
    cierre,
    movimientos_count: movimientos.length,
    movimientos_completo: movimientos,
    totales_por_tipo,
    tipos_operacion,
    tipos_pago,
    datosResumen,
  });

  // ✅ DEBUG: Mostrar solo los movimientos que tienen venta asociada
  console.log('📋 [ReportesDiariosDetalle] MOVIMIENTOS CON VENTA:',
    movimientos.filter(m => m.venta_id && m.venta)
  );

  // ✅ DEBUG: Mostrar movimientos de tipo CREDITO
  console.log('💳 [ReportesDiariosDetalle] MOVIMIENTOS TIPO CREDITO:',
    movimientos.filter(m => m.tipo_operacion.codigo === 'CREDITO')
  );

  const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin/dashboard' },
    { title: 'Cajas', href: '/cajas' },
    { title: 'Reportes Diarios', href: '/cajas/admin/reportes-diarios' },
    { title: `Cierre #${cierre.id}`, href: '#' },
  ];

  // ===== HELPER: Obtener ID de tipo_pago 'CRÉDITO' =====
  const creditoTipoPagoId = tipos_pago.find(tp => tp.nombre?.toUpperCase().includes('CRÉDIT'))?.id;

  // ===== FILTROS =====
  const [tiposSeleccionados, setTiposSeleccionados] = useState<string[]>([]);
  const [tiposPagoSeleccionados, setTiposPagoSeleccionados] = useState<number[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [montoMin, setMontoMin] = useState<number | null>(null);
  const [montoMax, setMontoMax] = useState<number | null>(null);
  const [filtroEstadoVenta, setFiltroEstadoVenta] = useState<string>('');  // ✅ NUEVO: Filtro por estado de venta

  // ===== MODAL DE SALIDA (Impresión/Descarga) =====
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<Movimiento | null>(null);

  // ===== MODAL DE DETALLES DE VENTA =====
  const [isVentaModalOpen, setIsVentaModalOpen] = useState(false);
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Movimiento['venta'] | null>(null);

  const abrirModalImpresion = (movimiento: Movimiento) => {
    setMovimientoSeleccionado(movimiento);
    setIsOutputModalOpen(true);
  };

  const cerrarModalImpresion = () => {
    setIsOutputModalOpen(false);
    setMovimientoSeleccionado(null);
  };

  const abrirModalVenta = (venta: Movimiento['venta']) => {
    if (venta) {
      setVentaSeleccionada(venta);
      setIsVentaModalOpen(true);
    }
  };

  const cerrarModalVenta = () => {
    setIsVentaModalOpen(false);
    setVentaSeleccionada(null);
  };

  // Mapear tipo de operación a TipoDocumento
  const getTipoDocumento = (tipoOperacion: string): TipoDocumento => {
    const tipoMap: Record<string, TipoDocumento> = {
      'VENTA': 'movimiento',
      'PAGO': 'pago',
      'GASTO': 'movimiento',
      'AJUSTE': 'movimiento',
      'COMPRA': 'compra',
      'CREDITO': 'movimiento',
      'INGRESO': 'movimiento',
      'EGRESO': 'movimiento',
    };
    return tipoMap[tipoOperacion.toUpperCase()] || 'movimiento';
  };

  // ✅ NUEVO: Detectar discrepancias en movimientos de venta
  const tieneDiscrepancia = (mov: Movimiento): boolean => {
    // Solo revisar movimientos de tipo VENTA
    if (mov.tipo_operacion.codigo !== 'VENTA') return false;

    // Si no hay venta asociada, no hay discrepancia
    if (!mov.venta) return false;

    const montoMovimiento = Number(mov.monto);
    const totalVenta = Number(mov.venta.total ?? 0);
    const montoPagado = Number(mov.venta.monto_pagado ?? 0);

    // Discrepancia 1: El monto del movimiento no coincide con el total de la venta
    if (Math.abs(montoMovimiento - totalVenta) > 0.01) {
      return true;
    }

    // Discrepancia 2: El total no coincide con el monto pagado (hay pendiente no registrado)
    if (Math.abs(totalVenta - montoPagado) > 0.01) {
      return true;
    }

    return false;
  };

  // Badge para estado de venta
  const getEstadoVentaBadge = (mov: Movimiento) => {
    if (!mov.venta || !mov.venta.estado_documento) {
      return null;
    }

    const codigo = mov.venta.estado_documento.codigo?.toUpperCase();

    if (codigo === 'APROBADO' || codigo === 'APROBADA') {
      return (
        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700">
          ✅ {mov.venta.estado_documento.nombre}
        </Badge>
      );
    } else if (codigo === 'ANULADO' || codigo === 'ANULADA') {
      return (
        <Badge className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700">
          ❌ {mov.venta.estado_documento.nombre}
        </Badge>
      );
    }

    return (
      <Badge className="bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-700">
        ⚪ {mov.venta.estado_documento.nombre}
      </Badge>
    );
  };

  // ===== LÓGICA DE FILTRADO =====
  const movimientosFiltrados = useMemo(() => {
    return movimientos.filter((mov) => {
      // Filtro por tipo de operación
      if (tiposSeleccionados.length > 0) {
        if (!tiposSeleccionados.includes(mov.tipo_operacion.codigo)) {
          return false;
        }
      }

      // Filtro por tipo de pago
      if (tiposPagoSeleccionados.length > 0) {
        // Verificar tipo_pago_id del movimiento
        const tipoPagoDelMovimiento = mov.tipo_pago_id && tiposPagoSeleccionados.includes(mov.tipo_pago_id);

        // Verificar tipo_pago_id de la venta (para ventas a crédito sin detalles_pago_venta)
        const tipoPagoDelVenta = mov.venta?.tipo_pago_id && tiposPagoSeleccionados.includes(mov.venta.tipo_pago_id);

        // Verificar detalles de pago de la venta
        const tieneDetalleConTipoPago = mov.venta?.detallesPagoVenta?.some(detalle =>
          tiposPagoSeleccionados.includes(detalle.tipo_pago_id)
        );

        // Para CREDITO operations (tipo_operacion.codigo = 'CREDITO'), asumir tipo_pago = CREDITO por defecto
        const esCreditoImplicito = mov.tipo_operacion.codigo === 'CREDITO' && creditoTipoPagoId && tiposPagoSeleccionados.includes(creditoTipoPagoId);

        // Si no coincide en ningún lugar, excluir
        if (!tipoPagoDelMovimiento && !tipoPagoDelVenta && !tieneDetalleConTipoPago && !esCreditoImplicito) {
          return false;
        }
      }

      // ✅ NUEVO: Filtro por estado de venta
      if (filtroEstadoVenta) {
        if (!mov.venta || !mov.venta.estado_documento) {
          return false;
        }
        const codigo = mov.venta.estado_documento.codigo?.toUpperCase();
        if (filtroEstadoVenta === 'aprobadas' && codigo !== 'APROBADO' && codigo !== 'APROBADA') {
          return false;
        }
        if (filtroEstadoVenta === 'anuladas' && codigo !== 'ANULADO' && codigo !== 'ANULADA') {
          return false;
        }
      }

      // Filtro por búsqueda (documento)
      if (busqueda.trim()) {
        const searchLower = busqueda.toLowerCase();
        if (!mov.numero_documento.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filtro por rango de montos
      if (montoMin !== null && Math.abs(mov.monto) < montoMin) {
        return false;
      }
      if (montoMax !== null && Math.abs(mov.monto) > montoMax) {
        return false;
      }

      return true;
    });
  }, [movimientos, tiposSeleccionados, tiposPagoSeleccionados, busqueda, montoMin, montoMax, filtroEstadoVenta]);

  // ✅ DEBUG: Log de filtrado
  if (tiposPagoSeleccionados.length > 0 || tiposSeleccionados.length > 0) {
    console.log('🎯 [ReportesDiariosDetalle] FILTROS ACTIVOS:', {
      tiposSeleccionados,
      tiposPagoSeleccionados,
      creditoTipoPagoId,
      movimientosFiltrados_count: movimientosFiltrados.length,
      movimientosFiltrados: movimientosFiltrados,
    });
  }

  // ===== TOTALES FILTRADOS =====
  const totalIngresos = movimientosFiltrados
    .filter((m) => m.monto > 0)
    .reduce((sum, m) => sum + m.monto, 0);

  const totalEgresos = movimientosFiltrados
    .filter((m) => m.monto < 0)
    .reduce((sum, m) => sum + m.monto, 0);

  const totalNeto = totalIngresos + totalEgresos;

  const toggleTipo = (codigo: string) => {
    setTiposSeleccionados((prev) =>
      prev.includes(codigo) ? prev.filter((t) => t !== codigo) : [...prev, codigo]
    );
  };

  const toggleTipoPago = (id: number) => {
    setTiposPagoSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const limpiarFiltros = () => {
    setTiposSeleccionados([]);
    setTiposPagoSeleccionados([]);
    setBusqueda('');
    setMontoMin(null);
    setMontoMax(null);
    setFiltroEstadoVenta('');
  };

  const descargarFiltrado = () => {
    // Construir los parámetros de query
    const params = new URLSearchParams();

    if (tiposSeleccionados.length > 0) {
      params.append('tipos', tiposSeleccionados.join(','));
    }
    if (tiposPagoSeleccionados.length > 0) {
      params.append('tipos_pago', tiposPagoSeleccionados.join(','));
    }
    if (busqueda.trim()) {
      params.append('busqueda', busqueda.trim());
    }
    if (montoMin !== null) {
      params.append('monto_min', montoMin.toString());
    }
    if (montoMax !== null) {
      params.append('monto_max', montoMax.toString());
    }

    params.append('formato', 'A4');

    // Redirigir a la descarga
    window.location.href = `/cajas/admin/reportes-diarios/${cierre.id}/descargar-filtrado?${params.toString()}`;
  };

  const tieneFiltrantes = tiposSeleccionados.length > 0 || tiposPagoSeleccionados.length > 0 || busqueda.trim() || montoMin !== null || montoMax !== null || filtroEstadoVenta;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Cierre de Caja #${cierre.id}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.visit('/cajas/admin/reportes-diarios')}
              className="dark:hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Cierre de Caja #{cierre.id}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {cierre.caja.nombre}
              </p>
            </div>
          </div>

          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Apertura */}
            <Card className="p-6 dark:bg-slate-800 border dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Apertura
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Fecha/Hora
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                    {format(parseISO(cierre.fecha_apertura), 'dd/MM/yyyy HH:mm:ss', {
                      locale: es,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monto de Apertura
                  </p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
                    Bs. {Number(cierre.monto_apertura).toFixed(2)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Cierre */}
            <Card className="p-6 dark:bg-slate-800 border dark:border-slate-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Cierre
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Fecha/Hora
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                    {format(parseISO(cierre.fecha_cierre), 'dd/MM/yyyy HH:mm:ss', {
                      locale: es,
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Ejecutado por
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">
                    {cierre.usuario.name}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Resumen de Montos */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4 dark:bg-slate-800 border dark:border-slate-700 shadow-sm">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monto Esperado
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                Bs. {Number(cierre.monto_esperado).toFixed(2)}
              </p>
            </Card>

            <Card className="p-4 dark:bg-slate-800 border dark:border-slate-700 shadow-sm">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Monto Real
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                Bs. {Number(cierre.monto_real).toFixed(2)}
              </p>
            </Card>

            <Card className="p-4 dark:bg-slate-800 border dark:border-slate-700 shadow-sm">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Diferencia
              </p>
              <p
                className={`text-2xl font-bold mt-2 ${cierre.diferencia === 0
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-orange-600 dark:text-orange-400'
                  }`}
              >
                Bs. {Number(cierre.diferencia).toFixed(2)}
              </p>
            </Card>

            <Card className="p-4 dark:bg-slate-800 border dark:border-slate-700 shadow-sm">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Movimientos
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                {movimientosFiltrados.length}
              </p>
            </Card>
          </div>

          {/* Panel de Filtros Mejorado */}
          <Card className="p-6 dark:bg-slate-800 border dark:border-slate-700 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filtros Avanzados
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Mostrando{' '}
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {movimientosFiltrados.length}
                  </span>{' '}
                  de {movimientos.length} movimientos
                </p>
              </div>
              {(tiposSeleccionados.length > 0 || tiposPagoSeleccionados.length > 0 || busqueda || montoMin !== null || montoMax !== null || filtroEstadoVenta) && (
                <Button
                  onClick={limpiarFiltros}
                  size="sm"
                  variant="outline"
                  className="border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 dark:hover:bg-red-900/20 hover:bg-red-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Limpiar
                </Button>
              )}
            </div>

            {/* Tags de Filtros Activos */}
            {(tiposSeleccionados.length > 0 || tiposPagoSeleccionados.length > 0 || busqueda || montoMin !== null || montoMax !== null || filtroEstadoVenta) && (
              <div className="mb-6 pb-6 border-b dark:border-slate-700">
                <div className="flex flex-wrap gap-2">
                  {tiposSeleccionados.map((codigo) => {
                    const tipo = tipos_operacion.find((t) => t.codigo === codigo);
                    return (
                      <Badge
                        key={codigo}
                        className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-700 py-2 px-3 cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-900/50 transition"
                        onClick={() => toggleTipo(codigo)}
                      >
                        {tipo?.nombre}
                        <X className="ml-2 h-3 w-3" />
                      </Badge>
                    );
                  })}
                  {tiposPagoSeleccionados.map((id) => {
                    const tipoPago = tipos_pago.find((t) => t.id === id);
                    return (
                      <Badge
                        key={id}
                        className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700 py-2 px-3 cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                        onClick={() => toggleTipoPago(id)}
                      >
                        💳 {tipoPago?.nombre}
                        <X className="ml-2 h-3 w-3" />
                      </Badge>
                    );
                  })}
                  {busqueda && (
                    <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-300 dark:border-green-700 py-2 px-3 cursor-pointer hover:bg-green-200 dark:hover:bg-green-900/50 transition"
                      onClick={() => setBusqueda('')}
                    >
                      Documento: "{busqueda}"
                      <X className="ml-2 h-3 w-3" />
                    </Badge>
                  )}
                  {montoMin !== null && (
                    <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-700 py-2 px-3 cursor-pointer hover:bg-purple-200 dark:hover:bg-purple-900/50 transition"
                      onClick={() => setMontoMin(null)}
                    >
                      Min: Bs. {montoMin}
                      <X className="ml-2 h-3 w-3" />
                    </Badge>
                  )}
                  {montoMax !== null && (
                    <Badge className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-700 py-2 px-3 cursor-pointer hover:bg-orange-200 dark:hover:bg-orange-900/50 transition"
                      onClick={() => setMontoMax(null)}
                    >
                      Max: Bs. {montoMax}
                      <X className="ml-2 h-3 w-3" />
                    </Badge>
                  )}
                  {filtroEstadoVenta && (
                    <Badge
                      className={`py-2 px-3 cursor-pointer transition border ${
                        filtroEstadoVenta === 'aprobadas'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/50'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700 hover:bg-red-200 dark:hover:bg-red-900/50'
                      }`}
                      onClick={() => setFiltroEstadoVenta('')}
                    >
                      {filtroEstadoVenta === 'aprobadas' ? '✅ Aprobadas' : '❌ Anuladas'}
                      <X className="ml-2 h-3 w-3" />
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Búsqueda por documento */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-3 flex items-center gap-2">
                  <Search className="h-4 w-4 text-blue-500" />
                  Buscar por Documento
                </label>
                <input
                  type="text"
                  placeholder="Ej: FA-001, PC-123, NC-456..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition"
                />
              </div>

              {/* Filtro por tipo de operación */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                  Tipo de Operación
                </label>
                <div className="flex flex-wrap gap-2">
                  {tipos_operacion.map((tipo) => {
                    const isSelected = tiposSeleccionados.includes(tipo.codigo);
                    return (
                      <button
                        key={tipo.codigo}
                        onClick={() => toggleTipo(tipo.codigo)}
                        className={`px-3 py-1.5 rounded-full border transition text-xs font-medium whitespace-nowrap ${isSelected
                          ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-600 text-white'
                          : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-400'
                          }`}
                      >
                        {tipo.nombre}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Filtro por tipo de pago */}
              {tipos_pago.length > 0 && (
                <div>
                  <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
                    💳 Tipo de Pago
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {tipos_pago.map((tipo) => {
                      const isSelected = tiposPagoSeleccionados.includes(tipo.id);
                      return (
                        <button
                          key={tipo.id}
                          onClick={() => toggleTipoPago(tipo.id)}
                          className={`px-3 py-1.5 rounded-full border transition text-xs font-medium whitespace-nowrap ${isSelected
                            ? 'border-purple-500 dark:border-purple-400 bg-purple-500 dark:bg-purple-600 text-white'
                            : 'border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:border-purple-400 dark:hover:border-purple-400'
                            }`}
                        >
                          {tipo.nombre}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Filtro por estado de venta */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-3">
                  Estado de Venta
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setFiltroEstadoVenta('')}
                    className={`px-4 py-2 rounded-lg border-2 transition text-sm font-medium ${
                      !filtroEstadoVenta
                        ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                        : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'
                    }`}
                  >
                    📋 Todas
                  </button>
                  <button
                    onClick={() => setFiltroEstadoVenta('aprobadas')}
                    className={`px-4 py-2 rounded-lg border-2 transition text-sm font-medium ${
                      filtroEstadoVenta === 'aprobadas'
                        ? 'border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                        : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'
                    }`}
                  >
                    ✅ Aprobadas
                  </button>
                  <button
                    onClick={() => setFiltroEstadoVenta('anuladas')}
                    className={`px-4 py-2 rounded-lg border-2 transition text-sm font-medium ${
                      filtroEstadoVenta === 'anuladas'
                        ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                        : 'border-gray-200 dark:border-slate-600 bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-slate-500'
                    }`}
                  >
                    ❌ Anuladas
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Botones de Descarga */}
          {(tiposSeleccionados.length > 0 || tiposPagoSeleccionados.length > 0 || busqueda || montoMin !== null || montoMax !== null) && (
            <Card className="p-4 dark:bg-slate-800 border dark:border-slate-700">
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Botón de descarga filtrada - solo si hay filtros aplicados */}
                {(tiposSeleccionados.length > 0 || tiposPagoSeleccionados.length > 0 || busqueda || montoMin !== null || montoMax !== null) && (
                  <Button
                    onClick={descargarFiltrado}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white transition flex-1"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Filtrado ({movimientosFiltrados.length})
                  </Button>
                )}
                {/* Botón de descarga del cierre completo */}
                <Button
                  onClick={() => {
                    window.location.href = `/cajas/admin/reportes-diarios/${cierre.id}/descargar?formato=A4`;
                  }}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white transition flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar Completo ({movimientos.length})
                </Button>
              </div>
            </Card>
          )}

          {/* Totales Filtrados */}
          {(tiposSeleccionados.length > 0 || tiposPagoSeleccionados.length > 0 || busqueda || montoMin !== null || montoMax !== null || filtroEstadoVenta) && (
            <Card className="p-6 dark:bg-slate-800 border dark:border-slate-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <p className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide">Ingresos</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                    Bs. {totalIngresos.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <p className="text-xs font-medium text-red-700 dark:text-red-400 uppercase tracking-wide">Egresos</p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
                    Bs. {totalEgresos.toFixed(2)}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${totalNeto >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                  <p className={`text-xs font-medium uppercase tracking-wide ${totalNeto >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>Neto</p>
                  <p
                    className={`text-2xl font-bold mt-2 ${totalNeto >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                      }`}
                  >
                    Bs. {totalNeto.toFixed(2)}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs font-medium text-blue-700 dark:text-blue-400 uppercase tracking-wide">Movimientos</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                    {movimientosFiltrados.length}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                    {movimientosFiltrados.length === 1 ? 'movimiento' : 'movimientos'}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Tabla de Movimientos */}
          <Card className="dark:bg-slate-800 border dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-slate-700 dark:bg-slate-900">
                  <TableHead className="dark:text-gray-300 font-semibold">ID</TableHead>
                  <TableHead className="dark:text-gray-300 font-semibold">Fecha/Hora</TableHead>
                  <TableHead className="dark:text-gray-300 font-semibold">Usuario</TableHead>
                  <TableHead className="dark:text-gray-300 font-semibold">Tipo de Operación</TableHead>
                  <TableHead className="dark:text-gray-300 font-semibold">Documento</TableHead>
                  <TableHead className="dark:text-gray-300 font-semibold">Tipo de Pago</TableHead>
                  <TableHead className="dark:text-gray-300 font-semibold">Cliente</TableHead>
                  <TableHead className="text-right dark:text-gray-300 font-semibold">Monto</TableHead>
                  <TableHead className="text-right dark:text-gray-300 font-semibold">Total Venta</TableHead>
                  <TableHead className="text-right dark:text-gray-300 font-semibold">Monto Pagado</TableHead>
                  <TableHead className="text-right dark:text-gray-300 font-semibold">Monto Pendiente</TableHead>
                  <TableHead className="dark:text-gray-300 font-semibold">Detalles de Pago</TableHead>
                  <TableHead className="dark:text-gray-300 font-semibold">Estado Venta</TableHead>
                  <TableHead className="dark:text-gray-300 font-semibold">Observaciones</TableHead>
                  <TableHead className="text-center dark:text-gray-300 font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {movimientosFiltrados.length > 0 ? (
                  movimientosFiltrados.map((mov) => (
                    <TableRow
                      key={mov.id}
                      className={`dark:border-slate-700 transition-colors ${
                        tieneDiscrepancia(mov)
                          ? 'bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 border-l-4 border-l-red-500'
                          : 'dark:hover:bg-slate-700'
                      }`}
                    >
                      <TableCell className="dark:text-gray-300 text-sm">
                        {mov.id}
                      </TableCell>
                      <TableCell className="dark:text-gray-300 text-sm">
                        {format(parseISO(mov.fecha), 'dd/MM/yyyy HH:mm:ss', { locale: es })}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{mov.usuario.name}</TableCell>
                      <TableCell className="dark:text-gray-300">
                        <Badge
                          variant={mov.monto > 0 ? 'default' : 'secondary'}
                          className={
                            mov.monto > 0
                              ? 'bg-green-600 dark:bg-green-700 text-white'
                              : mov.monto < 0
                                ? 'bg-red-600 dark:bg-red-700 text-white'
                                : ''
                          }
                        >
                          {mov.tipo_operacion.nombre}
                        </Badge>
                      </TableCell>
                      <TableCell className="dark:text-gray-300 text-sm">
                        {mov.numero_documento}
                      </TableCell>
                      <TableCell className="dark:text-gray-300 text-sm">
                        {mov.tipo_pago ? (
                          <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700">
                            💳 {mov.tipo_pago.nombre}
                          </Badge>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="dark:text-gray-300 text-sm">
                        {mov.venta?.cliente?.nombre || '-'}
                      </TableCell>
                      <TableCell
                        className={`text-right font-semibold ${mov.monto > 0
                          ? 'text-green-600 dark:text-green-400'
                          : mov.monto < 0
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-gray-900 dark:text-white'
                          }`}
                      >
                        {mov.monto > 0 ? '+' : ''}
                        Bs. {Number(mov.monto).toFixed(2)}
                      </TableCell>
                      
                      {/* ✅ NUEVO: Total Venta */}
                      <TableCell className="text-right dark:text-gray-300 text-sm font-semibold">
                        {mov.venta?.total ? `Bs. ${Number(mov.venta.total).toFixed(2)}` : '-'}
                      </TableCell>
                      {/* ✅ NUEVO: Monto Pagado */}
                      <TableCell className="text-right dark:text-gray-300 text-sm font-semibold">
                        {mov.venta?.monto_pagado ? `Bs. ${Number(mov.venta.monto_pagado).toFixed(2)}` : '-'}
                      </TableCell>
                      {/* ✅ NUEVO: Monto Pendiente (desde BD) */}
                      <TableCell className="text-right dark:text-gray-300 text-sm font-semibold">
                        {mov.venta?.monto_pendiente !== undefined && mov.venta?.monto_pendiente !== null ? (
                          <span className={Number(mov.venta.monto_pendiente) > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}>
                            Bs. {Number(mov.venta.monto_pendiente).toFixed(2)}
                          </span>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="dark:text-gray-300 text-sm">
                        {mov.venta?.detallesPagoVenta && mov.venta.detallesPagoVenta.length > 0 ? (
                          <div className="space-y-1">
                            {mov.venta.detallesPagoVenta.map((detalle, idx) => (
                              <div key={idx} className="flex items-center gap-1">
                                <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs py-0 px-2">
                                  {detalle.tipoPago?.nombre || 'Sin tipo'}
                                </Badge>
                                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                                  Bs. {Number(detalle.monto).toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell className="dark:text-gray-300 text-sm">
                        {getEstadoVentaBadge(mov) || '-'}
                      </TableCell>
                      <TableCell className="dark:text-gray-300 text-sm max-w-xs truncate">
                        {mov.observaciones || '-'}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Botón de Ver Detalles de Venta */}
                          {mov.venta && (
                            <button
                              onClick={() => abrirModalVenta(mov.venta)}
                              className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 transition"
                              title="Ver detalles de venta"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          )}
                          {/* Botón de Imprimir */}
                          <button
                            onClick={() => abrirModalImpresion(mov)}
                            className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 transition"
                            title="Imprimir/Descargar movimiento"
                          >
                            <Printer className="h-4 w-4" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="dark:border-slate-700">
                    <TableCell colSpan={15} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No hay movimientos que coincidan con los filtros seleccionados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Botones de descarga */}
        </div>
      </div>

      {/* Modal de Salida/Impresión para cada movimiento */}
      {movimientoSeleccionado && (
        <OutputSelectionModal
          isOpen={isOutputModalOpen}
          onClose={cerrarModalImpresion}
          documentoId={movimientoSeleccionado.id}
          tipoDocumento={getTipoDocumento(movimientoSeleccionado.tipo_operacion.codigo)}
          documentoInfo={{
            numero: movimientoSeleccionado.numero_documento,
            fecha: format(parseISO(movimientoSeleccionado.fecha), 'dd/MM/yyyy HH:mm'),
            monto: movimientoSeleccionado.monto,
          }}
        />
      )}

      {/* Modal de Detalles de Venta */}
      <Dialog open={isVentaModalOpen} onOpenChange={cerrarModalVenta}>
        <DialogContent className="max-w-2xl dark:bg-slate-800 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="dark:text-white">Detalles de Venta</DialogTitle>
          </DialogHeader>

          {ventaSeleccionada && (
            <div className="space-y-6 py-4">
              {/* Información General */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Número de Venta</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                    {ventaSeleccionada.numero_documento}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Estado</p>
                  <p className="mt-1">
                    {getEstadoVentaBadge({
                      venta: ventaSeleccionada,
                      tipo_operacion: { codigo: 'VENTA', nombre: 'VENTA' },
                    } as Movimiento) || '-'}
                  </p>
                </div>
              </div>

              {/* Montos */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-slate-900/50 rounded-lg">
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Total</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mt-2">
                    Bs. {Number(ventaSeleccionada.total ?? 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Pagado</p>
                  <p className="text-xl font-bold text-green-600 dark:text-green-400 mt-2">
                    Bs. {Number(ventaSeleccionada.monto_pagado ?? 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">Pendiente</p>
                  <p className={`text-xl font-bold mt-2 ${Number(ventaSeleccionada.monto_pendiente ?? 0) > 0 ? 'text-orange-600 dark:text-orange-400' : 'text-green-600 dark:text-green-400'}`}>
                    Bs. {Number(ventaSeleccionada.monto_pendiente ?? 0).toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Detalles de Pago */}
              {ventaSeleccionada.detallesPagoVenta && ventaSeleccionada.detallesPagoVenta.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Desglose de Pagos</h3>
                  <div className="space-y-2">
                    {ventaSeleccionada.detallesPagoVenta.map((detalle, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-900/50 rounded">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {detalle.tipoPago?.nombre || 'Sin tipo'}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Bs. {Number(detalle.monto).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cliente */}
              {ventaSeleccionada.cliente && (
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Cliente</p>
                  <p className="text-gray-900 dark:text-white mt-1">
                    {ventaSeleccionada.cliente.nombre}
                  </p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
                <Button
                  onClick={cerrarModalVenta}
                  variant="outline"
                  className="dark:border-slate-600 dark:hover:bg-slate-700"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
