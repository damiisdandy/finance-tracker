interface SavingsReminderProps {
  totalSavings: string;
  accounts: {
    name: string;
    balance: string;
    currency: string;
  }[];
  appUrl: string;
}

export function generateSavingsReminderHtml({
  totalSavings,
  accounts,
  appUrl,
}: SavingsReminderProps): string {
  const baseUrl = appUrl.endsWith("/") ? appUrl.slice(0, -1) : appUrl;
  const savingsUrl = new URL("/savings", `${baseUrl}/`).toString();

  const accountRows = accounts
    .map(
      (account) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #27272a;">${account.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #27272a; text-align: right;">
          ${account.balance} ${account.currency}
        </td>
      </tr>
    `
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Savings Reminder</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #000000; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Finance Tracker</h1>
          </div>

          <div style="background-color: #09090b; border-radius: 8px; padding: 32px; border: 1px solid #27272a;">
            <h2 style="margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">
              Monthly Financial Update Reminder
            </h2>

            <p style="margin: 0 0 24px 0; color: #a1a1aa; line-height: 1.6;">
              It is time to update your financial information for the month. Start by reviewing and updating your savings accounts.
            </p>

            <div style="background-color: #27272a; border-radius: 8px; padding: 24px; margin-bottom: 24px; text-align: center;">
              <p style="margin: 0 0 8px 0; color: #a1a1aa; font-size: 14px;">Total Savings</p>
              <p style="margin: 0; font-size: 32px; font-weight: 700; color: #22c55e;">
                ${totalSavings}
              </p>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <thead>
                <tr>
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #27272a; color: #a1a1aa; font-weight: 500;">
                    Account
                  </th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #27272a; color: #a1a1aa; font-weight: 500;">
                    Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                ${accountRows}
              </tbody>
            </table>

            <a href="${savingsUrl}" style="display: block; text-align: center; background-color: #ffffff; color: #09090b; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 500;">
              Update Savings Information
            </a>
          </div>

          <p style="text-align: center; margin-top: 32px; color: #a1a1aa; font-size: 14px;">
            This reminder is sent monthly to help you keep your financial records current.
            <br>
            <a href="${savingsUrl}" style="color: #a1a1aa;">Open your savings accounts</a>
          </p>
        </div>
      </body>
    </html>
  `;
}
