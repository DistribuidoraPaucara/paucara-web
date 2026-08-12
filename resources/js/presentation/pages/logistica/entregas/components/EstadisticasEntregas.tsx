import type { Entrega } from '@/domain/entities/entregas';
import { Card, CardContent } from '@/presentation/components/ui/card';
import React, { useMemo } from 'react';

interface Props {
    entregas: Entrega[];
    estadosLogisticos: Array<{ id: number; codigo: string; nombre: string; color?: string; icono?: string }>;
    estadoActual?: string;
    onSelectEstado?: (estadoCodigo: string) => void;
}

export function EstadisticasEntregas({ entregas, estadosLogisticos, estadoActual, onSelectEstado }: Props) {
    // Contar entregas por estado
    const conteosPorEstado = useMemo(() => {
        const conteos: Record<string, number> = {};

        // Inicializar con 0 para cada estado
        estadosLogisticos.forEach((estado) => {
            conteos[estado.codigo] = 0;
        });

        // Contar
        entregas.forEach((entrega) => {
            if (conteos.hasOwnProperty(entrega.estado)) {
                conteos[entrega.estado]++;
            }
        });

        return conteos;
    }, [entregas, estadosLogisticos]);

    const total = entregas.length;

    return (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 mb-6">
            {/* Card de TOTAL */}
            <Card
                className="cursor-pointer transition-all hover:shadow-md border-2 hover:border-blue-400"
                onClick={() => onSelectEstado?.('TODOS')}
            >
                <CardContent className="p-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{total}</div>
                        <div className="text-xs text-muted-foreground mt-1">Total</div>
                    </div>
                </CardContent>
            </Card>

            {/* Cards por estado */}
            {estadosLogisticos.map((estado) => {
                const cantidad = conteosPorEstado[estado.codigo] || 0;
                const porcentaje = total > 0 ? Math.round((cantidad / total) * 100) : 0;
                const isSelected = estadoActual === estado.codigo;

                return (
                    <Card
                        key={estado.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                            isSelected
                                ? 'border-2 shadow-md'
                                : 'border border-gray-200 dark:border-slate-700 hover:border-gray-300'
                        }`}
                        style={
                            isSelected && estado.color
                                ? {
                                      borderColor: estado.color,
                                      backgroundColor: `${estado.color}10`,
                                  }
                                : {}
                        }
                        onClick={() => onSelectEstado?.(estado.codigo)}
                    >
                        <CardContent className="p-4">
                            <div className="text-center">
                                {/* Icono */}
                                {estado.icono && <div className="text-2xl mb-1">{estado.icono}</div>}

                                {/* Cantidad */}
                                <div
                                    className="text-2xl font-bold"
                                    style={{
                                        color: estado.color || 'inherit',
                                    }}
                                >
                                    {cantidad}
                                </div>

                                {/* Nombre del estado */}
                                <div className="text-xs text-muted-foreground mt-1 truncate">{estado.nombre}</div>

                                {/* Porcentaje */}
                                <div className="text-xs font-semibold mt-2 opacity-70">{porcentaje}%</div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
