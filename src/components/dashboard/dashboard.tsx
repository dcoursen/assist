'use client';

import { useState, useEffect, useCallback } from 'react';
import { FilterOptions, ClientMetrics } from '@/types';
import { MetricsCard } from './metrics-card';
import { MetricsTable } from './metrics-table';
import { FilterBar } from './filter-bar';
import { toast } from 'sonner';

export function Dashboard() {
  const [metrics, setMetrics] = useState<ClientMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: '30d',
  });

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        dateRange: filters.dateRange,
      });

      if (filters.clientId) {
        params.append('clientId', filters.clientId);
      }

      const response = await fetch(`/api/metrics?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch metrics');
      }

      const data = await response.json();
      setMetrics(data.metrics || []);

      // Show error toast if any client failed
      const failedClients = data.metrics?.filter((m: ClientMetrics) => m.status === 'error') || [];
      if (failedClients.length > 0) {
        failedClients.forEach((client: ClientMetrics) => {
          toast.error(`Error loading ${client.clientName}`, {
            description: client.error || 'Unknown error',
          });
        });
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast.error('Failed to load dashboard data', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  // Calculate aggregate metrics
  const successfulMetrics = metrics.filter((m) => m.status === 'success');
  const totalCampaigns = successfulMetrics.reduce((sum, m) => sum + m.totalCampaigns, 0);
  const totalRecipients = successfulMetrics.reduce((sum, m) => sum + m.totalRecipients, 0);
  const totalOpens = successfulMetrics.reduce((sum, m) => sum + m.totalOpens, 0);
  const totalClicks = successfulMetrics.reduce((sum, m) => sum + m.totalClicks, 0);
  const avgOpenRate =
    successfulMetrics.length > 0
      ? successfulMetrics.reduce((sum, m) => sum + m.avgOpenRate, 0) / successfulMetrics.length
      : 0;
  const avgClickRate =
    successfulMetrics.length > 0
      ? successfulMetrics.reduce((sum, m) => sum + m.avgClickRate, 0) / successfulMetrics.length
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Klaviyo campaign performance across all clients
        </p>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onRefresh={fetchMetrics}
        loading={loading}
      />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricsCard
          title="Total Campaigns"
          value={totalCampaigns.toLocaleString()}
          subtitle={`Across ${successfulMetrics.length} ${
            successfulMetrics.length === 1 ? 'client' : 'clients'
          }`}
          loading={loading}
        />
        <MetricsCard
          title="Total Recipients"
          value={totalRecipients.toLocaleString()}
          subtitle="Total email sends"
          loading={loading}
        />
        <MetricsCard
          title="Average Open Rate"
          value={`${avgOpenRate.toFixed(2)}%`}
          subtitle={`${totalOpens.toLocaleString()} total opens`}
          loading={loading}
        />
        <MetricsCard
          title="Average Click Rate"
          value={`${avgClickRate.toFixed(2)}%`}
          subtitle={`${totalClicks.toLocaleString()} total clicks`}
          loading={loading}
        />
      </div>

      {/* Metrics Table */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Client Performance</h2>
        <MetricsTable data={metrics} loading={loading} />
      </div>
    </div>
  );
}
