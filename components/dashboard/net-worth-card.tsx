"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { useCurrency } from "@/providers/currency-provider";
import { type Frequency, toMonthlyAmount } from "@/lib/utils/finance";
import { TrendingUp } from "lucide-react";

export function NetWorthCard() {
  const { convert, format } = useCurrency();

  const { data: savingsData, isLoading: savingsLoading } = trpc.savings.list.useQuery();
  const { data: incomeData, isLoading: incomeLoading } = trpc.income.list.useQuery();
  const { data: expenseData, isLoading: expenseLoading } = trpc.expense.list.useQuery();
  const { data: subscriptionData, isLoading: subscriptionLoading } = trpc.subscription.list.useQuery();

  const isLoading = savingsLoading || incomeLoading || expenseLoading || subscriptionLoading;

  const totalAssets =
    savingsData?.reduce((acc, item) => {
      const balance = parseFloat(item.balance);
      return acc + convert(balance, item.currency);
    }, 0) ?? 0;

  const monthlyIncome =
    incomeData?.reduce((acc, item) => {
      const amount = parseFloat(item.amount);
      const converted = convert(amount, item.currency);
      return acc + toMonthlyAmount(converted, item.frequency as Frequency, {
        isWorkHours: item.isWorkHours,
      });
    }, 0) ?? 0;

  const monthlyExpenses =
    expenseData?.reduce((acc, item) => {
      const amount = parseFloat(item.amount);
      const converted = convert(amount, item.currency);
      return acc + toMonthlyAmount(converted, item.frequency as Frequency);
    }, 0) ?? 0;

  const monthlySubscriptions =
    subscriptionData?.reduce((acc, item) => {
      const amount = parseFloat(item.amount);
      const converted = convert(amount, item.currency);
      return acc + toMonthlyAmount(converted, item.frequency as Frequency);
    }, 0) ?? 0;

  const netCashFlow = monthlyIncome - monthlyExpenses - monthlySubscriptions;
  const netWorth = totalAssets + netCashFlow;

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-emerald-950 to-emerald-900 border-emerald-800">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-emerald-200">
            <TrendingUp className="h-4 w-4" />
            Net Worth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-emerald-300">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-950 to-emerald-900 border-emerald-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-emerald-200">
          <TrendingUp className="h-4 w-4" />
          Net Worth
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-emerald-100">
          {format(netWorth)}
        </div>
        <div className="mt-2 space-y-1 text-xs text-emerald-300">
          <p>Savings: {format(totalAssets)}</p>
          <p>
            Net Cash Flow: {netCashFlow >= 0 ? "+" : "-"}{format(Math.abs(netCashFlow))}/mo
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
