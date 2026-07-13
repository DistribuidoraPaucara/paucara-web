import type { EntregaVentaConfirmacion, VentaEntrega } from '@/domain/entities/entregas';
import { Link } from '@inertiajs/react';
import { AlertCircle, ChevronDown, ChevronLeft, ChevronRight, Download, Image as ImageIcon, Package, X } from 'lucide-react';
import { useState } from 'react';

interface ConfirmacionesEntregaSectionProps {
    confirmaciones?: EntregaVentaConfirmacion[];
    ventasEnEntrega?: VentaEntrega[];
}

interface ImageViewerModalProps {
    imagenes: string[];
    indiceInicial: number;
    onClose: () => void;
}

const TipoEntregaBadge = ({
    tipoEntregaVal,
    tipoNovedadVal,
    tipoConfirmacionVal,
}: {
    tipoEntregaVal?: string;
    tipoNovedadVal?: string;
    tipoConfirmacionVal?: string;
}) => {
    const novedadesValidas = ['CLIENTE_CERRADO', 'DEVOLUCION_PARCIAL', 'RECHAZADO'];
    const tipoNovedad = novedadesValidas.includes(tipoNovedadVal || '')
        ? tipoNovedadVal
        : novedadesValidas.includes(tipoConfirmacionVal || '')
          ? tipoConfirmacionVal
          : undefined;
    const tieneEntrega = Boolean(tipoEntregaVal);
    const tieneConfirmacion = Boolean(tipoConfirmacionVal);
    const tieneNovedad = Boolean(tipoNovedad);

    if (!tieneEntrega && !tieneConfirmacion && !tieneNovedad) {
        return (
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-200">
                ❓ Sin datos
            </span>
        );
    }

    const entregaClase =
        tipoEntregaVal === 'COMPLETA'
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
            : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200';

    const entregaTexto = tipoEntregaVal === 'COMPLETA' ? 'Entrega: Completa' : `Entrega: ${tipoEntregaVal}`;

    const confirmacionClases: Record<string, string> = {
        COMPLETA: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        CLIENTE_CERRADO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
        RECHAZADO: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
        DEVOLUCION_PARCIAL: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
    };

    const confirmacionTexto: Record<string, string> = {
        COMPLETA: 'Confirmación: Completa',
        CLIENTE_CERRADO: 'Confirmación: Cliente Cerrado',
        RECHAZADO: 'Confirmación: Rechazado',
        DEVOLUCION_PARCIAL: 'Confirmación: Devolución Parcial',
        CON_NOVEDAD: 'Confirmación: Con Novedad',
    };

    const novedadClases: Record<string, string> = {
        CLIENTE_CERRADO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
        DEVOLUCION_PARCIAL: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
        RECHAZADO: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
    };

    const novedadTexto: Record<string, string> = {
        CLIENTE_CERRADO: 'Novedad: Cliente Cerrado',
        DEVOLUCION_PARCIAL: 'Novedad: Devolución Parcial',
        RECHAZADO: 'Novedad: Rechazado',
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {/* {tieneEntrega && (
                <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${entregaClase}`}>
                    {tipoEntregaVal === 'COMPLETA' ? '✅' : '⚠️'} {entregaTexto}
                </span>
            )} */}

            {tieneConfirmacion && (
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${confirmacionClases[tipoConfirmacionVal || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'}`}
                >
                    {tipoConfirmacionVal === 'COMPLETA' ? '🚚' : '📋'}{' '}
                    {confirmacionTexto[tipoConfirmacionVal || ''] || `Confirmación: ${tipoConfirmacionVal}`}
                </span>
            )}

            {/* {tieneNovedad && (
                <span
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium ${novedadClases[tipoNovedad || ''] || 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'}`}
                >
                    <AlertCircle size={14} /> {novedadTexto[tipoNovedad || ''] || `Novedad: ${tipoNovedad}`}
                </span>
            )} */}
        </div>
    );
};

const ImageViewerModal = ({ imagenes, indiceInicial, onClose }: ImageViewerModalProps) => {
    const [indiceActual, setIndiceActual] = useState(indiceInicial);

    const handleAnterior = () => {
        setIndiceActual((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
    };

    const handleSiguiente = () => {
        setIndiceActual((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
    };

    const handleDescargarImagen = () => {
        try {
            const imagenUrl = imagenes[indiceActual];

            // Generar nombre de archivo con timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
            const nombreArchivo = `entrega-foto-${timestamp}.jpg`;

            // Crear elemento <a> y triggerear descarga directa
            // Este método evita errores CORS al no usar fetch
            const enlace = document.createElement('a');
            enlace.href = imagenUrl;
            enlace.setAttribute('download', nombreArchivo);
            enlace.setAttribute('target', '_blank');
            enlace.style.display = 'none';

            document.body.appendChild(enlace);
            enlace.click();

            // Limpiar después de un pequeño delay
            setTimeout(() => {
                document.body.removeChild(enlace);
            }, 100);
        } catch (error) {
            console.error('Error al descargar imagen:', error);
            alert('No se pudo descargar la imagen. Intenta de nuevo.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={onClose}>
            <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 transition-colors hover:bg-white dark:bg-gray-900/90 dark:hover:bg-gray-800"
                >
                    <X size={24} className="text-gray-900 dark:text-gray-100" />
                </button>

                {/* Imagen */}
                <div className="flex flex-1 items-center justify-center overflow-hidden rounded-lg bg-black">
                    <img
                        src={imagenes[indiceActual]}
                        alt={`Imagen ${indiceActual + 1}`}
                        className="max-h-[85vh] max-w-full object-contain"
                        onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src =
                                'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 w=%22400%22 h=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2224%22%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                        }}
                    />
                </div>

                {/* Navegación */}
                <div className="mt-4 flex items-center justify-between gap-2 text-white">
                    <button
                        onClick={handleAnterior}
                        className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30 disabled:opacity-50"
                        disabled={imagenes.length <= 1}
                        title="Imagen anterior"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="flex-1 text-center">
                        <p className="text-sm font-medium">
                            {indiceActual + 1} de {imagenes.length}
                        </p>
                    </div>

                    <button
                        onClick={handleDescargarImagen}
                        className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
                        title="Descargar imagen"
                    >
                        <Download size={24} />
                    </button>

                    <button
                        onClick={handleSiguiente}
                        className="rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30 disabled:opacity-50"
                        disabled={imagenes.length <= 1}
                        title="Siguiente imagen"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function ConfirmacionesEntregaSection({ confirmaciones = [], ventasEnEntrega = [] }: ConfirmacionesEntregaSectionProps) {
    console.log('Confirmaciones :::::>>>> ', confirmaciones);
    const [expandedConfirmaciones, setExpandedConfirmaciones] = useState<Record<number, boolean>>({});
    const [imagenSeleccionada, setImagenSeleccionada] = useState<{ imagenes: string[]; indice: number } | null>(null);

    if (!confirmaciones || confirmaciones.length === 0) {
        return (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                    📋 Sin confirmaciones de entrega aún. El chofer reportará el estado de cada venta entregada desde la app.
                </p>
            </div>
        );
    }

    const toggleExpand = (id: number) => {
        setExpandedConfirmaciones((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return (
        <div className="space-y-4">
            <div className="mb-4 flex items-center gap-2">
                <Package size={20} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">📦 Reportes de Entregas del Chofer</h3>
                <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                    {confirmaciones.length}
                </span>
            </div>

            <div className="space-y-3">
                {confirmaciones.map((confirmacion) => (
                    <div
                        key={confirmacion.id}
                        className="overflow-hidden rounded-lg border border-gray-200 transition-all duration-200 hover:shadow-md dark:border-gray-700 dark:hover:shadow-gray-800/50"
                    >
                        {/* Header - Click para expandir */}
                        <button
                            onClick={() => toggleExpand(confirmacion.id as number)}
                            className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left transition-colors hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                        >
                            <div className="flex flex-1 items-center gap-3">
                                <ChevronDown
                                    size={20}
                                    className={`text-gray-600 transition-transform dark:text-gray-400 ${
                                        expandedConfirmaciones[confirmacion.id as number] ? 'rotate-180' : ''
                                    }`}
                                />
                                {/* ID DE ENTREGA */}
                                <Link
                                    href={`/ventas/${confirmacion.venta?.id}`}
                                    className="flex items-center gap-1 rounded bg-gray-200 px-2 py-1 font-mono text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                                >
                                    {confirmacion.venta?.id ? `Venta #${confirmacion.venta.id}` : 'Venta Desconocida'}
                                </Link>

                                {/* Venta Número y Cliente */}
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{confirmacion.venta?.cliente?.nombre || 'Cliente desconocido'}</p>
                                    <div className="flex items-center">
                                        <p className="text-sm">
                                            {confirmacion.venta?.total
                                                ? `Total: Bs. ${Number(confirmacion.venta.total).toFixed(2)}`
                                                : 'Total desconocido'}
                                        </p>
                                        <p className="ml-2 text-sm text-cyan-600 dark:text-cyan-400 font-medium">
                                            {confirmacion.total_dinero_recibido
                                                ?? `Recibido: Bs. ${Number(confirmacion.total_dinero_recibido).toFixed(2)}`}
                                        </p>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex items-center gap-2">
                                    <TipoEntregaBadge
                                        tipoEntregaVal={confirmacion.tipo_entrega}
                                        tipoNovedadVal={confirmacion.tipo_novedad}
                                        tipoConfirmacionVal={confirmacion.tipo_confirmacion}
                                    />
                                </div>
                            </div>
                        </button>

                        {/* Contenido expandido */}
                        {expandedConfirmaciones[confirmacion.id as number] && (
                            <div className="space-y-4 border-t border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900/50">
                                {/* 1️⃣ Estado de Entrega */}
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    
                                    {/* <EstadoPagoBadge estado={confirmacion.estado_pago} /> */}
                                    <TipoEntregaBadge
                                        tipoEntregaVal={confirmacion.tipo_entrega}
                                        tipoNovedadVal={confirmacion.tipo_novedad}
                                        tipoConfirmacionVal={confirmacion.tipo_confirmacion}
                                    />
                                </div>

                                {/* 4️⃣ Devoluciones Parciales */}
                                {confirmacion.tipo_confirmacion === 'DEVOLUCION_PARCIAL' &&
                                    confirmacion.productos_devueltos &&
                                    confirmacion.productos_devueltos.length > 0 && (
                                        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                            <p className="mb-3 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                                🔄 Productos Devueltos ({confirmacion.productos_devueltos.length})
                                            </p>
                                            <div className="space-y-2 rounded border border-orange-200 bg-orange-50 p-3 dark:border-orange-800 dark:bg-orange-900/20">
                                                {confirmacion.productos_devueltos.map((producto, idx) => (
                                                    <div key={idx} className="text-sm">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                {producto.producto_nombre}
                                                            </span>
                                                            <span className="font-medium text-orange-600 dark:text-orange-400">
                                                                -{producto.cantidad}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
                                                            <span>Bs. {(Number(producto.precio_unitario) || 0).toFixed(2)} c/u</span>
                                                            <span>Total: Bs. {(Number(producto.subtotal) || 0).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                ))}

                                                {Number(confirmacion.monto_devuelto || 0) > 0 && (
                                                    <div className="mt-2 border-t border-orange-200 pt-2 dark:border-orange-800">
                                                        <div className="flex items-center justify-between text-sm font-medium">
                                                            <span className="text-orange-900 dark:text-orange-100">Total Devuelto</span>
                                                            <span className="text-orange-600 dark:text-orange-400">
                                                                Bs. {(Number(confirmacion.monto_devuelto) || 0).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                {/* 5️⃣ Observaciones */}
                                {confirmacion.observaciones_logistica && (
                                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                        <p className="mb-2 text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
                                            Observaciones
                                        </p>
                                        <p className="rounded bg-gray-50 p-3 text-sm text-gray-700 dark:bg-gray-800/50 dark:text-gray-300">
                                            {confirmacion.observaciones_logistica}
                                        </p>
                                    </div>
                                )}

                                {/* 6️⃣ Evidencia (Fotos y Firma) */}
                                {(confirmacion.fotos?.length || confirmacion.firma_digital_url || confirmacion.foto_comprobante) && (
                                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                        <div className="space-y-4">
                                            {/* Galería de Fotos de Entrega */}
                                            {confirmacion.fotos && confirmacion.fotos.length > 0 && (
                                                <div>
                                                    <p className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        📷 Fotos de Entrega ({confirmacion.fotos.length})
                                                    </p>
                                                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                                        {confirmacion.fotos.map((foto, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() =>
                                                                    setImagenSeleccionada({ imagenes: confirmacion.fotos as string[], indice: idx })
                                                                }
                                                                className="group relative aspect-square overflow-hidden rounded-lg bg-gray-200 transition-shadow hover:shadow-md dark:bg-gray-700"
                                                            >
                                                                <img
                                                                    src={foto}
                                                                    alt={`Entrega foto ${idx + 1}`}
                                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                                    onError={(e) => {
                                                                        const img = e.target as HTMLImageElement;
                                                                        img.src =
                                                                            'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 w=%22200%22 h=%22200%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2212%22%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30">
                                                                    <ImageIcon
                                                                        size={16}
                                                                        className="text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                                    />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Firma Digital */}
                                            {confirmacion.firma_digital_url && (
                                                <div>
                                                    <p className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">✍️ Firma Digital</p>
                                                    <button
                                                        onClick={() =>
                                                            setImagenSeleccionada({ imagenes: [confirmacion.firma_digital_url as string], indice: 0 })
                                                        }
                                                        className="group relative h-40 w-full overflow-hidden rounded-lg bg-gray-200 transition-shadow hover:shadow-md dark:bg-gray-700"
                                                    >
                                                        <img
                                                            src={confirmacion.firma_digital_url}
                                                            alt="Firma Digital"
                                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                            onError={(e) => {
                                                                const img = e.target as HTMLImageElement;
                                                                img.src =
                                                                    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 w=%22400%22 h=%22200%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2216%22%3EFirma no disponible%3C/text%3E%3C/svg%3E';
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30">
                                                            <ImageIcon
                                                                size={20}
                                                                className="text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                            />
                                                        </div>
                                                    </button>
                                                </div>
                                            )}

                                            {/* Foto de Comprobante */}
                                            {confirmacion.foto_comprobante && (
                                                <div>
                                                    <p className="mb-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                                                        📄 Comprobante de Pago
                                                    </p>
                                                    <button
                                                        onClick={() =>
                                                            setImagenSeleccionada({ imagenes: [confirmacion.foto_comprobante as string], indice: 0 })
                                                        }
                                                        className="group relative h-40 w-full overflow-hidden rounded-lg bg-gray-200 transition-shadow hover:shadow-md dark:bg-gray-700"
                                                    >
                                                        <img
                                                            src={confirmacion.foto_comprobante}
                                                            alt="Comprobante"
                                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                            onError={(e) => {
                                                                const img = e.target as HTMLImageElement;
                                                                img.src =
                                                                    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 w=%22400%22 h=%22200%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2216%22%3EComprobante no disponible%3C/text%3E%3C/svg%3E';
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30">
                                                            <ImageIcon
                                                                size={20}
                                                                className="text-white opacity-0 transition-opacity group-hover:opacity-100"
                                                            />
                                                        </div>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 7️⃣ Fecha de Confirmación y confirmado por */}
                                {confirmacion.confirmado_en && (
                                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            ✅ Confirmado el{' '}
                                            {new Date(confirmacion.confirmado_en).toLocaleDateString('es-ES', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                        {confirmacion.confirmado_por && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                Por: {confirmacion.confirmado_por.name}
                                            </p>
                                        )}
                                    </div>
                                )}

                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal visor de imágenes */}
            {imagenSeleccionada && (
                <ImageViewerModal
                    imagenes={imagenSeleccionada.imagenes}
                    indiceInicial={imagenSeleccionada.indice}
                    onClose={() => setImagenSeleccionada(null)}
                />
            )}
        </div>
    );
}
