import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';

export default function AppLogo() {
    const { auth } = usePage().props as any;

    // ✅ DEBUG: Ver qué llega del backend
    // console.log('🔍 [AppLogo] Auth completo:', auth);
    // console.log('🔍 [AppLogo] Usuario:', auth?.user);
    // console.log('🔍 [AppLogo] Empresa:', auth?.user?.empresa);

    // ✅ MEJORADO (2026-04-16): Obtener empresa del usuario dinámicamente
    // El logo y nombre cambian según la empresa a la que pertenece el usuario
    const empresa = useMemo(() => {
        if (auth?.user?.empresa) {
            const nombreEmpresa = auth.user.empresa.nombre_comercial || auth.user.empresa.razon_social || 'Sin empresa';

            // 🔍 Estrategia de fallback para obtener logo
            let logoUsado = '';
            let logoFuente = '';

            if (auth.user.empresa.logo_principal) {
                logoUsado = auth.user.empresa.logo_principal;
                logoFuente = 'logo_principal (BD)';
            } else if (auth.user.empresa.logo_compacto) {
                logoUsado = auth.user.empresa.logo_compacto;
                logoFuente = 'logo_compacto (BD)';
            } else if (auth.user.empresa.logo_footer) {
                logoUsado = auth.user.empresa.logo_footer;
                logoFuente = 'logo_footer (BD)';
            } else {
                logoUsado = import.meta.env.VITE_LOGO_SVG || '/logo.svg';
                logoFuente = 'variable entorno (FALLBACK)';
            }

            const empresaData = {
                nombre: nombreEmpresa,
                logo: logoUsado
            };

            /* console.log('✅ [AppLogo] Empresa encontrada:', {
                ...empresaData,
                fuente_logo: logoFuente,
                logos_disponibles: {
                    logo_principal: !!auth.user.empresa.logo_principal,
                    logo_compacto: !!auth.user.empresa.logo_compacto,
                    logo_footer: !!auth.user.empresa.logo_footer
                }
            }); */

            return empresaData;
        }

        // Fallback a variables de entorno si no hay empresa
        const fallback = {
            nombre: import.meta.env.VITE_LOGO_ALT || 'Distribuidora Paucara',
            logo: import.meta.env.VITE_LOGO_SVG || '/logo.svg'
        };
        /* console.log('⚠️ [AppLogo] Usando fallback (sin empresa):', fallback); */
        return fallback;
    }, [auth?.user?.empresa]);

    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                <img src={empresa.logo} alt={empresa.nombre} className="h-12 w-auto object-contain" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">{empresa.nombre}</span>
            </div>
        </>
    );
}
