import { useMemo } from 'react';
import { AlertTriangle, CalendarClock, Info } from 'lucide-react';
import {
    contarEnviosPendientes,
    describirRitmo,
    formatearEnvio,
    horasActivas,
    motivoSinEnvios,
    parseFecha,
    proximosEnvios,
    type Programacion,
} from './programacion';

const CANTIDAD_PREVIEW = 6;
// A partir de cuántos envíos por día avisamos que puede resultar molesto
const UMBRAL_ENVIOS_DIA = 4;

interface Props {
    programacion: Programacion;
    activo: boolean;
}

export function ProximosEnviosPreview({ programacion, activo }: Props) {
    const { proximos, total, ritmo, motivo, porDia } = useMemo(() => {
        const ahora = new Date();
        return {
            proximos: proximosEnvios(programacion, CANTIDAD_PREVIEW, ahora),
            total: contarEnviosPendientes(programacion, ahora),
            ritmo: describirRitmo(programacion),
            motivo: motivoSinEnvios(programacion, ahora),
            porDia: horasActivas(programacion).length,
        };
    }, [programacion]);

    const fin = parseFecha(programacion.fecha_fin);

    if (motivo) {
        return (
            <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700/60 dark:bg-amber-900/20 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                <div>
                    <p className="font-medium">Con esta configuración no se enviará ninguna notificación.</p>
                    <p>{motivo}.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {!activo && (
                <div className="flex items-start gap-2 rounded-lg bg-gray-100 p-3 text-sm text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <Info className="mt-0.5 h-4 w-4 shrink-0" />
                    La notificación está desactivada: estos envíos solo ocurrirán si la activas.
                </div>
            )}

            <div className="flex flex-wrap gap-2">
                {proximos.map((fecha) => (
                    <span
                        key={fecha.getTime()}
                        className="inline-flex items-center gap-1 rounded-full border bg-muted/50 px-2.5 py-1 font-mono text-xs"
                    >
                        <CalendarClock className="h-3 w-3" />
                        {formatearEnvio(fecha)}
                    </span>
                ))}
                {(total === null || total > proximos.length) && (
                    <span className="px-1 py-1 text-xs text-muted-foreground">…</span>
                )}
            </div>

            <p className="text-sm text-muted-foreground">
                {total === null ? (
                    <>
                        Sin fecha de fin: <strong className="text-foreground">{ritmo}</strong>, hasta que la desactives.
                    </>
                ) : (
                    <>
                        En total: <strong className="text-foreground">{total} {total === 1 ? 'envío' : 'envíos'}</strong>
                        {fin && programacion.frecuencia !== 'una_vez' && (
                            <> hasta el {fin.toLocaleDateString('es-BO')}</>
                        )}
                        .
                    </>
                )}{' '}
                Las horas corresponden a la hora de Bolivia.
            </p>

            {porDia >= UMBRAL_ENVIOS_DIA && (
                <div className="flex items-start gap-2 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700/60 dark:bg-amber-900/20 dark:text-amber-200">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    Cada destinatario recibirá {porDia} notificaciones el mismo día. Demasiados envíos pueden hacer que
                    los usuarios desactiven las notificaciones.
                </div>
            )}
        </div>
    );
}
