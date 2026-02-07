"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { SubscriptionTable } from "@/components/subscriptions/subscription-table";
import { SubscriptionModal } from "@/components/subscriptions/subscription-modal";
import { SubscriptionKPIs } from "@/components/subscriptions/subscription-kpis";
import type { Subscription } from "@/lib/db/schema";

export default function SubscriptionsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);

  const utils = trpc.useUtils();
  const { data: subscriptions, isLoading } = trpc.subscription.list.useQuery();

  const createMutation = trpc.subscription.create.useMutation({
    onSuccess: () => {
      utils.subscription.list.invalidate();
      setModalOpen(false);
    },
  });

  const updateMutation = trpc.subscription.update.useMutation({
    onSuccess: () => {
      utils.subscription.list.invalidate();
      setModalOpen(false);
      setEditingSubscription(null);
    },
  });

  const deleteMutation = trpc.subscription.delete.useMutation({
    onSuccess: () => {
      utils.subscription.list.invalidate();
    },
  });

  const handleSubmit = (data: {
    name: string;
    amount: string;
    frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "one-time";
    currency: "NGN" | "USD";
    nextPaymentDate?: string;
  }) => {
    if (editingSubscription) {
      updateMutation.mutate({ ...data, id: editingSubscription.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setEditingSubscription(null);
    }
  };

  return (
    <div className="flex min-w-0 flex-col overflow-auto">
      <Header title="Subscriptions" />
      <div className="min-w-0 flex-1 space-y-4 p-4 sm:space-y-6 sm:p-6">
        {!isLoading && (subscriptions ?? []).length > 0 && (
          <SubscriptionKPIs subscriptions={subscriptions ?? []} />
        )}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Subscriptions</CardTitle>
            <Button onClick={() => setModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Subscription
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <SubscriptionTable
                subscriptions={subscriptions ?? []}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <SubscriptionModal
        open={modalOpen}
        onOpenChange={handleOpenChange}
        subscription={editingSubscription}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
