import { Button } from '@/presentation/components/ui/button';
import { BarChart3, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
    view: 'simple' | 'dashboard';
    onChangeView: (view: 'simple' | 'dashboard') => void;
}

/**
 * Header con toggle de vista (simple/dashboard)
 * Permite cambiar instantáneamente entre las dos vistas sin recargar
 */
export function EntregasHeader({ view, onChangeView }: Props) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                    {view === 'simple' ? '📋 Entregas' : '📊 Dashboard de Entregas'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                    {view === 'simple'
                        ? 'Gestiona y visualiza el listado completo de entregas'
                        : 'Visualización completa de estadísticas de entregas y rendimiento'}
                </p>
            </div>

            {/* Toggle de Vista */}
            <div className="flex gap-2 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-lg border border-slate-200 dark:border-slate-700/50">
                <Button
                    variant={view === 'simple' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onChangeView('simple')}
                    className={cn(
                        'transition-all duration-200',
                        view === 'simple'
                            ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-50'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    )}
                >
                    <List className="h-4 w-4 mr-2" />
                    Vista Simple
                </Button>
                <Button
                    variant={view === 'dashboard' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onChangeView('dashboard')}
                    className={cn(
                        'transition-all duration-200',
                        view === 'dashboard'
                            ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-slate-50'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/30'
                    )}
                >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                </Button>
            </div>
        </div>
    );
}
