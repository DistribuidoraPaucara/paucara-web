/**
 * Page: Cajas/Reportes
 *
 * Panel de reportes y análisis de cajas
 * Responsabilidades:
 * ✅ Reportes de discrepancias
 * ✅ Análisis de ingresos/egresos por período
 * ✅ Comparativas por usuario
 * ✅ Exportación de datos
 */

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  Download,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Filter,
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
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement);

interface Discrepancia {
  id: number;
  caja_id: number;
  usuario: string;
  fecha: string;
  monto_apertura: number;
  monto_cierre: number;
  diferencia: number;
  observaciones?: string;
}

interface DatosResumen {
  fecha: string;
  usuario: string;
  total_apertura: number;
  total_ingresos: number;
  total_egresos: number;
  diferencia_total: number;
}

interface Props {
  discrepancias: Discrepancia[];
  resumen_diario: DatosResumen[];
  estadisticas: {
    total_discrepancias: number;
    discrepancias_positivas: number;
    discrepancias_negativas: number;
    diferencia_total: number;
    promedio_discrepancia: number;
    usuario_con_mas_discrepancias: string;
  };
  fecha_inicio: string;
  fecha_fin: string;
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
  {
    title: 'Reportes',
    href: '/cajas/reportes',
  },
];

export default function Reportes({
  discrepancias,
  resumen_diario,
  estadisticas,
  fecha_inicio,
  fecha_fin,
}: Props) {
  const [filtroUsuario, setFiltroUsuario] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todas');

  const discrepanciasFiltradas = discrepancias.filter(
    (d) =>
      (filtroUsuario === '' ||
        d.usuario.toLowerCase().includes(filtroUsuario.toLowerCase())) &&
      (filtroTipo === 'todas' ||
        (filtroTipo === 'positivas' && d.diferencia > 0) ||
        (filtroTipo === 'negativas' && d.diferencia < 0))
  );

  const handleExportCSV = () => {
    // Generar CSV
    const headers = [
      'Fecha',
      'Usuario',
      'Caja',
      'Apertura',
      'Cierre',
      'Diferencia',
      'Observaciones',
    ];
    const rows = discrepanciasFiltradas.map((d) => [
      format(parseISO(d.fecha), 'dd/MM/yyyy'),
      d.usuario,
      d.caja_id,
      d.monto_apertura.toFixed(2),
      d.monto_cierre.toFixed(2),
      d.diferencia.toFixed(2),
      d.observaciones || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte-cajas-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reportes de Cajas" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reportes de Cajas
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Período: {format(parseISO(fecha_inicio), 'dd MMM yyyy', { locale: es })} -{' '}
              {format(parseISO(fecha_fin), 'dd MMM yyyy', { locale: es })}
            </p>
          </div>

          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Discrepancias
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {estadisticas.total_discrepancias}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Diferencia Total
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      estadisticas.diferencia_total > 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    ${Math.abs(estadisticas.diferencia_total).toFixed(2)}
                  </p>
                </div>
                {estadisticas.diferencia_total > 0 ? (
                  <TrendingUp className="h-8 w-8 text-green-500" />
                ) : (
                  <TrendingDown className="h-8 w-8 text-red-500" />
                )}
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Promedio Discrepancia
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${estadisticas.promedio_discrepancia.toFixed(2)}
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </Card>
          </div>

          {/* Gráficos de análisis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Gráfico: Distribución de discrepancias */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Distribución de Discrepancias
              </h3>
              <div className="flex justify-center">
                <Pie
                  data={{
                    labels: ['Positivas (Sobrante)', 'Negativas (Faltante)'],
                    datasets: [
                      {
                        label: 'Discrepancias',
                        data: [
                          estadisticas.discrepancias_positivas,
                          estadisticas.discrepancias_negativas,
                        ],
                        backgroundColor: ['#10b981', '#ef4444'],
                        borderColor: ['#059669', '#dc2626'],
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
                      },
                    },
                  }}
                  width={200}
                  height={200}
                />
              </div>
            </Card>

            {/* Gráfico: Comparación Positivas vs Negativas */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Comparativa por Tipo
              </h3>
              <Bar
                data={{
                  labels: ['Sobrante', 'Faltante'],
                  datasets: [
                    {
                      label: 'Cantidad',
                      data: [
                        estadisticas.discrepancias_positivas,
                        estadisticas.discrepancias_negativas,
                      ],
                      backgroundColor: ['#10b981', '#ef4444'],
                      borderColor: ['#059669', '#dc2626'],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                  indexAxis: 'x',
                  plugins: {
                    legend: {
                      position: 'bottom',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                    },
                  },
                }}
                height={200}
              />
            </Card>
          </div>

          {/* Desglose por tipo */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-2">
                Positivas (Sobrante)
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {estadisticas.discrepancias_positivas}
              </p>
            </Card>
            <Card className="p-4">
              <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                Negativas (Faltante)
              </p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {estadisticas.discrepancias_negativas}
              </p>
            </Card>
          </div>

          {/* Filtros y acciones */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </h3>
              <Button
                onClick={handleExportCSV}
                variant="outline"
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Descargar CSV
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Buscar usuario..."
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
              />

              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="todas">Todas las discrepancias</option>
                <option value="positivas">Solo positivas (Sobrante)</option>
                <option value="negativas">Solo negativas (Faltante)</option>
              </select>
            </div>
          </Card>

          {/* Tabla de discrepancias */}
          <Card>
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Discrepancias Registradas ({discrepanciasFiltradas.length})
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Monto Apertura</TableHead>
                  <TableHead>Monto Cierre</TableHead>
                  <TableHead>Diferencia</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Observaciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {discrepanciasFiltradas.length > 0 ? (
                  discrepanciasFiltradas.map((d) => (
                    <TableRow key={d.id}>
                      <TableCell className="font-medium">
                        {format(parseISO(d.fecha), 'dd MMM yyyy', {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell>{d.usuario}</TableCell>
                      <TableCell>${d.monto_apertura.toFixed(2)}</TableCell>
                      <TableCell>${d.monto_cierre.toFixed(2)}</TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            d.diferencia > 0
                              ? 'text-green-600 dark:text-green-400'
                              : d.diferencia < 0
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {d.diferencia > 0 ? '+' : ''}${d.diferencia.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            d.diferencia > 0 ? 'default' : 'destructive'
                          }
                        >
                          {d.diferencia > 0 ? 'Sobrante' : 'Faltante'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                        {d.observaciones || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500 dark:text-gray-400">
                      Sin discrepancias en el período seleccionado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          {/* Tabla resumen diario */}
          <Card>
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Resumen Diario por Usuario
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Apertura</TableHead>
                  <TableHead>Ingresos</TableHead>
                  <TableHead>Egresos</TableHead>
                  <TableHead>Diferencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resumen_diario.length > 0 ? (
                  resumen_diario.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        {format(parseISO(r.fecha), 'dd MMM yyyy', {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell>{r.usuario}</TableCell>
                      <TableCell>${r.total_apertura.toFixed(2)}</TableCell>
                      <TableCell className="text-green-600 dark:text-green-400">
                        ${r.total_ingresos.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-red-600 dark:text-red-400">
                        ${Math.abs(r.total_egresos).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`font-semibold ${
                            r.diferencia_total > 0
                              ? 'text-green-600 dark:text-green-400'
                              : r.diferencia_total < 0
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          ${r.diferencia_total.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-gray-500 dark:text-gray-400">
                      Sin datos en el período seleccionado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
