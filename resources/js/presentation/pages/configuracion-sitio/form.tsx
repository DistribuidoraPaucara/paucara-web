import AppLayout from '@/layouts/app-layout';
import InputError from '@/presentation/components/input-error';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ImagePlus, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ConfiguracionSitio {
    nombre: string;
    imagen: string | null;
}

interface ConfiguracionSitioFormProps {
    configuracion: ConfiguracionSitio | null;
}

export default function ConfiguracionSitioForm({ configuracion }: ConfiguracionSitioFormProps) {
    const form = useForm({
        nombre: configuracion?.nombre ?? '',
        imagen: null as File | null,
    });
    const [preview, setPreview] = useState<string | null>(configuracion?.imagen ?? null);

    useEffect(() => {
        return () => {
            if (preview?.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const seleccionarImagen = (file: File | null) => {
        form.setData('imagen', file);

        if (!file) {
            setPreview(configuracion?.imagen ?? null);
            return;
        }

        setPreview(URL.createObjectURL(file));
    };

    const enviar = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        form.post('/configuracion-sitio', { forceFormData: true });
    };

    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Configuración del sitio', href: '/configuracion-sitio' },
            { title: 'Editar', href: '/configuracion-sitio/editar' },
        ]}>
            <div className="mx-auto w-full max-w-3xl p-4 md:p-6">
                <div className="mb-6 flex items-center gap-3">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/configuracion-sitio" aria-label="Volver a configuración del sitio">
                            <ArrowLeft />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-semibold">Editar configuración del sitio</h1>
                        <p className="text-sm text-muted-foreground">Los cambios se reflejarán en el login.</p>
                    </div>
                </div>

                <form onSubmit={enviar} className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
                    <div className="grid gap-2">
                        <Label htmlFor="nombre">Nombre del sitio</Label>
                        <Input
                            id="nombre"
                            value={form.data.nombre}
                            onChange={(event) => form.setData('nombre', event.target.value)}
                            placeholder="Ej. Distribuidora Paucara"
                            disabled={form.processing}
                        />
                        <InputError message={form.errors.nombre} />
                    </div>

                    <div className="grid gap-3">
                        <Label htmlFor="imagen">Imagen o logotipo</Label>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                            <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-lg border bg-muted/40 p-3">
                                {preview ? (
                                    <img src={preview} alt="Vista previa del logotipo" className="max-h-full max-w-full object-contain" />
                                ) : (
                                    <ImagePlus className="size-8 text-muted-foreground" />
                                )}
                            </div>
                            <div className="flex-1 space-y-2">
                                <Input
                                    id="imagen"
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={(event) => seleccionarImagen(event.target.files?.[0] ?? null)}
                                    disabled={form.processing}
                                />
                                <p className="text-xs text-muted-foreground">Formatos permitidos: JPG, PNG o WEBP. Tamaño máximo: 5 MB.</p>
                                <InputError message={form.errors.imagen} />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-6">
                        <Button variant="outline" type="button" asChild>
                            <Link href="/configuracion-sitio">Cancelar</Link>
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save /> {form.processing ? 'Guardando...' : 'Guardar cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
