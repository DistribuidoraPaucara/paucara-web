import PoliticaPagoSelector from './PoliticaPagoSelector';
import DireccionesClienteSelector, { type Direccion } from './DireccionesClienteSelector';
import PreventistaSelector, { type Preventista } from './PreventistaSelector';
import EntregaSearchSelector from '@/presentation/components/entregas/EntregaSearchSelector';
import type { Cliente } from '@/domain/entities/clientes';

type PoliticaPago = 'CONTRA_ENTREGA' | 'ANTICIPADO_100';

interface DetallesEnvioPanelProps {
  // Visibilidad
  visible: boolean;

  // Política de Pago
  politicaPago: PoliticaPago;
  onPoliticaPagoChange: (value: PoliticaPago) => void;

  // Direcciones
  clienteSeleccionado: Cliente | null;
  direccionesDisponibles: Direccion[];
  cargandoDirecciones: boolean;
  direccionClienteId: number | null;
  onDireccionChange: (id: number) => void;

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
  clienteSeleccionado,
  direccionesDisponibles,
  cargandoDirecciones,
  direccionClienteId,
  onDireccionChange,
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
    'auto': 'grid-cols-1 sm:grid-cols-auto gap-3',
    '1': 'grid-cols-1 gap-3',
    '2': 'grid-cols-1 sm:grid-cols-2 gap-3',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3',
  }[gridCols];

  return (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-zinc-700">
      <h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
        🚚 Detalles de Envío
      </h3>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800 space-y-4">
        {/* Grid con selectores */}
        <div className={`grid ${gridColsClass}`}>
          {/* Política de Pago */}
          {showPoliticaPago && (
            <div>
              <PoliticaPagoSelector
                value={politicaPago}
                onChange={onPoliticaPagoChange}
                label="💳 Política de Pago"
              />
            </div>
          )}

          {/* Preventista */}
          {showPreventista && (
            <div className="border-t border-blue-200 dark:border-blue-800 pt-3 sm:border-t-0 sm:pt-0">
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
            <div className="border-t border-blue-200 dark:border-blue-800 pt-3 sm:border-t-0 sm:pt-0">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🚚 Asignar a Entrega (Opcional)
              </label>
              <EntregaSearchSelector
                value={entregaId}
                onValueChange={(value) => onEntregaChange(value ? Number(value) : null)}
              />
              <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
                ℹ️ Asigna esta venta a una entrega existente (opcional)
              </p>
            </div>
          )}
        </div>

        {/* Direcciones (ancho completo) */}
        {showDirecciones && clienteSeleccionado && (
          <div className="border-t border-blue-200 dark:border-blue-800 pt-4 mt-4">
            <DireccionesClienteSelector
              direcciones={direccionesDisponibles}
              selectedId={direccionClienteId}
              onSelect={onDireccionChange}
              cargando={cargandoDirecciones}
              label="📍 Dirección de Entrega"
              mostrarClienteRequired={false}
            />
          </div>
        )}

        {/* Info footer */}
        <p className="text-xs text-blue-700 dark:text-blue-300 pt-2 border-t border-blue-200 dark:border-blue-800">
          ℹ️ Los datos del cliente se pre-rellenan automáticamente. Modifica si es necesario.
        </p>
      </div>
    </div>
  );
}
