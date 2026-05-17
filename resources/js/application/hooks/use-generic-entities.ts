// Application Layer: Generic hook for entity management - Updated with notifications
import { useState, useCallback } from 'react';
import { router } from '@inertiajs/react';
import type { BaseEntity, BaseService, Filters, BaseFormData } from '@/domain/entities/generic';
import NotificationService from '@/infrastructure/services/notification.service';

export function useGenericEntities<T extends BaseEntity, F extends BaseFormData>(
  service: BaseService<T, F>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Búsqueda de entidades con notificación (opcional)
  const searchEntities = useCallback((filters: Filters, showNotification: boolean = false) => {
    setIsLoading(true);

    // Solo mostrar notificación si se especifica y hay query
    if (showNotification && filters.q && filters.q.trim()) {
      NotificationService.info(`Buscando: "${filters.q}"`);
    }

    service.search(filters);

    // Resetear loading después de un breve delay
    setTimeout(() => setIsLoading(false), 500);
  }, [service]);

  // Eliminar entidad con confirmación elegante
  const deleteEntity = useCallback(async (entity: T, entityName: string) => {
    const entityDisplayName = 'nombre' in entity ? String(entity.nombre) : `ID: ${entity.id}`;

    const confirmed = await NotificationService.confirm(
      `¿Estás seguro de que quieres eliminar ${entityName} "${entityDisplayName}"?`,
      {
        title: `Eliminar ${entityName}`,
        confirmText: 'Sí, eliminar',
        cancelText: 'Cancelar'
      }
    );

    if (confirmed) {
      setIsLoading(true);

      // Crear una promesa para el toast de loading/success/error
      const deletePromise = new Promise<void>((resolve, reject) => {
        router.delete(service.destroyUrl(entity.id), {
          preserveState: true,
          onSuccess: () => {
            // Redireccionar a la ruta del listado después de eliminar
            const indexUrl = service.indexUrl();
            // ✅ CORREGIDO: Usar visit en lugar de get para asegurar navegación correcta
            router.visit(indexUrl);
            resolve();
          },
          onError: (errors: any) => {
            // ✅ MEJORADO: Extraer mensaje de error del backend
            const errorMessage = errors?.message || errors?.error || `Error al eliminar ${entityName}`;
            reject(new Error(errorMessage));
          },
          onFinish: () => {
            setIsLoading(false);
          }
        });
      });

      // Mostrar notificación con promesa
      NotificationService.promise(deletePromise, {
        loading: `Eliminando ${entityName}...`,
        success: `${entityName} eliminado correctamente`,
        error: (err: any) => err?.message || `Error al eliminar ${entityName}`
      });
    }
  }, [service]);

  // Navegar a editar entidad
  const navigateToEdit = useCallback((entity: T) => {
    router.visit(service.editUrl(entity.id));
  }, [service]);

  // Manejar cambios en el campo de búsqueda - sin restricciones
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  // Ejecutar búsqueda
  const handleSearch = useCallback(() => {
    if (!isLoading) {
      searchEntities({ q: searchQuery.trim() });
    }
  }, [searchQuery, searchEntities, isLoading]);

  // Limpiar filtros
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    searchEntities({});
  }, [searchEntities]);

  // Método para sincronizar con filtros externos (llamado desde GenericContainer)
  const syncWithFilters = useCallback((externalFilters: { q?: string }) => {
    if (externalFilters?.q !== undefined && externalFilters.q !== searchQuery) {
      setSearchQuery(externalFilters.q || '');
    }
  }, [searchQuery]);


  return {
    // Estado
    isLoading,
    searchQuery,

    // Acciones
    searchEntities,
    deleteEntity,
    navigateToEdit,
    handleSearchChange,
    handleSearch,
    clearFilters,
    syncWithFilters,
  };
}
