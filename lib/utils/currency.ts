export type Currency = "NGN" | "USD";

export function formatCurrency(amount: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat(
    currency === "NGN" ? "en-NG" : "en-US",
    {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  );
  return formatter.format(amount);
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]+/g, "")) || 0;
}
