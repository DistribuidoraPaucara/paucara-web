/**
 * Page: Cajas/Detalle
 *
 * Página de detalle de una caja específica
 * Responsabilidades:
 * ✅ Mostrar información detallada de una caja
 * ✅ Histórico de aperturas/cierres
 * ✅ Movimientos del día seleccionado
 * ✅ Gráficos de evolución
 */

import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  TrendingDown,
  TrendingUp,
  AlertCircle,
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
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface MovimientoCaja {
  id: number;
  caja_id: number;
  monto: number;
  descripcion: string;
  fecha: string;
  tipoOperacion?: {
    codigo: string;
    nombre: string;
  };
  usuario?: {
    name: string;
  };
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
    montos_cierre: number;
    diferencia: number;
    fecha_cierre: string;
    observaciones?: string;
  } | null;
  movimientos?: MovimientoCaja[];
}

interface Caja {
  id: number;
  user_id: number;
  nombre: string;
  usuario: {
    id: number;
    name: string;
  };
  activa: boolean;
  created_at: string;
}

interface Props {
  caja: Caja;
  aperturas: Apertura[];
  movimientosHoy?: MovimientoCaja[];
}

export default function Detalle({ caja, aperturas, movimientosHoy = [] }: Props) {
  const [filtroFecha, setFiltroFecha] = useState(
    format(new Date(), 'yyyy-MM-dd')
  );

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
      title: caja.nombre,
      href: `/cajas/${caja.id}`,
    },
  ];

  const aperturaSeleccionada = aperturas.find(
    (a) =>
      format(parseISO(a.fecha), 'yyyy-MM-dd') === filtroFecha
  );

  const totalIngresos = movimientosHoy
    .filter((m) => m.monto > 0)
    .reduce((acc, m) => acc + m.monto, 0);

  const totalEgresos = Math.abs(
    movimientosHoy
      .filter((m) => m.monto < 0)
      .reduce((acc, m) => acc + m.monto, 0)
  );

  const saldoEsperado =
    (Number(aperturaSeleccionada?.monto_apertura) || 0) + totalIngresos - totalEgresos;

  const diferencia = aperturaSeleccionada?.cierre
    ? Number(aperturaSeleccionada.cierre.diferencia) || 0
    : 0;

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Caja: ${caja.nombre}`} />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          {/* Header con botón volver */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.visit('/cajas')}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {caja.nombre}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Usuario: <span className="font-medium">{caja.usuario.name}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Selector de fecha */}
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <Calendar className="h-5 w-5 text-gray-400 dark:text-gray-600" />
              <input
                type="date"
                value={filtroFecha}
                onChange={(e) => setFiltroFecha(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </Card>

          {/* Información del día seleccionado */}
          {aperturaSeleccionada ? (
            <>
              {/* Tarjetas de resumen */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Apertura
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${(Number(aperturaSeleccionada.monto_apertura) || 0).toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-blue-500" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Ingresos
                      </p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ${(Number(totalIngresos) || 0).toFixed(2)}
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Egresos
                      </p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                        ${(Number(totalEgresos) || 0).toFixed(2)}
                      </p>
                    </div>
                    <TrendingDown className="h-8 w-8 text-red-500" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Saldo Esperado
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${(Number(saldoEsperado) || 0).toFixed(2)}
                      </p>
                    </div>
                    <DollarSign className="h-8 w-8 text-gray-500" />
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Diferencia
                      </p>
                      <p
                        className={`text-2xl font-bold ${
                          diferencia === 0
                            ? 'text-green-600 dark:text-green-400'
                            : diferencia > 0
                            ? 'text-blue-600 dark:text-blue-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        ${diferencia.toFixed(2)}
                      </p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-gray-500" />
                  </div>
                </Card>
              </div>

              {/* Estado del cierre */}
              {aperturaSeleccionada.cierre && (
                <Card className="p-4 bg-green-50 dark:bg-green-900 border-l-4 border-green-500">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-green-900 dark:text-green-200">
                        Caja Cerrada
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                        Cierre realizado a las{' '}
                        {format(
                          parseISO(aperturaSeleccionada.cierre.fecha_cierre),
                          'HH:mm:ss'
                        )}
                      </p>
                      {aperturaSeleccionada.cierre.observaciones && (
                        <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                          Observaciones:{' '}
                          {aperturaSeleccionada.cierre.observaciones}
                        </p>
                      )}
                    </div>
                    <Badge className="bg-green-600">Cerrada</Badge>
                  </div>
                </Card>
              )}

              {/* Tabla de movimientos */}
              <Card>
                <div className="p-4 border-b dark:border-gray-700">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    Movimientos del Día
                  </h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hora</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead className="text-right">Monto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movimientosHoy.length > 0 ? (
                      movimientosHoy.map((mov) => (
                        <TableRow key={mov.id}>
                          <TableCell className="text-sm dark:text-gray-300">
                            {format(parseISO(mov.fecha), 'HH:mm:ss')}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {mov.tipoOperacion?.nombre ||
                                mov.tipoOperacion?.codigo}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm dark:text-gray-300">
                            {mov.descripcion}
                          </TableCell>
                          <TableCell className="text-sm dark:text-gray-300">
                            {mov.usuario?.name || 'Sistema'}
                          </TableCell>
                          <TableCell
                            className={`text-right font-semibold ${
                              mov.monto > 0
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {mov.monto > 0 ? '+' : ''}${mov.monto.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center py-4 text-gray-500 dark:text-gray-400"
                        >
                          Sin movimientos en este día
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No hay apertura de caja para la fecha seleccionada
              </p>
            </Card>
          )}

          {/* Histórico de aperturas/cierres */}
          <Card>
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Histórico de Aperturas/Cierres
              </h3>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto Apertura</TableHead>
                  <TableHead>Monto Cierre</TableHead>
                  <TableHead>Diferencia</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {aperturas.map((apertura) => (
                  <TableRow key={apertura.id}>
                    <TableCell className="font-medium dark:text-gray-300">
                      {format(
                        parseISO(apertura.fecha),
                        'dd MMM yyyy',
                        { locale: es }
                      )}
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      ${(Number(apertura.monto_apertura) || 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="dark:text-gray-300">
                      {apertura.cierre
                        ? `$${(Number(apertura.cierre.monto_real) || 0).toFixed(2)}`
                        : '-'}
                    </TableCell>
                    <TableCell>
                      {apertura.cierre ? (
                        <span
                          className={
                            apertura.cierre.diferencia === 0
                              ? 'text-green-600 dark:text-green-400 font-semibold'
                              : apertura.cierre.diferencia > 0
                              ? 'text-blue-600 dark:text-blue-400 font-semibold'
                              : 'text-red-600 dark:text-red-400 font-semibold'
                          }
                        >
                          ${(Number(apertura.cierre.diferencia) || 0).toFixed(2)}
                        </span>
                      ) : (
                        <span className="dark:text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          apertura.cierre ? 'secondary' : 'default'
                        }
                      >
                        {apertura.cierre ? '✓ Cerrada' : 'Abierta'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}
