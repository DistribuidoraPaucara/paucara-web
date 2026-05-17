/**
 * Hooks Index - Exportar todos los hooks en un solo lugar
 *
 * Uso:
 * import { useFormWithValidation, usePaginatedData, useFilters, useTable } from '@/application/hooks';
 */

// Hooks mejorados FASE 5.6
export { useFormWithValidation } from '@/application/hooks/use-form-with-validation';
export type { UseFormWithValidationReturn } from '@/application/hooks/use-form-with-validation';

export { usePaginatedData } from '@/application/hooks/use-paginated-data';
export type { UsePaginatedDataReturn, PaginationInfo } from '@/application/hooks/use-paginated-data';

export { useFilters } from '@/application/hooks/use-filters';
export type { UseFiltersReturn } from '@/application/hooks/use-filters';

export { useTable } from '@/application/hooks/use-table';
export type { UseTableReturn, UseTableOptions } from '@/application/hooks/use-table';

// Hooks existentes (FASE 5)
export { useModalForm } from '@/application/hooks/use-modal-form';

// Otros hooks existentes
// export { useGenericEntities } from '@/application/hooks/use-generic-entities';
// ... (agregar otros hooks según existan)

// Hooks para Estados Logísticos Centralizados (FASE 3)
export { useEstados } from '@/application/hooks/use-estados';
export type { UseEstadosOptions, UseEstadosReturn } from '@/domain/entities/estados-centralizados';

export {
    useEstadosEntregas,
    useEntregaEstadoBadge,
    useEntregaFlujoEstados,
    useEntregaCanTransition,
} from '@/application/hooks/use-estados-entregas';

export {
    useEstadosProformas,
    useProformaEstadoBadge,
    useProformaFlujoEstados,
    useProformaEstadoCalculado,
    useProformaTransicionesValidas,
    useProformaCanApprove,
    useProformaCanReject,
} from '@/application/hooks/use-estados-proformas';

// ✅ NUEVO: Hook para políticas de pago
export { usePoliticasPago } from '@/application/hooks/use-politicas-pago';
