// Pages: EstadosDocumento index page using generic components
import { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { estadosDocumentoConfig } from '@/config/modules/estadosDocumento.config';
import estadosDocumentoService from '@/infrastructure/services/estadosDocumento.service';
import type { Pagination } from '@/domain/entities/shared';
import type { EstadoDocumento, EstadoDocumentoFormData } from '@/domain/entities/estadosDocumento';

interface EstadosDocumentoIndexPageProps {
  estadosDocumento: Pagination<EstadoDocumento>;
  filters: { q?: string; activo?: string | boolean; es_estado_final?: string | boolean };
}

export default function EstadosDocumentoIndexPage({
  estadosDocumento,
  filters
}: EstadosDocumentoIndexPageProps) {
  useEffect(() => {
    console.group('📊 EstadosDocumento - Backend Data');
    console.log('🔵 Filtros recibidos:', filters);
    console.log('📋 Total de registros:', estadosDocumento.total);
    console.log('📄 Registros en esta página:', estadosDocumento.data?.length || 0);
    console.log('📑 Página actual:', estadosDocumento.current_page);
    console.log('🔢 Total de páginas:', estadosDocumento.last_page);
    console.log('🔗 URL actual:', estadosDocumento.path);
    console.log('📦 Datos completos:', estadosDocumento);

    if (estadosDocumento.data && estadosDocumento.data.length > 0) {
      console.log('🎯 Primer registro:', estadosDocumento.data[0]);
    }
    console.groupEnd();
  }, [estadosDocumento, filters]);

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: estadosDocumentoService.indexUrl() },
      { title: 'Estados de Documento', href: estadosDocumentoService.indexUrl() }
    ]}>
      <GenericContainer<EstadoDocumento, EstadoDocumentoFormData>
        entities={estadosDocumento}
        filters={filters}
        config={estadosDocumentoConfig}
        service={estadosDocumentoService}
      />
    </AppLayout>
  );
}
