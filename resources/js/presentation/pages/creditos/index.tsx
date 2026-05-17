/**
 * Página de Gestión de Créditos
 * Muestra resumen de crédito, cuentas pendientes e historial de pagos
 */

import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card } from '@/presentation/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import { Button } from '@/presentation/components/ui/button';
import { Skeleton } from '@/presentation/components/ui/skeleton';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import { router } from '@inertiajs/react';

// Import credit components
import { CreditoResumen } from '@/presentation/components/creditos/CreditoResumen';
import { CuentasPendientes } from '@/presentation/components/creditos/CuentasPendientes';
import { PagosHistorial } from '@/presentation/components/creditos/PagosHistorial';
import { AdminCreditoGestor } from '@/presentation/components/creditos/AdminCreditoGestor';

// Import services
import { creditoService } from '@/infrastructure/services/credito.service';
import NotificationService from '@/infrastructure/services/notification.service';

// Import types
import type { Credito, CuentaPorCobrar, Pago } from '@/domain/entities/credito';

interface User {
  cliente_id?: number;
  [key: string]: unknown;
}

interface Auth {
  user?: User;
  [key: string]: unknown;
}

interface CreditosPageProps {
  auth: Auth;
  clienteId?: number;
  titulo?: string;
}

interface PageProps {
  auth: Auth;
  clienteId?: number;
  [key: string]: unknown;
}

export default function CreditosPage() {
  const page = usePage<PageProps>();
  const { clienteId } = page.props as CreditosPageProps;
  const auth = page.props.auth;
  const user = auth?.user;

  // Determine if user is admin (no cliente_id) or a client (has cliente_id)
  const isAdmin = !user?.cliente_id;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [credito, setCredito] = useState<Credito | null>(null);
  const [cuentas, setCuentas] = useState<CuentaPorCobrar[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('resumen');

  // Load credit data on mount
  useEffect(() => {
    // Only load client credit data if user is not admin or has clienteId
    if (!isAdmin || clienteId) {
      cargarDatos();
    } else {
      setLoading(false);
    }
  }, [clienteId, isAdmin]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError(null);

      if (clienteId) {
        // Load specific client's credit
        const detalles = await creditoService.obtenerDetalles(clienteId);
        setCredito(detalles.credito);
        setCuentas(detalles.cuentas_por_cobrar);
        setPagos(detalles.pagos_recientes);
      } else if (!isAdmin) {
        // Load current user's credit (if applicable)
        // This would be implemented based on your backend API
        const response = await fetch('/api/creditos/mi-credito');
        if (response.ok) {
          const data = await response.json();
          setCredito(data.credito);
          setCuentas(data.cuentas_por_cobrar);
          setPagos(data.pagos_recientes);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar los datos de crédito';
      setError(message);
      NotificationService.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await cargarDatos();
    setRefreshing(false);
  };

  const handleExport = async () => {
    try {
      if (clienteId) {
        await creditoService.exportarReporte('pdf', {
          q: String(clienteId),
        });
      } else {
        await creditoService.exportarReporte('excel');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al exportar';
      NotificationService.error(message);
    }
  };

  const handleVerDetalles = () => {
    if (clienteId) {
      router.visit(`/clientes/${clienteId}/credito`);
    }
  };

  const handleRegistrarPago = () => {
    if (clienteId) {
      // Navigate to payment registration
      router.visit(`/clientes/${clienteId}/credito?tab=pagar`);
    }
  };

  if (loading && !isAdmin) {
    return (
      <AppLayout>
        <Head title="Créditos" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </AppLayout>
    );
  }

  // ADMIN VIEW: Show admin credit manager
  if (isAdmin && !clienteId) {
    return (
      <AppLayout>
        <Head title="Gestión de Créditos" />
        <div className="p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Gestión de Créditos</h1>
            <p className="text-gray-600 text-sm mt-2">Administra los límites de crédito de los clientes y monitorea el uso</p>
          </div>
          <AdminCreditoGestor />
        </div>
      </AppLayout>
    );
  }

  // CLIENT VIEW: Show client credit information
  return (
    <AppLayout>
      <Head title="Mi Crédito" />

      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Mi Crédito</h1>
              <p className="text-gray-600 text-sm">Gestiona tu límite de crédito y pagos</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualizar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            {clienteId && (
              <Button
                size="sm"
                onClick={handleRegistrarPago}
              >
                Registrar Pago
              </Button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Card className="bg-red-50 border-red-200 p-4">
            <p className="text-red-700 text-sm">{error}</p>
          </Card>
        )}

        {/* No Data State */}
        {!credito && !loading && (
          <Card className="p-8 text-center">
            <p className="text-gray-600 mb-4">No hay información de crédito disponible</p>
            <Button onClick={cargarDatos}>Intentar de Nuevo</Button>
          </Card>
        )}

        {/* Credit Data */}
        {credito && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="resumen">Resumen</TabsTrigger>
              <TabsTrigger value="pendientes">
                Pendientes
                {cuentas.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                    {cuentas.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="pagos">
                Historial de Pagos
                {pagos.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                    {pagos.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Tab: Resumen */}
            <TabsContent value="resumen" className="space-y-4">
              <CreditoResumen
                credito={credito}
                onVerDetalles={handleVerDetalles}
              />
            </TabsContent>

            {/* Tab: Cuentas Pendientes */}
            <TabsContent value="pendientes" className="space-y-4">
              <CuentasPendientes
                cuentas={cuentas}
                loading={loading}
                emptyMessage="No hay cuentas pendientes por cobrar"
              />
            </TabsContent>

            {/* Tab: Historial de Pagos */}
            <TabsContent value="pagos" className="space-y-4">
              <PagosHistorial
                pagos={pagos}
                loading={loading}
                emptyMessage="No hay historial de pagos"
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
}
