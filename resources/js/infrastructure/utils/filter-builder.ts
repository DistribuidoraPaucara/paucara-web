/**
 * FilterBuilder - Utilidad para construir filtros dinámicos
 *
 * Propósito: Simplificar construcción de objetos de filtros complejos
 * Eliminar duplicación de lógica de filtros en componentes
 *
 * Beneficio: -50 líneas de lógica de filtros duplicada
 *
 * Ejemplo:
 * const filters = new FilterBuilder()
 *   .add('estado', 'activo')
 *   .add('localidad_id', 5)
 *   .between('fecha', '2024-01-01', '2024-12-31')
 *   .build();
 */

export interface FilterCondition {
  field: string;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'between' | 'like' | 'ilike';
  value: any;
}

export class FilterBuilder {
  private conditions: FilterCondition[] = [];

  /**
   * Agregar filtro simple (igualdad)
   * @param field Campo a filtrar
   * @param value Valor exacto
   * @returns this para chaining
   *
   * Ejemplo: .add('estado', 'activo')
   */
  add(field: string, value: any): this {
    if (value !== undefined && value !== null && value !== '') {
      this.conditions.push({
        field,
        operator: 'eq',
        value,
      });
    }
    return this;
  }

  /**
   * Agregar filtro si condición es verdadera
   * @param condition Condición boolean
   * @param field Campo a filtrar
   * @param value Valor
   * @returns this para chaining
   *
   * Ejemplo: .addIf(isActive, 'estado', 'activo')
   */
  addIf(condition: boolean, field: string, value: any): this {
    if (condition) {
      return this.add(field, value);
    }
    return this;
  }

  /**
   * Agregar filtro NOT EQUAL
   * @param field Campo a filtrar
   * @param value Valor a excluir
   * @returns this para chaining
   *
   * Ejemplo: .notEqual('estado', 'eliminado')
   */
  notEqual(field: string, value: any): this {
    if (value !== undefined && value !== null) {
      this.conditions.push({
        field,
        operator: 'ne',
        value,
      });
    }
    return this;
  }

  /**
   * Agregar filtro LIKE (búsqueda por texto)
   * @param field Campo a filtrar
   * @param value Texto a buscar
   * @returns this para chaining
   *
   * Ejemplo: .like('nombre', 'juan')
   */
  like(field: string, value: string): this {
    if (value && value.trim()) {
      this.conditions.push({
        field,
        operator: 'like',
        value: value.trim(),
      });
    }
    return this;
  }

  /**
   * Agregar filtro ILIKE (búsqueda insensible a mayúsculas)
   * @param field Campo a filtrar
   * @param value Texto a buscar
   * @returns this para chaining
   *
   * Ejemplo: .ilike('nombre', 'juan')
   */
  ilike(field: string, value: string): this {
    if (value && value.trim()) {
      this.conditions.push({
        field,
        operator: 'ilike',
        value: value.trim(),
      });
    }
    return this;
  }

  /**
   * Agregar filtro mayor que
   * @param field Campo a filtrar
   * @param value Valor mínimo
   * @returns this para chaining
   *
   * Ejemplo: .greaterThan('precio', 100)
   */
  greaterThan(field: string, value: number): this {
    if (value !== undefined && value !== null) {
      this.conditions.push({
        field,
        operator: 'gt',
        value,
      });
    }
    return this;
  }

  /**
   * Agregar filtro mayor o igual que
   * @param field Campo a filtrar
   * @param value Valor mínimo
   * @returns this para chaining
   *
   * Ejemplo: .greaterOrEqual('fecha', '2024-01-01')
   */
  greaterOrEqual(field: string, value: any): this {
    if (value !== undefined && value !== null) {
      this.conditions.push({
        field,
        operator: 'gte',
        value,
      });
    }
    return this;
  }

  /**
   * Agregar filtro menor que
   * @param field Campo a filtrar
   * @param value Valor máximo
   * @returns this para chaining
   *
   * Ejemplo: .lessThan('precio', 1000)
   */
  lessThan(field: string, value: number): this {
    if (value !== undefined && value !== null) {
      this.conditions.push({
        field,
        operator: 'lt',
        value,
      });
    }
    return this;
  }

  /**
   * Agregar filtro menor o igual que
   * @param field Campo a filtrar
   * @param value Valor máximo
   * @returns this para chaining
   *
   * Ejemplo: .lessOrEqual('fecha', '2024-12-31')
   */
  lessOrEqual(field: string, value: any): this {
    if (value !== undefined && value !== null) {
      this.conditions.push({
        field,
        operator: 'lte',
        value,
      });
    }
    return this;
  }

  /**
   * Agregar filtro BETWEEN (entre dos valores)
   * @param field Campo a filtrar
   * @param from Valor inicial
   * @param to Valor final
   * @returns this para chaining
   *
   * Ejemplo: .between('fecha', '2024-01-01', '2024-12-31')
   */
  between(field: string, from: any, to: any): this {
    if (from !== undefined && from !== null && to !== undefined && to !== null) {
      this.conditions.push({
        field,
        operator: 'between',
        value: { from, to },
      });
    }
    return this;
  }

  /**
   * Agregar filtro IN (valor en lista)
   * @param field Campo a filtrar
   * @param values Array de valores
   * @returns this para chaining
   *
   * Ejemplo: .in('estado', ['pendiente', 'activo'])
   */
  in(field: string, values: any[]): this {
    if (Array.isArray(values) && values.length > 0) {
      this.conditions.push({
        field,
        operator: 'in',
        value: values,
      });
    }
    return this;
  }

  /**
   * Agregar filtro NOT IN (valor NO en lista)
   * @param field Campo a filtrar
   * @param values Array de valores
   * @returns this para chaining
   *
   * Ejemplo: .notIn('estado', ['eliminado', 'cancelado'])
   */
  notIn(field: string, values: any[]): this {
    if (Array.isArray(values) && values.length > 0) {
      this.conditions.push({
        field,
        operator: 'nin',
        value: values,
      });
    }
    return this;
  }

  /**
   * Limpiar todos los filtros
   * @returns this para chaining
   */
  clear(): this {
    this.conditions = [];
    return this;
  }

  /**
   * Contar cantidad de filtros agregados
   */
  count(): number {
    return this.conditions.length;
  }

  /**
   * Verificar si hay filtros agregados
   */
  isEmpty(): boolean {
    return this.conditions.length === 0;
  }

  /**
   * Obtener array de condiciones
   */
  getConditions(): FilterCondition[] {
    return this.conditions;
  }

  /**
   * Construir objeto de filtros para enviar a API/Service
   * Retorna objeto plano optimizado para URLSearchParams
   *
   * Ejemplo:
   * { estado: 'activo', 'localidad_id': 5 }
   */
  build(): Record<string, any> {
    const result: Record<string, any> = {};

    for (const condition of this.conditions) {
      // Para operadores simples, guardar valor directo
      if (condition.operator === 'eq') {
        result[condition.field] = condition.value;
      }
      // Para operadores complejos, guardar con prefijo
      else if (condition.operator === 'ne') {
        result[`${condition.field}__ne`] = condition.value;
      } else if (condition.operator === 'gt') {
        result[`${condition.field}__gt`] = condition.value;
      } else if (condition.operator === 'gte') {
        result[`${condition.field}__gte`] = condition.value;
      } else if (condition.operator === 'lt') {
        result[`${condition.field}__lt`] = condition.value;
      } else if (condition.operator === 'lte') {
        result[`${condition.field}__lte`] = condition.value;
      } else if (condition.operator === 'like') {
        result[`${condition.field}__like`] = condition.value;
      } else if (condition.operator === 'ilike') {
        result[`${condition.field}__ilike`] = condition.value;
      } else if (condition.operator === 'in') {
        result[`${condition.field}__in`] = condition.value.join(',');
      } else if (condition.operator === 'between') {
        result[`${condition.field}__from`] = condition.value.from;
        result[`${condition.field}__to`] = condition.value.to;
      }
    }

    return result;
  }

  /**
   * Construir QueryString para URL
   *
   * Ejemplo: "estado=activo&localidad_id=5"
   */
  buildQueryString(): string {
    const params = new URLSearchParams();
    const filters = this.build();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });

    return params.toString();
  }

  /**
   * Construir URL completa con filtros
   *
   * Ejemplo: "/clientes?estado=activo&localidad_id=5"
   */
  buildUrl(baseUrl: string): string {
    const qs = this.buildQueryString();
    return qs ? `${baseUrl}?${qs}` : baseUrl;
  }
}

/**
 * Función helper para crear FilterBuilder
 *
 * Uso:
 * const filters = createFilters()
 *   .add('estado', 'activo')
 *   .like('nombre', 'juan')
 *   .build();
 */
export function createFilters(): FilterBuilder {
  return new FilterBuilder();
}
