"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { useCurrency } from "@/providers/currency-provider";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

const CATEGORY_LABELS: Record<string, string> = {
  groceries: "Groceries",
  transport: "Transport",
  utilities: "Utilities",
  entertainment: "Entertainment",
  healthcare: "Healthcare",
  education: "Education",
  shopping: "Shopping",
  other: "Other",
};

export function ExpensePieChart() {
  const { convert, format, currency } = useCurrency();
  const { data: expenseData } = trpc.expense.list.useQuery();

  const chartData =
    expenseData?.reduce((acc, item) => {
      const amount = convert(parseFloat(item.amount), item.currency);
      const category = item.category;
      const existing = acc.find((i) => i.name === CATEGORY_LABELS[category]);
      if (existing) {
        existing.value += amount;
      } else {
        acc.push({ name: CATEGORY_LABELS[category], value: amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]) ?? [];
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
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
                const percentage = total ? `${((numericValue / total) * 100).toFixed(0)}%` : "0%";
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
  );
}
