import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    ChartData,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface ChartWrapperProps {
    title: string;
    type: 'line' | 'doughnut' | 'bar';
    data: ChartData<'line'> | ChartData<'bar'> | ChartData<'doughnut'>;
    className?: string;
    loading?: boolean;
    height?: number;
}

export function ChartWrapper({
    title,
    type,
    data,
    className = '',
    loading = false,
    height = 300,
}: ChartWrapperProps) {
    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
                labels: {
                    color: 'rgb(115 115 115)',
                    font: {
                        size: 12,
                    },
                    usePointStyle: true,
                    pointStyle: 'circle',
                },
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderColor: 'rgba(255, 255, 255, 0.1)',
                borderWidth: 1,
            },
        },
        scales: type !== 'doughnut' ? {
            x: {
                grid: {
                    color: 'rgba(115, 115, 115, 0.1)',
                },
                ticks: {
                    color: 'rgb(115 115 115)',
                },
            },
            y: {
                grid: {
                    color: 'rgba(115, 115, 115, 0.1)',
                },
                ticks: {
                    color: 'rgb(115 115 115)',
                },
            },
        } : undefined,
    };

    const renderChart = () => {
        switch (type) {
            case 'line':
                return <Line data={data as ChartData<'line'>} options={defaultOptions} />;
            case 'bar':
                return <Bar data={data as ChartData<'bar'>} options={defaultOptions} />;
            case 'doughnut':
                return <Doughnut data={data as ChartData<'doughnut'>} options={defaultOptions} />;
            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className={`rounded-lg border border-sidebar-border/70 bg-sidebar p-6 dark:border-sidebar-border ${className}`}>
                <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {title}
                </h3>
                <div className="animate-pulse">
                    <div className="flex h-72 items-center justify-center rounded bg-neutral-200 dark:bg-neutral-700">
                        <span className="text-neutral-500 dark:text-neutral-400">
                            Cargando gráfico...
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-lg border border-sidebar-border/70 bg-sidebar p-6 dark:border-sidebar-border ${className}`}>
            <h3 className="mb-4 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {title}
            </h3>
            <div style={{ height: `${height}px` }}>
                {renderChart()}
            </div>
        </div>
    );
}
