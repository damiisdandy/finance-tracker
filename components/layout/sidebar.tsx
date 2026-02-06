"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CreditCard,
  Receipt,
  Wallet,
  PiggyBank,
  Calculator,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Income", href: "/income", icon: Wallet },
  { name: "Savings", href: "/savings", icon: PiggyBank },
  { name: "Calculator", href: "/calculator", icon: Calculator },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/" className="flex items-center gap-2">
          <Wallet className="h-6 w-6" />
          <span className="text-lg font-semibold">Finance Tracker</span>
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-4">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-border p-4">
        {session && !isPending ? (
          <div className="space-y-3">
            <div className="text-sm">
              <p className="font-medium">{session.user.name ?? "Account"}</p>
              <p className="text-xs text-muted-foreground">{session.user.email}</p>
            </div>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => authClient.signOut({})}
            >
              Sign out
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Sign in to sync your data.</p>
            <Button asChild className="w-full">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
