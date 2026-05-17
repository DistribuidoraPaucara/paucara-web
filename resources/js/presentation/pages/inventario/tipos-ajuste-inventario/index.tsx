// Pages: Tipos de Ajuste de Inventario index page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { tipoAjusteInventarioConfig } from '@/config/modules/tipoAjusteInventario.config';
import tipoAjusteInventarioService from '@/infrastructure/services/tipoAjusteInventario.service';
import type { Pagination } from '@/domain/entities/shared';
import type { TipoAjusteInventario, TipoAjusteInventarioFormData } from '@/domain/entities/tipos-ajuste-inventario';

interface TiposAjusteInventarioIndexProps {
  tiposAjusteInventario: Pagination<TipoAjusteInventario>;
  filters: { q?: string };
}

export default function TiposAjusteInventarioIndex({ tiposAjusteInventario, filters }: TiposAjusteInventarioIndexProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: tipoAjusteInventarioService.indexUrl() },
      { title: 'Inventario', href: '/inventario' },
      { title: 'Tipos de Ajuste', href: tipoAjusteInventarioService.indexUrl() }
    ]}>
      <GenericContainer<TipoAjusteInventario, TipoAjusteInventarioFormData>
        entities={tiposAjusteInventario}
        filters={filters}
        config={tipoAjusteInventarioConfig}
        service={tipoAjusteInventarioService}
      />
    </AppLayout>
  );
}
