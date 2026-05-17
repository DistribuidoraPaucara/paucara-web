/**
 * TableHelper - Utilidades para manejo de tablas
 *
 * Propósito: Centralizar lógica común de tablas (paginación, ordenamiento, etc)
 * Eliminar duplicación en componentes de tabla
 *
 * Beneficio: -40 líneas de lógica de tabla duplicada
 *
 * Ejemplo:
 * const table = new TableHelper(data, { defaultSort: 'nombre' });
 * table.sort('nombre');
 * table.paginate(1, 10);
 */

export interface SortConfig {
  field: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  perPage: number;
  total: number;
}

export class TableHelper<T extends { id: any }> {
  private items: T[];
  private sortConfig: SortConfig | null = null;
  private paginationConfig: PaginationConfig = {
    page: 1,
    perPage: 10,
    total: 0,
  };

  constructor(items: T[] = []) {
    this.items = items;
    this.paginationConfig.total = items.length;
  }

  /**
   * Establecer items de la tabla
   */
  setItems(items: T[]): this {
    this.items = items;
    this.paginationConfig.total = items.length;
    return this;
  }

  /**
   * Obtener items actuales
   */
  getItems(): T[] {
    return this.items;
  }

  /**
   * Ordenar tabla por campo
   * @param field Campo a ordenar
   * @param direction Dirección (asc/desc) - si no se proporciona, alterna
   * @returns this para chaining
   *
   * Ejemplo: .sort('nombre')
   */
  sort(field: string, direction?: 'asc' | 'desc'): this {
    // Si es el mismo campo, alterar dirección
    if (this.sortConfig?.field === field && !direction) {
      direction = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else if (!direction) {
      direction = 'asc';
    }

    this.sortConfig = { field, direction };

    this.items.sort((a, b) => {
      const aValue = this.getNestedValue(a, field);
      const bValue = this.getNestedValue(b, field);

      let comparison = 0;
      if (aValue < bValue) comparison = -1;
      if (aValue > bValue) comparison = 1;

      return direction === 'asc' ? comparison : -comparison;
    });

    return this;
  }

  /**
   * Obtener configuración actual de ordenamiento
   */
  getSortConfig(): SortConfig | null {
    return this.sortConfig;
  }

  /**
   * Limpiar ordenamiento
   */
  clearSort(): this {
    this.sortConfig = null;
    return this;
  }

  /**
   * Establecer paginación
   * @param page Página actual (1-indexed)
   * @param perPage Items por página
   * @returns this para chaining
   *
   * Ejemplo: .paginate(1, 10)
   */
  paginate(page: number = 1, perPage: number = 10): this {
    this.paginationConfig = {
      page: Math.max(1, page),
      perPage: Math.max(1, perPage),
      total: this.items.length,
    };
    return this;
  }

  /**
   * Obtener items paginados
   */
  getPaginatedItems(): T[] {
    const start = (this.paginationConfig.page - 1) * this.paginationConfig.perPage;
    const end = start + this.paginationConfig.perPage;
    return this.items.slice(start, end);
  }

  /**
   * Obtener configuración de paginación
   */
  getPaginationConfig(): PaginationConfig {
    return {
      ...this.paginationConfig,
      total: this.items.length,
    };
  }

  /**
   * Obtener total de páginas
   */
  getTotalPages(): number {
    return Math.ceil(this.items.length / this.paginationConfig.perPage);
  }

  /**
   * Ir a página siguiente
   */
  nextPage(): this {
    if (this.paginationConfig.page < this.getTotalPages()) {
      this.paginationConfig.page++;
    }
    return this;
  }

  /**
   * Ir a página anterior
   */
  previousPage(): this {
    if (this.paginationConfig.page > 1) {
      this.paginationConfig.page--;
    }
    return this;
  }

  /**
   * Filtrar tabla por predicado
   * @param predicate Función que retorna true para items a mantener
   * @returns this para chaining
   *
   * Ejemplo: .filter(item => item.activo === true)
   */
  filter(predicate: (item: T) => boolean): this {
    this.items = this.items.filter(predicate);
    return this;
  }

  /**
   * Buscar en tabla (ILIKE en todos los campos string)
   * @param query Texto a buscar
   * @param fields Campos a buscar (si no se proporciona, busca en todos)
   * @returns this para chaining
   *
   * Ejemplo: .search('juan', ['nombre', 'email'])
   */
  search(query: string, fields?: (keyof T)[]): this {
    if (!query.trim()) return this;

    const searchLower = query.toLowerCase();
    const searchableFields = fields || Object.keys(this.items[0] || {});

    this.items = this.items.filter((item) => {
      return searchableFields.some((field) => {
        const value = this.getNestedValue(item, String(field));
        return String(value).toLowerCase().includes(searchLower);
      });
    });

    return this;
  }

  /**
   * Seleccionar filas
   * @param ids Array de IDs a seleccionar
   * @returns this para chaining
   */
  selectRows(ids: any[]): this {
    // Marcar items como seleccionados
    this.items.forEach((item) => {
      (item as any).__selected = ids.includes(item.id);
    });
    return this;
  }

  /**
   * Obtener IDs de filas seleccionadas
   */
  getSelectedIds(): any[] {
    return this.items
      .filter((item) => (item as any).__selected)
      .map((item) => item.id);
  }

  /**
   * Limpiar selección
   */
  clearSelection(): this {
    this.items.forEach((item) => {
      (item as any).__selected = false;
    });
    return this;
  }

  /**
   * Agrupar tabla por campo
   * @param field Campo a agrupar
   * @returns Record con grupos
   *
   * Ejemplo: .groupBy('estado')
   */
  groupBy(field: keyof T): Record<string, T[]> {
    const groups: Record<string, T[]> = {};

    this.items.forEach((item) => {
      const key = String(this.getNestedValue(item, String(field)));
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
    });

    return groups;
  }

  /**
   * Mapear elementos de la tabla
   * @param mapper Función de transformación
   * @returns Array transformado
   *
   * Ejemplo: .map(item => ({ ...item, nombre: item.nombre.toUpperCase() }))
   */
  map<U>(mapper: (item: T) => U): U[] {
    return this.items.map(mapper);
  }

  /**
   * Obtener ítem por ID
   */
  getById(id: any): T | undefined {
    return this.items.find((item) => item.id === id);
  }

  /**
   * Obtener índice de ítem por ID
   */
  getIndexById(id: any): number {
    return this.items.findIndex((item) => item.id === id);
  }

  /**
   * Actualizar ítem
   * @param id ID del ítem
   * @param updates Datos a actualizar
   * @returns true si encontró y actualizó
   *
   * Ejemplo: .update(1, { nombre: 'Nuevo nombre' })
   */
  update(id: any, updates: Partial<T>): boolean {
    const index = this.getIndexById(id);
    if (index === -1) return false;

    this.items[index] = { ...this.items[index], ...updates };
    return true;
  }

  /**
   * Eliminar ítem
   * @param id ID del ítem a eliminar
   * @returns true si encontró y eliminó
   */
  remove(id: any): boolean {
    const index = this.getIndexById(id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  /**
   * Obtener resumen estadístico de tabla
   */
  getSummary(): {
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } {
    return {
      total: this.items.length,
      page: this.paginationConfig.page,
      perPage: this.paginationConfig.perPage,
      totalPages: this.getTotalPages(),
      hasNext: this.paginationConfig.page < this.getTotalPages(),
      hasPrev: this.paginationConfig.page > 1,
    };
  }

  /**
   * Helper interno: Obtener valor anidado (soporta dot notation)
   * Ejemplo: getNestedValue(obj, 'user.profile.name')
   */
  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, part) => {
      return current?.[part];
    }, obj);
  }
}

/**
 * Función helper para crear TableHelper
 *
 * Uso:
 * const table = createTable(data)
 *   .sort('nombre')
 *   .paginate(1, 10);
 */
export function createTable<T extends { id: any }>(items: T[] = []): TableHelper<T> {
  return new TableHelper(items);
}
