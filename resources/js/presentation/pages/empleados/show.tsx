// Presentation Layer: Empleados Show Page
// Refactored to use 3-layer architecture
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Edit2, ArrowLeft, User, Mail, Phone, MapPin, Briefcase, DollarSign, Calendar, Shield } from 'lucide-react';
import { empleadosService } from '@/infrastructure/services/empleados.service';
import { empleadosUseCase } from '@/application/use-cases/empleados.use-case';
import { router } from '@inertiajs/react';
import type { Empleado } from '@/domain/entities/empleados';

interface EmpleadosShowProps {
  empleado: Empleado;
}

export default function EmpleadosShow({ empleado }: EmpleadosShowProps) {
  // Calcular datos usando use cases
  const antiguedad = empleadosUseCase.calcularAntiguedad(empleado.fecha_ingreso);
  const salarioTotal = empleadosUseCase.calcularSalarioTotal(empleado);
  
  const breadcrumbs = [
    { title: 'Dashboard', href: '/' },
    { title: 'Empleados', href: empleadosService.indexUrl() },
    { title: String(empleado.nombre || empleado.codigo_empleado), href: '#' }
  ];

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'activo': return 'default';
      case 'inactivo': return 'secondary';
      case 'vacaciones': return 'outline';
      case 'licencia': return 'outline';
      case 'suspendido': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTipoContratoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'indefinido': return 'default';
      case 'temporal': return 'secondary';
      case 'practicante': return 'outline';
      case 'consultor': return 'outline';
      default: return 'secondary';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Detalles del Empleado</h1>
            <p className="text-muted-foreground">
              {empleado.codigo_empleado} - {empleado.cargo}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => router.get(empleadosService.indexUrl())}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Button onClick={() => router.get(empleadosService.editUrl(empleado.id))}>
              <Edit2 className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información Personal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Información Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Nombre Completo:</strong>
                <p>{empleado.nombre}</p>
              </div>
              
              <div>
                <strong>Cédula de Identidad:</strong>
                <p>{empleado.ci}</p>
              </div>
              
              {empleado.fecha_nacimiento && (
                <div>
                  <strong>Fecha de Nacimiento:</strong>
                  <p>{new Date(empleado.fecha_nacimiento).toLocaleDateString()}</p>
                </div>
              )}
              
              {empleado.telefono && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>{empleado.telefono}</span>
                </div>
              )}
              
              {empleado.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{empleado.email}</span>
                </div>
              )}
              
              {empleado.direccion && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1" />
                  <span>{empleado.direccion}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Información Laboral */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Información Laboral
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Código de Empleado:</strong>
                <p className="font-mono">{empleado.codigo_empleado}</p>
              </div>
              
              <div>
                <strong>Cargo:</strong>
                <p>{empleado.cargo}</p>
              </div>
              
              <div>
                <strong>Departamento:</strong>
                <p>{empleado.departamento}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <div>
                  <strong>Fecha de Ingreso:</strong>
                  <p>{new Date(empleado.fecha_ingreso).toLocaleDateString()}</p>
                  <p className="text-sm text-muted-foreground">
                    Antigüedad: {antiguedad.texto}
                  </p>
                </div>
              </div>
              
              <div>
                <strong>Tipo de Contrato:</strong>
                <div className="mt-1">
                  <Badge variant={getTipoContratoBadgeVariant(empleado.tipo_contrato)}>
                    {empleado.tipo_contrato.charAt(0).toUpperCase() + empleado.tipo_contrato.slice(1)}
                  </Badge>
                </div>
              </div>
              
              <div>
                <strong>Estado:</strong>
                <div className="mt-1">
                  <Badge variant={getEstadoBadgeVariant(empleado.estado)}>
                    {empleado.estado.charAt(0).toUpperCase() + empleado.estado.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Salarial */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Información Salarial
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Salario Base:</strong>
                <p className="text-lg font-semibold">
                  {new Intl.NumberFormat('es-BO', {
                    style: 'currency',
                    currency: 'BOB'
                  }).format(empleado.salario_base)}
                </p>
              </div>
              
              {empleado.bonos > 0 && (
                <div>
                  <strong>Bonos:</strong>
                  <p className="text-lg font-semibold">
                    {new Intl.NumberFormat('es-BO', {
                      style: 'currency',
                      currency: 'BOB'
                    }).format(empleado.bonos)}
                  </p>
                </div>
              )}
              
              <div className="border-t pt-2">
                <strong>Salario Total:</strong>
                <p className="text-xl font-bold text-green-600">
                  {new Intl.NumberFormat('es-BO', {
                    style: 'currency',
                    currency: 'BOB'
                  }).format(salarioTotal)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Información de Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Acceso al Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Puede acceder al sistema:</strong>
                <div className="mt-1">
                  <Badge variant={empleado.puede_acceder_sistema ? 'default' : 'secondary'}>
                    {empleado.puede_acceder_sistema ? 'Sí' : 'No'}
                  </Badge>
                </div>
              </div>
              
              {empleado.puede_acceder_sistema && empleado.usernick && (
                <div>
                  <strong>Usuario:</strong>
                  <p className="font-mono">{empleado.usernick}</p>
                </div>
              )}
              
              {empleado.supervisor_id && empleado.supervisor && (
                <div>
                  <strong>Supervisor:</strong>
                  <p>{empleado.supervisor.nombre}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Observaciones */}
        {empleado.observaciones && (
          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{empleado.observaciones}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}