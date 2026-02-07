"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/providers/currency-provider";
import { toMonthlyAmount, type Frequency } from "@/lib/utils/finance";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Subscription } from "@/lib/db/schema";

const COLORS = [
  "#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899",
  "#06b6d4", "#84cc16", "#ef4444", "#f59e0b", "#14b8a6",
  "#a855f7", "#e11d48", "#64748b",
];

export function SubscriptionKPIs({ subscriptions }: { subscriptions: Subscription[] }) {
  const { convert, format, currency } = useCurrency();

  const chartData: { name: string; value: number }[] = [];
  let totalMonthly = 0;
  let topSubscription: { name: string; value: number } | null = null;

  for (const item of subscriptions) {
    const monthly = toMonthlyAmount(parseFloat(item.amount), item.frequency as Frequency);
    const amount = convert(monthly, item.currency);
    totalMonthly += amount;

    chartData.push({ name: item.name, value: amount });

    if (!topSubscription || amount > topSubscription.value) {
      topSubscription = { name: item.name, value: amount };
    }
  }

  chartData.sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Monthly Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{format(totalMonthly)}</div>
            <p className="text-xs text-muted-foreground">Recurring subscription costs per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Subscriptions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscriptions.length}</div>
            <p className="text-xs text-muted-foreground">
              {subscriptions.length === 1 ? "subscription" : "subscriptions"} tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Subscription</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topSubscription?.name ?? "—"}</div>
            <p className="text-xs text-muted-foreground">
              {topSubscription ? `${format(topSubscription.value, currency)}/mo` : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Subscriptions Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => {
                    const numericValue = Number(value);
                    const percentage = totalMonthly
                      ? `${((numericValue / totalMonthly) * 100).toFixed(0)}%`
                      : "0%";
                    return [`${format(numericValue, currency)} (${percentage})`, name];
                  }}
                  contentStyle={{
                    backgroundColor: "var(--popover)",
                    borderColor: "var(--border)",
                    borderRadius: "var(--radius)",
                    color: "var(--popover-foreground)",
                  }}
                  itemStyle={{ color: "var(--popover-foreground)" }}
                  labelStyle={{ color: "var(--popover-foreground)" }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
