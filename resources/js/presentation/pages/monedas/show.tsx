// Pages: Show moneda details
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Edit2, ArrowLeft } from 'lucide-react';
import monedasService from '@/infrastructure/services/monedas.service';
import { router } from '@inertiajs/react';
import type { Moneda } from '@/domain/entities/monedas';

interface ShowProps {
  moneda: Moneda;
}

export default function Show({ moneda }: ShowProps) {
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Monedas', href: monedasService.indexUrl() },
    { title: moneda.nombre, href: '#' }
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Detalles de Moneda</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.get(monedasService.indexUrl())}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button onClick={() => router.get(monedasService.editUrl(moneda.id))}>
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>{moneda.simbolo}</span>
              <span>{moneda.nombre}</span>
              {moneda.es_moneda_base && (
                <Badge variant="secondary">Moneda Base</Badge>
              )}
              <Badge variant={moneda.activo ? "default" : "secondary"}>
                {moneda.activo ? 'Activa' : 'Inactiva'}
              </Badge>
            </CardTitle>
            <CardDescription>
              Código ISO: {moneda.codigo}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-lg">{moneda.nombre}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Código ISO</label>
                  <p className="text-lg font-mono">{moneda.codigo}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Símbolo</label>
                  <p className="text-lg">{moneda.simbolo}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Tasa de Cambio</label>
                  <p className="text-lg">
                    {moneda.es_moneda_base
                      ? '1.000000 (Base)'
                      : moneda.tasa_cambio.toFixed(6)
                    }
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-lg">
                    {moneda.es_moneda_base ? 'Moneda Base' : 'Moneda Secundaria'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Estado</label>
                  <Badge variant={moneda.activo ? "default" : "secondary"}>
                    {moneda.activo ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
              </div>
            </div>

            {moneda.created_at && (
              <div className="mt-6 pt-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
                    <p>{new Date(moneda.created_at).toLocaleString('es-ES')}</p>
                  </div>
                  {moneda.updated_at && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Última Actualización</label>
                      <p>{new Date(moneda.updated_at).toLocaleString('es-ES')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
