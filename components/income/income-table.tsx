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
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import type { Income } from "@/lib/db/schema";
import { useCurrency } from "@/providers/currency-provider";
import { formatDate } from "@/lib/utils/date";
import { toMonthlyAmount, type Frequency } from "@/lib/utils/finance";

interface IncomeTableProps {
  incomeList: Income[];
  onEdit: (income: Income) => void;
  onDelete: (id: number) => void;
}

const FREQUENCY_LABELS: Record<string, string> = {
  hourly: "Hourly",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
  "one-time": "One-time",
};

const TYPE_LABELS: Record<string, string> = {
  salary: "Salary",
  interest: "Interest",
  other: "Other",
};

export function IncomeTable({
  incomeList,
  onEdit,
  onDelete,
}: IncomeTableProps) {
  const { convert, format } = useCurrency();

  if (incomeList.length === 0) {
    return (
      <div className="flex h-50 items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">No income found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Monthly Value</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-12.5"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomeList.map((income) => {
            const amount = parseFloat(income.amount);
            const convertedAmount = convert(amount, income.currency);
            const monthlyValue = toMonthlyAmount(
              convertedAmount,
              income.frequency as Frequency,
              {
                isWorkHours: income.isWorkHours,
              },
            );
            const frequencyLabel =
              income.frequency === "hourly" && income.isWorkHours
                ? "Hourly (Work hours)"
                : FREQUENCY_LABELS[income.frequency];

            return (
              <TableRow key={income.id}>
                <TableCell className="font-medium">{income.name}</TableCell>
                <TableCell>
                  {format(convertedAmount)}
                  <span className="ml-1 text-xs text-muted-foreground">
                    ({income.currency})
                  </span>
                </TableCell>
                <TableCell>{format(monthlyValue)}</TableCell>
                <TableCell>{TYPE_LABELS[income.type]}</TableCell>
                <TableCell>{frequencyLabel}</TableCell>
                <TableCell>{formatDate(income.date)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(income)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(income.id)}
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
