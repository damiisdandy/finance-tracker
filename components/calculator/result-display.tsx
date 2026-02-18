"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCurrency } from "@/providers/currency-provider";
import type { CompoundInterestResult } from "@/lib/utils/calculator";

interface ResultDisplayProps {
  result: CompoundInterestResult | null;
}

export function ResultDisplay({ result }: ResultDisplayProps) {
  const { format, currency, convert } = useCurrency();

  const fmt = (amount: number) => {
    const converted = result?.calculatedCurrency ? convert(amount, result.calculatedCurrency) : amount;
    return format(converted, currency);
  };

  if (!result) {
    return (
      <Card>
        <CardContent className="flex h-[400px] items-center justify-center">
          <p className="text-muted-foreground">
            Enter values and click Calculate to see results
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Future Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {fmt(result.futureValue)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Contributions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fmt(result.totalContributions)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Interest Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {fmt(result.totalInterest)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Yearly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Contributions</TableHead>
                <TableHead className="text-right">Interest Earned</TableHead>
                <TableHead className="text-right">Total Interest</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {result.yearlyBreakdown.map((year) => (
                <TableRow key={year.year}>
                  <TableCell className="font-medium">{year.year}</TableCell>
                  <TableCell className="text-right">
                    {fmt(year.balance)}
                  </TableCell>
                  <TableCell className="text-right">
                    {fmt(year.contributions)}
                  </TableCell>
                  <TableCell className="text-right text-blue-500">
                    {fmt(year.yearlyInterest)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {fmt(year.interest)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
