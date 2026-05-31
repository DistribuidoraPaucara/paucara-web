import React from 'react';

interface CustomCheckboxProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    label: string;
    icon?: string;
    description?: string;
    variant?: 'default' | 'highlight';
}

export default function CustomCheckbox({
    id,
    checked,
    onChange,
    disabled = false,
    label,
    icon,
    description,
    variant = 'default',
}: CustomCheckboxProps) {
    const isHighlight = variant === 'highlight';

    return (
        <div className={`space-y-1 ${isHighlight ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
            <div className="flex items-center gap-3">
                <div className="relative flex items-center">
                    <input
                        type="checkbox"
                        id={id}
                        checked={checked}
                        onChange={(e) => !disabled && onChange(e.target.checked)}
                        disabled={disabled}
                        className="sr-only"
                    />
                    <div
                        className={`
                            w-5 h-5 rounded border-2 flex items-center justify-center
                            transition-all duration-200 ease-in-out
                            ${
                                checked
                                    ? 'bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/30'
                                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                            }
                            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer group-hover:border-blue-400'}
                        `}
                    >
                        {checked && (
                            <svg
                                className="w-3 h-3 text-white animate-in fade-in duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        )}
                    </div>
                </div>

                <label
                    htmlFor={id}
                    className={`flex items-center gap-2 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                    {icon && <span className="text-lg">{icon}</span>}
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
                </label>
            </div>

            {description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 italic ml-8">{description}</p>
            )}
        </div>
    );
}
