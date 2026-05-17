/**
 * ProductosService - Data Layer mejorado con ExtendableService
 *
 * MEJORAS FASE 5.4:
 * - Extiende ExtendableService para hooks
 * - Usa FormValidator con ProductoValidators composables
 * - Validación centralizada en ProductoValidators
 * - SIN ROMPER: tablaPrecios, tablaCodigos, filtros avanzados
 *
 * Preservado intacto:
 * - URL builders usando Controllers
 * - Validación de códigos y precios en arrays
 * - Comportamiento exacto igual
 */

import Controllers from '@/actions/App/Http/Controllers';
import { ExtendableService } from '@/infrastructure/services/extendable.service';
import { FormValidator, Validators } from '@/infrastructure/services/form-validator';
import { ProductoValidators, validateCodigosBarra, validatePrecios } from '@/domain/entities/productos/validators';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Producto, ProductoFormData } from '@/domain/entities/productos';

export class ProductosService extends ExtendableService<Producto, ProductoFormData> {
  private validator: FormValidator<ProductoFormData>;

  constructor() {
    super('productos');

    // 1️⃣ Configurar validadores composables base
    this.validator = new FormValidator<ProductoFormData>()
      .addRule('nombre', ProductoValidators.nombre)
      .addRule('categoria_id', ProductoValidators.categoria)
      .addRule('unidad_medida_id', ProductoValidators.unidadMedida)
      .addRule('peso', ProductoValidators.peso)
      .addRule('sku', ProductoValidators.sku)
      .addRule('descripcion', ProductoValidators.descripcion);

    // 2️⃣ Hook: Validación dinámica de arrays (códigos y precios)
    this.onBeforeValidate((data) => {
      // Pre-procesar: Trim de SKU
      if (data.sku) data.sku = data.sku.trim();

      // Pre-procesar: Descripción
      if (data.descripcion) data.descripcion = data.descripcion.trim();

      return data;
    });

    // 3️⃣ Hook: Validaciones de array dinámicas
    this.onAfterValidate((data, errors) => {
      // Validar array de códigos de barras
      const codigosErrors = validateCodigosBarra(data.codigos || []);
      errors.push(...codigosErrors);

      // Validar array de precios
      const preciosErrors = validatePrecios(data.precios || []);
      errors.push(...preciosErrors);

      // Log de resultado
      if (errors.length === 0) {
        console.log('✅ Producto validado:', data.nombre);
      } else {
        console.warn('⚠️ Errores de validación en producto:', errors);
      }

      return errors;
    });
  }

  // ============================================
  // URL Builders (SIN CAMBIOS - Preservado)
  // ============================================
  indexUrl(params?: { query?: Filters }): string {
    return Controllers.ProductoController.index(params).url;
  }

  createUrl(): string {
    return Controllers.ProductoController.create().url;
  }

  editUrl(id: Id): string {
    return Controllers.ProductoController.edit(Number(id)).url;
  }

  storeUrl(): string {
    return Controllers.ProductoController.store().url;
  }

  updateUrl(id: Id): string {
    return Controllers.ProductoController.update(Number(id)).url;
  }

  destroyUrl(id: Id): string {
    return Controllers.ProductoController.destroy(Number(id)).url;
  }

  // ============================================
  // Validación: Usa FormValidator + ProductoValidators
  // ============================================
  async validateData(data: ProductoFormData): Promise<string[]> {
    return await this.validator.validateAsync(data);
  }
}

const productosService = new ProductosService();
export default productosService;
