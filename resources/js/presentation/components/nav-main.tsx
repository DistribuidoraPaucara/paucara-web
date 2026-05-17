import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from '@/presentation/components/ui/sidebar';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';
import { InertiaLinkProps } from '@inertiajs/react';

interface NavMainProps {
    items: NavItem[];
}

// Helper function to extract URL string from href
const getUrlString = (href: NonNullable<InertiaLinkProps['href']> | undefined): string => {
    if (!href) {
        return '';
    }
    if (typeof href === 'string') {
        return href;
    }
    // If it's an object with url property (UrlMethodPair)
    return href.url || '';
};

export function NavMain({ items }: NavMainProps) {
    const { url } = usePage();
    const { state } = useSidebar();
    // Estado para controlar qué elementos están expandidos
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

    // Función para verificar si una URL está activa
    // Solo marca como activo si es exacta coincidencia o es el padre de un hijo activo
    const isActive = (href: NonNullable<InertiaLinkProps['href']> | undefined) => {
        if (!href) return false;
        const urlString = getUrlString(href);
        if (!urlString) return false;
        if (urlString === '/') return url === '/';
        // Exact match only - prevents parent items from being marked as active by child URLs
        return url === urlString;
    };

    // Función para verificar si un item padre debe estar activo
    const isParentActive = (item: NavItem) => {
        if (item.href && isActive(item.href)) return true;
        if (item.children) {
            return item.children.some(child => child.href && isActive(child.href));
        }
        return false;
    };

    // Expandir automáticamente los items activos al cargar
    useEffect(() => {
        const activeParents = new Set<string>();
        items.forEach(item => {
            if (item.children && item.children.some(child => {
                if (!child.href) return false;
                const childUrlString = getUrlString(child.href);
                if (!childUrlString) return false;
                if (childUrlString === '/') return url === '/';
                // Exact match only
                return url === childUrlString;
            })) {
                activeParents.add(item.title);
            }
        });
        setExpandedItems(activeParents);
    }, [url, items]);

    const toggleExpanded = (title: string) => {
        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(title)) {
                newSet.delete(title);
            } else {
                newSet.add(title);
            }
            return newSet;
        });
    };

    return (
        <SidebarGroup className="py-4">
            <SidebarGroupLabel className="px-2 py-2 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60 dark:text-sidebar-foreground/50">
                Navegación
            </SidebarGroupLabel>
            <SidebarMenu className="gap-0.5">
                {items.map((item, index) => {
                    const isExpanded = expandedItems.has(item.title);
                    const hasChildren = item.children && item.children.length > 0;
                    const itemActive = isParentActive(item);
                    // Use id if available, otherwise fallback to title or index
                    const itemKey = item.id ?? item.title ?? `item-${index}`;

                    return (
                        <SidebarMenuItem key={itemKey} className="relative">
                            <SidebarMenuButton
                                asChild={!hasChildren}
                                onClick={hasChildren ? () => toggleExpanded(item.title) : undefined}
                                className={cn(
                                    // Base styles
                                    "group relative flex items-center justify-between w-full px-3 py-2.5 rounded-lg",
                                    "transition-all duration-200 ease-out",
                                    // Hover state
                                    "hover:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent/40",
                                    // Active state with better visual feedback
                                    itemActive && cn(
                                        "bg-sidebar-accent/15 dark:bg-sidebar-accent/20",
                                        "border-l-3 border-l-blue-500 dark:border-l-blue-400",
                                        "text-sidebar-accent-foreground font-semibold"
                                    ),
                                    hasChildren && "cursor-pointer"
                                )}
                                data-active={itemActive}
                                tooltip={state === "collapsed" ? item.title : undefined}
                            >
                                {hasChildren ? (
                                    <div className="flex items-center justify-between w-full gap-2">
                                        <div className="flex items-center gap-3 min-w-0">
                                            {item.icon && (
                                                <div className={cn(
                                                    "flex-shrink-0 h-5 w-5 rounded-md flex items-center justify-center",
                                                    "transition-all duration-200",
                                                    itemActive
                                                        ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                                                        : "bg-sidebar-foreground/5 dark:bg-sidebar-foreground/10 text-sidebar-foreground/70 dark:text-sidebar-foreground/60"
                                                )}>
                                                    <item.icon className="h-4 w-4" />
                                                </div>
                                            )}
                                            <span className="truncate text-sm font-medium">{item.title}</span>
                                        </div>
                                        <div className={cn(
                                            "flex-shrink-0 transition-transform duration-300",
                                            isExpanded && "rotate-180"
                                        )}>
                                            <ChevronDown className="h-4 w-4 text-sidebar-foreground/50 dark:text-sidebar-foreground/40" />
                                        </div>
                                    </div>
                                ) : item.href ? (
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex items-center gap-3 w-full min-w-0",
                                            isActive(item.href) && "text-sidebar-accent-foreground"
                                        )}
                                    >
                                        {item.icon && (
                                            <div className={cn(
                                                "flex-shrink-0 h-5 w-5 rounded-md flex items-center justify-center",
                                                "transition-all duration-200",
                                                isActive(item.href)
                                                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                                                    : "bg-sidebar-foreground/5 dark:bg-sidebar-foreground/10 text-sidebar-foreground/70 dark:text-sidebar-foreground/60"
                                            )}>
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                        )}
                                        <span className="truncate text-sm font-medium">{item.title}</span>
                                    </Link>
                                ) : (
                                    <div className="flex items-center gap-3 w-full min-w-0 opacity-50 cursor-not-allowed">
                                        {item.icon && (
                                            <div className="flex-shrink-0 h-5 w-5 rounded-md flex items-center justify-center bg-sidebar-foreground/5 dark:bg-sidebar-foreground/10 text-sidebar-foreground/70 dark:text-sidebar-foreground/60">
                                                <item.icon className="h-4 w-4" />
                                            </div>
                                        )}
                                        <span className="truncate text-sm font-medium">{item.title}</span>
                                    </div>
                                )}
                            </SidebarMenuButton>

                            {/* Submenu con animación mejorada */}
                            {hasChildren && isExpanded && (
                                <SidebarMenuSub className="animate-in fade-in slide-in-from-top-1 duration-200 ml-0 mt-1 border-l border-sidebar-foreground/10 dark:border-sidebar-foreground/10">
                                    {item.children!.map((child, childIndex) => {
                                        const childKey = child.id ?? child.title ?? `child-${itemKey}-${childIndex}`;
                                        return (
                                        <SidebarMenuSubItem key={childKey} className="relative">
                                            <SidebarMenuSubButton
                                                asChild={!!child.href}
                                                className={cn(
                                                    // Base styles
                                                    "group relative flex items-center gap-3 px-3 py-2 rounded-md",
                                                    "transition-all duration-200 ease-out",
                                                    "text-xs font-medium",
                                                    // Hover
                                                    child.href && "hover:bg-sidebar-accent/40 dark:hover:bg-sidebar-accent/30",
                                                    // Active
                                                    child.href && isActive(child.href) && cn(
                                                        "bg-blue-50 dark:bg-blue-900/20",
                                                        "text-blue-600 dark:text-blue-400",
                                                        "font-semibold"
                                                    ),
                                                    child.href && !isActive(child.href) && "text-sidebar-foreground/70 dark:text-sidebar-foreground/60",
                                                    !child.href && "opacity-50 cursor-not-allowed"
                                                )}
                                                data-active={child.href && isActive(child.href)}
                                            >
                                                {child.href ? (
                                                    <Link
                                                        href={child.href}
                                                        className="flex items-center gap-3 w-full"
                                                    >
                                                        {child.icon && (
                                                            <child.icon className={cn(
                                                                "h-3.5 w-3.5 flex-shrink-0",
                                                                isActive(child.href) ? "text-blue-600 dark:text-blue-400" : "text-sidebar-foreground/50 dark:text-sidebar-foreground/40"
                                                            )} />
                                                        )}
                                                        {!child.icon && (
                                                            <div className={cn(
                                                                "h-2 w-2 rounded-full flex-shrink-0",
                                                                isActive(child.href) ? "bg-blue-600 dark:bg-blue-400" : "bg-sidebar-foreground/30 dark:bg-sidebar-foreground/20"
                                                            )} />
                                                        )}
                                                        <span className="truncate">{child.title}</span>
                                                    </Link>
                                                ) : (
                                                    <div className="flex items-center gap-3 w-full">
                                                        {child.icon && (
                                                            <child.icon className="h-3.5 w-3.5 flex-shrink-0 text-sidebar-foreground/50 dark:text-sidebar-foreground/40" />
                                                        )}
                                                        {!child.icon && (
                                                            <div className="h-2 w-2 rounded-full flex-shrink-0 bg-sidebar-foreground/30 dark:bg-sidebar-foreground/20" />
                                                        )}
                                                        <span className="truncate">{child.title}</span>
                                                    </div>
                                                )}
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                        );
                                    })}
                                </SidebarMenuSub>
                            )}
                        </SidebarMenuItem>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
