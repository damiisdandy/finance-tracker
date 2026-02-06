import { router } from "../trpc";
import { subscriptionRouter } from "./subscription";
import { expenseRouter } from "./expense";
import { incomeRouter } from "./income";
import { savingsRouter } from "./savings";
import { savingsAllocationRouter } from "./savings-allocation";
import { currencyRouter } from "./currency";
import { settingsRouter } from "./settings";

export const appRouter = router({
  subscription: subscriptionRouter,
  expense: expenseRouter,
  income: incomeRouter,
  savings: savingsRouter,
  savingsAllocation: savingsAllocationRouter,
  currency: currencyRouter,
  settings: settingsRouter,
});

export type AppRouter = typeof appRouter;
