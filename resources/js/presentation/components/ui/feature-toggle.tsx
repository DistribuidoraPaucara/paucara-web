import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';

interface FeatureToggleProps {
    id: string;
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    icon: string;
    title: string;
    description: string;
    hint?: string;
    additionalContent?: React.ReactNode;
    colorScheme?: 'orange' | 'purple' | 'green' | 'blue';
}

const colorSchemes = {
    orange: {
        border: 'border-orange-200 dark:border-orange-700',
        bg: 'from-orange-50 to-pink-50 dark:from-orange-950/30 dark:to-pink-950/30',
    },
    purple: {
        border: 'border-purple-200 dark:border-purple-700',
        bg: 'from-purple-50 to-violet-50 dark:from-purple-950/30 dark:to-violet-950/30',
    },
    green: {
        border: 'border-green-200 dark:border-green-800',
        bg: 'from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30',
    },
    blue: {
        border: 'border-blue-200 dark:border-blue-700',
        bg: 'from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30',
    },
};

export function FeatureToggle({
    id,
    checked,
    onCheckedChange,
    icon,
    title,
    description,
    hint,
    additionalContent,
    colorScheme = 'blue',
}: FeatureToggleProps) {
    const colors = colorSchemes[colorScheme];

    const tooltipContent = (
        <div className="space-y-1 max-w-xs">
            <p className="text-xs font-medium leading-relaxed">{description}</p>
            {hint && <p className="text-xs opacity-90">💡 {hint}</p>}
        </div>
    );

    return (
        <div className={`mt-1 space-y-3 rounded-lg border-2 ${colors.border} bg-gradient-to-r ${colors.bg} p-2 shadow-sm`}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    <label htmlFor={id} className="flex cursor-pointer items-center gap-2 text-base font-semibold flex-1 min-w-0">
                        <span className="flex-shrink-0">{icon}</span>
                        <span className="truncate text-xs">{title}</span>
                    </label>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <button type="button" className="flex-shrink-0 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-400 text-gray-600 hover:border-gray-500 hover:text-gray-700 dark:border-gray-500 dark:text-gray-400 dark:hover:border-gray-400 dark:hover:text-gray-300 transition-colors">
                                <span className="text-xs font-bold">?</span>
                            </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-xs text-xs">
                            {tooltipContent}
                        </TooltipContent>
                    </Tooltip>
                </div>
                <button
                    type="button"
                    id={id}
                    onClick={() => onCheckedChange(!checked)}
                    className={`flex-shrink-0 relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${
                        checked
                            ? 'bg-emerald-500 hover:bg-emerald-600'
                            : 'bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700'
                    }`}
                    role="switch"
                    aria-checked={checked}
                >
                    <span
                        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
                            checked ? 'translate-x-6' : 'translate-x-0.5'
                        }`}
                    />
                </button>
            </div>
            {additionalContent && checked && (
                <div className="mt-3 ml-0 rounded-md bg-gray-50 p-3 shadow-sm dark:bg-slate-800/50 border-l-4 border-gray-300 dark:border-gray-600">
                    <div className="text-sm">{additionalContent}</div>
                </div>
            )}
        </div>
    );
}
