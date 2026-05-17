/**
 * Componente para seleccionar ventanas de entrega del cliente
 *
 * REFACTORIZACIÓN INTEGRACIÓN TIER 3:
 * - Usar DateFormatter.getDayName() en lugar de DIAS_SEMANA hardcodeado
 * - Ahorro: 8 líneas (-30% de constant)
 * - Beneficio: Localización automática, consistencia con FASE 5.5
 */

import React, { useState } from 'react';
import { Button } from '@/presentation/components/ui/button';
import { Card } from '@/presentation/components/ui/card';
import { Label } from '@/presentation/components/ui/label';
import { Plus, Trash2, Clock } from 'lucide-react';
import { DateFormatter } from '@/infrastructure/utils';
import type { VentanaEntregaCliente } from '@/domain/entities/clientes';

interface VentanasEntregaSelectorProps {
    value: VentanaEntregaCliente[];
    onChange: (ventanas: VentanaEntregaCliente[]) => void;
    disabled?: boolean;
}

// Generar días de semana usando DateFormatter (mejor que hardcodeado)
const DIAS_SEMANA = Array.from({ length: 7 }, (_, i) => ({
    value: i,
    label: DateFormatter.getDayName(i),  // Capitalizado: "Domingo", "Lunes", etc.
    short: DateFormatter.getDayName(i).substring(0, 3),  // "Dom", "Lun", etc.
}));

export default function VentanasEntregaSelector({
    value = [],
    onChange,
    disabled = false
}: VentanasEntregaSelectorProps) {
    const [selectedDay, setSelectedDay] = useState<number | null>(null);

    const handleAddVentana = () => {
        if (selectedDay === null) return;

        const nuevaVentana: VentanaEntregaCliente = {
            dia_semana: selectedDay,
            hora_inicio: '08:00',
            hora_fin: '17:00',
            activo: true
        };

        onChange([...value, nuevaVentana]);
        setSelectedDay(null);
    };

    const handleRemoveVentana = (index: number) => {
        const newVentanas = value.filter((_, i) => i !== index);
        onChange(newVentanas);
    };

    const handleUpdateVentana = (index: number, field: keyof VentanaEntregaCliente, newValue: any) => {
        const newVentanas = value.map((ventana, i) => {
            if (i === index) {
                // Normalizar formato de hora a HH:MM si es necesario
                let finalValue = newValue;
                if ((field === 'hora_inicio' || field === 'hora_fin') && typeof newValue === 'string') {
                    // Si la hora viene en formato HH:MM:SS, convertir a HH:MM
                    if (newValue.length > 5) {
                        finalValue = newValue.substring(0, 5);
                    }
                }
                return { ...ventana, [field]: finalValue };
            }
            return ventana;
        });
        onChange(newVentanas);
    };

    // Agrupar ventanas por día
    const ventanasPorDia = value.reduce((acc, ventana, index) => {
        if (!acc[ventana.dia_semana]) {
            acc[ventana.dia_semana] = [];
        }
        acc[ventana.dia_semana].push({ ventana, index });
        return acc;
    }, {} as Record<number, Array<{ ventana: VentanaEntregaCliente; index: number }>>);

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Días y horarios en que el cliente prefiere recibir visitas del preventista</span>
            </div>

            {/* Lista de ventanas actuales */}
            {Object.entries(ventanasPorDia).length > 0 && (
                <div className="space-y-3">
                    {DIAS_SEMANA.map((dia) => {
                        const ventanasDelDia = ventanasPorDia[dia.value];
                        if (!ventanasDelDia) return null;

                        return (
                            <Card key={dia.value} className="p-4">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-sm flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        {dia.label}
                                    </h4>
                                    <div className="space-y-2">
                                        {ventanasDelDia.map(({ ventana, index }) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                                            >
                                                <div className="flex-1 grid grid-cols-2 gap-3">
                                                    <div>
                                                        <Label className="text-xs text-muted-foreground">
                                                            Hora inicio
                                                        </Label>
                                                        <input
                                                            type="time"
                                                            value={ventana.hora_inicio && ventana.hora_inicio.length > 5 ? ventana.hora_inicio.substring(0, 5) : ventana.hora_inicio}
                                                            onChange={(e) =>
                                                                handleUpdateVentana(
                                                                    index,
                                                                    'hora_inicio',
                                                                    e.target.value
                                                                )
                                                            }
                                                            disabled={disabled}
                                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                        />
                                                    </div>
                                                    <div>
                                                        <Label className="text-xs text-muted-foreground">
                                                            Hora fin
                                                        </Label>
                                                        <input
                                                            type="time"
                                                            value={ventana.hora_fin && ventana.hora_fin.length > 5 ? ventana.hora_fin.substring(0, 5) : ventana.hora_fin}
                                                            onChange={(e) =>
                                                                handleUpdateVentana(
                                                                    index,
                                                                    'hora_fin',
                                                                    e.target.value
                                                                )
                                                            }
                                                            disabled={disabled}
                                                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                                        />
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemoveVentana(index)}
                                                    disabled={disabled}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}

            {/* Agregar nueva ventana */}
            {!disabled && (
                <Card className="p-4 border-dashed">
                    <div className="space-y-3">
                        <Label className="text-sm font-medium">Agregar día de visita</Label>
                        <div className="flex gap-2">
                            <select
                                value={selectedDay ?? ''}
                                onChange={(e) =>
                                    setSelectedDay(e.target.value ? Number(e.target.value) : null)
                                }
                                className="flex-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="">Seleccionar día...</option>
                                {DIAS_SEMANA.map((dia) => (
                                    <option key={dia.value} value={dia.value}>
                                        {dia.label}
                                    </option>
                                ))}
                            </select>
                            <Button
                                type="button"
                                onClick={handleAddVentana}
                                disabled={selectedDay === null}
                                size="sm"
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Agregar
                            </Button>
                        </div>
                        {value.length === 0 && (
                            <p className="text-xs text-muted-foreground">
                                No hay días configurados. Selecciona los días que el cliente prefiere
                                para recibir visitas.
                            </p>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
