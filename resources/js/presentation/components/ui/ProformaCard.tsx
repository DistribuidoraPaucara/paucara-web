import { Card, CardContent, CardHeader, CardTitle } from './card';
import { cn } from '@/lib/utils';

type CardVariant = 'default' | 'highlighted' | 'info' | 'warning';

interface ProformaCardProps {
  variant?: CardVariant;
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  footerAction?: React.ReactNode;
  // ✅ Nuevo: acción en el header (ej: botón toggle para mostrar/ocultar)
  headerAction?: React.ReactNode;
  // ✅ Nuevo: control de visibilidad del contenido
  isCollapsed?: boolean;
}

const variantStyles: Record<CardVariant, string> = {
  default: '',
  highlighted: 'border-l-4 border-l-[var(--brand-primary)] bg-[var(--surface-highlighted)]',
  info: 'border-l-4 border-l-[var(--brand-accent)] bg-[var(--surface-info)]',
  warning: 'border-l-4 border-l-[var(--status-warning)] bg-[var(--surface-warning)]',
};

export function ProformaCard({
  variant = 'default',
  title,
  icon,
  children,
  className,
  footerAction,
  headerAction,
  isCollapsed = false
}: ProformaCardProps) {
  return (
    <Card className={cn(variantStyles[variant], className)}>
      {title && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2 text-lg">
            <span className="flex items-center gap-2">
              {icon}
              {title}
            </span>
            {/* ✅ Mostrar acción en el header si está disponible */}
            {headerAction && <div className="ml-auto">{headerAction}</div>}
          </CardTitle>
        </CardHeader>
      )}
      {/* ✅ Solo mostrar contenido si no está colapsado */}
      {!isCollapsed && (
        <>
          <CardContent className={!title ? 'pt-6' : ''}>
            {children}
          </CardContent>
          {footerAction && (
            <CardContent className="border-t pt-4 flex justify-end">
              {footerAction}
            </CardContent>
          )}
        </>
      )}
    </Card>
  );
}
