import { useState, useEffect, useCallback, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { toast } from 'react-toastify';
import {
    AlertCircle,
    CheckCircle,
    XCircle,
    Package,
    User,
    DollarSign,
    Filter,
    X,
    Eye
} from 'lucide-react';
import logisticaService, { type Proforma, type FiltrosProformas } from '@/infrastructure/services/logistica.service';
import type { Id } from '@/domain/entities/shared';
import { MOTIVOS_RECHAZO_PROFORMA } from '@/lib/proformas.utils';
import { useProformaEstadoBadge } from '@/application/hooks';
import { ProformaEstadoBadge } from '@/presentation/components/proforma/ProformaEstadoBadge';

interface Props {
    proformas?: Proforma[];
}

export default function ProformasPendientes({ proformas: initialProformas = [] }: Props) {
    const [proformas, setProformas] = useState<Proforma[]>(initialProformas);
    const [loading, setLoading] = useState(false);
    const [filtros, setFiltros] = useState<FiltrosProformas>({});
    const [showFilters, setShowFilters] = useState(false);
    const [mostrarModalRechazo, setMostrarModalRechazo] = useState(false);
    const [mostrarModalAprobacion, setMostrarModalAprobacion] = useState(false);
    const [proformaSeleccionada, setProformaSeleccionada] = useState<Proforma | null>(null);
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [motivoRechazoSeleccionado, setMotivoRechazoSeleccionado] = useState<string>('');
    const [datosConfirmacion, setDatosConfirmacion] = useState({
        fecha_entrega_confirmada: '',
        hora_entrega_confirmada: '',
        direccion_entrega_confirmada_id: '',
        comentario_coordinacion: '',
        comentario: '',
    });
    const [procesandoId, setProcesandoId] = useState<Id | null>(null);

    // Cargar proformas
    const cargarProformas = useCallback(async () => {
        setLoading(true);
        try {
            const resultado = await logisticaService.obtenerProformasPendientes(1, filtros);
            setProformas(resultado.data);
        } catch (error) {
            toast.error('Error al cargar proformas');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [filtros]);

    useEffect(() => {
        cargarProformas();
    }, [cargarProformas]);

    /* const abrirModalAprobacion = (proforma: Proforma) => {
        setProformaSeleccionada(proforma);
        setDatosConfirmacion({
            fecha_entrega_confirmada: proforma.fecha_entrega_solicitada || '',
            hora_entrega_confirmada: proforma.hora_entrega_solicitada || '',
            direccion_entrega_confirmada_id: String(proforma.direccion_entrega_solicitada_id || ''),
            comentario_coordinacion: '',
            comentario: '',
        });
        setMostrarModalAprobacion(true);
    }; */

    const cerrarModalAprobacion = () => {
        setMostrarModalAprobacion(false);
        setProformaSeleccionada(null);
        setDatosConfirmacion({
            fecha_entrega_confirmada: '',
            hora_entrega_confirmada: '',
            direccion_entrega_confirmada_id: '',
            comentario_coordinacion: '',
            comentario: '',
        });
    };

    const aprobarProforma = async () => {
        if (!proformaSeleccionada) return;

        setProcesandoId(proformaSeleccionada.id);
        try {
            await logisticaService.aprobarProforma(proformaSeleccionada.id, {
                comentario: datosConfirmacion.comentario,
                fecha_entrega_confirmada: datosConfirmacion.fecha_entrega_confirmada || undefined,
                hora_entrega_confirmada: datosConfirmacion.hora_entrega_confirmada || undefined,
                direccion_entrega_confirmada_id: datosConfirmacion.direccion_entrega_confirmada_id
                    ? parseInt(datosConfirmacion.direccion_entrega_confirmada_id)
                    : undefined,
                comentario_coordinacion: datosConfirmacion.comentario_coordinacion || undefined,
            });
            cerrarModalAprobacion();
            cargarProformas();
        } catch (error) {
            console.error(error);
        } finally {
            setProcesandoId(null);
        }
    };

    /* const abrirModalRechazo = (proforma: Proforma) => {
        setProformaSeleccionada(proforma);
        setMotivoRechazo('');
        setMotivoRechazoSeleccionado('');
        setMostrarModalRechazo(true);
    }; */

    const cerrarModalRechazo = () => {
        setMostrarModalRechazo(false);
        setProformaSeleccionada(null);
        setMotivoRechazo('');
        setMotivoRechazoSeleccionado('');
    };

    const rechazarProforma = async () => {
        if (!proformaSeleccionada) return;

        // Construir motivo final
        const motivoSeleccionadoLabel = MOTIVOS_RECHAZO_PROFORMA.find(m => m.value === motivoRechazoSeleccionado)?.label || '';
        const motivoFinal = motivoRechazoSeleccionado === 'otro'
            ? motivoRechazo
            : motivoRechazo
                ? `${motivoSeleccionadoLabel} - ${motivoRechazo}`
                : motivoSeleccionadoLabel;

        const errores = logisticaService.validateRechazarProforma(motivoFinal);
        if (errores.length > 0) {
            errores.forEach(error => toast.error(error));
            return;
        }

        setProcesandoId(proformaSeleccionada.id);
        try {
            await logisticaService.rechazarProforma(proformaSeleccionada.id, motivoFinal);
            cerrarModalRechazo();
            cargarProformas();
        } catch (error) {
            console.error(error);
        } finally {
            setProcesandoId(null);
        }
    };

    const handleFiltroChange = (key: keyof FiltrosProformas, value: string) => {
        const nuevosFiltros = { ...filtros, [key]: value || undefined };
        setFiltros(nuevosFiltros);
    };

    const limpiarFiltros = () => {
        setFiltros({});
        setShowFilters(false);
    };

    return (
        <AppLayout>
            <Head title="Proformas Pendientes" />
            <div className="space-y-6 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Proformas Pendientes</h1>
                        <p className="text-muted-foreground mt-1">Gestiona la aprobación y rechazo de proformas</p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-orange-600">{proformas.length}</div>
                        <p className="text-sm text-muted-foreground">Pendientes de aprobación</p>
                    </div>
                </div>

                {/* Filtros */}
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <Button
                            variant={showFilters ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="gap-2"
                        >
                            <Filter className="h-4 w-4" />
                            Filtros
                        </Button>
                        {Object.keys(filtros).length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={limpiarFiltros}
                                className="gap-2"
                            >
                                <X className="h-4 w-4" />
                                Limpiar
                            </Button>
                        )}
                    </div>

                    {showFilters && (
                        <Card className="bg-muted/30">
                            <CardContent className="pt-6">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Fecha Desde</label>
                                        <Input
                                            type="date"
                                            value={filtros.fecha_desde || ''}
                                            onChange={(e) => handleFiltroChange('fecha_desde', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Fecha Hasta</label>
                                        <Input
                                            type="date"
                                            value={filtros.fecha_hasta || ''}
                                            onChange={(e) => handleFiltroChange('fecha_hasta', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* proformas */}
                <div className="space-y-3">
                    {loading ? (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground">Cargando proformas...</p>
                            </CardContent>
                        </Card>
                    ) : proformas.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center py-8">
                                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                    <h3 className="font-semibold text-lg mb-2">¡Sin proformas pendientes!</h3>
                                    <p className="text-muted-foreground">Todas las proformas han sido procesadas</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        proformas.map((proforma) => (
                            <Card key={proforma.id} className="hover:shadow-md transition-shadow border-l-4 border-orange-500">
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-shrink-0">
                                                    <AlertCircle className="h-8 w-8 text-orange-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-lg">{proforma.numero}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        Creada el {new Date(proforma.fecha).toLocaleDateString('es-ES')}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* Fase 3: Usar hook para mostrar estado dinámicamente */}
                                            <ProformaEstadoBadge estado={proforma.estado} />
                                        </div>

                                        {/* Información detallada */}
                                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 border-y py-4">
                                            {/* Cliente - Quién compra */}
                                            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950 rounded p-3">
                                                <User className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase">Cliente (Comprador)</p>
                                                    <p className="font-medium text-sm">{proforma.cliente_nombre}</p>
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div className="flex items-center gap-3">
                                                <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Total</p>
                                                    <p className="font-semibold text-green-600">Bs {parseFloat(String(proforma.total)).toFixed(2)}</p>
                                                </div>
                                            </div>

                                            {/* Canal origen */}
                                            <div className="flex items-center gap-3">
                                                <Package className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Canal Origen</p>
                                                    <p className="font-medium">{proforma.canal_origen}</p>
                                                </div>
                                            </div>

                                            {/* Usuario creador - Quién creó */}
                                            <div className="flex items-center gap-3 bg-purple-50 dark:bg-purple-950 rounded p-3">
                                                <User className="h-5 w-5 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase">Creado por</p>
                                                    <p className="font-medium text-sm">{proforma.usuario_creador_nombre}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Acciones */}
                                        <div className="flex gap-2 justify-end">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.location.href = `/proformas/${proforma.id}`}
                                                className="gap-2"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            {/* Modal Rechazo */}
            <Dialog open={mostrarModalRechazo} onOpenChange={setMostrarModalRechazo}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Rechazar Proforma</DialogTitle>
                    </DialogHeader>

                    {proformaSeleccionada && (
                        <div className="space-y-4">
                            {/* Resumen de Proforma */}
                            <div className="bg-muted/30 rounded-lg p-3">
                                <p className="text-sm font-medium">{proformaSeleccionada.numero}</p>
                                <p className="text-xs text-muted-foreground">
                                    {proformaSeleccionada.cliente_nombre} - Bs {parseFloat(String(proformaSeleccionada.total)).toFixed(2)}
                                </p>
                            </div>

                            {/* Advertencia */}
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-semibold text-red-900">Esta acción liberará las reservas de stock</p>
                                    <p className="text-red-700 mt-1">El cliente será notificado del rechazo.</p>
                                </div>
                            </div>

                            {/* Motivos Predefinidos */}
                            <div>
                                <label className="text-sm font-medium mb-3 block">Motivo del rechazo *</label>
                                <div className="space-y-2">
                                    {MOTIVOS_RECHAZO_PROFORMA.map((motivo) => (
                                        <label
                                            key={motivo.value}
                                            className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${motivoRechazoSeleccionado === motivo.value
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:border-primary/50'
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

                            {/* Detalles Adicionales */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">
                                    Detalles adicionales {motivoRechazoSeleccionado === 'otro' && '*'}
                                </label>
                                <Textarea
                                    placeholder={
                                        motivoRechazoSeleccionado === 'otro'
                                            ? 'Explica el motivo del rechazo...'
                                            : 'Agrega información adicional (opcional)...'
                                    }
                                    value={motivoRechazo}
                                    onChange={(e) => setMotivoRechazo(e.target.value)}
                                    rows={3}
                                    className="resize-none"
                                />
                                <p className="text-xs text-muted-foreground mt-2">
                                    {motivoRechazoSeleccionado === 'otro' ? 'Mínimo 10 caracteres' : 'Máximo 500 caracteres'}
                                </p>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={cerrarModalRechazo}
                            disabled={procesandoId === proformaSeleccionada?.id}
                        >
                            Cancelar
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={rechazarProforma}
                            disabled={procesandoId === proformaSeleccionada?.id || !motivoRechazoSeleccionado}
                            className="gap-2"
                        >
                            {procesandoId === proformaSeleccionada?.id ? 'Rechazando...' : (
                                <>
                                    <XCircle className="h-4 w-4" />
                                    Rechazar Proforma
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Modal Aprobación con Confirmación de Entrega */}
            <Dialog open={mostrarModalAprobacion} onOpenChange={setMostrarModalAprobacion}>
                <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Aprobar Proforma - Confirmar Entrega</DialogTitle>
                    </DialogHeader>

                    {proformaSeleccionada && (
                        <div className="space-y-6">
                            {/* Resumen de Proforma */}
                            <div className="bg-muted/30 rounded-lg p-4">
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Proforma</p>
                                        <p className="font-semibold">{proformaSeleccionada.numero}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Cliente</p>
                                        <p className="font-semibold">{proformaSeleccionada.cliente_nombre}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Total</p>
                                        <p className="font-semibold">Bs {parseFloat(String(proformaSeleccionada.total)).toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Solicitud Original del Cliente */}
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold mb-3 text-sm">Solicitud Original del Cliente</h4>
                                <div className="grid md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-xs text-muted-foreground">Fecha Solicitada</p>
                                        <p>{proformaSeleccionada.fecha_entrega_solicitada || 'Sin especificar'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Hora Solicitada</p>
                                        <p>{proformaSeleccionada.hora_entrega_solicitada || 'Sin especificar'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-muted-foreground">Dirección Solicitada</p>
                                        <p>{proformaSeleccionada.direccionSolicitada?.direccion || 'Sin especificar'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Confirmar Datos después de Coordinación */}
                            <div className="border rounded-lg p-4 bg-blue-50/50">
                                <h4 className="font-semibold mb-4 text-sm">Confirmación después de Coordinación Verbal</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Fecha de Entrega (si cambió)</label>
                                        <Input
                                            type="date"
                                            value={datosConfirmacion.fecha_entrega_confirmada}
                                            onChange={(e) => setDatosConfirmacion({
                                                ...datosConfirmacion,
                                                fecha_entrega_confirmada: e.target.value
                                            })}
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {datosConfirmacion.fecha_entrega_confirmada === proformaSeleccionada.fecha_entrega_solicitada
                                                ? '✓ Sin cambios (igual a solicitado)'
                                                : '⚠ Cambio detectado'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Hora de Entrega (si cambió)</label>
                                        <Input
                                            type="time"
                                            value={datosConfirmacion.hora_entrega_confirmada}
                                            onChange={(e) => setDatosConfirmacion({
                                                ...datosConfirmacion,
                                                hora_entrega_confirmada: e.target.value
                                            })}
                                            pattern="^([0-1][0-9]|2[0-3]):[0-5][0-9]$"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {datosConfirmacion.hora_entrega_confirmada === proformaSeleccionada.hora_entrega_solicitada
                                                ? '✓ Sin cambios (igual a solicitado)'
                                                : '⚠ Cambio detectado'}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium mb-2 block">Notas de Coordinación</label>
                                        <Textarea
                                            placeholder="Ej: Cliente requería después de 16:00. Confirmó 16:30 por teléfono."
                                            value={datosConfirmacion.comentario_coordinacion}
                                            onChange={(e) => setDatosConfirmacion({
                                                ...datosConfirmacion,
                                                comentario_coordinacion: e.target.value
                                            })}
                                            rows={3}
                                            className="resize-none"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">Máximo 1000 caracteres</p>
                                    </div>
                                </div>
                            </div>

                            {/* Comentario de Aprobación */}
                            <div>
                                <label className="text-sm font-medium mb-2 block">Comentario de Aprobación</label>
                                <Textarea
                                    placeholder="Ej: Aprobado, stock confirmado"
                                    value={datosConfirmacion.comentario}
                                    onChange={(e) => setDatosConfirmacion({
                                        ...datosConfirmacion,
                                        comentario: e.target.value
                                    })}
                                    rows={3}
                                    className="resize-none"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={cerrarModalAprobacion}
                            disabled={procesandoId === proformaSeleccionada?.id}
                        >
                            Cancelar
                        </Button>
                        <Button
                            onClick={aprobarProforma}
                            disabled={procesandoId === proformaSeleccionada?.id}
                            className="gap-2 bg-green-600 hover:bg-green-700"
                        >
                            {procesandoId === proformaSeleccionada?.id ? 'Aprobando...' : (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    Aprobar Proforma
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
