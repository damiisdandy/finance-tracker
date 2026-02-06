import { z } from "zod";
import { router, publicProcedure } from "../trpc";

// Cache exchange rates for 1 hour
let cachedRates: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

async function fetchRates() {
  if (cachedRates && Date.now() - cachedRates.timestamp < CACHE_DURATION) {
    return cachedRates.rates;
  }

  try {
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/USD`
    );
    const data = await response.json();

    cachedRates = {
      rates: data.rates,
      timestamp: Date.now(),
    };

    return data.rates;
  } catch {
    // Fallback rates if API fails
    return {
      USD: 1,
      NGN: 1550,
      GBP: 0.79,
    };
  }
}

export const currencyRouter = router({
  getExchangeRate: publicProcedure
    .input(
      z.object({
        from: z.enum(["NGN", "USD"]),
        to: z.enum(["NGN", "USD"]),
      })
    )
    .query(async ({ input }) => {
      if (input.from === input.to) {
        return { rate: 1 };
      }

      const rates = await fetchRates();

      if (input.from === "USD" && input.to === "NGN") {
        return { rate: rates.NGN };
      } else {
        return { rate: 1 / rates.NGN };
      }
    }),

  getAllRates: publicProcedure.query(async () => {
    const rates = await fetchRates();

    // Return rates relative to USD
    return {
      USD: 1,
      NGN: rates.NGN,
      GBP: rates.GBP,
      lastUpdated: cachedRates?.timestamp ?? Date.now(),
    };
  }),
});
