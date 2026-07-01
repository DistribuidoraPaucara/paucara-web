// Pages: EstadosLogistica form page using generic components
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { estadosLogisticaConfig } from '@/config/modules/estadosLogistica.config';
import estadosLogisticaService from '@/infrastructure/services/estadosLogistica.service';
import type { EstadoLogistica, EstadoLogisticaFormData } from '@/domain/entities/estadosLogistica';

interface EstadoLogisticaFormPageProps {
  estadoLogistica?: EstadoLogistica | null;
  estadosLogistica?: EstadoLogistica[]; // Todos los estados para los selects
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
  estado_siguiente_id: null,
  es_estado_final: false,
  permite_edicion: true,
  requiere_aprobacion: false,
};

export default function EstadoLogisticaForm({ estadoLogistica, estadosLogistica = [] }: EstadoLogisticaFormPageProps) {
  const isEditing = !!estadoLogistica;

  // Convertir estados recibidos del servidor a opciones de select
  const estadosOptions = estadosLogistica.map((estado: EstadoLogistica) => ({
    value: estado.id,
    label: `${estado.nombre} (${estado.codigo})`,
  }));

  // Cargar opciones de estados para los campos estado_anterior_id y estado_siguiente_id
  // Usa datos del servidor en lugar de hacer llamadas a la API
  const loadOptions = async (fieldKey: string) => {
    if (fieldKey === 'estado_anterior_id' || fieldKey === 'estado_siguiente_id') {
      console.log(`📦 Usando opciones de estados del servidor para ${fieldKey}...`);
      console.log(`✅ Estados disponibles: ${estadosOptions.length}`);
      return estadosOptions;
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
      console.log('➡️ Estado Siguiente ID:', estadoLogistica.estado_siguiente_id);
      if (estadoLogistica.estadoSiguiente) {
        console.log('➡️ Estado Siguiente:', {
          id: estadoLogistica.estadoSiguiente.id,
          nombre: estadoLogistica.estadoSiguiente.nombre,
          codigo: estadoLogistica.estadoSiguiente.codigo,
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
