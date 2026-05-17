/**
 * Utils Index - Exportar todas las utilidades en un solo lugar
 *
 * Uso:
 * import { DateFormatter, FilterBuilder, TableHelper, StringHelper, NumberHelper } from '@/infrastructure/utils';
 *
 * O importar helpers específicos:
 * import { createFilters } from '@/infrastructure/utils/filter-builder';
 * import { formatCurrency } from '@/infrastructure/utils/number-helper';
 */

// Import classes para crear aliases
import { FilterBuilder } from '@/infrastructure/utils/filter-builder';
import { TableHelper } from '@/infrastructure/utils/table-helper';
import { DateFormatter } from '@/infrastructure/utils/date-formatter';
import { StringHelper } from '@/infrastructure/utils/string-helper';
import { NumberHelper } from '@/infrastructure/utils/number-helper';

// Export FilterBuilder y helpers
export { FilterBuilder, createFilters } from '@/infrastructure/utils/filter-builder';
export type { FilterCondition } from '@/infrastructure/utils/filter-builder';

// Export TableHelper y helpers
export { TableHelper, createTable } from '@/infrastructure/utils/table-helper';
export type { SortConfig, PaginationConfig } from '@/infrastructure/utils/table-helper';

// Export DateFormatter
export { DateFormatter } from '@/infrastructure/utils/date-formatter';

// Export StringHelper
export { StringHelper } from '@/infrastructure/utils/string-helper';

// Export NumberHelper
export { NumberHelper } from '@/infrastructure/utils/number-helper';

/**
 * Aliases para acceso rápido
 */
export const Filters = FilterBuilder;
export const Table = TableHelper;
export const Dates = DateFormatter;
export const Strings = StringHelper;
export const Numbers = NumberHelper;
