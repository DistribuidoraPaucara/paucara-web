// Presentation Layer: Barra de búsqueda para tipos de operación de caja
import { Search } from 'lucide-react';
import { useState } from 'react';

interface TipoOperacionCajaSearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onSubmit: (query: string) => void;
  placeholder?: string;
}

export default function TipoOperacionCajaSearchBar({
  query,
  onQueryChange,
  onSubmit,
  placeholder = 'Buscar por código o nombre...'
}: TipoOperacionCajaSearchBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:focus:border-indigo-400 dark:focus:ring-indigo-400"
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e as any)}
        />
      </div>
    </form>
  );
}
