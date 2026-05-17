/**
 * Pages: Sectores index page - CRUD Genérico
 *
 * Gestión de sectores de almacén (clasificación dentro de almacenes)
 * Utiliza GenericContainer para CRUD automático con validaciones
 */

import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { sectoresConfig } from '@/config/modules/sectores.config';
import sectoresService from '@/infrastructure/services/sectores.service';
import type { Pagination } from '@/domain/entities/shared';
import type { Sector, SectorFormData } from '@/domain/entities/sectores';

interface SectoresIndexProps {
  sectores: Pagination<Sector>;
  filters: { q?: string };
}

/**
 * Página principal de gestión de sectores
 *
 * Proporciona:
 * ✅ Tabla de sectores con búsqueda
 * ✅ Crear nuevo sector
 * ✅ Editar sector existente
 * ✅ Eliminar sector (con protecciones)
 * ✅ Validaciones automáticas
 * ✅ Mensajes de éxito/error
 */
export default function SectoresIndex({ sectores, filters }: SectoresIndexProps) {
  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/' },
        { title: 'Almacenes', href: '/almacenes' },
        { title: 'Sectores', href: sectoresService.indexUrl() }
      ]}
    >
      <GenericContainer<Sector, SectorFormData>
        entities={sectores}
        filters={filters}
        config={sectoresConfig}
        service={sectoresService}
      />
    </AppLayout>
  );
}
