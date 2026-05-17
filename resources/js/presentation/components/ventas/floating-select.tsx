import React from 'react';

interface FloatingSelectProps {
    id: string;
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    children: React.ReactNode;
    icon?: React.ReactNode;
    title?: string;
}

export default function FloatingSelect({
    id,
    label,
    value,
    onChange,
    children,
    icon,
    title,
}: FloatingSelectProps) {
    return (
        <div className="relative">
            <select
                id={id}
                value={value}
                onChange={onChange}
                title={title}
                className="peer w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-zinc-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-800 dark:text-white appearance-none transition-all"
            >
                {children}
            </select>
            {icon && (
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 peer-focus:text-blue-600 dark:peer-focus:text-blue-400 transition-colors">
                    {icon}
                </div>
            )}
            <label
                htmlFor={id}
                className="absolute left-10 -top-3 px-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-900 peer-focus:-top-3 peer-focus:text-blue-600 dark:peer-focus:text-blue-400 transition-all pointer-events-none"
            >
                {label}
            </label>
        </div>
    );
}
