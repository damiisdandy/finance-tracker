"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
} from "react";
import { trpc } from "@/lib/trpc/client";

type Currency = "NGN" | "USD";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convert: (amount: number, from: Currency) => number;
  format: (amount: number, currency?: Currency) => string;
  exchangeRate: number | null;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("NGN");

  const { data, isLoading } = trpc.currency.getExchangeRate.useQuery(
    { from: "USD", to: "NGN" },
    { staleTime: 60 * 60 * 1000 }, // 1 hour
  );
  const exchangeRate = data?.rate ?? null;

  const convert = useCallback(
    (amount: number, from: Currency): number => {
      if (from === currency || !exchangeRate) {
        return amount;
      }

      if (from === "USD" && currency === "NGN") {
        return amount * exchangeRate;
      } else if (from === "NGN" && currency === "USD") {
        return amount / exchangeRate;
      }

      return amount;
    },
    [currency, exchangeRate],
  );

  const format = useCallback(
    (amount: number, amountCurrency?: Currency): string => {
      const displayCurrency = amountCurrency ?? currency;
      const formatter = new Intl.NumberFormat(
        displayCurrency === "NGN" ? "en-NG" : "en-US",
        {
          style: "currency",
          currency: displayCurrency,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      );
      return formatter.format(amount);
    },
    [currency],
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        convert,
        format,
        exchangeRate,
        isLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
