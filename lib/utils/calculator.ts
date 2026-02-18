export interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  calculatedCurrency: "NGN" | "USD";
  yearlyBreakdown: {
    year: number;
    balance: number;
    contributions: number;
    interest: number;
    yearlyInterest: number;
  }[];
}

export function calculateCompoundInterest(
  principal: number,
  monthlyContribution: number,
  annualRate: number,
  years: number
): CompoundInterestResult {
  const monthlyRate = annualRate / 100 / 12;
  const totalMonths = years * 12;

  let balance = principal;
  let totalContributions = principal;
  let previousInterest = 0;
  const yearlyBreakdown: CompoundInterestResult["yearlyBreakdown"] = [];
  const currentYear = new Date().getFullYear();

  for (let month = 1; month <= totalMonths; month++) {
    // Add interest
    const monthlyInterest = balance * monthlyRate;
    balance += monthlyInterest;

    // Add contribution
    balance += monthlyContribution;
    totalContributions += monthlyContribution;

    // Record yearly breakdown
    if (month % 12 === 0) {
      const yearIndex = month / 12;
      const contributionsToDate = principal + monthlyContribution * month;
      const interestToDate = balance - contributionsToDate;
      const yearlyInterest = interestToDate - previousInterest;
      previousInterest = interestToDate;

      yearlyBreakdown.push({
        year: currentYear + yearIndex,
        balance: Math.round(balance * 100) / 100,
        contributions: Math.round(contributionsToDate * 100) / 100,
        interest: Math.round(interestToDate * 100) / 100,
        yearlyInterest: Math.round(yearlyInterest * 100) / 100,
      });
    }
  }

  const totalInterest = balance - totalContributions;

  return {
    futureValue: Math.round(balance * 100) / 100,
    totalContributions: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    yearlyBreakdown,
  };
}
