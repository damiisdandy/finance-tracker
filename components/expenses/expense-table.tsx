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
import type { Expense } from "@/lib/db/schema";
import { useCurrency } from "@/providers/currency-provider";
import { formatDate } from "@/lib/utils/date";

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit: (expense: Expense) => void;
  onDelete: (id: number) => void;
}

const FREQUENCY_LABELS: Record<string, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  quarterly: "Quarterly",
  yearly: "Yearly",
  "one-time": "One-time",
};

const CATEGORY_LABELS: Record<string, string> = {
  groceries: "Groceries",
  transport: "Transport",
  utilities: "Utilities",
  entertainment: "Entertainment",
  healthcare: "Healthcare",
  education: "Education",
  shopping: "Shopping",
  other: "Other",
};

export function ExpenseTable({ expenses, onEdit, onDelete }: ExpenseTableProps) {
  const { convert, format } = useCurrency();

  if (expenses.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">No expenses found</p>
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
            <TableHead>Category</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
        {expenses.map((expense) => {
          const amount = parseFloat(expense.amount);
          const convertedAmount = convert(amount, expense.currency);

          return (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">{expense.name}</TableCell>
              <TableCell>
                {format(convertedAmount)}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({expense.currency})
                </span>
              </TableCell>
              <TableCell>{CATEGORY_LABELS[expense.category]}</TableCell>
              <TableCell>{FREQUENCY_LABELS[expense.frequency]}</TableCell>
              <TableCell>{formatDate(expense.date)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(expense)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(expense.id)}
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
