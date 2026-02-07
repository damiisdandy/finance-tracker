"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { IncomeTable } from "@/components/income/income-table";
import { IncomeModal } from "@/components/income/income-modal";
import type { Income } from "@/lib/db/schema";

export default function IncomePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const utils = trpc.useUtils();
  const { data: incomeList, isLoading } = trpc.income.list.useQuery();

  const createMutation = trpc.income.create.useMutation({
    onSuccess: () => {
      utils.income.list.invalidate();
      setModalOpen(false);
    },
  });

  const updateMutation = trpc.income.update.useMutation({
    onSuccess: () => {
      utils.income.list.invalidate();
      setModalOpen(false);
      setEditingIncome(null);
    },
  });

  const deleteMutation = trpc.income.delete.useMutation({
    onSuccess: () => {
      utils.income.list.invalidate();
    },
  });

  const handleSubmit = (data: {
    name: string;
    amount: string;
    frequency:
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "quarterly"
      | "yearly"
      | "one-time";
    isWorkHours: boolean;
    currency: "NGN" | "USD";
    type: "salary" | "interest" | "other";
    date: string;
  }) => {
    if (editingIncome) {
      updateMutation.mutate({ ...data, id: editingIncome.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this income?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setEditingIncome(null);
    }
  };

  return (
    <div className="flex min-w-0 flex-col overflow-hidden">
      <Header title="Income" />
      <div className="min-w-0 flex-1 overflow-hidden p-4 sm:p-6">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Income</CardTitle>
            <Button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Income
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-50 items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <IncomeTable
                incomeList={incomeList ?? []}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <IncomeModal
        open={modalOpen}
        onOpenChange={handleOpenChange}
        income={editingIncome}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
