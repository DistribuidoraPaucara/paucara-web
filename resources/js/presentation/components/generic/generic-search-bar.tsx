// Presentation Layer: Generic search bar component
import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';

interface GenericSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  placeholder?: string;
  isLoading?: boolean;
}

export default function GenericSearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  onClear,
  placeholder = "Buscar...",
  isLoading = false
}: GenericSearchBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="w-full sm:w-64">
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          placeholder={placeholder}
          disabled={isLoading}
        />
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onSearch}
          disabled={isLoading}
        >
          {isLoading ? 'Buscando...' : 'Buscar'}
        </Button>
        {searchQuery && (
          <Button
            variant="ghost"
            onClick={onClear}
            disabled={isLoading}
          >
            Limpiar
          </Button>
        )}
      </div>
    </div>
  );
}
