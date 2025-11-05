import { NextRequest, NextResponse } from 'next/server';
import { getActiveClients } from '@/lib/klaviyo/clients';
import { fetchCampaigns, getDateRangeFilter, processCampaignData } from '@/lib/klaviyo/api';
import { ClientMetrics, FilterOptions } from '@/types';

/**
 * GET /api/metrics
 *
 * Fetches metrics for all configured clients from Klaviyo
 * Query parameters:
 * - dateRange: '7d' | '30d' | '90d' | 'all'
 * - clientId: Optional filter for specific client
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateRange = (searchParams.get('dateRange') || 'all') as FilterOptions['dateRange'];
    const clientId = searchParams.get('clientId') || undefined;

    // Get clients to fetch data for
    const allClients = getActiveClients();
    const clients = clientId
      ? allClients.filter((c) => c.id === clientId)
      : allClients;

    if (clients.length === 0) {
      return NextResponse.json(
        { error: 'No active clients configured' },
        { status: 400 }
      );
    }

    // Fetch data for all clients in parallel
    const metricsPromises = clients.map(async (client) => {
      try {
        // Get date filter
        const dateFilter = dateRange !== 'all' ? getDateRangeFilter(dateRange) : {};

        // Fetch campaigns
        const campaignsResponse = await fetchCampaigns(client.apiKey, dateFilter);

        // Process campaigns into metrics
        const campaigns = campaignsResponse.data.map((campaign) =>
          processCampaignData(campaign)
        );

        // Calculate aggregated metrics
        const totalCampaigns = campaigns.length;
        const totalRecipients = campaigns.reduce((sum, c) => sum + c.recipients, 0);
        const totalOpens = campaigns.reduce((sum, c) => sum + c.opens, 0);
        const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);

        const avgOpenRate =
          totalCampaigns > 0
            ? campaigns.reduce((sum, c) => sum + c.openRate, 0) / totalCampaigns
            : 0;

        const avgClickRate =
          totalCampaigns > 0
            ? campaigns.reduce((sum, c) => sum + c.clickRate, 0) / totalCampaigns
            : 0;

        const lastCampaignDate = campaigns.length > 0
          ? campaigns
              .filter((c) => c.sentAt)
              .sort((a, b) => new Date(b.sentAt!).getTime() - new Date(a.sentAt!).getTime())[0]
              ?.sentAt
          : undefined;

        const metrics: ClientMetrics = {
          clientId: client.id,
          clientName: client.name,
          totalCampaigns,
          totalRecipients,
          totalOpens,
          totalClicks,
          avgOpenRate,
          avgClickRate,
          lastCampaignDate,
          status: 'success',
          campaigns,
        };

        return metrics;
      } catch (error) {
        // Return error state for this client
        const metrics: ClientMetrics = {
          clientId: client.id,
          clientName: client.name,
          totalCampaigns: 0,
          totalRecipients: 0,
          totalOpens: 0,
          totalClicks: 0,
          avgOpenRate: 0,
          avgClickRate: 0,
          status: 'error',
          error: error instanceof Error ? error.message : 'Failed to fetch data',
        };

        return metrics;
      }
    });

    // Wait for all requests to complete
    const metrics = await Promise.all(metricsPromises);

    return NextResponse.json({ metrics });
  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
