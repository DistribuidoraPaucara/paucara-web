import React, { useState, useEffect } from 'react';
import { Dialog, DialogPortal, DialogOverlay, DialogContent, DialogClose, DialogTitle, DialogDescription } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { useTipoAjustInventario } from '@/stores/useTipoAjustInventario';
import tipoAjusteInventarioService from '@/infrastructure/services/tipoAjusteInventario.service';
import type { TipoAjusteInventario } from '@/domain/entities/tipos-ajuste-inventario';

export function TipoAjustInventarioCrudModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { tipos, fetchTipos, loading, error } = useTipoAjustInventario();
    const [editing, setEditing] = useState<TipoAjusteInventario | null>(null);
    const [form, setForm] = useState<Partial<TipoAjusteInventario>>({});
    const [localLoading, setLocalLoading] = useState(false);

    useEffect(() => {
        if (open) fetchTipos();
    }, [open, fetchTipos]);

    const handleEdit = (tipo: TipoAjusteInventario) => {
        setEditing(tipo);
        setForm(tipo);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar tipo de ajuste?')) return;
        setLocalLoading(true);
        await tipoAjusteInventarioService.remove(id);
        await fetchTipos();
        setLocalLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalLoading(true);
        if (editing) {
            await tipoAjusteInventarioService.update(editing.id, form);
        } else {
            await tipoAjusteInventarioService.create(form);
        }
        setEditing(null);
        setForm({});
        await fetchTipos();
        setLocalLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogPortal>
                <DialogOverlay />
                <DialogContent className="max-w-lg w-full p-6 rounded-lg bg-white dark:bg-gray-900">
                    <DialogTitle asChild>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xl font-bold">Gestionar Tipos de Ajuste de Inventario</span>
                            <DialogClose asChild>
                                <Button variant="ghost">Cerrar</Button>
                            </DialogClose>
                        </div>
                    </DialogTitle>
                    <DialogDescription className="mb-4">
                        Crea, edita o elimina los tipos de ajuste disponibles para los movimientos de inventario.
                    </DialogDescription>
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            <p>{error}</p>
                        </div>
                    )}
                    {loading && (
                        <div className="mb-4 text-center">
                            <p>Cargando tipos de ajuste...</p>
                        </div>
                    )}
                    {!loading && tipos.length === 0 && !error && (
                        <div className="mb-4 text-center text-gray-500">
                            <p>No hay tipos de ajuste registrados.</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
                        <Input
                            placeholder="Clave (ej: AJUSTE_FISICO)"
                            value={form.clave || ''}
                            onChange={e => setForm(f => ({ ...f, clave: e.target.value }))}
                            required
                            disabled={!!editing}
                        />
                        <Input
                            placeholder="Nombre visible"
                            value={form.label || ''}
                            onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                            required
                        />
                        <Input
                            placeholder="Descripción"
                            value={form.descripcion || ''}
                            onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
                        />
                        {/* <div className="flex gap-2">
                            <Input
                                placeholder="Color"
                                value={form.color || ''}
                                onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                            />
                            <Input
                                placeholder="BG Color"
                                value={form.bg_color || ''}
                                onChange={e => setForm(f => ({ ...f, bg_color: e.target.value }))}
                            />
                            <Input
                                placeholder="Text Color"
                                value={form.text_color || ''}
                                onChange={e => setForm(f => ({ ...f, text_color: e.target.value }))}
                            />
                        </div> */}
                        <Button type="submit" disabled={loading || localLoading}>
                            {localLoading ? 'Procesando...' : (editing ? 'Actualizar' : 'Crear')}
                        </Button>
                        {editing && (
                            <Button type="button" variant="outline" onClick={() => { setEditing(null); setForm({}); }}>
                                Cancelar edición
                            </Button>
                        )}
                    </form>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th>Clave</th>
                                    <th>Nombre</th>
                                    <th>Descripción</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {tipos.map(tipo => (
                                    <tr key={tipo.id} className="border-b">
                                        <td>{tipo.clave}</td>
                                        <td>{tipo.label}</td>
                                        <td>{tipo.descripcion}</td>
                                        <td className="flex gap-2">
                                            <Button type="button" size="sm" variant="outline" onClick={() => handleEdit(tipo)}>
                                                Editar
                                            </Button>
                                            <Button type="button" size="sm" variant="destructive" onClick={() => handleDelete(tipo.id)}>
                                                Eliminar
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    );
}
