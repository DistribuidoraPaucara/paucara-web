/**
 * Pages: Tipos de Documento index page - MIGRACIÓN A GenericContainer
 */

import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { tiposDocumentoConfig } from '@/config/modules/tipos-documento.config';
import tiposDocumentoService from '@/infrastructure/services/tipos-documento.service';
import type { Pagination } from '@/domain/entities/shared';
import type { TipoDocumento, TipoDocumentoFormData } from '@/domain/entities/tipos-documento';

interface TiposDocumentoIndexProps {
  tipoDocumento: Pagination<TipoDocumento>;
  filters: { q?: string };
}

export default function TiposDocumentoIndex({ tipoDocumento, filters }: TiposDocumentoIndexProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/' },
      { title: 'Tipos de Documento', href: tiposDocumentoService.indexUrl() }
    ]}>
      <GenericContainer<TipoDocumento, TipoDocumentoFormData>
        entities={tipoDocumento}
        filters={filters}
        config={tiposDocumentoConfig}
        service={tiposDocumentoService}
      />
    </AppLayout>
  );
}
