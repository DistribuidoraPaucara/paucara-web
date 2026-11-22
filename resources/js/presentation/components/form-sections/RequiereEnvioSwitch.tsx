// Interruptor "Requiere envío" con el mismo formato que usa ventas
interface RequiereEnvioSwitchProps {
    value: boolean;
    onChange: (value: boolean) => void;
    disabled?: boolean;
}

export default function RequiereEnvioSwitch({ value, onChange, disabled = false }: RequiereEnvioSwitchProps) {
    return (
        <div className="flex flex-col justify-end gap-2">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    role="switch"
                    aria-checked={value}
                    disabled={disabled}
                    onClick={() => onChange(!value)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50 ${
                        value ? 'bg-green-500 dark:bg-green-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                            value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {value ? '✅ Sí, requiere envío' : '❌ No requiere envío'}
                </span>
            </div>
        </div>
    );
}
