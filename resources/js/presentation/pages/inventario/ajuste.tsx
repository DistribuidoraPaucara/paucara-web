import { useState, useCallback, useEffect } from 'react';
import InputSearch from '@/presentation/components/ui/input-search';
import SearchSelect from '@/presentation/components/ui/search-select';
import { useTipoAjustInventario } from '@/stores/useTipoAjustInventario';
import AppLayout from '@/layouts/app-layout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { useAuth } from '@/application/hooks/use-auth';
import { toast } from 'react-hot-toast';
import { Almacen } from '@/domain/entities/almacenes';
import type { StockProducto } from '@/domain/entities/movimientos-inventario';
import { Id, Pagination } from '@/domain/entities/shared';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';
import { Printer, MoreVertical, Trash2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/presentation/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from '@/presentation/components/ui/dropdown-menu';

interface AjusteInventario {
    id: number;
    numero: string;
    almacen_id: number;
    user_id: number;
    cantidad_entradas: number;
    cantidad_salidas: number;
    cantidad_productos: number;
    observacion?: string;
    estado: 'pendiente' | 'procesado' | 'anulado';
    fecha_anulacion?: string;
    user_anulacion_id?: number;
    motivo_anulacion?: string;
    created_at: string;
    updated_at: string;
    almacen?: {
        id: number;
        nombre: string;
    };
    user?: {
        id: number;
        name: string;
    };
}
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/presentation/components/ui/table';
import { Button } from '@/presentation/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select';

interface AjusteItem {
    stock_producto_id: number;
    nueva_cantidad: number;
    observacion: string;
    tipo_ajuste_id?: number;
}

interface AjusteIndividual {
    stock_producto_id: number;
    inputCantidad: string;
    nueva_cantidad: number;
    observacion: string;
    tipo_ajuste_id?: number;
    tipoOperacion?: 'entrada' | 'salida';
}

interface PageProps extends InertiaPageProps {
    almacenes: Almacen[];
    stock_productos: StockProducto[];
    almacen_seleccionado?: number;
    ajustes_inventario?: Pagination<AjusteInventario>;
}

// Helper function para redondear a 2 decimales
const formatNumero = (valor: number): string => {
    return (Math.round(valor * 100) / 100).toFixed(2);
};

const breadcrumbs = [
    {
        title: 'Inventario',
        href: '/inventario',
    },
    {
        title: 'Ajuste de Inventario',
        href: '/inventario/ajuste',
    },
];

export default function AjusteInventario() {
    const { props } = usePage<PageProps>();
    const { almacenes, stock_productos, almacen_seleccionado, ajustes_inventario } = props;
    const { can, hasRole } = useAuth();

    // 🔍 LOG: Mostrar estructura completa de datos que llega del backend
    useEffect(() => {
        console.group('📊 DATOS DEL BACKEND - GET /inventario/ajuste');
        console.log('🏪 Almacenes:', almacenes);
        console.log('📦 Stock Productos (del almacén seleccionado):', stock_productos);
        console.log('🏷️ Almacén Seleccionado:', almacen_seleccionado);

        if (ajustes_inventario) {
            console.group('📋 AJUSTES DE INVENTARIO (Paginación)');
            console.log('Total registros:', ajustes_inventario.total);
            console.log('Por página:', ajustes_inventario.per_page);
            console.log('Página actual:', ajustes_inventario.current_page);
            console.log('Última página:', ajustes_inventario.last_page);
            console.log('Mostrando:', `${ajustes_inventario.from} a ${ajustes_inventario.to}`);

            console.group('📌 ESTRUCTURA DE CADA AJUSTE:');
            if (ajustes_inventario.data.length > 0) {
                const primerAjuste = ajustes_inventario.data[0];
                console.log('🔵 PRIMER AJUSTE (Ejemplo completo):', primerAjuste);
                console.table([primerAjuste]);

                console.group('🔍 Desglose de Campos:');
                console.log('├─ id:', primerAjuste.id);
                console.log('├─ cantidad:', primerAjuste.cantidad, '(cambio: + entrada, - salida)');
                console.log('├─ cantidad_anterior:', primerAjuste.cantidad_anterior, '✅ Stock ANTES');
                console.log('├─ cantidad_posterior:', primerAjuste.cantidad_posterior, '✅ Stock DESPUÉS');
                console.log('├─ tipo:', primerAjuste.tipo, '(genérico: ENTRADA_AJUSTE, SALIDA_AJUSTE)');
                console.log('├─ tipo_ajuste_inventario_id:', primerAjuste.tipo_ajuste_inventario_id);
                console.log('├─ tipoAjusteInventario:', primerAjuste.tipoAjusteInventario, '✅ RELACIÓN');
                console.log('│  ├─ label:', primerAjuste.tipoAjusteInventario?.label, '(nombre descriptivo)');
                console.log('│  ├─ tipo_operacion:', primerAjuste.tipoAjusteInventario?.tipo_operacion, '(entrada/salida)');
                console.log('│  ├─ clave:', primerAjuste.tipoAjusteInventario?.clave);
                console.log('│  ├─ descripcion:', primerAjuste.tipoAjusteInventario?.descripcion);
                console.log('│  └─ color:', primerAjuste.tipoAjusteInventario?.color);
                console.log('├─ observacion:', primerAjuste.observacion);
                console.log('├─ numero_documento:', primerAjuste.numero_documento);
                console.log('├─ created_at:', primerAjuste.created_at);
                console.log('├─ stockProducto:', primerAjuste.stockProducto, '✅ RELACIÓN');
                console.log('│  ├─ producto:', primerAjuste.stockProducto?.producto?.nombre);
                console.log('│  ├─ sku:', primerAjuste.stockProducto?.producto?.sku);
                console.log('│  └─ almacen:', primerAjuste.stockProducto?.almacen?.nombre);
                console.log('├─ user:', primerAjuste.user?.name, '(usuario que hizo ajuste)');
                console.groupEnd();

                console.group('📊 TODOS LOS AJUSTES:');
                if (ajustes_inventario?.data) {
                    console.table(ajustes_inventario.data.map(a => ({
                        'Número': a.numero,
                        'Almacén': a.almacen?.nombre,
                        'Usuario': a.user?.name,
                        'Entradas': a.cantidad_entradas,
                        'Salidas': a.cantidad_salidas,
                        'Productos': a.cantidad_productos,
                        'Observación': a.observacion,
                        'Fecha': new Date(a.created_at).toLocaleDateString('es-ES')
                    })));
                }
                console.groupEnd();
            } else {
                console.log('⚠️ No hay ajustes realizados');
            }
            console.groupEnd();
            console.groupEnd();
        }
        console.groupEnd();
    }, [almacenes, stock_productos, almacen_seleccionado, ajustes_inventario]);

    const [almacenSeleccionado, setAlmacenSeleccionado] = useState<string>(
        almacen_seleccionado ? String(almacen_seleccionado) : ''
    );

    // Estado para controlar qué vista mostrar - Inicia en HISTÓRICO por defecto
    const [vista, setVista] = useState<'crear' | 'tabla' | 'historico'>('historico');

    // Estados para el modal de impresión
    const [isModalImpresionOpen, setIsModalImpresionOpen] = useState(false);
    const [ajusteIdParaImprimir, setAjusteIdParaImprimir] = useState<number | null>(null);

    // Estados para el dialog de anulación
    const [ajusteParaAnular, setAjusteParaAnular] = useState<number | null>(null);
    const [motivoAnulacion, setMotivoAnulacion] = useState('');
    const [anulandoAjuste, setAnulandoAjuste] = useState(false);

    // Handler para abrir el modal de impresión
    const handleAbrirImpresion = (ajusteId: number) => {
        setAjusteIdParaImprimir(ajusteId);
        setIsModalImpresionOpen(true);
    };

    // Handler para anular un ajuste
    const handleAnularAjuste = async () => {
        if (!ajusteParaAnular) return;

        setAnulandoAjuste(true);
        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';
            const response = await fetch(`/api/inventario/ajuste/${ajusteParaAnular}/anular`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify({ motivo: motivoAnulacion }),
            });

            const data = await response.json();
            if (data.success) {
                toast.success(data.message || 'El ajuste ha sido anulado exitosamente');
                router.reload();
            } else {
                toast.error(data.message || 'No se pudo anular el ajuste');
            }
        } catch (error: any) {
            toast.error(error.message || 'Ocurrió un error al anular el ajuste');
        } finally {
            setAnulandoAjuste(false);
            setAjusteParaAnular(null);
            setMotivoAnulacion('');
        }
    };

    const [ajustes, setAjustes] = useState<Record<string, AjusteIndividual>>({});
    const [productoSeleccionado, setProductoSeleccionado] = useState<StockProducto | null>(null);

    // Estado para el tipo de operación (entrada/salida)
    const [tipoOperacion, setTipoOperacion] = useState<'entrada' | 'salida'>('entrada');

    // Obtener tipos de ajuste del custom hook
    const { tipos, fetchTipos } = useTipoAjustInventario();

    // Estado para mostrar todos los tipos o solo filtrados
    const [mostrarTodosTipos, setMostrarTodosTipos] = useState(false);

    useEffect(() => {
        fetchTipos();
    }, [fetchTipos]);

    // Recalcular el stock total cuando cambia el tipo de operación
    useEffect(() => {
        if (productoSeleccionado && ajustes[productoSeleccionado.id]) {
            const id = typeof productoSeleccionado.id === 'string' ? parseInt(productoSeleccionado.id, 10) : productoSeleccionado.id;
            const ajuste = ajustes[id];

            if (ajuste?.inputCantidad && ajuste.inputCantidad.trim() !== '') {
                const cantidad = parseInt(ajuste.inputCantidad, 10);
                const cantidadActual = parseFloat(String(productoSeleccionado.cantidad));
                let stockTotal = cantidadActual;

                if (tipoOperacion === 'entrada') {
                    stockTotal = cantidadActual + cantidad;
                } else {
                    stockTotal = cantidadActual - cantidad;
                    if (stockTotal < 0) {
                        stockTotal = 0;
                    }
                }

                setAjustes(prev => ({
                    ...prev,
                    [id]: {
                        ...prev[id],
                        nueva_cantidad: stockTotal,
                        tipoOperacion: tipoOperacion,
                    },
                }));
            }
        }
    }, [tipoOperacion, productoSeleccionado]);

    // Función para obtener tipos a mostrar (filtrados o todos) - Memoizada
    const getTiposAMostrar = useCallback(() => {
        if (!tipos.length) return [];

        if (mostrarTodosTipos) {
            console.log('Mostrando todos los tipos de ajuste');
            return tipos;
        }

        return getTiposFiltrados();
    }, [tipos, mostrarTodosTipos]);

    // Función para manejar cambio de tipo de operación - Memoizada
    const handleTipoOperacionChange = useCallback((nuevaOperacion: 'entrada' | 'salida') => {
        setTipoOperacion(nuevaOperacion);

        // Si hay un producto seleccionado, recalcular el stock total
        if (productoSeleccionado) {
            const id = typeof productoSeleccionado.id === 'string' ? parseInt(productoSeleccionado.id, 10) : productoSeleccionado.id;
            const inputCantidad = ajustes[id]?.inputCantidad || String(productoSeleccionado.cantidad);
            const cantidad = inputCantidad === '' ? 0 : parseInt(inputCantidad, 10);

            const cantidadActual = parseFloat(String(productoSeleccionado.cantidad));
            let stockTotal = cantidadActual;

            if (nuevaOperacion === 'entrada') {
                stockTotal = cantidadActual + cantidad;
            } else {
                stockTotal = cantidadActual - cantidad;
                if (stockTotal < 0) {
                    stockTotal = 0;
                }
            }

            setAjustes(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    nueva_cantidad: stockTotal,
                    tipoOperacion: nuevaOperacion,
                },
            }));
        }
    }, [productoSeleccionado, ajustes]);

    // Función para filtrar tipos de ajuste según la operación seleccionada - Memoizada
    const getTiposFiltrados = useCallback(() => {
        if (!tipos.length) return [];

        // console.log('Tipos de ajuste disponibles:', tipos);
        console.log('Operación seleccionada:', tipoOperacion);

        // Filtrar tipos según la operación seleccionada
        const tiposFiltrados = tipos.filter(tipo => {
            if (!tipo) return false;

            // Si el tipo es para "ambos", siempre mostrarlo
            if (tipo.tipo_operacion === 'ambos') return true;

            // Si el tipo coincide con la operación seleccionada, mostrarlo
            return tipo.tipo_operacion === tipoOperacion;
        });

        console.log(`Tipos filtrados para ${tipoOperacion}:`, tiposFiltrados);
        return tiposFiltrados;
    }, [tipos, tipoOperacion]);

    const { setData, post, processing } = useForm({
        ajustes: [] as AjusteItem[]
    });

    const handleAlmacenChange = useCallback((almacenId: string) => {
        setAlmacenSeleccionado(almacenId);
        setAjustes({});

        if (almacenId) {
            router.get('/inventario/ajuste', { almacen_id: almacenId }, {
                preserveState: true,
                replace: true,
            });
        }
    }, []);

    const handleCantidadChange = useCallback((stockProductoId: number | string, nuevaCantidad: string) => {
        const id = typeof stockProductoId === 'string' ? parseInt(stockProductoId, 10) : stockProductoId;
        // Permitir vacío
        const input = nuevaCantidad.replace(/^0+(?!$)/, ''); // Elimina ceros a la izquierda excepto si es solo "0"

        // console.log('📝 handleCantidadChange:', { id, nuevaCantidad, input, tipoOperacion });

        if (input === '') {
            console.log('❌ Input vacío');
            setAjustes(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    inputCantidad: '',
                }
            }));
            return;
        }
        const cantidad = parseInt(input, 10);
        console.log('🔢 Cantidad parseada:', { cantidad, isNaN: isNaN(cantidad) });
        const stockProducto = stock_productos.find(sp => sp.id === id);
        if (!stockProducto) return;

        // Validación numérica: asegurarse de que la cantidad sea un número positivo
        if (isNaN(cantidad) || cantidad < 0) {
            toast.error('La cantidad debe ser un número positivo');
            return;
        }

        // Obtener el tipo de ajuste seleccionado
        const tipoAjusteId = ajustes[id]?.tipo_ajuste_id || (tipos[0]?.id ?? undefined);
        const tipoAjuste = tipos.find(t => t.id === tipoAjusteId);

        // Calcular el stock total automáticamente basado en la cantidad ingresada y el tipo de ajuste
        const cantidadActual = parseFloat(String(stockProducto.cantidad));
        let stockTotal = cantidadActual;

        console.log('📊 Stock actual:', cantidadActual, 'Tipo operación:', tipoOperacion);

        // Si hay un tipo de ajuste seleccionado, aplicar la lógica correspondiente
        if (tipoAjuste) {
            // Si el tipo de ajuste es de incremento (entrada)
            if (tipoOperacion === 'entrada') {
                stockTotal = cantidadActual + cantidad;
                console.log('✅ ENTRADA (con tipo):', { base: cantidadActual, suma: cantidad, resultado: stockTotal });
            }
            // Si el tipo de ajuste es de decremento (salida)
            else {
                stockTotal = cantidadActual - cantidad;
                // Evitar stock negativo
                if (stockTotal < 0) {
                    stockTotal = 0;
                }
                console.log('❌ SALIDA (con tipo):', { base: cantidadActual, resta: cantidad, resultado: stockTotal });
            }
        } else {
            // Si no hay tipo de ajuste, usar la lógica basada en la operación seleccionada
            if (tipoOperacion === 'entrada') {
                stockTotal = cantidadActual + cantidad;
                console.log('✅ ENTRADA (sin tipo):', { base: cantidadActual, suma: cantidad, resultado: stockTotal });
            } else {
                stockTotal = cantidadActual - cantidad;
                if (stockTotal < 0) {
                    stockTotal = 0;
                }
                console.log('❌ SALIDA (sin tipo):', { base: cantidadActual, resta: cantidad, resultado: stockTotal });
            }
        }

        // Siempre guardar el cambio, incluso si es igual a la cantidad actual
        // Esto asegura que se registre en la base de datos
        console.log('💾 Guardando ajuste:', { id, stockTotal, inputCantidad: input, tipoOperacion });
        setAjustes(prev => ({
            ...prev,
            [id]: {
                stock_producto_id: id,
                nueva_cantidad: stockTotal, // Usar el stock total calculado
                observacion: prev[id]?.observacion || '',
                tipo_ajuste_id: tipoAjusteId,
                inputCantidad: input,
                tipoOperacion: tipoOperacion,
            }
        }));
    }, [tipos, tipoOperacion, ajustes, stock_productos]);

    const handleTipoAjusteChange = useCallback((stockProductoId: number | string, tipoAjusteId: number) => {
        const id = typeof stockProductoId === 'string' ? parseInt(stockProductoId, 10) : stockProductoId;
        const stockProducto = stock_productos.find(sp => sp.id === id);
        if (!stockProducto) return;

        // Obtener el tipo de ajuste seleccionado
        const tipoAjuste = tipos.find(t => t.id === tipoAjusteId);

        // Obtener la cantidad ingresada actual
        const inputCantidad = ajustes[id]?.inputCantidad || String(stockProducto.cantidad);
        const cantidad = inputCantidad === '' ? 0 : parseInt(inputCantidad, 10);

        // Calcular el nuevo stock total basado en el tipo de ajuste
        const cantidadActual = parseFloat(String(stockProducto.cantidad));
        let stockTotal = cantidadActual;

        if (tipoAjuste) {
            // Usar la lógica basada en la operación seleccionada en lugar de la propiedad incrementa
            if (tipoOperacion === 'entrada') {
                stockTotal = cantidadActual + cantidad;
            } else {
                stockTotal = cantidadActual - cantidad;
                // Evitar stock negativo
                if (stockTotal < 0) {
                    stockTotal = 0;
                }
            }
        } else {
            // Si no hay tipo de ajuste, usar la lógica basada en la operación seleccionada
            if (tipoOperacion === 'entrada') {
                stockTotal = cantidadActual + cantidad;
            } else {
                stockTotal = cantidadActual - cantidad;
                if (stockTotal < 0) {
                    stockTotal = 0;
                }
            }
        }

        setAjustes(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                tipo_ajuste_id: tipoAjusteId,
                nueva_cantidad: stockTotal, // Actualizar el stock total
                tipoOperacion: tipoOperacion,
            },
        }));
    }, [tipos, tipoOperacion, ajustes, stock_productos]);

    const handleObservacionChange = useCallback((stockProductoId: number | string, observacion: string) => {
        const id = typeof stockProductoId === 'string' ? parseInt(stockProductoId, 10) : stockProductoId;
        setAjustes(prev => ({
            ...prev,
            [id]: {
                ...prev[id],
                observacion
            }
        }));
    }, []);

    // Inicializar ajuste cuando se selecciona un producto - Memoizada
    const inicializarAjuste = useCallback((stockProducto: StockProducto) => {
        const id = typeof stockProducto.id === 'string' ? parseInt(stockProducto.id, 10) : stockProducto.id;

        // Obtener el primer tipo de ajuste que coincida con la operación seleccionada
        let tipoAjusteIdDefault = undefined;
        if (tipos.length > 0) {
            // Buscar un tipo que sea específico de la operación actual o sea "ambos"
            const tipoApropriado = tipos.find(t =>
                t.tipo_operacion === tipoOperacion || t.tipo_operacion === 'ambos'
            );
            tipoAjusteIdDefault = tipoApropriado?.id || tipos[0]?.id;
        }

        setAjustes(prev => ({
            ...prev,
            [id]: {
                stock_producto_id: id,
                nueva_cantidad: stockProducto.cantidad,
                observacion: '',
                tipo_ajuste_id: tipoAjusteIdDefault,
                inputCantidad: '',
                tipoOperacion: tipoOperacion,
            }
        }));
    }, [tipos, tipoOperacion]);

    const guardarAjusteIndividual = (stockProductoId: Id) => {
        const ajuste = ajustes[stockProductoId];
        const stockProducto = stock_productos.find(sp => sp.id === stockProductoId);

        console.log('🔍 Validando ajuste:', { stockProductoId, ajuste, stockProducto });

        // Validar que exista el ajuste
        if (!ajuste) {
            toast.error('No hay cambios para guardar');
            return;
        }

        // Validar que se haya ingresado una cantidad
        if (!ajuste.inputCantidad || ajuste.inputCantidad.trim() === '') {
            toast.error('Debe ingresar una cantidad');
            return;
        }

        // Validar que la cantidad haya cambiado
        const cantidadActualNum = parseFloat(String(stockProducto?.cantidad));
        if (stockProducto && ajuste.nueva_cantidad === cantidadActualNum) {
            console.log('❌ Cantidad no ha cambiado:', { nueva: ajuste.nueva_cantidad, actual: cantidadActualNum });
            toast.error('La cantidad no ha cambiado. Ingresa una cantidad diferente');
            return;
        }

        console.log('✅ Cantidad cambió:', { nueva: ajuste.nueva_cantidad, actual: cantidadActualNum });

        // Validar que se haya seleccionado un tipo de ajuste
        if (!ajuste.tipo_ajuste_id) {
            console.log('❌ No hay tipo_ajuste_id:', ajuste);
            toast.error('Debe seleccionar un tipo de ajuste');
            return;
        }

        console.log('✅ Tipo ajuste seleccionado:', ajuste.tipo_ajuste_id);

        // Validar que se haya ingresado una observación
        if (!ajuste.observacion || ajuste.observacion.trim() === '') {
            toast.error('Debe ingresar una observación');
            return;
        }

        // Crear lista con solo este ajuste, filtrando propiedades innecesarias
        const ajustesList = [{
            stock_producto_id: ajuste.stock_producto_id,
            nueva_cantidad: Math.round(ajuste.nueva_cantidad), // ✅ Redondear a entero
            observacion: ajuste.observacion,
            tipo_ajuste_id: ajuste.tipo_ajuste_id,
        }];

        console.log('📤 Enviando ajuste individual:', ajustesList);

        router.post('/inventario/ajuste', { ajustes: ajustesList }, {
            onSuccess: () => {
                toast.success('Ajuste guardado correctamente');
                // Eliminar solo este ajuste del estado
                setAjustes(prev => {
                    const newAjustes = { ...prev };
                    delete newAjustes[stockProductoId];
                    return newAjustes;
                });
                // Recargar solo los datos de stock
                router.reload({ only: ['stock_productos'] });
                // Limpiar el producto seleccionado
                setProductoSeleccionado(null);
            },
            onError: (errors) => {
                console.error('Errores del servidor:', errors);
                console.error('Datos enviados:', ajustesList);
                // Obtener el primer error disponible
                const errorMessages = Object.values(errors).flat();
                if (errorMessages.length > 0) {
                    toast.error(errorMessages[0]);
                } else {
                    toast.error('Error al guardar el ajuste');
                }
            }
        });
    };

    const getDiferencia = (stockProducto: StockProducto): number => {
        const ajuste = ajustes[stockProducto.id];
        if (!ajuste) return 0;
        return ajuste.nueva_cantidad - stockProducto.cantidad;
    };

    // Renderizado del componente
    const renderContent = () => {
        if (!can('inventario.ajuste.form')) {
            return (
                <AppLayout breadcrumbs={breadcrumbs}>
                    <Head title="Acceso Denegado" />
                    <div className="text-center py-12">
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                            No tienes permisos para acceder a esta página
                        </h3>
                    </div>
                </AppLayout>
            );
        }

        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <>
                    <Head title="Ajuste de Inventario" />
                    <div className="flex flex-col gap-6 p-4">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                                    Ajuste de Inventario
                                </h2>
                                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                                    {vista === 'crear' ? 'Realizar ajustes manuales de stock por almacén' : vista === 'tabla' ? 'Ajuste masivo de stock por tabla editable' : 'Historial de ajustes realizados'}
                                </p>
                            </div>

                            {/* Tabs/Botones para cambiar de vista */}
                            <div className="flex gap-2 flex-wrap">
                                {/* <Button
                                    variant={vista === 'crear' ? 'default' : 'outline'}
                                    onClick={() => setVista('crear')}
                                    className="transition-colors"
                                >
                                    ➕ Crear Ajuste
                                </Button> */}
                                <Button
                                    variant="outline"
                                    onClick={() => router.visit('/inventario/ajuste-tabla')}
                                    className="transition-colors"
                                >
                                    ➕ Crear Ajuste
                                </Button>
                                {/* <Button
                                    variant={vista === 'historico' ? 'default' : 'outline'}
                                    onClick={() => setVista('historico')}
                                    className="transition-colors"
                                >
                                    📋 Histórico
                                </Button> */}
                            </div>
                        </div>

                        {/* VISTA: CREAR AJUSTE */}
                        {vista === 'crear' && (
                        <>
                        {/* Selección de almacén y buscador de productos en una fila */}
                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <SearchSelect
                                        label="Seleccionar Almacén"
                                        placeholder="Selecciona un almacén..."
                                        value={almacenSeleccionado}
                                        options={almacenes.map(a => ({ value: String(a.id), label: a.nombre }))}
                                        onChange={value => handleAlmacenChange(String(value))}
                                        searchPlaceholder="Buscar almacén..."
                                        emptyText="No se encontraron almacenes"
                                        required
                                    />
                                </div>
                                <div className={almacenSeleccionado ? '' : 'opacity-50 pointer-events-none'}>
                                    <InputSearch
                                        label="Buscar producto"
                                        value={productoSeleccionado?.id ?? null}
                                        onChange={(_id, option) => {
                                            if (option) {
                                                const prod = stock_productos.find(p => p.id === option.value);
                                                if (prod) {
                                                    setProductoSeleccionado(prod);
                                                    // Inicializar el ajuste con valores por defecto
                                                    inicializarAjuste(prod);
                                                }
                                            } else {
                                                setProductoSeleccionado(null);
                                            }
                                        }}
                                        showSearchButton={true}
                                        onSearch={async (query) => {
                                            const q = query.toLowerCase().trim();
                                            if (!q) return [];

                                            return stock_productos
                                                .filter(p => {
                                                    if (!p.producto) return false;

                                                    // Búsqueda por ID exacto
                                                    if (p.id.toString() === q) return true;

                                                    // Búsqueda por nombre
                                                    if (p.producto.nombre.toLowerCase().includes(q)) return true;

                                                    // Búsqueda por SKU
                                                    if (p.producto.sku && p.producto.sku.toLowerCase().includes(q)) return true;

                                                    // Búsqueda por código de barras principal (si existe)
                                                    if (p.producto.codigo_barras && p.producto.codigo_barras.toLowerCase().includes(q)) return true;

                                                    // Búsqueda por lote (si existe)
                                                    if (p.lote && p.lote.toLowerCase().includes(q)) return true;

                                                    // Búsqueda numérica (solo números del código de barras)
                                                    const soloNumerosQuery = q.replace(/[^\d]/g, '');
                                                    if (soloNumerosQuery.length > 0) {
                                                        // Código de barras principal (solo números)
                                                        if (p.producto.codigo_barras) {
                                                            const soloNumerosCodigo = p.producto.codigo_barras.replace(/[^\d]/g, '');
                                                            if (soloNumerosCodigo.includes(soloNumerosQuery)) return true;
                                                        }
                                                    }

                                                    return false;
                                                })
                                                .map(p => {
                                                    const descripciones = [];

                                                    // Agregar SKU (primero, como identificador único)
                                                    if (p.producto?.sku) {
                                                        descripciones.push(`SKU: ${p.producto.sku}`);
                                                    }

                                                    // Agregar código de barras principal
                                                    if (p.producto?.codigo_barras) {
                                                        descripciones.push(`CB: ${p.producto.codigo_barras}`);
                                                    }

                                                    // Agregar código QR si existe
                                                    if (p.producto && 'codigo_qr' in p.producto && p.producto.codigo_qr) {
                                                        descripciones.push(`QR: ${String(p.producto.codigo_qr)}`);
                                                    }

                                                    // Agregar lote si existe
                                                    if (p.lote) {
                                                        descripciones.push(`Lote: ${p.lote}`);
                                                    }

                                                    // Agregar stock disponible
                                                    descripciones.push(`Stock: ${formatNumero(p.cantidad)}`);

                                                    return {
                                                        value: p.id,
                                                        label: p.producto?.nombre || 'Producto sin nombre',
                                                        description: descripciones.join(' | ') || 'Sin información adicional'
                                                    };
                                                });
                                        }}
                                        placeholder="Buscar por ID, nombre, SKU, código de barras, QR, lote..."
                                        emptyText="No se encontraron productos"
                                        disabled={!almacenSeleccionado}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Formulario de ajuste para el producto seleccionado */}
                        {productoSeleccionado && (
                            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 mt-4">
                                <div className="mb-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-lg text-gray-900 dark:text-gray-100">
                                                {productoSeleccionado.producto?.nombre || 'Producto no encontrado'}
                                            </div>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                {productoSeleccionado.producto?.sku && (
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300">SKU:</span> {productoSeleccionado.producto.sku}
                                                    </div>
                                                )}
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">Código:</span> {productoSeleccionado.producto?.codigo_barras || 'Sin código'}
                                                </div>
                                            </div>
                                            {/* Mostrar código QR si existe */}
                                            {(() => {
                                                const producto = productoSeleccionado.producto;
                                                if (!producto) return null;
                                                // Verificar si tiene codigo_qr de forma segura
                                                if ('codigo_qr' in producto && producto.codigo_qr) {
                                                    return (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            Código QR: {String(producto.codigo_qr)}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                            {/* Mostrar códigos de barra adicionales */}
                                            {(() => {
                                                const producto = productoSeleccionado.producto;
                                                if (!producto) return null;
                                                // Verificar si tiene codigos de forma segura
                                                if ('codigos' in producto && Array.isArray(producto.codigos) && producto.codigos.length > 0) {
                                                    const codigosAdicionales = producto.codigos
                                                        .filter((c: unknown) => {
                                                            const codigo = c as { es_principal?: boolean; codigo?: string };
                                                            return codigo.es_principal !== true && codigo.codigo;
                                                        })
                                                        .map((c: unknown) => {
                                                            const codigo = c as { codigo: string };
                                                            return codigo.codigo;
                                                        })
                                                        .join(', ');
                                                    return codigosAdicionales ? (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            CB Adicionales: {codigosAdicionales}
                                                        </div>
                                                    ) : null;
                                                }
                                                return null;
                                            })()}
                                            {productoSeleccionado.lote && (
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    Lote: {productoSeleccionado.lote}
                                                </div>
                                            )}
                                        </div>
                                        {/* Indicador de stock actual */}
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Stock Actual
                                            </div>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                                {formatNumero(productoSeleccionado.cantidad)}
                                            </div>
                                        </div>
                                    </div>
                                    {/* Indicador de cambio de stock */}
                                    {(() => {
                                        const diferencia = getDiferencia(productoSeleccionado);
                                        if (diferencia !== 0) {
                                            return (
                                                <div className={`mb-6 p-4 rounded-lg border-2 ${diferencia > 0
                                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                                                    : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700'
                                                    }`}>
                                                    <div className="flex items-center">
                                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${diferencia > 0
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-red-500 text-white'
                                                            }`}>
                                                            {diferencia > 0 ? (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className={`font-medium text-sm ${diferencia > 0
                                                                ? 'text-green-800 dark:text-green-300'
                                                                : 'text-red-800 dark:text-red-300'
                                                                }`}>
                                                                {tipoOperacion === 'entrada' ? 'Entrada' : 'Salida'} de {formatNumero(Math.abs(diferencia))} unidades
                                                            </div>
                                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                                Stock actual: {formatNumero(productoSeleccionado.cantidad)} → Stock final: {formatNumero(ajustes[productoSeleccionado.id]?.nueva_cantidad || productoSeleccionado.cantidad)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })()}
                                    {/* Stock Actual */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Stock Actual
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                min="0"
                                                value={formatNumero(productoSeleccionado.cantidad)}
                                                readOnly
                                                className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-gray-100 dark:bg-gray-800 font-semibold"
                                            />
                                        </div>
                                    </div>

                                    {/* Cantidad */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Cantidad
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                {tipoOperacion === 'entrada' ? (
                                                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                ) : (
                                                    <svg className="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                    </svg>
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                min="0"
                                                value={ajustes[productoSeleccionado.id]?.inputCantidad !== undefined ? ajustes[productoSeleccionado.id].inputCantidad : productoSeleccionado.cantidad}
                                                onChange={e => handleCantidadChange(productoSeleccionado.id, e.target.value.replace(/[^0-9]/g, ''))}
                                                placeholder={ajustes[productoSeleccionado.id]?.inputCantidad === '' ? String(productoSeleccionado.cantidad) : ''}
                                                className={`block w-full pl-10 pr-3 py-2 rounded-md shadow-sm focus:ring-2 text-sm font-medium ${tipoOperacion === 'entrada'
                                                    ? 'border-green-300 dark:border-green-600 focus:border-green-500 focus:ring-green-500/20 bg-green-50 dark:bg-green-900/20'
                                                    : 'border-red-300 dark:border-red-600 focus:border-red-500 focus:ring-red-500/20 bg-red-50 dark:bg-red-900/20'
                                                    }`}
                                            />
                                        </div>
                                    </div>

                                    {/* Stock Total */}
                                    <div className="relative">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Stock Total
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                pattern="[0-9]*"
                                                min="0"
                                                value={formatNumero(ajustes[productoSeleccionado.id]?.nueva_cantidad !== undefined ? ajustes[productoSeleccionado.id].nueva_cantidad : productoSeleccionado.cantidad)}
                                                readOnly
                                                className="block w-full pl-10 pr-3 py-2 rounded-md border-blue-300 dark:border-blue-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-blue-50 dark:bg-blue-900/20 font-bold text-blue-700 dark:text-blue-300"
                                            />
                                            {/* Indicador de cambio */}
                                            {(() => {
                                                const diferencia = getDiferencia(productoSeleccionado);
                                                if (diferencia > 0) {
                                                    return (
                                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                            <svg className="h-4 w-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                            </svg>
                                                        </div>
                                                    );
                                                } else if (diferencia < 0) {
                                                    return (
                                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                            <svg className="h-4 w-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                                            </svg>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>
                                    </div>

                                    {/* Indicador de operación */}
                                    <div className="flex items-end">
                                        <div className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${tipoOperacion === 'entrada'
                                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                                            }`}>
                                            {tipoOperacion === 'entrada' ? (
                                                <>
                                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                    </svg>
                                                    Entrada
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                    </svg>
                                                    Salida
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {/* Nueva fila para TipoAjuste y Observación */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    {/* Radio buttons para Entrada/Salida */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Tipo de Operación
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${tipoOperacion === 'entrada'
                                                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="tipo-operacion"
                                                    value="entrada"
                                                    checked={tipoOperacion === 'entrada'}
                                                    onChange={(e) => handleTipoOperacionChange(e.target.value as 'entrada' | 'salida')}
                                                    className="sr-only"
                                                />
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${tipoOperacion === 'entrada'
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                                                        }`}>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className={`font-medium text-sm ${tipoOperacion === 'entrada'
                                                            ? 'text-green-800 dark:text-green-300'
                                                            : 'text-gray-700 dark:text-gray-300'
                                                            }`}>
                                                            Entrada
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            Agregar stock
                                                        </div>
                                                    </div>
                                                </div>
                                                {tipoOperacion === 'entrada' && (
                                                    <div className="absolute top-2 right-2">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    </div>
                                                )}
                                            </label>

                                            <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${tipoOperacion === 'salida'
                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 shadow-md'
                                                : 'border-gray-200 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-500'
                                                }`}>
                                                <input
                                                    type="radio"
                                                    name="tipo-operacion"
                                                    value="salida"
                                                    checked={tipoOperacion === 'salida'}
                                                    onChange={(e) => handleTipoOperacionChange(e.target.value as 'entrada' | 'salida')}
                                                    className="sr-only"
                                                />
                                                <div className="flex items-center">
                                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${tipoOperacion === 'salida'
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-500'
                                                        }`}>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
                                                        </svg>
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className={`font-medium text-sm ${tipoOperacion === 'salida'
                                                            ? 'text-red-800 dark:text-red-300'
                                                            : 'text-gray-700 dark:text-gray-300'
                                                            }`}>
                                                            Salida
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                                            Reducir stock
                                                        </div>
                                                    </div>
                                                </div>
                                                {tipoOperacion === 'salida' && (
                                                    <div className="absolute top-2 right-2">
                                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Observación
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Describa el motivo del ajuste..."
                                                value={ajustes[productoSeleccionado.id]?.observacion || ''}
                                                onChange={e => handleObservacionChange(productoSeleccionado.id, e.target.value)}
                                                className="block w-full pl-10 pr-3 py-2 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Tipo de ajuste filtrado */}
                                <div className="mt-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Tipo de Ajuste Específico
                                            </label>
                                            <div className="ml-2 relative">
                                                <div className="group">
                                                    <svg className="h-4 w-4 text-gray-400 cursor-help" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                                                        Selecciona el tipo específico de ajuste de inventario
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* Toggle para mostrar todos los tipos */}
                                        {tipos.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setMostrarTodosTipos(!mostrarTodosTipos)}
                                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
                                            >
                                                {mostrarTodosTipos ? 'Mostrar filtrados' : 'Mostrar todos'}
                                            </button>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                            </svg>
                                        </div>
                                        <SearchSelect
                                            label=""
                                            placeholder={getTiposAMostrar().length === 0 ? "Cargando tipos de ajuste..." : `Selecciona tipo de ajuste${mostrarTodosTipos ? ' (todos)' : ''}...`}
                                            value={ajustes[productoSeleccionado.id]?.tipo_ajuste_id ?? ''}
                                            options={getTiposAMostrar().map(tipo => ({
                                                value: tipo.id,
                                                label: tipo.label,
                                                description: tipo.descripcion || `Clave: ${tipo.clave}`
                                            }))}
                                            onChange={value => handleTipoAjusteChange(productoSeleccionado.id, Number(value))}
                                            searchPlaceholder="Buscar tipo de ajuste..."
                                            emptyText={tipos.length === 0 ? "Cargando tipos de ajuste..." : `No se encontraron tipos de ajuste${mostrarTodosTipos ? '' : ` para ${tipoOperacion}`}`}
                                            disabled={getTiposAMostrar().length === 0}
                                            loading={tipos.length === 0}
                                            className="pl-10"
                                        />
                                        {/* Indicador de cantidad de tipos */}
                                        {tipos.length > 0 && (
                                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                <span className="text-xs text-gray-400">
                                                    {getTiposAMostrar().length} de {tipos.length}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Botón de guardar */}
                                <div className="mt-8 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => guardarAjusteIndividual(productoSeleccionado.id)}
                                        disabled={processing}
                                        className={`inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm transition-all duration-200 ${processing
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : tipoOperacion === 'entrada'
                                                ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                                : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                            } text-white focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                    >
                                        {processing ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                {tipoOperacion === 'entrada' ? 'Registrar Entrada' : 'Registrar Salida'}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                        {/* Aquí irán los siguientes pasos: agregar a lista y resumen */}
                        </>
                        )}

                        {/* VISTA: AJUSTE POR TABLA */}
                        {vista === 'tabla' && (
                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            <div className="mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                    Importa y procesa múltiples ajustes de una tabla editable
                                </p>
                                <Button asChild>
                                    <a href="/inventario/ajuste-tabla" className="inline-flex items-center">
                                        📊 Ir a Ajuste por Tabla Editable
                                    </a>
                                </Button>
                            </div>
                        </div>
                        )}

                        {/* VISTA: HISTÓRICO DE AJUSTES */}
                        {vista === 'historico' && (
                        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
                            {ajustes_inventario && ajustes_inventario.data.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>🔢Folio</TableHead>
                                                    <TableHead>🏪 Almacén</TableHead>
                                                    <TableHead>👤 Creador</TableHead>
                                                    <TableHead>📅 Fecha</TableHead>
                                                    <TableHead className="text-center">📦 Productos</TableHead>
                                                    <TableHead className="text-center">📥 Entradas</TableHead>
                                                    <TableHead className="text-center">📤 Salidas</TableHead>
                                                    <TableHead>📝 Observación</TableHead>
                                                    <TableHead className="text-center">📊 Estado</TableHead>
                                                    <TableHead className="text-center">⚙️</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {ajustes_inventario.data.map((ajuste) => (
                                                    <TableRow key={ajuste.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                        <TableCell className="font-mono font-semibold text-gray-900 dark:text-gray-100">
                                                            #{ajuste.id}
                                                        </TableCell>
                                                        <TableCell className="text-sm">
                                                            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 font-medium">
                                                                {ajuste.almacen?.nombre || 'Sin almacén'}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-sm whitespace-nowrap">
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                                {(ajuste.user?.name || 'Usuario desconocido').slice(0, 13)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-sm whitespace-nowrap">
                                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                                {new Date(ajuste.created_at).toLocaleDateString('es-ES')}
                                                            </div>
                                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                                {new Date(ajuste.created_at).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center font-bold text-gray-900 dark:text-gray-100">
                                                            {ajuste.cantidad_productos}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-semibold text-sm">
                                                                {ajuste.cantidad_entradas}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 font-semibold text-sm">
                                                                {ajuste.cantidad_salidas}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                                                            <div className="truncate" title={ajuste.observacion || ''}>
                                                                {(ajuste.observacion || '(sin observación)').slice(0, 13)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            {ajuste.estado === 'anulado' ? (
                                                                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 font-semibold text-sm">
                                                                    ❌ Anulado
                                                                </div>
                                                            ) : ajuste.estado === 'procesado' ? (
                                                                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-semibold text-sm">
                                                                    ✅ Procesado
                                                                </div>
                                                            ) : (
                                                                <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 font-semibold text-sm">
                                                                    ⏳ Pendiente
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="h-8 w-8 p-0"
                                                                        title="Acciones"
                                                                    >
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end" className="w-48">
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleAbrirImpresion(ajuste.id)}
                                                                        className="flex items-center gap-2 cursor-pointer"
                                                                    >
                                                                        <Printer className="h-4 w-4" />
                                                                        <span>Imprimir</span>
                                                                    </DropdownMenuItem>
                                                                    {ajuste.estado !== 'anulado' && hasRole('admin') && (
                                                                        <>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem
                                                                                onClick={() => setAjusteParaAnular(ajuste.id)}
                                                                                variant="destructive"
                                                                                className="flex items-center gap-2 cursor-pointer"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                                <span>Anular</span>
                                                                            </DropdownMenuItem>
                                                                        </>
                                                                    )}
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Paginación */}
                                    {ajustes_inventario.last_page > 1 && (
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                Mostrando {ajustes_inventario.from} a {ajustes_inventario.to} de {ajustes_inventario.total} ajustes
                                            </div>
                                            <div className="flex gap-2">
                                                {ajustes_inventario.links?.map((link, idx) => (
                                                    link.url ? (
                                                        <Button
                                                            key={idx}
                                                            variant={link.active ? 'default' : 'outline'}
                                                            size="sm"
                                                            onClick={() => router.visit(link.url)}
                                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                                        />
                                                    ) : null
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        📭 No hay ajustes registrados aún
                                    </p>
                                </div>
                            )}
                        </div>
                        )}
                    </div>

                    {/* Modal para seleccionar formato de impresión */}
                    <OutputSelectionModal
                        isOpen={isModalImpresionOpen}
                        onClose={() => setIsModalImpresionOpen(false)}
                        documentoId={ajusteIdParaImprimir || 0}
                        tipoDocumento="ajuste"
                        documentoInfo={{
                            numero: ajustes_inventario?.data.find(a => a.id === ajusteIdParaImprimir)?.numero || 'Ajuste'
                        }}
                    />

                    {/* Dialog para confirmar anulación */}
                    <Dialog open={ajusteParaAnular !== null} onOpenChange={(open) => {
                        if (!open) {
                            setAjusteParaAnular(null);
                            setMotivoAnulacion('');
                        }
                    }}>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>¿Anular ajuste?</DialogTitle>
                                <DialogDescription>
                                    Esta acción revertirá todos los movimientos de stock asociados al ajuste {ajustes_inventario?.data.find(a => a.id === ajusteParaAnular)?.numero}. No se puede deshacer.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div>
                                    <label htmlFor="motivo-anulacion" className="text-sm font-medium">
                                        Motivo de anulación (opcional)
                                    </label>
                                    <textarea
                                        id="motivo-anulacion"
                                        value={motivoAnulacion}
                                        onChange={(e) => setMotivoAnulacion(e.target.value)}
                                        placeholder="Ingresa el motivo de la anulación..."
                                        className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        rows={3}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setAjusteParaAnular(null);
                                        setMotivoAnulacion('');
                                    }}
                                    disabled={anulandoAjuste}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleAnularAjuste}
                                    disabled={anulandoAjuste}
                                    className="gap-2"
                                >
                                    {anulandoAjuste ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Anulando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Anular ajuste
                                        </>
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </>
            </AppLayout>
        );
    };

    // Retornar el contenido renderizado
    return renderContent();
}
