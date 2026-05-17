/**
 * GenericCrudModal - Modal genérico reutilizable para CRUD
 *
 * Propósito: Eliminar duplicación de modales CRUD en módulos
 * (EstadoMerma, TipoMerma, TipoAjuste, etc.)
 *
 * Features:
 * - Lista de items en modal
 * - Botones New/Edit/Delete
 * - Modal anidado para formulario
 * - Confirmación antes de eliminar
 * - Loading states
 * - Notificaciones automáticas
 *
 * Usado en: EstadoMerma, TipoMerma, TipoAjuste modales
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Plus, Edit, Trash2, X, Loader2, AlertCircle } from 'lucide-react';
import NotificationService from '@/infrastructure/services/notification.service';
import SimpleCrudForm, { type FormField } from '@/presentation/components/generic/simple-crud-form';

export interface GenericCrudModalProps<T extends { id: any; [key: string]: any }, F> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  singularTitle: string;
  items: T[];
  isLoading?: boolean;
  onFetch?: () => Promise<void> | void;
  onDelete?: (id: any) => Promise<void>;
  onSubmit?: (data: F, itemId?: any) => Promise<void>;
  formFields: FormField[];
  renderItem: (item: T) => React.ReactNode;
  emptyMessage?: string;
  showFormModal?: boolean;
  itemToEdit?: T | null;
}

export default function GenericCrudModal<T extends { id: any; [key: string]: any }, F>({
  open,
  onOpenChange,
  title,
  singularTitle,
  items,
  isLoading = false,
  onFetch,
  onDelete,
  onSubmit,
  formFields,
  renderItem,
  emptyMessage = 'No hay registros',
  showFormModal: initialShowFormModal = false,
  itemToEdit: initialItemToEdit = null,
}: GenericCrudModalProps<T, F>) {
  const [showFormModal, setShowFormModal] = useState(initialShowFormModal);
  const [editingItem, setEditingItem] = useState<T | null>(initialItemToEdit);
  const [deleting, setDeleting] = useState(false);

  // Cargar items cuando se abre el modal
  useEffect(() => {
    if (open && onFetch) {
      onFetch();
      setEditingItem(null);
      setShowFormModal(false);
    }
  }, [open, onFetch]);

  // Manejar editar
  const handleEdit = useCallback((item: T) => {
    setEditingItem(item);
    setShowFormModal(true);
  }, []);

  // Manejar eliminar
  const handleDelete = useCallback(
    async (id: any) => {
      if (!onDelete) return;

      const confirmed = window.confirm(
        `¿Estás seguro de que deseas eliminar este ${singularTitle.toLowerCase()}?`
      );
      if (!confirmed) return;

      setDeleting(true);
      try {
        await onDelete(id);
        NotificationService.success(`${singularTitle} eliminado correctamente`);
        if (onFetch) await onFetch();
      } catch (error) {
        NotificationService.error(`Error al eliminar ${singularTitle.toLowerCase()}`);
        console.error(error);
      } finally {
        setDeleting(false);
      }
    },
    [singularTitle, onDelete, onFetch]
  );

  // Manejar nuevo
  const handleNew = useCallback(() => {
    setEditingItem(null);
    setShowFormModal(true);
  }, []);

  // Manejar submit del formulario
  const handleFormSubmit = useCallback(
    async (data: F) => {
      if (!onSubmit) return;

      try {
        await onSubmit(data, editingItem?.id);
        setShowFormModal(false);
        setEditingItem(null);
        if (onFetch) await onFetch();
      } catch (error) {
        console.error('Error al guardar:', error);
      }
    },
    [editingItem, onSubmit, onFetch]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
        <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-2xl">
          {/* Header */}
          <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">
                {title}
              </DialogTitle>
              <DialogClose asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="flex flex-col h-[calc(90vh-80px)]">
            {/* Lista de Items */}
            <div className="flex-1 p-6 bg-gray-50/50 dark:bg-gray-800/50 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">
                  {title} ({items.length})
                </h3>
                <Button
                  onClick={handleNew}
                  disabled={isLoading || deleting || showFormModal}
                  className="gap-2"
                  size="sm"
                >
                  <Plus className="h-4 w-4" />
                  Nuevo {singularTitle}
                </Button>
              </div>

              {/* Cargar estado */}
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600">Cargando...</span>
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">{emptyMessage}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4 pb-3">
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1">{renderItem(item)}</div>

                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              disabled={deleting || showFormModal}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              disabled={deleting || showFormModal}
                              className="text-destructive hover:text-destructive"
                              title="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </DialogPortal>

      {/* Modal de Formulario Anidado */}
      {showFormModal && (
        <Dialog open={showFormModal} onOpenChange={setShowFormModal}>
          <DialogPortal>
            <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
            <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-0 shadow-2xl">
              <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl font-bold">
                    {editingItem ? `Editar ${singularTitle}` : `Nuevo ${singularTitle}`}
                  </DialogTitle>
                  <DialogClose asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </DialogClose>
                </div>
              </DialogHeader>

              <div className="p-6">
                <SimpleCrudForm<F>
                  initialData={editingItem as Partial<F>}
                  fields={formFields}
                  onSubmit={handleFormSubmit}
                  onReset={() => {
                    setShowFormModal(false);
                    setEditingItem(null);
                  }}
                  isLoading={isLoading}
                  submitButtonText={editingItem ? `Actualizar ${singularTitle}` : `Crear ${singularTitle}`}
                  isEditing={!!editingItem}
                />
              </div>
            </DialogContent>
          </DialogPortal>
        </Dialog>
      )}
    </Dialog>
  );
}
