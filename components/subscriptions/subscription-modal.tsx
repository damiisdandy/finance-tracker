"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SubscriptionForm } from "./subscription-form";
import type { Subscription } from "@/lib/db/schema";

interface SubscriptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscription?: Subscription | null;
  onSubmit: (data: {
    name: string;
    amount: string;
    frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "one-time";
    currency: "NGN" | "USD";
    nextPaymentDate: string;
  }) => void;
  isSubmitting?: boolean;
}

export function SubscriptionModal({
  open,
  onOpenChange,
  subscription,
  onSubmit,
  isSubmitting,
}: SubscriptionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {subscription ? "Edit Subscription" : "Add Subscription"}
          </DialogTitle>
        </DialogHeader>
        <SubscriptionForm
          subscription={subscription}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
