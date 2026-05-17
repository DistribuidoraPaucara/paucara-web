/**
 * Pages: Categorias index page - MIGRACIÓN A GenericContainer
 *
 * CAMBIOS REALIZADOS:
 * - Migrado de SimpleCrudContainer a GenericContainer (más completo y moderno)
 * - GenericContainer: paginación visual, filtros modernos, vista cards, mejor UI
 * - Config actualizado a ModuleConfig (categoria.config.ts)
 *
 * FEATURES AHORA DISPONIBLES:
 * ✓ Paginación visual con botones (1, 2, 3, Prev, Next)
 * ✓ Filtros modernos avanzados
 * ✓ Toggle vista Tabla/Tarjetas
 * ✓ Información de totales en header
 * ✓ CardHeader con gradient profesional y ícono
 * ✓ Búsqueda integrada
 * ✓ Crear, editar, eliminar
 */

import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { categoriasConfig } from '@/config/modules/categorias.config';
import categoriasService from '@/infrastructure/services/categorias.service';
import type { Pagination } from '@/domain/entities/shared';
import type { Categoria, CategoriaFormData } from '@/domain/entities/categorias';

interface CategoriasIndexProps {
  categorias: Pagination<Categoria>;
  filters: { q?: string };
}

export default function CategoriasIndex({ categorias, filters }: CategoriasIndexProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: categoriasService.indexUrl() },
      { title: 'Categorías', href: categoriasService.indexUrl() }
    ]}>
      <GenericContainer<Categoria, CategoriaFormData>
        entities={categorias}
        filters={filters}
        config={categoriasConfig}
        service={categoriasService}
      />
    </AppLayout>
  );
}
