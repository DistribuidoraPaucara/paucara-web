// Modal para registrar ubicación en el mapa
import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { MapPin, Save, X, Loader2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import NotificationService from '@/infrastructure/services/notification.service';

export interface DireccionData {
    id?: number;
    direccion: string;
    latitud: number;
    longitud: number;
    observaciones: string;
    es_principal: boolean;
    localidad_id?: number | null;
}

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave?: (direccion: DireccionData) => void;
    onSaveSuccess?: (direccion: DireccionData) => void;
    latitude: number;
    longitude: number;
    geocodedAddress?: string;
    existingData?: DireccionData | null;
    clienteId?: number | null; // Cliente ID para guardar en la BD
    localidadId?: number | null; // Localidad ID del cliente
}

export default function LocationModal({
    isOpen,
    onClose,
    onSave,
    onSaveSuccess,
    latitude,
    longitude,
    geocodedAddress = '',
    existingData = null,
    clienteId = null,
    localidadId = null,
}: LocationModalProps) {
    const [formData, setFormData] = useState<DireccionData>({
        direccion: geocodedAddress,
        latitud: latitude,
        longitud: longitude,
        observaciones: '',
        es_principal: false,
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isSaving, setIsSaving] = useState(false);

    // Actualizar formulario cuando cambian las props
    useEffect(() => {
        if (existingData) {
            setFormData(existingData);
        } else {
            setFormData({
                direccion: geocodedAddress || '',
                latitud: latitude,
                longitud: longitude,
                observaciones: '',
                es_principal: false,
            });
        }
        setErrors({});
    }, [existingData, geocodedAddress, latitude, longitude, isOpen]);

    const handleChange = (field: keyof DireccionData, value: string | boolean) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Limpiar error del campo cuando el usuario empieza a escribir
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validate = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) {
            return;
        }

        // Si hay clienteId, guardar directamente en la BD
        if (clienteId) {
            await saveToDatabase();
        } else {
            // Si no hay clienteId, usar el callback antiguo (para formularios)
            onSave?.(formData);
            handleClose();
        }
    };

    const saveToDatabase = async () => {
        setIsSaving(true);

        // Preparar los datos para enviar
        const dataToSend = {
            direccion: formData.direccion,
            latitud: formData.latitud,
            longitud: formData.longitud,
            observaciones: formData.observaciones,
            es_principal: formData.es_principal,
            localidad_id: localidadId, // Usar la localidad del cliente
        };

        // Determinar si es crear o actualizar
        const isUpdate = !!existingData?.id;
        const url = isUpdate
            ? `/api/clientes/${clienteId}/direcciones/${existingData.id}`
            : `/api/clientes/${clienteId}/direcciones`;
        const method = isUpdate ? 'PUT' : 'POST'; // Usar PUT para actualizar (no PATCH)

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Error ${response.status}`);
            }

            const responseData = await response.json();
            const savedDireccion = responseData.data;

            // Llamar callback si existe
            if (onSaveSuccess) {
                onSaveSuccess(savedDireccion);
            }

            // Mostrar notificación de éxito
            const successMessage = isUpdate
                ? 'Dirección actualizada exitosamente'
                : 'Dirección registrada exitosamente';
            NotificationService.success(successMessage);

            handleClose();
        } catch (error: any) {
            console.error('Error al guardar dirección:', error);
            const errorMessage = error.message || 'Error al guardar la dirección';
            NotificationService.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleClose = () => {
        setFormData({
            direccion: '',
            latitud: 0,
            longitud: 0,
            observaciones: '',
            es_principal: false,
        });
        setErrors({});
        setIsSaving(false);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        {existingData ? 'Editar Ubicación' : 'Registrar Ubicación'}
                    </DialogTitle>
                    <DialogDescription>
                        Completa los datos de la ubicación seleccionada en el mapa
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Coordenadas (solo lectura) */}
                    <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Coordenadas seleccionadas</Label>
                        <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                            <MapPin className="h-4 w-4 text-blue-600" />
                            <span className="text-sm font-mono">
                                {formData.latitud.toFixed(6)}, {formData.longitud.toFixed(6)}
                            </span>
                        </div>
                    </div>

                    {/* Dirección */}
                    <div className="space-y-2">
                        <Label htmlFor="direccion">
                            Dirección <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            id="direccion"
                            placeholder="Ej: Av. Cristo Redentor #123, entre calle 1 y 2"
                            value={formData.direccion}
                            onChange={(e) => handleChange('direccion', e.target.value)}
                            className={errors.direccion ? 'border-red-500' : ''}
                        />
                        {errors.direccion && (
                            <p className="text-sm text-red-500">{errors.direccion}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Puedes editar la dirección sugerida por el mapa
                        </p>
                    </div>

                    {/* Observaciones */}
                    <div className="space-y-2">
                        <Label htmlFor="observaciones">Observaciones (opcional)</Label>
                        <Textarea
                            id="observaciones"
                            placeholder="Ej: Casa de color blanco, portón negro. Tocar el timbre 2 veces."
                            value={formData.observaciones}
                            onChange={(e) => handleChange('observaciones', e.target.value)}
                            rows={3}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            Referencias adicionales para facilitar la entrega
                        </p>
                    </div>

                    {/* Es principal */}
                    <div className="flex items-center space-x-2 p-3 border rounded-lg bg-muted/50">
                        <Checkbox
                            id="es_principal"
                            checked={formData.es_principal}
                            onCheckedChange={(checked) =>
                                handleChange('es_principal', checked === true)
                            }
                        />
                        <div className="flex flex-col">
                            <Label
                                htmlFor="es_principal"
                                className="text-sm font-medium cursor-pointer"
                            >
                                Marcar como dirección principal
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Esta será la ubicación predeterminada para entregas
                            </p>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSaving}
                    >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                Guardar Ubicación
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
