import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { Almacen } from '@/domain/entities/almacenes';
import {
    InventarioInicialBorradorItem,
} from '@/domain/entities/inventario-inicial';
import type { Id } from '@/domain/entities/shared';
import AlmacenRegistroRow from './almacen-registro-row';

interface Props {
    item: InventarioInicialBorradorItem;
    almacenes: Almacen[];
    expanded: boolean;
    onToggleExpand: (productoId: Id) => void;
    onGuardarItem: (
        productoId: Id,
        almacenId: Id,
        cantidad?: number,
        lote?: string,
        fechaVencimiento?: string
    ) => Promise<void>;
    onEliminar: (productoId: Id) => void;
    allItems: InventarioInicialBorradorItem[];
}

export default function ProductoRowExpandible({
    item,
    almacenes,
    expanded,
    onToggleExpand,
    onGuardarItem,
    onEliminar,
    allItems,
}: Props) {

    // console.log('Renderizando ProductoRowExpandible para producto:', item);
    // const [eliminando, setEliminando] = useState(false);

    // Obtener todos los items del mismo producto
    const itemsProducto = allItems.filter(i => i.producto_id === item.producto_id);

    // Contar almacenes completados
    const almacenesCompletados = itemsProducto.filter(
        i => i.cantidad && i.cantidad > 0
    ).length;

    const porcentajeCompletado = (almacenesCompletados / almacenes.length) * 100;

    return (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition relative">
            {/* Botón de eliminar - Posición absoluta */}
            <div className="absolute top-3 right-12 sm:right-10 z-10">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEliminar(item.producto_id);
                    }}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                    title="Eliminar producto"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {/* Fila principal del producto */}
            <button
                onClick={() => onToggleExpand(item.producto_id)}
                className="w-full px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
                {/* Contenido principal */}
                <div className="flex-1 text-left min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <div className="flex-1 min-w-0">
                            <p> <span className="font-medium text-blue-600 dark:text-blue-400">Item #{item.id}</span></p>
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                                {item.producto?.nombre}
                            </h3>
                            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                {/* ✅ ID del borrador item + ID del producto */}
                                <div className="truncate">
                                    <p>
                                        {item.producto?.id && (
                                            <> • <span className="font-medium">Prod:</span> {item.producto.id}</>
                                        )} / • SKU: {item.producto?.sku}
                                        {item.producto?.codigo_barras && (
                                            <> • {item.producto.codigo_barras}</>
                                        )}
                                    </p>
                                </div>
                                {/* ✅ Marca y Unidad del producto */}
                                <div className="truncate">
                                    {item.producto?.marca?.nombre && (
                                        <><span className="font-medium">Marca:</span> {item.producto.marca.nombre}</>
                                    )}
                                    {item.producto?.unidad?.nombre && (
                                        <> • <span className="font-medium">Unidad:</span> {item.producto.unidad.nombre}</>
                                    )}
                                </div>
                                {Array.isArray(item.producto?.codigos_barra) && item.producto.codigos_barra.length > 0 && (
                                    <div className="text-xs text-blue-600 dark:text-blue-400 truncate">
                                        🔖 {item.producto.codigos_barra.map((cb: any) => cb.codigo).join(', ')}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Barra de progreso - adaptativa */}
                        <div className="w-full sm:w-40 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${porcentajeCompletado}%` }}
                                    ></div>
                                </div>
                                <span className="text-xs text-gray-600 dark:text-gray-400 min-w-fit whitespace-nowrap">
                                    {almacenesCompletados}/{almacenes.length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Icono expandible */}
                <div className="flex justify-end sm:ml-4 flex-shrink-0">
                    {expanded ? (
                        <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                </div>
            </button>

            {/* Filas de almacenes */}
            {expanded && (
                <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 divide-y divide-gray-200 dark:divide-gray-700">
                    {almacenes.map((almacen) => {
                        // Obtener todos los items para este almacén (puede haber múltiples lotes)
                        const itemsAlmacen = allItems.filter(
                            i =>
                                i.producto_id === item.producto_id &&
                                i.almacen_id === almacen.id
                        );

                        return (
                            <div key={`${item.producto_id}-${almacen.id}`}>
                                {itemsAlmacen.length > 0 ? (
                                    itemsAlmacen.map((itemLote, idx) => (
                                        <AlmacenRegistroRow
                                            key={`${item.producto_id}-${almacen.id}-${idx}`}
                                            producto={item.producto!}
                                            almacen={almacen}
                                            item={itemLote}
                                            onGuardarItem={onGuardarItem}
                                            mostrarNombreAlmacen={idx === 0}
                                        />
                                    ))
                                ) : (
                                    <AlmacenRegistroRow
                                        key={`${item.producto_id}-${almacen.id}-nuevo`}
                                        producto={item.producto!}
                                        almacen={almacen}
                                        item={undefined}
                                        onGuardarItem={onGuardarItem}
                                        mostrarNombreAlmacen={true}
                                    />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
