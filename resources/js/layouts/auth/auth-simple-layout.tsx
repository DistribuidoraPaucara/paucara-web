import { home } from '@/routes';
import { Link, usePage } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface SiteConfiguration {
    nombre: string;
    imagen: string | null;
}

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    const { props } = usePage<{ site?: SiteConfiguration | null }>();
    const logoSvg = props.site?.imagen || import.meta.env.VITE_LOGO_SVG || '/logo.svg';
    const logoAlt = props.site?.nombre || import.meta.env.VITE_LOGO_ALT || 'Distribuidora Paucara';

    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-gradient-to-br from-background via-background to-red-50/20 p-6 dark:from-black dark:via-zinc-950 dark:to-red-950/20 md:p-10">
            {/* Patrón de puntos de fondo */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(0_0_0/0.05)_1px,transparent_0)] dark:bg-[radial-gradient(circle_at_1px_1px,rgb(255_255_255/0.03)_1px,transparent_0)] [background-size:24px_24px]" />

            {/* Gradiente decorativo flotante */}
            <div className="absolute -left-32 -top-32 h-64 w-64 animate-pulse rounded-full bg-red-500/10 blur-3xl dark:bg-red-500/5" />
            <div className="absolute -bottom-32 -right-32 h-64 w-64 animate-pulse rounded-full bg-red-500/10 blur-3xl animation-delay-2000 dark:bg-red-500/5" />

            <div className="relative z-10 w-full max-w-sm animate-in fade-in zoom-in-95 duration-500">
                <div className="flex flex-col gap-8">
                    {/* Logo y encabezado */}
                    <div className="flex flex-col items-center gap-4">
                        <Link href={home()} className="group flex flex-col items-center gap-2 font-medium">
                            <div className="relative mb-1 rounded-2xl bg-gradient-to-br from-red-500 via-red-500/50 to-transparent p-px shadow-lg shadow-red-500/15 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-red-500/25">
                                <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-[15px] border border-white/60 bg-background/95 p-2 backdrop-blur dark:border-white/10 dark:bg-zinc-950/90">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgb(239_68_68/0.16),transparent_52%)]" />
                                    <img src={logoSvg} alt={logoAlt} className="relative z-10 h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/25 to-white/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:via-white/10" />
                                </div>
                                <div className="absolute -inset-3 -z-10 rounded-full bg-red-500/15 blur-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-2xl font-semibold tracking-tight text-transparent">
                                {title}
                            </h1>
                            <p className="text-sm text-muted-foreground/80">{description}</p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
