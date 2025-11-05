import { KlaviyoCampaignResponse, KlaviyoMetricResponse, CampaignMetrics } from '@/types';

const KLAVIYO_API_BASE = 'https://a.klaviyo.com/api';
const API_VERSION = '2024-10-15';

/**
 * Base fetch wrapper for Klaviyo API calls
 */
async function klaviyoFetch<T>(
  endpoint: string,
  apiKey: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${KLAVIYO_API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Klaviyo-API-Key ${apiKey}`,
      'revision': API_VERSION,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Klaviyo API error (${response.status}): ${errorText || response.statusText}`
    );
  }

  return response.json();
}

/**
 * Fetch campaigns for a client
 */
export async function fetchCampaigns(
  apiKey: string,
  filter?: {
    startDate?: string;
    endDate?: string;
  }
): Promise<KlaviyoCampaignResponse> {
  let endpoint = '/campaigns?fields[campaign]=name,status,send_time';

  // Add date filtering if provided
  if (filter?.startDate) {
    endpoint += `&filter=greater-or-equal(send_time,${filter.startDate})`;
  }
  if (filter?.endDate) {
    endpoint += `&filter=less-or-equal(send_time,${filter.endDate})`;
  }

  return klaviyoFetch<KlaviyoCampaignResponse>(endpoint, apiKey);
}

/**
 * Fetch metrics for a specific campaign
 */
export async function fetchCampaignMetrics(
  campaignId: string,
  apiKey: string
): Promise<KlaviyoMetricResponse> {
  const endpoint = `/campaign-messages/${campaignId}/metrics`;
  return klaviyoFetch<KlaviyoMetricResponse>(endpoint, apiKey);
}

/**
 * Process campaign data into metrics format
 */
export function processCampaignData(
  campaign: KlaviyoCampaignResponse['data'][0],
  metrics?: KlaviyoMetricResponse['data']
): CampaignMetrics {
  const recipients = metrics?.attributes?.recipients || 0;
  const opens = metrics?.attributes?.unique_opens || 0;
  const clicks = metrics?.attributes?.unique_clicks || 0;

  return {
    id: campaign.id,
    name: campaign.attributes.name,
    status: campaign.attributes.status as CampaignMetrics['status'],
    sentAt: campaign.attributes.send_time,
    recipients,
    opens,
    clicks,
    openRate: recipients > 0 ? (opens / recipients) * 100 : 0,
    clickRate: recipients > 0 ? (clicks / recipients) * 100 : 0,
  };
}

/**
 * Calculate date range filter
 */
export function getDateRangeFilter(range: '7d' | '30d' | '90d' | 'all'): {
  startDate?: string;
  endDate?: string;
} {
  if (range === 'all') {
    return {};
  }

  const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: startDate.toISOString(),
    endDate: new Date().toISOString(),
  };
}
