// Presentation Layer: Generic pagination component - Enhanced UI
import { Button } from '@/presentation/components/ui/button';
import { router } from '@inertiajs/react';
import type { PaginationLink } from '@/domain/entities/shared';
import NotificationService from '@/infrastructure/services/notification.service';

interface GenericPaginationProps {
  links: PaginationLink[];
  isLoading?: boolean;
}

export default function GenericPagination({ links, isLoading = false }: GenericPaginationProps) {
  // ✅ MEJORA: Normalizar URL para evitar contenido mixto
  const normalizeUrl = (url: string): string => {
    if (!url) return url;

    // Si la URL comienza con http://, convertir a URL relativa
    if (url.startsWith('http://')) {
      try {
        const parsedUrl = new URL(url);
        const currentUrl = new URL(window.location.href);

        // Si es el mismo dominio, usar ruta relativa
        if (parsedUrl.hostname === currentUrl.hostname) {
          const normalizedUrl = parsedUrl.pathname + parsedUrl.search + parsedUrl.hash;
          console.warn(`[Pagination] URL normalizada: ${url} → ${normalizedUrl}`);
          return normalizedUrl;
        }
      } catch (e) {
        console.warn('[Pagination] Error parseando URL:', url, e);
      }
    }

    return url;
  };

  const handlePageNavigation = (url: string | null, label: string) => {
    if (url && !isLoading) {
      // ✅ MEJORA: Normalizar URL antes de navegar
      const normalizedUrl = normalizeUrl(url);

      // Mostrar notificación de navegación más elegante
      const cleanLabel = getCleanLabel(label);
      if (cleanLabel.includes('Anterior')) {
        NotificationService.info('Navegando a la página anterior...');
      } else if (cleanLabel.includes('Siguiente')) {
        NotificationService.info('Navegando a la página siguiente...');
      } else if (!isNaN(Number(cleanLabel))) {
        NotificationService.info(`Navegando a la página ${cleanLabel}...`);
      }

      router.get(normalizedUrl, {}, {
        preserveState: false,
        preserveScroll: false,
        onError: (errors) => {
          NotificationService.error('Error al navegar entre páginas');
          console.error('Pagination errors:', errors);
        }
      });
    }
  };

  // Función para limpiar y traducir las etiquetas
  const getCleanLabel = (label: string): string => {
    // Limpiar HTML entities y elementos
    const cleanHtml = label.replace(/&laquo;|&raquo;|<[^>]*>/g, '').trim();

    // Traducir textos comunes de paginación
    if (label.includes('pagination.previous') || label.includes('&laquo;') || cleanHtml === 'Previous') {
      return 'Anterior';
    }
    if (label.includes('pagination.next') || label.includes('&raquo;') || cleanHtml === 'Next') {
      return 'Siguiente';
    }

    return cleanHtml || label;
  };

  // Función para obtener el icono apropiado
  const getButtonIcon = (label: string) => {
    if (label.includes('pagination.previous') || label.includes('&laquo;')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      );
    }
    if (label.includes('pagination.next') || label.includes('&raquo;')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      );
    }
    return null;
  };

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center">
      <nav className="flex items-center space-x-1" aria-label="Navegación de páginas">
        {links.map((link, index) => {
          const cleanLabel = getCleanLabel(link.label);
          const icon = getButtonIcon(link.label);
          const isNumericPage = !isNaN(Number(cleanLabel));
          const isPrevNext = cleanLabel === 'Anterior' || cleanLabel === 'Siguiente';

          return (
            <Button
              key={index}
              variant={link.active ? 'default' : 'ghost'}
              size="sm"
              disabled={!link.url || isLoading}
              onClick={() => handlePageNavigation(link.url, link.label)}
              className={`
                min-w-[2.5rem] h-9
                ${link.active
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                  : 'hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-700 dark:hover:text-blue-300 border border-border'
                }
                ${isPrevNext ? 'px-3' : 'px-2'}
                ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                transition-all duration-200 ease-in-out
                font-medium text-sm
              `}
              title={isPrevNext ? cleanLabel : `Ir a la página ${cleanLabel}`}
            >
              {isPrevNext ? (
                <div className="flex items-center gap-1.5">
                  {icon}
                  <span>{cleanLabel}</span>
                </div>
              ) : (
                <span className={isNumericPage && link.active ? 'font-bold' : ''}>{cleanLabel}</span>
              )}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
