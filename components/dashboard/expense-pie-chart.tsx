"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { useCurrency } from "@/providers/currency-provider";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { toMonthlyAmount, type Frequency } from "@/lib/utils/finance";

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

export function ExpensePieChart() {
  const [groupBy, setGroupBy] = useState<"category" | "name">("category");
  const { convert, format, currency } = useCurrency();
  const { data: expenseData } = trpc.expense.list.useQuery();
  const { data: subscriptionData } = trpc.subscription.list.useQuery();

  const chartData: { name: string; value: number }[] = [];

  if (groupBy === "category") {
    if (expenseData) {
      for (const item of expenseData) {
        const monthly = toMonthlyAmount(parseFloat(item.amount), item.frequency as Frequency);
        const amount = convert(monthly, item.currency);
        const label = CATEGORY_LABELS[item.category];
        const existing = chartData.find((i) => i.name === label);
        if (existing) {
          existing.value += amount;
        } else {
          chartData.push({ name: label, value: amount });
        }
      }
    }

    if (subscriptionData && subscriptionData.length > 0) {
      const subscriptionTotal = subscriptionData.reduce((acc, item) => {
        const monthly = toMonthlyAmount(parseFloat(item.amount), item.frequency as Frequency);
        return acc + convert(monthly, item.currency);
      }, 0);

      if (subscriptionTotal > 0) {
        chartData.push({ name: "Subscriptions", value: subscriptionTotal });
      }
    }
  } else {
    if (expenseData) {
      for (const item of expenseData) {
        const monthly = toMonthlyAmount(parseFloat(item.amount), item.frequency as Frequency);
        const amount = convert(monthly, item.currency);
        const existing = chartData.find((i) => i.name === item.name);
        if (existing) {
          existing.value += amount;
        } else {
          chartData.push({ name: item.name, value: amount });
        }
      }
    }

    if (subscriptionData) {
      for (const item of subscriptionData) {
        const monthly = toMonthlyAmount(parseFloat(item.amount), item.frequency as Frequency);
        const amount = convert(monthly, item.currency);
        const existing = chartData.find((i) => i.name === item.name);
        if (existing) {
          existing.value += amount;
        } else {
          chartData.push({ name: item.name, value: amount });
        }
      }
    }
  }

  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  const title = groupBy === "category"
    ? "Monthly Expenses by Category"
    : "Monthly Expenses by Name";

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center">
          <p className="text-muted-foreground">No expense data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <div className="flex gap-1">
          <Button
            variant={groupBy === "category" ? "default" : "outline"}
            size="sm"
            onClick={() => setGroupBy("category")}
          >
            Category
          </Button>
          <Button
            variant={groupBy === "name" ? "default" : "outline"}
            size="sm"
            onClick={() => setGroupBy("name")}
          >
            Name
          </Button>
        </div>
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
