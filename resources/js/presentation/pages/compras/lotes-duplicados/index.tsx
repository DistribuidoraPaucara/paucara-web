import { Head, usePage, Link } from '@inertiajs/react';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import AppLayout from '@/layouts/app-layout';
import { useAuth } from '@/application/hooks/use-auth';
import { useState } from 'react';

interface Lote {
    id: number;
    producto_id: number;
    producto_nombre: string;
    producto_sku: string;
    almacen_nombre: string;
    lote: string;
    cantidad: number;
    cantidad_disponible: number;
    fecha_vencimiento: string | null;
    precio_costo: number;
    valor_total: number;
    es_duplicado: boolean;
    dado_de_baja: boolean;
    fecha_baja: string | null;
    esta_vencido: boolean;
}

interface PageProps extends InertiaPageProps {
    lotes: Lote[];
    total: number;
    duplicados: number;
    filtro?: string;
}

const breadcrumbs = [
    { title: 'Compras', href: '/compras' },
    { title: 'Lotes', href: '/compras/lotes-vencimientos/duplicados' },
];

export default function LotesDuplicados() {
    const { props } = usePage<PageProps>();
    const { can } = useAuth();
    const [busqueda, setBusqueda] = useState(props.filtro || '');
    const [mostrarSinVencimiento, setMostrarSinVencimiento] = useState(false);
    const [mostrarDadosDeBaja, setMostrarDadosDeBaja] = useState(false);
    const [mostrarVencidos, setMostrarVencidos] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [loteEnAccion, setLoteEnAccion] = useState<Lote | null>(null);
    const [cargando, setCargando] = useState(false);
    const [modalEdicionAbierto, setModalEdicionAbierto] = useState(false);
    const [loteEnEdicion, setLoteEnEdicion] = useState<Lote | null>(null);
    const [nuevoLote, setNuevoLote] = useState('');
    const [nuevaFechaVencimiento, setNuevaFechaVencimiento] = useState('');

    if (!can('compras.lotes-vencimientos.index')) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Sin acceso" />
                <p className="p-6">No tienes permiso</p>
            </AppLayout>
        );
    }

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        let url = '/compras/lotes-vencimientos/duplicados';
        const params = new URLSearchParams();

        if (busqueda.trim()) {
            params.append('q', busqueda);
        }
        if (mostrarSinVencimiento) {
            params.append('sin_vencimiento', 'true');
        }
        if (mostrarDadosDeBaja) {
            params.append('mostrar_dados_de_baja', 'true');
        }
        if (mostrarVencidos) {
            params.append('solo_vencidos', 'true');
        }

        if (params.toString()) {
            url += '?' + params.toString();
        }
        window.location.href = url;
    };

    const handleClear = () => {
        setBusqueda('');
        setMostrarSinVencimiento(false);
        setMostrarDadosDeBaja(false);
        setMostrarVencidos(false);
        window.location.href = '/compras/lotes-vencimientos/duplicados';
    };

    const abrirModal = (lote: Lote) => {
        setLoteEnAccion(lote);
        setModalAbierto(true);
    };

    const cerrarModal = () => {
        setModalAbierto(false);
        setLoteEnAccion(null);
    };

    const getCsrfToken = () => {
        const meta = document.querySelector('meta[name="csrf-token"]');
        return meta ? (meta as HTMLMetaElement).content : '';
    };

    const handleDarDeBaja = async () => {
        if (!loteEnAccion) return;

        setCargando(true);
        try {
            const response = await fetch(
                `/compras/lotes-vencimientos/${loteEnAccion.id}/dar-de-baja`,
                {
                    method: 'DELETE',
                    headers: {
                        'X-CSRF-TOKEN': getCsrfToken(),
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                cerrarModal();
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.message || 'Error al dar de baja el lote');
            }
        } catch (error) {
            alert('Error: ' + (error instanceof Error ? error.message : 'Desconocido'));
        } finally {
            setCargando(false);
        }
    };

    const handleRestaurar = async () => {
        if (!loteEnAccion) return;

        setCargando(true);
        try {
            const response = await fetch(
                `/compras/lotes-vencimientos/${loteEnAccion.id}/restaurar`,
                {
                    method: 'PATCH',
                    headers: {
                        'X-CSRF-TOKEN': getCsrfToken(),
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.ok) {
                cerrarModal();
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.message || 'Error al restaurar el lote');
            }
        } catch (error) {
            alert('Error: ' + (error instanceof Error ? error.message : 'Desconocido'));
        } finally {
            setCargando(false);
        }
    };

    const abrirModalEdicion = (lote: Lote) => {
        setLoteEnEdicion(lote);
        setNuevoLote(lote.lote || '');
        setNuevaFechaVencimiento(lote.fecha_vencimiento || '');
        setModalEdicionAbierto(true);
    };

    const cerrarModalEdicion = () => {
        setModalEdicionAbierto(false);
        setLoteEnEdicion(null);
        setNuevoLote('');
        setNuevaFechaVencimiento('');
    };

    const handleGuardarEdicion = async () => {
        if (!loteEnEdicion) return;

        setCargando(true);
        try {
            const response = await fetch(
                `/compras/lotes-vencimientos/${loteEnEdicion.id}/actualizar-lote`,
                {
                    method: 'PATCH',
                    headers: {
                        'X-CSRF-TOKEN': getCsrfToken(),
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        lote: nuevoLote || null,
                        fecha_vencimiento: nuevaFechaVencimiento || null,
                    }),
                }
            );

            if (response.ok) {
                cerrarModalEdicion();
                window.location.reload();
            } else {
                const error = await response.json();
                alert(error.message || 'Error al actualizar el lote');
            }
        } catch (error) {
            alert('Error: ' + (error instanceof Error ? error.message : 'Desconocido'));
        } finally {
            setCargando(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lotes" />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-2">Productos - Almacenes - Lotes</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Total: {props.total} | Duplicados: {props.duplicados}
                </p>

                {/* Búsqueda y Filtros */}
                <form onSubmit={handleSearch} className="mb-6 space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Buscar por nombre, SKU o lote..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        />
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Buscar
                        </button>
                        {(busqueda || mostrarSinVencimiento || mostrarVencidos || mostrarDadosDeBaja) && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            >
                                Limpiar
                            </button>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={mostrarSinVencimiento}
                                onChange={(e) => setMostrarSinVencimiento(e.target.checked)}
                                className="w-4 h-4 rounded"
                            />
                            <span>Mostrar solo lotes sin fecha de vencimiento</span>
                        </label>
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={mostrarVencidos}
                                onChange={(e) => setMostrarVencidos(e.target.checked)}
                                className="w-4 h-4 rounded"
                            />
                            <span>Mostrar solo lotes vencidos</span>
                        </label>
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <input
                                type="checkbox"
                                checked={mostrarDadosDeBaja}
                                onChange={(e) => setMostrarDadosDeBaja(e.target.checked)}
                                className="w-4 h-4 rounded"
                            />
                            <span>Mostrar solo lotes dados de baja</span>
                        </label>
                    </div>
                </form>

                {/* Tabla */}
                {props.lotes && props.lotes.length > 0 ? (
                    <div className="overflow-x-auto border rounded dark:border-gray-700">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 text-left font-semibold">#</th>
                                    <th className="px-4 py-2 text-left font-semibold">
                                        Producto
                                    </th>
                                    <th className="px-4 py-2 text-left font-semibold">SKU</th>
                                    <th className="px-4 py-2 text-left font-semibold">
                                        Almacén
                                    </th>
                                    <th className="px-4 py-2 text-left font-semibold">Id Lote</th>
                                    <th className="px-4 py-2 text-left font-semibold">Lote</th>
                                    <th className="px-4 py-2 text-right font-semibold">
                                        Cant
                                    </th>
                                    {/* <th className="px-4 py-2 text-right font-semibold">
                                        Disp
                                    </th> */}
                                    <th className="px-4 py-2 text-left font-semibold">
                                        Vencimiento
                                    </th>
                                    <th className="px-4 py-2 text-right font-semibold">
                                        P.Costo
                                    </th>
                                    <th className="px-4 py-2 text-right font-semibold">
                                        Valor
                                    </th>
                                    <th className="px-4 py-2 text-center font-semibold">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.lotes.map((lote: any) => (
                                    <tr
                                        key={lote.id}
                                        className={
                                            lote.dado_de_baja
                                                ? 'bg-gray-300 dark:bg-gray-600 opacity-60 line-through'
                                                : lote.esta_vencido
                                                ? 'bg-orange-100 dark:bg-orange-900'
                                                : lote.es_duplicado
                                                ? 'bg-red-100 dark:bg-red-900'
                                                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }
                                    >
                                        <td className="px-4 py-2 border-b dark:border-gray-600">
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {lote.producto_id}
                                            </div>
                                            {lote.dado_de_baja && (
                                                <div className="mt-1">
                                                    <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded">
                                                        BAJA
                                                    </span>
                                                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                        {lote.fecha_baja}
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-gray-600">
                                            <a
                                                href={`/productos/${lote.producto_id}/edit`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                {lote.producto_nombre}
                                            </a>
                                            
                                            {/* <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {lote.producto_sku}
                                            </div> */}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-gray-600">
                                            {lote.producto_sku}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-gray-600">
                                            {lote.almacen_nombre}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-gray-600">
                                            #{lote.id}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-gray-600 font-mono">
                                            {lote.lote ? (
                                                <>
                                                    {lote.lote}
                                                    {lote.es_duplicado && (
                                                        <span className="ml-2 text-red-600 dark:text-red-400 font-bold">
                                                            ⚠ DUP
                                                        </span>
                                                    )}
                                                    {lote.esta_vencido && (
                                                        <span className="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded font-semibold">
                                                            VENCIDO
                                                        </span>
                                                    )}
                                                </>
                                            ) : (
                                                <span className="text-orange-600 dark:text-orange-400 font-bold italic">
                                                    SIN LOTE
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-gray-600 text-right">
                                            {lote.cantidad}
                                        </td>
                                        {/* <td className="px-4 py-2 border-b dark:border-gray-600 text-right">
                                            {lote.cantidad_disponible}
                                        </td> */}
                                        <td className="px-4 py-2 border-b dark:border-gray-600">
                                            {lote.fecha_vencimiento ? (
                                                <span
                                                    className={
                                                        new Date(lote.fecha_vencimiento) <
                                                        new Date()
                                                            ? 'text-red-600 dark:text-red-400 font-bold'
                                                            : ''
                                                    }
                                                >
                                                    {lote.fecha_vencimiento}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 dark:text-gray-500">
                                                    -
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-gray-600 text-right font-mono">
                                            {lote.precio_costo.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-gray-600 text-right font-mono">
                                            {lote.valor_total.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 border-b dark:border-gray-600 text-center flex gap-2 justify-center">
                                            <button
                                                onClick={() => abrirModalEdicion(lote)}
                                                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-lg"
                                                title="Editar lote"
                                            >
                                                ✏️
                                            </button>
                                            {lote.dado_de_baja ? (
                                                <button
                                                    onClick={() => abrirModal(lote)}
                                                    className="p-2 bg-green-600 text-white rounded hover:bg-green-700 text-lg"
                                                    title="Restaurar lote"
                                                >
                                                    ♻️
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => abrirModal(lote)}
                                                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700 text-lg"
                                                    title="Dar de baja"
                                                >
                                                    🗑️
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                        {busqueda ? (
                            <p>
                                No hay resultados para "{busqueda}"
                            </p>
                        ) : (
                            <p>No hay lotes registrados</p>
                        )}
                    </div>
                )}

                {/* Modal de Edición */}
                {modalEdicionAbierto && loteEnEdicion && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                                Editar Lote
                            </h3>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Producto
                                    </label>
                                    <input
                                        type="text"
                                        disabled
                                        value={loteEnEdicion.producto_nombre}
                                        className="w-full px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-gray-300 disabled:opacity-50"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Número de Lote
                                    </label>
                                    <input
                                        type="text"
                                        value={nuevoLote}
                                        onChange={(e) => setNuevoLote(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
                                        placeholder="Ingrese el número de lote"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Fecha de Vencimiento
                                    </label>
                                    <input
                                        type="date"
                                        value={nuevaFechaVencimiento}
                                        onChange={(e) => setNuevaFechaVencimiento(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={cerrarModalEdicion}
                                    disabled={cargando}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleGuardarEdicion}
                                    disabled={cargando}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {cargando ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal de Confirmación */}
                {modalAbierto && loteEnAccion && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">
                                {loteEnAccion.dado_de_baja
                                    ? 'Restaurar Lote'
                                    : 'Dar de Baja Lote'}
                            </h3>

                            <p className="mb-4 text-gray-600 dark:text-gray-400">
                                {loteEnAccion.dado_de_baja ? (
                                    <>
                                        ¿Deseas restaurar el lote{' '}
                                        <strong>{loteEnAccion.lote}</strong> del producto{' '}
                                        <strong>{loteEnAccion.producto_nombre}</strong>?
                                    </>
                                ) : (
                                    <>
                                        ¿Deseas dar de baja el lote{' '}
                                        <strong>{loteEnAccion.lote}</strong> del producto{' '}
                                        <strong>{loteEnAccion.producto_nombre}</strong>? Esto es
                                        irreversible desde esta pantalla.
                                    </>
                                )}
                            </p>

                            <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded mb-6 text-sm text-gray-700 dark:text-gray-300">
                                <p>Almacén: <strong>{loteEnAccion.almacen_nombre}</strong></p>
                                <p>Cantidad: <strong>{loteEnAccion.cantidad}</strong></p>
                                {loteEnAccion.fecha_vencimiento && (
                                    <p>Vencimiento: <strong>{loteEnAccion.fecha_vencimiento}</strong></p>
                                )}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={cerrarModal}
                                    disabled={cargando}
                                    className="flex-1 px-4 py-2 bg-gray-300 text-gray-900 rounded hover:bg-gray-400 disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={
                                        loteEnAccion.dado_de_baja
                                            ? handleRestaurar
                                            : handleDarDeBaja
                                    }
                                    disabled={cargando}
                                    className={`flex-1 px-4 py-2 text-white rounded disabled:opacity-50 ${
                                        loteEnAccion.dado_de_baja
                                            ? 'bg-green-600 hover:bg-green-700'
                                            : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                >
                                    {cargando ? 'Procesando...' : 'Confirmar'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
