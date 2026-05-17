import HistorialCargasCSV from '@/presentation/components/Inventario/HistorialCargasCSV';

export default function HistorialCargasPage() {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Historial de Cargas CSV</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Visualiza y gestiona el historial de cargas masivas de ajustes de inventario
          </p>
        </div>

        <HistorialCargasCSV />
      </div>
    </div>
  );
}
