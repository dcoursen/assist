import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface MetricsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function MetricsCard({
  title,
  value,
  subtitle,
  icon,
  loading = false,
  trend,
}: MetricsCardProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            <Skeleton className="h-4 w-24" />
          </CardTitle>
          {icon && <Skeleton className="h-4 w-4 rounded" />}
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-1" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend && (
          <div
            className={`text-xs mt-1 ${
              trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
          </div>
        )}
      </CardContent>
    </Card>
  );
}
