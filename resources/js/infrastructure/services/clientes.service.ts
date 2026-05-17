/**
 * ClientesService - Data Layer mejorado con ExtendableService
 *
 * MEJORAS FASE 5.4:
 * - Extiende ExtendableService para hooks de validación
 * - Registra hooks para pre-procesamiento (trim, normalize)
 * - Usa FormValidator para validadores composables
 * - SIN ROMPER: componentes, configuración, especialidades
 *
 * Preservado intacto:
 * - URL builders (indexUrl, createUrl, editUrl, etc.)
 * - loadLocalidadOptions() para cargar localidades
 * - Validación de email + NIT + nombre
 */

import { ExtendableService } from '@/infrastructure/services/extendable.service';
import { FormValidator, Validators } from '@/infrastructure/services/form-validator';
import type { Filters, Id } from '@/domain/entities/shared';
import type { Cliente, ClienteFormData } from '@/domain/entities/clientes';
import type { Localidad } from '@/domain/entities/localidades';
import localidadesService from '@/infrastructure/services/localidades.service';

function buildQuery(params?: { query?: Filters }) {
  const qs = new URLSearchParams();
  const q = params?.query ?? {};
  Object.entries(q).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      qs.append(key, String(value));
    }
  });
  const str = qs.toString();
  return str ? `?${str}` : '';
}

export class ClientesService extends ExtendableService<Cliente, ClienteFormData> {
  private validator: FormValidator<ClienteFormData>;

  constructor() {
    super('clientes');

    // 1️⃣ Configurar validadores composables
    this.validator = new FormValidator<ClienteFormData>()
      .addRule('nombre', Validators.required('Nombre es requerido'))
      .addRule('nombre', Validators.maxLength(255, 'Nombre no puede exceder 255 caracteres'))
      .addRule('email', Validators.email('Formato de email no válido'))
      .addRule('nit', Validators.custom((value) => {
        if (value && String(value).length > 255) {
          return 'NIT no puede exceder 255 caracteres';
        }
        return null;
      }))
      .addRule('localidad_id', Validators.required('Localidad es requerida'));

    // 2️⃣ Hook: Pre-procesamiento antes de validación (trim, normalize)
    this.onBeforeValidate((data) => {
      // Trim espacios en blanco
      if (data.nombre) data.nombre = data.nombre.trim();
      if (data.razon_social) data.razon_social = data.razon_social.trim();

      // Normalizar email (trim + lowercase)
      if (data.email) {
        data.email = data.email.trim().toLowerCase();
      }

      // Trim NIT
      if (data.nit) data.nit = data.nit.trim();

      // Trim teléfono
      if (data.telefono) data.telefono = data.telefono.trim();

      return data;
    });

    // 3️⃣ Hook: Post-validación para logging
    this.onAfterValidate((data, errors) => {
      if (errors.length === 0) {
        console.log('✅ Cliente validado:', data.nombre);
      } else {
        console.warn('⚠️ Errores de validación en cliente:', errors);
      }
      return errors;
    });
  }

  // ============================================
  // URL Builders (SIN CAMBIOS - Preservado)
  // ============================================
  indexUrl(params?: { query?: Filters }) {
    return `/clientes${buildQuery(params)}`;
  }

  createUrl() {
    return '/clientes/create';
  }

  editUrl(id: Id) {
    return `/clientes/${id}/edit`;
  }

  storeUrl() {
    return '/clientes';
  }

  updateUrl(id: Id) {
    return `/clientes/${id}`;
  }

  destroyUrl(id: Id) {
    return `/clientes/${id}`;
  }

  // ============================================
  // Método especial: Cargar opciones de localidades
  // (SIN CAMBIOS - Preservado exacto)
  // ============================================
  async loadLocalidadOptions() {
    try {
      const localidades = await localidadesService.getActiveLocalidades();
      return localidades.map((localidad: Localidad) => ({
        value: localidad.id,
        label: `${localidad.nombre} (${localidad.codigo})`,
      }));
    } catch (error) {
      console.error('Error loading localidad options:', error);
      return [];
    }
  }

  // ============================================
  // Validación: Usa FormValidator composable
  // ============================================
  async validateData(data: ClienteFormData): Promise<string[]> {
    return await this.validator.validateAsync(data);
  }

  // ============================================
  // Preparación de datos antes de enviar al backend
  // ============================================
  prepareDataForBackend(data: ClienteFormData): ClienteFormData {
    const preparedData = { ...data };

    // 🔐 IMPORTANTE: Si password está vacío, remover ambos campos (password y password_confirmation)
    // Esto asegura que en edición, si el usuario no ingresa password, no cambie la contraseña
    if (!preparedData.password || preparedData.password.trim() === '') {
      (preparedData as any).password = null;
      (preparedData as any).password_confirmation = null;
    } else if (preparedData.password && !preparedData.password_confirmation) {
      // Si ingresó password pero no confirmó, usar el mismo password como confirmación
      // (El backend validará que coincidan)
      preparedData.password_confirmation = preparedData.password;
    }

    // ✅ NUEVO: Permitir enviar limite_credito como null
    // Marcar que este campo debe ser enviado aunque sea null
    if (preparedData.limite_credito === null || preparedData.limite_credito === undefined) {
      (preparedData as any).__allowNullFields = (preparedData as any).__allowNullFields || [];
      (preparedData as any).__allowNullFields.push('limite_credito');
    }

    // ✅ NUEVO: Convertir categorias_ids a array si viene como valor único
    // El select envía un valor único, pero el backend espera un array
    if ((preparedData as any).categorias_ids !== undefined && (preparedData as any).categorias_ids !== null) {
      const categoriasValue = (preparedData as any).categorias_ids;

      if (!Array.isArray(categoriasValue)) {
        // Si es un número o string, convertir a array
        if (categoriasValue === '' || categoriasValue === 0) {
          (preparedData as any).categorias_ids = [];
        } else {
          (preparedData as any).categorias_ids = [Number(categoriasValue)];
        }
      }

      console.log('🔄 categorias_ids transformado:', {
        original: categoriasValue,
        transformed: (preparedData as any).categorias_ids
      });
    } else {
      // Si no viene categorias_ids, enviar array vacío
      (preparedData as any).categorias_ids = [];
    }

    // Normalizar ventanas de entrega: asegurar que las horas estén en formato HH:MM
    if (Array.isArray(preparedData.ventanas_entrega)) {
      preparedData.ventanas_entrega = preparedData.ventanas_entrega.map((ventana) => {
        const normalized = { ...ventana };

        // Normalizar hora_inicio
        if (normalized.hora_inicio && typeof normalized.hora_inicio === 'string') {
          // Si viene como HH:MM:SS, tomar solo HH:MM
          if (normalized.hora_inicio.length > 5) {
            normalized.hora_inicio = normalized.hora_inicio.substring(0, 5);
          }
        }

        // Normalizar hora_fin
        if (normalized.hora_fin && typeof normalized.hora_fin === 'string') {
          // Si viene como HH:MM:SS, tomar solo HH:MM
          if (normalized.hora_fin.length > 5) {
            normalized.hora_fin = normalized.hora_fin.substring(0, 5);
          }
        }

        return normalized;
      });
    }

    return preparedData;
  }
}

export const clientesService = new ClientesService();
