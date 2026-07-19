import { Label } from '@/presentation/components/ui/label';

type PoliticaPago = 'CONTRA_ENTREGA' | 'ANTICIPADO_100' | 'CREDITO';

interface PoliticaPagoSelectorProps {
  value: PoliticaPago;
  onChange: (value: PoliticaPago) => void;
  label?: string;
  disabled?: boolean;
  showDescriptions?: boolean;
  // ✅ NUEVO (2026-07-18): Habilitar/deshabilitar opción CREDITO según cliente.puede_tener_credito
  puedeTenerCredito?: boolean;
}

interface OpcionPolitica {
  value: PoliticaPago;
  label: string;
  description: string;
  icon: string;
}

export default function PoliticaPagoSelector({
  value,
  onChange,
  label = '💳 Política de Pago',
  disabled = false,
  showDescriptions = true,
  puedeTenerCredito = false,
}: PoliticaPagoSelectorProps) {
  const opciones: OpcionPolitica[] = [
    {
      value: 'CONTRA_ENTREGA',
      label: 'Contra Entrega',
      description: 'Al recibir',
      icon: '📦',
    },
    {
      value: 'ANTICIPADO_100',
      label: 'Anticipado 100%',
      description: 'Antes de enviar',
      icon: '💰',
    },
    ...(puedeTenerCredito
      ? [
          {
            value: 'CREDITO' as PoliticaPago,
            label: 'Crédito',
            description: 'A cuenta corriente',
            icon: '💳',
          },
        ]
      : []),
  ];

  const opcionSeleccionada = opciones.find((op) => op.value === value);

  return (
    <div>
      <Label htmlFor="politica-pago" className="text-sm font-medium mb-2 block">
        {label}
      </Label>
      <select
        id="politica-pago"
        value={value}
        onChange={(e) => onChange(e.target.value as PoliticaPago)}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white text-sm font-medium"
      >
        <option value="">-- Selecciona una política de pago --</option>
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.icon} {opcion.label} ({opcion.description})
          </option>
        ))}
      </select>
      {showDescriptions && opcionSeleccionada && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
          {opcionSeleccionada.icon} {opcionSeleccionada.description}
        </p>
      )}
    </div>
  );
}
