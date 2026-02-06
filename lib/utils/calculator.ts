export interface CompoundInterestResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  yearlyBreakdown: {
    year: number;
    balance: number;
    contributions: number;
    interest: number;
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
  const yearlyBreakdown: CompoundInterestResult["yearlyBreakdown"] = [];

  for (let month = 1; month <= totalMonths; month++) {
    // Add interest
    const monthlyInterest = balance * monthlyRate;
    balance += monthlyInterest;

    // Add contribution
    balance += monthlyContribution;
    totalContributions += monthlyContribution;

    // Record yearly breakdown
    if (month % 12 === 0) {
      const year = month / 12;
      const contributionsToDate = principal + monthlyContribution * month;
      const interestToDate = balance - contributionsToDate;

      yearlyBreakdown.push({
        year,
        balance: Math.round(balance * 100) / 100,
        contributions: Math.round(contributionsToDate * 100) / 100,
        interest: Math.round(interestToDate * 100) / 100,
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
