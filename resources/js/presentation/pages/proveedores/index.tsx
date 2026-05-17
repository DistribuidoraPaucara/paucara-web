// Pages: Proveedores index page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { proveedoresConfig } from '@/config/modules/proveedores.config';
import proveedoresService from '@/infrastructure/services/proveedores.service';
import type { Pagination } from '@/domain/entities/shared';
import type { Proveedor, ProveedorFormData } from '@/domain/entities/proveedores';

interface ProveedoresIndexProps {
  proveedores: Pagination<Proveedor>;
  filters: {
    q?: string;
    activo?: string | number | boolean | null;
    order_by?: string | null;
    order_dir?: string | null
  };
}

export default function ProveedoresIndex({ proveedores, filters }: ProveedoresIndexProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: '/' },
      { title: 'Proveedores', href: proveedoresService.indexUrl() }
    ]}>
      <GenericContainer<Proveedor, ProveedorFormData>
        entities={proveedores}
        filters={filters}
        config={proveedoresConfig}
        service={proveedoresService}
      />
    </AppLayout>
  );
}
