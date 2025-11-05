import { Client } from '@/types';

/**
 * Client Configuration
 *
 * Add your Klaviyo clients here. Each client should have:
 * - id: Unique identifier for the client
 * - name: Display name for the client
 * - apiKey: Klaviyo Private API Key for this client
 * - color: Optional hex color for visual distinction
 *
 * IMPORTANT: For production, consider moving API keys to environment variables
 * and fetching client configuration from a secure backend.
 */

export const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Garden Center North',
    apiKey: process.env.KLAVIYO_CLIENT_1_API_KEY || '',
    color: '#10b981', // green
  },
  {
    id: 'client-2',
    name: 'Garden Center South',
    apiKey: process.env.KLAVIYO_CLIENT_2_API_KEY || '',
    color: '#3b82f6', // blue
  },
  {
    id: 'client-3',
    name: 'Garden Center East',
    apiKey: process.env.KLAVIYO_CLIENT_3_API_KEY || '',
    color: '#8b5cf6', // purple
  },
  // Add more clients as needed
];

/**
 * Get a client by ID
 */
export function getClientById(id: string): Client | undefined {
  return clients.find((client) => client.id === id);
}

/**
 * Get all active clients (those with API keys configured)
 */
export function getActiveClients(): Client[] {
  return clients.filter((client) => client.apiKey && client.apiKey.length > 0);
}
