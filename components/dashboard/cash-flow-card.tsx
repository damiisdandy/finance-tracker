"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { trpc } from "@/lib/trpc/client";
import { useCurrency } from "@/providers/currency-provider";
import { toMonthlyAmount, type Frequency } from "@/lib/utils/finance";
import { ArrowDownRight, ArrowUpRight, Info, Minus, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

export function CashFlowCard() {
  const { convert, format } = useCurrency();

  const { data: incomeData } = trpc.income.list.useQuery();
  const { data: expenseData } = trpc.expense.list.useQuery();
  const { data: subscriptionData } = trpc.subscription.list.useQuery();
  const { data: savingsAllocationData } = trpc.savingsAllocation.list.useQuery();

  // Calculate monthly income
  const monthlyIncome =
    incomeData?.reduce((acc, item) => {
      const amount = parseFloat(item.amount);
      const converted = convert(amount, item.currency);
      return acc + toMonthlyAmount(converted, item.frequency as Frequency);
    }, 0) ?? 0;

  // Calculate monthly expenses (excluding one-time for recurring view)
  const monthlyExpenses =
    expenseData?.reduce((acc, item) => {
      const amount = parseFloat(item.amount);
      const converted = convert(amount, item.currency);
      return acc + toMonthlyAmount(converted, item.frequency as Frequency);
    }, 0) ?? 0;

  // Calculate monthly subscriptions
  const monthlySubscriptions =
    subscriptionData?.reduce((acc, item) => {
      const amount = parseFloat(item.amount);
      const converted = convert(amount, item.currency);
      return acc + toMonthlyAmount(converted, item.frequency as Frequency);
    }, 0) ?? 0;

  // Calculate monthly savings allocations
  const monthlySavings =
    savingsAllocationData?.reduce((acc, item) => {
      const amount = parseFloat(item.amount);
      const converted = convert(amount, item.currency);
      return acc + toMonthlyAmount(converted, item.frequency as Frequency);
    }, 0) ?? 0;

  const totalOutflow = monthlyExpenses + monthlySubscriptions + monthlySavings;
  const cashFlow = monthlyIncome - totalOutflow;
  const isPositive = cashFlow >= 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Wallet className="h-4 w-4" />
          Monthly Cash Flow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Net Cash Flow */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Net Cash Flow</span>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <ArrowUpRight className="h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
            <span
              className={cn(
                "text-xl font-bold",
                isPositive ? "text-emerald-500" : "text-red-500"
              )}
            >
              {format(Math.abs(cashFlow))}
            </span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-2 border-t border-border pt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              Income
            </span>
            <span className="font-medium text-emerald-500">
              +{format(monthlyIncome)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <ArrowDownRight className="h-3 w-3 text-red-500" />
              Expenses
            </span>
            <span className="font-medium text-red-500">
              -{format(monthlyExpenses)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <Minus className="h-3 w-3 text-orange-500" />
              Subscriptions
            </span>
            <span className="font-medium text-orange-500">
              -{format(monthlySubscriptions)}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-muted-foreground">
              <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              Savings
            </span>
            <span className="font-medium text-emerald-500">
              +{format(monthlySavings)}
            </span>
          </div>
        </div>

        {/* Savings Rate */}
        {monthlyIncome > 0 && (
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-muted-foreground">
                Savings Rate
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="inline-flex items-center">
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      Savings rate is the percentage of your monthly income allocated to savings.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
              <span
                className={cn(
                  "font-semibold",
                  monthlySavings > 0 ? "text-emerald-500" : "text-red-500"
                )}
              >
                {((monthlySavings / monthlyIncome) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
