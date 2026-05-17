import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/presentation/components/ui/dropdown-menu';
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/presentation/components/ui/sidebar';
import { UserInfo } from '@/presentation/components/user-info';
import { UserMenuContent } from '@/presentation/components/user-menu-content';
import { useIsMobile } from '@/presentation/hooks/use-mobile';
import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function NavUser() {
    const { auth } = usePage<SharedData>().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={cn(
                                // Base styles
                                "group relative flex items-center justify-between w-full px-3 py-2.5 rounded-lg",
                                "transition-all duration-200 ease-out",
                                // Hover and active states
                                "hover:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent/40",
                                "data-[state=open]:bg-sidebar-accent/20 dark:data-[state=open]:bg-sidebar-accent/15",
                                // Border for visual definition
                                "border border-sidebar-foreground/10 dark:border-sidebar-foreground/10",
                                "hover:border-sidebar-accent/30 dark:hover:border-sidebar-accent/30",
                                "data-[state=open]:border-sidebar-accent/30 dark:data-[state=open]:border-sidebar-accent/30"
                            )}
                            tooltip={state === "collapsed" ? `Menú de ${auth.user.name}` : undefined}
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className={cn(
                                "ml-auto size-4 flex-shrink-0 transition-transform duration-300",
                                "group-data-[state=open]:rotate-180"
                            )} />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        align="end"
                        side={isMobile ? 'bottom' : state === 'collapsed' ? 'left' : 'bottom'}
                    >
                        <UserMenuContent user={auth.user} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
