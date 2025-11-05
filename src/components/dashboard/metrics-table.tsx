import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ClientMetrics } from '@/types';

interface MetricsTableProps {
  data: ClientMetrics[];
  loading?: boolean;
}

function formatNumber(num: number): string {
  return num.toLocaleString();
}

function formatPercentage(num: number): string {
  return `${num.toFixed(2)}%`;
}

function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function LoadingRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-24" />
      </TableCell>
    </TableRow>
  );
}

export function MetricsTable({ data, loading = false }: MetricsTableProps) {
  if (loading) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className="text-right">Campaigns</TableHead>
              <TableHead className="text-right">Recipients</TableHead>
              <TableHead className="text-right">Opens</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="text-right">Open Rate</TableHead>
              <TableHead className="text-right">Click Rate</TableHead>
              <TableHead className="text-right">Last Campaign</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[1, 2, 3].map((i) => (
              <LoadingRow key={i} />
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        No data available. Please configure your Klaviyo API keys.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead className="text-right">Campaigns</TableHead>
            <TableHead className="text-right">Recipients</TableHead>
            <TableHead className="text-right">Opens</TableHead>
            <TableHead className="text-right">Clicks</TableHead>
            <TableHead className="text-right">Open Rate</TableHead>
            <TableHead className="text-right">Click Rate</TableHead>
            <TableHead className="text-right">Last Campaign</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((client) => (
            <TableRow
              key={client.clientId}
              className="transition-colors hover:bg-muted/50"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {client.clientName}
                  {client.status === 'error' && (
                    <Badge variant="destructive" className="text-xs">
                      Error
                    </Badge>
                  )}
                  {client.status === 'loading' && (
                    <Badge variant="secondary" className="text-xs">
                      Loading
                    </Badge>
                  )}
                </div>
                {client.error && (
                  <div className="text-xs text-red-600 mt-1">{client.error}</div>
                )}
              </TableCell>
              <TableCell className="text-right">
                {client.status === 'success' ? formatNumber(client.totalCampaigns) : '-'}
              </TableCell>
              <TableCell className="text-right">
                {client.status === 'success' ? formatNumber(client.totalRecipients) : '-'}
              </TableCell>
              <TableCell className="text-right">
                {client.status === 'success' ? formatNumber(client.totalOpens) : '-'}
              </TableCell>
              <TableCell className="text-right">
                {client.status === 'success' ? formatNumber(client.totalClicks) : '-'}
              </TableCell>
              <TableCell className="text-right">
                {client.status === 'success' ? (
                  <span
                    className={
                      client.avgOpenRate > 20
                        ? 'text-green-600 font-medium'
                        : client.avgOpenRate > 10
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }
                  >
                    {formatPercentage(client.avgOpenRate)}
                  </span>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-right">
                {client.status === 'success' ? (
                  <span
                    className={
                      client.avgClickRate > 3
                        ? 'text-green-600 font-medium'
                        : client.avgClickRate > 1
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }
                  >
                    {formatPercentage(client.avgClickRate)}
                  </span>
                ) : (
                  '-'
                )}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {client.status === 'success' ? formatDate(client.lastCampaignDate) : '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
