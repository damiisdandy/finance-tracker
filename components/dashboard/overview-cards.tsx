"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { useCurrency } from "@/providers/currency-provider";
import { Wallet, Receipt, CreditCard, PiggyBank } from "lucide-react";

export function OverviewCards() {
  const { convert, format } = useCurrency();

  const { data: incomeData } = trpc.income.list.useQuery();
  const { data: expenseData } = trpc.expense.list.useQuery();
  const { data: subscriptionData } = trpc.subscription.list.useQuery();
  const { data: savingsData } = trpc.savings.list.useQuery();

  const totalIncome =
    incomeData?.reduce((acc, item) => {
      const amount = parseFloat(item.amount);
      return acc + convert(amount, item.currency);
    }, 0) ?? 0;

  const totalExpenses =
    expenseData?.reduce((acc, item) => {
      const amount = parseFloat(item.amount);
      return acc + convert(amount, item.currency);
    }, 0) ?? 0;

  const totalSubscriptions =
    subscriptionData?.reduce((acc, item) => {
      const amount = parseFloat(item.amount);
      return acc + convert(amount, item.currency);
    }, 0) ?? 0;

  const totalSavings =
    savingsData?.reduce((acc, item) => {
      const amount = parseFloat(item.balance);
      return acc + convert(amount, item.currency);
    }, 0) ?? 0;

  const cards = [
    {
      title: "Monthly Income",
      value: format(totalIncome),
      icon: Wallet,
      description: `${incomeData?.length ?? 0} income sources`,
    },
    {
      title: "Monthly Expenses",
      value: format(totalExpenses),
      icon: Receipt,
      description: `${expenseData?.length ?? 0} expenses`,
    },
    {
      title: "Monthly Subscriptions",
      value: format(totalSubscriptions),
      icon: CreditCard,
      description: `${subscriptionData?.length ?? 0} active`,
    },
    {
      title: "Total Savings",
      value: format(totalSavings),
      icon: PiggyBank,
      description: `${savingsData?.length ?? 0} accounts`,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
