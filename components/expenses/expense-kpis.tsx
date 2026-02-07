"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCurrency } from "@/providers/currency-provider";
import { toMonthlyAmount, type Frequency } from "@/lib/utils/finance";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { Expense } from "@/lib/db/schema";

const COLORS = [
  "#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#14b8a6",
  "#a855f7", "#e11d48", "#64748b",
];

const CATEGORY_LABELS: Record<string, string> = {
  groceries: "Groceries",
  transport: "Transport",
  utilities: "Utilities",
  entertainment: "Entertainment",
  healthcare: "Healthcare",
  education: "Education",
  shopping: "Shopping",
  rent: "Rent",
  "food-and-dining": "Food & Dining",
  insurance: "Insurance",
  "personal-care": "Personal Care",
  other: "Other",
};

export function ExpenseKPIs({ expenses }: { expenses: Expense[] }) {
  const { convert, format, currency } = useCurrency();

  const chartData: { name: string; value: number }[] = [];
  let totalMonthly = 0;

  for (const item of expenses) {
    const monthly = toMonthlyAmount(parseFloat(item.amount), item.frequency as Frequency);
    const amount = convert(monthly, item.currency);
    totalMonthly += amount;

    const label = CATEGORY_LABELS[item.category] ?? item.category;
    const existing = chartData.find((i) => i.name === label);
    if (existing) {
      existing.value += amount;
    } else {
      chartData.push({ name: label, value: amount });
    }
  }

  chartData.sort((a, b) => b.value - a.value);

  const topCategory = chartData[0];
  const topPercentage = totalMonthly > 0 && topCategory
    ? ((topCategory.value / totalMonthly) * 100).toFixed(0)
    : "0";

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Monthly Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{format(totalMonthly)}</div>
            <p className="text-xs text-muted-foreground">Amount to budget for expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expense Count</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenses.length}</div>
            <p className="text-xs text-muted-foreground">
              {expenses.length === 1 ? "item" : "items"} tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topCategory?.name ?? "—"}</div>
            <p className="text-xs text-muted-foreground">{topPercentage}% of total</p>
          </CardContent>
        </Card>
      </div>

      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
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
