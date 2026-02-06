"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

const formSchema = z.object({
  principal: z.string().min(1, "Principal is required"),
  monthlyContribution: z.string().min(1, "Monthly contribution is required"),
  annualRate: z.string().min(1, "Annual rate is required"),
  years: z.string().min(1, "Number of years is required"),
});

type FormValues = z.infer<typeof formSchema>;

interface CompoundCalculatorFormProps {
  onCalculate: (data: {
    principal: number;
    monthlyContribution: number;
    annualRate: number;
    years: number;
  }) => void;
}

export function CompoundCalculatorForm({
  onCalculate,
}: CompoundCalculatorFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: "100000",
      monthlyContribution: "10000",
      annualRate: "10",
      years: "10",
    },
  });

  const handleSubmit = (data: FormValues) => {
    onCalculate({
      principal: parseFloat(data.principal),
      monthlyContribution: parseFloat(data.monthlyContribution),
      annualRate: parseFloat(data.annualRate),
      years: parseInt(data.years),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="principal"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Principal</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="100000" {...field} />
              </FormControl>
              <FormDescription>
                The initial amount you're starting with
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="monthlyContribution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Contribution</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="10000" {...field} />
              </FormControl>
              <FormDescription>
                Amount you'll add each month
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="annualRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Interest Rate (%)</FormLabel>
              <FormControl>
                <Input type="number" step="0.1" placeholder="10" {...field} />
              </FormControl>
              <FormDescription>
                Expected annual return rate
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="years"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Investment Period (Years)</FormLabel>
              <FormControl>
                <Input type="number" step="1" placeholder="10" {...field} />
              </FormControl>
              <FormDescription>
                How long you plan to invest
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Calculate
        </Button>
      </form>
    </Form>
  );
}
