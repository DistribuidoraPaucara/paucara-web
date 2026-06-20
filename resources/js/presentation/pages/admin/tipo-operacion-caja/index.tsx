// Presentation: Página de administración de Tipos de Operación de Caja
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { TipoOperacionCajaContainer } from '@/presentation/components/tipo-operacion-caja';
import type { TipoOperacionCaja } from '@/domain/entities/tipo-operacion-caja';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface Props {
  'tipo-operacion-caja': TipoOperacionCaja[];
  pagination: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    links: PaginationLink[];
  };
  filters?: {
    q?: string;
  };
}

export default function TipoOperacionCajaPage({
  'tipo-operacion-caja': items,
  pagination,
  filters = {}
}: Props) {
  return (
    <AppLayout>
      <Head title="Tipos de Operación de Caja" />
      <TipoOperacionCajaContainer
        items={items}
        pagination={pagination}
        query={filters.q || ''}
      />
    </AppLayout>
  );
}
