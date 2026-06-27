import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from './button';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationProps {
  links: PaginationLink[];
  onPageChange: (url: string) => void;
  currentPage?: number;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

// Decodificar entidades HTML
const decodeHtmlEntities = (text: string): string => {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
};

export function Pagination({
  links,
  onPageChange,
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 20,
}: PaginationProps) {
  if (!links || links.length === 0) return null;

  // Filtrar links (Laravel pagination retorna labels como "1", "2", etc.)
  const prevLink = links.find((l) => decodeHtmlEntities(l.label).toLowerCase().includes('previous'));
  const nextLink = links.find((l) => decodeHtmlEntities(l.label).toLowerCase().includes('next'));
  const pageLinks = links.filter(
    (l) => {
      const decodedLabel = decodeHtmlEntities(l.label).toLowerCase();
      return !decodedLabel.includes('previous') && !decodedLabel.includes('next');
    }
  );

  const calculateStartItem = () => {
    return (currentPage - 1) * itemsPerPage + 1;
  };

  const calculateEndItem = () => {
    return Math.min(currentPage * itemsPerPage, totalItems);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Información de paginación */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div>
            Mostrando <span className="font-semibold">{calculateStartItem()}</span> a{' '}
            <span className="font-semibold">{calculateEndItem()}</span> de{' '}
            <span className="font-semibold">{totalItems}</span> registros
          </div>
          <div className="text-xs">
            Página <span className="font-semibold">{currentPage}</span> de{' '}
            <span className="font-semibold">{totalPages}</span>
          </div>
        </div>
      )}

      {/* Controles de paginación */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {/* Primera página */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(pageLinks[0]?.url || '#')}
          disabled={!prevLink?.url || currentPage === 1}
          className="dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Anterior */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => prevLink?.url && onPageChange(prevLink.url)}
          disabled={!prevLink?.url}
          className="dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Números de página */}
        <div className="flex gap-1">
          {pageLinks.slice(0, 5).map((link, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={link.active ? 'default' : 'outline'}
              onClick={() => link.url && onPageChange(link.url)}
              disabled={!link.url}
              className={
                link.active
                  ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white'
                  : 'dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700'
              }
            >
              {decodeHtmlEntities(link.label)}
            </Button>
          ))}

          {/* Mostrar ... si hay más páginas */}
          {pageLinks.length > 5 && (
            <>
              <span className="px-2 py-1 text-gray-400">...</span>
              {pageLinks.slice(-2).map((link, idx) => (
                <Button
                  key={`last-${idx}`}
                  size="sm"
                  variant={link.active ? 'default' : 'outline'}
                  onClick={() => link.url && onPageChange(link.url)}
                  disabled={!link.url}
                  className={
                    link.active
                      ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white'
                      : 'dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700'
                  }
                >
                  {decodeHtmlEntities(link.label)}
                </Button>
              ))}
            </>
          )}
        </div>

        {/* Siguiente */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => nextLink?.url && onPageChange(nextLink.url)}
          disabled={!nextLink?.url}
          className="dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Última página */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onPageChange(pageLinks[pageLinks.length - 1]?.url || '#')}
          disabled={!nextLink?.url || currentPage === totalPages}
          className="dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
