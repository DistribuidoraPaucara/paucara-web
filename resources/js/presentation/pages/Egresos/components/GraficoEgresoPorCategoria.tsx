interface GraficoEgresoPorCategoriaProps {
    datos: Array<{
        categoria: string;
        total: number;
        cantidad: number;
        promedio: number;
    }>;
}

export default function GraficoEgresoPorCategoria({ datos }: GraficoEgresoPorCategoriaProps) {
    if (!datos || datos.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                    No hay datos de categorías disponibles
                </p>
            </div>
        );
    }

    const total = datos.reduce((sum, item) => sum + item.total, 0);
    const maxTotal = Math.max(...datos.map(d => d.total));

    const colores = [
        'bg-red-500',
        'bg-orange-500',
        'bg-yellow-500',
        'bg-green-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
    ];

    return (
        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🏷️ Egresos por Categoría
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Total: Bs. {total.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>

            <div className="space-y-4">
                {datos.map((item, index) => {
                    const porcentaje = (item.total / total) * 100;
                    const colorBg = colores[index % colores.length];

                    return (
                        <div key={index} className="space-y-2">
                            {/* Header: Categoría y Porcentaje */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {item.categoria.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {item.cantidad} movimiento{item.cantidad !== 1 ? 's' : ''} • Promedio: Bs. {item.promedio.toFixed(2)}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900 dark:text-white">
                                        Bs. {item.total.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {porcentaje.toFixed(1)}%
                                    </p>
                                </div>
                            </div>

                            {/* Barra de progreso */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                <div
                                    className={`h-2.5 rounded-full ${colorBg} transition-all duration-300`}
                                    style={{ width: `${porcentaje}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
