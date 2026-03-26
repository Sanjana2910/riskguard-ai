import { useMemo, useState } from "react";
import { Shield } from "lucide-react";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { TransactionsChart } from "@/components/dashboard/TransactionsChart";
import { FailureRatesChart } from "@/components/dashboard/FailureRatesChart";
import { SuccessRatioPie } from "@/components/dashboard/SuccessRatioPie";
import { FlaggedTransactions } from "@/components/dashboard/FlaggedTransactions";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import {
  allTransactions,
  getOverviewStats,
  getTransactionsOverTime,
  getFailuresByRegion,
  getSuccessFailureRatio,
  getFlaggedTransactions,
  generateAIInsights,
} from "@/lib/mockData";

export default function Index() {
  const [region, setRegion] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState("30d");

  const filtered = useMemo(() => {
    const now = new Date();
    const daysMap: Record<string, number> = { "7d": 7, "14d": 14, "30d": 30, all: 9999 };
    const days = daysMap[dateRange] ?? 30;
    const cutoff = new Date(now.getTime() - days * 86400000);

    return allTransactions.filter((t) => {
      if (region !== "all" && t.region !== region) return false;
      if (status !== "all" && t.status !== status) return false;
      if (new Date(t.timestamp) < cutoff) return false;
      return true;
    });
  }, [region, status, dateRange]);

  const stats = useMemo(() => getOverviewStats(filtered), [filtered]);
  const timeData = useMemo(() => getTransactionsOverTime(filtered), [filtered]);
  const regionData = useMemo(() => getFailuresByRegion(filtered), [filtered]);
  const ratioData = useMemo(() => getSuccessFailureRatio(filtered), [filtered]);
  const flagged = useMemo(() => getFlaggedTransactions(filtered), [filtered]);
  const insights = useMemo(() => generateAIInsights(filtered), [filtered]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-foreground tracking-tight">
                Risk & Compliance
              </h1>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                GRC Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="status-pulse inline-block h-2 w-2 rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Live Monitoring</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1440px] mx-auto px-6 py-6 space-y-6">
        {/* Filters */}
        <DashboardFilters
          region={region}
          status={status}
          dateRange={dateRange}
          onRegionChange={setRegion}
          onStatusChange={setStatus}
          onDateRangeChange={setDateRange}
        />

        {/* Overview Cards */}
        <OverviewCards {...stats} />

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <TransactionsChart data={timeData} />
          </div>
          <SuccessRatioPie data={ratioData} />
        </div>

        {/* Failure Rates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FailureRatesChart data={regionData} labelKey="region" />
          <AIInsightsPanel summary={insights.summary} recommendations={insights.recommendations} />
        </div>

        {/* Flagged Transactions */}
        <FlaggedTransactions transactions={flagged} />
      </main>
    </div>
  );
}
