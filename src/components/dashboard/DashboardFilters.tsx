import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface FiltersProps {
  region: string;
  status: string;
  dateRange: string;
  onRegionChange: (v: string) => void;
  onStatusChange: (v: string) => void;
  onDateRangeChange: (v: string) => void;
}

export function DashboardFilters({ region, status, dateRange, onRegionChange, onStatusChange, onDateRangeChange }: FiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wider">Filters</span>
      </div>

      <Select value={dateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-[140px] h-8 text-xs bg-secondary border-border/50">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="7d">Last 7 days</SelectItem>
          <SelectItem value="14d">Last 14 days</SelectItem>
          <SelectItem value="30d">Last 30 days</SelectItem>
          <SelectItem value="all">All time</SelectItem>
        </SelectContent>
      </Select>

      <Select value={region} onValueChange={onRegionChange}>
        <SelectTrigger className="w-[160px] h-8 text-xs bg-secondary border-border/50">
          <SelectValue placeholder="Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          <SelectItem value="North America">North America</SelectItem>
          <SelectItem value="Europe">Europe</SelectItem>
          <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
          <SelectItem value="Latin America">Latin America</SelectItem>
          <SelectItem value="Middle East">Middle East</SelectItem>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[130px] h-8 text-xs bg-secondary border-border/50">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="success">Success</SelectItem>
          <SelectItem value="failure">Failure</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
