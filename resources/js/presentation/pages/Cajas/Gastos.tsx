/**
 * Page: Cajas/Gastos
 *
 * Gestión de gastos/cajas chicas de todos los usuarios
 * Responsabilidades:
 * ✅ Listado de gastos registrados
 * ✅ Filtros por usuario, categoría, fecha
 * ✅ Aprobación/rechazo de gastos
 * ✅ Estadísticas por categoría
 */

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  Search,
  Filter,
  Download,
  Trash2,
  CheckCircle,
  XCircle,
  DollarSign,
  TrendingDown,
  Package,
  AlertTriangle,
} from 'lucide-react';
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
import { Button } from '@/presentation/components/ui/button';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';

interface Gasto {
  id: number;
  user_id: number;
  usuario: string;
  monto: number;
  descripcion: string;
  categoria: string;
  numero_comprobante?: string;
  proveedor?: string;
  observaciones?: string;
  fecha: string;
  created_at: string;
}

interface EstadisticasCategoria {
  categoria: string;
  total: number;
  cantidad: number;
}

interface Props {
  gastos: {
    data: Gasto[];
    links: any;
    total: number;
  };
  estadisticas: {
    total_gastos: number;
    monto_total: number;
    promedio_gasto: number;
    categoria_mayor_gasto: string;
    gastos_por_categoria: EstadisticasCategoria[];
  };
  usuarios: Array<{
    id: number;
    name: string;
  }>;
  filtros: {
    usuario_id?: number;
    categoria?: string;
    fecha_inicio?: string;
    fecha_fin?: string;
    busqueda?: string;
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
  {
    title: 'Gastos',
    href: '/cajas/gastos',
  },
];

const CATEGORIAS = [
  { value: 'TRANSPORTE', label: '🚗 Transporte' },
  { value: 'LIMPIEZA', label: '🧹 Limpieza' },
  { value: 'MANTENIMIENTO', label: '🔧 Mantenimiento' },
  { value: 'SERVICIOS', label: '💼 Servicios' },
  { value: 'VARIOS', label: '📦 Varios' },
];

const getCategoriaColor = (categoria: string) => {
  const colors: { [key: string]: string } = {
    TRANSPORTE: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    LIMPIEZA: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    MANTENIMIENTO: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
    SERVICIOS: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    VARIOS: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200',
  };
  return colors[categoria] || 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
};

export default function Gastos({
  gastos,
  estadisticas,
  usuarios,
  filtros,
}: Props) {
  const [filtroUsuario, setFiltroUsuario] = useState(
    filtros.usuario_id?.toString() || ''
  );
  const [filtroCategoria, setFiltroCategoria] = useState(
    filtros.categoria || ''
  );
  const [filtroFechaInicio, setFiltroFechaInicio] = useState(
    filtros.fecha_inicio || ''
  );
  const [filtroFechaFin, setFiltroFechaFin] = useState(
    filtros.fecha_fin || ''
  );
  const [busqueda, setBusqueda] = useState(filtros.busqueda || '');

  // Modal states
  const [aprobarModal, setAprobarModal] = useState<{ open: boolean; id?: number }>({ open: false });
  const [rechazarModal, setRechazarModal] = useState<{ open: boolean; id?: number; motivo: string }>({ open: false, motivo: '' });
  const [eliminarModal, setEliminarModal] = useState<{ open: boolean; id?: number }>({ open: false });
  const [loading, setLoading] = useState(false);

  // Handlers for filter submission
  const handleApplyFilters = () => {
    const params = new URLSearchParams();
    if (filtroUsuario) params.append('usuario_id', filtroUsuario);
    if (filtroCategoria) params.append('categoria', filtroCategoria);
    if (filtroFechaInicio) params.append('fecha_inicio', filtroFechaInicio);
    if (filtroFechaFin) params.append('fecha_fin', filtroFechaFin);
    if (busqueda) params.append('busqueda', busqueda);

    router.get(`/cajas/gastos/admin?${params.toString()}`);
  };

  // Handlers for gasto actions
  const handleAprobar = (id: number) => {
    setLoading(true);
    router.post(`/cajas/gastos/${id}/aprobar`, {}, {
      onFinish: () => setLoading(false),
      onSuccess: () => {
        setAprobarModal({ open: false });
      },
    });
  };

  const handleRechazar = (id: number) => {
    if (!rechazarModal.motivo.trim()) {
      alert('Por favor ingresa un motivo de rechazo');
      return;
    }
    setLoading(true);
    router.post(`/cajas/gastos/${id}/rechazar`,
      { motivo: rechazarModal.motivo },
      {
        onFinish: () => setLoading(false),
        onSuccess: () => {
          setRechazarModal({ open: false, motivo: '' });
        },
      }
    );
  };

  const handleEliminar = (id: number) => {
    setLoading(true);
    router.delete(`/cajas/gastos/${id}`, {
      onFinish: () => setLoading(false),
      onSuccess: () => {
        setEliminarModal({ open: false });
      },
    });
  };

  const handleExportCSV = () => {
    const headers = [
      'Fecha',
      'Usuario',
      'Categoría',
      'Descripción',
      'Monto',
      'Comprobante',
      'Proveedor',
      'Observaciones',
    ];
    const rows = gastos.data.map((g) => [
      format(parseISO(g.fecha), 'dd/MM/yyyy'),
      g.usuario,
      g.categoria,
      g.descripcion,
      g.monto.toFixed(2),
      g.numero_comprobante || '',
      g.proveedor || '',
      g.observaciones || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `gastos-cajas-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Gestión de Gastos" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gestión de Gastos
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Cajas chicas y gastos operacionales
            </p>
          </div>

          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Gastos
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {estadisticas.total_gastos}
                  </p>
                </div>
                <Package className="h-8 w-8 text-blue-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monto Total
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    ${estadisticas.monto_total.toFixed(2)}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Promedio Gasto
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${estadisticas.promedio_gasto.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-gray-500" />
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Mayor Gasto
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {estadisticas.categoria_mayor_gasto}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Gastos por categoría */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {estadisticas.gastos_por_categoria.map((cat) => (
              <Card key={cat.categoria} className="p-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  {CATEGORIAS.find((c) => c.value === cat.categoria)?.label ||
                    cat.categoria}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${cat.total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {cat.cantidad} transacciones
                </p>
              </Card>
            ))}
          </div>

          {/* Filtros */}
          <Card className="p-4 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filtros
              </h3>
              <div className="flex gap-2">
                <Button
                  onClick={handleApplyFilters}
                  variant="default"
                  size="sm"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Aplicar Filtros
                </Button>
                <Button
                  onClick={handleExportCSV}
                  variant="outline"
                  size="sm"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Descargar CSV
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar descripción..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10"
                />
              </div>

              <select
                value={filtroUsuario}
                onChange={(e) => setFiltroUsuario(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos usuarios</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>

              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todas categorías</option>
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={filtroFechaInicio}
                onChange={(e) => setFiltroFechaInicio(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="date"
                value={filtroFechaFin}
                onChange={(e) => setFiltroFechaFin(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </Card>

          {/* Tabla de gastos */}
          <Card>
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Registros de Gastos ({gastos.data.length})
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Comprobante</TableHead>
                  <TableHead>Proveedor</TableHead>
                  <TableHead className="text-right">Monto</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gastos.data.length > 0 ? (
                  gastos.data.map((gasto) => (
                    <TableRow key={gasto.id}>
                      <TableCell className="font-medium dark:text-white">
                        {format(parseISO(gasto.fecha), 'dd MMM yyyy', {
                          locale: es,
                        })}
                      </TableCell>
                      <TableCell className="text-sm dark:text-gray-300">
                        {gasto.usuario}
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoriaColor(gasto.categoria)}>
                          {
                            CATEGORIAS.find(
                              (c) => c.value === gasto.categoria
                            )?.label
                          }
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm dark:text-gray-300">
                        {gasto.descripcion}
                      </TableCell>
                      <TableCell className="text-sm font-mono dark:text-gray-300">
                        {gasto.numero_comprobante || '-'}
                      </TableCell>
                      <TableCell className="text-sm dark:text-gray-300">
                        {gasto.proveedor || '-'}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-red-600 dark:text-red-400">
                        -${Math.abs(gasto.monto).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-600 hover:text-green-700"
                          title="Aprobar"
                          onClick={() => setAprobarModal({ open: true, id: gasto.id })}
                          disabled={loading}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-orange-600 hover:text-orange-700"
                          title="Rechazar"
                          onClick={() => setRechazarModal({ open: true, id: gasto.id, motivo: '' })}
                          disabled={loading}
                        >
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          title="Eliminar"
                          onClick={() => setEliminarModal({ open: true, id: gasto.id })}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-gray-500 dark:text-gray-400">
                      Sin gastos registrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>

      {/* Modal: Confirmar Aprobación */}
      <Dialog open={aprobarModal.open} onOpenChange={(open) => setAprobarModal({ ...aprobarModal, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-white">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Confirmar Aprobación
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              ¿Deseas aprobar este gasto? Esta acción registrará la aprobación del administrador.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAprobarModal({ open: false })}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => aprobarModal.id && handleAprobar(aprobarModal.id)}
              disabled={loading}
            >
              {loading ? 'Aprobando...' : 'Aprobar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar Rechazo */}
      <Dialog open={rechazarModal.open} onOpenChange={(open) => setRechazarModal({ ...rechazarModal, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-white">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Rechazar Gasto
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Ingresa el motivo del rechazo. El gasto será eliminado del registro.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              placeholder="Motivo del rechazo..."
              value={rechazarModal.motivo}
              onChange={(e) => setRechazarModal({ ...rechazarModal, motivo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              rows={4}
              disabled={loading}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRechazarModal({ open: false, motivo: '' })}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => rechazarModal.id && handleRechazar(rechazarModal.id)}
              disabled={loading || !rechazarModal.motivo.trim()}
            >
              {loading ? 'Rechazando...' : 'Rechazar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal: Confirmar Eliminación */}
      <Dialog open={eliminarModal.open} onOpenChange={(open) => setEliminarModal({ ...eliminarModal, open })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 dark:text-white">
              <Trash2 className="h-5 w-5 text-red-600" />
              Eliminar Gasto
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              ¿Deseas eliminar este gasto? Esta acción es irreversible y se eliminará del registro.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEliminarModal({ open: false })}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => eliminarModal.id && handleEliminar(eliminarModal.id)}
              disabled={loading}
            >
              {loading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
