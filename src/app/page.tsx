import { Dashboard } from '@/components/dashboard/dashboard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Dashboard />
      </div>
    </div>
  );
}
