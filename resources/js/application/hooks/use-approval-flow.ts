import { useContext } from 'react';
import { ApprovalFlowContext, type ApprovalFlowContextType } from '@/application/contexts/ApprovalFlowContext';

/**
 * Hook para acceder al contexto de flujo de aprobación
 *
 * Retorna null si se usa fuera de ApprovalFlowProvider (en lugar de lanzar error)
 * para evitar romper el componente si el provider no está disponible.
 *
 * @returns ApprovalFlowContextType | null
 *
 * @example
 * const approvalFlow = useApprovalFlow();
 *
 * if (approvalFlow) {
 *   approvalFlow.initFlow(proforma);
 *   approvalFlow.updateCoordinacion(coordinacionData);
 * }
 */
export function useApprovalFlow(): ApprovalFlowContextType | null {
  const context = useContext(ApprovalFlowContext);
  return context || null;
}
