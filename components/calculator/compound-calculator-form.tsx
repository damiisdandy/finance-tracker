"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { NumberInput } from "@/components/ui/number-input";
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
  initialValues?: {
    principal?: string;
    monthlyContribution?: string;
    annualRate?: string;
  };
}

export function CompoundCalculatorForm({
  onCalculate,
  initialValues,
}: CompoundCalculatorFormProps) {
  const hasAutoCalculated = useRef(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      principal: initialValues?.principal ?? "100000",
      monthlyContribution: initialValues?.monthlyContribution ?? "10000",
      annualRate: initialValues?.annualRate ?? "10",
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

  useEffect(() => {
    if (initialValues && !hasAutoCalculated.current) {
      hasAutoCalculated.current = true;
      form.handleSubmit(handleSubmit)();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
                <NumberInput step="0.01" placeholder="100000" {...field} />
              </FormControl>
              <FormDescription>
                The initial amount you&apos;re starting with
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
                <NumberInput step="0.01" placeholder="10000" {...field} />
              </FormControl>
              <FormDescription>
                Amount you&apos;ll add each month
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
                <NumberInput step="0.1" placeholder="10" {...field} />
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
                <NumberInput step="1" placeholder="10" {...field} />
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
