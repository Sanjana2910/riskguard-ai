import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface DataPoint {
  date: string;
  success: number;
  failure: number;
}

export function TransactionsChart({ data }: { data: DataPoint[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card rounded-lg p-6"
    >
      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Transactions Over Time
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
            <XAxis
              dataKey="date"
              stroke="hsl(215, 20%, 55%)"
              fontSize={11}
              tickFormatter={(v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            />
            <YAxis stroke="hsl(215, 20%, 55%)" fontSize={11} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222, 47%, 9%)",
                border: "1px solid hsl(222, 30%, 16%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(210, 40%, 96%)",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line type="monotone" dataKey="success" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} name="Successful" />
            <Line type="monotone" dataKey="failure" stroke="hsl(0, 72%, 51%)" strokeWidth={2} dot={false} name="Failed" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
