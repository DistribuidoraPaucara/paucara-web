import { Trash2, Save, Plus, AlertCircle } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import SearchSelect from '@/presentation/components/ui/search-select';
import NotificationService from '@/infrastructure/services/notification.service';
import { useProductoSearch } from '../hooks/useProductoSearch';
import type { Almacen, InventarioItem } from '@/domain/entities/inventario-inicial';
import type { Producto } from '@/domain/entities/productos';

interface ModoTablaProps {
    items: InventarioItem[];
    almacenes: Almacen[];
    onAgregarItem: () => void;
    onActualizarItem: (index: number, field: keyof InventarioItem, value: any) => void;
    onEliminarItem: (index: number) => void;
    onGuardar: () => void;
    processing: boolean;
}

export default function ModoTabla({
    items,
    almacenes = [],
    onAgregarItem,
    onActualizarItem,
    onEliminarItem,
    onGuardar,
    processing,
}: ModoTablaProps) {
    const { opciones: productosOptions, cargando: cargandoProductos, buscarConDebounce } = useProductoSearch();
    const [productosCache, setProductosCache] = useState<Map<number, Producto>>(new Map());
    if (items.length === 0) {
        return (
            <div className="flex flex-col h-full gap-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold">Tabla Editable</h3>
                        <p className="text-sm text-muted-foreground">
                            Edita múltiples productos simultáneamente en una tabla estilo spreadsheet
                        </p>
                    </div>
                    <Button
                        onClick={onAgregarItem}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Agregar Producto
                    </Button>
                </div>
                <div className="flex-1 flex items-center justify-center text-muted-foreground border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                    <div className="text-center py-12">
                        <p className="text-sm">No hay items en la tabla</p>
                        <p className="text-xs mt-1">Haz clic en "Agregar Producto" para comenzar</p>
                    </div>
                </div>
            </div>
        );
    }

    const almacenMap = useMemo(() => new Map((almacenes || []).map(a => [a.id, a])), [almacenes]);

    const almacenesOptions = useMemo(() =>
        (almacenes || []).map(a => ({
            value: a.id,
            label: a.nombre,
        })), [almacenes]);

    // Función para detectar duplicados (producto + almacén)
    const verificarDuplicado = (productoId: number, almacenId: number, indexActual: number): boolean => {
        return items.some((item, index) =>
            index !== indexActual &&
            item.producto_id === productoId &&
            item.almacen_id === almacenId
        );
    };

    // Función para obtener nombre de producto
    const obtenerNombreProducto = (productoId: number | '') => {
        if (!productoId) return 'Producto desconocido';
        return productosCache.get(productoId as number)?.nombre || 'Producto desconocido';
    };

    // Función para obtener nombre de almacén
    const obtenerNombreAlmacen = (almacenId: number | '') => {
        if (!almacenId) return '';
        return almacenMap.get(almacenId as number)?.nombre || 'Almacén desconocido';
    };

    // Función manejadora para cambios con validación
    const handleActualizarConValidacion = (index: number, field: keyof InventarioItem, value: any) => {
        // Si es cambio de producto o almacén, verificar duplicados
        if ((field === 'producto_id' || field === 'almacen_id') && value) {
            const productoId = field === 'producto_id' ? value : items[index].producto_id;
            const almacenId = field === 'almacen_id' ? value : items[index].almacen_id;

            if (productoId && almacenId && verificarDuplicado(Number(productoId), Number(almacenId), index)) {
                NotificationService.warning(
                    `Ya existe "${obtenerNombreProducto(productoId)}" en "${obtenerNombreAlmacen(almacenId)}"`
                );
                return;
            }
        }

        // Si es cambio de producto, actualizar caché
        if (field === 'producto_id' && value) {
            const opcion = productosOptions.find(opt => opt.value === value);
            if (opcion?.data) {
                setProductosCache(prev => new Map(prev).set(value, opcion.data));
            }
        }

        onActualizarItem(index, field, value);
    };

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Header responsivo */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                    <h3 className="text-lg font-semibold">Tabla Editable</h3>
                    <p className="text-sm text-muted-foreground hidden sm:block">
                        Edita directamente en las celdas para cambios rápidos
                    </p>
                </div>
                <Button
                    onClick={onAgregarItem}
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full sm:w-auto"
                >
                    <Plus className="h-4 w-4" />
                    Agregar Producto
                </Button>
            </div>

            {/* Tabla responsiva con scroll en móvil */}
            <div className="flex-1 overflow-x-auto border rounded-lg -mx-4 sm:mx-0">
                <div className="inline-block min-w-full sm:min-w-0">
                    <table className="w-full text-xs">
                        <thead className="bg-slate-100 dark:bg-slate-800 border-b sticky top-0">
                            <tr>
                                <th className="px-2 py-1.5 text-left font-medium w-8 sm:w-10">#</th>
                                {/* Producto - siempre visible */}
                                <th className="px-2 py-1.5 text-left font-medium min-w-40 sm:min-w-48">Producto</th>
                                {/* Almacén - oculto en móvil */}
                                <th className="px-2 py-1.5 text-left font-medium min-w-24 sm:min-w-32 hidden sm:table-cell">Almacén</th>
                                {/* Cantidad - siempre visible */}
                                <th className="px-2 py-1.5 text-left font-medium w-16 sm:w-20">Cant.</th>
                                {/* Lote - oculto en móvil */}
                                <th className="px-2 py-1.5 text-left font-medium w-20 hidden sm:table-cell">Lote</th>
                                {/* Vencimiento - oculto en móvil */}
                                <th className="px-2 py-1.5 text-left font-medium w-24 hidden md:table-cell">Vencimiento</th>
                                {/* Acciones */}
                                <th className="px-2 py-1.5 text-center font-medium w-8 sm:w-10">X</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                const hasDuplicado = item.producto_id && item.almacen_id && verificarDuplicado(Number(item.producto_id), Number(item.almacen_id), index);

                                return (
                                <tr key={index} className={`border-b hover:bg-slate-50 dark:hover:bg-slate-900/50 ${hasDuplicado ? 'bg-yellow-50 dark:bg-yellow-950/10' : ''}`}>
                                    <td className="px-2 py-1.5 font-medium text-slate-600 dark:text-slate-400 w-8 sm:w-10">
                                        {hasDuplicado && <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 inline mr-1" />}
                                        <span className="hidden sm:inline">{index + 1}</span>
                                    </td>
                                    <td className="px-2 py-1.5 min-w-40 sm:min-w-48">
                                        <SearchSelect
                                            placeholder="Buscar..."
                                            value={item.producto_id ? String(item.producto_id) : ''}
                                            options={productosOptions}
                                            onChange={(value) => handleActualizarConValidacion(index, 'producto_id', value ? Number(value) : '')}
                                            onSearch={(searchTerm) => buscarConDebounce(searchTerm)}
                                            allowClear={true}
                                            emptyText={cargandoProductos ? "Buscando..." : "No encontrado"}
                                            loading={cargandoProductos}
                                        />
                                    </td>
                                    <td className="px-2 py-1.5 min-w-24 sm:min-w-32 hidden sm:table-cell">
                                        <SearchSelect
                                            placeholder="Almacén..."
                                            value={item.almacen_id ? String(item.almacen_id) : ''}
                                            options={almacenesOptions}
                                            onChange={(value) => handleActualizarConValidacion(index, 'almacen_id', value ? Number(value) : '')}
                                            allowClear={true}
                                            emptyText="N/A"
                                        />
                                    </td>
                                    <td className="px-2 py-1.5 w-16 sm:w-20">
                                        <Input
                                            type="number"
                                            min="1"
                                            value={item.cantidad}
                                            onChange={(e) => onActualizarItem(index, 'cantidad', Number(e.target.value) || '')}
                                            className="w-full text-center text-xs sm:text-sm"
                                            placeholder="0"
                                        />
                                    </td>
                                    <td className="px-2 py-1.5 w-20 hidden sm:table-cell">
                                        <Input
                                            type="text"
                                            value={item.lote || ''}
                                            onChange={(e) => onActualizarItem(index, 'lote', e.target.value)}
                                            className="w-full text-xs"
                                            placeholder="-"
                                        />
                                    </td>
                                    <td className="px-2 py-1.5 w-24 hidden md:table-cell">
                                        <Input
                                            type="date"
                                            value={item.fecha_vencimiento || ''}
                                            onChange={(e) => onActualizarItem(index, 'fecha_vencimiento', e.target.value)}
                                            className="w-full text-xs"
                                        />
                                    </td>
                                    <td className="px-2 py-1.5 text-center w-8 sm:w-10">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEliminarItem(index)}
                                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                                        >
                                            <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                        </Button>
                                    </td>
                                </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer responsivo */}
            {items.length > 0 && (
                <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
                    <Button
                        onClick={onGuardar}
                        disabled={processing || items.length === 0}
                        className="gap-2 w-full sm:w-auto"
                    >
                        <Save className="h-4 w-4" />
                        <span className="hidden sm:inline">Cargar Inventario Inicial</span>
                        <span className="sm:hidden">Cargar ({items.length})</span>
                    </Button>
                </div>
            )}
        </div>
    );
}
