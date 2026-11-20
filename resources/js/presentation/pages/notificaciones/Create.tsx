import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import AppLayout from '@/layouts/app-layout';
import notificacionesService from '@/infrastructure/services/notificaciones.service';
import {
    NotificacionForm,
    valoresNuevaNotificacion,
} from '@/presentation/components/notificaciones/NotificacionForm';

export default function NotificacionesCreate() {
    const [valoresIniciales] = useState(valoresNuevaNotificacion);

    return (
        <AppLayout>
            <Head title="Crear Notificación" />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Nueva Notificación Recurrente</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Crea una notificación que se enviará automáticamente según el horario programado
                    </p>
                </div>

                <NotificacionForm
                    valoresIniciales={valoresIniciales}
                    textoGuardar="Crear Notificación"
                    guardarEnServidor={(payload) => notificacionesService.crear(payload)}
                    alGuardar={() => {
                        toast.success('Notificación creada exitosamente');
                        router.visit('/notificaciones');
                    }}
                />
            </div>
        </AppLayout>
    );
}
