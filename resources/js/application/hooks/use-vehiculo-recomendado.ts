import { useState, useEffect } from 'react';
import type { VentaConDetalles } from '@/domain/entities/entregas';
import type { VehicleRecommendationResponse, VehiculoRecomendado } from '@/domain/entities/vehiculos';
import type { Id } from '@/domain/entities/shared';

interface UseVehiculoRecomendadoState {
  recomendado: VehiculoRecomendado | null;
  disponibles: VehiculoRecomendado[];
  pesoTotal: number;
  isLoading: boolean;
  error: string | null;
  alerta: string | null;
}

/**
 * Hook para obtener recomendación de vehículo basado en ventas seleccionadas
 *
 * @param selectedVentaIds IDs de ventas seleccionadas
 * @param ventas Lista de ventas disponibles (para calcular peso total)
 * @param autoSelect Si es true, auto-selecciona el vehículo recomendado
 * @param onVehiculoSelected Callback cuando se selecciona un vehículo
 */
export function useVehiculoRecomendado(
  selectedVentaIds: Id[],
  ventas: VentaConDetalles[],
  autoSelect?: boolean,
  onVehiculoSelected?: (vehiculoId: Id) => void
) {
  const [state, setState] = useState<UseVehiculoRecomendadoState>({
    recomendado: null,
    disponibles: [],
    pesoTotal: 0,
    isLoading: false,
    error: null,
    alerta: null,
  });

  useEffect(() => {
    // Si no hay ventas seleccionadas, limpiar recomendación
    if (selectedVentaIds.length === 0) {
      console.log('🚫 Recomendación limpiada - No hay ventas seleccionadas');
      setState({
        recomendado: null,
        disponibles: [],
        pesoTotal: 0,
        isLoading: false,
        error: null,
        alerta: null,
      });
      return;
    }

    // Calcular peso total
    const selectedVentas = ventas.filter((v) => selectedVentaIds.includes(v.id));

    // ✅ NUEVO: Si hay ventas seleccionadas pero NO están en el array (búsqueda manual),
    // hacer fetch automático para obtenerlas
    const ventasNoEncontradas = selectedVentaIds.filter(
      id => !ventas.some(v => v.id === id)
    );

    if (ventasNoEncontradas.length > 0) {
      console.log('🔍 [useVehiculoRecomendado] Ventas seleccionadas no encontradas en array, buscando...', {
        ids_no_encontradas: ventasNoEncontradas,
      });

      // Hacer fetch por cada venta no encontrada
      Promise.all(
        ventasNoEncontradas.map(id =>
          fetch(`/logistica/entregas/ventas/search?q=${id}`)
            .then(res => res.json())
            .then(data => data.data?.[0])
        )
      )
        .then(ventasCargadas => {
          const ventasFiltradas = ventasCargadas.filter(Boolean);
          console.log('✅ [useVehiculoRecomendado] Ventas cargadas dinámicamente:', {
            cantidad: ventasFiltradas.length,
            ids: ventasFiltradas.map(v => v.id),
            pesos: ventasFiltradas.map(v => v.peso_total_estimado),
          });

          // Combinar con las ventas encontradas
          const todasLasVentas = [...selectedVentas, ...ventasFiltradas];
          const pesoTotalCalculado = todasLasVentas.reduce(
            (sum, v) => sum + (v.peso_total_estimado || v.peso_estimado || 0),
            0
          );

          if (pesoTotalCalculado > 0) {
            fetchRecomendacion(pesoTotalCalculado);
          } else {
            setState((prev) => ({
              ...prev,
              error: 'No se pudo calcular el peso total de las ventas',
            }));
          }
        })
        .catch(err => {
          console.error('❌ Error cargando ventas dinámicamente:', err);
          setState((prev) => ({
            ...prev,
            error: 'Error al cargar las ventas',
          }));
        });
      return;
    }

    const pesoTotal = selectedVentas.reduce((sum, v) => sum + (v.peso_total_estimado || v.peso_estimado || 0), 0);

    console.log('📊 Calculando recomendación:', {
      ventasCount: selectedVentaIds.length,
      ventaIds: selectedVentaIds,
      pesoTotal,
      detalle: selectedVentas.map(v => ({
        numero_venta: v.numero_venta,
        peso_total_estimado: v.peso_total_estimado || v.peso_estimado,
      }))
    });

    if (pesoTotal <= 0) {
      console.log('❌ Peso total <= 0, no se puede calcular recomendación');
      setState((prev) => ({
        ...prev,
        error: 'No se pudo calcular el peso total',
      }));
      return;
    }

    // Fetch recomendación
    fetchRecomendacion(pesoTotal);
  }, [selectedVentaIds, ventas]);

  const fetchRecomendacion = async (pesoTotal: number) => {
    console.log('🔄 Iniciando búsqueda de vehículo recomendado...');
    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
      alerta: null,
    }));

    try {
      console.log('🚀 Llamada POST a /api/vehiculos/sugerir con:', {
        peso_total: pesoTotal,
        venta_ids: selectedVentaIds
      });

      const response = await fetch('/api/vehiculos/sugerir', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(),
        },
        body: JSON.stringify({
          peso_total: pesoTotal,
          venta_ids: selectedVentaIds,
        }),
      });

      console.log('📨 Respuesta recibida - Status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error en respuesta:', { status: response.status, errorText });
        throw new Error(`Error: ${response.status}`);
      }

      const data: VehicleRecommendationResponse = await response.json();

      console.log('✨ Datos de recomendación recibidos:', {
        success: data.success,
        message: data.message,
        recomendado: data.data.recomendado ? {
          id: data.data.recomendado.id,
          placa: data.data.recomendado.placa,
          marca: data.data.recomendado.marca,
          modelo: data.data.recomendado.modelo,
          capacidad_kg: data.data.recomendado.capacidad_kg,
          porcentaje_uso: data.data.recomendado.porcentaje_uso,
          choferAsignado: data.data.recomendado.choferAsignado,
        } : null,
        disponibles_count: (data.data.disponibles || []).length,
        peso_total: data.data.peso_total,
        alerta: data.data.alerta,
      });

      // Log detallado del chofer asignado para debugging
      if (data.data.recomendado) {
        if (data.data.recomendado.choferAsignado) {
          console.log('✅ Chofer Asignado encontrado:', {
            id: data.data.recomendado.choferAsignado.id,
            name: data.data.recomendado.choferAsignado.name,
            nombre: data.data.recomendado.choferAsignado.nombre,
            telefono: data.data.recomendado.choferAsignado.telefono,
          });
        } else {
          console.warn('⚠️ Vehículo recomendado NO tiene choferAsignado (es null/undefined)');
          console.warn('Objeto completo del recomendado:', JSON.stringify(data.data.recomendado, null, 2));
        }
      }

      setState((prev) => ({
        ...prev,
        recomendado: data.data.recomendado,
        disponibles: data.data.disponibles || [],
        pesoTotal: data.data.peso_total,
        isLoading: false,
        error: null,
        alerta: data.data.alerta || null,
      }));

      // Auto-seleccionar si existe recomendado y autoSelect es true
      if (autoSelect && data.data.recomendado && onVehiculoSelected) {
        console.log('🎯 Auto-seleccionando vehículo recomendado:', data.data.recomendado.id);
        onVehiculoSelected(data.data.recomendado.id);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al obtener recomendación';
      console.error('❌ Error en useVehiculoRecomendado:', err);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
    }
  };

  const getCsrfToken = (): string => {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta?.getAttribute('content') || '';
  };

  return {
    recomendado: state.recomendado,
    disponibles: state.disponibles,
    pesoTotal: state.pesoTotal,
    isLoading: state.isLoading,
    error: state.error,
    alerta: state.alerta,
  };
}
