// Application Layer: Hook para lógica de negocio de categorías
import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import type { Categoria } from '@/domain/entities/categorias';
import categoriasService from '@/infrastructure/services/categorias.service';
import type { Filters } from '@/domain/entities/shared';

export function useCategorias() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Búsqueda de categorías
  const searchCategorias = useCallback((filters: Filters) => {
    setIsLoading(true);
    categoriasService.search(filters);
    // El loading se manejará cuando se recargue la página
    setTimeout(() => setIsLoading(false), 100);
  }, []);

  // Eliminar categoría con confirmación
  const deleteCategoria = useCallback((categoria: Categoria) => {
    const confirmMessage = `¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"?`;
    if (confirm(confirmMessage)) {
      setIsLoading(true);
      categoriasService.destroy(categoria.id);
    }
  }, []);

  // Navegar a crear categoría
  const navigateToCreate = useCallback(() => {
    router.visit(categoriasService.createUrl());
  }, []);

  // Navegar a editar categoría
  const navigateToEdit = useCallback((categoria: Categoria) => {
    router.visit(categoriasService.editUrl(categoria.id));
  }, []);

  // Manejar cambios en el campo de búsqueda
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Ejecutar búsqueda
  const handleSearch = useCallback(() => {
    searchCategorias({ q: searchQuery });
  }, [searchQuery, searchCategorias]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    searchCategorias({});
  }, [searchCategorias]);

  return {
    // Estado
    isLoading,
    searchQuery,

    // Acciones
    searchCategorias,
    deleteCategoria,
    navigateToCreate,
    navigateToEdit,
    handleSearchChange,
    handleSearch,
    clearFilters,
  };
}
