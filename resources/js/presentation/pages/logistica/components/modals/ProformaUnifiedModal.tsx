import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Phone, MapPin, FileText, CheckCircle, XCircle, Satellite } from 'lucide-react';
import { formatearFecha, formatearHora, extraerFechaInput, extraerHoraInput, MOTIVOS_RECHAZO_PROFORMA } from '@/lib/proformas.utils';

interface ProformaUnifiedModalProps {
    isOpen: boolean;
    onClose: () => void;
    proforma: any;
    tabActiva: 'editar' | 'aprobar' | 'rechazar';
    setTabActiva: (tab: 'editar' | 'aprobar' | 'rechazar') => void;
    datosConfirmacion: any;
    setDatosConfirmacion: (data: any) => void;
    motivoRechazoSeleccionado: string;
    setMotivoRechazoSeleccionado: (value: string) => void;
    motivoRechazoCustom: string;
    setMotivoRechazoCustom: (value: string) => void;
    notasLlamada: string;
    setNotasLlamada: (value: string) => void;
    onAprobar: () => void;
    onRechazar: () => void;
    isProcessing: boolean;
    cargandoDetalles?: boolean;
}

export function ProformaUnifiedModal({
    isOpen,
    onClose,
    proforma,
    tabActiva,
    setTabActiva,
    datosConfirmacion,
    setDatosConfirmacion,
    motivoRechazoSeleccionado,
    setMotivoRechazoSeleccionado,
    motivoRechazoCustom,
    setMotivoRechazoCustom,
    notasLlamada,
    setNotasLlamada,
    onAprobar,
    onRechazar,
    isProcessing,
    cargandoDetalles = false,
}: ProformaUnifiedModalProps) {
    const [mapaSatelite, setMapaSatelite] = useState(false);

    // Auto-llenar fechas cuando se abre el modal o cambia la proforma
    useEffect(() => {
        if (isOpen && proforma) {
            // Convertir las fechas del cliente al formato correcto para los inputs HTML
            const fechaFormato = extraerFechaInput(proforma.fecha_entrega_solicitada);
            const horaFormato = extraerHoraInput(proforma.hora_entrega_solicitada);

            // Solo actualizar si no están ya llenadas
            setDatosConfirmacion((prevState) => ({
                ...prevState,
                fecha_entrega_confirmada: prevState.fecha_entrega_confirmada || fechaFormato,
                hora_entrega_confirmada: prevState.hora_entrega_confirmada || horaFormato,
            }));
        }
    }, [isOpen, proforma?.id]);

    // No renderizar si no hay datos y no está cargando
    if (!proforma && !cargandoDetalles && !isOpen) return null;

    const tieneUbicacion = proforma?.direccionSolicitada?.latitud && proforma?.direccionSolicitada?.longitud;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Gestionar Proforma: {proforma?.numero || 'Cargando...'}
                    </DialogTitle>
                    <p id="proforma-description" className="text-sm text-muted-foreground">
                        Gestiona los detalles, aprobación y rechazo de la proforma
                    </p>
                </DialogHeader>

                {/* Overlay de carga */}
                {cargandoDetalles && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                        <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-lg">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="text-sm font-medium">Cargando detalles...</p>
                        </div>
                    </div>
                )}

                <div className="space-y-6" style={{ opacity: cargandoDetalles ? 0.5 : 1, pointerEvents: cargandoDetalles ? 'none' : 'auto' }}>
                    {proforma ? (
                        <>
                            {/* Información Resumida del Cliente */}
                            <div className="bg-muted/30 rounded-lg p-4">
                                <div className="grid grid-cols-4 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Cliente</p>
                                        <p className="font-semibold">{proforma.cliente_nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Monto</p>
                                        <p className="font-semibold text-green-600">
                                            Bs {proforma.total.toLocaleString('es-BO', { maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Estado</p>
                                        <p className="font-semibold">🟡 {proforma.estado}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Creador</p>
                                        <p className="font-semibold text-xs">{proforma.usuario_creador_nombre}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mini Mapa con Ubicación - Prominente */}
                            {tieneUbicacion && (
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="bg-muted/50 px-4 py-3 border-b flex items-center justify-between">
                                        <h4 className="font-semibold text-sm flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            Ubicación Solicitada por Cliente
                                        </h4>
                                        <Button
                                            size="sm"
                                            variant={mapaSatelite ? 'default' : 'outline'}
                                            onClick={() => setMapaSatelite(!mapaSatelite)}
                                            className="flex items-center gap-1"
                                        >
                                            <Satellite className="h-4 w-4" />
                                            {mapaSatelite ? 'Satélite' : 'Mapa'}
                                        </Button>
                                    </div>
                                    <div className="h-[280px] bg-gray-100 flex items-center justify-center relative">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            frameBorder="0"
                                            style={{ border: 0 }}
                                            src={mapaSatelite
                                                ? `https://www.openstreetmap.org/export/embed.html?bbox=${proforma.direccionSolicitada.longitud - 0.005},${proforma.direccionSolicitada.latitud - 0.005},${proforma.direccionSolicitada.longitud + 0.005},${proforma.direccionSolicitada.latitud + 0.005}&layer=humanitarian&marker=${proforma.direccionSolicitada.latitud},${proforma.direccionSolicitada.longitud}`
                                                : `https://www.openstreetmap.org/export/embed.html?bbox=${proforma.direccionSolicitada.longitud - 0.005},${proforma.direccionSolicitada.latitud - 0.005},${proforma.direccionSolicitada.longitud + 0.005},${proforma.direccionSolicitada.latitud + 0.005}&layer=mapnik&marker=${proforma.direccionSolicitada.latitud},${proforma.direccionSolicitada.longitud}`
                                            }
                                            allowFullScreen
                                        />
                                    </div>
                                    <div className="bg-blue-50 px-4 py-3 border-t">
                                        <p className="text-sm font-semibold mb-1">📍 {proforma.direccionSolicitada.direccion}</p>
                                        {proforma.direccionSolicitada.referencia && (
                                            <p className="text-xs text-muted-foreground">
                                                <span className="font-semibold">Referencia:</span> {proforma.direccionSolicitada.referencia}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Tabs para diferentes secciones */}
                            <Tabs value={tabActiva} onValueChange={(v) => {
                                setTabActiva(v as any);
                            }}>
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="editar" className="flex items-center gap-2">
                                        <Phone className="h-4 w-4" />
                                        Detalles
                                    </TabsTrigger>
                                    <TabsTrigger value="aprobar" className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        Aprobar
                                    </TabsTrigger>
                                    <TabsTrigger value="rechazar" className="flex items-center gap-2">
                                        <XCircle className="h-4 w-4 text-red-600" />
                                        Rechazar
                                    </TabsTrigger>
                                </TabsList>

                                {/* TAB 1: DETALLES Y LLAMADA */}
                                <TabsContent value="editar" className="space-y-4 mt-4" forceMount>
                                    {/* Información de Entrega Solicitada */}
                                    <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm">Información de Entrega Solicitada</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Fecha Solicitada</p>
                                            <p className="font-semibold">
                                                {formatearFecha(proforma.fecha_entrega_solicitada)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Hora Solicitada</p>
                                            <p className="font-semibold">
                                                {formatearHora(proforma.hora_entrega_solicitada)}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Notas de Llamada */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-sm flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Notas de Llamada Telefónica
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Textarea
                                            placeholder="Escribe aquí las notas de la llamada con el cliente: horarios disponibles, direcciones alternativas, contactos, etc..."
                                            value={notasLlamada}
                                            onChange={(e) => setNotasLlamada(e.target.value)}
                                            className="h-24"
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">
                                            💡 Tip: Anota aquí lo que hablas con el cliente durante la llamada
                                        </p>
                                    </CardContent>
                                </Card>

                                <div className="flex gap-2 pt-4">
                                    <Button variant="outline" onClick={onClose} disabled={isProcessing} className="flex-1">
                                        Cerrar
                                    </Button>
                                </div>
                                </TabsContent>

                                        {/* TAB 2: APROBAR */}
                                        <TabsContent value="aprobar" className="space-y-4 mt-4" forceMount>
                                            <Card className="border-green-200 bg-green-50">
                                            <CardContent className="pt-6">
                                                <p className="text-sm text-green-700">
                                                    ✓ Esta proforma será aprobada y pasará al siguiente paso del proceso de venta
                                                </p>
                                            </CardContent>
                                        </Card>

                                        {/* Información Original Solicitada (para referencia) */}
                                        <Card className="border-blue-200 bg-blue-50/50">
                                            <CardHeader>
                                                <CardTitle className="text-sm">Solicitud Original del Cliente</CardTitle>
                                            </CardHeader>
                                            <CardContent className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-muted-foreground text-xs">Fecha Solicitada</p>
                                                    <p className="font-semibold">{formatearFecha(proforma.fecha_entrega_solicitada)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-muted-foreground text-xs">Hora Solicitada</p>
                                                    <p className="font-semibold">{formatearHora(proforma.hora_entrega_solicitada)}</p>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    Confirmar Fecha de Entrega *
                                                </label>
                                                <Input
                                                    type="date"
                                                    value={datosConfirmacion.fecha_entrega_confirmada}
                                                    onChange={(e) =>
                                                        setDatosConfirmacion({
                                                            ...datosConfirmacion,
                                                            fecha_entrega_confirmada: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    Confirmar Hora de Entrega *
                                                </label>
                                                <Input
                                                    type="time"
                                                    value={datosConfirmacion.hora_entrega_confirmada}
                                                    onChange={(e) =>
                                                        setDatosConfirmacion({
                                                            ...datosConfirmacion,
                                                            hora_entrega_confirmada: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium mb-2 block">
                                                    Comentario de Coordinación
                                                </label>
                                                <Textarea
                                                    placeholder="Notas adicionales para el equipo de coordinación..."
                                                    value={datosConfirmacion.comentario_coordinacion}
                                                    onChange={(e) =>
                                                        setDatosConfirmacion({
                                                            ...datosConfirmacion,
                                                            comentario_coordinacion: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm font-medium mb-2 block">Comentario Interno</label>
                                                <Textarea
                                                    placeholder="Información adicional para el sistema..."
                                                    value={datosConfirmacion.comentario}
                                                    onChange={(e) =>
                                                        setDatosConfirmacion({
                                                            ...datosConfirmacion,
                                                            comentario: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-4">
                                            <Button variant="outline" onClick={onClose} disabled={isProcessing} className="flex-1">
                                                Cancelar
                                            </Button>
                                            <Button
                                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 flex-1"
                                                onClick={() => {
                                                    const confirmMsg = `¿Aprobar proforma ${proforma.numero}?

Fecha: ${datosConfirmacion.fecha_entrega_confirmada || 'No especificada'}
Hora: ${datosConfirmacion.hora_entrega_confirmada || 'No especificada'}`;

                                                    if (window.confirm(confirmMsg)) {
                                                        onAprobar();
                                                    }
                                                }}
                                                disabled={
                                                    isProcessing ||
                                                    !datosConfirmacion.fecha_entrega_confirmada ||
                                                    !datosConfirmacion.hora_entrega_confirmada
                                                }
                                            >
                                                {isProcessing ? 'Aprobando...' : '✓ Aprobar Proforma'}
                                            </Button>
                                        </div>
                                </TabsContent>

                        {/* TAB 3: RECHAZAR */}
                        <TabsContent value="rechazar" className="space-y-4 mt-4" forceMount>
                                <Card className="border-red-200 bg-red-50">
                                    <CardContent className="pt-6">
                                        <p className="text-sm text-red-700">
                                            ✗ Esta proforma será rechazada. Especifica el motivo para el cliente.
                                        </p>
                                    </CardContent>
                                </Card>

                                <div>
                                    <label className="text-sm font-medium mb-3 block">Motivo del Rechazo *</label>
                                    <div className="space-y-2">
                                        {MOTIVOS_RECHAZO_PROFORMA.map((motivo) => (
                                            <label
                                                key={motivo.value}
                                                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${motivoRechazoSeleccionado === motivo.value
                                                    ? 'border-red-400 bg-red-50'
                                                    : 'border-border hover:border-red-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="motivoRechazo"
                                                    value={motivo.value}
                                                    checked={motivoRechazoSeleccionado === motivo.value}
                                                    onChange={(e) => setMotivoRechazoSeleccionado(e.target.value)}
                                                    className="w-4 h-4"
                                                />
                                                <span className="text-sm">{motivo.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {motivoRechazoSeleccionado === 'otro' && (
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Especifica el motivo del rechazo *
                                        </label>
                                        <Textarea
                                            placeholder="Describe con detalle el motivo del rechazo..."
                                            value={motivoRechazoCustom}
                                            onChange={(e) => setMotivoRechazoCustom(e.target.value)}
                                        />
                                    </div>
                                )}

                                {motivoRechazoSeleccionado && motivoRechazoSeleccionado !== 'otro' && (
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Información Adicional (Opcional)
                                        </label>
                                        <Textarea
                                            placeholder="Detalles adicionales que quieras registrar..."
                                            value={motivoRechazoCustom}
                                            onChange={(e) => setMotivoRechazoCustom(e.target.value)}
                                        />
                                    </div>
                                )}

                                <div className="flex gap-2 pt-4">
                                    <Button variant="outline" onClick={onClose} disabled={isProcessing} className="flex-1">
                                        Cancelar
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            const motivoLabel = MOTIVOS_RECHAZO_PROFORMA.find(m => m.value === motivoRechazoSeleccionado)?.label || motivoRechazoSeleccionado;

                                            const confirmMsg = `¿Rechazar proforma ${proforma.numero}?

Motivo: ${motivoLabel}${motivoRechazoCustom ? '\n\nDetalles: ' + motivoRechazoCustom : ''}`;

                                            if (window.confirm(confirmMsg)) {
                                                onRechazar();
                                            }
                                        }}
                                        disabled={isProcessing || !motivoRechazoSeleccionado}
                                        className="flex-1"
                                    >
                                        {isProcessing ? 'Rechazando...' : '✗ Rechazar Proforma'}
                                    </Button>
                                </div>
                                </TabsContent>
                            </Tabs>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">No hay datos de proforma disponibles</p>
                        </div>
                    )}
                </div>

            </DialogContent>
        </Dialog>
    );
}
