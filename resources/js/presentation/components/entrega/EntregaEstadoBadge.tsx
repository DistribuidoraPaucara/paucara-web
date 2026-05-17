/**
 * Badge de Estado para Entregas
 *
 * Componente con integración completa a estados centralizados (Fase 3).
 * Usa hooks dinámicos para obtener datos desde la API.
 * Fallback automático a datos hardcodeados si el hook no está disponible.
 *
 * @phase Fase 3.6: Refactorización con hooks dinámicos
 */

import { useMemo, useEffect } from 'react';
import { useEstados } from '@/application/hooks';
import { getEstadoLabel, getEstadoIcon, getEstadoBgColor } from '@/lib/entregas.utils';

interface EntregaEstadoBadgeProps {
  estado: string;
  showIcon?: boolean;
  className?: string;
}

/**
 * Componente Badge para mostrar el estado de una entrega
 *
 * Usa hook dinámico para obtener información del estado desde la API.
 * Fallback automático a utils hardcodeadas si los datos no están disponibles.
 *
 * @example
 * <EntregaEstadoBadge estado="ENTREGADO" showIcon={true} />
 *
 * @example
 * // Dentro de EstadosProvider (Fase 3)
 * <EstadosProvider>
 *   <EntregaEstadoBadge estado="ENTREGADO" />
 * </EstadosProvider>
 */
export function EntregaEstadoBadge({
  estado,
  showIcon = true,
  className
}: EntregaEstadoBadgeProps) {
  // ✅ MEJORADO: Usar useEstados('entrega') sin filtro onlyActive para obtener TODOS los estados de la BD
  // (useEstadosEntregas() filtra solo activos, lo cual puede perder estados)
  const { estados: estadosAPI, getEstadoPorCodigo } = useEstados('entrega', {
    onlyActive: false, // ✅ Obtener TODOS los estados, no solo activos
  });

  // ✅ DEBUG: Verificar que se obtiene el estado correctamente
  useEffect(() => {
    // ✅ IMPORTANTE: Solo verificar si ya tenemos estados cargados
    if (estadosAPI.length === 0) {
      console.log(`⏳ [EntregaEstadoBadge] Estados aún cargando para código "${estado}"...`);
      return;
    }

    const estadoEncontrado = getEstadoPorCodigo(estado);
    if (estadoEncontrado) {
      console.log(`✅ [EntregaEstadoBadge] Estado encontrado para código "${estado}":`, {
        nombre: estadoEncontrado.nombre,
        color: estadoEncontrado.color,
        codigo: estadoEncontrado.codigo,
      });
    } else {
      console.warn(`⚠️ [EntregaEstadoBadge] Estado NO encontrado para código "${estado}" (${estadosAPI.length} estados disponibles) - usando fallback`);
    }
  }, [estado, getEstadoPorCodigo, estadosAPI]);

  // Obtener información dinámica del estado desde BD
  const memoizedContent = useMemo(() => {
    // Buscar el estado en estadosAPI
    const estadoEncontrado = estadosAPI.find(e => e.codigo === estado);

    if (estadoEncontrado) {
      // ✅ Usar los datos del estado desde la BD
      return {
        bgColor: getEstadoBgColor(estado), // Usar el color de utilities para Tailwind
        textColor: '',
        label: estadoEncontrado.nombre,
        icon: getEstadoIcon(estado),
        color: estadoEncontrado.color, // Color hex para estilos inline
        usesDbColor: true,
      };
    }

    // Fallback a funciones hardcodeadas si no hay información dinámica
    return {
      bgColor: getEstadoBgColor(estado),
      textColor: '',
      label: getEstadoLabel(estado),
      icon: getEstadoIcon(estado),
      color: undefined,
      usesDbColor: false,
    };
  }, [estado, estadosAPI]);

  return (
    <div
      className={`gap-2 flex items-center w-fit px-3 py-1 rounded-full font-medium text-sm ${memoizedContent.bgColor} ${className || ''}`}
      style={memoizedContent.usesDbColor && memoizedContent.color ? {
        backgroundColor: `${memoizedContent.color}20`,
        color: memoizedContent.color,
      } : undefined}
    >
      {showIcon && (
        <>
          {memoizedContent.icon}
        </>
      )}
      {memoizedContent.label}
    </div>
  );
}
