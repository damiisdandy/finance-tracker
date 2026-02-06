"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ExpenseForm } from "./expense-form";
import type { Expense } from "@/lib/db/schema";

interface ExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense | null;
  onSubmit: (data: {
    name: string;
    amount: string;
    frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "one-time";
    currency: "NGN" | "USD";
    category: "groceries" | "transport" | "utilities" | "entertainment" | "healthcare" | "education" | "shopping" | "other";
    date: string;
  }) => void;
  isSubmitting?: boolean;
}

export function ExpenseModal({
  open,
  onOpenChange,
  expense,
  onSubmit,
  isSubmitting,
}: ExpenseModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {expense ? "Edit Expense" : "Add Expense"}
          </DialogTitle>
        </DialogHeader>
        <ExpenseForm
          expense={expense}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
