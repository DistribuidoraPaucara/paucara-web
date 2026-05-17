import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Label } from '@/presentation/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/presentation/components/ui/dialog';
import { ArrowLeft, CheckCircle, XCircle, Calendar, MapPin, AlertTriangle, FileText, Printer } from 'lucide-react';
import { useAuth } from '@/application/hooks/use-auth';
import { NotificationService } from '@/infrastructure/services/notification.service';
import type { MermaInventario } from '@/domain/entities/mermas-inventario';
import { TIPOS_MERMA, ESTADOS_MERMA } from '@/presentation/config/inventory.config';
import { OutputSelectionModal } from '@/presentation/components/impresion/OutputSelectionModal';

// Componente EstadoBadge simple para mermas
const EstadoBadge = ({ estado }: { estado: string }) => {
    const configs = {
        'pendiente': { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800' },
        'aprobada': { label: 'Aprobada', className: 'bg-green-100 text-green-800' },
        'rechazada': { label: 'Rechazada', className: 'bg-red-100 text-red-800' },
    };

    const config = configs[estado as keyof typeof configs] || configs.pendiente;

    return (
        <Badge className={config.className}>
            {config.label}
        </Badge>
    );
};

interface VerMermaProps {
    merma: MermaInventario;
}

export default function VerMerma({ merma }: VerMermaProps) {
    console.log('Merma data:', merma); // LOG para depuración
    const { can } = useAuth();
    const [isApproving, setIsApproving] = useState(false);
    const [isRejecting, setIsRejecting] = useState(false);
    const [observacionesAprobacion, setObservacionesAprobacion] = useState('');
    const [observacionesRechazo, setObservacionesRechazo] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState<'aprobar' | 'rechazar'>('aprobar');
    const [mostrarModalImpresion, setMostrarModalImpresion] = useState(false);

    const handleAprobar = async () => {
        setIsApproving(true);
        try {
            await router.post(
                `/inventario/mermas/${merma.id}/aprobar`,
                { observaciones_aprobacion: observacionesAprobacion },
                {
                    onSuccess: () => {
                        NotificationService.success('Merma aprobada exitosamente');
                        setDialogOpen(false);
                        setObservacionesAprobacion('');
                    },
                    onError: (errors) => {
                        NotificationService.error('Error al aprobar la merma');
                        console.error(errors);
                    },
                }
            );
        } finally {
            setIsApproving(false);
        }
    };

    const handleRechazar = async () => {
        setIsRejecting(true);
        try {
            await router.post(
                `/inventario/mermas/${merma.id}/rechazar`,
                { observaciones_rechazo: observacionesRechazo },
                {
                    onSuccess: () => {
                        NotificationService.success('Merma rechazada exitosamente');
                        setDialogOpen(false);
                        setObservacionesRechazo('');
                    },
                    onError: (errors) => {
                        NotificationService.error('Error al rechazar la merma');
                        console.error(errors);
                    },
                }
            );
        } finally {
            setIsRejecting(false);
        }
    };

    const openDialog = (type: 'aprobar' | 'rechazar') => {
        setDialogType(type);
        setDialogOpen(true);
    };

    const handleImprimir = async (formato: 'A4' | 'TICKET_80' | 'TICKET_58') => {
        setIsPrinting(true);
        try {
            const url = `/inventario/mermas/${merma.id}/imprimir?formato=${formato}&accion=stream`;
            window.open(url, '_blank');
        } catch (error) {
            NotificationService.error('Error al abrir documento de impresión');
            console.error(error);
        } finally {
            setIsPrinting(false);
        }
    };

    // Acceder a configuraciones de tipo y estado
    const tipoMermaConfig = TIPOS_MERMA[merma.tipo_merma];
    const estadoConfig = ESTADOS_MERMA[merma.estado];

    return (
        <AppLayout>
            <Head title={`Merma ${merma.numero || 'Detalle'}`} />

            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.visit('/inventario/mermas')}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver al listado
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Merma {merma.numero || `#${merma.id}`}</h1>
                            <p className="text-muted-foreground">
                                Registrada el {new Date(merma.fecha).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <EstadoBadge estado={merma.estado} />

                        {/* Botón de impresión con modal */}
                        <div className="border-l pl-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setMostrarModalImpresion(true)}
                                title="Imprimir o descargar merma"
                            >
                                <Printer className="h-4 w-4 mr-1" />
                                Imprimir
                            </Button>
                        </div>

                        {merma.estado === 'PENDIENTE' && can('inventario.mermas.aprobar') && (
                            <div className="flex gap-2">
                                <Button
                                    onClick={() => openDialog('aprobar')}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Aprobar
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => openDialog('rechazar')}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Rechazar
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Información Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Datos Generales */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Información General
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Número
                                        </Label>
                                        <p className="font-medium">{merma.numero || `#${merma.id}`}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Estado
                                        </Label>
                                        <div className="mt-1">
                                            <EstadoBadge estado={merma.estado} />
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Almacén
                                        </Label>
                                        <p className="font-medium flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            {merma.almacen.nombre}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Tipo de Merma
                                        </Label>
                                        <p className="font-medium">
                                            {tipoMermaConfig?.label || merma.tipo_merma}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Fecha de Registro
                                        </Label>
                                        <p className="font-medium flex items-center gap-2">
                                            <Calendar className="h-4 w-4" />
                                            {new Date(merma.fecha).toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Valor Total Perdido
                                        </Label>
                                        <p className="font-medium text-lg text-red-600">
                                            Bs. {merma.total_costo?.toFixed(2) || '0.00'}
                                        </p>
                                    </div>
                                </div>

                                {merma.motivo && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Motivo
                                        </Label>
                                        <p className="mt-1 p-3 bg-muted rounded-md">
                                            {merma.motivo}
                                        </p>
                                    </div>
                                )}

                                {merma.observaciones && (
                                    <div>
                                        <Label className="text-sm font-medium text-muted-foreground">
                                            Observaciones
                                        </Label>
                                        <p className="mt-1 p-3 bg-muted rounded-md">
                                            {merma.observaciones}
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Detalles de Productos */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Productos Afectados</CardTitle>
                                <CardDescription>
                                    Listado de productos incluidos en esta merma
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {merma.detalles && merma.detalles.length > 0 ? (
                                    <div className="space-y-4">
                                        {merma.detalles.map((detalle, index) => (
                                            <div
                                                key={index}
                                                className="border rounded-lg p-4 space-y-2"
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <h4 className="font-medium">
                                                            {detalle.producto?.nombre || 'Producto no especificado'}
                                                        </h4>
                                                        <div className="mt-1 space-y-1">
                                                            {detalle.producto?.sku && (
                                                                <p className="text-sm text-muted-foreground">
                                                                    SKU: <span className="font-mono font-medium">{detalle.producto.sku}</span>
                                                                </p>
                                                            )}
                                                            {detalle.producto?.codigo && (
                                                                <p className="text-sm text-muted-foreground">
                                                                    Código: {detalle.producto.codigo}
                                                                </p>
                                                            )}
                                                        </div>
                                                        {detalle.lote && (
                                                            <p className="text-sm text-muted-foreground mt-2">
                                                                Lote: {detalle.lote}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="text-right ml-4">
                                                        <p className="font-medium">
                                                            {detalle.cantidad} uds
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            @ Bs. {detalle.costo_unitario?.toFixed(2) || '0.00'}
                                                        </p>
                                                        <p className="text-sm font-medium text-red-600 mt-1">
                                                            Bs. {detalle.costo_total?.toFixed(2) || '0.00'}
                                                        </p>
                                                    </div>
                                                </div>
                                                {detalle.observaciones && (
                                                    <p className="text-sm text-muted-foreground">
                                                        {detalle.observaciones}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                        <p>No hay productos registrados en esta merma</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Panel Lateral */}
                    <div className="space-y-6">
                        {/* Resumen */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Resumen</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm">Total productos:</span>
                                        <span className="font-medium">
                                            {merma.total_productos || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm">Cantidad total:</span>
                                        <span className="font-medium">
                                            {merma.total_cantidad || 0}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2">
                                        <span className="text-sm font-medium">Valor perdido:</span>
                                        <span className="font-bold text-red-600">
                                            Bs. {merma.total_costo?.toFixed(2) || '0.00'}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Acciones Rápidas */}
                        {merma.estado === 'PENDIENTE' && can('inventario.mermas.aprobar') && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Acciones</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Button
                                        onClick={() => openDialog('aprobar')}
                                        className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        Aprobar Merma
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        onClick={() => openDialog('rechazar')}
                                        className="w-full"
                                    >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        Rechazar Merma
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Dialog de Aprobación/Rechazo */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {dialogType === 'aprobar' ? 'Aprobar Merma' : 'Rechazar Merma'}
                        </DialogTitle>
                        <DialogDescription>
                            {dialogType === 'aprobar'
                                ? 'Al aprobar esta merma, se aplicarán los ajustes de inventario correspondientes.'
                                : 'Al rechazar esta merma, deberá proporcionar una justificación.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="observaciones">
                                {dialogType === 'aprobar' ? 'Observaciones (opcional)' : 'Motivo del rechazo *'}
                            </Label>
                            <Textarea
                                id="observaciones"
                                placeholder={
                                    dialogType === 'aprobar'
                                        ? 'Comentarios adicionales sobre la aprobación...'
                                        : 'Especifique el motivo del rechazo...'
                                }
                                value={dialogType === 'aprobar' ? observacionesAprobacion : observacionesRechazo}
                                onChange={(e) =>
                                    dialogType === 'aprobar'
                                        ? setObservacionesAprobacion(e.target.value)
                                        : setObservacionesRechazo(e.target.value)
                                }
                                rows={4}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDialogOpen(false)}
                            disabled={isApproving || isRejecting}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={dialogType === 'aprobar' ? handleAprobar : handleRechazar}
                            disabled={
                                isApproving ||
                                isRejecting ||
                                (dialogType === 'rechazar' && !observacionesRechazo.trim())
                            }
                            className={dialogType === 'aprobar' ? 'bg-green-600 hover:bg-green-700' : ''}
                            variant={dialogType === 'aprobar' ? 'default' : 'destructive'}
                        >
                            {isApproving || isRejecting ? 'Procesando...' :
                                dialogType === 'aprobar' ? 'Aprobar' : 'Rechazar'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal de Selección de Formato de Impresión */}
            {mostrarModalImpresion && (
                <OutputSelectionModal
                    isOpen={mostrarModalImpresion}
                    onClose={() => setMostrarModalImpresion(false)}
                    documentoId={merma.id}
                    tipoDocumento="merma"
                    documentoInfo={{
                        numero: merma.numero,
                        fecha: new Date(merma.fecha).toLocaleDateString('es-ES'),
                    }}
                />
            )}
        </AppLayout>
    );
}
