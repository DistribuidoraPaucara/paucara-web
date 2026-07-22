import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

interface PaginationLinksProps {
  links: PaginationLink[];
}

export function PaginationLinks({ links }: PaginationLinksProps) {
  if (!links || links.length === 0) {
    return null;
  }

  const cleanLabel = (label: string): string => {
    return label
      .replace(/^&laquo;\s*/, '')
      .replace(/\s*&raquo;$/, '')
      .trim();
  };

  return (
    <div className="flex items-center justify-center gap-1 py-6">
      {links.map((link, index) => {
        const label = cleanLabel(link.label);
        const isArrow = label === '<' || label === '>' || label.includes('Previous') || label.includes('Next');
        const isDisabled = !link.url;

        if (isDisabled) {
          return (
            <button
              key={index}
              disabled
              className="p-2 rounded border border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed dark:bg-gray-800 dark:border-gray-600"
            >
              {isArrow ? (
                label.includes('Previous') || label === '<' ? (
                  <ChevronLeft className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              ) : (
                label
              )}
            </button>
          );
        }

        if (link.active) {
          return (
            <button
              key={index}
              disabled
              className="px-3 py-2 rounded border border-blue-500 bg-blue-500 text-white font-medium text-sm"
            >
              {label}
            </button>
          );
        }

        return (
          <Link
            key={index}
            href={link.url}
            className="px-3 py-2 rounded border border-gray-300 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            {isArrow ? (
              label.includes('Previous') || label === '<' ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            ) : (
              label
            )}
          </Link>
        );
      })}
    </div>
  );
}
