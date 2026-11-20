import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar';
import { useInitials } from '@/presentation/hooks/use-initials';
import { type User } from '@/types';

/** Orden de importancia para elegir el rol que se muestra primero. */
const PRIORIDAD_ROLES = ['super admin', 'admin', 'manager', 'cajero', 'preventista', 'chofer', 'compras', 'vendedor', 'cliente'];

/** Nombre legible del rol ("super admin" → "Super Admin", "precios-manager" → "Precios manager"). */
function etiquetaRol(rol: string): string {
    const limpio = rol.replace(/[-_]/g, ' ').trim();
    return limpio.charAt(0).toUpperCase() + limpio.slice(1);
}

/** Roles ordenados por importancia (los desconocidos al final, en orden alfabético). */
function ordenarRoles(roles: string[]): string[] {
    const peso = (r: string) => {
        const i = PRIORIDAD_ROLES.indexOf(r.toLowerCase());
        return i === -1 ? PRIORIDAD_ROLES.length : i;
    };
    // Sin duplicados por mayúsculas ("Chofer" y "chofer")
    const unicos = [...new Map(roles.map((r) => [r.toLowerCase(), r])).values()];
    return unicos.sort((a, b) => peso(a) - peso(b) || a.localeCompare(b));
}

export function UserInfo({
    user,
    showEmail = false,
    roles = [],
}: {
    user: User;
    showEmail?: boolean;
    /** Si se pasa, muestra el rol principal (+N si tiene más; todos en el tooltip). */
    roles?: string[];
}) {
    const getInitials = useInitials();
    const ordenados = ordenarRoles(roles);
    const principal = ordenados[0];
    const extra = ordenados.length - 1;

    return (
        <>
            <Avatar className="h-8 w-8 overflow-hidden rounded-full">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                    {getInitials(user.name)}
                </AvatarFallback>
            </Avatar>
            <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                {principal && (
                    <span
                        className="truncate text-xs text-muted-foreground"
                        title={ordenados.map(etiquetaRol).join(', ')}
                    >
                        {etiquetaRol(principal)}
                        {extra > 0 && <span className="ml-1 opacity-70">+{extra}</span>}
                    </span>
                )}
                {showEmail && <span className="truncate text-xs text-muted-foreground">{user.email}</span>}
            </div>
        </>
    );
}
