import { Label } from '@/presentation/components/ui/label';

type ColorScheme = 'green' | 'blue' | 'red';

interface RequiereEnvioToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
  colorScheme?: ColorScheme;
  disabled?: boolean;
}

const colorConfig: Record<ColorScheme, { active: string; inactive: string; hoverActive: string; hoverInactive: string }> = {
  green: {
    active: 'border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 shadow-sm',
    inactive: 'border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 shadow-sm',
    hoverActive: 'hover:border-green-300 dark:hover:border-green-700',
    hoverInactive: 'hover:border-red-300 dark:hover:border-red-700',
  },
  blue: {
    active: 'border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 shadow-sm',
    inactive: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400',
    hoverActive: 'hover:border-blue-300 dark:hover:border-blue-700',
    hoverInactive: 'hover:border-blue-300 dark:hover:border-blue-700',
  },
  red: {
    active: 'border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 shadow-sm',
    inactive: 'border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400',
    hoverActive: 'hover:border-red-300 dark:hover:border-red-700',
    hoverInactive: 'hover:border-gray-300 dark:hover:border-gray-600',
  },
};

export default function RequiereEnvioToggle({
  value,
  onChange,
  label = '🚚 Requiere Envío',
  colorScheme = 'green',
  disabled = false,
}: RequiereEnvioToggleProps) {
  const colors = colorConfig[colorScheme];

  const getButtonClass = (isActive: boolean) => {
    const baseClass = 'flex-1 px-3 py-1.5 rounded-lg border-2 font-semibold text-xs transition-all';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    if (isActive) {
      return `${baseClass} ${colors.active} ${disabledClass}`;
    } else {
      return `${baseClass} border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 ${colors.hoverInactive} ${disabledClass}`;
    }
  };

  const getYesButtonClass = () => {
    const baseClass = 'flex-1 px-3 py-1.5 rounded-lg border-2 font-semibold text-xs transition-all';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    if (value) {
      return `${baseClass} ${colors.active} ${disabledClass}`;
    } else {
      return `${baseClass} border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 ${colors.hoverActive} ${disabledClass}`;
    }
  };

  const getNoButtonClass = () => {
    const baseClass = 'flex-1 px-3 py-1.5 rounded-lg border-2 font-semibold text-xs transition-all';
    const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

    if (!value) {
      return `${baseClass} ${colors.inactive} ${disabledClass}`;
    } else {
      return `${baseClass} border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-400 ${colors.hoverInactive} ${disabledClass}`;
    }
  };

  return (
    <div>
      <Label className="text-sm font-medium mb-2 block">
        {label}
      </Label>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => !disabled && onChange(true)}
          disabled={disabled}
          className={getYesButtonClass()}
        >
          ✅ Sí
        </button>
        <button
          type="button"
          onClick={() => !disabled && onChange(false)}
          disabled={disabled}
          className={getNoButtonClass()}
        >
          ❌ No
        </button>
      </div>
    </div>
  );
}
