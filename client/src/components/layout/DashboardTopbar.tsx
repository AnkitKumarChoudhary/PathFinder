"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Bell, Menu, Search, Settings, User } from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { buildBreadcrumbs, getRoleMeta, getRoleFromPathname, type DashboardRole } from "@/lib/navigation";
import { useAuthStore } from "@/store/authStore";
import { useNotifications } from "@/hooks/useNotifications";

interface DashboardTopbarProps {
  role?: DashboardRole;
  onMenuClick?: () => void;
}

export function DashboardTopbar({ role, onMenuClick }: DashboardTopbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const activeRole = role ?? getRoleFromPathname(pathname);
  const breadcrumbs = buildBreadcrumbs(pathname);
  
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotifications();
  
  // Fallback to static meta if user isn't loaded yet
  const profile = user ? {
    name: `${user.firstName} ${user.lastName}`,
    email: user.email,
    roleLabel: user.role
  } : getRoleMeta(activeRole);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-border bg-surface px-4 dark:border-dark-border dark:bg-dark-surface md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-brand-cream text-charcoal dark:border-dark-border dark:bg-dark-elevated dark:text-dark-text md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div className="min-w-0">
          <Breadcrumb items={breadcrumbs} className="truncate" />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden items-center rounded-full border border-border bg-brand-cream px-4 py-2 text-body-sm text-muted dark:border-dark-border dark:bg-dark-elevated dark:text-dark-muted lg:flex lg:w-[320px]">
          <Search className="mr-2 h-4 w-4" />
          <span>Search careers, mentors, resources...</span>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-brand-cream text-charcoal dark:border-dark-border dark:bg-dark-elevated dark:text-dark-text lg:hidden"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </button>
        <button
          type="button"
          className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-charcoal dark:border-dark-border dark:bg-dark-elevated dark:text-dark-text"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
             <span className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-status-error px-1 text-[10px] font-semibold text-white">
               {unreadCount > 9 ? '9+' : unreadCount}
             </span>
          )}
        </button>
        <ThemeToggle />
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((current) => !current)}
            className="inline-flex items-center rounded-full"
            aria-label="Open user menu"
          >
            {user?.avatar ? (
              <span className="relative h-10 w-10 overflow-hidden rounded-full border border-border">
               <Image src={user.avatar} alt="Avatar" fill className="object-cover" unoptimized />
              </span>
            ) : (
               <Avatar firstName={profile.name.split(" ")[0]} lastName={profile.name.split(" ")[1] ?? ""} ring />
            )}
          </button>
          {open ? (
            <div className="absolute right-0 top-14 w-64 rounded-2xl border border-border bg-surface p-2 shadow-elevated dark:border-dark-border dark:bg-dark-surface">
              <div className="rounded-xl bg-brand-ivory p-3 dark:bg-dark-elevated">
                <p className="font-medium text-charcoal dark:text-dark-text">{profile.name}</p>
                <p className="mt-1 text-body-sm text-muted dark:text-dark-muted">{profile.email}</p>
              </div>
              <div className="mt-2 space-y-1">
                <Link href={`/${activeRole}/profile`} className="flex items-center gap-3 rounded-xl px-3 py-2 text-body-sm hover:bg-brand-cream dark:hover:bg-dark-elevated">
                  <User className="h-4 w-4" />
                  View Profile
                </Link>
                <Link href={`/${activeRole}/profile`} className="flex items-center gap-3 rounded-xl px-3 py-2 text-body-sm hover:bg-brand-cream dark:hover:bg-dark-elevated">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </div>
              <div className="my-2 border-t border-border dark:border-dark-border" />
              <button 
                type="button" 
                onClick={handleLogout}
                className="w-full rounded-xl px-3 py-2 text-left text-body-sm text-status-error transition hover:bg-status-error/10"
              >
                Logout
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
