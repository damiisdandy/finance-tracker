"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { useCurrency } from "@/providers/currency-provider";
import { formatDate } from "@/lib/utils/date";

export function SavingsSummary() {
  const { convert, format } = useCurrency();
  const { data: savingsData } = trpc.savings.list.useQuery();

  if (!savingsData || savingsData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Accounts</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center">
          <p className="text-muted-foreground">No savings accounts</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {savingsData.map((account) => {
            const balance = parseFloat(account.balance);
            const convertedBalance = convert(balance, account.currency);
            return (
              <div
                key={account.id}
                className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{account.name}</p>
                  {(parseFloat(account.monthlyContribution ?? "0") > 0 || parseFloat(account.interestRate ?? "0") > 0) ? (
                    <p className="text-xs text-muted-foreground">
                      {parseFloat(account.monthlyContribution ?? "0") > 0 && `+${format(convert(parseFloat(account.monthlyContribution!), account.currency))}/mo`}
                      {parseFloat(account.monthlyContribution ?? "0") > 0 && parseFloat(account.interestRate ?? "0") > 0 && " · "}
                      {parseFloat(account.interestRate ?? "0") > 0 && `${account.interestRate}% p.a.`}
                    </p>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Last updated: {formatDate(account.lastUpdated)}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">{format(convertedBalance)}</p>
                  <p className="text-xs text-muted-foreground">
                    {account.currency}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
