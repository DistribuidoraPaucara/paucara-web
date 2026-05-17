import React, { useState, useCallback } from 'react';
import { GripVertical, Edit, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { cn } from '@/lib/utils';

interface Modulo {
    id: number;
    titulo: string;
    ruta: string;
    icono?: string;
    descripcion?: string;
    orden: number;
    activo: boolean;
    es_submenu: boolean;
    modulo_padre_id?: number;
    categoria?: string;
    submodulos_count: number;
    padre?: {
        id: number;
        titulo: string;
    };
    permisos?: string[];
}

interface ModulosListaArrastrablesProps {
    modulos: Modulo[];
    onEdit: (modulo: Modulo) => void;
    onDelete: (modulo: Modulo) => void;
    onToggleActivo: (modulo: Modulo) => void;
    onReordenar: (orden: Array<{ id: number; orden: number }>) => void;
    procesando: boolean;
    guardando?: boolean;
}

export function ModulosListaArrastrables({
    modulos,
    onEdit,
    onDelete,
    onToggleActivo,
    onReordenar,
    procesando,
    guardando = false,
}: ModulosListaArrastrablesProps) {
    const [modulosOrden, setModulosOrden] = useState(modulos);
    const [draggedId, setDraggedId] = useState<number | null>(null);
    const [cambios, setCambios] = useState(false);

    // Actualizar cuando los módulos prop cambian
    React.useEffect(() => {
        setModulosOrden(modulos);
        setCambios(false);
    }, [modulos]);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
        setDraggedId(id);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>, targetId: number) => {
            e.preventDefault();
            e.stopPropagation();

            if (draggedId === null || draggedId === targetId) {
                setDraggedId(null);
                return;
            }

            // Encontrar índices
            const draggedIndex = modulosOrden.findIndex(m => m.id === draggedId);
            const targetIndex = modulosOrden.findIndex(m => m.id === targetId);

            if (draggedIndex === -1 || targetIndex === -1) {
                setDraggedId(null);
                return;
            }

            // Crear nuevo array reordenado
            const newModulos = [...modulosOrden];
            const [draggedModulo] = newModulos.splice(draggedIndex, 1);
            newModulos.splice(targetIndex, 0, draggedModulo);

            // Recalcular órdenes
            const nuevaOrden = newModulos.map((m, index) => ({
                ...m,
                orden: index + 1,
            }));

            setModulosOrden(nuevaOrden);
            setCambios(true);
            setDraggedId(null);
        },
        [draggedId, modulosOrden]
    );

    const handleGuardarOrden = async () => {
        const ordenActualizar = modulosOrden.map(m => ({
            id: m.id,
            orden: m.orden,
        }));

        onReordenar(ordenActualizar);
        setCambios(false);
    };

    const handleCancelar = () => {
        setModulosOrden(modulos);
        setCambios(false);
    };

    return (
        <div className="space-y-3">
            {/* Barra de estado cuando hay cambios */}
            {cambios && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>
                            Orden modificado. {' '}
                            <span className="font-semibold">
                                Arrastra para reordenar más módulos o guarda los cambios.
                            </span>
                        </span>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelar}
                            disabled={guardando}
                            className="text-gray-600 dark:text-gray-400"
                        >
                            Cancelar
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleGuardarOrden}
                            disabled={guardando}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {guardando ? 'Guardando...' : 'Guardar Orden'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Instrucciones */}
            {modulosOrden.length > 1 && !cambios && (
                <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <GripVertical className="h-3 w-3" />
                    <span>Arrastra por el icono ⋮ para reordenar</span>
                </div>
            )}

            {/* Lista de módulos arrastrable */}
            <div className="space-y-2">
                {modulosOrden.map((modulo, index) => (
                    <div
                        key={modulo.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, modulo.id)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, modulo.id)}
                        className={cn(
                            'p-3 rounded-lg border transition-all duration-200 cursor-move',
                            'hover:border-blue-300 dark:hover:border-blue-700',
                            draggedId === modulo.id
                                ? 'opacity-50 border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/10'
                                : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50',
                            cambios && 'bg-yellow-50 dark:bg-yellow-900/10'
                        )}
                    >
                        <div className="flex items-center justify-between gap-3">
                            {/* Handle + Info */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                {/* Drag Handle */}
                                <div
                                    className="flex-shrink-0 text-gray-400 dark:text-gray-500 cursor-grab active:cursor-grabbing hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                                    title="Arrastra para reordenar"
                                >
                                    <GripVertical className="h-5 w-5" />
                                </div>

                                {/* Número de orden */}
                                <div className="flex-shrink-0 font-mono text-sm font-semibold text-gray-500 dark:text-gray-400 w-6 text-center">
                                    {index + 1}
                                </div>

                                {/* Información del módulo */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                            {modulo.titulo}
                                        </p>

                                        <div className="flex gap-2 items-center flex-wrap">
                                            <Badge
                                                variant={
                                                    modulo.es_submenu ? 'secondary' : 'default'
                                                }
                                                className="text-xs flex-shrink-0"
                                            >
                                                {modulo.es_submenu ? 'Sub' : 'Main'}
                                            </Badge>

                                            {modulo.categoria && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs flex-shrink-0"
                                                >
                                                    {modulo.categoria}
                                                </Badge>
                                            )}

                                            {modulo.submodulos_count > 0 && (
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs flex-shrink-0"
                                                >
                                                    {modulo.submodulos_count} sub
                                                </Badge>
                                            )}
                                        </div>
                                    </div>

                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                        {modulo.ruta}
                                    </p>
                                </div>
                            </div>

                            {/* Acciones */}
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onToggleActivo(modulo)}
                                    disabled={procesando}
                                    title={modulo.activo ? 'Desactivar' : 'Activar'}
                                >
                                    {modulo.activo ? (
                                        <Eye className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    ) : (
                                        <EyeOff className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onEdit(modulo)}
                                    title="Editar"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onDelete(modulo)}
                                    disabled={procesando}
                                    className="text-red-600 dark:text-red-400 hover:text-red-700"
                                    title="Eliminar"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Mensaje si no hay módulos */}
            {modulosOrden.length === 0 && (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No hay módulos para mostrar
                </div>
            )}
        </div>
    );
}
