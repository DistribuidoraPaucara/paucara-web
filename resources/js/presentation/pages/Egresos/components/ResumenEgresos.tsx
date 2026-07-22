interface ResumenEgresosProps {
    totales: {
        total: number;
        cantidad: number;
        promedio: number;
    };
}

export default function ResumenEgresos({ totales }: ResumenEgresosProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                💰 Resumen de Egresos
            </h3>

            <div className="grid grid-cols-1 gap-4">
                {/* Total de Egresos */}
                <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/10 border border-red-200 dark:border-red-700 rounded-lg p-4">
                    <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                        Total de Egresos
                    </p>
                    <p className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">
                        Bs. {totales.total.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>

                {/* Cantidad de Movimientos */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                        Cantidad de Movimientos
                    </p>
                    <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mt-2">
                        {totales.cantidad}
                    </p>
                </div>

                {/* Promedio por Movimiento */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10 border border-green-200 dark:border-green-700 rounded-lg p-4">
                    <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                        Promedio por Movimiento
                    </p>
                    <p className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                        Bs. {totales.promedio.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
    );
}
