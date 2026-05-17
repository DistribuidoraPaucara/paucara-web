import { useRef } from 'react';

interface ModoImportacionProductosProps {
  onArchivoSeleccionado: (file: File) => void;
  onDescargarPlantilla: () => void;
  cargando?: boolean;
}

export default function ModoImportacionProductos({
  onArchivoSeleccionado,
  onDescargarPlantilla,
  cargando = false,
}: ModoImportacionProductosProps) {
  const inputFile = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'copy';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer?.files) {
      const file = e.dataTransfer.files[0];
      if (file) {
        onArchivoSeleccionado(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onArchivoSeleccionado(e.target.files[0]);
    }
  };

  const handleClick = () => {
    inputFile.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Zona de drop/click */}
      <div
        className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <svg
          className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <p className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-2">Arrastra el archivo CSV o XLSX aquí</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">O haz clic para seleccionar un archivo</p>
        <input
          ref={inputFile}
          type="file"
          accept=".csv,.xlsx,.xls,.ods"
          style={{ display: 'none' }}
          onChange={handleFileInput}
          disabled={cargando}
        />
      </div>

      {/* Botón descargar plantilla */}
      <button
        type="button"
        className="w-full bg-green-600 dark:bg-green-700 text-white py-2 px-4 rounded-md hover:bg-green-700 dark:hover:bg-green-800 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
        onClick={onDescargarPlantilla}
        disabled={cargando}
      >
        Descargar Plantilla CSV
      </button>

      {/* Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          📝 Usa la plantilla descargada para asegurar el formato correcto.
        </p>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">⚠️ Máximo 5000 filas y 10MB de tamaño.</p>
      </div>
    </div>
  );
}
