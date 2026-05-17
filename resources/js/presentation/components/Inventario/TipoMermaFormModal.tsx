import React, { useState, useEffect } from 'react';
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogClose, DialogHeader, DialogTitle } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Badge } from '@/presentation/components/ui/badge';
import { useTipoMermas } from '@/stores/useTipoMermas';
import tipoMermaService from '@/infrastructure/services/tipoMerma.service';
import { Check, Loader2, Palette, X } from 'lucide-react';
import { NotificationService } from '@/infrastructure/services/notification.service';
import type { TipoMerma, TipoMermaFormData } from '@/domain/entities/tipo-merma';

interface TipoMermaFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingTipo?: TipoMerma | null;
    onSuccess?: () => void;
}

export function TipoMermaFormModal({ open, onOpenChange, editingTipo, onSuccess }: TipoMermaFormModalProps) {
    const { fetchTipos } = useTipoMermas();
    const [form, setForm] = useState<Partial<TipoMermaFormData>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            if (editingTipo) {
                setForm(editingTipo);
            } else {
                setForm({
                    clave: '',
                    label: '',
                    descripcion: '',
                    color: '#3b82f6',
                    bg_color: '#eff6ff',
                    text_color: '#1e40af',
                    requiere_aprobacion: false
                });
            }
        }
    }, [open, editingTipo]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingTipo) {
                await tipoMermaService.update(editingTipo.id, form);
                NotificationService.success('Tipo de merma actualizado exitosamente');
            } else {
                await tipoMermaService.create(form);
                NotificationService.success('Tipo de merma creado exitosamente');
            }

            await fetchTipos();
            onSuccess?.();
            onOpenChange(false);
        } catch {
            NotificationService.error('Error al guardar el tipo de merma');
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay className="bg-black/50 backdrop-blur-sm" />
                <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-0 shadow-2xl">
                    <DialogHeader className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                {editingTipo ? '✏️ Editar Tipo de Merma' : '🆕 Crear Nuevo Tipo de Merma'}
                            </DialogTitle>
                            <DialogClose asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <X className="h-4 w-4" />
                                </Button>
                            </DialogClose>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            {editingTipo ? 'Modifica los datos del tipo de merma seleccionado.' : 'Define un nuevo tipo de merma para clasificar las pérdidas de inventario.'}
                        </p>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <Label htmlFor="clave" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Clave <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="clave"
                                    placeholder="Ej: VENCIMIENTO, ROTURA, PERDIDA"
                                    value={form.clave || ''}
                                    onChange={e => setForm(f => ({ ...f, clave: e.target.value.toUpperCase() }))}
                                    required
                                    disabled={!!editingTipo}
                                    className="uppercase font-mono text-sm"
                                />
                                <p className="text-xs text-gray-500">Identificador único (solo mayúsculas, sin espacios)</p>
                            </div>

                            <div className="space-y-3">
                                <Label htmlFor="label" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Nombre Visible <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="label"
                                    placeholder="Ej: Vencimiento de Productos, Rotura por Manipulación"
                                    value={form.label || ''}
                                    onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                                    required
                                    className="text-sm"
                                />
                                <p className="text-xs text-gray-500">Nombre descriptivo que se mostrará en la interfaz</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="descripcion" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                Descripción
                            </Label>
                            <Textarea
                                id="descripcion"
                                placeholder="Describe detalladamente las características de este tipo de merma, cuándo se aplica y qué criterios se deben considerar para clasificar las pérdidas bajo esta categoría..."
                                value={form.descripcion || ''}
                                onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                                rows={4}
                                className="text-sm resize-none"
                            />
                        </div>

                        <div className="space-y-4">
                            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                <Palette className="h-4 w-4" />
                                Personalización Visual
                            </Label>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="color" className="text-xs font-medium">Color del borde</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="color"
                                            type="color"
                                            value={form.color || '#d1d5db'}
                                            onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                                            className="w-12 h-8 p-1 border rounded"
                                        />
                                        <Input
                                            type="text"
                                            value={form.color || '#d1d5db'}
                                            onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                                            className="flex-1 text-xs font-mono"
                                            placeholder="#d1d5db"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bg_color" className="text-xs font-medium">Color de fondo</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="bg_color"
                                            type="color"
                                            value={form.bg_color || '#f3f4f6'}
                                            onChange={e => setForm(f => ({ ...f, bg_color: e.target.value }))}
                                            className="w-12 h-8 p-1 border rounded"
                                        />
                                        <Input
                                            type="text"
                                            value={form.bg_color || '#f3f4f6'}
                                            onChange={e => setForm(f => ({ ...f, bg_color: e.target.value }))}
                                            className="flex-1 text-xs font-mono"
                                            placeholder="#f3f4f6"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="text_color" className="text-xs font-medium">Color del texto</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="text_color"
                                            type="color"
                                            value={form.text_color || '#374151'}
                                            onChange={e => setForm(f => ({ ...f, text_color: e.target.value }))}
                                            className="w-12 h-8 p-1 border rounded"
                                        />
                                        <Input
                                            type="text"
                                            value={form.text_color || '#374151'}
                                            onChange={e => setForm(f => ({ ...f, text_color: e.target.value }))}
                                            className="flex-1 text-xs font-mono"
                                            placeholder="#374151"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <Label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 block">
                                    Vista Previa del Badge
                                </Label>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant="secondary"
                                        style={getPreviewStyle()}
                                        className="text-sm font-medium px-3 py-1"
                                    >
                                        {form.clave || 'CLAVE'}
                                    </Badge>
                                    <span className="text-xs text-gray-500">Así se verá en la interfaz</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                            <input
                                type="checkbox"
                                id="requiere_aprobacion"
                                checked={!!form.requiere_aprobacion}
                                onChange={e => setForm(f => ({ ...f, requiere_aprobacion: e.target.checked }))}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div>
                                <Label htmlFor="requiere_aprobacion" className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Requiere aprobación especial
                                </Label>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                    Este tipo de merma necesitará autorización adicional antes de procesarse
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 text-sm font-semibold"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        {editingTipo ? 'Actualizando...' : 'Creando...'}
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4 mr-2" />
                                        {editingTipo ? 'Actualizar Tipo' : 'Crear Tipo'}
                                    </>
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                disabled={submitting}
                                className="px-6 py-2 text-sm"
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
