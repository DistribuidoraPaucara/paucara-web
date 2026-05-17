import { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import logisticaService from '@/infrastructure/services/logistica.service';
import type { ProformaAppExterna } from '@/domain/entities/logistica';

export function useProformaUnifiedModal() {
    const [mostrarModal, setMostrarModal] = useState(false);
    const [proformaSeleccionada, setProformaSeleccionada] = useState<ProformaAppExterna | null>(null);
    const [tabActiva, setTabActiva] = useState<'editar' | 'aprobar' | 'rechazar'>('editar');
    const [procesandoId, setProcesandoId] = useState<number | null>(null);
    const [cargandoDetalles, setCargandoDetalles] = useState(false);

    // Datos de edición/aprobación
    const [datosConfirmacion, setDatosConfirmacion] = useState({
        fecha_entrega_confirmada: '',
        hora_entrega_confirmada: '',
        direccion_entrega_confirmada_id: '',
        comentario_coordinacion: '',
        comentario: '',
    });

    // Datos de rechazo
    const [motivoRechazoSeleccionado, setMotivoRechazoSeleccionado] = useState<string>('');
    const [motivoRechazoCustom, setMotivoRechazoCustom] = useState('');

    // Notas de llamada
    const [notasLlamada, setNotasLlamada] = useState('');

    // Abrir modal
    const abrirModal = (proforma: ProformaAppExterna) => {
        console.log('🔄 Abriendo modal para proforma:', proforma.id);
        setCargandoDetalles(true);
        setMostrarModal(true);

        // Cargar detalles completos de la proforma desde el servidor
        fetch(`/api/proformas/${proforma.id}`)
            .then(response => {
                console.log('📡 Respuesta API:', response.status);
                if (!response.ok) throw new Error('No se pudieron cargar los detalles');
                return response.json();
            })
            .then(detallesProforma => {
                console.log('✅ Detalles cargados:', detallesProforma);
                const proformaCompleta = detallesProforma.data || detallesProforma;

                console.log('📊 Proforma completa:', proformaCompleta);
                setProformaSeleccionada(proformaCompleta);

                // Extraer fecha en formato YYYY-MM-DD para input[type="date"]
                const extraerFecha = (timestamp?: string): string => {
                    if (!timestamp) return '';
                    try {
                        if (timestamp.includes('T')) {
                            return timestamp.split('T')[0]; // "2025-12-05T09:00:00.000000Z" → "2025-12-05"
                        }
                        if (timestamp.match(/^\d{4}-\d{2}-\d{2}$/)) {
                            return timestamp;
                        }
                        return '';
                    } catch {
                        return '';
                    }
                };

                // Extraer hora en formato HH:mm para input[type="time"]
                const extraerHora = (timestamp?: string): string => {
                    if (!timestamp) return '';
                    try {
                        if (timestamp.includes('T')) {
                            const date = new Date(timestamp);
                            if (isNaN(date.getTime())) return '';
                            const horas = String(date.getHours()).padStart(2, '0');
                            const minutos = String(date.getMinutes()).padStart(2, '0');
                            return `${horas}:${minutos}`;
                        }
                        if (timestamp.match(/^\d{2}:\d{2}/)) {
                            return timestamp;
                        }
                        return '';
                    } catch {
                        return '';
                    }
                };

                setDatosConfirmacion({
                    fecha_entrega_confirmada: extraerFecha(proformaCompleta.fecha_entrega_solicitada),
                    hora_entrega_confirmada: extraerHora(proformaCompleta.hora_entrega_solicitada),
                    direccion_entrega_confirmada_id: String(proformaCompleta.direccion_entrega_solicitada_id || ''),
                    comentario_coordinacion: '',
                    comentario: '',
                });
                setTabActiva('editar');
                setMotivoRechazoSeleccionado('');
                setMotivoRechazoCustom('');
                setNotasLlamada('');
                setCargandoDetalles(false);
            })
            .catch(error => {
                console.error('Error al cargar proforma:', error);
                toast.error('No se pudieron cargar los detalles de la proforma');
                setCargandoDetalles(false);
                setMostrarModal(false);
            });
    };

    // Cerrar modal
    const cerrarModal = () => {
        setMostrarModal(false);
        setProformaSeleccionada(null);
        setTabActiva('editar');
        setNotasLlamada('');
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
                comentario_coordinacion: `${datosConfirmacion.comentario_coordinacion}\n\nNotas de llamada: ${notasLlamada}`,
            });
            toast.success('✓ Proforma aprobada exitosamente');
            cerrarModal();
            router.reload();
        } catch (error) {
            console.error(error);
            toast.error('Error al aprobar la proforma');
        } finally {
            setProcesandoId(null);
        }
    };

    // Rechazar proforma
    const rechazarProforma = async (motivosRechazo: any[]) => {
        if (!proformaSeleccionada) return;

        const motivoSeleccionadoLabel = motivosRechazo.find(
            (m) => m.value === motivoRechazoSeleccionado
        )?.label || '';

        let motivoFinal = '';
        if (motivoRechazoSeleccionado === 'otro') {
            motivoFinal = motivoRechazoCustom;
        } else {
            motivoFinal = motivoRechazoCustom
                ? `${motivoSeleccionadoLabel} - ${motivoRechazoCustom}`
                : motivoSeleccionadoLabel;
        }

        const errores = logisticaService.validateRechazarProforma(motivoFinal);
        if (errores.length > 0) {
            errores.forEach((error) => toast.error(error));
            return;
        }

        setProcesandoId(proformaSeleccionada.id);
        try {
            await logisticaService.rechazarProforma(proformaSeleccionada.id, motivoFinal);
            toast.success('✗ Proforma rechazada');
            cerrarModal();
            router.reload();
        } catch (error) {
            console.error(error);
            toast.error('Error al rechazar la proforma');
        } finally {
            setProcesandoId(null);
        }
    };

    return {
        // Estado
        mostrarModal,
        proformaSeleccionada,
        tabActiva,
        procesandoId,
        datosConfirmacion,
        motivoRechazoSeleccionado,
        motivoRechazoCustom,
        notasLlamada,
        cargandoDetalles,

        // Setters
        setTabActiva,
        setDatosConfirmacion,
        setMotivoRechazoSeleccionado,
        setMotivoRechazoCustom,
        setNotasLlamada,

        // Funciones
        abrirModal,
        cerrarModal,
        aprobarProforma,
        rechazarProforma,
    };
}
