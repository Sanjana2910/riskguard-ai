import { motion } from "framer-motion";
import { Activity, CheckCircle2, XCircle, AlertTriangle, DollarSign } from "lucide-react";

interface OverviewCardsProps {
  total: number;
  successful: number;
  failed: number;
  alerts: number;
  revenue: number;
}

const cards = [
  { key: "total", label: "Total Transactions", icon: Activity, colorClass: "text-primary" },
  { key: "successful", label: "Successful Payments", icon: CheckCircle2, colorClass: "text-success" },
  { key: "failed", label: "Failed Payments", icon: XCircle, colorClass: "text-danger" },
  { key: "alerts", label: "Risk Alerts", icon: AlertTriangle, colorClass: "text-warning", glow: true },
  { key: "revenue", label: "Revenue", icon: DollarSign, colorClass: "text-chart-2", isCurrency: true },
] as const;

export function OverviewCards({ total, successful, failed, alerts, revenue }: OverviewCardsProps) {
  const values: Record<string, number> = { total, successful, failed, alerts, revenue };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className={`glass-card rounded-lg p-5 ${card.glow ? "glow-danger border-danger/30" : ""}`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {card.label}
            </span>
            <card.icon className={`h-4 w-4 ${card.colorClass}`} />
          </div>
          <div className="text-2xl font-semibold tracking-tight text-foreground">
            {card.isCurrency
              ? `$${values[card.key].toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
              : values[card.key].toLocaleString()}
          </div>
          {card.key === "alerts" && alerts > 0 && (
            <div className="mt-2 flex items-center gap-1.5">
              <span className="status-pulse inline-block h-2 w-2 rounded-full bg-danger" />
              <span className="text-xs text-danger">{alerts} active alerts</span>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
