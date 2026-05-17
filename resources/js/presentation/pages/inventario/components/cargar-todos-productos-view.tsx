import React, { useState, useEffect } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { X, Search, CheckCircle2, Camera, RefreshCw } from 'lucide-react';
import NotificationService from '@/infrastructure/services/notification.service';
import FiltrosProductosPanel from './filtros-productos-panel';
import ProductosTableSeleccionable from './productos-table-seleccionable';
import ScannerCamaraModal from './scanner-camara-modal';

// Helper function para rutas (Ziggy)
const getRoute = (name: string, params?: { [key: string]: any }) => {
    if (typeof route !== 'undefined') {
        return route(name, params);
    }
    // Fallback si route no está disponible
    const routes: { [key: string]: string } = {
        'productos.paginados': '/productos/paginados/listar',
        'productos.filtros-data': '/productos/filtros/datos',
    };
    return routes[name] || '';
};

interface Producto {
    id: number;
    nombre: string;
    sku: string;
    categoria?: string;
    marca?: string;
    proveedor?: string;
    unidad?: string;
    stock_minimo?: number;
    stock_total?: number;
    precio_venta?: number;
}

interface Filtros {
    search: string;
    proveedor_id: string | null;
    marca_id: string | null;
    categoria_id: string | null;
    stock_bajo: boolean;
    stock_alto: boolean;
    sin_stock: boolean;
    con_precio: boolean;
    sin_precio: boolean;
}

interface FiltrosData {
    proveedores: { id: number; nombre: string }[];
    marcas: { id: number; nombre: string }[];
    categorias: { id: number; nombre: string }[];
}

interface PaginatedResponse {
    data: Producto[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface Props {
    onClose: () => void;
    onAgregar: (productoIds: number[]) => Promise<void>;
    productosYaAgregados: number[];
}

export default function CargarTodosProductosView({
    onClose,
    onAgregar,
    productosYaAgregados,
}: Props) {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [seleccionados, setSeleccionados] = useState<Set<number>>(new Set());
    const [filtros, setFiltros] = useState<Filtros>({
        search: '',
        proveedor_id: null,
        marca_id: null,
        categoria_id: null,
        stock_bajo: false,
        stock_alto: false,
        sin_stock: false,
        con_precio: false,
        sin_precio: false,
    });
    const [filtrosData, setFiltrosData] = useState<FiltrosData | null>(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const [totalPaginas, setTotalPaginas] = useState(1);
    const [productosPorPagina] = useState(50);
    const [cargando, setCargando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [showScanner, setShowScanner] = useState(false);

    // Obtener token CSRF
    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement;
        return token?.content || '';
    };

    // Cargar datos de filtros al montar
    useEffect(() => {
        cargarFiltrosData();
    }, []);

    // Cargar productos cuando cambian filtros o paginación
    useEffect(() => {
        cargarProductos();
    }, [filtros, paginaActual]);

    const cargarFiltrosData = async () => {
        try {
            const response = await fetch(getRoute('productos.filtros-data'), {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });

            if (!response.ok) throw new Error('Error al cargar filtros');

            const data = await response.json();
            setFiltrosData(data);
        } catch (error) {
            NotificationService.error('Error al cargar opciones de filtros');
            console.error(error);
        }
    };

    const cargarProductos = async () => {
        try {
            setCargando(true);
            const params = new URLSearchParams({
                page: paginaActual.toString(),
                per_page: productosPorPagina.toString(),
                search: filtros.search,
            });

            // Agregar filtros opcionales
            if (filtros.proveedor_id) {
                params.append('proveedor_id', filtros.proveedor_id);
            }
            if (filtros.marca_id) {
                params.append('marca_id', filtros.marca_id);
            }
            if (filtros.categoria_id) {
                params.append('categoria_id', filtros.categoria_id);
            }

            // Determinar estado de stock
            if (filtros.stock_bajo || filtros.stock_alto || filtros.sin_stock) {
                if (filtros.stock_bajo && !filtros.stock_alto && !filtros.sin_stock) {
                    params.append('stock_status', 'bajo');
                } else if (filtros.stock_alto && !filtros.stock_bajo && !filtros.sin_stock) {
                    params.append('stock_status', 'alto');
                } else if (filtros.sin_stock && !filtros.stock_bajo && !filtros.stock_alto) {
                    params.append('stock_status', 'sin_stock');
                }
            }

            // Determinar estado de precio
            if (filtros.con_precio || filtros.sin_precio) {
                if (filtros.con_precio && !filtros.sin_precio) {
                    params.append('precio_status', 'con_precio');
                } else if (filtros.sin_precio && !filtros.con_precio) {
                    params.append('precio_status', 'sin_precio');
                }
            }

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

            // Limpiar seleccionados si cambió la página
            setSeleccionados(prev => {
                const next = new Set(prev);
                // Mantener solo los que están en esta página
                data.data.forEach(p => {
                    if (!next.has(p.id)) {
                        next.delete(p.id);
                    }
                });
                return next;
            });
        } catch (error) {
            NotificationService.error('Error al cargar productos');
            console.error(error);
        } finally {
            setCargando(false);
        }
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

    const limpiarFiltros = () => {
        setFiltros({
            search: '',
            proveedor_id: null,
            marca_id: null,
            categoria_id: null,
            stock_bajo: false,
            stock_alto: false,
            sin_stock: false,
            con_precio: false,
            sin_precio: false,
        });
        setPaginaActual(1);
    };

    const handleScannerCamara = async (codigo: string) => {
        try {
            // Buscar producto por código de barras
            const params = new URLSearchParams({
                search: codigo,
                per_page: '100',
            });

            const response = await fetch(
                getRoute('productos.paginados') + `?${params.toString()}`,
                {
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                    },
                }
            );

            if (!response.ok) throw new Error('Producto no encontrado');

            const data: PaginatedResponse = await response.json();
            if (data.data.length > 0) {
                const producto = data.data[0];
                toggleSeleccionar(producto.id);
                NotificationService.success(`Escaneado: ${producto.nombre}`);
            } else {
                NotificationService.error('Código de barras no encontrado');
            }
        } catch (error) {
            NotificationService.error('Error en escaneo');
            console.error(error);
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
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Cargar Todos los Productos</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Panel de Filtros */}
                <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                    <FiltrosProductosPanel
                        filtros={filtros}
                        filtrosData={filtrosData}
                        onFiltrosChange={setFiltros}
                        onLimpiar={limpiarFiltros}
                        onOpenScanner={() => setShowScanner(true)}
                    />
                </div>

                {/* Tabla de Productos */}
                <div className="flex-1 overflow-y-auto">
                    {cargando ? (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-gray-500 dark:text-gray-400">Cargando productos...</p>
                        </div>
                    ) : productos.length === 0 ? (
                        <div className="flex items-center justify-center h-48">
                            <p className="text-gray-500 dark:text-gray-400">No hay productos que coincidan con los filtros</p>
                        </div>
                    ) : (
                        <ProductosTableSeleccionable
                            productos={productos}
                            seleccionados={seleccionados}
                            onToggleSeleccion={toggleSeleccionar}
                            onSeleccionarTodos={seleccionarTodos}
                            productosYaAgregados={productosYaAgregados}
                        />
                    )}
                </div>

                {/* Footer con paginación y botones */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    {/* Paginación */}
                    {totalPaginas > 1 && productos.length > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                                Página {paginaActual} de {totalPaginas}
                            </span>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPaginaActual(p => Math.max(1, p - 1))}
                                    disabled={paginaActual === 1 || cargando}
                                >
                                    Anterior
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPaginaActual(p => Math.min(totalPaginas, p + 1))}
                                    disabled={paginaActual === totalPaginas || cargando}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Contador de seleccionados */}
                    {seleccionados.size > 0 && (
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            <span className="font-medium">{seleccionados.size} producto(s) seleccionado(s)</span>
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

            {/* Scanner de Cámara */}
            {showScanner && (
                <ScannerCamaraModal
                    onClose={() => setShowScanner(false)}
                    onDetected={handleScannerCamara}
                />
            )}
        </div>
    );
}
