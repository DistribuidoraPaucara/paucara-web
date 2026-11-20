import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { Card, CardContent } from '@/presentation/components/ui/card';
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
import notificacionesService, {
    type Frecuencia,
    type NotificacionPayload,
    type NotificacionRecurrente,
    type Role,
    type TipoNotificacion,
} from '@/infrastructure/services/notificaciones.service';
import { FrecuenciaNotificacionInput, type FrecuenciaValue } from './FrecuenciaNotificacionInput';
import { HorariosNotificacionInput, validarHorarios, type Horario } from './HorariosNotificacionInput';
import { ImagenNotificacionInput } from './ImagenNotificacionInput';
import { ProximosEnviosPreview } from './ProximosEnviosPreview';
import type { Programacion } from './programacion';

const TIPOS: { value: TipoNotificacion; label: string }[] = [
    { value: 'promocion', label: '🎁 Promoción' },
    { value: 'evento', label: '🎉 Evento' },
    { value: 'informativo', label: 'ℹ️ Informativo' },
    { value: 'oferta', label: '🏷️ Oferta' },
];

/** Estado del formulario: todos los campos presentes, con valores listos para los inputs. */
export interface NotificacionFormValues {
    titulo: string;
    descripcion: string;
    tipo: TipoNotificacion;
    frecuencia: Frecuencia;
    dias_semana: string[];
    dia_mes: number | null;
    fecha_inicio: string; // YYYY-MM-DD
    fecha_fin: string; // YYYY-MM-DD o '' (sin límite)
    activo: boolean;
    roles: number[];
    horarios: Horario[];
    imagen_url: string;
}

type Errores = Partial<Record<keyof NotificacionFormValues, string>>;

// Fecha de hoy en hora local (YYYY-MM-DD). toISOString() usa UTC y en Bolivia (UTC-4)
// devuelve el día siguiente a partir de las 20:00.
const hoyLocal = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const aFechaInput = (fecha?: string | null) => (fecha ? fecha.split('T')[0] : '');

export const valoresNuevaNotificacion = (): NotificacionFormValues => ({
    titulo: '',
    descripcion: '',
    tipo: 'informativo',
    frecuencia: 'una_vez',
    dias_semana: [],
    dia_mes: 1,
    fecha_inicio: hoyLocal(),
    fecha_fin: '',
    activo: true,
    roles: [],
    horarios: [{ hora: '09:00', activo: true }],
    imagen_url: '',
});

export const valoresDesdeNotificacion = (n: NotificacionRecurrente): NotificacionFormValues => ({
    titulo: n.titulo ?? '',
    descripcion: n.descripcion ?? '',
    tipo: n.tipo,
    frecuencia: n.frecuencia,
    dias_semana: n.dias_semana ?? [],
    dia_mes: n.dia_mes ?? null,
    fecha_inicio: aFechaInput(n.fecha_inicio),
    fecha_fin: aFechaInput(n.fecha_fin),
    activo: n.activo,
    roles: n.roles?.map((r) => r.id) ?? [],
    // El backend puede devolver HH:mm:ss
    horarios: (n.horarios ?? []).map((h) => ({
        id: h.id,
        hora: h.hora.substring(0, 5),
        activo: h.activo ?? true,
        ultimo_envio: h.ultimo_envio ?? null,
    })),
    imagen_url: n.imagen_url ?? '',
});

const aPayload = (v: NotificacionFormValues): NotificacionPayload => ({
    titulo: v.titulo.trim(),
    descripcion: v.descripcion.trim(),
    tipo: v.tipo,
    frecuencia: v.frecuencia,
    // hora_envio es legado: el backend la deriva del primer horario
    horarios: v.horarios.map(({ id, hora, activo }) => ({ id, hora, activo })),
    fecha_inicio: v.fecha_inicio,
    fecha_fin: v.fecha_fin || null,
    dias_semana: v.dias_semana,
    dia_mes: v.dia_mes,
    activo: v.activo,
    imagen_url: v.imagen_url || null,
    roles: v.roles,
});

const validar = (v: NotificacionFormValues): Errores => {
    const e: Errores = {};
    if (!v.titulo.trim()) e.titulo = 'El título es requerido';
    if (!v.descripcion.trim()) e.descripcion = 'La descripción es requerida';
    if (!v.fecha_inicio) e.fecha_inicio = 'La fecha de inicio es requerida';
    if (v.fecha_fin && v.fecha_inicio && v.fecha_fin < v.fecha_inicio) {
        e.fecha_fin = 'La fecha de fin no puede ser anterior a la de inicio';
    }
    const errorHorarios = validarHorarios(v.horarios);
    if (errorHorarios) e.horarios = errorHorarios;
    if (v.frecuencia === 'semanal' && v.dias_semana.length === 0) {
        e.dias_semana = 'Selecciona al menos un día para frecuencia semanal';
    }
    if (v.frecuencia === 'mensual' && (!v.dia_mes || v.dia_mes < 1 || v.dia_mes > 31)) {
        e.dia_mes = 'El día debe estar entre 1 y 31';
    }
    return e;
};

/** Lo que el formulario expone a los botones extra (p. ej. "Enviar ahora" en Edit). */
export interface NotificacionFormContexto {
    values: NotificacionFormValues;
    hayCambios: boolean;
    ocupado: boolean;
    /** Valida y guarda en el servidor. Devuelve true si se guardó. */
    guardar: () => Promise<boolean>;
    /** "todos los usuarios" o la lista de roles elegidos */
    destinatarios: string;
}

interface NotificacionFormProps {
    valoresIniciales: NotificacionFormValues;
    textoGuardar: string;
    /** Llama al servicio (crear o actualizar). Debe lanzar el error de axios si falla. */
    guardarEnServidor: (payload: NotificacionPayload) => Promise<unknown>;
    /** Se ejecuta tras guardar con el botón principal (toast + redirección). */
    alGuardar: () => void;
    accionesExtra?: (ctx: NotificacionFormContexto) => ReactNode;
}

function Seccion({ titulo, descripcion, children }: { titulo: string; descripcion?: string; children: ReactNode }) {
    return (
        <section className="space-y-4 border-b pb-6 last:border-b-0">
            <div>
                <h2 className="text-lg font-semibold">{titulo}</h2>
                {descripcion && <p className="text-sm text-muted-foreground">{descripcion}</p>}
            </div>
            {children}
        </section>
    );
}

const Requerido = () => <span className="text-red-600 dark:text-red-400">*</span>;

const ErrorCampo = ({ mensaje }: { mensaje?: string }) =>
    mensaje ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{mensaje}</p> : null;

const claseError = (mensaje?: string) => (mensaje ? 'border-red-500 dark:border-red-400' : '');

export function NotificacionForm({
    valoresIniciales,
    textoGuardar,
    guardarEnServidor,
    alGuardar,
    accionesExtra,
}: NotificacionFormProps) {
    const [values, setValues] = useState(valoresIniciales);
    // Última versión guardada, para saber si hay cambios pendientes
    const [guardado, setGuardado] = useState(() => JSON.stringify(valoresIniciales));
    const [errors, setErrors] = useState<Errores>({});
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(false);

    const hayCambios = JSON.stringify(values) !== guardado;

    // Solo los campos que afectan a cuándo se envía (evita recalcular la vista previa al escribir el título)
    const { frecuencia, dias_semana, dia_mes, fecha_inicio, fecha_fin, horarios } = values;
    const programacion = useMemo<Programacion>(
        () => ({ frecuencia, dias_semana, dia_mes, fecha_inicio, fecha_fin, horarios }),
        [frecuencia, dias_semana, dia_mes, fecha_inicio, fecha_fin, horarios],
    );

    useEffect(() => {
        notificacionesService
            .obtenerRoles()
            .then(setRoles)
            .catch((error) => {
                console.error('Error cargando roles:', error);
                toast.error('Error al cargar los roles');
            });
    }, []);

    // Actualiza campos y limpia sus errores
    const actualizar = (cambios: Partial<NotificacionFormValues>) => {
        setValues((prev) => ({ ...prev, ...cambios }));
        const campos = Object.keys(cambios) as (keyof NotificacionFormValues)[];
        if (campos.some((c) => errors[c])) {
            setErrors((prev) => {
                const siguiente = { ...prev };
                campos.forEach((c) => delete siguiente[c]);
                return siguiente;
            });
        }
    };

    const cambiarFrecuencia = (c: FrecuenciaValue) => {
        const cambios: Partial<NotificacionFormValues> = {};
        if (c.frecuencia) cambios.frecuencia = c.frecuencia;
        if (c.dias_semana) cambios.dias_semana = c.dias_semana;
        if (c.dia_mes !== undefined) cambios.dia_mes = c.dia_mes;
        actualizar(cambios);
    };

    const toggleRol = (rolId: number) => {
        actualizar({
            roles: values.roles.includes(rolId) ? values.roles.filter((r) => r !== rolId) : [...values.roles, rolId],
        });
    };

    const guardar = async (): Promise<boolean> => {
        const nuevosErrores = validar(values);
        setErrors(nuevosErrores);
        if (Object.keys(nuevosErrores).length > 0) {
            toast.error('Por favor revisa los campos marcados');
            return false;
        }

        setLoading(true);
        try {
            await guardarEnServidor(aPayload(values));
            setGuardado(JSON.stringify(values));
            return true;
        } catch (error: any) {
            // Mostrar errores de validación del backend junto a cada campo
            const backendErrors = error.response?.data?.errors as Record<string, string[]> | undefined;
            if (backendErrors) {
                const mapeados: Errores = {};
                Object.entries(backendErrors).forEach(([clave, mensajes]) => {
                    const campo = (clave.startsWith('horarios') ? 'horarios' : clave.split('.')[0]) as keyof NotificacionFormValues;
                    mapeados[campo] ??= mensajes[0];
                });
                setErrors(mapeados);
            }
            toast.error(error.response?.data?.message || 'Error al guardar la notificación');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (await guardar()) alGuardar();
    };

    const rolesElegidos = roles.filter((r) => values.roles.includes(r.id));
    const destinatarios =
        rolesElegidos.length > 0 ? rolesElegidos.map((r) => r.display_name || r.name).join(', ') : 'todos los usuarios';

    return (
        <Card>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Seccion titulo="Contenido">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div className="md:col-span-2">
                                <label className="mb-2 block text-sm font-medium">
                                    Título <Requerido />
                                </label>
                                <Input
                                    type="text"
                                    value={values.titulo}
                                    onChange={(e) => actualizar({ titulo: e.target.value })}
                                    placeholder="ej: Descuento de Fin de Semana"
                                    maxLength={255}
                                    className={claseError(errors.titulo)}
                                />
                                <ErrorCampo mensaje={errors.titulo} />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Tipo <Requerido />
                                </label>
                                <Select
                                    value={values.tipo}
                                    onValueChange={(tipo) => actualizar({ tipo: tipo as TipoNotificacion })}
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

                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Descripción <Requerido />
                            </label>
                            <Textarea
                                value={values.descripcion}
                                onChange={(e) => actualizar({ descripcion: e.target.value })}
                                placeholder="ej: 20% en todos nuestros productos este fin de semana"
                                rows={4}
                                className={claseError(errors.descripcion)}
                            />
                            <ErrorCampo mensaje={errors.descripcion} />
                        </div>
                    </Seccion>

                    <Seccion titulo="Recurrencia">
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            <FrecuenciaNotificacionInput
                                frecuencia={values.frecuencia}
                                dias_semana={values.dias_semana}
                                dia_mes={values.dia_mes}
                                onChange={cambiarFrecuencia}
                                errors={{ dias_semana: errors.dias_semana, dia_mes: errors.dia_mes }}
                            />
                            <HorariosNotificacionInput
                                horarios={values.horarios}
                                onChange={(horarios) => actualizar({ horarios })}
                                error={errors.horarios}
                                frecuencia={values.frecuencia}
                                diasSemana={values.dias_semana}
                                diaMes={values.dia_mes}
                                fechaInicio={values.fecha_inicio}
                            />
                        </div>
                    </Seccion>

                    <Seccion titulo="Vigencia">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Fecha de Inicio <Requerido />
                                </label>
                                <Input
                                    type="date"
                                    value={values.fecha_inicio}
                                    onChange={(e) => actualizar({ fecha_inicio: e.target.value })}
                                    className={claseError(errors.fecha_inicio)}
                                />
                                <ErrorCampo mensaje={errors.fecha_inicio} />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium">
                                    Fecha de Fin <span className="text-muted-foreground">(Opcional)</span>
                                </label>
                                <Input
                                    type="date"
                                    value={values.fecha_fin}
                                    min={values.fecha_inicio || undefined}
                                    onChange={(e) => actualizar({ fecha_fin: e.target.value })}
                                    className={claseError(errors.fecha_fin)}
                                />
                                {errors.fecha_fin ? (
                                    <ErrorCampo mensaje={errors.fecha_fin} />
                                ) : (
                                    <p className="mt-1 text-xs text-muted-foreground">Dejar vacío para sin límite de fecha</p>
                                )}
                            </div>
                        </div>
                    </Seccion>

                    <Seccion titulo="Próximos envíos" descripcion="Así quedará programada con la configuración actual.">
                        <ProximosEnviosPreview programacion={programacion} activo={values.activo} />
                    </Seccion>

                    <Seccion
                        titulo="Roles Destinatarios"
                        descripcion="Selecciona a qué roles se enviará esta notificación. Si no seleccionas ninguno, se enviará a todos."
                    >
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                            {roles.map((role) => (
                                <label key={role.id} className="flex cursor-pointer items-center gap-2">
                                    <Checkbox
                                        checked={values.roles.includes(role.id)}
                                        onCheckedChange={() => toggleRol(role.id)}
                                    />
                                    <span className="text-sm capitalize">{role.display_name || role.name}</span>
                                </label>
                            ))}
                        </div>
                        <ErrorCampo mensaje={errors.roles} />
                    </Seccion>

                    <Seccion
                        titulo="Imagen (Opcional)"
                        descripcion="Imagen que se mostrará en la notificación. Si no eliges una, se usa la imagen por defecto."
                    >
                        <ImagenNotificacionInput
                            value={values.imagen_url}
                            onChange={(imagen_url) => actualizar({ imagen_url })}
                            error={errors.imagen_url}
                        />
                    </Seccion>

                    <Seccion titulo="Configuración">
                        <label className="flex cursor-pointer items-center gap-3">
                            <Checkbox
                                checked={values.activo}
                                onCheckedChange={(checked) => actualizar({ activo: checked === true })}
                            />
                            <span className="text-sm font-medium">Activar esta notificación</span>
                        </label>
                    </Seccion>

                    <div className="flex flex-wrap justify-end gap-3 border-t pt-6">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/notificaciones">Cancelar</Link>
                        </Button>
                        {accionesExtra?.({ values, hayCambios, ocupado: loading, guardar, destinatarios })}
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Guardando...' : textoGuardar}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
