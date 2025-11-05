# Klaviyo Dashboard - Multi-Client Campaign Analytics

A modern, responsive dashboard for tracking Klaviyo campaign performance across multiple garden center clients. Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

- **Multi-Client Support**: Track campaigns across multiple Klaviyo accounts simultaneously
- **Real-time Metrics**: View campaign performance including open rates, click rates, and engagement
- **Date Filtering**: Filter campaigns by date range (7d, 30d, 90d, or all time)
- **Parallel API Calls**: Fetch data from multiple clients concurrently for optimal performance
- **Error Handling**: Graceful error handling with toast notifications per client
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Professional UI**: Clean, modern interface using shadcn/ui components
- **TypeScript**: Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **API**: Klaviyo REST API
- **Notifications**: Sonner (toast notifications)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Klaviyo Private API Keys for each client
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd assist
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Edit `.env.local` and add your Klaviyo API keys:
```env
KLAVIYO_CLIENT_1_API_KEY=pk_your_first_client_api_key
KLAVIYO_CLIENT_2_API_KEY=pk_your_second_client_api_key
KLAVIYO_CLIENT_3_API_KEY=pk_your_third_client_api_key
```

5. Configure your clients in `src/lib/klaviyo/clients.ts`:
```typescript
export const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Your Client Name',
    apiKey: process.env.KLAVIYO_CLIENT_1_API_KEY || '',
    color: '#10b981', // Optional: custom color
  },
  // Add more clients as needed
];
```

6. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Getting Klaviyo API Keys

1. Log in to your Klaviyo account
2. Navigate to **Settings** → **Account** → **API Keys**
3. Create a new **Private API Key** with the following scopes:
   - `campaigns:read`
   - `campaign-messages:read`
   - `metrics:read`
4. Copy the API key and add it to your `.env.local` file
5. Repeat for each client account

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── metrics/
│   │       └── route.ts        # API route for fetching Klaviyo data
│   ├── layout.tsx              # Root layout with Toaster
│   └── page.tsx                # Main dashboard page
├── components/
│   ├── dashboard/
│   │   ├── dashboard.tsx       # Main dashboard component
│   │   ├── filter-bar.tsx      # Date range filtering
│   │   ├── metrics-card.tsx    # Summary metric cards
│   │   └── metrics-table.tsx   # Client performance table
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── klaviyo/
│   │   ├── api.ts              # Klaviyo API utilities
│   │   └── clients.ts          # Client configuration
│   └── utils.ts                # Utility functions
└── types/
    └── index.ts                # TypeScript type definitions
```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub, GitLab, or Bitbucket

2. Import your repository to Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Vercel will automatically detect Next.js

3. Configure environment variables in Vercel:
   - Go to **Settings** → **Environment Variables**
   - Add each `KLAVIYO_CLIENT_*_API_KEY` variable
   - Add `NEXT_PUBLIC_APP_NAME` if desired

4. Deploy:
```bash
# Or use Vercel CLI
npm i -g vercel
vercel
```

### Deploy to Other Platforms

The application can be deployed to any platform that supports Next.js:

- **Netlify**: Use `npm run build` and deploy the `.next` folder
- **AWS Amplify**: Connect your Git repository
- **Railway**: Connect repository and set environment variables
- **Docker**: Build a Docker image using the provided Dockerfile (if added)

### Build for Production

```bash
npm run build
npm run start
```

## Configuration

### Adding More Clients

1. Add a new environment variable to `.env.local`:
```env
KLAVIYO_CLIENT_4_API_KEY=pk_your_fourth_client_api_key
```

2. Add the client to `src/lib/klaviyo/clients.ts`:
```typescript
{
  id: 'client-4',
  name: 'Fourth Client Name',
  apiKey: process.env.KLAVIYO_CLIENT_4_API_KEY || '',
  color: '#f59e0b', // Optional color
}
```

### Customizing Date Ranges

Edit `src/components/dashboard/filter-bar.tsx` to add custom date ranges:
```typescript
const dateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '180d', label: 'Last 6 Months' }, // Add new range
];
```

Then update the logic in `src/lib/klaviyo/api.ts`:
```typescript
export function getDateRangeFilter(range: string) {
  const daysMap: Record<string, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    '180d': 180,
  };
  // ...
}
```

## Future Enhancements

The dashboard is designed for easy extension:

- **Charts & Visualizations**: Add Recharts for trend analysis
- **Shopify Integration**: Pull e-commerce data alongside email metrics
- **Campaign Comparison**: Compare campaigns side-by-side
- **Export Functionality**: Export data to CSV/Excel
- **User Authentication**: Add auth for multi-user access
- **Revenue Tracking**: Display conversion and revenue metrics
- **Automated Reports**: Schedule email reports

## Troubleshooting

### API Key Errors

If you see "Failed to fetch data" errors:
1. Verify API keys are correct in `.env.local`
2. Ensure API keys have the required scopes
3. Check if the Klaviyo account has active campaigns

### No Data Showing

1. Check that `.env.local` is configured correctly
2. Verify clients are configured in `src/lib/klaviyo/clients.ts`
3. Ensure API keys are not empty strings
4. Open browser DevTools → Network tab to check API responses

### TypeScript Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues:
- Open an issue on GitHub
- Check Klaviyo API documentation: [developers.klaviyo.com](https://developers.klaviyo.com)
- Review Next.js documentation: [nextjs.org/docs](https://nextjs.org/docs)

## Acknowledgments

- Built with [Next.js](https://nextjs.org)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- API integration with [Klaviyo](https://www.klaviyo.com)
