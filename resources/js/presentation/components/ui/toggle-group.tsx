import React from 'react';

interface ToggleOption {
    value: string;
    label: string;
    icon?: string | null;
    color?: string | null; // Hex color for styling
}

interface ToggleGroupProps {
    options: ToggleOption[];
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    label?: string;
    required?: boolean;
    description?: string;
}

export default function ToggleGroup({
    options,
    value,
    onChange,
    disabled = false,
    label,
    required = false,
    description,
}: ToggleGroupProps) {
    // 🔍 DEBUG: Mostrar opciones y cambios en consola
    React.useEffect(() => {
        console.log('🎛️ [ToggleGroup] Opciones renderizadas:', {
            label,
            total_opciones: options.length,
            opciones_detalle: options.map(opt => ({
                value: opt.value,
                label: opt.label,
                icon: opt.icon,
                color: opt.color,
            })),
            valor_seleccionado: value,
        });
    }, [options, value, label]);

    return (
        <div className="space-y-1">
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="flex gap-2 flex-wrap">
                {options.map((option) => {
                    const isSelected = value === option.value;
                    const bgColor = option.color || '#2563eb'; // Fallback a azul
                    const bgColorOpacity20 = bgColor + '20'; // 20% opacity para fondo no seleccionado
                    const bgColorOpacity30 = bgColor + '30'; // 30% opacity para fallback

                    const selectedStyle = {
                        backgroundColor: bgColor,
                        borderColor: bgColor,
                        boxShadow: `0 10px 15px -3px ${bgColorOpacity30}`,
                    } as React.CSSProperties;

                    const unselectedStyle = {
                        backgroundColor: bgColorOpacity20,
                        borderColor: bgColor,
                    } as React.CSSProperties;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                                if (!disabled) {
                                    console.log('✅ [ToggleGroup] Opción seleccionada:', {
                                        value: option.value,
                                        label: option.label,
                                        color: option.color,
                                        icon: option.icon,
                                    });
                                    onChange(option.value);
                                }
                            }}
                            disabled={disabled}
                            style={isSelected ? selectedStyle : unselectedStyle}
                            className={`
                                px-3 py-1.5 rounded-lg font-medium text-sm
                                transition-all duration-200 ease-in-out
                                border-2 flex items-center gap-2 whitespace-nowrap
                                ${
                                    isSelected
                                        ? 'text-white shadow-lg scale-105'
                                        : 'hover:shadow-md hover:scale-105'
                                }
                                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                                disabled:opacity-50 disabled:cursor-not-allowed
                            `}
                        >
                            {option.icon && <span className="text-lg">{option.icon}</span>}
                            {option.label}
                        </button>
                    );
                })}
            </div>

            {description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic">{description}</p>
            )}
        </div>
    );
}
