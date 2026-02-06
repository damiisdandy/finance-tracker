"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      <MobileNav open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* Main content */}
      <main className="min-w-0 flex-1 lg:pl-64">{children}</main>
    </div>
  );
}
