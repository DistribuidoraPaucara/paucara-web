import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import InputSearch from '@/presentation/components/ui/input-search';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface Cliente {
  id: number;
  nombre: string;
  email: string;
}

interface CrearCreditoProps {
  clientes: Cliente[];
}

interface SearchOption {
  value: string | number;
  label: string;
  description?: string;
}

export default function CrearCredito({ clientes }: CrearCreditoProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedClienteId, setSelectedClienteId] = useState<string | number | null>(null);

  const { data, setData, errors: formErrors } = useForm({
    cliente_id: '',
    monto: '',
    monto_pagado: '',
    fecha_venta: '',
    numero_documento: '',
    observaciones: '',
  });

  const selectedCliente = selectedClienteId
    ? clientes.find((c) => c.id === parseInt(selectedClienteId as string))
    : null;

  // Calcular días de atraso
  const calcularDiasAtraso = (fechaVenta: string): number => {
    if (!fechaVenta) return 0;
    const fecha = new Date(fechaVenta);
    const fechaVencimiento = new Date(fecha);
    fechaVencimiento.setDate(fechaVencimiento.getDate() + 7);

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    fechaVencimiento.setHours(0, 0, 0, 0);

    const diff = hoy.getTime() - fechaVencimiento.getTime();
    const diasAtraso = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return diasAtraso > 0 ? diasAtraso : 0;
  };

  // Calcular saldo pendiente
  const calcularSaldoPendiente = (): number => {
    const monto = parseFloat(data.monto as string) || 0;
    const pagado = parseFloat(data.monto_pagado as string) || 0;
    return Math.max(0, monto - pagado);
  };

  const diasAtraso = calcularDiasAtraso(data.fecha_venta);
  const saldoPendiente = calcularSaldoPendiente();
  const montoPagado = parseFloat(data.monto_pagado as string) || 0;
  const montoTotal = parseFloat(data.monto as string) || 0;

  // Función de búsqueda que filtra clientes localmente
  const handleSearchClientes = async (query: string): Promise<SearchOption[]> => {
    // Validar que query no sea null o vacío
    if (!query || query.trim().length === 0) {
      return [];
    }

    const queryLower = query.toLowerCase();
    const filtered = clientes.filter(
      (cliente) => {
        const nombre = cliente.nombre || '';
        const email = cliente.email || '';
        return (
          nombre.toLowerCase().includes(queryLower) ||
          email.toLowerCase().includes(queryLower)
        );
      }
    );

    return filtered.map((cliente) => ({
      value: cliente.id,
      label: cliente.nombre || 'Sin nombre',
      description: cliente.email || 'Sin email',
    }));
  };

  // Manejar cambio de cliente en InputSearch
  const handleClienteChange = (value: string | number | null, option?: SearchOption) => {
    if (value !== null) {
      setSelectedClienteId(value);
      setData('cliente_id', value.toString());
    } else {
      setSelectedClienteId(null);
      setData('cliente_id', '');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch('/api/creditos/crear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
        },
        body: JSON.stringify({
          cliente_id: parseInt(data.cliente_id as string),
          monto: parseFloat(data.monto as string),
          monto_pagado: parseFloat(data.monto_pagado as string) || 0,
          fecha_venta: data.fecha_venta,
          numero_documento: data.numero_documento,
          observaciones: data.observaciones,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Construir mensaje de error más detallado
        let errorMessage = responseData.message || 'Error al crear el crédito';

        // Si hay detalles disponibles, usarlos
        if (responseData.detalles) {
          errorMessage = responseData.detalles;
        } else if (responseData.errors && typeof responseData.errors === 'object') {
          // Si hay errores por campo, construir lista
          const erroresDetallados = Object.entries(responseData.errors)
            .map(([campo, mensajes]: [string, any]) => {
              const msgs = Array.isArray(mensajes) ? mensajes : [mensajes];
              return `${campo}: ${msgs.join(', ')}`;
            })
            .join('\n');
          errorMessage = erroresDetallados || errorMessage;
        }

        setError(errorMessage);
        toast.error(errorMessage);

        // Log detallado en consola para debugging
        console.error('Error de validación:', {
          status: response.status,
          message: responseData.message,
          errors: responseData.errors,
          detalles: responseData.detalles,
          full: responseData,
        });
      } else {
        setSuccess(true);
        toast.success('Crédito creado exitosamente');

        // Limpiar formulario después de 2 segundos
        setTimeout(() => {
          setData({
            cliente_id: '',
            monto: '',
            fecha_venta: '',
            numero_documento: '',
            observaciones: '',
          });
          setSelectedClienteId(null);
          setSuccess(false);
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error de conexión: ${errorMessage}`);
      toast.error(`Error de conexión: ${errorMessage}`);
      console.error('Error en fetch:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Crear Crédito Manual</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Registra un crédito individual para un cliente
          </p>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
          {success && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-200">
                ✅ Crédito creado exitosamente
              </p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-800 dark:text-red-200 font-semibold mb-2">Errores encontrados:</p>
                  <div className="text-red-700 dark:text-red-300 text-sm whitespace-pre-wrap break-words">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cliente - InputSearch */}
            <div>
              <InputSearch
                id="cliente-search"
                label="Cliente *"
                value={selectedClienteId}
                onChange={handleClienteChange}
                onSearch={handleSearchClientes}
                placeholder="Buscar cliente por nombre o email..."
                emptyText="No se encontraron clientes"
                required={true}
                error={formErrors.cliente_id ? String(formErrors.cliente_id) : undefined}
              />
              {selectedCliente && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    ✅ Cliente seleccionado: <strong>{selectedCliente.nombre}</strong>
                  </p>
                </div>
              )}
            </div>

            {/* Monto Total */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto Total *
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={data.monto}
                  onChange={(e) => setData('monto', e.target.value)}
                  className="pl-8"
                />
              </div>
              {formErrors.monto && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {formErrors.monto}
                </p>
              )}
            </div>

            {/* Monto Pagado */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Monto Pagado
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">
                  $
                </span>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={data.monto_pagado}
                  onChange={(e) => {
                    const valor = parseFloat(e.target.value) || 0;
                    // No permitir que sea mayor al monto total
                    if (valor > montoTotal) {
                      setData('monto_pagado', montoTotal.toString());
                    } else {
                      setData('monto_pagado', e.target.value);
                    }
                  }}
                  className="pl-8"
                />
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Dejar en 0 si es un crédito nuevo
              </p>
            </div>

            {/* Resumen de saldo y días de atraso */}
            {montoTotal > 0 && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Saldo Pendiente</p>
                  <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                    ${saldoPendiente.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Días de Atraso</p>
                  <p className={`text-lg font-semibold ${diasAtraso > 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-green-600 dark:text-green-400'
                    }`}>
                    {diasAtraso === 0 ? 'Al día' : `${diasAtraso} días`}
                  </p>
                </div>
              </div>
            )}

            {/* Fecha de Venta */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fecha de Venta *
              </Label>
              <Input
                type="date"
                value={data.fecha_venta}
                onChange={(e) => setData('fecha_venta', e.target.value)}
              />
              {formErrors.fecha_venta && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {formErrors.fecha_venta}
                </p>
              )}
            </div>

            {/* Número de Documento */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Número de Documento (Factura) *
              </Label>
              <Input
                type="text"
                placeholder="ej: FAC-001-2025"
                value={data.numero_documento}
                onChange={(e) => setData('numero_documento', e.target.value)}
              />
              <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                Ejemplo: FAC-001-2025, INV-123, BO-456
              </p>
              {formErrors.numero_documento && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                  {formErrors.numero_documento}
                </p>
              )}
            </div>

            {/* Observaciones */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observaciones
              </Label>
              <Textarea
                placeholder="Notas adicionales sobre este crédito..."
                value={data.observaciones}
                onChange={(e) => setData('observaciones', e.target.value)}
                rows={4}
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading || !selectedCliente}
                className="flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creando...
                  </>
                ) : (
                  'Crear Crédito'
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setData({
                    cliente_id: '',
                    monto: '',
                    fecha_venta: '',
                    numero_documento: '',
                    observaciones: '',
                  });
                  setSelectedClienteId(null);
                  setError(null);
                }}
              >
                Limpiar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout >
  );
}
