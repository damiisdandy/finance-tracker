"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";
import { ArrowRightLeft } from "lucide-react";

export function ExchangeRates() {
  const { data, isLoading } = trpc.currency.getAllRates.useQuery(undefined, {
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  const formatRate = (rate: number, decimals: number = 2) => {
    return rate.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <ArrowRightLeft className="h-4 w-4" />
            Exchange Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading rates...</p>
        </CardContent>
      </Card>
    );
  }

  const rates = [
    { label: "USD / NGN", value: formatRate(data?.NGN ?? 0, 2) },
    { label: "USD / GBP", value: formatRate(data?.GBP ?? 0, 4) },
    { label: "GBP / NGN", value: formatRate((data?.NGN ?? 0) / (data?.GBP ?? 1), 2) },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <ArrowRightLeft className="h-4 w-4" />
            Exchange Rates
          </CardTitle>
          {data?.lastUpdated && (
            <p className="text-xs text-muted-foreground">
              Updated at {formatTime(data.lastUpdated)}
            </p>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-6">
          {rates.map((rate) => (
            <div key={rate.label} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{rate.label}</span>
              <span className="font-mono text-lg font-semibold">{rate.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
