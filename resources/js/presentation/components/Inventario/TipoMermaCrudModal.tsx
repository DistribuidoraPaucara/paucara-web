import React, { useState, useEffect } from 'react';
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogClose, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { useTipoMermas } from '@/stores/useTipoMermas';
import tipoMermaService from '@/infrastructure/services/tipoMerma.service';
import type { TipoMerma } from '@/domain/entities/tipo-merma';
import { Plus, Edit, Trash2, X, AlertCircle, Loader2 } from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';
import { TipoMermaFormModal } from './TipoMermaFormModal';

export function TipoMermaCrudModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { tipos, fetchTipos } = useTipoMermas();
    const [loading, setLoading] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const [editingTipo, setEditingTipo] = useState<TipoMerma | null>(null);

    useEffect(() => {
        if (open) {
            fetchTipos();
            setEditingTipo(null);
            setFormModalOpen(false);
        }
    }, [open, fetchTipos]);

    const handleEdit = (tipo: TipoMerma) => {
        setEditingTipo(tipo);
        setFormModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este tipo de merma? Esta acción no se puede deshacer.')) return;

        setLoading(true);
        try {
            await tipoMermaService.remove(id);
            NotificationService.success('Tipo de merma eliminado exitosamente');
            await fetchTipos();
        } catch {
            NotificationService.error('Error al eliminar el tipo de merma');
        } finally {
            setLoading(false);
        }
    };

    const handleNewTipo = () => {
        setEditingTipo(null);
        setFormModalOpen(true);
    };

    const handleFormSuccess = () => {
        fetchTipos();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
                <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 border-0 shadow-2xl">
                    <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                Gestionar Tipos de Merma
                            </DialogTitle>
                            <DialogClose asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </DialogClose>
                        </div>
                    </DialogHeader>

                    <div className="flex flex-col h-[calc(90vh-80px)]">
                        {/* Lista de Tipos - Más compacta */}
                        <div className="flex-1 p-6 bg-gray-50/50 dark:bg-gray-800/50 overflow-y-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    Tipos Existentes ({tipos.length})
                                </h3>
                            </div>

                            <div className="space-y-2 mb-6">
                                {loading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                                        <span className="ml-2 text-gray-600 dark:text-gray-400">Cargando...</span>
                                    </div>
                                ) : tipos.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                        <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No hay tipos registrados</p>
                                    </div>
                                ) : (
                                    tipos.map((tipo) => (
                                        <Card key={tipo.id} className="hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
                                            <CardContent className="p-3">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Badge
                                                                variant="secondary"
                                                                className="text-xs font-medium shrink-0"
                                                            >
                                                                {tipo.clave}
                                                            </Badge>
                                                            {tipo.requiere_aprobacion && (
                                                                <Badge variant="outline" className="text-xs shrink-0">
                                                                    Req. aprobación
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                                                            {tipo.label}
                                                        </h4>
                                                    </div>
                                                    <div className="flex gap-1 ml-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleEdit(tipo)}
                                                            className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        >
                                                            <Edit className="h-3 w-3" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDelete(tipo.id)}
                                                            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Botón Nuevo Tipo - Siempre visible */}
                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <Button
                                onClick={handleNewTipo}
                                size="sm"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Nuevo Tipo de Merma
                            </Button>
                        </div>
                    </div>

                    {/* Modal de Formulario */}
                    <TipoMermaFormModal
                        open={formModalOpen}
                        onOpenChange={setFormModalOpen}
                        editingTipo={editingTipo}
                        onSuccess={handleFormSuccess}
                    />
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
