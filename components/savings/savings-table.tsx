"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calculator, MoreHorizontal, Pencil, Trash } from "lucide-react";
import Link from "next/link";
import type { SavingsAccount } from "@/lib/db/schema";
import { useCurrency } from "@/providers/currency-provider";
import { formatDate } from "@/lib/utils/date";
import { calculateCompoundInterest } from "@/lib/utils/calculator";

interface SavingsTableProps {
  accounts: SavingsAccount[];
  onEdit: (account: SavingsAccount) => void;
  onDelete: (id: number) => void;
}

export function SavingsTable({
  accounts,
  onEdit,
  onDelete,
}: SavingsTableProps) {
  const { convert, format } = useCurrency();

  if (accounts.length === 0) {
    return (
      <div className="flex h-50 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">No savings accounts found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Account Name</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Monthly Contribution</TableHead>
            <TableHead>Interest Rate</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">5yr Forecast</TableHead>
            <TableHead className="w-12.5"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accounts.map((account) => {
            const balance = parseFloat(account.balance);
            const convertedBalance = convert(balance, account.currency);
            const monthlyContribution = parseFloat(
              account.monthlyContribution ?? "0",
            );
            const convertedContribution = convert(
              monthlyContribution,
              account.currency,
            );
            const interestRate = parseFloat(account.interestRate ?? "0");
            const forecast = calculateCompoundInterest(
              balance,
              monthlyContribution,
              interestRate,
              5,
            );

            return (
              <TableRow key={account.id}>
                <TableCell className="font-medium">{account.name}</TableCell>
                <TableCell>
                  {format(convertedBalance)}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({account.currency})
                  </span>
                </TableCell>
                <TableCell>
                  {monthlyContribution > 0
                    ? format(convertedContribution)
                    : "-"}
                </TableCell>
                <TableCell>
                  {interestRate > 0 ? `${interestRate}%` : "-"}
                </TableCell>
                <TableCell>{account.currency}</TableCell>
                <TableCell>{formatDate(account.lastUpdated)}</TableCell>
                <TableCell className="bg-emerald-500/5 font-medium text-emerald-600 dark:text-emerald-400">
                  {format(convert(forecast.futureValue, account.currency))}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(account)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/calculator?principal=${account.balance}&monthly=${account.monthlyContribution ?? "0"}&rate=${account.interestRate ?? "0"}&currency=${account.currency}`}
                        >
                          <Calculator className="mr-2 h-4 w-4" />
                          Forecast
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(account.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
