// Presentation Layer: Paginación para tipos de operación de caja
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLinks {
  url: string | null;
  label: string;
  active: boolean;
}

interface TipoOperacionCajaPaginationProps {
  links: PaginationLinks[];
  onPageChange: (url: string) => void;
}

// Decodificar entidades HTML
const decodeHtml = (html: string): string => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export default function TipoOperacionCajaPagination({
  links,
  onPageChange
}: TipoOperacionCajaPaginationProps) {
  if (links.length <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2">
      {links.map((link, index) => {
        if (link.label.includes('Previous')) {
          return (
            <button
              key={index}
              onClick={() => link.url && onPageChange(link.url)}
              disabled={!link.url}
              className="rounded-lg border border-gray-300 dark:border-gray-600 p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          );
        }

        if (link.label.includes('Next')) {
          return (
            <button
              key={index}
              onClick={() => link.url && onPageChange(link.url)}
              disabled={!link.url}
              className="rounded-lg border border-gray-300 dark:border-gray-600 p-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          );
        }

        return (
          <button
            key={index}
            onClick={() => link.url && onPageChange(link.url)}
            disabled={!link.url || link.active}
            className={`rounded-lg border px-3 py-1 text-sm ${
              link.active
                ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium'
                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {decodeHtml(link.label)}
          </button>
        );
      })}
    </div>
  );
}
