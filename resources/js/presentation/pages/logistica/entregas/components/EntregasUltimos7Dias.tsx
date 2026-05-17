import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { UltimoDia } from '@/application/hooks/use-entregas-dashboard-stats';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface EntregasUltimos7DiasProps {
    datos: UltimoDia[];
    loading: boolean;
}

export function EntregasUltimos7Dias({
    datos,
    loading,
}: EntregasUltimos7DiasProps) {
    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        Entregas - Últimos 7 Días
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-muted-foreground">Cargando...</div>
                </CardContent>
            </Card>
        );
    }

    if (!datos || datos.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        Entregas - Últimos 7 Días
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-80 flex items-center justify-center">
                    <div className="text-muted-foreground">
                        No hay datos disponibles
                    </div>
                </CardContent>
            </Card>
        );
    }

    const chartData = {
        labels: datos.map((d) => `${d.dia} ${d.fecha.split('-').slice(1).join('/')}`),
        datasets: [
            {
                label: 'Entregas Completadas',
                data: datos.map((d) => d.entregas),
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top' as const,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm font-medium">
                    Entregas - Últimos 7 Días
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <Line
                        data={chartData}
                        options={options}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
