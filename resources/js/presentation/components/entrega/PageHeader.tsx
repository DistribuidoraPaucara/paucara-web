interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  stats?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  stats,
  className = ''
}: PageHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <div className="flex-1">
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
        {stats && <div className="mt-2">{stats}</div>}
      </div>
      {actions && (
        <div className="flex gap-2 flex-shrink-0">{actions}</div>
      )}
    </div>
  );
}
