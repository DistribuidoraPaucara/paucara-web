import { usePage } from '@inertiajs/react';
import { Button } from '@/presentation/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';

/**
 * Error Page - Página genérica para manejo de errores HTTP
 *
 * Usado por Inertia cuando ocurre un error en la aplicación
 * (403 Forbidden, 404 Not Found, 500 Internal Server Error, etc.)
 */
export default function Error() {
  const { status, data } = usePage<{ message: string }>();

  const getErrorMessage = () => {
    switch (status) {
      case 403:
        return 'No tienes permiso para acceder a esta página';
      case 404:
        return 'La página que buscas no existe';
      case 500:
        return 'Error interno del servidor';
      default:
        return data?.message || 'Algo salió mal';
    }
  };

  const getErrorTitle = () => {
    switch (status) {
      case 403:
        return 'Acceso Denegado';
      case 404:
        return 'Página no encontrada';
      case 500:
        return 'Error del Servidor';
      default:
        return 'Error';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-900 rounded-lg shadow-2xl p-8">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-4">
              <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          {/* Error Title */}
          <h1 className="text-3xl font-bold text-center mb-2 text-slate-900 dark:text-slate-100">
            {getErrorTitle()}
          </h1>

          {/* Error Status Code */}
          <p className="text-5xl font-bold text-center text-red-600 dark:text-red-400 mb-4">
            {status}
          </p>

          {/* Error Message */}
          <p className="text-center text-slate-600 dark:text-slate-400 mb-8">
            {getErrorMessage()}
          </p>

          {/* Action Button */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => window.history.back()}
            >
              Atrás
            </Button>
            <Button
              className="flex-1 gap-2"
              onClick={() => (window.location.href = '/')}
            >
              <Home className="h-4 w-4" />
              Inicio
            </Button>
          </div>

          {/* Debug Info (solo en desarrollo) */}
          {import.meta.env.DEV && data?.message && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono break-words">
                {data.message}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
