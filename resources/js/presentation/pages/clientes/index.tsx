// Pages: Clientes index page using generic components
import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { clientesConfig } from '@/config/modules/clientes.config';
import { clientesService } from '@/infrastructure/services/clientes.service';
import { router } from '@inertiajs/react';
import { FolderTree } from 'lucide-react';
import type { Pagination } from '@/domain/entities/shared';
import type { Cliente, ClienteFormData } from '@/domain/entities/clientes';

interface ClientesIndexProps {
  clientes: Pagination<Cliente>;
  filters: {
    q?: string;
    activo?: string | number | boolean | null;
    localidad_id?: number | null;
    order_by?: string | null;
    order_dir?: string | null
  };
  localidades?: Array<{ id: number; nombre: string; codigo: string }>;
}

export default function ClientesIndex({ clientes, filters, localidades }: ClientesIndexProps) {
  // Debug: Ver qué datos llegan del backend
  console.log('📋 CLIENTES INDEX - Props recibidas del backend:', {
    total_clientes: clientes.total,
    per_page: clientes.per_page,
    current_page: clientes.current_page,
    clientes_en_pagina: clientes.data.length,
    localidades_count: localidades?.length,
    filtros: filters,
    primer_cliente: clientes.data[0] ? {
      id: clientes.data[0].id,
      nombre: clientes.data[0].nombre,
      localidad: (clientes.data[0] as any).localidad,
      categorias: (clientes.data[0] as any).categorias,
      categorias_ids: (clientes.data[0] as any).categorias_ids,
    } : null,
    todos_clientes: clientes.data.map((c: any) => ({
      id: c.id,
      nombre: c.nombre,
      categorias: c.categorias,
      categorias_ids: c.categorias_ids,
    }))
  });

  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: clientesService.indexUrl() },
      { title: 'Clientes', href: clientesService.indexUrl() }
    ]}>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Header with categorías button */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Clientes
            </h1>
          </div>
          <button
            onClick={() => router.visit('/admin/categorias-cliente')}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 px-4 py-2 text-white hover:bg-amber-700 transition-colors"
            title="Gestionar categorías de cliente"
          >
            <FolderTree className="h-5 w-5" />
            Categorías
          </button>
        </div>

        <GenericContainer<Cliente, ClienteFormData>
          entities={clientes}
          filters={filters}
          config={clientesConfig}
          service={clientesService}
          extraData={{ localidades }}
        />
      </div>
    </AppLayout>
  );
}
