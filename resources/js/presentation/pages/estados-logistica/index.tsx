/**
 * Pages: EstadosLogistica index page - MIGRACIÓN A GenericContainer
 *
 * CAMBIOS REALIZADOS:
 * - Migrado de SimpleCrudContainer a GenericContainer (más completo y moderno)
 * - GenericContainer: paginación visual, filtros modernos, vista cards, mejor UI
 * - Config actualizado a ModuleConfig (estadosLogistica.config.tsx)
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
import { estadosLogisticaConfig } from '@/config/modules/estadosLogistica.config';
import estadosLogisticaService from '@/infrastructure/services/estadosLogistica.service';
import type { Pagination } from '@/domain/entities/shared';
import type { EstadoLogistica, EstadoLogisticaFormData } from '@/domain/entities/estadosLogistica';

interface EstadosLogisticaIndexProps {
  estadosLogistica: Pagination<EstadoLogistica>;
  filters: { q?: string };
}

export default function EstadosLogisticaIndex({ estadosLogistica, filters }: EstadosLogisticaIndexProps) {
  return (
    <AppLayout breadcrumbs={[
      { title: 'Dashboard', href: estadosLogisticaService.indexUrl() },
      { title: 'Estados de Logística', href: estadosLogisticaService.indexUrl() }
    ]}>
      <GenericContainer<EstadoLogistica, EstadoLogisticaFormData>
        entities={estadosLogistica}
        filters={filters}
        config={estadosLogisticaConfig}
        service={estadosLogisticaService}
      />
    </AppLayout>
  );
}
