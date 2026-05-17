import React, { createContext, useState, useCallback } from 'react';
import type { Proforma, PaymentData } from '@/domain/entities/proformas';
import type { CoordinacionData } from '@/application/hooks/use-proforma-actions';

export type ApprovalStep = 'idle' | 'coordination' | 'payment' | 'approving' | 'converting' | 'success' | 'error';

export interface ApprovalFlowState {
  // Estado del flujo
  step: ApprovalStep;
  loading: boolean;
  error: string | null;

  // Datos capturados
  coordinacion: CoordinacionData | null;
  payment: PaymentData | null;

  // Proforma procesada
  proforma: Proforma | null;
  proformaAprobada: Proforma | null;
  ventaCreada: any | null;

  // Timestamps para debugging
  startTime: number | null;
  endTime: number | null;
}

export interface ApprovalFlowContextType {
  state: ApprovalFlowState;

  // Acciones del flujo
  initFlow: (proforma: Proforma) => void;
  updateCoordinacion: (data: CoordinacionData) => void;
  updatePayment: (data: PaymentData) => void;
  setLoading: (loading: boolean, step: ApprovalStep) => void;
  setError: (error: string | null) => void;

  // Resultados
  setProformaAprobada: (proforma: Proforma) => void;
  setVentaCreada: (venta: any) => void;
  markAsSuccess: () => void;

  // Control
  reset: () => void;
  canProceedToPayment: () => boolean;
  canProceedToConversion: () => boolean;
}

const initialState: ApprovalFlowState = {
  step: 'idle',
  loading: false,
  error: null,
  coordinacion: null,
  payment: null,
  proforma: null,
  proformaAprobada: null,
  ventaCreada: null,
  startTime: null,
  endTime: null,
};

export const ApprovalFlowContext = createContext<ApprovalFlowContextType | undefined>(undefined);

interface ApprovalFlowProviderProps {
  children: React.ReactNode;
}

export function ApprovalFlowProvider({ children }: ApprovalFlowProviderProps) {
  const [state, setState] = useState<ApprovalFlowState>(initialState);

  const initFlow = useCallback((proforma: Proforma) => {
    console.log('%c📋 Iniciando flujo de aprobación', 'color: blue; font-weight: bold;', { proforma_id: proforma.id });
    setState((prev) => ({
      ...prev,
      step: 'coordination',
      loading: false,
      error: null,
      proforma,
      proformaAprobada: null,
      ventaCreada: null,
      startTime: Date.now(),
      endTime: null,
    }));
  }, []);

  const updateCoordinacion = useCallback((data: CoordinacionData) => {
    console.log('%c🔄 Actualizando coordinación', 'color: green;', data);
    setState((prev) => ({
      ...prev,
      coordinacion: data,
    }));
  }, []);

  const updatePayment = useCallback((data: PaymentData) => {
    console.log('%c💳 Actualizando datos de pago', 'color: green;', data);
    setState((prev) => ({
      ...prev,
      payment: data,
    }));
  }, []);

  const setLoading = useCallback((loading: boolean, step: ApprovalStep) => {
    console.log(`%c${loading ? '⏳' : '✅'} Estado: ${step}`, 'color: blue;');
    setState((prev) => ({
      ...prev,
      loading,
      step,
    }));
  }, []);

  const setError = useCallback((error: string | null) => {
    if (error) {
      console.error('%c❌ Error en flujo de aprobación:', 'color: red;', error);
    }
    setState((prev) => ({
      ...prev,
      error,
      step: error ? 'error' : prev.step,
      loading: false,
    }));
  }, []);

  const setProformaAprobada = useCallback((proforma: Proforma) => {
    console.log('%c✅ Proforma aprobada', 'color: green; font-weight: bold;', { proforma_id: proforma.id });
    setState((prev) => ({
      ...prev,
      proformaAprobada: proforma,
      step: 'converting',
    }));
  }, []);

  const setVentaCreada = useCallback((venta: any) => {
    console.log('%c🎉 Venta creada', 'color: green; font-weight: bold;', { venta_id: venta.id });
    setState((prev) => ({
      ...prev,
      ventaCreada: venta,
    }));
  }, []);

  const markAsSuccess = useCallback(() => {
    console.log('%c🎊 Flujo completado exitosamente', 'color: green; font-weight: bold;');
    setState((prev) => ({
      ...prev,
      step: 'success',
      loading: false,
      endTime: Date.now(),
    }));
  }, []);

  const reset = useCallback(() => {
    console.log('%c🔄 Reiniciando flujo de aprobación', 'color: blue;');
    setState(initialState);
  }, []);

  const canProceedToPayment = useCallback((): boolean => {
    // Verificar que coordinación esté completa
    const coord = state.coordinacion;
    if (!coord) return false;

    const isComplete =
      !!coord.fecha_entrega_confirmada &&
      !!coord.hora_entrega_confirmada;

    console.log('%c🔍 Validando si puede proceder a pago:', 'color: orange;', { isComplete });
    return isComplete;
  }, [state.coordinacion]);

  const canProceedToConversion = useCallback((): boolean => {
    // Verificar que proforma esté aprobada y tenga datos de pago (si los necesita)
    const hasApprovedProforma = !!state.proformaAprobada;
    const hasPaymentData = state.payment !== null;

    console.log('%c🔍 Validando si puede proceder a conversión:', 'color: orange;', {
      hasApprovedProforma,
      hasPaymentData,
    });

    return hasApprovedProforma;
  }, [state.proformaAprobada, state.payment]);

  const value: ApprovalFlowContextType = {
    state,
    initFlow,
    updateCoordinacion,
    updatePayment,
    setLoading,
    setError,
    setProformaAprobada,
    setVentaCreada,
    markAsSuccess,
    reset,
    canProceedToPayment,
    canProceedToConversion,
  };

  return <ApprovalFlowContext.Provider value={value}>{children}</ApprovalFlowContext.Provider>;
}
