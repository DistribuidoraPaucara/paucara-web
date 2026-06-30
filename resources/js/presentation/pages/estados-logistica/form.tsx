// Pages: EstadosLogistica form page using generic components
import { useEffect } from 'react';
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

  useEffect(() => {
    if (isEditing && estadoLogistica) {
      console.group('📝 EstadoLogistica Form - Datos de edición');
      console.log('✏️ Modo: EDITAR');
      console.log('🆔 ID:', estadoLogistica.id);
      console.log('📋 Código:', estadoLogistica.codigo);
      console.log('📝 Nombre:', estadoLogistica.nombre);
      console.log('📂 Categoría:', estadoLogistica.categoria);
      console.log('🔢 Orden:', estadoLogistica.orden);
      console.log('📄 Descripción:', estadoLogistica.descripcion);
      console.log('✅ Activo:', estadoLogistica.activo);
      console.log('🏁 Estado Final:', estadoLogistica.es_estado_final);
      console.log('✏️ Permite Edición:', estadoLogistica.permite_edicion);
      console.log('👤 Requiere Aprobación:', estadoLogistica.requiere_aprobacion);
      console.log('🎨 Color:', estadoLogistica.color);
      console.log('🎭 Ícono:', estadoLogistica.icono);
      console.log('📦 Datos completos:', estadoLogistica);
      console.groupEnd();
    } else {
      console.log('✨ Modo: CREAR (sin datos previos)');
    }
  }, [estadoLogistica, isEditing]);

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
