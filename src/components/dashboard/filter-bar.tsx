'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FilterOptions } from '@/types';

interface FilterBarProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onRefresh: () => void;
  loading?: boolean;
}

const dateRangeOptions = [
  { value: 'all', label: 'All Time' },
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
] as const;

export function FilterBar({
  filters,
  onFiltersChange,
  onRefresh,
  loading = false,
}: FilterBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <label className="text-sm font-medium text-muted-foreground">
          Date Range:
        </label>
        <Select
          value={filters.dateRange}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              dateRange: value as FilterOptions['dateRange'],
            })
          }
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            {dateRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={onRefresh}
        disabled={loading}
        variant="outline"
        className="transition-all hover:shadow-sm"
      >
        {loading ? (
          <>
            <span className="animate-spin mr-2">↻</span>
            Refreshing...
          </>
        ) : (
          <>
            <span className="mr-2">↻</span>
            Refresh
          </>
        )}
      </Button>
    </div>
  );
}
