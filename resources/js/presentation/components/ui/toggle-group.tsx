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
                    const bgColorOpacity = bgColor + '30'; // 30% opacity para fallback

                    const selectedStyle = {
                        backgroundColor: bgColor,
                        borderColor: bgColor,
                        boxShadow: `0 10px 15px -3px ${bgColorOpacity}`,
                    } as React.CSSProperties;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => !disabled && onChange(option.value)}
                            disabled={disabled}
                            style={isSelected ? selectedStyle : {}}
                            className={`
                                px-2 py-1 rounded-lg font-medium text-sm
                                transition-all duration-200 ease-in-out
                                border-2 flex items-center gap-2 whitespace-nowrap
                                ${
                                    isSelected
                                        ? 'text-white shadow-lg'
                                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                                }
                                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}
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
