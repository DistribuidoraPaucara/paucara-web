import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';

export interface Horario {
    id?: number;
    hora: string;
    activo: boolean;
}

interface HorariosNotificacionInputProps {
    horarios: Horario[];
    onChange: (horarios: Horario[]) => void;
    error?: string;
}

export function HorariosNotificacionInput({
    horarios,
    onChange,
    error,
}: HorariosNotificacionInputProps) {
    const agregarHorario = () => {
        const nuevoHorario: Horario = {
            hora: '09:00',
            activo: true,
        };
        onChange([...horarios, nuevoHorario]);
    };

    const actualizarHorario = (index: number, campo: 'hora' | 'activo', valor: string | boolean) => {
        const nuevosHorarios = [...horarios];
        if (campo === 'hora') {
            nuevosHorarios[index].hora = valor as string;
        } else {
            nuevosHorarios[index].activo = valor as boolean;
        }
        onChange(nuevosHorarios);
    };

    const eliminarHorario = (index: number) => {
        onChange(horarios.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium">
                    Horarios de Envío <span className="text-red-600">*</span>
                </label>
                <Button
                    type="button"
                    onClick={agregarHorario}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                >
                    <Plus className="w-4 h-4" />
                    Agregar Horario
                </Button>
            </div>

            {horarios.length === 0 && (
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center text-gray-600 dark:text-gray-400">
                    <p className="text-sm">No hay horarios agregados</p>
                </div>
            )}

            <div className="space-y-2">
                {horarios.map((horario, index) => (
                    <div
                        key={index}
                        className="flex gap-3 items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg"
                    >
                        {/* Checkbox de activo */}
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id={`horario-activo-${index}`}
                                checked={horario.activo}
                                onCheckedChange={(checked) =>
                                    actualizarHorario(index, 'activo', checked === true)
                                }
                            />
                            <label htmlFor={`horario-activo-${index}`} className="text-xs text-gray-600 dark:text-gray-400">
                                Activo
                            </label>
                        </div>

                        {/* Input de hora */}
                        <Input
                            type="time"
                            value={horario.hora}
                            onChange={(e) => actualizarHorario(index, 'hora', e.target.value)}
                            className="flex-1"
                        />

                        {/* Botón eliminar */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => eliminarHorario(index)}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            title="Eliminar horario"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>

            {error && (
                <p className="text-red-500 text-sm">{error}</p>
            )}

            {horarios.length > 0 && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-800 dark:text-blue-200 text-sm">
                    <p>
                        📌 Se enviarán <strong>{horarios.filter(h => h.activo).length}</strong> notificaciones por día en los horarios: {' '}
                        <strong>{horarios.filter(h => h.activo).map(h => h.hora).join(', ')}</strong>
                    </p>
                </div>
            )}
        </div>
    );
}
