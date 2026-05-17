import { AlertTriangle, Clock, Package, Archive } from 'lucide-react';
import { Card, CardContent } from '@/presentation/components/ui/card';

interface ReservasStatsProps {
    stats: {
        total_activas: number;
        inconsistentes: number;
        proximas_expirar: number;
        stock_bloqueado: number;
    };
}

export default function ReservasStats({ stats }: ReservasStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Activas */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Activas</p>
                            <p className="text-2xl font-bold mt-2">{stats.total_activas}</p>
                        </div>
                        <Package className="w-8 h-8 text-blue-500 opacity-50" />
                    </div>
                </CardContent>
            </Card>

            {/* Inconsistentes */}
            <Card className={stats.inconsistentes > 0 ? 'border-red-200 dark:border-red-900' : ''}>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Inconsistentes</p>
                            <p className={`text-2xl font-bold mt-2 ${stats.inconsistentes > 0 ? 'text-red-600' : ''}`}>
                                {stats.inconsistentes}
                            </p>
                            {stats.inconsistentes > 0 && (
                                <p className="text-xs text-red-600 mt-1">Requieren atención</p>
                            )}
                        </div>
                        <AlertTriangle className={`w-8 h-8 ${stats.inconsistentes > 0 ? 'text-red-500' : 'text-muted opacity-50'}`} />
                    </div>
                </CardContent>
            </Card>

            {/* Próximas a Expirar */}
            <Card className={stats.proximas_expirar > 0 ? 'border-yellow-200 dark:border-yellow-900' : ''}>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Próximas a Expirar</p>
                            <p className={`text-2xl font-bold mt-2 ${stats.proximas_expirar > 0 ? 'text-yellow-600' : ''}`}>
                                {stats.proximas_expirar}
                            </p>
                            {stats.proximas_expirar > 0 && (
                                <p className="text-xs text-yellow-600 mt-1">&lt; 24 horas</p>
                            )}
                        </div>
                        <Clock className={`w-8 h-8 ${stats.proximas_expirar > 0 ? 'text-yellow-500' : 'text-muted opacity-50'}`} />
                    </div>
                </CardContent>
            </Card>

            {/* Stock Bloqueado */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Stock Bloqueado</p>
                            <p className="text-2xl font-bold mt-2">{stats.stock_bloqueado}</p>
                            <p className="text-xs text-muted-foreground mt-1">unidades</p>
                        </div>
                        <Archive className="w-8 h-8 text-purple-500 opacity-50" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
