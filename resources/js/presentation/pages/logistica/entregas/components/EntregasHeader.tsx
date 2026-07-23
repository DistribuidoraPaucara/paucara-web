import { Button } from '@/presentation/components/ui/button';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

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
                <p className="mt-1 text-slate-600 dark:text-slate-400">
                    {view === 'simple'
                        ? 'Gestiona y visualiza el listado completo de entregas'
                        : 'Visualización completa de estadísticas de entregas y rendimiento'}
                </p>
            </div>
            <Link href="/logistica/entregas/create" className="ml-auto">
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Crear Entrega
                </Button>
            </Link>
        </div>
    );
}
