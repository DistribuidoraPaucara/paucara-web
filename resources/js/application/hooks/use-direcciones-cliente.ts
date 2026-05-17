import { useState, useEffect } from 'react';

export interface Direccion {
  id: number;
  direccion: string;
  localidad?: string;
  observaciones?: string;
  es_principal?: boolean;
  activa?: boolean;
}

interface UseDireccionesClienteOptions {
  autoSelectIfOnlyOne?: boolean;
  onDireccionSelected?: (id: number) => void;
}

/**
 * Hook para cargar direcciones de un cliente
 *
 * Automáticamente:
 * - Carga direcciones del cliente desde /api/clientes/{id}/direcciones
 * - Filtra solo direcciones activas
 * - Auto-selecciona la primera dirección si solo hay una (opcional)
 * - Maneja loading y errores
 */
export function useDireccionesCliente(
  clienteId: number | null,
  options: UseDireccionesClienteOptions = {}
) {
  const { autoSelectIfOnlyOne = true, onDireccionSelected } = options;
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // ✅ CORREGIDO: Validar que clienteId sea un número válido, no una cadena
    const numericId = typeof clienteId === 'number' ? clienteId : Number(clienteId);
    if (!numericId || isNaN(numericId) || numericId <= 0) {
      setDirecciones([]);
      setError(null);
      return;
    }

    setCargando(true);
    setError(null);

    const cargarDirecciones = async () => {
      try {
        const response = await fetch(`/api/clientes/${numericId}/direcciones`);

        if (!response.ok) {
          throw new Error('Error cargando direcciones');
        }

        const result = await response.json();

        if (result.success && result.data?.direcciones) {
          // Filtrar solo direcciones activas
          const direccionesActivas = result.data.direcciones.filter(
            (d: any) => d.activa !== false
          );

          setDirecciones(direccionesActivas);

          // Auto-seleccionar si solo hay una
          if (autoSelectIfOnlyOne && direccionesActivas.length === 1) {
            onDireccionSelected?.(direccionesActivas[0].id);
          }
        } else {
          setDirecciones([]);
        }
      } catch (err) {
        console.error('Error cargando direcciones:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        setDirecciones([]);
      } finally {
        setCargando(false);
      }
    };

    cargarDirecciones();
  }, [clienteId, onDireccionSelected]);

  return { direcciones, cargando, error };
}
