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

import { useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import GenericContainer from '@/presentation/components/generic/generic-container';
import { estadosLogisticaConfig } from '@/config/modules/estadosLogistica.config';
import estadosLogisticaService from '@/infrastructure/services/estadosLogistica.service';
import type { Pagination } from '@/domain/entities/shared';
import type { EstadoLogistica, EstadoLogisticaFormData } from '@/domain/entities/estadosLogistica';

interface EstadosLogisticaIndexProps {
  estadosLogistica: Pagination<EstadoLogistica>;
  filters: { q?: string; categoria?: string; activo?: string | boolean; es_estado_final?: string | boolean };
}

export default function EstadosLogisticaIndex({ estadosLogistica, filters }: EstadosLogisticaIndexProps) {
  useEffect(() => {
    console.group('📊 EstadosLogistica - Backend Data');
    console.log('🔵 Filtros recibidos:', filters);
    console.log('📋 Total de registros:', estadosLogistica.total);
    console.log('📄 Registros en esta página:', estadosLogistica.data?.length || 0);
    console.log('📑 Página actual:', estadosLogistica.current_page);
    console.log('🔢 Total de páginas:', estadosLogistica.last_page);
    console.log('🔗 URL actual:', estadosLogistica.path);
    console.log('📦 Datos completos:', estadosLogistica);

    if (estadosLogistica.data && estadosLogistica.data.length > 0) {
      console.log('🎯 Primer registro:', estadosLogistica.data[0]);
      console.log('📌 Categorías encontradas:', [...new Set(estadosLogistica.data.map(e => e.categoria))]);
    }
    console.groupEnd();
  }, [estadosLogistica, filters]);

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
