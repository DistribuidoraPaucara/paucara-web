import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Trophy, Zap, User } from 'lucide-react';
import type { TopChofer } from '@/application/hooks/use-entregas-dashboard-stats';

interface TopChoferesProps {
    choferes: TopChofer[];
    loading: boolean;
}

export function TopChoferes({ choferes, loading }: TopChoferesProps) {
    if (loading) {
        return (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Top 5 Choferes</h3>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                    {[...Array(5)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardHeader className="pb-2">
                                <div className="h-4 bg-muted rounded w-20"></div>
                            </CardHeader>
                            <CardContent>
                                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (!choferes || choferes.length === 0) {
        return (
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Top 5 Choferes</h3>
                <Card>
                    <CardContent className="pt-6 text-center text-muted-foreground">
                        No hay datos de choferes disponibles
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getEficienciaBadge = (eficiencia: number) => {
        if (eficiencia >= 95) return 'bg-green-100 text-green-800';
        if (eficiencia >= 85) return 'bg-blue-100 text-blue-800';
        if (eficiencia >= 75) return 'bg-yellow-100 text-yellow-800';
        return 'bg-orange-100 text-orange-800';
    };

    return (
        <div className="space-y-2">
            <h3 className="text-lg font-semibold">Top 5 Choferes</h3>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                {choferes.map((chofer, index) => (
                    <Card
                        key={chofer.chofer_id}
                        className="hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                        {/* Badge de posición */}
                        {index < 3 && (
                            <div className="absolute top-2 right-2">
                                <Trophy
                                    className={`h-5 w-5 ${
                                        index === 0
                                            ? 'text-yellow-500'
                                            : index === 1
                                            ? 'text-gray-400'
                                            : 'text-orange-500'
                                    }`}
                                />
                            </div>
                        )}

                        <CardHeader className="pb-2">
                            <div className="flex items-start gap-2">
                                <User className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                    <CardTitle className="text-sm font-medium truncate">
                                        {chofer.nombre}
                                    </CardTitle>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {chofer.email}
                                    </p>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-2">
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Entregas Completadas
                                </p>
                                <p className="text-2xl font-bold text-green-600">
                                    {chofer.entregas_completadas}
                                </p>
                            </div>

                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                    Eficiencia
                                </p>
                                <div className="flex items-center gap-2">
                                    <Zap className="h-3 w-3 text-blue-600" />
                                    <Badge
                                        variant="secondary"
                                        className={`text-xs font-semibold ${getEficienciaBadge(
                                            chofer.eficiencia_porcentaje
                                        )}`}
                                    >
                                        {chofer.eficiencia_porcentaje}%
                                    </Badge>
                                </div>
                            </div>

                            <div className="text-xs text-muted-foreground pt-1 border-t">
                                <p>
                                    Total: {chofer.entregas_total} entregas
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
