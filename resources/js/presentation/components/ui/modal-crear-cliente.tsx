import React from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { NotificationService } from '@/infrastructure/services/notification.service';
import type { Cliente } from '@/domain/entities/clientes';

interface ModalCrearClienteProps {
    isOpen: boolean;
    onClose: () => void;
    onClienteCreated: (cliente: Cliente) => void;
    searchQuery?: string; // Para pre-llenar campos basado en la búsqueda
}

export default function ModalCrearCliente({
    isOpen,
    onClose,
    onClienteCreated,
    searchQuery = ''
}: ModalCrearClienteProps) {
    const { data, setData, processing, errors, reset } = useForm({
        nombre: '',
        razon_social: '',
        nit: '',
        telefono: '',
        email: '',
        activo: true,
        limite_credito: 0,
        puede_tener_credito: false,
    });

    // Pre-llenar campos basado en la búsqueda
    React.useEffect(() => {
        if (searchQuery && isOpen) {
            // Intentar identificar el tipo de dato basado en el patrón
            const query = searchQuery.trim();

            // Si parece un email
            if (query.includes('@') && query.includes('.')) {
                setData('email', query);
            }
            // Si parece un NIT (solo números)
            else if (/^\d+$/.test(query)) {
                setData('nit', query);
            }
            // Si parece un teléfono (SOLO dígitos, espacios, guiones, paréntesis - sin letras)
            else if (/^[\d\s\-()+]+$/.test(query) && /\d/.test(query)) {
                setData('telefono', query);
            }
            // Si no parece ninguno de los anteriores, asumimos que es el nombre
            else {
                setData('nombre', query);
            }
        }
    }, [searchQuery, isOpen, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.nombre.trim()) {
            NotificationService.error('El nombre del cliente es obligatorio');
            return;
        }

        // Usar fetch directamente para evitar problemas con Inertia.js
        const submitData = async () => {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                const response = await fetch('/clientes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken || '',
                        'X-Requested-With': 'XMLHttpRequest',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        ...data,
                        modal: true, // Indicar que viene de un modal
                    }),
                });

                const result = await response.json();
                console.log('Respuesta del servidor:', result);

                if (result.success && result.data.cliente) {
                    // Mostrar mensaje de éxito con detalles del cliente
                    const clienteCreado = result.data.cliente;
                    const mensajeExito = `✅ Cliente "${clienteCreado.nombre}" creado exitosamente${clienteCreado.nit ? ` (NIT: ${clienteCreado.nit})` : ''}`;
                    NotificationService.success(mensajeExito);

                    // Limpiar el formulario
                    reset();

                    // Cerrar modal
                    onClose();

                    // Notificar al componente padre con el cliente creado
                    onClienteCreated(clienteCreado);
                } else {
                    // Mostrar errores
                    const errorMessage = result.message || 'Error al crear el cliente';
                    NotificationService.error(errorMessage);
                }
            } catch (error) {
                console.error('Error en la petición:', error);
                NotificationService.error('Error al crear el cliente. Intente nuevamente.');
            }
        };

        submitData();
    };

    /* const handleActivoChange = (checked: boolean | "indeterminate") => {
        const isChecked = checked === true;
        setData((prevData) => ({ ...prevData, activo: isChecked }));
    }; */

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2">
                        <span>➕</span>
                        <span>Crear Nuevo Cliente</span>
                    </DialogTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Complete la información del cliente. Los campos marcados con * son obligatorios.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nombre" className="text-sm font-medium">
                                Nombre *
                            </Label>
                            <Input
                                id="nombre"
                                type="text"
                                value={data.nombre}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setData('nombre', value);
                                  // ✨ Copiar automáticamente a razón social si está vacío
                                  if (!data.razon_social) {
                                    setData('razon_social', value);
                                  }
                                }}
                                placeholder="Nombre completo del cliente"
                                className={errors.nombre ? 'border-red-500' : ''}
                                required
                            />
                            {errors.nombre && <p className="text-red-600 text-xs mt-1">{errors.nombre}</p>}
                        </div>

                        <div>
                            <Label htmlFor="razon_social" className="text-sm font-medium">
                                Razón Social
                            </Label>
                            <Input
                                id="razon_social"
                                type="text"
                                value={data.razon_social || ''}
                                onChange={(e) => setData('razon_social', e.target.value)}
                                placeholder="Razón social (opcional)"
                            />
                        </div>

                        <div>
                            <Label htmlFor="nit" className="text-sm font-medium">
                                NIT/CI
                            </Label>
                            <Input
                                id="nit"
                                type="text"
                                value={data.nit || ''}
                                onChange={(e) => setData('nit', e.target.value)}
                                placeholder="Número de identificación tributaria"
                            />
                        </div>

                        <div>
                            <Label htmlFor="telefono" className="text-sm font-medium">
                                Teléfono
                            </Label>
                            <Input
                                id="telefono"
                                type="tel"
                                value={data.telefono || ''}
                                onChange={(e) => setData('telefono', e.target.value)}
                                placeholder="Número de teléfono"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Label htmlFor="email" className="text-sm font-medium">
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email || ''}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="correo@ejemplo.com"
                            />
                        </div>
                    </div>

                    {/* <div className="flex items-center space-x-2">
                        <Checkbox
                            id="activo"
                            checked={data.activo ?? true}
                            onCheckedChange={handleActivoChange}
                        />
                        <Label htmlFor="activo" className="text-sm">
                            Cliente activo
                        </Label>
                    </div> */}

                    {/* Sección de crédito */}
                    {/* <div className="border-t pt-6">
                        <h3 className="text-sm font-semibold mb-4 flex items-center space-x-2">
                            <span>💳</span>
                            <span>Configuración de Crédito</span>
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="puede_tener_credito"
                                    checked={data.puede_tener_credito ?? false}
                                    onCheckedChange={(checked) => setData('puede_tener_credito', checked === true)}
                                />
                                <Label htmlFor="puede_tener_credito" className="text-sm">
                                    Habilitar crédito para este cliente
                                </Label>
                            </div>

                            {data.puede_tener_credito && (
                                <div>
                                    <Label htmlFor="limite_credito" className="text-sm font-medium">
                                        Límite de crédito
                                    </Label>
                                    <Input
                                        id="limite_credito"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.limite_credito || ''}
                                        onChange={(e) => setData('limite_credito', e.target.value ? parseFloat(e.target.value) : null)}
                                        placeholder="Ej: 10000"
                                        className={errors.limite_credito ? 'border-red-500' : ''}
                                    />
                                    {errors.limite_credito && <p className="text-red-600 text-xs mt-1">{errors.limite_credito}</p>}
                                </div>
                            )}
                        </div>
                    </div> */}

                    <DialogFooter className="flex justify-end space-x-3 pt-6 border-t">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing || !data.nombre.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {processing ? 'Creando...' : 'Crear Cliente'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
