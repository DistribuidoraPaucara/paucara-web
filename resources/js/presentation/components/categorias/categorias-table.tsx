// Presentation Layer: Componente para la tabla de categorías
import { Button } from '@/presentation/components/ui/button';
import type { Categoria } from '@/domain/entities/categorias';

interface CategoriasTableProps {
  categorias: Categoria[];
  onEdit: (categoria: Categoria) => void;
  onDelete: (categoria: Categoria) => void;
  isLoading?: boolean;
}

export default function CategoriasTable({
  categorias,
  onEdit,
  onDelete,
  isLoading = false
}: CategoriasTableProps) {
  if (categorias.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron categorías
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Descripción</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-left w-40">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map((categoria) => (
            <tr key={categoria.id} className="border-t hover:bg-muted/50">
              <td className="p-2 font-medium">{categoria.id}</td>
              <td className="p-2">{categoria.nombre}</td>
              <td className="p-2 text-muted-foreground">
                {categoria.descripcion || '-'}
              </td>
              <td className="p-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  categoria.activo
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {categoria.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="p-2">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(categoria)}
                    disabled={isLoading}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(categoria)}
                    disabled={isLoading}
                  >
                    Eliminar
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
