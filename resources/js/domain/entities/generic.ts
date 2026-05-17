// Domain: Generic types for CRUD operations
import type { Id, Pagination, Filters } from './shared';

// Base entity interface that all entities must implement
export interface BaseEntity {
  id: Id;
  [key: string]: unknown;
}

// Generic form data interface
export interface BaseFormData {
  id?: Id;
  [key: string]: unknown;
}

// Generic configuration for each module
export interface ModuleConfig<T extends BaseEntity, F extends BaseFormData> {
  // Module identification
  moduleName: string;
  singularName: string;
  pluralName: string;

  // Display configuration
  displayName: string;
  description: string;

  // Table configuration
  tableColumns: TableColumn<T>[];

  // Form configuration
  formFields: FormField<F>[];

  // 🆕 Form sections (para organizar campos en grupos)
  formSections?: FormSection[];

  // 🆕 Form layout (para controlar el diseño del formulario)
  formLayout?: 'single' | 'two-column' | 'three-column' | 'auto'; // Default: 'auto'

  // Search configuration
  searchableFields: (keyof T)[];
  searchPlaceholder: string;

  // Optional enhanced index visualization
  enableCardView?: boolean; // Permite alternar entre tabla y tarjetas
  cardRenderer?: (entity: T, actions: { onEdit: (e: T) => void; onDelete: (e: T) => void }) => React.ReactNode; // Renderiza una tarjeta para el entity

  // Modern index filters configuration
  indexFilters?: IndexFiltersConfig;

  // Legacy: show model-specific index filters (deprecated)
  showIndexFilters?: boolean;
  // Legacy: custom index filter renderer per module (deprecated)
  indexFilterRenderer?: IndexFilterRenderer;
}

// 🆕 Form section configuration
export interface FormSection {
  id: string;
  title: string;
  description?: string;
  icon?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  order?: number;
}

// Table column configuration
export interface TableColumn<T extends BaseEntity> {
  key: keyof T;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'custom';
  sortable?: boolean;
  searchable?: boolean;
  render?: (value: unknown, entity: T, ...extra: unknown[]) => React.ReactNode;
}

// Form field configuration
export interface FormField<F extends BaseFormData> {
  key: keyof F;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'multiselect' | 'date' | 'file' | 'custom' | 'password';
  required?: boolean | ((data: F) => boolean);
  placeholder?: string | ((data: F) => string);
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
  };
  options?: { value: unknown; label: string }[];
  extraDataKey?: string; // For options coming from extraData (e.g., 'localidades', 'categorias')
  maxSelections?: number; // Maximum selections for multiselect fields

  // 🆕 Visibilidad y control de campos
  hidden?: boolean; // Ocultar campo permanentemente
  visible?: (data: F) => boolean; // Visibilidad condicional según otros campos
  disabled?: (data: F) => boolean; // Deshabilitar campo según condiciones

  // 🆕 Agrupación y organización
  group?: string; // Agrupar campos en secciones
  section?: string; // Sección del formulario
  order?: number; // Orden de renderizado
  colSpan?: 1 | 2 | 3 | 4; // Columnas que ocupa en grid (1-4)
  fullWidth?: boolean; // Si es true, el campo ocupa todo el ancho de la pantalla (sale del grid)

  // 🆕 UI/UX mejorado
  description?: string | ((data: F) => string); // Texto de ayuda debajo del campo (puede ser función)
  icon?: string; // Icono del campo (clase de icono)
  prefix?: string; // Prefijo (ej: "$", "Bs.")
  suffix?: string; // Sufijo (ej: "%", "kg")
  defaultValue?: unknown; // Valor por defecto al crear (solo se aplica en modo creación)

  // Permite un renderizado personalizado del campo
  render?: (props: {
    value: unknown;
    onChange: (value: unknown) => void;
    label: string;
    error?: string;
    disabled?: boolean;
    field: FormField<F>;
  }) => React.ReactNode;
}

// Filter field configuration for dynamic filters
export interface FilterField {
  key: string;
  label: string;
  type: 'text' | 'select' | 'boolean' | 'date' | 'number' | 'range' | 'multiselect';
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  defaultValue?: unknown;
  extraDataKey?: string; // For options coming from extraData (e.g., 'categorias', 'marcas')
  width?: 'sm' | 'md' | 'lg' | 'full'; // Column width in grid
}

// Sort configuration
export interface SortOption {
  value: string;
  label: string;
}

// Index filters configuration
export interface IndexFiltersConfig {
  filters: FilterField[];
  sortOptions: SortOption[];
  defaultSort?: { field: string; direction: 'asc' | 'desc' };
  layout?: 'grid' | 'inline'; // Layout style
}

// Custom index filter renderer type
export type IndexFilterRenderer = (args: {
  current: Filters;
  apply: (filters: Filters) => void;
  reset: () => void;
  extraData?: Record<string, unknown>;
}) => React.ReactNode;

/**
 * Generic service interface for Inertia.js-based applications
 *
 * Los servicios que implementan esta interfaz proporcionan URLs para navegación
 * y métodos auxiliares para operaciones CRUD usando Inertia.js.
 *
 * NO implementan llamadas HTTP directas (fetch/axios) porque Inertia.js maneja
 * toda la comunicación con el backend de forma automática.
 *
 * @example
 * // Uso típico en un componente:
 * const service = new EmpleadosService();
 *
 * // Navegación
 * router.get(service.indexUrl());
 * router.get(service.createUrl());
 *
 * // Operaciones CRUD (Inertia.js maneja el HTTP)
 * router.post(service.storeUrl(), data);        // CREATE
 * router.put(service.updateUrl(id), data);      // UPDATE
 * service.destroy(id);                           // DELETE (con notificaciones)
 */
export interface BaseService<T extends BaseEntity, F extends BaseFormData> {
  // URL generators (required by Inertia.js router)
  indexUrl(params?: { query?: Filters }): string;
  createUrl(): string;
  editUrl(id: Id): string;
  storeUrl(): string;
  updateUrl(id: Id): string;
  destroyUrl(id: Id): string;

  // Helper methods (with Inertia.js integration)
  search(filters: Filters): void;        // Uses router.get() internally
  destroy(id: Id): void;                 // Uses router.delete() internally

  // Validation (client-side)
  validateData(data: F): string[] | Promise<string[]>;
}

// Generic props interfaces
export interface GenericIndexProps<T extends BaseEntity> {
  entities: Pagination<T>;
  filters: Filters;
}

export interface GenericFormProps<T extends BaseEntity> {
  entity?: T | null;
}

// Export Filters type for convenience
export type { Filters };
