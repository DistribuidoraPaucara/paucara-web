// Pages: EstadosDocumento form page using generic components
import { useEffect, useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import GenericFormContainer from '@/presentation/components/generic/generic-form-container';
import { estadosDocumentoConfig } from '@/config/modules/estadosDocumento.config';
import estadosDocumentoService from '@/infrastructure/services/estadosDocumento.service';
import type { EstadoDocumento, EstadoDocumentoFormData } from '@/domain/entities/estadosDocumento';

interface EstadoDocumentoFormPageProps {
  estadoDocumento?: EstadoDocumento | null;
  estadosDocumento?: EstadoDocumento[]; // Todos los estados para los selects
}

const initialEstadoDocumentoData: EstadoDocumentoFormData = {
  codigo: '',
  nombre: '',
  descripcion: '',
  activo: true,
  permite_edicion: true,
  permite_anulacion: false,
  color: '#6366F1',
  icono: 'circle',
  estado_anterior_id: null,
  estado_siguiente_id: null,
  es_estado_final: false,
};

export default function EstadoDocumentoForm({ estadoDocumento, estadosDocumento = [] }: EstadoDocumentoFormPageProps) {
  const isEditing = !!estadoDocumento;

  // Convertir estados recibidos del servidor a opciones de select
  // Incluir nombre para identificar estados
  const estadosOptions = estadosDocumento.map((estado: EstadoDocumento) => ({
    value: estado.id,
    label: `${estado.nombre} (${estado.codigo})`,
  }));

  // Cargar opciones de estados para los campos estado_anterior_id y estado_siguiente_id
  // Usa datos del servidor en lugar de hacer llamadas a la API
  const loadOptions = async (fieldKey: string) => {
    if (fieldKey === 'estado_anterior_id' || fieldKey === 'estado_siguiente_id') {
      console.log(`📦 Usando opciones de estados del servidor para ${fieldKey}...`);
      console.log(`✅ Estados disponibles: ${estadosOptions.length}`, estadosOptions);
      return estadosOptions;
    }
    return [];
  };

  useEffect(() => {
    if (isEditing && estadoDocumento) {
      console.group('📝 EstadoDocumento Form - Datos de edición');
      console.log('✏️ Modo: EDITAR');
      console.log('🆔 ID:', estadoDocumento.id);
      console.log('📋 Código:', estadoDocumento.codigo);
      console.log('📝 Nombre:', estadoDocumento.nombre);
      console.log('📄 Descripción:', estadoDocumento.descripcion);
      console.log('✅ Activo:', estadoDocumento.activo);
      console.log('✏️ Permite Edición:', estadoDocumento.permite_edicion);
      console.log('❌ Permite Anulación:', estadoDocumento.permite_anulacion);
      console.log('🏁 Estado Final:', estadoDocumento.es_estado_final);
      console.log('🎨 Color:', estadoDocumento.color);
      console.log('🎭 Ícono:', estadoDocumento.icono);
      console.log('🔗 Estado Anterior ID:', estadoDocumento.estado_anterior_id);
      if (estadoDocumento.estadoAnterior) {
        console.log('🔗 Estado Anterior:', {
          id: estadoDocumento.estadoAnterior.id,
          nombre: estadoDocumento.estadoAnterior.nombre,
          codigo: estadoDocumento.estadoAnterior.codigo,
        });
      }
      console.log('➡️ Estado Siguiente ID:', estadoDocumento.estado_siguiente_id);
      if (estadoDocumento.estadoSiguiente) {
        console.log('➡️ Estado Siguiente:', {
          id: estadoDocumento.estadoSiguiente.id,
          nombre: estadoDocumento.estadoSiguiente.nombre,
          codigo: estadoDocumento.estadoSiguiente.codigo,
        });
      }
      console.log('📦 Datos completos:', estadoDocumento);
      console.groupEnd();
    } else {
      console.log('✨ Modo: CREAR (sin datos previos)');
    }
  }, [estadoDocumento, isEditing]);

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: estadosDocumentoService.indexUrl() },
      { title: 'Estados de Documento', href: estadosDocumentoService.indexUrl() },
      { title: isEditing ? 'Editar' : 'Nueva', href: '#' }
    ]}>
      <GenericFormContainer<EstadoDocumento, EstadoDocumentoFormData>
        entity={estadoDocumento}
        config={estadosDocumentoConfig}
        service={estadosDocumentoService}
        initialData={initialEstadoDocumentoData}
        loadOptions={loadOptions}
      />
    </AppLayout>
  );
}
