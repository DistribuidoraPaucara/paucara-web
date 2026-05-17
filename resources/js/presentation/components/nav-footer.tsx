import { Icon } from '@/presentation/components/icon';
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/presentation/components/ui/sidebar';
import { type NavItem } from '@/types';
import { type ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export function NavFooter({
    items,
    className,
    ...props
}: ComponentPropsWithoutRef<typeof SidebarGroup> & {
    items: NavItem[];
}) {
    const { state } = useSidebar();

    return (
        <SidebarGroup {...props} className={`group-data-[collapsible=icon]:p-0 ${className || ''}`}>
            <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                    {items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                                asChild
                                className={cn(
                                    // Base styles
                                    "group relative flex items-center justify-between w-full px-3 py-2.5 rounded-lg",
                                    "transition-all duration-200 ease-out",
                                    // Hover state
                                    "hover:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent/40",
                                    // Text colors
                                    "text-sidebar-foreground/70 dark:text-sidebar-foreground/60"
                                )}
                                tooltip={state === "collapsed" ? item.title : undefined}
                            >
                                <a href={typeof item.href === 'string' ? item.href : item.href.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 w-full min-w-0">
                                    {item.icon && (
                                        <div className={cn(
                                            "flex-shrink-0 h-5 w-5 rounded-md flex items-center justify-center",
                                            "transition-all duration-200",
                                            "bg-sidebar-foreground/5 dark:bg-sidebar-foreground/10 text-sidebar-foreground/70 dark:text-sidebar-foreground/60",
                                            "group-hover:bg-sidebar-foreground/10 dark:group-hover:bg-sidebar-foreground/15"
                                        )}>
                                            <Icon iconNode={item.icon} className="h-4 w-4" />
                                        </div>
                                    )}
                                    <span className="truncate text-sm font-medium">{item.title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
