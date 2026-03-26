import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface DataPoint {
  region?: string;
  method?: string;
  rate: number;
  failures: number;
  total: number;
}

export function FailureRatesChart({ data, labelKey }: { data: DataPoint[]; labelKey: "region" | "method" }) {
  const getColor = (rate: number) => {
    if (rate > 30) return "hsl(0, 72%, 51%)";
    if (rate > 20) return "hsl(38, 92%, 50%)";
    return "hsl(217, 91%, 60%)";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-lg p-6"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Failure Rate by {labelKey === "region" ? "Region" : "Payment Method"}
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" horizontal={false} />
            <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={11} unit="%" />
            <YAxis
              type="category"
              dataKey={labelKey}
              stroke="hsl(215, 20%, 55%)"
              fontSize={11}
              width={110}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 9%)",
                border: "1px solid hsl(222, 30%, 16%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(210, 40%, 96%)",
              }}
              formatter={(value: number) => [`${value}%`, "Failure Rate"]}
            />
            <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell key={index} fill={getColor(entry.rate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
