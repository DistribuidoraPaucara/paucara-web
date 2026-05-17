import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import logisticaService from '@/infrastructure/services/logistica.service';
import type { ProformaAppExterna } from '@/domain/entities/logistica';

export function useProformaModals() {
    const [mostrarModalRechazo, setMostrarModalRechazo] = useState(false);
    const [mostrarModalAprobacion, setMostrarModalAprobacion] = useState(false);
    const [proformaSeleccionada, setProformaSeleccionada] = useState<ProformaAppExterna | null>(null);
    const [motivoRechazo, setMotivoRechazo] = useState('');
    const [motivoRechazoSeleccionado, setMotivoRechazoSeleccionado] = useState<string>('');
    const [datosConfirmacion, setDatosConfirmacion] = useState({
        fecha_entrega_confirmada: '',
        hora_entrega_confirmada: '',
        direccion_entrega_confirmada_id: '',
        comentario_coordinacion: '',
        comentario: '',
    });
    const [procesandoId, setProcesandoId] = useState<number | null>(null);

    // Abrir modal de aprobación
    const abrirModalAprobacion = (proforma: ProformaAppExterna) => {
        setProformaSeleccionada(proforma);
        setDatosConfirmacion({
            fecha_entrega_confirmada: proforma.fecha_entrega_solicitada || '',
            hora_entrega_confirmada: proforma.hora_entrega_solicitada || '',
            direccion_entrega_confirmada_id: String(proforma.direccion_entrega_solicitada_id || ''),
            comentario_coordinacion: '',
            comentario: '',
        });
        setMostrarModalAprobacion(true);
    };

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

    // Aprobar proforma
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
            toast.success('Proforma aprobada exitosamente');
            cerrarModalAprobacion();
            router.reload();
        } catch (error) {
            console.error(error);
            toast.error('Error al aprobar la proforma');
        } finally {
            setProcesandoId(null);
        }
    };

    // Abrir modal de rechazo
    const abrirModalRechazo = (proforma: ProformaAppExterna) => {
        setProformaSeleccionada(proforma);
        setMotivoRechazo('');
        setMotivoRechazoSeleccionado('');
        setMostrarModalRechazo(true);
    };

    const cerrarModalRechazo = () => {
        setMostrarModalRechazo(false);
        setProformaSeleccionada(null);
        setMotivoRechazo('');
        setMotivoRechazoSeleccionado('');
    };

    // Rechazar proforma
    const rechazarProforma = async (motivosRechazo: any[]) => {
        if (!proformaSeleccionada) return;

        const motivoSeleccionadoLabel =
            motivosRechazo.find((m) => m.value === motivoRechazoSeleccionado)?.label || '';
        const motivoFinal =
            motivoRechazoSeleccionado === 'otro'
                ? motivoRechazo
                : motivoRechazo
                  ? `${motivoSeleccionadoLabel} - ${motivoRechazo}`
                  : motivoSeleccionadoLabel;

        const errores = logisticaService.validateRechazarProforma(motivoFinal);
        if (errores.length > 0) {
            errores.forEach((error) => toast.error(error));
            return;
        }

        setProcesandoId(proformaSeleccionada.id);
        try {
            await logisticaService.rechazarProforma(proformaSeleccionada.id, motivoFinal);
            toast.success('Proforma rechazada');
            cerrarModalRechazo();
            router.reload();
        } catch (error) {
            console.error(error);
            toast.error('Error al rechazar la proforma');
        } finally {
            setProcesandoId(null);
        }
    };

    return {
        // Estados
        mostrarModalRechazo,
        mostrarModalAprobacion,
        proformaSeleccionada,
        motivoRechazo,
        motivoRechazoSeleccionado,
        datosConfirmacion,
        procesandoId,

        // Setters
        setMotivoRechazo,
        setMotivoRechazoSeleccionado,
        setDatosConfirmacion,

        // Funciones
        abrirModalAprobacion,
        cerrarModalAprobacion,
        aprobarProforma,
        abrirModalRechazo,
        cerrarModalRechazo,
        rechazarProforma,
    };
}
