"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SavingsForm } from "./savings-form";
import type { SavingsAccount } from "@/lib/db/schema";

interface SavingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  savings?: SavingsAccount | null;
  onSubmit: (data: {
    name: string;
    balance: string;
    monthlyContribution?: string;
    interestRate?: string;
    currency: "NGN" | "USD";
  }) => void;
  isSubmitting?: boolean;
}

export function SavingsModal({
  open,
  onOpenChange,
  savings,
  onSubmit,
  isSubmitting,
}: SavingsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {savings ? "Edit Savings Account" : "Add Savings Account"}
          </DialogTitle>
        </DialogHeader>
        <SavingsForm
          savings={savings}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
