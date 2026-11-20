import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { Send } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/presentation/components/ui/alert-dialog';
import notificacionesService, { type NotificacionRecurrente } from '@/infrastructure/services/notificaciones.service';
import {
    NotificacionForm,
    valoresDesdeNotificacion,
    type NotificacionFormContexto,
} from '@/presentation/components/notificaciones/NotificacionForm';

interface Props {
    notificacion: NotificacionRecurrente;
}

/** Botón "Enviar ahora" con confirmación. El backend envía la versión guardada, así que guarda antes si hay cambios. */
function EnviarAhora({ id, ctx }: { id: number; ctx: NotificacionFormContexto }) {
    const [abierto, setAbierto] = useState(false);
    const [enviando, setEnviando] = useState(false);

    const enviar = async () => {
        if (ctx.hayCambios && !(await ctx.guardar())) return;

        setEnviando(true);
        try {
            await notificacionesService.enviar(id);
            toast.success('✅ Notificación enviada exitosamente');
        } catch (error) {
            toast.error('❌ Error al enviar notificación');
            console.error(error);
        } finally {
            setEnviando(false);
        }
    };

    return (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={() => setAbierto(true)}
                disabled={enviando || ctx.ocupado}
                className="gap-2"
            >
                <Send className="h-4 w-4" />
                {enviando ? 'Enviando...' : ctx.hayCambios ? 'Guardar y Enviar' : 'Enviar Ahora'}
            </Button>

            <AlertDialog open={abierto} onOpenChange={setAbierto}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Enviar notificación ahora?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Se enviará <strong>"{ctx.values.titulo}"</strong> de inmediato a{' '}
                            <strong>{ctx.destinatarios}</strong>. Este envío no reemplaza a los horarios programados.
                            {ctx.hayCambios && (
                                <span className="mt-2 block font-medium text-amber-700 dark:text-amber-400">
                                    Tienes cambios sin guardar: se guardarán antes de enviar.
                                </span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={enviar}>
                            {ctx.hayCambios ? 'Guardar y enviar' : 'Enviar ahora'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default function NotificacionesEdit({ notificacion }: Props) {
    const [valoresIniciales] = useState(() => valoresDesdeNotificacion(notificacion));

    return (
        <AppLayout>
            <Head title={`Editar: ${notificacion.titulo}`} />

            <div className="space-y-6 p-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Editar Notificación</h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{notificacion.titulo}</p>
                </div>

                <NotificacionForm
                    valoresIniciales={valoresIniciales}
                    textoGuardar="Guardar Cambios"
                    guardarEnServidor={(payload) => notificacionesService.actualizar(notificacion.id, payload)}
                    alGuardar={() => {
                        toast.success('Notificación actualizada exitosamente');
                        router.visit('/notificaciones');
                    }}
                    accionesExtra={(ctx) => <EnviarAhora id={notificacion.id} ctx={ctx} />}
                />
            </div>
        </AppLayout>
    );
}
