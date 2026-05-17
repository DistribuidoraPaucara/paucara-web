import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { tiposPrecioConfig } from '@/config/modules/tipos-precio.config';
import tiposPrecioService from '@/infrastructure/services/tipos-precio.service';
import type { Pagination } from '@/domain/entities/shared';
import type { TipoPrecio, TipoPrecioFormData } from '@/domain/entities/tipos-precio';

interface TiposPrecioIndexProps {
  tipos_precio: Pagination<TipoPrecio>;
  filters: { q?: string; activo?: boolean };
}

export default function TiposPrecioIndex({ tipos_precio, filters }: TiposPrecioIndexProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/' },
      { title: 'Tipos de Precio', href: tiposPrecioService.indexUrl() }
    ]}>
      <GenericContainer<TipoPrecio, TipoPrecioFormData>
        entities={tipos_precio}
        filters={filters}
        config={tiposPrecioConfig}
        service={tiposPrecioService}
      />
    </AppLayout>
  );
}
