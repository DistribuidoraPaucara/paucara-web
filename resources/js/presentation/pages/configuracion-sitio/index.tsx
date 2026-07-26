import AppLayout from '@/layouts/app-layout';
import { Button } from '@/presentation/components/ui/button';
import { Link } from '@inertiajs/react';
import { Image, Pencil } from 'lucide-react';

interface ConfiguracionSitio {
    nombre: string;
    imagen: string | null;
}

interface ConfiguracionSitioIndexProps {
    configuracion: ConfiguracionSitio | null;
}

export default function ConfiguracionSitioIndex({ configuracion }: ConfiguracionSitioIndexProps) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Configuración del sitio', href: '/configuracion-sitio' },
        ]}>
            <div className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-semibold">Configuración del sitio</h1>
                        <p className="text-sm text-muted-foreground">Nombre e imagen que se muestran en la pantalla de inicio de sesión.</p>
                    </div>
                    <Button asChild>
                        <Link href="/configuracion-sitio/editar">
                            <Pencil /> Editar
                        </Link>
                    </Button>
                </div>

                <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                    <div className="grid gap-6 p-6 sm:grid-cols-[160px_1fr] sm:items-center">
                        <div className="flex aspect-square items-center justify-center rounded-lg border bg-muted/40 p-4">
                            {configuracion?.imagen ? (
                                <img src={configuracion.imagen} alt={configuracion.nombre} className="max-h-full max-w-full object-contain" />
                            ) : (
                                <Image className="size-10 text-muted-foreground" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Nombre del sitio</p>
                            <p className="text-lg font-medium">{configuracion?.nombre ?? 'Sin configurar'}</p>
                            <p className="pt-3 text-sm text-muted-foreground">La imagen se usa como logotipo en el login.</p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
