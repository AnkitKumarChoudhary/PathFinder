"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { getRoleFromPathname } from "@/lib/navigation";

import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardTopbar } from "./DashboardTopbar";
import { MobileNav } from "./MobileNav";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role = getRoleFromPathname(pathname);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-brand-cream dark:bg-dark-bg">
      <div className="flex min-h-screen">
        <DashboardSidebar role={role} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <DashboardTopbar role={role} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 px-4 pb-24 pt-6 md:px-8 md:pb-8">{children}</main>
        </div>
      </div>
      <MobileNav role={role} />
    </div>
  );
}