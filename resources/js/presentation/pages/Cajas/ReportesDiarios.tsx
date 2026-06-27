/**
 * Page: Cajas/ReportesDiarios
 *
 * Página de histórico de cierres diarios generales
 * Responsabilidades:
 * ✅ Mostrar listado de todos los cierres diarios realizados
 * ✅ Filtros por fecha, usuario, discrepancias
 * ✅ Ver detalles completos de cada cierre
 * ✅ Descargar PDF del resumen
 * ✅ Estadísticas históricas
 */

import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  Search,
  Eye,
  Download,
  Calendar,
  Users,
  TrendingDown,
  AlertCircle,
  Printer,
} from 'lucide-react';
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
import { Pagination } from '@/presentation/components/ui/pagination';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface CierreDiarioGeneral {
  id: number;
  apertura_caja_id: number;
  usuario_id: number;
  fecha_ejecucion: string;
  total_cajas_procesadas: number;
  total_cajas_cerradas: number;
  total_cajas_con_discrepancia: number;
  total_monto_esperado: number;
  total_monto_real: number;
  total_diferencias: number;
  usuario: {
    id: number;
    name: string;
  };
}

interface Usuario {
  id: number;
  name: string;
}

interface Filtros {
  busqueda?: string;
  desde?: string;
  hasta?: string;
  usuario_id?: string;
  solo_discrepancias?: boolean;
}

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Props {
  cierres: {
    data: CierreDiarioGeneral[];
    links: PaginationLink[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
  estadisticas: {
    total_cierres: number;
    total_cajas_cerradas: number;
    total_monto_procesado: number;
    cierres_con_discrepancias: number;
  };
  usuarios: Usuario[];
  filtros: Filtros;
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
    title: 'Reportes Diarios',
    href: '/cajas/admin/reportes-diarios',
  },
];

export default function ReportesDiarios({
  cierres,
  estadisticas,
  usuarios,
  filtros,
}: Props) {
  const [busqueda, setBusqueda] = useState(filtros.busqueda || '');
  const [desde, setDesde] = useState(filtros.desde || '');
  const [hasta, setHasta] = useState(filtros.hasta || '');
  const [usuarioId, setUsuarioId] = useState(filtros.usuario_id || '');
  const [soloDiscrepancias, setSoloDiscrepancias] = useState(filtros.solo_discrepancias || false);
  const [modalImpresionAbierto, setModalImpresionAbierto] = useState(false);
  const [cierreSeleccionado, setCierreSeleccionado] = useState<CierreDiarioGeneral | null>(null);

  const aplicarFiltros = () => {
    const params = new URLSearchParams();
    if (busqueda.trim()) params.append('busqueda', busqueda.trim());
    if (desde) params.append('desde', desde);
    if (hasta) params.append('hasta', hasta);
    if (usuarioId) params.append('usuario_id', usuarioId);
    if (soloDiscrepancias) params.append('solo_discrepancias', '1');

    router.get(`/cajas/admin/reportes-diarios?${params.toString()}`);
  };

  const limpiarFiltros = () => {
    setBusqueda('');
    setDesde('');
    setHasta('');
    setUsuarioId('');
    setSoloDiscrepancias(false);
    router.get('/cajas/admin/reportes-diarios');
  };

  const handlePageChange = (url: string) => {
    if (url) {
      // Mantener los filtros actuales al cambiar de página
      const params = new URLSearchParams();
      if (busqueda.trim()) params.append('busqueda', busqueda.trim());
      if (desde) params.append('desde', desde);
      if (hasta) params.append('hasta', hasta);
      if (usuarioId) params.append('usuario_id', usuarioId);
      if (soloDiscrepancias) params.append('solo_discrepancias', '1');

      const separator = url.includes('?') ? '&' : '?';
      router.get(`${url}${separator}${params.toString()}`);
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reportes Diarios de Cajas" />

      <div className="py-1">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Reportes de Cierres Diarios
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Histórico de todos los cierres diarios generales realizados
              </p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 dark:bg-slate-800 border dark:border-slate-700 shadow-sm dark:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Cierres
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {estadisticas.total_cierres}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
            </Card>

            <Card className="p-4 dark:bg-slate-800 border dark:border-slate-700 shadow-sm dark:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Cajas Cerradas
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-2">
                    {estadisticas.total_cajas_cerradas}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>
            </Card>

            <Card className="p-4 dark:bg-slate-800 border dark:border-slate-700 shadow-sm dark:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monto Procesado
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    Bs. {Number(estadisticas.total_monto_procesado).toFixed(2)}
                  </p>
                </div>
                {/* <TrendingDown className="h-8 w-8 text-purple-500 dark:text-purple-400" /> */}
              </div>
            </Card>

            <Card className="p-4 dark:bg-slate-800 border dark:border-slate-700 shadow-sm dark:shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Con Discrepancias
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-2">
                    {estadisticas.cierres_con_discrepancias}
                  </p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
              </div>
            </Card>
          </div>

          {/* Filtros */}
          <Card className="p-4 dark:bg-slate-800 border dark:border-slate-700">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filtros</h3>
              {/* Otros filtros */}
              <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-2">
                {/* Búsqueda general */}
                <div className="flex flex-col h-full">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    Buscar (ID, Apertura, Usuario)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 123 o #456 o Juan"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        aplicarFiltros();
                      }
                    }}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>

                <div className="flex flex-col h-full">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    Desde
                  </label>
                  <input
                    type="date"
                    value={desde}
                    onChange={(e) => setDesde(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>

                <div className="flex flex-col h-full">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    Hasta
                  </label>
                  <input
                    type="date"
                    value={hasta}
                    onChange={(e) => setHasta(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>

                <div className="flex flex-col h-full">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-2">
                    Usuario
                  </label>
                  <select
                    value={usuarioId}
                    onChange={(e) => setUsuarioId(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  >
                    <option value="">Todos</option>
                    {usuarios.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col h-full justify-end">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={soloDiscrepancias}
                      onChange={(e) => setSoloDiscrepancias(e.target.checked)}
                      className="rounded border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:accent-blue-500"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Solo cierres con discrepancias</span>
                  </label>
                </div>

                <div className="flex flex-col h-full justify-end gap-2">
                  <Button
                    onClick={aplicarFiltros}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white w-full"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </Button>
                  <Button
                    onClick={limpiarFiltros}
                    variant="outline"
                    className="dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700 w-full"
                  >
                    Limpiar
                  </Button>
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Busca en ID del cierre, ID de apertura o nombre de usuario
              </p>
            </div>
          </Card>

          {/* Tabla de cierres */}
          <Card className="dark:bg-slate-800 border dark:border-slate-700 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-slate-700 dark:bg-slate-900">
                  <TableHead className="dark:text-gray-300 font-semibold">Folio</TableHead>
                  <TableHead className="dark:text-gray-300 font-semibold">Apertura ID</TableHead>
                  <TableHead className="dark:text-gray-300 font-semibold">Fecha/Hora</TableHead>
                  <TableHead className="dark:text-gray-300 font-semibold">Ejecutado por</TableHead>
                  <TableHead className="dark:text-gray-300 text-right font-semibold">Cajas Cerradas</TableHead>
                  <TableHead className="dark:text-gray-300 text-right font-semibold">Con Discrepancias</TableHead>
                  <TableHead className="dark:text-gray-300 text-right font-semibold">Total Monto</TableHead>
                  <TableHead className="dark:text-gray-300 text-right font-semibold">Diferencia</TableHead>
                  <TableHead className="text-right dark:text-gray-300 font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cierres.data.length > 0 ? (
                  cierres.data.map((cierre) => (
                    <TableRow key={cierre.id} className="dark:border-slate-700 dark:hover:bg-slate-700 transition-colors">
                      <TableCell className="dark:text-gray-300 font-mono text-sm">
                        #{cierre.id}
                      </TableCell>
                      <TableCell className="dark:text-gray-300 font-mono text-sm">
                        <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300">
                          #{cierre.apertura_caja_id}
                        </Badge>
                      </TableCell>
                      <TableCell className="dark:text-gray-300">
                        {format(parseISO(cierre.fecha_ejecucion), 'dd/MM/yyyy HH:mm', { locale: es })}
                      </TableCell>
                      <TableCell className="dark:text-gray-300">{cierre.usuario.name}</TableCell>
                      <TableCell className="text-right dark:text-gray-300">
                        <Badge className="bg-green-600 dark:bg-green-700 dark:text-green-100">
                          {cierre.total_cajas_cerradas}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right dark:text-gray-300">
                        {cierre.total_cajas_con_discrepancia > 0 ? (
                          <Badge variant="destructive" className="dark:bg-red-900 dark:text-red-100">
                            {cierre.total_cajas_con_discrepancia}
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="dark:bg-slate-700 dark:text-gray-300">
                            0
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right dark:text-gray-300 font-semibold">
                        Bs. {Number(cierre.total_monto_real).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={`font-semibold ${cierre.total_diferencias === 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-orange-600 dark:text-orange-400'
                            }`}
                        >
                          {cierre.total_diferencias === 0
                            ? '✓ Bs. 0.00'
                            : `Bs. ${Number(cierre.total_diferencias).toFixed(2)}`}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2 flex justify-end">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.visit(`/cajas/admin/reportes-diarios/${cierre.id}`)}
                          className="dark:hover:bg-slate-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setCierreSeleccionado(cierre);
                            setModalImpresionAbierto(true);
                          }}
                          className="dark:hover:bg-slate-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            window.location.href = `/cajas/admin/reportes-diarios/${cierre.id}/descargar?formato=A4`;
                          }}
                          className="dark:hover:bg-slate-600 dark:text-gray-300 dark:hover:text-white transition-colors"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="dark:border-slate-700">
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No se encontraron cierres diarios
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            {/* Paginación */}
            <div className="p-4 border-t dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
              <Pagination
                links={cierres.links}
                onPageChange={handlePageChange}
                currentPage={cierres.current_page}
                totalPages={cierres.last_page}
                totalItems={cierres.total}
                itemsPerPage={cierres.per_page}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de impresión */}
      {cierreSeleccionado && (
        <OutputSelectionModal
          isOpen={modalImpresionAbierto}
          onClose={() => {
            setModalImpresionAbierto(false);
            setCierreSeleccionado(null);
          }}
          documentoId={cierreSeleccionado.apertura_caja_id}
          tipoDocumento="caja"
          printType="cierre"
          documentoInfo={{
            numero: `Cierre #${cierreSeleccionado.id}`,
            fecha: format(parseISO(cierreSeleccionado.fecha_ejecucion), 'dd/MM/yyyy HH:mm', { locale: es }),
          }}
        />
      )}
    </AppLayout>
  );
}
