import React, { useState, useEffect } from 'react';
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogClose, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { useEstadoMermas } from '@/stores/useEstadoMermas';
import estadoMermaService from '@/infrastructure/services/estadoMerma.service';
import type { EstadoMerma } from '@/domain/entities/estado-merma';
import { Plus, Edit, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';
import { EstadoMermaFormModal } from './EstadoMermaFormModal';

export function EstadoMermaCrudModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { estados, fetchEstados } = useEstadoMermas();
    const [loading, setLoading] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editingEstado, setEditingEstado] = useState<EstadoMerma | null>(null);

    useEffect(() => {
        if (open) {
            fetchEstados();
            setEditingEstado(null);
            setFormModalOpen(false);
        }
    }, [open, fetchEstados]);

    const handleEdit = (estado: EstadoMerma) => {
        setEditingEstado(estado);
        setFormModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este estado de merma? Esta acción no se puede deshacer.')) return;

        setLoading(true);
        try {
            await estadoMermaService.remove(id);
            NotificationService.success('Estado de merma eliminado exitosamente');
            await fetchEstados();
        } catch {
            NotificationService.error('Error al eliminar el estado de merma');
        } finally {
            setLoading(false);
        }
    };

    const handleNewEstado = () => {
        setEditingEstado(null);
        setFormModalOpen(true);
    };

    const handleFormSuccess = () => {
        fetchEstados();
    };

    const getActionsList = (actions: string[] | string | undefined) => {
        if (!actions) return [];
        if (Array.isArray(actions)) return actions;
        try {
            const parsed = JSON.parse(actions);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
                <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-2xl">
                    <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Gestionar Estados de Merma
                            </DialogTitle>
                            <DialogClose asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </DialogClose>
                        </div>
                    </DialogHeader>

                    <div className="flex flex-col h-[calc(90vh-80px)]">
                        {/* Lista de Estados */}
                        <div className="flex-1 p-6 bg-gray-50/50 dark:bg-gray-800/50 overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Estados de Merma ({estados.length})
                                </h3>
                            </div>

                            <div className="space-y-3 mb-6">
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                                        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando...</span>
                                    </div>
                                ) : estados.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No hay estados de merma registrados</p>
                                    </div>
                                ) : (
                                    estados.map((estado) => {
                                        const actions = getActionsList(estado.actions);
                                        return (
                                            <Card key={estado.id} className="hover:shadow-md transition-shadow duration-200">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Badge
                                                                    variant="secondary"
                                                                    className="text-xs font-medium"
                                                                >
                                                                    {estado.clave}
                                                                </Badge>
                                                            </div>
                                                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
                                                                {estado.label}
                                                            </h4>
                                                            {actions.length > 0 && (
                                                                <div className="flex flex-wrap gap-1 mt-2">
                                                                    {actions.map((action, index) => (
                                                                        <Badge key={index} variant="outline" className="text-xs">
                                                                            {action}
                                                                        </Badge>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-1 ml-4">
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleEdit(estado)}
                                                                className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleDelete(estado.id)}
                                                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Botón Nuevo Estado - Siempre visible */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <Button
                                onClick={handleNewEstado}
                                size="sm"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Estado de Merma
                            </Button>
                        </div>
                    </div>

                    {/* Modal de Formulario */}
                    <EstadoMermaFormModal
                        open={formModalOpen}
                        onOpenChange={setFormModalOpen}
                        editingEstado={editingEstado}
                        onSuccess={handleFormSuccess}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
