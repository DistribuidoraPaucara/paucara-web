// Presentation Layer: Tabla de códigos de barra
import { Button } from '@/presentation/components/ui/button';
import type { CodigoBarra } from '@/domain/entities/codigos-barra';

interface CodigosBarraTableProps {
  codigos: CodigoBarra[];
  onEdit: (codigo: CodigoBarra) => void;
  onDelete: (codigo: CodigoBarra) => void;
  onMarcarPrincipal: (codigo: CodigoBarra) => void;
  isLoading?: boolean;
}

export default function CodigosBarraTable({
  codigos,
  onEdit,
  onDelete,
  onMarcarPrincipal,
  isLoading = false,
}: CodigosBarraTableProps) {
  if (codigos.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No se encontraron códigos de barra
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-muted text-muted-foreground">
            <th className="p-2 text-left">Código</th>
            <th className="p-2 text-left">Tipo</th>
            <th className="p-2 text-center">Principal</th>
            <th className="p-2 text-center">Estado</th>
            <th className="p-2 text-left w-48">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {codigos.map((codigo) => (
            <tr
              key={codigo.id}
              className="border-t hover:bg-muted/50"
            >
              <td className="p-2 font-mono font-semibold">{codigo.codigo}</td>
              <td className="p-2">
                <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  {codigo.tipo_label || codigo.tipo}
                </span>
              </td>
              <td className="p-2 text-center">
                {codigo.es_principal ? (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    ★ Principal
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="p-2 text-center">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    codigo.activo
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {codigo.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="p-2">
                <div className="flex gap-1">
                  {codigo.activo && !codigo.es_principal && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onMarcarPrincipal(codigo)}
                      disabled={isLoading}
                      title="Marcar como principal"
                    >
                      ★
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(codigo)}
                    disabled={isLoading}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(codigo)}
                    disabled={isLoading}
                  >
                    Inactivar
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
