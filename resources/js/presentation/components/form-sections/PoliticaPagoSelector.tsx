import { Label } from '@/presentation/components/ui/label';

type PoliticaPago = 'CONTRA_ENTREGA' | 'ANTICIPADO_100';

interface PoliticaPagoSelectorProps {
  value: PoliticaPago;
  onChange: (value: PoliticaPago) => void;
  label?: string;
  disabled?: boolean;
  showDescriptions?: boolean;
}

export default function PoliticaPagoSelector({
  value,
  onChange,
  label = '💳 Política de Pago',
  disabled = false,
  showDescriptions = true,
}: PoliticaPagoSelectorProps) {
  const getButtonClass = (isActive: boolean) => {
    const baseClass = 'flex-1 min-w-[150px] px-3 py-2 rounded-lg border-2 transition-all font-medium text-sm';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    if (isActive) {
      return `${baseClass} border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-md ${disabledClass}`;
    } else {
      return `${baseClass} border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500 ${disabledClass}`;
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium mb-3 block">
        {label}
      </Label>
      <div className="flex gap-2 flex-wrap">
        {/* Contra Entrega */}
        <button
          type="button"
          onClick={() => !disabled && onChange('CONTRA_ENTREGA')}
          disabled={disabled}
          className={getButtonClass(value === 'CONTRA_ENTREGA')}
        >
          <div className="text-left">
            <p className="font-semibold text-sm">Contra Entrega</p>
            {showDescriptions && <p className="text-xs opacity-75">Al recibir</p>}
          </div>
        </button>

        {/* Anticipado 100% */}
        <button
          type="button"
          onClick={() => !disabled && onChange('ANTICIPADO_100')}
          disabled={disabled}
          className={getButtonClass(value === 'ANTICIPADO_100')}
        >
          <div className="text-left">
            <p className="font-semibold text-sm">Anticipado 100%</p>
            {showDescriptions && <p className="text-xs opacity-75">Antes de enviar</p>}
          </div>
        </button>
      </div>
    </div>
  );
}
