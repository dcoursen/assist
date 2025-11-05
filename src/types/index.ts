// Client configuration
export interface Client {
  id: string;
  name: string;
  apiKey: string;
  color?: string;
}

// Campaign metrics from Klaviyo
export interface CampaignMetrics {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'canceled';
  sentAt?: string;
  recipients: number;
  opens: number;
  clicks: number;
  openRate: number;
  clickRate: number;
  conversions?: number;
  revenue?: number;
}

// Client metrics aggregated
export interface ClientMetrics {
  clientId: string;
  clientName: string;
  totalCampaigns: number;
  totalRecipients: number;
  totalOpens: number;
  totalClicks: number;
  avgOpenRate: number;
  avgClickRate: number;
  totalRevenue?: number;
  lastCampaignDate?: string;
  status: 'loading' | 'success' | 'error';
  error?: string;
  campaigns?: CampaignMetrics[];
}

// Filter options
export interface FilterOptions {
  dateRange: 'all' | '7d' | '30d' | '90d';
  startDate?: string;
  endDate?: string;
  clientId?: string;
}

// API Response types
export interface KlaviyoCampaignResponse {
  data: Array<{
    id: string;
    type: string;
    attributes: {
      name: string;
      status: string;
      send_time?: string;
      audiences?: {
        included: string[];
      };
    };
  }>;
  links?: {
    next?: string;
    prev?: string;
  };
}

export interface KlaviyoMetricResponse {
  data: {
    id: string;
    type: string;
    attributes: {
      unique_opens?: number;
      unique_clicks?: number;
      recipients?: number;
    };
  };
}
