import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';

interface ProformaAprobacionModalProps {
    isOpen: boolean;
    onClose: () => void;
    proforma: any;
    datosConfirmacion: any;
    setDatosConfirmacion: (data: any) => void;
    onAprobar: () => void;
    isProcessing: boolean;
}

export function ProformaAprobacionModal({
    isOpen,
    onClose,
    proforma,
    datosConfirmacion,
    setDatosConfirmacion,
    onAprobar,
    isProcessing,
}: ProformaAprobacionModalProps) {
    if (!proforma) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Confirmar Proforma: {proforma.numero}</DialogTitle>
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

                    {/* Datos de confirmación */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">Fecha de Entrega Confirmada</label>
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
                        <label className="text-sm font-medium mb-2 block">Hora de Entrega Confirmada</label>
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
                        <label className="text-sm font-medium mb-2 block">Comentario de Coordinación</label>
                        <Textarea
                            placeholder="Notas sobre la entrega..."
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
                        <label className="text-sm font-medium mb-2 block">Comentario Adicional</label>
                        <Textarea
                            placeholder="Información adicional..."
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

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isProcessing}>
                        Cancelar
                    </Button>
                    <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={onAprobar}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Aprobando...' : 'Aprobar'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
