"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { useCurrency } from "@/providers/currency-provider";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const TYPE_LABELS: Record<string, string> = {
  salary: "Salary",
  interest: "Interest",
  other: "Other",
};

export function IncomePieChart() {
  const { convert, format, currency } = useCurrency();
  const { data: incomeData } = trpc.income.list.useQuery();

  const chartData =
    incomeData?.reduce((acc, item) => {
      const amount = convert(parseFloat(item.amount), item.currency);
      const type = item.type;
      const existing = acc.find((i) => i.name === TYPE_LABELS[type]);
      if (existing) {
        existing.value += amount;
      } else {
        acc.push({ name: TYPE_LABELS[type], value: amount });
      }
      return acc;
    }, [] as { name: string; value: number }[]) ?? [];
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Income by Type</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No income data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income by Type</CardTitle>
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
