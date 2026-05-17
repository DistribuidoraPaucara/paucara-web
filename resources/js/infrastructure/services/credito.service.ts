/**
 * CreditoService - Service for credit management operations
 *
 * Handles:
 * - CRUD operations for credits
 * - Fetching client credit details with related accounts and payments
 * - Registering payments and updating credit balances
 * - Adjusting credit limits
 * - Searching and filtering credit records
 */

import { router } from '@inertiajs/react';
import { ExtendableService } from '@/infrastructure/services/extendable.service';
import NotificationService from '@/infrastructure/services/notification.service';
import type { Filters, Id } from '@/domain/entities/shared';
import type {
  Credito,
  CreditoFormData,
  CuentaPorCobrar,
  Pago,
  ClienteCreditoDetalles,
  CreditoResumen,
} from '@/domain/entities/credito';
import type {
  RegistrarPagoPayload,
  AjustarLimitePayload,
  CreditoFilters,
  RegistrarPagoResponse,
} from '@/types/credito.types';

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

export class CreditoService extends ExtendableService<Credito, CreditoFormData> {
  constructor() {
    super('creditos');
  }

  // ============================================
  // URL Methods (Abstract implementation)
  // ============================================

  indexUrl(params?: { query?: Filters }): string {
    return `/creditos${buildQuery(params)}`;
  }

  createUrl(): string {
    return '/creditos/crear';
  }

  editUrl(id: Id): string {
    return `/creditos/${id}/editar`;
  }

  storeUrl(): string {
    return '/creditos';
  }

  updateUrl(id: Id): string {
    return `/creditos/${id}`;
  }

  destroyUrl(id: Id): string {
    return `/creditos/${id}`;
  }

  // ============================================
  // Special Methods for Credit Operations
  // ============================================

  /**
   * Get detailed credit information for a client
   * Includes related accounts and payment history
   */
  async obtenerDetalles(clienteId: Id): Promise<ClienteCreditoDetalles> {
    try {
      const response = await fetch(`/api/clientes/${clienteId}/credito-detalles`);
      if (!response.ok) {
        throw new Error(`Failed to fetch credit details for client ${clienteId}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching credit details:', error);
      throw error;
    }
  }

  /**
   * Get complete client credit details with all related data
   * Returns: { data: { cliente, credito, cuentas_pendientes, historial_pagos, auditoria } }
   */
  async obtenerDetallesCliente(clienteId: Id): Promise<{ data: any }> {
    try {
      const response = await fetch(`/api/clientes/${clienteId}/credito/detalles`);
      if (!response.ok) {
        throw new Error(`Failed to fetch client credit details for client ${clienteId}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching client credit details:', error);
      throw error;
    }
  }

  /**
   * Get summary credit info for a client
   * Used for dashboard widgets and quick overview
   */
  async obtenerResumen(clienteId: Id): Promise<CreditoResumen> {
    try {
      const response = await fetch(`/api/creditos/cliente/${clienteId}/resumen`);
      if (!response.ok) {
        throw new Error(`Failed to fetch credit summary for client ${clienteId}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching credit summary:', error);
      throw error;
    }
  }

  /**
   * Get pending accounts for a client
   */
  async obtenerCuentasPendientes(clienteId: Id): Promise<CuentaPorCobrar[]> {
    try {
      const response = await fetch(`/api/clientes/${clienteId}/cuentas-pendientes`);
      if (!response.ok) {
        throw new Error(`Failed to fetch pending accounts for client ${clienteId}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching pending accounts:', error);
      throw error;
    }
  }

  /**
   * Get overdue accounts for a client
   */
  async obtenerCuentasVencidas(clienteId: Id): Promise<CuentaPorCobrar[]> {
    try {
      const response = await fetch(`/api/clientes/${clienteId}/cuentas-vencidas`);
      if (!response.ok) {
        throw new Error(`Failed to fetch overdue accounts for client ${clienteId}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching overdue accounts:', error);
      throw error;
    }
  }

  /**
   * Get payment history for a client
   */
  async obtenerHistorialPagos(clienteId: Id, limit: number = 10): Promise<Pago[]> {
    try {
      const response = await fetch(
        `/api/clientes/${clienteId}/pagos?limit=${limit}`
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch payment history for client ${clienteId}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw error;
    }
  }

  /**
   * Register a payment for a credit account
   * This will:
   * - Create the payment record
   * - Update account balance
   * - Update client credit balance
   * - Trigger real-time WebSocket notification
   */
  async registrarPago(clienteId: Id, payload: RegistrarPagoPayload): Promise<RegistrarPagoResponse> {
    const loadingToast = NotificationService.loading('Registrando pago...');

    try {
      const response = await fetch(`/api/clientes/${clienteId}/registrar-pago`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.getCsrfToken(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register payment');
      }

      const result: RegistrarPagoResponse = await response.json();

      NotificationService.dismiss(loadingToast);
      if (result.success) {
        NotificationService.success({
          title: 'Pago Registrado',
          message: `Pago de Bs. ${payload.monto} registrado exitosamente`,
        });
      }

      return result;
    } catch (error) {
      NotificationService.dismiss(loadingToast);
      const message =
        error instanceof Error ? error.message : 'Error al registrar el pago';
      NotificationService.error(message);
      throw error;
    }
  }

  /**
   * Adjust the credit limit for a client
   * Requires manager or admin role
   */
  async ajustarLimite(clienteId: Id, payload: AjustarLimitePayload): Promise<Credito> {
    const loadingToast = NotificationService.loading('Ajustando límite de crédito...');

    try {
      const response = await fetch(`/api/clientes/${clienteId}/ajustar-limite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': this.getCsrfToken(),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to adjust credit limit');
      }

      const result = await response.json();

      NotificationService.dismiss(loadingToast);
      if (result.success || result.data) {
        const data = result.data || result;
        NotificationService.success({
          title: 'Límite Ajustado',
          message: `Nuevo límite: Bs. ${data.limite_credito_aprobado}`,
        });
      }

      return result.data || result;
    } catch (error) {
      NotificationService.dismiss(loadingToast);
      const message =
        error instanceof Error ? error.message : 'Error al ajustar el límite';
      NotificationService.error(message);
      throw error;
    }
  }

  /**
   * Get credit statistics
   * Dashboard metrics like total credit, utilization, etc.
   */
  async obtenerEstadisticas() {
    try {
      const response = await fetch('/api/creditos/estadisticas');
      if (!response.ok) {
        throw new Error('Failed to fetch credit statistics');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching credit statistics:', error);
      throw error;
    }
  }

  /**
   * Export credit report
   */
  async exportarReporte(formato: 'pdf' | 'excel', filters?: CreditoFilters) {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('formato', formato);

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, String(value));
          }
        });
      }

      const response = await fetch(
        `/api/creditos/exportar?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error('Failed to export credit report');
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `creditos-reporte.${formato === 'pdf' ? 'pdf' : 'xlsx'}`;
      link.click();
      window.URL.revokeObjectURL(url);

      NotificationService.success('Reporte descargado exitosamente');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Error al exportar reporte';
      NotificationService.error(message);
      throw error;
    }
  }

  /**
   * Validate credit data before submission
   */
  async validateData(data: CreditoFormData): Promise<string[]> {
    const errors: string[] = [];

    // Validate cliente_id
    if (!data.cliente_id) {
      errors.push('Cliente es requerido');
    }

    // Validate credit limit
    if (!data.limite_credito_aprobado) {
      errors.push('Límite de crédito es requerido');
    } else if (data.limite_credito_aprobado <= 0) {
      errors.push('Límite de crédito debe ser mayor a 0');
    }

    return errors;
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Get CSRF token from DOM for API requests
   */
  private getCsrfToken(): string {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? (meta.getAttribute('content') || '') : '';
  }
}

// Export singleton instance
export const creditoService = new CreditoService();
