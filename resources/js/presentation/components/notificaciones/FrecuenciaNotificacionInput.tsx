import { Input } from '@/presentation/components/ui/input';
import type { Frecuencia } from '@/infrastructure/services/notificaciones.service';

// Los nombres se guardan tal cual en dias_semana; el backend los compara con o sin tilde
export const DIAS_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

const FRECUENCIAS: { value: Frecuencia; label: string; ayuda: string }[] = [
    { value: 'una_vez', label: 'Una sola vez', ayuda: 'Solo el día de inicio' },
    { value: 'diario', label: 'Todos los días', ayuda: 'Los 7 días de la semana' },
    { value: 'semanal', label: 'Días específicos', ayuda: 'Elige qué días de la semana' },
    { value: 'mensual', label: 'Una vez al mes', ayuda: 'Un día fijo de cada mes' },
];

const ATAJOS_DIAS = [
    { label: 'Lun a Vie', dias: DIAS_SEMANA.slice(0, 5) },
    { label: 'Lun a Sáb', dias: DIAS_SEMANA.slice(0, 6) },
    { label: 'Fin de semana', dias: DIAS_SEMANA.slice(5) },
];

export interface FrecuenciaValue {
    frecuencia?: Frecuencia;
    dias_semana?: string[];
    dia_mes?: number | null;
}

interface FrecuenciaNotificacionInputProps extends FrecuenciaValue {
    onChange: (cambios: FrecuenciaValue) => void;
    errors?: { dias_semana?: string; dia_mes?: string };
}

const mismosDias = (a: string[], b: string[]) => a.length === b.length && a.every((d) => b.includes(d));

export function FrecuenciaNotificacionInput({
    frecuencia = 'una_vez',
    dias_semana = [],
    dia_mes,
    onChange,
    errors = {},
}: FrecuenciaNotificacionInputProps) {
    const cambiarFrecuencia = (valor: Frecuencia) => {
        // Al pasar a días específicos sin días elegidos, proponer lunes a viernes
        if (valor === 'semanal' && dias_semana.length === 0) {
            onChange({ frecuencia: valor, dias_semana: DIAS_SEMANA.slice(0, 5) });
        } else if (valor === 'mensual' && !dia_mes) {
            onChange({ frecuencia: valor, dia_mes: 1 });
        } else {
            onChange({ frecuencia: valor });
        }
    };

    const toggleDia = (dia: string) => {
        const nuevos = dias_semana.includes(dia) ? dias_semana.filter((d) => d !== dia) : [...dias_semana, dia];
        // Mantener el orden de la semana
        onChange({ dias_semana: DIAS_SEMANA.filter((d) => nuevos.includes(d)) });
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="mb-2 block text-sm font-medium">
                    Frecuencia <span className="text-red-600 dark:text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2" role="radiogroup">
                    {FRECUENCIAS.map((f) => {
                        const activa = frecuencia === f.value;
                        return (
                            <button
                                key={f.value}
                                type="button"
                                role="radio"
                                aria-checked={activa}
                                onClick={() => cambiarFrecuencia(f.value)}
                                className={`rounded-lg border p-3 text-left transition ${
                                    activa
                                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                                        : 'border-input bg-input-background hover:bg-muted'
                                }`}
                            >
                                <span className="block text-sm font-medium">{f.label}</span>
                                <span className="block text-xs text-muted-foreground">{f.ayuda}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Días de la semana: editables en "Días específicos", informativos en "Todos los días" */}
            {(frecuencia === 'semanal' || frecuencia === 'diario') && (
                <div>
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <label className="block text-sm font-medium">
                            Días de envío {frecuencia === 'semanal' && <span className="text-red-600 dark:text-red-400">*</span>}
                        </label>
                        {frecuencia === 'semanal' && (
                            <div className="flex flex-wrap gap-2">
                                {ATAJOS_DIAS.map((atajo) => (
                                    <button
                                        key={atajo.label}
                                        type="button"
                                        onClick={() => onChange({ dias_semana: atajo.dias })}
                                        className={`rounded-full border px-2.5 py-0.5 text-xs transition ${
                                            mismosDias(dias_semana, atajo.dias)
                                                ? 'border-primary bg-primary/10'
                                                : 'hover:bg-muted'
                                        }`}
                                    >
                                        {atajo.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-7 gap-1.5">
                        {DIAS_SEMANA.map((dia) => {
                            const seleccionado = frecuencia === 'diario' || dias_semana.includes(dia);
                            return (
                                <button
                                    key={dia}
                                    type="button"
                                    disabled={frecuencia === 'diario'}
                                    aria-pressed={seleccionado}
                                    onClick={() => toggleDia(dia)}
                                    title={dia}
                                    className={`rounded-md border py-2 text-sm font-medium capitalize transition disabled:cursor-default ${
                                        seleccionado
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-input bg-input-background text-muted-foreground hover:bg-muted'
                                    } ${frecuencia === 'diario' ? 'opacity-70' : ''}`}
                                >
                                    <span className="hidden sm:inline">{dia.slice(0, 3)}</span>
                                    <span className="sm:hidden">{dia.slice(0, 2)}</span>
                                </button>
                            );
                        })}
                    </div>
                    {frecuencia === 'diario' && (
                        <p className="mt-2 text-xs text-muted-foreground">
                            Se envía todos los días. Para elegir días, cambia a <strong>Días específicos</strong>.
                        </p>
                    )}
                    {frecuencia === 'semanal' && dias_semana.length === 7 && (
                        <p className="mt-2 text-xs text-muted-foreground">Con los 7 días equivale a "Todos los días".</p>
                    )}
                    {errors.dias_semana && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.dias_semana}</p>}
                </div>
            )}

            {frecuencia === 'mensual' && (
                <div className="max-w-xs">
                    <label className="mb-2 block text-sm font-medium">
                        Día del Mes <span className="text-red-600 dark:text-red-400">*</span>
                    </label>
                    <Input
                        type="number"
                        min={1}
                        max={31}
                        value={dia_mes ?? 1}
                        onChange={(e) => onChange({ dia_mes: Number(e.target.value) })}
                        className={errors.dia_mes ? 'border-red-500 dark:border-red-400' : ''}
                    />
                    {errors.dia_mes ? (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.dia_mes}</p>
                    ) : (
                        (dia_mes ?? 1) > 28 && (
                            <p className="mt-1 text-xs text-muted-foreground">
                                En los meses que no tienen ese día se envía el último día del mes.
                            </p>
                        )
                    )}
                </div>
            )}
        </div>
    );
}
