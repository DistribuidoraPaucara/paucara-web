import React, { useState, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { X, Search, CheckCircle2 } from 'lucide-react';
import NotificationService from '@/infrastructure/services/notification.service';

// Helper function para rutas (Ziggy)
const getRoute = (name: string, params?: { [key: string]: any }) => {
    if (typeof route !== 'undefined') {
        return route(name, params);
    }
    // Fallback si route no está disponible
    const routes: { [key: string]: string } = {
        'productos.paginados': '/productos/paginados/listar',
    };
    return routes[name] || '';
};

interface Producto {
    id: number;
    nombre: string;
    sku: string;
    categoria?: string;
    marca?: string;
    unidad?: string;
}

interface Props {
    onClose: () => void;
    onAgregar: (productoIds: number[]) => Promise<void>;
    productosYaAgregados: number[];
}

interface PaginatedResponse {
    data: Producto[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

export default function CargarProductosModal({
    onClose,
    onAgregar,
    productosYaAgregados,
}: Props) {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set());
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [productosPorPagina] = useState(30);

    // Obtener token CSRF
    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        return token?.content || '';
    };

    useEffect(() => {
        cargarProductos(paginaActual, busqueda);
    }, []);

    const cargarProductos = async (page: number, search: string = '') => {
        try {
            setCargando(true);
            const params = new URLSearchParams({
                page: page.toString(),
                per_page: productosPorPagina.toString(),
                search: search,
            });

            const response = await fetch(
                getRoute('productos.paginados') + `?${params.toString()}`,
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                }
            );

            if (!response.ok) throw new Error('Error al cargar productos');

            const data: PaginatedResponse = await response.json();
            setProductos(data.data);
            setTotalPaginas(data.last_page);
            setPaginaActual(data.current_page);
        } catch (error) {
            NotificationService.error('Error al cargar productos');
            console.error(error);
        } finally {
            setCargando(false);
        }
    };

    const handleBusqueda = (valor: string) => {
        setBusqueda(valor);
        setPaginaActual(1);
        cargarProductos(1, valor);
    };

    const toggleSeleccionar = (productoId: number) => {
        setSeleccionados(prev => {
            const next = new Set(prev);
            if (next.has(productoId)) {
                next.delete(productoId);
            } else {
                next.add(productoId);
            }
            return next;
        });
    };

    const seleccionarTodos = () => {
        if (seleccionados.size === productos.length) {
            setSeleccionados(new Set());
        } else {
            setSeleccionados(new Set(productos.map(p => p.id)));
        }
    };

    const handleAgregar = async () => {
        if (seleccionados.size === 0) {
            NotificationService.error('Selecciona al menos un producto');
            return;
        }

        try {
            setGuardando(true);
            await onAgregar(Array.from(seleccionados));
            onClose();
        } catch (error) {
            NotificationService.error('Error al agregar productos');
            console.error(error);
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <h2 className="text-xl font-semibold">Cargar Productos</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Búsqueda */}
                <div className="p-4 border-b">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder="Buscar producto por nombre o SKU..."
                            value={busqueda}
                            onChange={(e) => handleBusqueda(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Lista de productos */}
                <div className="flex-1 overflow-y-auto">
                    {cargando ? (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-gray-500">Cargando productos...</p>
                        </div>
                    ) : productos.length === 0 ? (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-gray-500">No hay productos</p>
                        </div>
                    ) : (
                        <div className="divide-y">
                            {/* Header de la tabla */}
                            <div className="sticky top-0 bg-gray-50 px-4 py-2 flex items-center gap-3 border-b">
                                <input
                                    type="checkbox"
                                    checked={
                                        seleccionados.size > 0 &&
                                        seleccionados.size === productos.length
                                    }
                                    onChange={seleccionarTodos}
                                    className="h-4 w-4 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 flex-1">
                                    {seleccionados.size > 0
                                        ? `${seleccionados.size} seleccionado(s)`
                                        : 'Seleccionar todos'}
                                </span>
                            </div>

                            {/* Filas de productos */}
                            {productos.map((producto) => {
                                const yaAgregado = productosYaAgregados.includes(producto.id);
                                const seleccionado = seleccionados.has(producto.id);

                                return (
                                    <div
                                        key={producto.id}
                                        className={`px-4 py-3 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition ${
                                            yaAgregado ? 'bg-green-50' : ''
                                        }`}
                                        onClick={() => !yaAgregado && toggleSeleccionar(producto.id)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={seleccionado}
                                            onChange={() => toggleSeleccionar(producto.id)}
                                            disabled={yaAgregado}
                                            className="h-4 w-4 cursor-pointer disabled:opacity-50"
                                        />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-900 truncate">
                                                    {producto.nombre}
                                                </p>
                                                {yaAgregado && (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                SKU: {producto.sku}
                                                {producto.categoria && ` | ${producto.categoria}`}
                                                {producto.marca && ` | ${producto.marca}`}
                                            </p>
                                        </div>

                                        {yaAgregado && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                                Agregado
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer con paginación y botones */}
                <div className="border-t p-4 space-y-3">
                    {/* Paginación */}
                    {totalPaginas > 1 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                                Página {paginaActual} de {totalPaginas}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => cargarProductos(paginaActual - 1, busqueda)}
                                    disabled={paginaActual === 1 || cargando}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => cargarProductos(paginaActual + 1, busqueda)}
                                    disabled={paginaActual === totalPaginas || cargando}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Botones de acción */}
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={guardando}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={handleAgregar}
                            disabled={seleccionados.size === 0 || guardando}
                        >
                            {guardando ? 'Agregando...' : `Agregar ${seleccionados.size} Producto(s)`}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
