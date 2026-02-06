"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { SavingsTable } from "@/components/savings/savings-table";
import { SavingsModal } from "@/components/savings/savings-modal";
import type { SavingsAccount } from "@/lib/db/schema";

export default function SavingsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSavings, setEditingSavings] = useState<SavingsAccount | null>(
    null
  );

  const utils = trpc.useUtils();
  const { data: accounts, isLoading } = trpc.savings.list.useQuery();

  const createMutation = trpc.savings.create.useMutation({
    onSuccess: () => {
      utils.savings.list.invalidate();
      setModalOpen(false);
    },
  });

  const updateMutation = trpc.savings.update.useMutation({
    onSuccess: () => {
      utils.savings.list.invalidate();
      setModalOpen(false);
      setEditingSavings(null);
    },
  });

  const deleteMutation = trpc.savings.delete.useMutation({
    onSuccess: () => {
      utils.savings.list.invalidate();
    },
  });

  const handleSubmit = (data: {
    name: string;
    balance: string;
    currency: "NGN" | "USD";
  }) => {
    if (editingSavings) {
      updateMutation.mutate({ ...data, id: editingSavings.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (account: SavingsAccount) => {
    setEditingSavings(account);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this savings account?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setEditingSavings(null);
    }
  };

  return (
    <div className="flex min-w-0 flex-col overflow-hidden">
      <Header title="Savings" />
      <div className="min-w-0 flex-1 overflow-hidden p-4 sm:p-6">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Savings Accounts</CardTitle>
            <Button onClick={() => setModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Account
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <SavingsTable
                accounts={accounts ?? []}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <SavingsModal
        open={modalOpen}
        onOpenChange={handleOpenChange}
        savings={editingSavings}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
