export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  status: "success" | "failure";
  timestamp: string;
  region: string;
  payment_method: string;
  risk_score: number;
  flagged: boolean;
  flag_reason?: string;
}

const regions = ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East"];
const paymentMethods = ["Credit Card", "Debit Card", "ACH", "Wire Transfer", "PayPal"];
const userIds = Array.from({ length: 50 }, (_, i) => `USR-${String(i + 1).padStart(4, "0")}`);

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTransactions(count: number): Transaction[] {
  const now = new Date();
  const transactions: Transaction[] = [];

  for (let i = 0; i < count; i++) {
    const hoursAgo = randomBetween(0, 720); // last 30 days
    const timestamp = new Date(now.getTime() - hoursAgo * 3600000);
    const region = regions[randomBetween(0, regions.length - 1)];
    const userId = userIds[randomBetween(0, userIds.length - 1)];

    // Create anomaly patterns
    const isAnomalyWindow = timestamp.getHours() >= 14 && timestamp.getHours() <= 16 && region === "Asia Pacific";
    const isRepeatOffender = ["USR-0007", "USR-0023", "USR-0041"].includes(userId);
    
    let failureChance = 0.12;
    if (isAnomalyWindow) failureChance = 0.65;
    if (isRepeatOffender) failureChance = 0.55;

    const status: "success" | "failure" = Math.random() < failureChance ? "failure" : "success";
    const riskScore = status === "failure"
      ? randomBetween(55, 99)
      : randomBetween(1, 40);

    let flagged = false;
    let flag_reason: string | undefined;

    if (riskScore > 75) {
      flagged = true;
      if (isAnomalyWindow) flag_reason = "Spike in failures during 2-4 PM in Asia Pacific";
      else if (isRepeatOffender) flag_reason = "Repeated failed attempts by same user";
      else flag_reason = "High risk score detected";
    }

    transactions.push({
      id: `TXN-${String(i + 1).padStart(6, "0")}`,
      user_id: userId,
      amount: parseFloat((Math.random() * 2000 + 10).toFixed(2)),
      status,
      timestamp: timestamp.toISOString(),
      region,
      payment_method: paymentMethods[randomBetween(0, paymentMethods.length - 1)],
      risk_score: riskScore,
      flagged,
      flag_reason,
    });
  }

  return transactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const allTransactions = generateTransactions(500);

export function getOverviewStats(transactions: Transaction[]) {
  const total = transactions.length;
  const successful = transactions.filter(t => t.status === "success").length;
  const failed = transactions.filter(t => t.status === "failure").length;
  const alerts = transactions.filter(t => t.flagged).length;
  const revenue = transactions
    .filter(t => t.status === "success")
    .reduce((sum, t) => sum + t.amount, 0);

  return { total, successful, failed, alerts, revenue };
}

export function getTransactionsOverTime(transactions: Transaction[]) {
  const grouped: Record<string, { date: string; success: number; failure: number }> = {};

  transactions.forEach(t => {
    const date = t.timestamp.split("T")[0];
    if (!grouped[date]) grouped[date] = { date, success: 0, failure: 0 };
    if (t.status === "success") grouped[date].success++;
    else grouped[date].failure++;
  });

  return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
}

export function getFailuresByRegion(transactions: Transaction[]) {
  const grouped: Record<string, { region: string; failures: number; total: number; rate: number }> = {};

  transactions.forEach(t => {
    if (!grouped[t.region]) grouped[t.region] = { region: t.region, failures: 0, total: 0, rate: 0 };
    grouped[t.region].total++;
    if (t.status === "failure") grouped[t.region].failures++;
  });

  return Object.values(grouped).map(g => ({
    ...g,
    rate: parseFloat(((g.failures / g.total) * 100).toFixed(1)),
  }));
}

export function getFailuresByMethod(transactions: Transaction[]) {
  const grouped: Record<string, { method: string; failures: number; total: number; rate: number }> = {};

  transactions.forEach(t => {
    if (!grouped[t.payment_method]) grouped[t.payment_method] = { method: t.payment_method, failures: 0, total: 0, rate: 0 };
    grouped[t.payment_method].total++;
    if (t.status === "failure") grouped[t.payment_method].failures++;
  });

  return Object.values(grouped).map(g => ({
    ...g,
    rate: parseFloat(((g.failures / g.total) * 100).toFixed(1)),
  }));
}

export function getSuccessFailureRatio(transactions: Transaction[]) {
  const success = transactions.filter(t => t.status === "success").length;
  const failure = transactions.filter(t => t.status === "failure").length;
  return [
    { name: "Successful", value: success, fill: "hsl(142, 71%, 45%)" },
    { name: "Failed", value: failure, fill: "hsl(0, 72%, 51%)" },
  ];
}

export function getFlaggedTransactions(transactions: Transaction[]) {
  return transactions.filter(t => t.flagged).slice(0, 20);
}

export function generateAIInsights(transactions: Transaction[]) {
  const stats = getOverviewStats(transactions);
  const failureRate = ((stats.failed / stats.total) * 100).toFixed(1);
  const regionData = getFailuresByRegion(transactions);
  const worstRegion = regionData.sort((a, b) => b.rate - a.rate)[0];
  const flagged = getFlaggedTransactions(transactions);
  const repeatOffenders = new Set(flagged.filter(t => t.flag_reason?.includes("Repeated")).map(t => t.user_id));

  const summary = `Overall failure rate is ${failureRate}%. ${worstRegion.region} shows the highest failure rate at ${worstRegion.rate}% (${worstRegion.failures}/${worstRegion.total} transactions). ${repeatOffenders.size} users flagged for repeated failed payment attempts. A concentrated spike in failures detected between 2–4 PM in Asia Pacific — this pattern suggests a potential payment gateway issue or coordinated fraud attempt.`;

  const recommendations = [
    { priority: "high" as const, text: "Investigate Asia Pacific payment gateway for intermittent failures during peak hours (2-4 PM)" },
    { priority: "high" as const, text: `Monitor ${repeatOffenders.size} flagged users with repeated failed attempts for potential card testing fraud` },
    { priority: "medium" as const, text: "Set automated alert thresholds: trigger when failure rate exceeds 30% in any 2-hour window" },
    { priority: "medium" as const, text: `Review ${worstRegion.region} payment routing — consider failover to secondary processor` },
    { priority: "low" as const, text: "Implement velocity checks: block users after 5+ failed attempts within 1 hour" },
  ];

  return { summary, recommendations };
}
