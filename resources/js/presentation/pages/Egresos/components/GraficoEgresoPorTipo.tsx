interface GraficoEgresoPorTipoProps {
    datos: Array<{
        tipo_operacion: string;
        codigo: string;
        total: number;
        cantidad: number;
        promedio: number;
    }>;
}

const COLORES_TIPO = {
    'GASTOS': 'bg-red-500',
    'COMPRA': 'bg-orange-500',
    'PAGO_SUELDO': 'bg-purple-500',
    'ANTICIPO': 'bg-pink-500',
    'AJUSTE': 'bg-yellow-500',
    'INGRESO_EXTRA': 'bg-green-500',
};

export default function GraficoEgresoPorTipo({ datos }: GraficoEgresoPorTipoProps) {
    if (!datos || datos.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                    No hay datos de tipos de operación disponibles
                </p>
            </div>
        );
    }

    const total = datos.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="space-y-6">
            <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    📊 Egresos por Tipo de Operación
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Total: Bs. {total.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>

            <div className="space-y-4">
                {datos.map((item, index) => {
                    const porcentaje = (item.total / total) * 100;
                    const colorBg = (COLORES_TIPO as any)[item.codigo] || 'bg-gray-500';

                    return (
                        <div key={index} className="space-y-2">
                            {/* Header: Tipo y Porcentaje */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {item.tipo_operacion}
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
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <div
                                    className={`h-3 rounded-full ${colorBg} transition-all duration-300 shadow-sm`}
                                    style={{ width: `${porcentaje}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Leyenda de códigos */}
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                {['GASTOS', 'COMPRA', 'PAGO_SUELDO', 'ANTICIPO'].map((codigo) => (
                    <div key={codigo} className="flex items-center gap-2 text-xs">
                        <div className={`w-3 h-3 rounded ${(COLORES_TIPO as any)[codigo] || 'bg-gray-500'}`}></div>
                        <span className="text-gray-600 dark:text-gray-400">
                            {codigo.replace(/_/g, ' ')}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
