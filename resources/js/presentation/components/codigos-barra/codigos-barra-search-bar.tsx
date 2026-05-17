// Presentation Layer: Barra de búsqueda de códigos de barra
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { X, Search } from 'lucide-react';

interface CodigosBarraSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading?: boolean;
}

export default function CodigosBarraSearchBar({
  searchQuery,
  onSearchChange,
  onSearch,
  onClear,
  isLoading = false,
}: CodigosBarraSearchBarProps) {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex gap-2 mb-4">
      <div className="flex-1">
        <Input
          placeholder="Buscar por código..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          className="w-full"
        />
      </div>
      <Button
        onClick={onSearch}
        disabled={isLoading || !searchQuery}
        variant="default"
      >
        <Search className="w-4 h-4 mr-2" />
        Buscar
      </Button>
      <Button
        onClick={onClear}
        disabled={isLoading || !searchQuery}
        variant="outline"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
