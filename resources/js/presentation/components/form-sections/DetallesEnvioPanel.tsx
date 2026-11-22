import type { Cliente } from '@/domain/entities/clientes';
import EntregaSearchSelector from '@/presentation/components/entregas/EntregaSearchSelector';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Info } from 'lucide-react';
import DireccionesClienteSelector, { type Direccion } from './DireccionesClienteSelector';
import PreventistaSelector, { type Preventista } from './PreventistaSelector';

// Fecha, turno y horario de entrega (se muestran dentro del panel, en la misma cuadrícula)
export interface FechaEntregaCampos {
    fecha: string;
    onFechaChange: (valor: string) => void;
    turno: string;
    onTurnoChange: (valor: string) => void;
    // Hora de referencia (un solo horario, no un rango)
    hora: string;
    onHoraChange: (valor: string) => void;
}

type PoliticaPago = 'CONTRA_ENTREGA' | 'ANTICIPADO_100' | 'CREDITO';

interface DetallesEnvioPanelProps {
    // Visibilidad
    visible: boolean;

    // Política de Pago
    politicaPago: PoliticaPago;
    onPoliticaPagoChange: (value: PoliticaPago) => void;

    // ✅ NUEVO (2026-07-18): Estado del cliente para habilitar/deshabilitar CREDITO
    puedeTenerCredito?: boolean;

    // Direcciones
    clienteSeleccionado: Cliente | null;
    direccionesDisponibles: Direccion[];
    cargandoDirecciones: boolean;
    direccionClienteId: number | null;
    onDireccionChange: (id: number) => void;
    // ✅ NUEVO (2026-07-18): Callback para mostrar dirección en mapa
    onShowDireccionMapa?: () => void;

    // Preventista
    preventistas: Preventista[];
    cargandoPrevenstitas: boolean;
    preventistaId: number | null;
    onPreventistaChange: (id: number | null) => void;

    // Entrega
    entregaId: number | null;
    onEntregaChange: (id: number | null) => void;

    // Opciones
    showPoliticaPago?: boolean;
    showDirecciones?: boolean;
    showPreventista?: boolean;
    showEntrega?: boolean;
    gridCols?: 'auto' | '1' | '2' | '3' | '4' | '5' | '6';

    // Fecha y turno de entrega (opcional)
    fechaEntrega?: FechaEntregaCampos;
}

export default function DetallesEnvioPanel({
    visible,
    politicaPago,
    onPoliticaPagoChange,
    puedeTenerCredito = false,
    clienteSeleccionado,
    direccionesDisponibles,
    cargandoDirecciones,
    direccionClienteId,
    onDireccionChange,
    onShowDireccionMapa, // ✅ NUEVO (2026-07-18): Callback para mostrar mapa
    preventistas,
    cargandoPrevenstitas,
    preventistaId,
    onPreventistaChange,
    entregaId,
    onEntregaChange,
    showPoliticaPago = true,
    showDirecciones = true,
    showPreventista = true,
    showEntrega = true,
    gridCols = '2',
    fechaEntrega,
}: DetallesEnvioPanelProps) {
    if (!visible) {
        return null;
    }

    // Rango de horas permitido según el turno de entrega
    const rangoHoraEntrega = fechaEntrega?.turno === 'manana'
        ? { min: '08:00', max: '12:00' }
        : { min: '14:00', max: '18:00' };
    const horaFueraDeTurno = Boolean(
        fechaEntrega?.hora && fechaEntrega.turno && (fechaEntrega.hora < rangoHoraEntrega.min || fechaEntrega.hora > rangoHoraEntrega.max),
    );

    const gridColsClass = {
        auto: 'grid-cols-1 sm:grid-cols-auto gap-3',
        '1': 'grid-cols-1 gap-3',
        '2': 'grid-cols-1 sm:grid-cols-2 gap-3',
        '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3',
        '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3',
        '5': 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3',
        '6': 'grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3',
    }[gridCols];

    return (
        <div className="mt-2 border-t border-gray-200 pt-2 dark:border-zinc-700">
            <h3 className="text-md font-medium text-gray-900 dark:text-white">🚚 Detalles de Envío</h3>

            <div className="space-y-2 p-2">
                {/* Grid con selectores */}
                <div className={`grid ${gridColsClass} items-end`}>
                    {/* Preventista */}
                    {showPreventista && (
                        <div className="border-t border-blue-200 pt-3 sm:border-t-0 sm:pt-0 dark:border-blue-800">
                            <PreventistaSelector
                                preventistas={preventistas}
                                selectedId={preventistaId}
                                onSelect={onPreventistaChange}
                                cargando={cargandoPrevenstitas}
                                label="👤 Preventista (Opcional)"
                            />
                        </div>
                    )}

                    {/* Entrega */}
                    {showEntrega && (
                        <div className="border-t border-blue-200 pt-3 sm:border-t-0 sm:pt-0 dark:border-blue-800">
                            <div className="mb-2 flex items-center gap-1.5">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">🚚 Asignar a Entrega (Opcional)</label>
                                <span
                                    className="inline-flex cursor-help text-blue-700 dark:text-blue-300"
                                    title="Asigna esta venta a una entrega existente (opcional)"
                                    tabIndex={0}
                                    aria-label="Asigna esta venta a una entrega existente (opcional)"
                                >
                                    <Info className="h-3.5 w-3.5" />
                                </span>
                            </div>
                            <EntregaSearchSelector value={entregaId} onValueChange={(value) => onEntregaChange(value ? Number(value) : null)} />
                        </div>
                    )}

                    {/* Fecha y turno de entrega */}
                    {fechaEntrega && (
                        <>
                            <div>
                                <Label htmlFor="fecha-entrega" className="text-sm">
                                    📅 Fecha Entrega Solicitada
                                </Label>
                                <Input
                                    id="fecha-entrega"
                                    type="date"
                                    value={fechaEntrega.fecha}
                                    onChange={(e) => fechaEntrega.onFechaChange(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="turno-entrega" className="text-sm">
                                    ⏰ Turno de Entrega
                                </Label>
                                <Select value={fechaEntrega.turno} onValueChange={(valor) => fechaEntrega.onTurnoChange(valor)}>
                                    <SelectTrigger id="turno-entrega">
                                        <SelectValue placeholder="Selecciona un turno" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="manana">🌅 Mañana (08:00 - 12:00)</SelectItem>
                                        <SelectItem value="tarde">🌆 Tarde (14:00 - 18:00)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Hora de referencia: solo cuando hay turno */}
                            {fechaEntrega.turno && (
                                <div>
                                    <Label htmlFor="hora-entrega" className="text-sm">
                                        🕐 Hora de referencia
                                    </Label>
                                    <Input
                                        id="hora-entrega"
                                        type="time"
                                        value={fechaEntrega.hora}
                                        onChange={(e) => fechaEntrega.onHoraChange(e.target.value)}
                                        // Evita el globo nativo de validación; el mensaje se muestra debajo del campo
                                        onInvalid={(e) => e.preventDefault()}
                                        min={rangoHoraEntrega.min}
                                        max={rangoHoraEntrega.max}
                                        aria-invalid={horaFueraDeTurno}
                                    />
                                    {horaFueraDeTurno && (
                                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                                            La hora debe estar entre {rangoHoraEntrega.min} y {rangoHoraEntrega.max} ({fechaEntrega.turno === 'manana' ? 'turno mañana' : 'turno tarde'}).
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {/* Direcciones (ancho completo) */}
                    {showDirecciones && clienteSeleccionado && (
                        <div>
                            {/* ✅ NUEVO (2026-07-18): Incluir callback para mostrar dirección en mapa */}
                            <DireccionesClienteSelector
                                direcciones={direccionesDisponibles}
                                selectedId={direccionClienteId}
                                onSelect={onDireccionChange}
                                cargando={cargandoDirecciones}
                                label="📍 Dirección de Entrega"
                                mostrarClienteRequired={false}
                                onShowMap={onShowDireccionMapa}
                            />
                        </div>
                    )}
                </div>

                {/* Info footer */}
                {/* <p className="border-t border-blue-200 pt-2 text-xs text-blue-700 dark:border-blue-800 dark:text-blue-300">
                    ℹ️ Los datos del cliente se pre-rellenan automáticamente. Modifica si es necesario.
                </p> */}
            </div>
        </div>
    );
}
