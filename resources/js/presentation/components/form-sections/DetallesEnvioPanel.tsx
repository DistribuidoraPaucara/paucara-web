import type { Cliente } from '@/domain/entities/clientes';
import EntregaSearchSelector from '@/presentation/components/entregas/EntregaSearchSelector';
import DireccionesClienteSelector, { type Direccion } from './DireccionesClienteSelector';
import PoliticaPagoSelector from './PoliticaPagoSelector';
import PreventistaSelector, { type Preventista } from './PreventistaSelector';

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
    gridCols?: 'auto' | '1' | '2' | '3' | '4';
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
}: DetallesEnvioPanelProps) {
    if (!visible) {
        return null;
    }

    const gridColsClass = {
        auto: 'grid-cols-1 sm:grid-cols-auto gap-3',
        '1': 'grid-cols-1 gap-3',
        '2': 'grid-cols-1 sm:grid-cols-2 gap-3',
        '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3',
        '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3',
    }[gridCols];

    return (
        <div className="mt-2 border-t border-gray-200 pt-2 dark:border-zinc-700">
            <h3 className="text-md mb-4 font-medium text-gray-900 dark:text-white">🚚 Detalles de Envío</h3>

            <div className="space-y-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                {/* Grid con selectores */}
                <div className={`grid ${gridColsClass}`}>
                    {/* Política de Pago */}
                    {showPoliticaPago && (
                        <div>
                            <PoliticaPagoSelector
                                value={politicaPago}
                                onChange={onPoliticaPagoChange}
                                label="💳 Política de Pago"
                                puedeTenerCredito={puedeTenerCredito}
                            />
                        </div>
                    )}

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
                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">🚚 Asignar a Entrega (Opcional)</label>
                            <EntregaSearchSelector value={entregaId} onValueChange={(value) => onEntregaChange(value ? Number(value) : null)} />
                            <p className="mt-2 text-xs text-blue-700 dark:text-blue-300">ℹ️ Asigna esta venta a una entrega existente (opcional)</p>
                        </div>
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
