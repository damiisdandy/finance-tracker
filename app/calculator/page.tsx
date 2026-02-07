"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompoundCalculatorForm } from "@/components/calculator/compound-calculator-form";
import { ResultDisplay } from "@/components/calculator/result-display";
import {
  calculateCompoundInterest,
  type CompoundInterestResult,
} from "@/lib/utils/calculator";

export default function CalculatorPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<CompoundInterestResult | null>(null);

  const initialValues = {
    principal: searchParams.get("principal") ?? undefined,
    monthlyContribution: searchParams.get("monthly") ?? undefined,
    annualRate: searchParams.get("rate") ?? undefined,
  };

  const hasInitialValues = initialValues.principal || initialValues.monthlyContribution || initialValues.annualRate;

  const handleCalculate = (data: {
    principal: number;
    monthlyContribution: number;
    annualRate: number;
    years: number;
  }) => {
    const calculatedResult = calculateCompoundInterest(
      data.principal,
      data.monthlyContribution,
      data.annualRate,
      data.years
    );
    setResult(calculatedResult);
  };

  return (
    <div className="flex flex-col">
      <Header title="Compound Interest Calculator" />
      <div className="flex-1 p-4 sm:p-6">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <CompoundCalculatorForm
                onCalculate={handleCalculate}
                initialValues={hasInitialValues ? initialValues : undefined}
              />
            </CardContent>
          </Card>

          <div className="lg:col-span-2">
            <ResultDisplay result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
