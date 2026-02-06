import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import {
  subscriptions,
  expenses,
  income,
  savingsAccounts,
  savingsAllocations,
  userSettings,
  accounts,
  sessions,
  users,
  verifications,
} from "./schema";
import { auth } from "@/lib/auth";

config({ path: ".env.local" });

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
const db = drizzle(client);

async function seed() {
  console.log("Seeding database...");

  // Clear existing data
  await db.delete(subscriptions);
  await db.delete(expenses);
  await db.delete(income);
  await db.delete(savingsAllocations);
  await db.delete(savingsAccounts);
  await db.delete(userSettings);
  await db.delete(sessions);
  await db.delete(accounts);
  await db.delete(verifications);
  await db.delete(users);

  const { user } = await auth.api.signUpEmail({
    body: {
      name: "Demo User",
      email: "damilola.jerugba@gmail.com",
      password: "password123",
      callbackURL: "/",
    },
  });

  // Seed subscriptions
  await db.insert(subscriptions).values([
    {
      userId: user.id,
      name: "Netflix",
      amount: "5500.00",
      frequency: "monthly",
      currency: "NGN",
      nextPaymentDate: "2026-03-01",
    },
    {
      userId: user.id,
      name: "Spotify",
      amount: "2500.00",
      frequency: "monthly",
      currency: "NGN",
      nextPaymentDate: "2026-02-15",
    },
    {
      userId: user.id,
      name: "GitHub Copilot",
      amount: "10.00",
      frequency: "monthly",
      currency: "USD",
      nextPaymentDate: "2026-02-20",
    },
    {
      userId: user.id,
      name: "YouTube Premium",
      amount: "4500.00",
      frequency: "monthly",
      currency: "NGN",
      nextPaymentDate: "2026-02-25",
    },
    {
      userId: user.id,
      name: "iCloud Storage",
      amount: "0.99",
      frequency: "monthly",
      currency: "USD",
      nextPaymentDate: "2026-03-05",
    },
  ]);

  // Seed expenses
  await db.insert(expenses).values([
    {
      userId: user.id,
      name: "Weekly Groceries",
      amount: "25000.00",
      frequency: "weekly",
      currency: "NGN",
      category: "groceries",
      date: "2026-02-01",
    },
    {
      userId: user.id,
      name: "Uber to Work",
      amount: "3500.00",
      frequency: "daily",
      currency: "NGN",
      category: "transport",
      date: "2026-02-03",
    },
    {
      userId: user.id,
      name: "Electricity Bill",
      amount: "15000.00",
      frequency: "monthly",
      currency: "NGN",
      category: "utilities",
      date: "2026-02-01",
    },
    {
      userId: user.id,
      name: "Movie Night",
      amount: "8000.00",
      frequency: "one-time",
      currency: "NGN",
      category: "entertainment",
      date: "2026-02-05",
    },
    {
      userId: user.id,
      name: "Gym Membership",
      amount: "35000.00",
      frequency: "monthly",
      currency: "NGN",
      category: "healthcare",
      date: "2026-02-01",
    },
    {
      userId: user.id,
      name: "Online Course",
      amount: "50.00",
      frequency: "one-time",
      currency: "USD",
      category: "education",
      date: "2026-01-15",
    },
  ]);

  // Seed income
  await db.insert(income).values([
    {
      userId: user.id,
      name: "Monthly Salary",
      amount: "850000.00",
      frequency: "monthly",
      currency: "NGN",
      type: "salary",
      date: "2026-02-01",
    },
    {
      userId: user.id,
      name: "Interest from Mutual Fund",
      amount: "25000.00",
      frequency: "monthly",
      currency: "NGN",
      type: "interest",
      date: "2026-02-05",
    },
    {
      userId: user.id,
      name: "Freelance Project",
      amount: "500.00",
      frequency: "one-time",
      currency: "USD",
      type: "other",
      date: "2026-01-20",
    },
    {
      userId: user.id,
      name: "Savings Interest",
      amount: "12000.00",
      frequency: "quarterly",
      currency: "NGN",
      type: "interest",
      date: "2026-01-01",
    },
  ]);

  // Seed savings accounts
  const seededSavingsAccounts = await db
    .insert(savingsAccounts)
    .values([
      {
        userId: user.id,
        name: "Emergency Fund",
        balance: "500000.00",
        currency: "NGN",
      },
      {
        userId: user.id,
        name: "Travel Fund",
        balance: "250000.00",
        currency: "NGN",
      },
      {
        userId: user.id,
        name: "Investment Account",
        balance: "1500.00",
        currency: "USD",
      },
      {
        userId: user.id,
        name: "Retirement Savings",
        balance: "1200000.00",
        currency: "NGN",
      },
    ])
    .returning();

  const emergencyFund = seededSavingsAccounts.find(
    (account) => account.name === "Emergency Fund",
  );
  const travelFund = seededSavingsAccounts.find(
    (account) => account.name === "Travel Fund",
  );
  const retirementSavings = seededSavingsAccounts.find(
    (account) => account.name === "Retirement Savings",
  );

  // Seed savings allocations
  await db.insert(savingsAllocations).values([
    {
      userId: user.id,
      name: "Salary Savings",
      amount: "150000.00",
      frequency: "monthly",
      currency: "NGN",
      savingsAccountId: emergencyFund?.id ?? null,
      date: "2026-02-01",
    },
    {
      userId: user.id,
      name: "Vacation Contribution",
      amount: "40000.00",
      frequency: "monthly",
      currency: "NGN",
      savingsAccountId: travelFund?.id ?? null,
      date: "2026-02-01",
    },
    {
      userId: user.id,
      name: "401k Transfer",
      amount: "300.00",
      frequency: "monthly",
      currency: "USD",
      savingsAccountId: retirementSavings?.id ?? null,
      date: "2026-02-01",
    },
    {
      userId: user.id,
      name: "Bonus Allocation",
      amount: "200000.00",
      frequency: "one-time",
      currency: "NGN",
      savingsAccountId: emergencyFund?.id ?? null,
      date: "2026-01-20",
    },
  ]);

  // Seed user settings
  await db.insert(userSettings).values([
    {
      userId: user.id,
      email: null,
      reminderFrequency: "weekly",
    },
  ]);

  console.log("Seeding complete!");

  await client.end();
}

seed().catch((err) => {
  console.error("Error seeding database:", err);
  process.exit(1);
});
