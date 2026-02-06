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
import type { Subscription } from "@/lib/db/schema";
import { useCurrency } from "@/providers/currency-provider";
import { formatDate, isUpcoming } from "@/lib/utils/date";
import { cn } from "@/lib/utils";

interface SubscriptionTableProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
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

export function SubscriptionTable({
  subscriptions,
  onEdit,
  onDelete,
}: SubscriptionTableProps) {
  const { convert, format } = useCurrency();

  if (subscriptions.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-muted-foreground">No subscriptions found</p>
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
          <TableHead>Frequency</TableHead>
          <TableHead>Next Payment</TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscriptions.map((subscription) => {
          const amount = parseFloat(subscription.amount);
          const convertedAmount = convert(amount, subscription.currency);
          const upcoming = isUpcoming(subscription.nextPaymentDate);

          return (
            <TableRow key={subscription.id}>
              <TableCell className="font-medium">{subscription.name}</TableCell>
              <TableCell>
                {format(convertedAmount)}
                <span className="ml-1 text-xs text-muted-foreground">
                  ({subscription.currency})
                </span>
              </TableCell>
              <TableCell>{FREQUENCY_LABELS[subscription.frequency]}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    upcoming && "font-medium text-yellow-500"
                  )}
                >
                  {formatDate(subscription.nextPaymentDate)}
                </span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(subscription)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDelete(subscription.id)}
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
