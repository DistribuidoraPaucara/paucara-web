import { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/presentation/components/ui/select';
import { toast } from 'react-toastify';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import notificacionesService, { type NotificacionRecurrente, type Role } from '@/infrastructure/services/notificaciones.service';

const DIAS_SEMANA = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
const TIPOS = [
    { value: 'promocion', label: '🎁 Promoción' },
    { value: 'evento', label: '🎉 Evento' },
    { value: 'informativo', label: 'ℹ️ Informativo' },
    { value: 'oferta', label: '🏷️ Oferta' },
];
const FRECUENCIAS = [
    { value: 'una_vez', label: '🔄 Una sola vez' },
    { value: 'diario', label: '📅 Diario' },
    { value: 'semanal', label: '📆 Semanal' },
    { value: 'mensual', label: '📋 Mensual' },
];

export default function NotificacionesCreate() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [roles, setRoles] = useState<Role[]>([]);
    const [formData, setFormData] = useState<Partial<NotificacionRecurrente> & { roles?: number[] }>({
        titulo: '',
        descripcion: '',
        tipo: 'informativo',
        frecuencia: 'una_vez',
        hora_envio: '09:00',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: '',
        dias_semana: [],
        dia_mes: 1,
        activo: true,
        roles: [],
    });

    useEffect(() => {
        // Cargar roles disponibles
        notificacionesService.obtenerRoles().then(setRoles).catch(error => {
            console.error('Error cargando roles:', error);
            toast.error('Error al cargar los roles');
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleDiaChange = (dia: string) => {
        const diasActuales = formData.dias_semana || [];
        if (diasActuales.includes(dia)) {
            setFormData({
                ...formData,
                dias_semana: diasActuales.filter((d) => d !== dia),
            });
        } else {
            setFormData({
                ...formData,
                dias_semana: [...diasActuales, dia],
            });
        }
    };

    const handleRolChange = (rolId: number) => {
        const rolesActuales = formData.roles || [];
        if (rolesActuales.includes(rolId)) {
            setFormData({
                ...formData,
                roles: rolesActuales.filter((r) => r !== rolId),
            });
        } else {
            setFormData({
                ...formData,
                roles: [...rolesActuales, rolId],
            });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.titulo) newErrors.titulo = 'El título es requerido';
        if (!formData.descripcion) newErrors.descripcion = 'La descripción es requerida';
        if (!formData.hora_envio) newErrors.hora_envio = 'La hora es requerida';
        if (!formData.fecha_inicio) newErrors.fecha_inicio = 'La fecha de inicio es requerida';

        if (formData.frecuencia === 'semanal' && (!formData.dias_semana || formData.dias_semana.length === 0)) {
            newErrors.dias_semana = 'Selecciona al menos un día para frecuencia semanal';
        }

        if (formData.frecuencia === 'mensual' && (!formData.dia_mes || formData.dia_mes < 1 || formData.dia_mes > 31)) {
            newErrors.dia_mes = 'El día debe estar entre 1 y 31';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error('Por favor completa los campos requeridos');
            return;
        }

        setLoading(true);
        try {
            await notificacionesService.crear(formData);
            toast.success('Notificación creada exitosamente');
            router.push('/notificaciones');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Error al crear notificación';
            toast.error(message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout>
            <Head title="Crear Notificación" />

            <div className="space-y-6">
                {/* Header */}
                <Link href="/notificaciones">
                    <Button variant="ghost" className="gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Volver
                    </Button>
                </Link>

                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Nueva Notificación Recurrente
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Crea una notificación que se enviará automáticamente según el horario programado
                    </p>
                </div>

                {/* Formulario */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Sección 1: Contenido */}
                            <div className="space-y-4 pb-6 border-b">
                                <h2 className="text-lg font-semibold">Contenido</h2>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Título <span className="text-red-600">*</span>
                                    </label>
                                    <Input
                                        type="text"
                                        name="titulo"
                                        value={formData.titulo || ''}
                                        onChange={handleChange}
                                        placeholder="ej: Descuento de Fin de Semana"
                                        maxLength={255}
                                        className={errors.titulo ? 'border-red-500' : ''}
                                    />
                                    {errors.titulo && (
                                        <p className="text-red-500 text-sm mt-1">{errors.titulo}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        Descripción <span className="text-red-600">*</span>
                                    </label>
                                    <Textarea
                                        name="descripcion"
                                        value={formData.descripcion || ''}
                                        onChange={handleChange}
                                        placeholder="ej: 20% en todos nuestros productos este fin de semana"
                                        rows={4}
                                        className={errors.descripcion ? 'border-red-500' : ''}
                                    />
                                    {errors.descripcion && (
                                        <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Tipo <span className="text-red-600">*</span>
                                        </label>
                                        <Select
                                            value={formData.tipo || 'informativo'}
                                            onValueChange={(value) => handleSelectChange('tipo', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TIPOS.map((tipo) => (
                                                    <SelectItem key={tipo.value} value={tipo.value}>
                                                        {tipo.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Sección 2: Recurrencia */}
                            <div className="space-y-4 pb-6 border-b">
                                <h2 className="text-lg font-semibold">Recurrencia</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Frecuencia <span className="text-red-600">*</span>
                                        </label>
                                        <Select
                                            value={formData.frecuencia || 'una_vez'}
                                            onValueChange={(value) => handleSelectChange('frecuencia', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {FRECUENCIAS.map((freq) => (
                                                    <SelectItem key={freq.value} value={freq.value}>
                                                        {freq.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Hora de Envío <span className="text-red-600">*</span>
                                        </label>
                                        <Input
                                            type="time"
                                            name="hora_envio"
                                            value={formData.hora_envio || '09:00'}
                                            onChange={handleChange}
                                            className={errors.hora_envio ? 'border-red-500' : ''}
                                        />
                                        {errors.hora_envio && (
                                            <p className="text-red-500 text-sm mt-1">{errors.hora_envio}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Días de la semana (si es semanal) */}
                                {formData.frecuencia === 'semanal' && (
                                    <div>
                                        <label className="block text-sm font-medium mb-3">
                                            Días de la Semana <span className="text-red-600">*</span>
                                        </label>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {DIAS_SEMANA.map((dia) => (
                                                <label key={dia} className="flex items-center gap-2 cursor-pointer">
                                                    <Checkbox
                                                        checked={(formData.dias_semana || []).includes(dia)}
                                                        onCheckedChange={() => handleDiaChange(dia)}
                                                    />
                                                    <span className="capitalize text-sm">{dia}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {errors.dias_semana && (
                                            <p className="text-red-500 text-sm mt-2">{errors.dias_semana}</p>
                                        )}
                                    </div>
                                )}

                                {/* Día del mes (si es mensual) */}
                                {formData.frecuencia === 'mensual' && (
                                    <div className="max-w-xs">
                                        <label className="block text-sm font-medium mb-2">
                                            Día del Mes <span className="text-red-600">*</span>
                                        </label>
                                        <Input
                                            type="number"
                                            name="dia_mes"
                                            min="1"
                                            max="31"
                                            value={formData.dia_mes || 1}
                                            onChange={handleChange}
                                            className={errors.dia_mes ? 'border-red-500' : ''}
                                        />
                                        {errors.dia_mes && (
                                            <p className="text-red-500 text-sm mt-1">{errors.dia_mes}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Sección 3: Vigencia */}
                            <div className="space-y-4 pb-6 border-b">
                                <h2 className="text-lg font-semibold">Vigencia</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Fecha de Inicio <span className="text-red-600">*</span>
                                        </label>
                                        <Input
                                            type="date"
                                            name="fecha_inicio"
                                            value={formData.fecha_inicio || ''}
                                            onChange={handleChange}
                                            className={errors.fecha_inicio ? 'border-red-500' : ''}
                                        />
                                        {errors.fecha_inicio && (
                                            <p className="text-red-500 text-sm mt-1">{errors.fecha_inicio}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-2">
                                            Fecha de Fin <span className="text-gray-600">(Opcional)</span>
                                        </label>
                                        <Input
                                            type="date"
                                            name="fecha_fin"
                                            value={formData.fecha_fin || ''}
                                            onChange={handleChange}
                                        />
                                        <p className="text-gray-500 text-xs mt-1">
                                            Dejar vacío para sin límite de fecha
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Sección 4: Roles */}
                            <div className="space-y-4 pb-6 border-b">
                                <h2 className="text-lg font-semibold">Roles Destinatarios</h2>
                                <p className="text-gray-600 text-sm">
                                    Selecciona a qué roles se enviará esta notificación. Si no seleccionas ninguno, se enviará a todos.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {roles.map((role) => (
                                        <label key={role.id} className="flex items-center gap-2 cursor-pointer">
                                            <Checkbox
                                                checked={(formData.roles || []).includes(role.id)}
                                                onCheckedChange={() => handleRolChange(role.id)}
                                            />
                                            <span className="text-sm capitalize">{role.display_name || role.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Sección 5: Estado */}
                            <div className="space-y-4 pb-6">
                                <h2 className="text-lg font-semibold">Configuración</h2>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <Checkbox
                                        checked={formData.activo || false}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, activo: checked as boolean })
                                        }
                                    />
                                    <span className="text-sm font-medium">
                                        Activar esta notificación
                                    </span>
                                </label>
                            </div>

                            {/* Botones */}
                            <div className="flex gap-4 justify-end pt-6 border-t">
                                <Link href="/notificaciones">
                                    <Button type="button" variant="outline">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button type="submit" disabled={loading} className="gap-2">
                                    {loading ? '...' : '✓'} Crear Notificación
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
