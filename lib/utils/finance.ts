export type Frequency =
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "quarterly"
  | "yearly"
  | "one-time";

/**
 * Convert an amount to its monthly equivalent based on frequency
 */
export function toMonthlyAmount(
  amount: number,
  frequency: Frequency,
  options?: { isWorkHours?: boolean },
): number {
  switch (frequency) {
    case "hourly":
      return options?.isWorkHours ? amount * 8 * 22 : amount * 24 * 30;
    case "daily":
      return amount * 30; // Approximate days per month
    case "weekly":
      return amount * 4.33; // Approximate weeks per month
    case "monthly":
      return amount;
    case "quarterly":
      return amount / 3;
    case "yearly":
      return amount / 12;
    case "one-time":
      return 0; // One-time doesn't contribute to monthly
    default:
      return amount;
  }
}

/**
 * Convert an amount to its yearly equivalent based on frequency
 */
export function toYearlyAmount(
  amount: number,
  frequency: Frequency,
  options?: { isWorkHours?: boolean },
): number {
  switch (frequency) {
    case "hourly":
      return options?.isWorkHours ? amount * 8 * 260 : amount * 24 * 365;
    case "daily":
      return amount * 365;
    case "weekly":
      return amount * 52;
    case "monthly":
      return amount * 12;
    case "quarterly":
      return amount * 4;
    case "yearly":
      return amount;
    case "one-time":
      return amount; // Count once for yearly view
    default:
      return amount;
  }
}
