interface ComparativaPeriodosProps {
    comparativa: {
        periodo_actual: number;
        periodo_anterior: number;
        diferencia: number;
        porcentaje_cambio: number;
        tendencia: 'alza' | 'baja';
    };
}

export default function ComparativaPeriocos({ comparativa }: ComparativaPeriodosProps) {
    const isAlza = comparativa.tendencia === 'alza';
    const colorBg = isAlza
        ? 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-900/10'
        : 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10';
    const colorBorder = isAlza
        ? 'border-orange-200 dark:border-orange-700'
        : 'border-green-200 dark:border-green-700';
    const colorText = isAlza
        ? 'text-orange-600 dark:text-orange-400'
        : 'text-green-600 dark:text-green-400';
    const colorTextBold = isAlza
        ? 'text-orange-700 dark:text-orange-300'
        : 'text-green-700 dark:text-green-300';

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                📊 Comparativa de Períodos
            </h3>

            <div className={`${colorBg} border ${colorBorder} rounded-lg p-6`}>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    {/* Período Actual */}
                    <div>
                        <p className={`text-sm font-medium ${colorText}`}>
                            Período Actual
                        </p>
                        <p className={`text-2xl font-bold ${colorTextBold} mt-2`}>
                            Bs. {comparativa.periodo_actual.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>

                    {/* Período Anterior */}
                    <div>
                        <p className={`text-sm font-medium ${colorText}`}>
                            Período Anterior
                        </p>
                        <p className={`text-2xl font-bold ${colorTextBold} mt-2`}>
                            Bs. {comparativa.periodo_anterior.toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Diferencia y Tendencia */}
                <div className="border-t border-current opacity-20 pt-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium opacity-75">
                                Diferencia
                            </p>
                            <p className={`text-xl font-bold ${colorTextBold} mt-1`}>
                                {isAlza ? '↑' : '↓'} Bs. {Math.abs(comparativa.diferencia).toLocaleString('es-BO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium opacity-75">
                                Cambio Porcentual
                            </p>
                            <p className={`text-xl font-bold ${colorTextBold} mt-1`}>
                                {comparativa.porcentaje_cambio > 0 ? '+' : ''}{comparativa.porcentaje_cambio.toFixed(2)}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Interpretación */}
                <div className="mt-4 pt-4 border-t border-current opacity-20">
                    <p className="text-sm opacity-75">
                        {isAlza ? (
                            <>
                                📈 Los egresos <strong>aumentaron</strong> respecto al período anterior.
                                Considera revisar dónde se concentran estos gastos.
                            </>
                        ) : (
                            <>
                                📉 Los egresos <strong>disminuyeron</strong> respecto al período anterior.
                                Buen control de gastos.
                            </>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}
