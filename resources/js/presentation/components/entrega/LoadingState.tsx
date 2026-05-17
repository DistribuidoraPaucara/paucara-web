import { Card, CardContent, CardHeader, CardTitle } from '@/presentation/components/ui/card';

interface LoadingStateProps {
  variant?: 'card' | 'table' | 'list' | 'skeleton';
  count?: number;
  title?: string;
  className?: string;
}

export function LoadingState({
  variant = 'card',
  count = 5,
  title,
  className
}: LoadingStateProps) {
  if (variant === 'card') {
    return (
      <Card className={className}>
        {title && (
          <CardHeader>
            <CardTitle className="text-sm font-medium animate-pulse bg-muted h-5 w-32 rounded" />
          </CardHeader>
        )}
        <CardContent className="space-y-3">
          {[...Array(count)].map((_, i) => (
            <div
              key={i}
              className="h-12 bg-muted animate-pulse rounded"
            />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'table') {
    return (
      <div className="space-y-3">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="h-12 bg-muted animate-pulse rounded"
          />
        ))}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-2">
        {[...Array(count)].map((_, i) => (
          <div
            key={i}
            className="h-16 bg-muted animate-pulse rounded"
          />
        ))}
      </div>
    );
  }

  // skeleton variant (default)
  return (
    <div className={`space-y-3 ${className}`}>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="h-8 bg-muted animate-pulse rounded w-full"
        />
      ))}
    </div>
  );
}
