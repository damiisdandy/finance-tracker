"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { ExpenseModal } from "@/components/expenses/expense-modal";
import type { Expense } from "@/lib/db/schema";

export default function ExpensesPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const utils = trpc.useUtils();
  const { data: expenses, isLoading } = trpc.expense.list.useQuery();

  const createMutation = trpc.expense.create.useMutation({
    onSuccess: () => {
      utils.expense.list.invalidate();
      setModalOpen(false);
    },
  });

  const updateMutation = trpc.expense.update.useMutation({
    onSuccess: () => {
      utils.expense.list.invalidate();
      setModalOpen(false);
      setEditingExpense(null);
    },
  });

  const deleteMutation = trpc.expense.delete.useMutation({
    onSuccess: () => {
      utils.expense.list.invalidate();
    },
  });

  const handleSubmit = (data: {
    name: string;
    amount: string;
    frequency: "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "one-time";
    currency: "NGN" | "USD";
    category: "groceries" | "transport" | "utilities" | "entertainment" | "healthcare" | "education" | "shopping" | "other";
    date: string;
  }) => {
    if (editingExpense) {
      updateMutation.mutate({ ...data, id: editingExpense.id });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this expense?")) {
      deleteMutation.mutate({ id });
    }
  };

  const handleOpenChange = (open: boolean) => {
    setModalOpen(open);
    if (!open) {
      setEditingExpense(null);
    }
  };

  return (
    <div className="flex min-w-0 flex-col overflow-hidden">
      <Header title="Expenses" />
      <div className="min-w-0 flex-1 overflow-hidden p-4 sm:p-6">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>All Expenses</CardTitle>
            <Button onClick={() => setModalOpen(true)} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex h-[200px] items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <ExpenseTable
                expenses={expenses ?? []}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <ExpenseModal
        open={modalOpen}
        onOpenChange={handleOpenChange}
        expense={editingExpense}
        onSubmit={handleSubmit}
        isSubmitting={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
