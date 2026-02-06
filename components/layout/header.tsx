"use client";

import { CurrencySelector } from "./currency-selector";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border px-6 pl-16 lg:pl-6">
      <h1 className="text-xl font-semibold sm:text-2xl">{title}</h1>
      <div className="flex items-center gap-3">
        <CurrencySelector />
        {session && !isPending ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{session.user.email}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => authClient.signOut({})}
            >
              Sign out
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
