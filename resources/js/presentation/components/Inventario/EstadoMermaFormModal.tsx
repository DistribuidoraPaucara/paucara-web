import React, { useState, useEffect } from 'react';
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogClose, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Badge } from '@/presentation/components/ui/badge';
import { useEstadoMermas } from '@/stores/useEstadoMermas';
import estadoMermaService from '@/infrastructure/services/estadoMerma.service';
import { Check, Loader2, Palette, Settings, X } from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';
import type { EstadoMerma, EstadoMermaFormData } from '@/domain/entities/estado-merma';

interface EstadoMermaFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingEstado?: EstadoMerma | null;
    onSuccess?: () => void;
}

export function EstadoMermaFormModal({ open, onOpenChange, editingEstado, onSuccess }: EstadoMermaFormModalProps) {
    const { fetchEstados } = useEstadoMermas();
    const [form, setForm] = useState<Partial<EstadoMermaFormData>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            if (editingEstado) {
                setForm(editingEstado);
            } else {
                setForm({
                    clave: '',
                    label: '',
                    color: '#10b981',
                    bg_color: '#ecfdf5',
                    text_color: '#065f46',
                    actions: [],
                    activo: true
                });
            }
        }
    }, [open, editingEstado]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingEstado) {
                await estadoMermaService.update(editingEstado.id, form);
                NotificationService.success('Estado de merma actualizado exitosamente');
            } else {
                await estadoMermaService.create(form);
                NotificationService.success('Estado de merma creado exitosamente');
            }

            await fetchEstados();
            onSuccess?.();
            onOpenChange(false);
        } catch {
            NotificationService.error('Error al guardar el estado de merma');
        } finally {
            setSubmitting(false);
        }
    };

    const getPreviewStyle = () => {
        return {
            backgroundColor: form.bg_color || '#f3f4f6',
            color: form.text_color || '#374151',
            border: `2px solid ${form.color || '#d1d5db'}`,
        };
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
                <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-0 shadow-2xl">
                    <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {editingEstado ? '✏️ Editar Estado de Merma' : '🆕 Crear Nuevo Estado de Merma'}
                            </DialogTitle>
                            <DialogClose asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </DialogClose>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {editingEstado ? 'Modifica los datos del estado de merma seleccionado.' : 'Crea un nuevo estado para controlar el flujo de las mermas.'}
                        </p>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="clave" className="text-sm font-medium">
                                    Clave <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="clave"
                                    placeholder="Ej: PENDIENTE, APROBADO, RECHAZADO, PROCESADO"
                                    value={form.clave || ''}
                                    onChange={e => setForm(f => ({ ...f, clave: e.target.value.toUpperCase() }))}
                                    required
                                    disabled={!!editingEstado}
                                    className="uppercase"
                                />
                                <p className="text-xs text-gray-500">Identificador único (solo mayúsculas, sin espacios)</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="label" className="text-sm font-medium">
                                    Nombre Visible <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="label"
                                    placeholder="Ej: Pendiente de Revisión, Aprobado para Procesar"
                                    value={form.label || ''}
                                    onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                                    required
                                />
                                <p className="text-xs text-gray-500">Nombre descriptivo que se mostrará en la interfaz</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Personalización Visual
                            </Label>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="color" className="text-xs">Color del borde</Label>
                                    <Input
                                        id="color"
                                        type="color"
                                        value={form.color || '#d1d5db'}
                                        onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bg_color" className="text-xs">Color de fondo</Label>
                                    <Input
                                        id="bg_color"
                                        type="color"
                                        value={form.bg_color || '#f3f4f6'}
                                        onChange={e => setForm(f => ({ ...f, bg_color: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="text_color" className="text-xs">Color del texto</Label>
                                    <Input
                                        id="text_color"
                                        type="color"
                                        value={form.text_color || '#374151'}
                                        onChange={e => setForm(f => ({ ...f, text_color: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <Label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                                    Vista Previa
                                </Label>
                                <Badge
                                    variant="secondary"
                                    style={getPreviewStyle()}
                                    className="text-sm font-medium px-3 py-1"
                                >
                                    {form.clave || 'CLAVE'}
                                </Badge>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Acciones Permitidas
                            </Label>
                            <Textarea
                                placeholder="Ej: aprobar, rechazar, editar, procesar, cancelar (separadas por comas)"
                                value={Array.isArray(form.actions) ? form.actions.join(',') : ''}
                                onChange={e => setForm(f => ({ ...f, actions: e.target.value.split(',').map(a => a.trim()) }))}
                                rows={2}
                            />
                            <p className="text-xs text-gray-500">Lista de acciones permitidas en este estado (separadas por comas, sin espacios)</p>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {editingEstado ? 'Actualizando...' : 'Creando...'}
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4 mr-2" />
                                        {editingEstado ? 'Actualizar Estado' : 'Crear Estado'}
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={submitting}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
