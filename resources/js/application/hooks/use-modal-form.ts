/**
 * useModalForm - Hook para manejar lógica de modal con formulario
 *
 * Propósito: Simplificar la integración de GenericCrudModal
 *
 * Proporciona:
 * - Estado del modal (open, loading, etc)
 * - Acciones (openModal, closeModal, etc)
 * - Manejo de errores
 * - Notificaciones automáticas
 *
 * Uso:
 * const { open, openModal, closeModal, ... } = useModalForm(service);
 */

import { useState, useCallback } from 'react';
import type { ExtendableService } from '@/infrastructure/services/extendable.service';
import type { BaseEntity, BaseFormData } from '@/domain/entities/generic';
import NotificationService from '@/infrastructure/services/notification.service';

export interface UseModalFormReturn<T extends BaseEntity, F extends BaseFormData> {
  open: boolean;
  isLoading: boolean;
  items: T[];
  editingItem: T | null;
  showFormModal: boolean;

  openModal: () => void;
  closeModal: () => void;
  openFormModal: (item?: T) => void;
  closeFormModal: () => void;

  handleFetch: () => Promise<void>;
  handleCreate: (data: F) => Promise<void>;
  handleUpdate: (data: F) => Promise<void>;
  handleDelete: (id: any) => Promise<void>;
}

export function useModalForm<T extends BaseEntity, F extends BaseFormData>(
  service: ExtendableService<T, F>,
  options?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
  }
): UseModalFormReturn<T, F> {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState<T[]>([]);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);

  // Cargar items
  const handleFetch = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await service.search({});
      setItems(result || []);
    } catch (error) {
      NotificationService.error('Error al cargar');
      console.error(error);
      options?.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [service, options]);

  // Crear
  const handleCreate = useCallback(
    async (data: F) => {
      setIsLoading(true);
      try {
        await service.store(data);
        NotificationService.success('Creado correctamente');
        await handleFetch();
        setShowFormModal(false);
        options?.onSuccess?.();
      } catch (error) {
        NotificationService.error('Error al crear');
        console.error(error);
        options?.onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [service, handleFetch, options]
  );

  // Actualizar
  const handleUpdate = useCallback(
    async (data: F) => {
      if (!editingItem) return;

      setIsLoading(true);
      try {
        await service.update(editingItem.id, data);
        NotificationService.success('Actualizado correctamente');
        await handleFetch();
        setShowFormModal(false);
        setEditingItem(null);
        options?.onSuccess?.();
      } catch (error) {
        NotificationService.error('Error al actualizar');
        console.error(error);
        options?.onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [editingItem, service, handleFetch, options]
  );

  // Eliminar
  const handleDelete = useCallback(
    async (id: any) => {
      setIsLoading(true);
      try {
        await service.destroy(id);
        NotificationService.success('Eliminado correctamente');
        await handleFetch();
        options?.onSuccess?.();
      } catch (error) {
        NotificationService.error('Error al eliminar');
        console.error(error);
        options?.onError?.(error);
      } finally {
        setIsLoading(false);
      }
    },
    [service, handleFetch, options]
  );

  // Navegación
  const openModal = useCallback(() => {
    setOpen(true);
    handleFetch();
  }, [handleFetch]);

  const closeModal = useCallback(() => {
    setOpen(false);
    setEditingItem(null);
    setShowFormModal(false);
  }, []);

  const openFormModal = useCallback((item?: T) => {
    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem(null);
    }
    setShowFormModal(true);
  }, []);

  const closeFormModal = useCallback(() => {
    setShowFormModal(false);
    setEditingItem(null);
  }, []);

  return {
    open,
    isLoading,
    items,
    editingItem,
    showFormModal,

    openModal,
    closeModal,
    openFormModal,
    closeFormModal,

    handleFetch,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
