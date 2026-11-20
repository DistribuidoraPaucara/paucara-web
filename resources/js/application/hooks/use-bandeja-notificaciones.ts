import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

/**
 * Bandeja de notificaciones persistidas (tabla `notifications`).
 *
 * Fuente de verdad de la campana: hoy + no leídas anteriores. Los eventos en
 * tiempo real solo disparan un `refrescar()` (con debounce) para traer la
 * versión guardada en BD, que tiene id real y se puede marcar como leída.
 */

export type CategoriaNotificacion = 'proformas' | 'entregas' | 'creditos' | 'avisos';

export interface NotificacionBandeja {
  id: number;
  type: string;
  categoria: CategoriaNotificacion;
  titulo: string;
  mensaje: string;
  url: string | null;
  leida: boolean;
  created_at: string;
}

export interface ResumenVencidas {
  total: number;
  monto_total: number;
}

interface MetaBandeja {
  no_leidas: number;
  por_categoria: Record<CategoriaNotificacion, number>;
}

const META_VACIA: MetaBandeja = {
  no_leidas: 0,
  por_categoria: { proformas: 0, entregas: 0, creditos: 0, avisos: 0 },
};

export function useBandejaNotificaciones(enabled: boolean) {
  const [items, setItems] = useState<NotificacionBandeja[]>([]);
  const [meta, setMeta] = useState<MetaBandeja>(META_VACIA);
  const [vencidas, setVencidas] = useState<ResumenVencidas | null>(null);
  const [cargando, setCargando] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cargarBandeja = useCallback(async () => {
    try {
      setCargando(true);
      const { data } = await axios.get('/api/mis-notificaciones/bandeja', { params: { limit: 50 } });
      setItems(data.data ?? []);
      setMeta(data.meta ?? META_VACIA);
    } catch (e) {
      console.warn('No se pudo cargar la bandeja de notificaciones', e);
    } finally {
      setCargando(false);
    }
  }, []);

  const cargarVencidas = useCallback(async () => {
    try {
      const { data } = await axios.get('/api/alertas/cuentas-vencidas');
      setVencidas({ total: data.total ?? 0, monto_total: data.monto_total ?? 0 });
    } catch {
      // Sin permiso o sin cuentas: simplemente no se muestra la tarjeta
      setVencidas(null);
    }
  }, []);

  /** Recarga con debounce (varios eventos seguidos = una sola petición). */
  const refrescar = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    // Pequeña espera: el backend guarda en BD y emite por WebSocket casi a la vez
    debounceRef.current = setTimeout(cargarBandeja, 800);
  }, [cargarBandeja]);

  const marcarLeida = useCallback(async (id: number) => {
    const item = items.find((n) => n.id === id);
    if (!item || item.leida) return;

    // Optimista
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, leida: true } : n)));
    setMeta((prev) => ({
      no_leidas: Math.max(0, prev.no_leidas - 1),
      por_categoria: {
        ...prev.por_categoria,
        [item.categoria]: Math.max(0, prev.por_categoria[item.categoria] - 1),
      },
    }));

    try {
      await axios.post(`/api/mis-notificaciones/${id}/marcar-leida`);
    } catch {
      cargarBandeja(); // revertir al estado real
    }
  }, [items, cargarBandeja]);

  const marcarTodasLeidas = useCallback(async () => {
    setItems((prev) => prev.map((n) => ({ ...n, leida: true })));
    setMeta(META_VACIA);
    try {
      await axios.post('/api/mis-notificaciones/marcar-todas-leidas');
    } catch {
      cargarBandeja();
    }
  }, [cargarBandeja]);

  useEffect(() => {
    if (!enabled) return;
    cargarBandeja();
    cargarVencidas();
    // Las vencidas cambian poco: refrescar cada 10 minutos
    const t = setInterval(cargarVencidas, 10 * 60 * 1000);
    return () => {
      clearInterval(t);
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [enabled, cargarBandeja, cargarVencidas]);

  return {
    items,
    noLeidas: meta.no_leidas,
    porCategoria: meta.por_categoria,
    vencidas,
    cargando,
    refrescar,
    recargar: cargarBandeja,
    marcarLeida,
    marcarTodasLeidas,
  };
}
