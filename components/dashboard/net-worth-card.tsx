"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { useCurrency } from "@/providers/currency-provider";
import { TrendingUp } from "lucide-react";

export function NetWorthCard() {
  const { convert, format } = useCurrency();

  const { data: savingsData, isLoading } = trpc.savings.list.useQuery();

  const totalAssets =
    savingsData?.reduce((acc, item) => {
      const balance = parseFloat(item.balance);
      return acc + convert(balance, item.currency);
    }, 0) ?? 0;

  // For now, net worth = total assets (savings)
  // Can be extended to include bank accounts - debts
  const netWorth = totalAssets;

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
        <p className="mt-1 text-xs text-emerald-300">
          Total assets across {savingsData?.length ?? 0} accounts
        </p>
      </CardContent>
    </Card>
  );
}
