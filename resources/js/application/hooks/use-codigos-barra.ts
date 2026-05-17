// Application Layer: Hook para lógica de códigos de barra
import { useState, useCallback, useMemo } from 'react';
import { router } from '@inertiajs/react';
import type { CodigoBarra, CodigoBarraFormData } from '@/domain/entities/codigos-barra';
import codigosBarraService from '@/infrastructure/services/codigos-barra.service';
import type { Filters } from '@/domain/entities/shared';

export function useCodigosBarra(productoId: number | null = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCodigos, setSelectedCodigos] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null);

  // Búsqueda de códigos de barra
  const searchCodigos = useCallback((filters: Filters) => {
    setIsLoading(true);
    setError(null);
    try {
      codigosBarraService.search(filters);
      setTimeout(() => setIsLoading(false), 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error en búsqueda');
      setIsLoading(false);
    }
  }, []);

  // Eliminar código de barra con confirmación
  const deleteCodigoM = useCallback((codigo: CodigoBarra) => {
    const confirmMessage = `¿Estás seguro de que quieres inactivar el código "${codigo.codigo}"?`;
    if (confirm(confirmMessage)) {
      setIsLoading(true);
      setError(null);
      try {
        codigosBarraService.destroy(codigo.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar');
        setIsLoading(false);
      }
    }
  }, []);

  // Navegar a crear código
  const navigateToCreate = useCallback(() => {
    if (productoId) {
      codigosBarraService.navigateToCreate(productoId);
    }
  }, [productoId]);

  // Navegar a editar código
  const navigateToEdit = useCallback((codigo: CodigoBarra) => {
    codigosBarraService.navigateToEdit(codigo.id);
  }, []);

  // Manejar cambios en el campo de búsqueda
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Ejecutar búsqueda
  const handleSearch = useCallback(() => {
    if (productoId) {
      searchCodigos({ q: searchQuery, producto_id: productoId });
    }
  }, [searchQuery, searchCodigos, productoId]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setError(null);
    if (productoId) {
      searchCodigos({ producto_id: productoId });
    }
  }, [searchCodigos, productoId]);

  // Marcar código como principal
  const marcarPrincipal = useCallback(async (codigo: CodigoBarra) => {
    setIsLoading(true);
    setError(null);
    try {
      const resultado = await codigosBarraService.marcarPrincipal(codigo.id);
      console.log('Código marcado como principal:', resultado.mensaje);
      // Recargar la página para actualizar datos
      if (productoId) {
        router.get(`/codigos-barra?producto_id=${productoId}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al marcar como principal');
    } finally {
      setIsLoading(false);
    }
  }, [productoId]);

  // Validar código de barra
  const validarCodigo = useCallback(async (codigo: string, tipo: string = 'EAN') => {
    setError(null);
    try {
      const resultado = await codigosBarraService.validarCodigo(codigo, tipo);
      if (!resultado.valido) {
        setError(resultado.mensaje);
      }
      return resultado;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al validar';
      setError(mensaje);
      return {
        valido: false,
        mensaje,
        errores: [mensaje],
      };
    }
  }, []);

  // Generar código automáticamente
  const generarCodigoAutomatico = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const resultado = await codigosBarraService.generarCodigo();
      setCodigoGenerado(resultado.codigo);
      return resultado.codigo;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al generar código';
      setError(mensaje);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener códigos de un producto
  const obtenerCodigosProducto = useCallback(async (pId: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const resultado = await codigosBarraService.obtenerCodigos(pId);
      return resultado.codigos;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al obtener códigos';
      setError(mensaje);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Buscar producto por código
  const buscarProductoPorCodigo = useCallback(async (codigo: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const resultado = await codigosBarraService.buscarProducto(codigo);
      if (!resultado) {
        setError('Producto no encontrado');
        return null;
      }
      return resultado;
    } catch (err) {
      const mensaje = err instanceof Error ? err.message : 'Error al buscar producto';
      setError(mensaje);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Toggle de selección múltiple
  const toggleSeleccion = useCallback((codigoId: number) => {
    setSelectedCodigos((prev) =>
      prev.includes(codigoId) ? prev.filter((id) => id !== codigoId) : [...prev, codigoId]
    );
  }, []);

  // Limpiar selección
  const clearSeleccion = useCallback(() => {
    setSelectedCodigos([]);
  }, []);

  // Computados
  const hasSelection = useMemo(() => selectedCodigos.length > 0, [selectedCodigos]);

  return {
    // Estado
    isLoading,
    searchQuery,
    selectedCodigos,
    error,
    codigoGenerado,
    hasSelection,

    // Acciones
    searchCodigos,
    deleteCodigoM,
    navigateToCreate,
    navigateToEdit,
    handleSearchChange,
    handleSearch,
    clearFilters,
    marcarPrincipal,
    validarCodigo,
    generarCodigoAutomatico,
    obtenerCodigosProducto,
    buscarProductoPorCodigo,
    toggleSeleccion,
    clearSeleccion,
  };
}
