// Presentation Layer: Componente para paginación
import { Button } from '@/presentation/components/ui/button';
import { router } from '@inertiajs/react';
import type { PaginationLink } from '@/domain/entities/shared';

interface CategoriasPaginationProps {
  links: PaginationLink[];
  isLoading?: boolean;
}

export default function CategoriasPagination({ links, isLoading = false }: CategoriasPaginationProps) {
  const handlePageNavigation = (url: string | null) => {
    if (url && !isLoading) {
      router.visit(url);
    }
  };

  if (!links || links.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {links.map((link, index) => (
        <Button
          key={index}
          variant={link.active ? 'secondary' : 'outline'}
          size="sm"
          disabled={!link.url || isLoading}
          onClick={() => handlePageNavigation(link.url)}
          className="min-w-[2rem]"
        >
          <span dangerouslySetInnerHTML={{ __html: link.label }} />
        </Button>
      ))}
    </div>
  );
}
