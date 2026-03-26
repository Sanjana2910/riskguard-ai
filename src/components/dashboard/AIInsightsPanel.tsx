import { motion } from "framer-motion";
import { Brain, AlertCircle, Info, Shield } from "lucide-react";

interface Recommendation {
  priority: "high" | "medium" | "low";
  text: string;
}

interface AIInsightsProps {
  summary: string;
  recommendations: Recommendation[];
}

const priorityConfig = {
  high: { icon: AlertCircle, className: "border-danger/30 bg-danger/5", badge: "bg-danger/20 text-danger", label: "High" },
  medium: { icon: Info, className: "border-warning/30 bg-warning/5", badge: "bg-warning/20 text-warning", label: "Medium" },
  low: { icon: Shield, className: "border-primary/30 bg-primary/5", badge: "bg-primary/20 text-primary", label: "Low" },
};

export function AIInsightsPanel({ summary, recommendations }: AIInsightsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
      className="glass-card rounded-lg p-6 glow-primary"
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Brain className="h-4 w-4 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">AI Risk Analysis</h3>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Powered by anomaly detection</p>
        </div>
      </div>

      <div className="mb-6 p-4 rounded-lg bg-secondary/40 border border-border/30">
        <p className="text-sm leading-relaxed text-secondary-foreground">{summary}</p>
      </div>

      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Recommendations
      </h4>
      <div className="space-y-2.5">
        {recommendations.map((rec, i) => {
          const config = priorityConfig[rec.priority];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              className={`flex items-start gap-3 p-3 rounded-lg border ${config.className}`}
            >
              <config.icon className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-xs text-foreground leading-relaxed">{rec.text}</p>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.badge} shrink-0`}>
                {config.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
