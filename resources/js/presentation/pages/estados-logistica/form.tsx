// Pages: EstadosLogistica form page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { estadosLogisticaConfig } from '@/config/modules/estadosLogistica.config';
import estadosLogisticaService from '@/infrastructure/services/estadosLogistica.service';
import type { EstadoLogistica, EstadoLogisticaFormData } from '@/domain/entities/estadosLogistica';

interface EstadoLogisticaFormPageProps {
  estadoLogistica?: EstadoLogistica | null;
}

const initialEstadoLogisticaData: EstadoLogisticaFormData = {
  codigo: '',
  categoria: 'entrega',
  nombre: '',
  descripcion: '',
  orden: 0,
  activo: true,
  color: '#6366F1',
  icono: 'circle',
  es_estado_final: false,
  permite_edicion: true,
  requiere_aprobacion: false,
};

export default function EstadoLogisticaForm({ estadoLogistica }: EstadoLogisticaFormPageProps) {
  const isEditing = !!estadoLogistica;

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: estadosLogisticaService.indexUrl() },
      { title: 'Estados de Logística', href: estadosLogisticaService.indexUrl() },
      { title: isEditing ? 'Editar' : 'Nueva', href: '#' }
    ]}>
      <GenericFormContainer<EstadoLogistica, EstadoLogisticaFormData>
        entity={estadoLogistica}
        config={estadosLogisticaConfig}
        service={estadosLogisticaService}
        initialData={initialEstadoLogisticaData}
      />
    </AppLayout>
  );
}
