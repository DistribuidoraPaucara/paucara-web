// Application Layer: Hook para gestión de tipos de operación de caja
import { useState, useCallback } from 'react';
import tipoOperacionCajaService from '@/infrastructure/services/tipo-operacion-caja.service';
import type { TipoOperacionCaja, TipoOperacionCajaFormData } from '@/domain/entities/tipo-operacion-caja';
import type { Id } from '@/domain/entities/shared';

export function useTipoOperacionCaja() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = useCallback(async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      return await tipoOperacionCajaService.getAll(filters);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar tipos de operación';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getById = useCallback(async (id: Id) => {
    setLoading(true);
    setError(null);
    try {
      return await tipoOperacionCajaService.getById(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cargar tipo de operación';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const create = useCallback(async (data: TipoOperacionCajaFormData) => {
    setLoading(true);
    setError(null);
    try {
      return await tipoOperacionCajaService.create(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear tipo de operación';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback(async (id: Id, data: TipoOperacionCajaFormData) => {
    setLoading(true);
    setError(null);
    try {
      return await tipoOperacionCajaService.update(id, data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar tipo de operación';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const remove = useCallback(async (id: Id) => {
    setLoading(true);
    setError(null);
    try {
      return await tipoOperacionCajaService.delete(id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar tipo de operación';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove,
  };
}
