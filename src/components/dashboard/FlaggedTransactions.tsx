import { motion } from "framer-motion";
import { AlertTriangle, ExternalLink } from "lucide-react";
import type { Transaction } from "@/lib/mockData";

export function FlaggedTransactions({ transactions }: { transactions: Transaction[] }) {
  const getRiskBadge = (score: number) => {
    if (score > 85) return { label: "Critical", className: "bg-danger/20 text-danger" };
    if (score > 70) return { label: "High", className: "bg-warning/20 text-warning" };
    return { label: "Medium", className: "bg-primary/20 text-primary" };
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="glass-card rounded-lg p-6"
    >
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-4 w-4 text-warning" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Flagged Transactions
        </h3>
        <span className="ml-auto text-xs font-mono text-muted-foreground">{transactions.length} flagged</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-muted-foreground uppercase tracking-wider border-b border-border/50">
              <th className="text-left pb-3 pr-4">Transaction</th>
              <th className="text-left pb-3 pr-4">User</th>
              <th className="text-right pb-3 pr-4">Amount</th>
              <th className="text-left pb-3 pr-4">Region</th>
              <th className="text-center pb-3 pr-4">Risk</th>
              <th className="text-left pb-3">Reason</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => {
              const badge = getRiskBadge(t.risk_score);
              return (
                <tr
                  key={t.id}
                  className="border-b border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer group"
                >
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-foreground">{t.id}</span>
                      <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">{t.user_id}</td>
                  <td className="py-3 pr-4 text-right font-mono text-xs">${t.amount.toFixed(2)}</td>
                  <td className="py-3 pr-4 text-xs">{t.region}</td>
                  <td className="py-3 pr-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${badge.className}`}>
                      {t.risk_score} — {badge.label}
                    </span>
                  </td>
                  <td className="py-3 text-xs text-muted-foreground max-w-[200px] truncate">
                    {t.flag_reason}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
