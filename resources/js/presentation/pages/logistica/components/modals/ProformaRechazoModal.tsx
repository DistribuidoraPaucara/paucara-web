import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Textarea } from '@/presentation/components/ui/textarea';
import { MOTIVOS_RECHAZO_PROFORMA } from '@/lib/proformas.utils';

interface ProformaRechazoModalProps {
    isOpen: boolean;
    onClose: () => void;
    proforma: any;
    motivoRechazoSeleccionado: string;
    setMotivoRechazoSeleccionado: (value: string) => void;
    motivoRechazo: string;
    setMotivoRechazo: (value: string) => void;
    onRechazar: () => void;
    isProcessing: boolean;
}

export function ProformaRechazoModal({
    isOpen,
    onClose,
    proforma,
    motivoRechazoSeleccionado,
    setMotivoRechazoSeleccionado,
    motivoRechazo,
    setMotivoRechazo,
    onRechazar,
    isProcessing,
}: ProformaRechazoModalProps) {
    if (!proforma) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Rechazar Proforma: {proforma.numero}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
                    {/* Información de la proforma */}
                    <div className="bg-muted p-3 rounded-lg">
                        <p className="text-sm">
                            <strong>Cliente:</strong> {proforma.cliente_nombre}
                        </p>
                        <p className="text-sm">
                            <strong>Monto:</strong> Bs {proforma.total.toLocaleString('es-BO', { maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Motivos Predefinidos */}
                    <div>
                        <label className="text-sm font-medium mb-3 block">Motivo del rechazo *</label>
                        <div className="space-y-2">
                            {MOTIVOS_RECHAZO_PROFORMA.map((motivo) => (
                                <label
                                    key={motivo.value}
                                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                        motivoRechazoSeleccionado === motivo.value
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

                    {/* Motivo adicional si selecciona "Otro" */}
                    {motivoRechazoSeleccionado === 'otro' && (
                        <div>
                            <label className="text-sm font-medium mb-2 block">Especificar motivo *</label>
                            <Textarea
                                placeholder="Describe el motivo del rechazo..."
                                value={motivoRechazo}
                                onChange={(e) => setMotivoRechazo(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Observaciones */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Observaciones Adicionales</label>
                        <Textarea
                            placeholder="Información adicional sobre el rechazo..."
                            value={
                                motivoRechazoSeleccionado !== 'otro'
                                    ? motivoRechazo
                                    : ''
                            }
                            onChange={(e) => {
                                if (motivoRechazoSeleccionado !== 'otro') {
                                    setMotivoRechazo(e.target.value);
                                }
                            }}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onRechazar}
                        disabled={isProcessing || !motivoRechazoSeleccionado}
                    >
                        {isProcessing ? 'Rechazando...' : 'Rechazar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
