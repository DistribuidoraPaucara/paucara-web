// Pages: EstadosDocumento index page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { estadosDocumentoConfig } from '@/config/modules/estadosDocumento.config';
import estadosDocumentoService from '@/infrastructure/services/estadosDocumento.service';
import type { EstadoDocumento, EstadoDocumentoFormData } from '@/domain/entities/estadosDocumento';
import type { PaginatedResponse } from '@/domain/entities/generic';

interface EstadosDocumentoIndexPageProps {
  estadosDocumento: PaginatedResponse<EstadoDocumento>;
  filters?: {
    q?: string;
    activo?: boolean;
    es_estado_final?: boolean;
  };
}

export default function EstadosDocumentoIndexPage({
  estadosDocumento,
  filters = {}
}: EstadosDocumentoIndexPageProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/dashboard' },
      { title: 'Estados de Documento', href: '#' }
    ]}>
      <GenericContainer<EstadoDocumento, EstadoDocumentoFormData>
        config={estadosDocumentoConfig}
        service={estadosDocumentoService}
        data={estadosDocumento}
        defaultFilters={filters}
      />
    </AppLayout>
  );
}
