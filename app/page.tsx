"use client";

import { Header } from "@/components/layout/header";
import { NetWorthCard } from "@/components/dashboard/net-worth-card";
import { CashFlowCard } from "@/components/dashboard/cash-flow-card";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { IncomePieChart } from "@/components/dashboard/income-pie-chart";
import { ExpensePieChart } from "@/components/dashboard/expense-pie-chart";
import { SavingsSummary } from "@/components/dashboard/savings-summary";
import { ExchangeRates } from "@/components/dashboard/exchange-rates";

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <Header title="Dashboard" />
      <div className="flex-1 space-y-4 p-4 sm:space-y-6 sm:p-6">
        {/* Net Worth & Cash Flow - Primary KPIs */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          <NetWorthCard />
          <CashFlowCard />
        </div>

        {/* Monthly Breakdown */}
        <OverviewCards />

        {/* Charts & Details */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          <IncomePieChart />
          <ExpensePieChart />
          <SavingsSummary />
        </div>

        {/* Exchange Rates */}
        <ExchangeRates />
      </div>
    </div>
  );
}
