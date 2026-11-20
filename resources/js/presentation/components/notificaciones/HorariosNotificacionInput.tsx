import { useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Trash2, Plus, Clock, Wand2 } from 'lucide-react';
import type { HorarioNotificacion } from '@/infrastructure/services/notificaciones.service';

export type Horario = HorarioNotificacion;

interface HorariosNotificacionInputProps {
    horarios: Horario[];
    onChange: (horarios: Horario[]) => void;
    error?: string;
    // Opcionales: solo para que el resumen describa cuándo se envía
    frecuencia?: string;
    diasSemana?: string[];
    diaMes?: number | null;
    fechaInicio?: string | null;
}

const HORAS_RAPIDAS = ['08:00', '10:00', '12:00', '15:00', '18:00', '20:00'];

const HORA_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

const ordenar = (horarios: Horario[]) => [...horarios].sort((a, b) => a.hora.localeCompare(b.hora));

const aMinutos = (hora: string) => {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
};

const aHora = (minutos: number) =>
    `${String(Math.floor(minutos / 60)).padStart(2, '0')}:${String(minutos % 60).padStart(2, '0')}`;

/**
 * Valida la lista de horarios. Devuelve el mensaje de error o null si es válida.
 * La BD tiene un índice único (notificacion, hora), por eso se rechazan duplicados.
 */
export function validarHorarios(horarios: Horario[]): string | null {
    if (horarios.length === 0) return 'Debe agregar al menos un horario';
    if (horarios.some((h) => !HORA_REGEX.test(h.hora))) return 'Todos los horarios deben estar en formato HH:mm';
    if (new Set(horarios.map((h) => h.hora)).size !== horarios.length) return 'Hay horarios repetidos';
    if (!horarios.some((h) => h.activo)) return 'Debe haber al menos un horario activo';
    return null;
}

function describirCuando(frecuencia?: string, diasSemana?: string[], diaMes?: number | null, fechaInicio?: string | null) {
    switch (frecuencia) {
        case 'una_vez':
            return fechaInicio ? `el ${fechaInicio.split('-').reverse().join('/')}` : 'el día de inicio';
        case 'semanal':
            return diasSemana && diasSemana.length > 0 ? `cada ${diasSemana.join(', ')}` : 'los días seleccionados';
        case 'mensual':
            return diaMes ? `el día ${diaMes} de cada mes` : 'el día seleccionado de cada mes';
        case 'diario':
            return 'todos los días';
        default:
            return 'por día';
    }
}

export function HorariosNotificacionInput({
    horarios,
    onChange,
    error,
    frecuencia,
    diasSemana,
    diaMes,
    fechaInicio,
}: HorariosNotificacionInputProps) {
    const [mostrarGenerador, setMostrarGenerador] = useState(false);
    const [generador, setGenerador] = useState({ desde: '08:00', hasta: '18:00', cadaHoras: 2 });

    const horasExistentes = new Set(horarios.map((h) => h.hora));
    const duplicadas = new Set(horarios.map((h) => h.hora).filter((hora, i, arr) => arr.indexOf(hora) !== i));
    const activos = ordenar(horarios.filter((h) => h.activo && HORA_REGEX.test(h.hora)));

    // Agrega horas sin duplicar y deja la lista ordenada
    const agregarHoras = (horas: string[]) => {
        const nuevas = horas
            .filter((hora) => !horasExistentes.has(hora))
            .map((hora) => ({ hora, activo: true }));
        if (nuevas.length > 0) onChange(ordenar([...horarios, ...nuevas]));
    };

    const agregarHorario = () => {
        // Proponer la siguiente hora libre después del último horario
        const ultima = horarios.length > 0 ? Math.max(...horarios.map((h) => aMinutos(h.hora) || 0)) : aMinutos('08:00') - 60;
        let candidata = (ultima + 60) % (24 * 60);
        while (horasExistentes.has(aHora(candidata)) && candidata < 24 * 60 - 1) candidata++;
        onChange([...horarios, { hora: aHora(candidata), activo: true }]);
    };

    const actualizarHorario = (index: number, cambios: Partial<Horario>) => {
        onChange(horarios.map((h, i) => (i === index ? { ...h, ...cambios } : h)));
    };

    const eliminarHorario = (index: number) => {
        onChange(horarios.filter((_, i) => i !== index));
    };

    const generarSerie = () => {
        const desde = aMinutos(generador.desde);
        const hasta = aMinutos(generador.hasta);
        const paso = Math.max(1, generador.cadaHoras) * 60;
        if (isNaN(desde) || isNaN(hasta) || hasta < desde) return;
        const horas: string[] = [];
        for (let m = desde; m <= hasta; m += paso) horas.push(aHora(m));
        agregarHoras(horas);
        setMostrarGenerador(false);
    };

    const todosActivos = horarios.length > 0 && horarios.every((h) => h.activo);

    return (
        <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="block text-sm font-medium">
                    Horarios de Envío <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                    <Button
                        type="button"
                        onClick={() => setMostrarGenerador(!mostrarGenerador)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                    >
                        <Wand2 className="h-4 w-4" />
                        Generar serie
                    </Button>
                    <Button type="button" onClick={agregarHorario} variant="outline" size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Agregar Horario
                    </Button>
                </div>
            </div>

            {/* Horas rápidas */}
            <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Rápido:</span>
                {HORAS_RAPIDAS.map((hora) => {
                    const yaExiste = horasExistentes.has(hora);
                    return (
                        <button
                            key={hora}
                            type="button"
                            disabled={yaExiste}
                            onClick={() => agregarHoras([hora])}
                            className="rounded-full border px-2.5 py-0.5 text-xs transition hover:bg-muted disabled:cursor-default disabled:border-blue-200 disabled:bg-blue-50 disabled:text-blue-700 dark:disabled:border-blue-800 dark:disabled:bg-blue-900/30 dark:disabled:text-blue-300"
                        >
                            {yaExiste ? '✓ ' : '+ '}
                            {hora}
                        </button>
                    );
                })}
            </div>

            {/* Generador: cada N horas entre dos horas */}
            {mostrarGenerador && (
                <div className="flex flex-wrap items-end gap-3 rounded-lg border border-dashed p-3">
                    <div>
                        <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Desde</label>
                        <Input
                            type="time"
                            value={generador.desde}
                            onChange={(e) => setGenerador({ ...generador, desde: e.target.value })}
                            className="w-32"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Hasta</label>
                        <Input
                            type="time"
                            value={generador.hasta}
                            onChange={(e) => setGenerador({ ...generador, hasta: e.target.value })}
                            className="w-32"
                        />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs text-gray-600 dark:text-gray-400">Cada (horas)</label>
                        <Input
                            type="number"
                            min={1}
                            max={12}
                            value={generador.cadaHoras}
                            onChange={(e) => setGenerador({ ...generador, cadaHoras: Number(e.target.value) })}
                            className="w-24"
                        />
                    </div>
                    <Button type="button" size="sm" onClick={generarSerie}>
                        Agregar
                    </Button>
                </div>
            )}

            {horarios.length === 0 ? (
                <div className="rounded-lg bg-gray-50 p-4 text-center text-gray-600 dark:bg-gray-900 dark:text-gray-400">
                    <p className="text-sm">No hay horarios agregados</p>
                </div>
            ) : (
                <>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            {activos.length} de {horarios.length} activos
                        </span>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                className="text-blue-600 hover:underline dark:text-blue-400"
                                onClick={() => onChange(horarios.map((h) => ({ ...h, activo: !todosActivos })))}
                            >
                                {todosActivos ? 'Desactivar todos' : 'Activar todos'}
                            </button>
                            <button
                                type="button"
                                className="text-red-600 dark:text-red-400 hover:underline dark:text-red-400"
                                onClick={() => onChange([])}
                            >
                                Quitar todos
                            </button>
                        </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        {horarios.map((horario, index) => {
                            const esDuplicada = duplicadas.has(horario.hora);
                            return (
                                <div
                                    key={horario.id ?? `nuevo-${index}`}
                                    className={`flex items-center gap-3 rounded-lg border p-2 ${
                                        esDuplicada
                                            ? 'border-red-400 bg-red-50 dark:border-red-500/60 dark:bg-red-900/20'
                                            : horario.activo
                                              ? 'bg-muted/50'
                                              : 'bg-gray-50 opacity-60 dark:bg-gray-900'
                                    }`}
                                >
                                    <Checkbox
                                        id={`horario-activo-${index}`}
                                        checked={horario.activo}
                                        onCheckedChange={(checked) => actualizarHorario(index, { activo: checked === true })}
                                        aria-label="Horario activo"
                                    />
                                    <div className="flex-1">
                                        <Input
                                            type="time"
                                            value={horario.hora}
                                            onChange={(e) => actualizarHorario(index, { hora: e.target.value })}
                                            // Reordenar al terminar de editar para no mover la fila mientras se escribe
                                            onBlur={() => onChange(ordenar(horarios))}
                                            className="h-8"
                                        />
                                        {esDuplicada && <p className="mt-1 text-xs text-red-600 dark:text-red-400">Hora repetida</p>}
                                        {horario.ultimo_envio && (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                Último envío: {new Date(horario.ultimo_envio).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => eliminarHorario(index)}
                                        className="text-red-600 dark:text-red-400 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                                        title="Eliminar horario"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            {activos.length > 0 && (
                <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                    📌 Se enviará <strong>{activos.length} {activos.length === 1 ? 'vez' : 'veces'}</strong>{' '}
                    {describirCuando(frecuencia, diasSemana, diaMes, fechaInicio)} a las{' '}
                    <strong>{activos.map((h) => h.hora).join(', ')}</strong>
                </div>
            )}
        </div>
    );
}
