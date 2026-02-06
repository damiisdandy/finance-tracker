"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IncomeForm } from "./income-form";
import type { Income } from "@/lib/db/schema";

interface IncomeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  income?: Income | null;
  onSubmit: (data: {
    name: string;
    amount: string;
    frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "one-time";
    currency: "NGN" | "USD";
    type: "salary" | "interest" | "other";
    date: string;
  }) => void;
  isSubmitting?: boolean;
}

export function IncomeModal({
  open,
  onOpenChange,
  income,
  onSubmit,
  isSubmitting,
}: IncomeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {income ? "Edit Income" : "Add Income"}
          </DialogTitle>
        </DialogHeader>
        <IncomeForm
          income={income}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
