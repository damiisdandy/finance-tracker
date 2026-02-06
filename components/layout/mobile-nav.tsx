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
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { authClient } from "@/lib/auth-client";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Subscriptions", href: "/subscriptions", icon: CreditCard },
  { name: "Expenses", href: "/expenses", icon: Receipt },
  { name: "Income", href: "/income", icon: Wallet },
  { name: "Savings", href: "/savings", icon: PiggyBank },
  { name: "Calculator", href: "/calculator", icon: Calculator },
];

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname();
  const { data: session, isPending } = authClient.useSession();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed left-4 top-4 z-50 lg:hidden"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b border-border p-6">
          <SheetTitle className="flex items-center gap-2">
            <Wallet className="h-6 w-6" />
            Finance Tracker
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 p-4">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => onOpenChange(false)}
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
        <div className="border-t border-border p-4">
          {session && !isPending ? (
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium">{session.user.name ?? "Account"}</p>
                <p className="text-xs text-muted-foreground">{session.user.email}</p>
              </div>
              <Button
                variant="destructive"
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
                <Link href="/sign-in" onClick={() => onOpenChange(false)}>
                  Sign in
                </Link>
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
