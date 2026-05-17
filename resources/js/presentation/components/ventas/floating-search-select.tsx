import React from 'react';
import SearchSelect from '@/presentation/components/ui/search-select';

interface FloatingSearchSelectProps {
    id: string;
    label: string;
    placeholder: string;
    value: string | number;
    options: Array<{ value: string | number; label: string }>;
    onChange: (value: string | number | null) => void;
    allowClear?: boolean;
    icon?: React.ReactNode;
}

export default function FloatingSearchSelect({
    id,
    label,
    placeholder,
    value,
    options,
    onChange,
    allowClear = true,
    icon,
}: FloatingSearchSelectProps) {
    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 z-10">
                {icon}
            </div>
            <div className="relative pl-10 w-full">
                <SearchSelect
                    id={id}
                    placeholder={placeholder}
                    value={value || ''}
                    options={options}
                    onChange={onChange}
                    allowClear={allowClear}
                />
            </div>
            <label
                htmlFor={id}
                className="absolute left-10 -top-3 px-1 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-zinc-900 transition-all pointer-events-none"
            >
                {label}
            </label>
        </div>
    );
}
