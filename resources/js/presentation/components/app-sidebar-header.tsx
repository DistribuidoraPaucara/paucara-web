import { Breadcrumbs } from '@/presentation/components/breadcrumbs';
import { SidebarTrigger } from '@/presentation/components/ui/sidebar';
import ProformaNotificationPanel from '@/presentation/components/proforma-notification-panel';
import { CajaStatusIndicator } from '@/presentation/components/caja-status-indicator';
import { type BreadcrumbItem as BreadcrumbItemType } from '@/types';
export function AppSidebarHeader({ breadcrumbs = [] }: { breadcrumbs?: BreadcrumbItemType[] }) {
    return (
        <header className="fixed top-0 right-0 left-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 bg-white/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-white/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4 dark:bg-zinc-900/95 dark:supports-[backdrop-filter]:bg-zinc-900/60">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            {/* ✅ Indicadores en el lado derecho */}
            <div className="ml-auto flex items-center gap-3">
                {/* ✅ Indicador de estado de caja */}
                <CajaStatusIndicator />
                {/* ✅ Panel de notificaciones de proformas */}
                <ProformaNotificationPanel />
            </div>
        </header>
    );
}
