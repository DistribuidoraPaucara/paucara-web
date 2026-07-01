// Pages: EstadosLogistica form page using generic components
import { useEffect, useState } from 'react';
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
  estado_anterior_id: null,
  es_estado_final: false,
  permite_edicion: true,
  requiere_aprobacion: false,
};

export default function EstadoLogisticaForm({ estadoLogistica }: EstadoLogisticaFormPageProps) {
  const isEditing = !!estadoLogistica;
  const [estadosOptions, setEstadosOptions] = useState<Array<{ value: number; label: string }>>([]);

  // Cargar opciones de estados para el campo estado_anterior_id
  const loadOptions = async (fieldKey: string) => {
    if (fieldKey === 'estado_anterior_id') {
      try {
        console.log('📦 Cargando opciones de estados...');
        // Usar el servicio para traer todos los estados
        const response = await fetch('/api/estados-logistica?per_page=100');
        const data = await response.json();

        if (data.data) {
          const options = data.data.map((estado: EstadoLogistica) => ({
            value: estado.id,
            label: `${estado.nombre} (${estado.codigo})`,
          }));

          setEstadosOptions(options);
          console.log('✅ Estados cargados:', options);
          return options;
        }
      } catch (error) {
        console.error('❌ Error cargando estados:', error);
      }
    }
    return [];
  };

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
      console.log('🔗 Estado Anterior ID:', estadoLogistica.estado_anterior_id);
      if (estadoLogistica.estadoAnterior) {
        console.log('🔗 Estado Anterior:', {
          id: estadoLogistica.estadoAnterior.id,
          nombre: estadoLogistica.estadoAnterior.nombre,
          codigo: estadoLogistica.estadoAnterior.codigo,
        });
      }
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
        loadOptions={loadOptions}
      />
    </AppLayout>
  );
}
