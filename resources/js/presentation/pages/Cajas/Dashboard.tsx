/**
 * Page: Cajas/Dashboard
 *
 * Dashboard administrativo para gestión de cajas de todos los usuarios
 * Responsabilidades:
 * ✅ Mostrar estado de todas las cajas (abierta/cerrada)
 * ✅ Listado de usuarios y sus cajas
 * ✅ Últimos movimientos
 * ✅ Métricas diarias de cajas
 * ✅ Soporte completo para Dark Mode
 */

import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  Search,
  Eye,
  FileText,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Users,
  Lock,
  Loader2,
  CheckCircle2,
  XCircle,
  Download,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import { MetricasCard } from './components/MetricasCard';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

interface Caja {
  id: number;
  user_id: number;
  nombre: string;
  usuario: {
    id: number;
    name: string;
  };
  activa?: boolean;
  created_at?: string;
  updated_at?: string;
  cierres_pendientes?: number; // ✅ NUEVO: Cantidad de cierres pendientes
}

interface Apertura {
  id: number;
  caja_id: number;
  user_id: number;
  monto_apertura: number;
  ingresos: number;
  egresos: number;
  efectivo_esperado: number;
  fecha: string;
  created_at: string;
  cierre?: {
    id: number;
    monto_real: number;
    diferencia: number;
    fecha_cierre: string;
    estado?: string; // Estado del cierre (PENDIENTE, CONSOLIDADA, RECHAZADA)
    created_at?: string;
  } | null;
}

interface ResumenDiarioTotal {
  total_montos_apertura: number;
  total_ingresos: number;
  total_egresos: number;
  efectivo_esperado: number;
  turnos_count: number;
  turnos_abiertos: number;
  turnos_cerrados: number;
}

interface Props {
  cajas: Caja[];
  aperturas_hoy: Apertura[];
  metricas: {
    total_cajas: number;
    cajas_abiertas: number;
    total_ingresos: number;
    total_egresos: number;
    diferencias_detectadas: number;
    efectivo_esperado: number;
    montos_apertura: number;
  };
  resumen_diario_total?: ResumenDiarioTotal; // ✅ NUEVO (2026-08-07): Consolidado de todos los turnos
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Admin',
    href: '/admin/dashboard',
  },
  {
    title: 'Cajas',
    href: '/cajas',
  },
];

export default function Dashboard({
  cajas,
  aperturas_hoy,
  metricas,
  resumen_diario_total, // ✅ NUEVO (2026-08-07): Consolidado de todos los turnos
}: Props) {
  // ✅ NUEVO (2026-08-07): Logs para debug - ver datos del backend en consola
  console.log('🎯 [Dashboard] Props recibidas del backend:', {
    cajas,
    aperturas_hoy,
    metricas,
    resumen_diario_total,
  });

  console.log('📋 [Dashboard] Aperturas detalladas:', aperturas_hoy.map(apertura => ({
    id: apertura.id,
    caja_id: apertura.caja_id,
    user_id: apertura.user_id,
    monto_apertura: apertura.monto_apertura,
    ingresos: apertura.ingresos,
    egresos: apertura.egresos,
    efectivo_esperado: apertura.efectivo_esperado,
    fecha: apertura.fecha,
    created_at: apertura.created_at,
    cierre: apertura.cierre ? {
      id: apertura.cierre.id,
      monto_real: apertura.cierre.monto_real,
      diferencia: apertura.cierre.diferencia,
      fecha_cierre: apertura.cierre.fecha_cierre,
      estado: apertura.cierre.estado,
      created_at: apertura.cierre.created_at,
    } : null,
  })));

  console.log('💰 [Dashboard] Resumen diario total:', resumen_diario_total);
  console.log('🏪 [Dashboard] Cajas:', cajas);

  const [search, setSearch] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'abierta' | 'cerrada'>('todos');
  const [filtroEstadoCierre, setFiltroEstadoCierre] = useState<'todos' | 'pendiente' | 'consolidada' | 'rechazada'>('todos');
  const [soloConDiscrepancias, setSoloConDiscrepancias] = useState(false);
  const [montoMin, setMontoMin] = useState<string>('');
  const [montoMax, setMontoMax] = useState<string>('');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [ordenarPor, setOrdenarPor] = useState<'monto' | 'fecha' | 'usuario' | 'estado'>('fecha');
  const [filtrosVisibles, setFiltrosVisibles] = useState(false);

  // ✅ NUEVO: Estados para Cierre Diario General
  const [mostrarModalCierre, setMostrarModalCierre] = useState(false);
  const [cargandoCierre, setCargandoCierre] = useState(false);
  const [resultadoCierre, setResultadoCierre] = useState<any>(null);
  const [errorCierre, setErrorCierre] = useState<string | null>(null);
  const [mostrarReporte, setMostrarReporte] = useState(false);

  // ✅ NUEVO: Función para ejecutar cierre diario general (usando Inertia)
  const ejecutarCierreDiario = () => {
    setCargandoCierre(true);
    setErrorCierre(null);

    // Usar router.post que maneja CSRF automáticamente
    // Está configurado para que retorne JSON en lugar de redirigir
    router.post(
      '/cajas/admin/cierre-diario-json',
      {},
      {
        onSuccess: (page: any) => {
          // Extraer el reporte de la respuesta
          const props = (page as any)?.props;

          if (props?.reporte_cierre) {
            setResultadoCierre(props.reporte_cierre);
          } else if (props?.cierre_reporte) {
            setResultadoCierre(props.cierre_reporte);
          }

          setMostrarReporte(true);
          setMostrarModalCierre(false);

          // Recargar la página después de 3 segundos
          setTimeout(() => {
            router.reload();
          }, 3000);
        },
        onError: (errors: any) => {
          const errorMessage = errors?.cierre?.[0] || errors?.message || 'Error al ejecutar cierre diario';
          setErrorCierre(errorMessage);
        },
        onFinish: () => {
          setCargandoCierre(false);
        },
      }
    );
  };

  // ✅ NUEVO (2026-07-22): Cuando cambia filtroEstado, recargar datos desde backend
  useEffect(() => {
    if (filtroEstado !== 'todos') {
      router.get('/cajas/admin/dashboard', { estado: filtroEstado });
    }
  }, [filtroEstado]);

  // ✅ NUEVO: Detectar cambios de tema en tiempo real
  useEffect(() => {
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // ✅ NUEVO: Colores dinámicos basados en el tema
  const chartColors = {
    light: {
      text: '#111827',
      textSecondary: '#6b7280',
      green: '#10b981',
      greenDark: '#059669',
      red: '#ef4444',
      redDark: '#dc2626',
      blue: '#3b82f6',
      gridBorder: '#e5e7eb',
    },
    dark: {
      text: '#f3f4f6',
      textSecondary: '#9ca3af',
      green: '#34d399',
      greenDark: '#10b981',
      red: '#f87171',
      redDark: '#ef4444',
      blue: '#60a5fa',
      gridBorder: '#374151',
    },
  };

  const colors = isDark ? chartColors.dark : chartColors.light;

  // ✅ NUEVO: Definir funciones auxiliares ANTES de usarlas
  const obtenerEstadoCaja = (cajaId: number) => {
    const apertura = aperturas_hoy.find((a) => a.caja_id === cajaId);

    // Si no hay apertura registrada -> cerrada
    if (!apertura) {
      return 'cerrada';
    }

    // Si hay apertura Y tiene cierre registrado -> cerrada
    if (apertura.cierre) {
      return 'cerrada';
    }

    // Si hay apertura SIN cierre -> abierta (sin importar si es de hoy o días anteriores)
    return 'abierta';
  };

  const obtenerMontoCaja = (cajaId: number) => {
    const apertura = aperturas_hoy.find((a) => a.caja_id === cajaId);
    if (!apertura) return 0;
    if (apertura.cierre) return Number(apertura.cierre.monto_real) || 0;
    return Number(apertura.monto_apertura) || 0;
  };

  const obtenerUltimaActividad = (cajaId: number, cierresPendientes: number) => {
    const apertura = aperturas_hoy.find((a) => a.caja_id === cajaId);

    if (!apertura) {
      return {
        texto: 'Sin actividad',
        tipo: 'vacia'
      };
    }

    // Si hay caja abierta sin cerrar
    if (!apertura.cierre) {
      const horaApertura = new Date(apertura.fecha).toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return {
        texto: `⏱️ Abierta a las ${horaApertura}`,
        tipo: 'abierta'
      };
    }

    // Si hay cierre pero también cierres pendientes
    if (cierresPendientes > 0) {
      const horaCierre = new Date(apertura.cierre.created_at || apertura.fecha).toLocaleTimeString('es-BO', {
        hour: '2-digit',
        minute: '2-digit',
      });
      const estado = apertura.cierre.estado ? `[${apertura.cierre.estado}]` : '';
      return {
        texto: `🕐 Cerrada ${horaCierre} ${estado}`,
        tipo: 'cerrada-pendiente'
      };
    }

    // Si hay cierre sin pendientes
    const horaCierre = new Date(apertura.cierre.created_at || apertura.fecha).toLocaleTimeString('es-BO', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const estado = apertura.cierre.estado ? `[${apertura.cierre.estado}]` : '';
    return {
      texto: `✅ Cerrada ${horaCierre} ${estado}`,
      tipo: 'cerrada'
    };
  };

  // ✅ Filtrado completo con múltiples criterios
  let cajasFiltradas = cajas.filter((caja) => {
    // 1️⃣ Búsqueda por texto
    if (search) {
      const busqueda = search.toLowerCase();
      const coincide =
        caja.nombre.toLowerCase().includes(busqueda) ||
        caja.usuario.name.toLowerCase().includes(busqueda) ||
        caja.id.toString().includes(busqueda);
      if (!coincide) return false;
    }

    // 2️⃣ Filtro por estado de caja (abierta/cerrada)
    if (filtroEstado !== 'todos') {
      const estado = obtenerEstadoCaja(caja.id);
      if (estado !== filtroEstado) return false;
    }

    // 3️⃣ Filtro por estado del cierre (pendiente/consolidada/rechazada)
    if (filtroEstadoCierre !== 'todos') {
      const apertura = aperturas_hoy.find((a) => a.caja_id === caja.id);
      if (!apertura?.cierre) return false;

      const estadoCierre = apertura.cierre.estado?.toLowerCase() || 'sin-estado';
      if (estadoCierre !== filtroEstadoCierre) return false;
    }

    // 4️⃣ Solo cajas con discrepancias (diferencia != 0)
    if (soloConDiscrepancias) {
      const apertura = aperturas_hoy.find((a) => a.caja_id === caja.id);
      if (!apertura?.cierre || apertura.cierre.diferencia === 0) return false;
    }

    // 5️⃣ Filtro por rango de montos
    if (montoMin || montoMax) {
      const monto = obtenerMontoCaja(caja.id);
      const min = montoMin ? parseFloat(montoMin) : 0;
      const max = montoMax ? parseFloat(montoMax) : Infinity;
      if (!(monto >= min && monto <= max)) return false;
    }

    // 6️⃣ Filtro por rango de fechas
    if (fechaDesde || fechaHasta) {
      const apertura = aperturas_hoy.find((a) => a.caja_id === caja.id);
      if (!apertura) return false;

      const fechaApertura = new Date(apertura.fecha).toISOString().split('T')[0];
      const desde = fechaDesde ? fechaDesde : '1900-01-01';
      const hasta = fechaHasta ? fechaHasta : '2100-12-31';
      if (!(fechaApertura >= desde && fechaApertura <= hasta)) return false;
    }

    return true;
  });

  // 7️⃣ Ordenamiento
  cajasFiltradas = [...cajasFiltradas].sort((a, b) => {
    switch (ordenarPor) {
      case 'monto':
        return obtenerMontoCaja(b.id) - obtenerMontoCaja(a.id);
      case 'fecha': {
        const aApertura = aperturas_hoy.find((ap) => ap.caja_id === a.id);
        const bApertura = aperturas_hoy.find((ap) => ap.caja_id === b.id);
        const aFecha = aApertura ? new Date(aApertura.fecha).getTime() : 0;
        const bFecha = bApertura ? new Date(bApertura.fecha).getTime() : 0;
        return bFecha - aFecha;
      }
      case 'usuario':
        return a.usuario.name.localeCompare(b.usuario.name);
      case 'estado':
        return obtenerEstadoCaja(a.id).localeCompare(obtenerEstadoCaja(b.id));
      default:
        return 0;
    }
  });


  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard de Cajas" />

      <div className="py-2">
        <div className="sm:px-2 lg:px-2 space-y-2">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestión de Cajas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Monitoreo en tiempo real de todas las cajas y sus aperturas/cierres, con métricas y reportes diarios.
              </p>
            </div>
            {/* ✅ NUEVO: Botón de Cierre Diario General */}
            <div className="flex gap-2">
              <Button
                onClick={() => router.visit('/cajas/admin/reportes-diarios')}
                variant="outline"
                className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
              >
                <FileText className="mr-2 h-4 w-4" />
                Mostrar Todas las Aperturas y Cierres
              </Button>
              {/* <Button
                onClick={() => setMostrarModalCierre(true)}
                className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
              >
                <Lock className="mr-2 h-4 w-4" />
                Cierre Diario General
              </Button> */}
            </div>
          </div>

          {/* Métricas de Ingresos, Egresos y Efectivo Esperado */}
          {/* <MetricasCard metricas={metricas} /> */}

          {/* ✅ NUEVO (2026-08-07): Resumen Diario Consolidado (TODOS los turnos del día) */}
          {resumen_diario_total && (
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-2 border-blue-200 dark:border-blue-800">
              <div>
                <h3 className="text-lg font-bold text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  📊 Resumen Diario Consolidado
                  <Badge className="bg-blue-600 dark:bg-blue-700">{resumen_diario_total.turnos_count} turnos</Badge>
                </h3>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Consolidación de todos los turnos del día (abiertos + cerrados)
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total de Montos de Apertura */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                        Total Montos Apertura
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        Bs. {resumen_diario_total.total_montos_apertura.toLocaleString('es-BO', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="text-3xl">💰</div>
                  </div>
                </div>

                {/* Total de Ingresos */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase">
                        Total Ingresos
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                        +Bs. {resumen_diario_total.total_ingresos.toLocaleString('es-BO', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="text-3xl">📈</div>
                  </div>
                </div>

                {/* Total de Egresos */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase">
                        Total Egresos
                      </p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
                        -Bs. {resumen_diario_total.total_egresos.toLocaleString('es-BO', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="text-3xl">📉</div>
                  </div>
                </div>

                {/* Efectivo Esperado Total */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase">
                        Efectivo Esperado
                      </p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                        Bs. {resumen_diario_total.efectivo_esperado.toLocaleString('es-BO', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                    <div className="text-3xl">🎯</div>
                  </div>
                </div>
              </div>

              {/* Desglose de Turnos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Turnos Abiertos */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🟢</div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                        Turnos Abiertos
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {resumen_diario_total.turnos_abiertos}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Turnos Cerrados */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🔴</div>
                    <div>
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase">
                        Turnos Cerrados
                      </p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                        {resumen_diario_total.turnos_cerrados}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* ✅ NUEVO (2026-08-07): Tabla de Desglose de Turnos del Día */}
          <Card className="p-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              📋 Desglose de Turnos del Día
              <Badge className="bg-gray-600 dark:bg-gray-700">
                {aperturas_hoy.length} turnos
              </Badge>
            </h3>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700">
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-xs">ID Apertura</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold text-xs">ID Cierre</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Usuario</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Caja</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Apertura</TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">Cierre</TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-300 font-semibold">Monto Apertura</TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-300 font-semibold">Ingresos</TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-300 font-semibold">Egresos</TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-300 font-semibold">Esperado</TableHead>
                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">Estado</TableHead>
                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">Diferencia</TableHead>
                    <TableHead className="text-center text-gray-700 dark:text-gray-300 font-semibold">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aperturas_hoy.map((apertura) => {
                    const caja = cajas.find(c => c.id === apertura.caja_id);
                    const esCerrada = !!apertura.cierre;
                    const diferencia = esCerrada
                      ? (Number(apertura.cierre?.monto_real || 0) - Number(apertura.efectivo_esperado || 0))
                      : null;

                    // ✅ NUEVO (2026-08-07): Verificar si la apertura es antigua (abierta hace días)
                    const fechaApertura = new Date(apertura.fecha);
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    fechaApertura.setHours(0, 0, 0, 0);

                    const esAperturaAntigua = fechaApertura < hoy && !esCerrada;
                    const diasDesdeApertura = esCerrada
                      ? 0
                      : Math.floor((hoy.getTime() - fechaApertura.getTime()) / (1000 * 60 * 60 * 24));

                    return (
                      <TableRow
                        key={apertura.id}
                        className={`border-b border-gray-200 dark:border-slate-700 ${
                          esCerrada
                            ? 'bg-red-50 dark:bg-red-950/20'
                            : esAperturaAntigua
                            ? 'bg-yellow-50 dark:bg-yellow-950/20'  // ✅ Amarillo para cajas abiertas hace días
                            : 'bg-green-50 dark:bg-green-950/20'
                        } hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors`}
                      >
                        {/* ✅ NUEVO (2026-08-07): ID Apertura */}
                        <TableCell className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30">
                          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                            #{apertura.id}
                          </span>
                        </TableCell>

                        {/* ✅ NUEVO (2026-08-07): ID Cierre */}
                        <TableCell className="text-xs font-mono text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/30">
                          {esCerrada && apertura.cierre ? (
                            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded">
                              #{apertura.cierre.id}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>

                        {/* Usuario */}
                        <TableCell className="font-medium text-gray-900 dark:text-white">
                          {caja?.usuario?.name || 'N/A'}
                        </TableCell>

                        {/* Caja */}
                        <TableCell className="text-gray-700 dark:text-gray-300">
                          {caja?.nombre || `Caja ${apertura.caja_id}`}
                        </TableCell>

                        {/* Hora Apertura */}
                        <TableCell className={`text-sm ${esAperturaAntigua ? 'font-bold text-orange-600 dark:text-orange-400' : 'text-gray-600 dark:text-gray-400'}`}>
                          <div>
                            {new Date(apertura.fecha).toLocaleTimeString('es-BO', {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: false
                            })}
                          </div>
                          {esAperturaAntigua && (
                            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400">
                              ⚠️ Hace {diasDesdeApertura} día{diasDesdeApertura > 1 ? 's' : ''}
                            </div>
                          )}
                          {esAperturaAntigua && (
                            <div className="text-xs text-orange-500 dark:text-orange-300">
                              {new Date(apertura.fecha).toLocaleDateString('es-BO')}
                            </div>
                          )}
                        </TableCell>

                        {/* Hora Cierre */}
                        <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                          {esCerrada && apertura.cierre
                            ? new Date(apertura.cierre.fecha_cierre).toLocaleTimeString('es-BO', {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                              })
                            : '-'}
                        </TableCell>

                        {/* Monto Apertura */}
                        <TableCell className="text-right font-medium text-gray-900 dark:text-white">
                          Bs. {Number(apertura.monto_apertura).toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>

                        {/* Ingresos */}
                        <TableCell className="text-right text-green-600 dark:text-green-400 font-medium">
                          +Bs. {Number(apertura.ingresos).toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>

                        {/* Egresos */}
                        <TableCell className="text-right text-red-600 dark:text-red-400 font-medium">
                          -Bs. {Number(apertura.egresos).toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>

                        {/* Efectivo Esperado */}
                        <TableCell className="text-right font-bold text-blue-600 dark:text-blue-400">
                          Bs. {Number(apertura.efectivo_esperado).toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </TableCell>

                        {/* Estado */}
                        <TableCell className="text-center">
                          {esCerrada ? (
                            <Badge className={`
                              ${apertura.cierre?.estado === 'CONSOLIDADA'
                                ? 'bg-green-600 dark:bg-green-700'
                                : apertura.cierre?.estado === 'RECHAZADA'
                                ? 'bg-red-600 dark:bg-red-700'
                                : 'bg-yellow-600 dark:bg-yellow-700'}
                            `}>
                              {apertura.cierre?.estado || 'Cerrada'}
                            </Badge>
                          ) : (
                            <Badge className="bg-green-600 dark:bg-green-700">
                              🟢 Abierta
                            </Badge>
                          )}
                        </TableCell>

                        {/* Diferencia */}
                        <TableCell className="text-center">
                          {esCerrada && diferencia !== null ? (
                            <span className={`font-bold ${
                              Math.abs(diferencia) < 0.01
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {diferencia >= 0 ? '+' : ''}Bs. {diferencia.toLocaleString('es-BO', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>

                        {/* ✅ NUEVO (2026-08-07): Acciones - Ver detalles de caja/apertura */}
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="dark:hover:bg-slate-600 dark:text-gray-300"
                            title="Ver detalles de la caja"
                            onClick={() => {
                              console.log('Navegando a caja del usuario:', apertura.user_id);
                              router.visit(`/cajas/user/${apertura.user_id}`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {aperturas_hoy.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-lg font-medium">No hay turnos registrados hoy</p>
                  <p className="text-sm">Las aperturas de cajas aparecerán aquí</p>
                </div>
              )}
            </div>
          </Card>

          {/* ✅ NUEVO: Modal de Confirmación - Cierre Diario General */}
          <Dialog open={mostrarModalCierre} onOpenChange={setMostrarModalCierre}>
            <DialogContent className="dark:bg-slate-800 dark:border-slate-700">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                  🔒 Cierre Diario General
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  Esta operación cerrará y consolidará TODAS las cajas activas que tengan aperturas sin cierre.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Advertencia Importante
                  </p>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1 ml-6 list-disc">
                    <li>Se cerrarán <strong>TODAS</strong> las cajas activas con aperturas sin cierre</li>
                    <li>Incluye cajas abiertas desde días anteriores</li>
                    <li>Los cierres se consolidarán automáticamente sin intervención manual</li>
                    <li>Se registrará auditoría completa de esta operación</li>
                    <li>Esta acción es <strong>IRREVERSIBLE</strong></li>
                  </ul>
                </div>

                {errorCierre && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-sm font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
                      <XCircle className="h-4 w-4" />
                      Error
                    </p>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-2">{errorCierre}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setMostrarModalCierre(false);
                    setErrorCierre(null);
                  }}
                  disabled={cargandoCierre}
                  className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={ejecutarCierreDiario}
                  disabled={cargandoCierre}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white"
                >
                  {cargandoCierre ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Confirmar Cierre
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* ✅ NUEVO: Modal de Reporte - Resultados del Cierre */}
          {resultadoCierre && (
            <Dialog open={mostrarReporte} onOpenChange={setMostrarReporte}>
              <DialogContent className="dark:bg-slate-800 dark:border-slate-700 max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                    Cierre Diario General - Reporte
                  </DialogTitle>
                  <DialogDescription className="text-gray-600 dark:text-gray-400">
                    Operación completada exitosamente
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Información General */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                        Ejecutado Por
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                        {resultadoCierre.ejecutado_por}
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                      <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                        Fecha/Hora
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                        {new Date(resultadoCierre.fecha_ejecucion).toLocaleString('es-BO')}
                      </p>
                    </div>
                  </div>

                  {/* Métricas Principales */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase">Cajas Cerradas</p>
                      <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                        {resultadoCierre.total_cajas_cerradas}
                      </p>
                    </div>
                    <div className={`rounded-lg p-4 ${resultadoCierre.total_cajas_con_discrepancia > 0 ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' : 'bg-gray-50 dark:bg-gray-700'}`}>
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Con Discrepancias</p>
                      <p className={`text-3xl font-bold mt-2 ${resultadoCierre.total_cajas_con_discrepancia > 0 ? 'text-yellow-700 dark:text-yellow-300' : 'text-gray-700 dark:text-gray-300'}`}>
                        {resultadoCierre.total_cajas_con_discrepancia}
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Total Esperado</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                        ${resultadoCierre.total_monto_esperado.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4">
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Diferencia Total</p>
                      <p className={`text-2xl font-bold mt-2 ${resultadoCierre.total_diferencias === 0 ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
                        ${resultadoCierre.total_diferencias.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Cajas Procesadas */}
                  {resultadoCierre.cajas_procesadas.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">✅ Cajas Cerradas</h4>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {resultadoCierre.cajas_procesadas.map((caja: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 text-sm">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  Caja #{caja.caja_id} - {caja.caja_nombre}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-xs">
                                  Usuario: {caja.usuario}
                                </p>
                              </div>
                              <Badge className="bg-green-600 dark:bg-green-700">
                                {caja.estado}
                              </Badge>
                            </div>
                            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Esperado</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  Bs {caja.monto_esperado.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Real</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  Bs {caja.monto_real.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Diferencia</p>
                                <p className={`font-semibold ${caja.diferencia === 0 ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
                                  Bs {caja.diferencia.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Cajas Sin Apertura */}
                  {resultadoCierre.cajas_sin_apertura_abierta.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">📭 Cajas Sin Apertura Abierta</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {resultadoCierre.cajas_sin_apertura_abierta.map((caja: any, idx: number) => (
                          <div key={idx} className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 text-sm">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  Caja #{caja.caja_id} - {caja.caja_nombre}
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-xs">
                                  Usuario: {caja.usuario}
                                </p>
                              </div>
                              <Badge variant="secondary" className="dark:bg-slate-600">
                                Sin apertura
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Errores */}
                  {resultadoCierre.errores.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">❌ Errores</h4>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {resultadoCierre.errores.map((error: any, idx: number) => (
                          <div key={idx} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm">
                            <p className="font-semibold text-red-700 dark:text-red-300">
                              Caja #{error.caja_id} - {error.caja_nombre}
                            </p>
                            <p className="text-red-600 dark:text-red-400 text-xs mt-1">
                              {error.error}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2 sm:gap-2 flex-col sm:flex-row">
                  <Button
                    onClick={() => {
                      // Descarga PDF en formato A4
                      const cajaId = resultadoCierre.cajas_procesadas[0]?.caja_id || 1;
                      window.location.href = `/cajas/admin/reportes-diarios/${cajaId}/descargar?formato=A4`;
                    }}
                    variant="outline"
                    className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                  </Button>
                  <Button
                    onClick={() => {
                      setMostrarReporte(false);
                      setResultadoCierre(null);
                      // Navegar a la página de reportes diarios
                      router.visit('/cajas/admin/reportes-diarios');
                    }}
                    variant="outline"
                    className="dark:border-slate-600 dark:text-white dark:hover:bg-slate-700"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Ver Histórico
                  </Button>
                  <Button
                    onClick={() => {
                      setMostrarReporte(false);
                      setResultadoCierre(null);
                    }}
                    className="dark:text-white"
                  >
                    Cerrar
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
