import { useState } from 'react';
import { ChevronDown, Package, AlertCircle, CheckCircle2, XCircle, Image as ImageIcon, FileText, X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import type { EntregaVentaConfirmacion, VentaEntrega } from '@/domain/entities/entregas';

interface ConfirmacionesEntregaSectionProps {
    confirmaciones?: EntregaVentaConfirmacion[];
    ventasEnEntrega?: VentaEntrega[];
}

interface ImageViewerModalProps {
    imagenes: string[];
    indiceInicial: number;
    onClose: () => void;
}

const TipoEntregaBadge = ({ tipo, tipoNovedad }: { tipo?: string; tipoNovedad?: string }) => {
    // ✅ ACTUALIZADO: Usar CON_NOVEDAD en lugar de NOVEDAD
    if (tipo === 'CON_NOVEDAD') {
        const novedadClases: Record<string, string> = {
            CLIENTE_CERRADO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
            DEVOLUCION_PARCIAL: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
            RECHAZADO: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
            NO_CONTACTADO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
        };
        const clase = novedadClases[tipoNovedad || ''] || 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
        const novedadTexto: Record<string, string> = {
            CLIENTE_CERRADO: 'Cliente Cerrado',
            DEVOLUCION_PARCIAL: 'Devolución Parcial',
            RECHAZADO: 'Rechazado',
            NO_CONTACTADO: 'No Contactado',
        };
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${clase}`}>
                <AlertCircle size={14} />
                ⚠️ {novedadTexto[tipoNovedad || ''] || 'Novedad'}
            </span>
        );
    }

    // ✅ Si es COMPLETA
    if (tipo === 'COMPLETA') {
        return (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200">
                <CheckCircle2 size={14} />
                ✅ Completa
            </span>
        );
    }

    // Fallback para valores desconocidos
    return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
            ❓ {tipo}
        </span>
    );
};

const EstadoPagoBadge = ({ estado }: { estado?: string }) => {
    const clases: Record<string, string> = {
        PAGADO: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        PARCIAL: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
        CREDITO: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200',
        NO_PAGADO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    };

    const etiquetas: Record<string, string> = {
        PAGADO: '✅ Pagado',
        PARCIAL: '⚠️ Pago Parcial',
        CREDITO: '💳 Crédito',
        NO_PAGADO: '❌ No Pagado',
    };

    const clase = clases[estado || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${clase}`}>
            {etiquetas[estado || ''] || 'Desconocido'}
        </span>
    );
};

const TipoConfirmacionBadge = ({ tipo }: { tipo?: string }) => {
    const clases: Record<string, string> = {
        COMPLETA: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
        CLIENTE_CERRADO: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
        RECHAZADO: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
        DEVOLUCION_PARCIAL: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200',
    };

    const etiquetas: Record<string, string> = {
        COMPLETA: '🚚 Completa',
        CLIENTE_CERRADO: '🔄 Cliente Cerrado',
        RECHAZADO: '❌ Rechazado',
        DEVOLUCION_PARCIAL: '📦 Devolución Parcial',
    };

    const clase = clases[tipo || ''] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

    return (
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${clase}`}>
            {etiquetas[tipo || ''] || 'Desconocido'}
        </span>
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
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                {/* Botón cerrar */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-800 rounded-full p-2 transition-colors"
                >
                    <X size={24} className="text-gray-900 dark:text-gray-100" />
                </button>

                {/* Imagen */}
                <div className="flex-1 flex items-center justify-center bg-black rounded-lg overflow-hidden">
                    <img
                        src={imagenes[indiceActual]}
                        alt={`Imagen ${indiceActual + 1}`}
                        className="max-w-full max-h-[85vh] object-contain"
                        onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 w=%22400%22 h=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2224%22%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                        }}
                    />
                </div>

                {/* Navegación */}
                <div className="flex items-center justify-between mt-4 text-white gap-2">
                    <button
                        onClick={handleAnterior}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors disabled:opacity-50"
                        disabled={imagenes.length <= 1}
                        title="Imagen anterior"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="text-center flex-1">
                        <p className="text-sm font-medium">
                            {indiceActual + 1} de {imagenes.length}
                        </p>
                    </div>

                    <button
                        onClick={handleDescargarImagen}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
                        title="Descargar imagen"
                    >
                        <Download size={24} />
                    </button>

                    <button
                        onClick={handleSiguiente}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors disabled:opacity-50"
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
    console.log("Confirmaciones :::::>>>> ", confirmaciones)
    const [expandedConfirmaciones, setExpandedConfirmaciones] = useState<Record<number, boolean>>({});
    const [imagenSeleccionada, setImagenSeleccionada] = useState<{ imagenes: string[]; indice: number } | null>(null);

    if (!confirmaciones || confirmaciones.length === 0) {
        return (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
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
            <div className="flex items-center gap-2 mb-4">
                <Package size={20} className="text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    📦 Reportes de Entregas del Chofer
                </h3>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-semibold">
                    {confirmaciones.length}
                </span>
            </div>

            <div className="space-y-3">
                {confirmaciones.map((confirmacion) => (
                    <div
                        key={confirmacion.id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden transition-all duration-200 hover:shadow-md dark:hover:shadow-gray-800/50"
                    >
                        {/* Header - Click para expandir */}
                        <button
                            onClick={() => toggleExpand(confirmacion.id as number)}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-between text-left transition-colors"
                        >
                            <div className="flex-1 flex items-center gap-3">
                                <ChevronDown
                                    size={20}
                                    className={`text-gray-600 dark:text-gray-400 transition-transform ${expandedConfirmaciones[confirmacion.id as number] ? 'rotate-180' : ''
                                        }`}
                                />
                                {/* ID DE ENTREG */}
                                <div className="flex items-center gap-1 px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs font-mono text-gray-800 dark:text-gray-200">
                                    #{confirmacion.id}
                                </div>

                                {/* Venta Número y Cliente */}
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        Folio: #{confirmacion.venta?.id || 'Venta Desconocida'}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {confirmacion.venta?.cliente?.nombre || 'Cliente desconocido'}
                                    </p>
                                </div>

                                {/* Badges */}
                                <div className="flex items-center gap-2">
                                    <TipoEntregaBadge
                                        tipo={confirmacion.tipo_entrega}
                                        tipoNovedad={confirmacion.tipo_novedad}
                                    />
                                    {/* <EstadoPagoBadge estado={confirmacion.estado_pago} /> */}
                                    <TipoConfirmacionBadge tipo={confirmacion.tipo_confirmacion} />

                                </div>
                            </div>
                        </button>

                        {/* Contenido expandido */}
                        {expandedConfirmaciones[confirmacion.id as number] && (
                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900/50 space-y-4">
                                {/* 1️⃣ Estado de Entrega */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                            Tipo de Entrega
                                        </p>
                                        <div className="mt-2">
                                            <TipoEntregaBadge
                                                tipo={confirmacion.tipo_entrega}
                                                tipoNovedad={confirmacion.tipo_novedad}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                            Tipo de Confirmacion
                                        </p>
                                        <div className="mt-2">
                                            <TipoConfirmacionBadge tipo={confirmacion.tipo_confirmacion} />
                                        </div>
                                    </div>

                                    {confirmacion.tipo_entrega === 'CON_NOVEDAD' && confirmacion.motivo_rechazo && (
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                                Motivo de Rechazo
                                            </p>
                                            <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                                                🚫 {confirmacion.motivo_rechazo}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* 3️⃣ Información de Pago */}
                                {(confirmacion.tipo_confirmacion === 'COMPLETA' || confirmacion.tipo_confirmacion === 'DEVOLUCION_PARCIAL') && confirmacion.estado_pago && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                                            Información de Pago
                                        </p>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">Estado</span>
                                                <EstadoPagoBadge estado={confirmacion.estado_pago} />
                                            </div>

                                            {confirmacion.desglose_pagos && confirmacion.desglose_pagos.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                        Métodos de Pago ({confirmacion.desglose_pagos.length})
                                                    </p>
                                                    <div className="space-y-2">
                                                        {confirmacion.desglose_pagos.map((pago, idx) => (
                                                            <div key={idx} className="flex items-center justify-between text-sm">
                                                                <span className="text-gray-700 dark:text-gray-300">
                                                                    {pago.tipo_pago_nombre || 'Desconocido'}
                                                                    {pago.referencia && (
                                                                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                                                            ({pago.referencia})
                                                                        </span>
                                                                    )}
                                                                </span>
                                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                                    Bs. {(Number(pago.monto) || 0).toFixed(2)}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {confirmacion.total_dinero_recibido ? (
                                                <div className="flex items-center justify-between text-sm font-medium">
                                                    <span className="text-gray-700 dark:text-gray-300">Total Recibido</span>
                                                    <span className="text-green-600 dark:text-green-400">
                                                        Bs. {(Number(confirmacion.total_dinero_recibido) || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : null}

                                            {Number(confirmacion.monto_pendiente || 0) > 0 && (
                                                <div className="flex items-center justify-between text-sm font-medium">
                                                    <span className="text-gray-700 dark:text-gray-300">Monto Pendiente</span>
                                                    <span className="text-orange-600 dark:text-orange-400">
                                                        Bs. {(Number(confirmacion.monto_pendiente) || 0).toFixed(2)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 4️⃣ Devoluciones Parciales */}
                                {confirmacion.tipo_confirmacion === 'DEVOLUCION_PARCIAL' && confirmacion.productos_devueltos && confirmacion.productos_devueltos.length > 0 && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
                                            🔄 Productos Devueltos ({confirmacion.productos_devueltos.length})
                                        </p>
                                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded p-3 space-y-2">
                                            {confirmacion.productos_devueltos.map((producto, idx) => (
                                                <div key={idx} className="text-sm">
                                                    <div className="flex items-center justify-between">
                                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                                            {producto.producto_nombre}
                                                        </span>
                                                        <span className="text-orange-600 dark:text-orange-400 font-medium">
                                                            -{producto.cantidad}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-400 text-xs">
                                                        <span>Bs. {(Number(producto.precio_unitario) || 0).toFixed(2)} c/u</span>
                                                        <span>Total: Bs. {(Number(producto.subtotal) || 0).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                            ))}

                                            {Number(confirmacion.monto_devuelto || 0) > 0 && (
                                                <div className="border-t border-orange-200 dark:border-orange-800 pt-2 mt-2">
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
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                            Observaciones
                                        </p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800/50 p-3 rounded">
                                            {confirmacion.observaciones_logistica}
                                        </p>
                                    </div>
                                )}

                                {/* 6️⃣ Evidencia (Fotos y Firma) */}
                                {(confirmacion.fotos?.length || confirmacion.firma_digital_url || confirmacion.foto_comprobante) && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                        <div className="space-y-4">
                                            {/* Galería de Fotos de Entrega */}
                                            {confirmacion.fotos && confirmacion.fotos.length > 0 && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        📷 Fotos de Entrega ({confirmacion.fotos.length})
                                                    </p>
                                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                                        {confirmacion.fotos.map((foto, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => setImagenSeleccionada({ imagenes: confirmacion.fotos as string[], indice: idx })}
                                                                className="relative group overflow-hidden rounded-lg aspect-square bg-gray-200 dark:bg-gray-700 hover:shadow-md transition-shadow"
                                                            >
                                                                <img
                                                                    src={foto}
                                                                    alt={`Entrega foto ${idx + 1}`}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                                    onError={(e) => {
                                                                        const img = e.target as HTMLImageElement;
                                                                        img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 w=%22200%22 h=%22200%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22200%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2212%22%3EImagen no disponible%3C/text%3E%3C/svg%3E';
                                                                    }}
                                                                />
                                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                                                                    <ImageIcon size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Firma Digital */}
                                            {confirmacion.firma_digital_url && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        ✍️ Firma Digital
                                                    </p>
                                                    <button
                                                        onClick={() => setImagenSeleccionada({ imagenes: [confirmacion.firma_digital_url as string], indice: 0 })}
                                                        className="relative group overflow-hidden rounded-lg w-full h-40 bg-gray-200 dark:bg-gray-700 hover:shadow-md transition-shadow"
                                                    >
                                                        <img
                                                            src={confirmacion.firma_digital_url}
                                                            alt="Firma Digital"
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                            onError={(e) => {
                                                                const img = e.target as HTMLImageElement;
                                                                img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 w=%22400%22 h=%22200%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2216%22%3EFirma no disponible%3C/text%3E%3C/svg%3E';
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                                                            <ImageIcon size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </button>
                                                </div>
                                            )}

                                            {/* Foto de Comprobante */}
                                            {confirmacion.foto_comprobante && (
                                                <div>
                                                    <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        📄 Comprobante de Pago
                                                    </p>
                                                    <button
                                                        onClick={() => setImagenSeleccionada({ imagenes: [confirmacion.foto_comprobante as string], indice: 0 })}
                                                        className="relative group overflow-hidden rounded-lg w-full h-40 bg-gray-200 dark:bg-gray-700 hover:shadow-md transition-shadow"
                                                    >
                                                        <img
                                                            src={confirmacion.foto_comprobante}
                                                            alt="Comprobante"
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                            onError={(e) => {
                                                                const img = e.target as HTMLImageElement;
                                                                img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 w=%22400%22 h=%22200%22%3E%3Crect fill=%22%23e5e7eb%22 width=%22400%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2216%22%3EComprobante no disponible%3C/text%3E%3C/svg%3E';
                                                            }}
                                                        />
                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all">
                                                            <ImageIcon size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* 7️⃣ Fecha de Confirmación */}
                                {confirmacion.confirmado_en && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
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
