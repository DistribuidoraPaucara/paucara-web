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

interface Props {
  cajas: Caja[];
  aperturas_hoy: Apertura[];
  metricas: {
    total_cajas: number;
    cajas_abiertas: number;
    total_ingresos: number;
    total_egresos: number;
    diferencias_detectadas: number;
  };
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
}: Props) {
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

  // ✅ MEJORADO: Determinar estado de la caja (abierta/cerrada)
  // Nota: aperturas_hoy ahora incluye aperturas sin cierre de días anteriores
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

  // ✅ NUEVO: Obtener información de última actividad
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard de Cajas" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Gestión de Cajas
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Monitoreo en tiempo real de todas las cajas
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
                Reportes Diarios
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

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="p-4 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total de Cajas
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {metricas.total_cajas}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
            </Card>

            <Card className="p-4 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Abiertas Hoy
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {metricas.cajas_abiertas}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>
            </Card>

            <Card className="p-4 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Ingresos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${Number(metricas.total_ingresos).toFixed(2)}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>
            </Card>

            <Card className="p-4 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Egresos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${Math.abs(Number(metricas.total_egresos)).toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-red-500 dark:text-red-400" />
              </div>
            </Card>

            <Card className="p-4 dark:bg-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Discrepancias
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {metricas.diferencias_detectadas}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
              </div>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Gráfico: Estado de Cajas */}
            <Card className="p-6 dark:bg-slate-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Estado de Cajas
              </h3>
              <div className="flex justify-center">
                <Pie
                  data={{
                    labels: ['Abiertas', 'Cerradas'],
                    datasets: [
                      {
                        label: 'Cajas',
                        data: [Number(metricas.cajas_abiertas), Number(metricas.total_cajas) - Number(metricas.cajas_abiertas)],
                        backgroundColor: [colors.green, colors.red],
                        borderColor: [colors.greenDark, colors.redDark],
                        borderWidth: 2,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          color: colors.text,
                          font: { size: 12 },
                        },
                      },
                    },
                  }}
                  width={200}
                  height={200}
                />
              </div>
            </Card>

            {/* Gráfico: Ingresos vs Egresos */}
            <Card className="p-6 dark:bg-slate-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Ingresos vs Egresos
              </h3>
              <Bar
                data={{
                  labels: ['Hoy'],
                  datasets: [
                    {
                      label: 'Ingresos',
                      data: [Number(metricas.total_ingresos)],
                      backgroundColor: colors.green,
                    },
                    {
                      label: 'Egresos',
                      data: [Math.abs(Number(metricas.total_egresos))],
                      backgroundColor: colors.red,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  indexAxis: 'y',
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        color: colors.text,
                        font: { size: 12 },
                      },
                    },
                  },
                  scales: {
                    x: {
                      beginAtZero: true,
                      ticks: {
                        color: colors.textSecondary,
                      },
                      grid: {
                        color: colors.gridBorder,
                      },
                    },
                    y: {
                      ticks: {
                        color: colors.textSecondary,
                      },
                      grid: {
                        color: colors.gridBorder,
                      },
                    },
                  },
                }}
                height={200}
              />
            </Card>

            {/* Gráfico: Métrica de Discrepancias */}
            <Card className="p-6 dark:bg-slate-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Resumen del Día
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cajas Operativas</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {metricas.cajas_abiertas}/{metricas.total_cajas}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Neto del Día</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${(Number(metricas.total_ingresos) - Math.abs(Number(metricas.total_egresos))).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Discrepancias</p>
                  <p className={`text-2xl font-bold ${metricas.diferencias_detectadas > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                    {metricas.diferencias_detectadas}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Búsqueda y filtros */}
          <Card className="p-4 dark:bg-slate-800 border dark:border-slate-700">
            <div className="space-y-4">
              {/* Búsqueda */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  <Input
                    placeholder="Buscar por nombre, usuario o ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>
                <Button
                  onClick={() => setFiltrosVisibles(!filtrosVisibles)}
                  variant="outline"
                  className="dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
                >
                  {filtrosVisibles ? '🔼 Ocultar Filtros' : '🔽 Mostrar Filtros'}
                </Button>
              </div>

              {/* Filtros Avanzados */}
              {filtrosVisibles && (
                <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg space-y-4 border border-gray-200 dark:border-slate-700">
                  {/* Fila 1: Estado de Caja */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Estado de Caja
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={filtroEstado === 'todos' ? 'default' : 'outline'}
                        onClick={() => setFiltroEstado('todos')}
                        className={filtroEstado === 'todos' ? 'dark:bg-blue-700 dark:hover:bg-blue-800' : 'dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800'}
                      >
                        Todos
                      </Button>
                      <Button
                        size="sm"
                        variant={filtroEstado === 'abierta' ? 'default' : 'outline'}
                        onClick={() => setFiltroEstado('abierta')}
                        className={filtroEstado === 'abierta' ? 'dark:bg-green-700 dark:hover:bg-green-800' : 'dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800'}
                      >
                        🟢 Abierta
                      </Button>
                      <Button
                        size="sm"
                        variant={filtroEstado === 'cerrada' ? 'default' : 'outline'}
                        onClick={() => setFiltroEstado('cerrada')}
                        className={filtroEstado === 'cerrada' ? 'dark:bg-red-700 dark:hover:bg-red-800' : 'dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800'}
                      >
                        🔴 Cerrada
                      </Button>
                    </div>
                  </div>

                  {/* Fila 2: Estado del Cierre */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Estado del Cierre
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant={filtroEstadoCierre === 'todos' ? 'default' : 'outline'}
                        onClick={() => setFiltroEstadoCierre('todos')}
                        className={filtroEstadoCierre === 'todos' ? 'dark:bg-blue-700 dark:hover:bg-blue-800' : 'dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800'}
                      >
                        Todos
                      </Button>
                      <Button
                        size="sm"
                        variant={filtroEstadoCierre === 'pendiente' ? 'default' : 'outline'}
                        onClick={() => setFiltroEstadoCierre('pendiente')}
                        className={filtroEstadoCierre === 'pendiente' ? 'dark:bg-yellow-700 dark:hover:bg-yellow-800' : 'dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800'}
                      >
                        ⏳ Pendiente
                      </Button>
                      <Button
                        size="sm"
                        variant={filtroEstadoCierre === 'consolidada' ? 'default' : 'outline'}
                        onClick={() => setFiltroEstadoCierre('consolidada')}
                        className={filtroEstadoCierre === 'consolidada' ? 'dark:bg-green-700 dark:hover:bg-green-800' : 'dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800'}
                      >
                        ✅ Consolidada
                      </Button>
                      <Button
                        size="sm"
                        variant={filtroEstadoCierre === 'rechazada' ? 'default' : 'outline'}
                        onClick={() => setFiltroEstadoCierre('rechazada')}
                        className={filtroEstadoCierre === 'rechazada' ? 'dark:bg-red-700 dark:hover:bg-red-800' : 'dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800'}
                      >
                        ❌ Rechazada
                      </Button>
                    </div>
                  </div>

                  {/* Fila 3: Rango de Montos */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Rango de Montos
                    </p>
                    <div className="flex gap-2 flex-wrap items-center">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400">Min:</label>
                        <input
                          type="number"
                          placeholder="0"
                          value={montoMin}
                          onChange={(e) => setMontoMin(e.target.value)}
                          className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400">Max:</label>
                        <input
                          type="number"
                          placeholder="∞"
                          value={montoMax}
                          onChange={(e) => setMontoMax(e.target.value)}
                          className="w-24 px-2 py-1 rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                      </div>
                      {(montoMin || montoMax) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setMontoMin('');
                            setMontoMax('');
                          }}
                          className="text-xs dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                          Limpiar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Fila 4: Rango de Fechas */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                      Rango de Fechas
                    </p>
                    <div className="flex gap-2 flex-wrap items-center">
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400">Desde:</label>
                        <input
                          type="date"
                          value={fechaDesde}
                          onChange={(e) => setFechaDesde(e.target.value)}
                          className="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400">Hasta:</label>
                        <input
                          type="date"
                          value={fechaHasta}
                          onChange={(e) => setFechaHasta(e.target.value)}
                          className="px-2 py-1 rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                        />
                      </div>
                      {(fechaDesde || fechaHasta) && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setFechaDesde('');
                            setFechaHasta('');
                          }}
                          className="text-xs dark:text-gray-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        >
                          Limpiar
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Fila 5: Ordenamiento y Discrepancias */}
                  <div className="flex gap-4 flex-wrap items-end">
                    <div className="flex-1 min-w-[200px]">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Ordenar por
                      </p>
                      <select
                        value={ordenarPor}
                        onChange={(e) => setOrdenarPor(e.target.value as 'monto' | 'fecha' | 'usuario' | 'estado')}
                        className="w-full px-2 py-1 rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                      >
                        <option value="fecha">📅 Por Fecha (más reciente)</option>
                        <option value="monto">💰 Por Monto (mayor primero)</option>
                        <option value="usuario">👤 Por Usuario</option>
                        <option value="estado">📊 Por Estado</option>
                      </select>
                    </div>

                    <Button
                      size="sm"
                      variant={soloConDiscrepancias ? 'default' : 'outline'}
                      onClick={() => setSoloConDiscrepancias(!soloConDiscrepancias)}
                      className={soloConDiscrepancias ? 'dark:bg-orange-700 dark:hover:bg-orange-800' : 'dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800'}
                    >
                      ⚠️ Con Discrepancias
                    </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setFiltroEstado('todos');
                        setFiltroEstadoCierre('todos');
                        setMontoMin('');
                        setMontoMax('');
                        setFechaDesde('');
                        setFechaHasta('');
                        setOrdenarPor('fecha');
                        setSoloConDiscrepancias(false);
                        setSearch('');
                      }}
                      className="dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-800"
                    >
                      ↺ Limpiar Filtros
                    </Button>
                  </div>

                  {/* Resumen de Filtros */}
                  <div className="text-xs text-gray-600 dark:text-gray-400 pt-2 border-t border-gray-300 dark:border-slate-700">
                    ✅ Mostrando <strong className="dark:text-gray-300">{cajasFiltradas.length}</strong> de <strong className="dark:text-gray-300">{cajas.length}</strong> cajas
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Tabla de cajas */}
          <Card className="dark:bg-slate-800">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-slate-700">
                  <TableHead className="dark:text-gray-300">Caja</TableHead>
                  <TableHead className="dark:text-gray-300">Usuario</TableHead>
                  <TableHead className="dark:text-gray-300">Estado</TableHead>
                  <TableHead className="dark:text-gray-300">Monto Actual</TableHead>
                  <TableHead className="dark:text-gray-300">Última Actividad</TableHead>
                  <TableHead className="text-right dark:text-gray-300">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cajasFiltradas.length > 0 ? (
                  cajasFiltradas.map((caja) => {
                    const estado = obtenerEstadoCaja(caja.id);
                    const monto = obtenerMontoCaja(caja.id);
                    const apertura = aperturas_hoy.find(
                      (a) => a.caja_id === caja.id
                    );

                    return (
                      <TableRow key={caja.id} className="dark:border-slate-700 hover:dark:bg-slate-700">
                        <TableCell className="font-medium dark:text-white">
                          #{caja.id} | {caja.nombre}
                        </TableCell>
                        <TableCell className="dark:text-gray-300">{caja.usuario.name}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              estado === 'abierta' ? 'default' : 'secondary'
                            }
                            className="dark:bg-slate-700 text-white dark:text-gray-300"
                          >
                            {estado === 'abierta'
                              ? '🟢 Abierta'
                              : '🔴 Cerrada'}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold dark:text-white">
                          ${monto.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          {(() => {
                            const actividad = obtenerUltimaActividad(caja.id, caja.cierres_pendientes || 0);
                            const colorClasses = {
                              vacia: 'text-gray-500 dark:text-gray-400',
                              abierta: 'text-green-600 dark:text-green-400 font-medium',
                              'cerrada-pendiente': 'text-yellow-600 dark:text-yellow-400 font-medium',
                              cerrada: 'text-blue-600 dark:text-blue-400',
                            };
                            return (
                              <span className={`text-sm ${colorClasses[actividad.tipo as keyof typeof colorClasses]}`}>
                                {actividad.texto}
                              </span>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="dark:hover:bg-slate-600 dark:text-gray-300"
                            onClick={() => {
                              console.log('Navegando a caja del usuario:', caja.user_id);
                              router.visit(`/cajas/user/${caja.user_id}`);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow className="dark:border-slate-700">
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400">
                      No se encontraron cajas
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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
                                  ${caja.monto_esperado.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Real</p>
                                <p className="font-semibold text-gray-900 dark:text-white">
                                  ${caja.monto_real.toFixed(2)}
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-600 dark:text-gray-400">Diferencia</p>
                                <p className={`font-semibold ${caja.diferencia === 0 ? 'text-green-700 dark:text-green-300' : 'text-orange-700 dark:text-orange-300'}`}>
                                  ${caja.diferencia.toFixed(2)}
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
