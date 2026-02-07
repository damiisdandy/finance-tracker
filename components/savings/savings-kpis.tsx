"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/providers/currency-provider";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { SavingsAccount } from "@/lib/db/schema";

const COLORS = [
  "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ec4899",
  "#06b6d4", "#84cc16", "#f97316", "#14b8a6", "#a855f7",
  "#e11d48", "#ef4444", "#64748b",
];

export function SavingsKPIs({ accounts }: { accounts: SavingsAccount[] }) {
  const { convert, format, currency } = useCurrency();

  let totalBalance = 0;
  let totalMonthlyContributions = 0;
  let topAccount: { name: string; balance: number } | null = null;

  const chartData: { name: string; value: number }[] = [];

  for (const account of accounts) {
    const balance = convert(parseFloat(account.balance), account.currency);
    const contribution = convert(parseFloat(account.monthlyContribution), account.currency);

    totalBalance += balance;
    totalMonthlyContributions += contribution;

    chartData.push({ name: account.name, value: balance });

    if (!topAccount || balance > topAccount.balance) {
      topAccount = { name: account.name, balance };
    }
  }

  chartData.sort((a, b) => b.value - a.value);

  const avgInterestRate = accounts.length > 0
    ? accounts.reduce((sum, a) => sum + parseFloat(a.interestRate), 0) / accounts.length
    : 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Monthly Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-500">{format(totalMonthlyContributions)}</div>
            <p className="text-xs text-muted-foreground">Amount to put away each month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Savings Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(totalBalance)}</div>
            <p className="text-xs text-muted-foreground">
              Across {accounts.length} {accounts.length === 1 ? "account" : "accounts"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Interest Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgInterestRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average across accounts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Account</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topAccount?.name ?? "—"}</div>
            <p className="text-xs text-muted-foreground">
              {topAccount ? format(topAccount.balance, currency) : "No data"}
            </p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Savings by Account</CardTitle>
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
                    const percentage = totalBalance
                      ? `${((numericValue / totalBalance) * 100).toFixed(0)}%`
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
