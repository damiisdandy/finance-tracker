import { NextResponse } from "next/server";
import { db, savingsAccounts, users } from "@/lib/db";
import { eq } from "drizzle-orm";
import { env } from "@/lib/env";
import { sendEmail } from "@/lib/email/resend";
import { generateSavingsReminderHtml } from "@/lib/email/templates/savings-reminder";
import { formatCurrency, type Currency } from "@/lib/utils/currency";

function getTotalsByCurrency(
  accounts: { balance: string; currency: Currency }[],
) {
  return accounts.reduce<Record<Currency, number>>(
    (acc, account) => {
      const balance = parseFloat(account.balance);
      acc[account.currency] += Number.isNaN(balance) ? 0 : balance;
      return acc;
    },
    { NGN: 0, USD: 0 },
  );
}

function formatTotals(totals: Record<Currency, number>) {
  const parts = (Object.keys(totals) as Currency[])
    .filter((currency) => totals[currency] > 0)
    .map((currency) => formatCurrency(totals[currency], currency));

  return parts.length > 0 ? parts.join(" + ") : formatCurrency(0, "NGN");
}

function getAppUrl(request: Request) {
  const configuredUrl = env.BETTER_AUTH_URL || env.NEXT_PUBLIC_APP_URL;

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return new URL(request.url).origin;
  }
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || authHeader !== `Bearer ${env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const recipients = await db
    .select({
      userId: users.id,
      userEmail: users.email,
      userName: users.name,
    })
    .from(users);

  let sent = 0;

  const appUrl = getAppUrl(request);

  await Promise.all(
    recipients.map(async (recipient) => {
      const to = recipient.userEmail;
      if (!to) {
        return;
      }

      const accounts = await db
        .select({
          name: savingsAccounts.name,
          balance: savingsAccounts.balance,
          currency: savingsAccounts.currency,
        })
        .from(savingsAccounts)
        .where(eq(savingsAccounts.userId, recipient.userId));

      if (accounts.length === 0) {
        return;
      }

      const totals = getTotalsByCurrency(accounts);
      const totalSavings = formatTotals(totals);

      const html = generateSavingsReminderHtml({
        totalSavings,
        accounts: accounts.map((account) => ({
          name: account.name,
          balance: formatCurrency(
            parseFloat(account.balance),
            account.currency,
          ),
          currency: account.currency,
        })),
        appUrl,
      });

      const subject = `Monthly financial update reminder${recipient.userName ? ` for ${recipient.userName}` : ""}`;
      const result = await sendEmail({ to, subject, html });

      if (result.success) {
        sent += 1;
      }
    }),
  );

  return NextResponse.json({ success: true, sent });
}
