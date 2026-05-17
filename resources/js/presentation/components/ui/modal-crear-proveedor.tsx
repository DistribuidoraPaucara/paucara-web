import React from 'react';
import { useForm } from '@inertiajs/react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { NotificationService } from '@/infrastructure/services/notification.service';
import type { ProveedorFormData, Proveedor } from '@/domain/entities/proveedores';

interface ModalCrearProveedorProps {
    isOpen: boolean;
    onClose: () => void;
    onProveedorCreated: (proveedor: Proveedor) => void;
    searchQuery?: string; // Para pre-llenar campos basado en la búsqueda
}

export default function ModalCrearProveedor({
    isOpen,
    onClose,
    onProveedorCreated,
    searchQuery = ''
}: ModalCrearProveedorProps) {
    const { data, setData, processing, errors, reset } = useForm<ProveedorFormData>({
        nombre: '',
        razon_social: '',
        nit: null,
        telefono: null,
        email: null,
        direccion: null,
        contacto: null,
        foto_perfil: null,
        ci_anverso: null,
        ci_reverso: null,
        activo: true,
    });

    // Estado local para manejar la carga durante el envío
    // const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-llenar campos basado en la búsqueda
    React.useEffect(() => {
        if (searchQuery && isOpen) {
            // Intentar identificar el tipo de dato basado en el patrón
            const query = searchQuery.trim();

            // Si parece un email
            if (query.includes('@') && query.includes('.')) {
                setData('email', query);
            }
            // Si parece un teléfono (solo números, con posibles espacios/guiones)
            else if (/^[\d\s\-+()]+$/.test(query)) {
                setData('telefono', query.replace(/\s+/g, ''));
            }
            // Si parece un NIT/CI (números con posibles guiones)
            else if (/^[\d\-.]+$/.test(query)) {
                setData('nit', query);
            }
            // De lo contrario, asumir que es el nombre
            else {
                setData('nombre', query);
                setData('razon_social', query);
            }
        }
    }, [searchQuery, isOpen, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!data.nombre.trim()) {
            NotificationService.error('El nombre del proveedor es obligatorio');
            return;
        }

        // Usar fetch directamente para evitar problemas con Inertia.js
        const submitData = async () => {
            try {
                const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                const response = await fetch('/proveedores', {
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

                if (result.success && result.data.proveedor) {
                    // Mostrar mensaje de éxito con detalles del proveedor
                    const proveedorCreado = result.data.proveedor;
                    const mensajeExito = `✅ Proveedor "${proveedorCreado.nombre}" creado exitosamente${proveedorCreado.nit ? ` (NIT: ${proveedorCreado.nit})` : ''}`;
                    NotificationService.success(mensajeExito);

                    // Limpiar el formulario
                    reset();

                    // Cerrar modal
                    onClose();

                    // Notificar al componente padre con el proveedor creado
                    onProveedorCreated(proveedorCreado);
                } else {
                    // Mostrar errores
                    const errorMessage = result.message || 'Error al crear el proveedor';
                    NotificationService.error(errorMessage);
                }
            } catch (error) {
                console.error('Error en la petición:', error);
                NotificationService.error('Error al crear el proveedor. Intente nuevamente.');
            }
        };

        submitData();
    };

    const handleActivoChange = (checked: boolean | "indeterminate") => {
        const isChecked = checked === true;
        setData((prevData) => ({ ...prevData, activo: isChecked }));
    };

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
                        <span>Crear Nuevo Proveedor</span>
                    </DialogTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Complete la información del proveedor. Los campos marcados con * son obligatorios.
                    </p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Información básica */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b pb-2">
                            Información Básica
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="nombre">
                                    Nombre *
                                </Label>
                                <Input
                                    id="nombre"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Nombre del proveedor"
                                    className={errors.nombre ? 'border-red-500' : ''}
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>
                                )}
                            </div>

                            <div>
                                <Label htmlFor="razon_social">
                                    Razón Social
                                </Label>
                                <Input
                                    id="razon_social"
                                    value={data.razon_social || ''}
                                    onChange={(e) => setData('razon_social', e.target.value)}
                                    placeholder="Razón social (opcional)"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="nit">
                                    NIT / CI
                                </Label>
                                <Input
                                    id="nit"
                                    value={data.nit || ''}
                                    onChange={(e) => setData('nit', e.target.value)}
                                    placeholder="Número de identificación"
                                />
                            </div>

                            <div>
                                <Label htmlFor="telefono">
                                    Teléfono
                                </Label>
                                <Input
                                    id="telefono"
                                    value={data.telefono || ''}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    placeholder="Número de teléfono"
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="email">
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

                    {/* Información adicional */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b pb-2">
                            Información Adicional
                        </h3>

                        <div>
                            <Label htmlFor="contacto">
                                Persona de Contacto
                            </Label>
                            <Input
                                id="contacto"
                                value={data.contacto || ''}
                                onChange={(e) => setData('contacto', e.target.value)}
                                placeholder="Nombre de la persona de contacto"
                            />
                        </div>

                        <div>
                            <Label htmlFor="direccion">
                                Dirección
                            </Label>
                            <Textarea
                                id="direccion"
                                value={data.direccion || ''}
                                onChange={(e) => setData('direccion', e.target.value)}
                                placeholder="Dirección completa del proveedor"
                                rows={3}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="activo"
                                checked={data.activo ?? true}
                                onCheckedChange={handleActivoChange}
                            />
                            <Label htmlFor="activo" className="text-sm">
                                Proveedor activo
                            </Label>
                        </div>
                    </div>

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
                            {processing ? 'Creando...' : 'Crear Proveedor'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
