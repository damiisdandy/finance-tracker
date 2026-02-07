"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/ui/number-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SavingsAccount } from "@/lib/db/schema";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  balance: z.string().min(1, "Balance is required"),
  monthlyContribution: z.string().min(1, "Monthly contribution is required"),
  interestRate: z.string().min(1, "Interest rate is required"),
  currency: z.enum(["NGN", "USD"]),
});

type FormValues = z.input<typeof formSchema>;
type FormSubmitValues = z.output<typeof formSchema>;

interface SavingsFormProps {
  savings?: SavingsAccount | null;
  onSubmit: (data: FormSubmitValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function SavingsForm({
  savings,
  onSubmit,
  onCancel,
  isSubmitting,
}: SavingsFormProps) {
  const form = useForm<FormValues, undefined, FormSubmitValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: savings?.name ?? "",
      balance: savings?.balance ?? "",
      monthlyContribution: savings?.monthlyContribution ?? "0",
      interestRate: savings?.interestRate ?? "0",
      currency: savings?.currency ?? "NGN",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="Emergency Fund" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="balance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Balance</FormLabel>
                <FormControl>
                  <NumberInput step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NGN">NGN</SelectItem>
                    <SelectItem value="USD">USD</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="monthlyContribution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Contribution</FormLabel>
                <FormControl>
                  <NumberInput step="0.01" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="interestRate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Annual Interest Rate (%)</FormLabel>
                <FormControl>
                  <NumberInput step="0.1" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : savings ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
