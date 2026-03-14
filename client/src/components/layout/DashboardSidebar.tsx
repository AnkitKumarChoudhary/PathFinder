"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, X } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { dashboardNavigation, getRoleMeta, getRoleFromPathname, type DashboardRole } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

interface DashboardSidebarProps {
  role?: DashboardRole;
  isOpen?: boolean;
  onClose?: () => void;
}

function SidebarContent({ role, onClose }: { role: DashboardRole; onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const activeProfile = user ? {
    name: `${user.firstName} ${user.lastName}`,
    roleLabel: user.role
  } : getRoleMeta(role);
  const sections = dashboardNavigation[role];
  const normalizedRole = user?.role === 'COUNSELLOR' ? 'Counsellor' : activeProfile.roleLabel;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-6">
        <Link href={`/${role}`} className="font-heading text-heading-4 font-bold text-charcoal dark:text-dark-text">
          PathFinder
        </Link>
      </div>
      <div className="mx-5 border-t border-border dark:border-dark-border" />

      <div className="scrollbar-hide flex-1 space-y-8 overflow-y-auto px-4 py-6">
        {sections.map((section, sectionIndex) => (
          <div key={`${section.label}-${sectionIndex}`}>
            <p className="px-3 text-caption font-semibold uppercase tracking-[0.2em] text-muted dark:text-dark-muted">
              {section.label}
            </p>
            <div className="mt-3 space-y-1.5">
              {section.items.map((item, itemIndex) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                const isLogoutItem = item.label.toLowerCase() === 'logout';

                if (isLogoutItem) {
                  return (
                    <button
                      key={`${section.label}-${item.href}-${itemIndex}`}
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-l-xl px-4 py-2.5 text-body-sm font-medium text-slate transition-all duration-200 hover:bg-brand-cream hover:text-charcoal dark:text-dark-muted dark:hover:bg-dark-elevated dark:hover:text-dark-text"
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                }

                return (
                  <Link
                    key={`${section.label}-${item.href}-${itemIndex}`}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-l-xl px-4 py-2.5 text-body-sm font-medium transition-all duration-200",
                      active
                        ? "border-r-[3px] border-brand-forest bg-brand-forest/10 text-brand-forest dark:bg-brand-forest/15 dark:text-brand-mint"
                        : "text-slate hover:bg-brand-cream hover:text-charcoal dark:text-dark-muted dark:hover:bg-dark-elevated dark:hover:text-dark-text",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-border p-4 dark:border-dark-border">
        <div className="flex items-center gap-3 rounded-2xl bg-brand-ivory p-3 dark:bg-dark-elevated">
          {user?.avatar ? (
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-white">
              <Image src={user.avatar} alt="Avatar" fill className="object-cover" unoptimized />
            </div>
          ) : (
            <Avatar firstName={activeProfile.name.split(" ")[0]} lastName={activeProfile.name.split(" ")[1] ?? ""} status="online" ring />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-body-sm font-semibold text-charcoal dark:text-dark-text">{activeProfile.name}</p>
            <Badge
              variant="mint"
              size="sm"
              className={cn(
                'capitalize',
                role === 'counsellor' && 'bg-brand-sage/20 text-brand-forest dark:bg-brand-sage/20 dark:text-brand-mint',
                role === 'admin' && 'bg-brand-terracotta/15 text-brand-terracotta dark:bg-brand-terracotta/20 dark:text-brand-terracotta'
              )}
            >
              {normalizedRole.toLowerCase()}
            </Badge>
          </div>
        </div>
        <Button onClick={handleLogout} variant="ghost" className="mt-3 w-full justify-start hover:text-status-error hover:bg-status-error/10" leftIcon={<LogOut className="h-4 w-4" />}>
          Logout
        </Button>
      </div>
    </div>
  );
}

export function DashboardSidebar({ role, isOpen = false, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const activeRole = role ?? getRoleFromPathname(pathname);

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 overflow-hidden border-r border-border bg-surface dark:border-dark-border dark:bg-dark-surface md:block">
        <SidebarContent role={activeRole} />
      </aside>

      <AnimatePresence>
        {isOpen ? (
          <>
            <motion.div
              className="fixed inset-0 z-[70] bg-charcoal/40 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed left-0 top-0 z-[71] h-screen w-[260px] overflow-hidden border-r border-border bg-surface shadow-elevated dark:border-dark-border dark:bg-dark-surface md:hidden"
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border dark:border-dark-border"
                aria-label="Close sidebar"
              >
                <X className="h-4 w-4" />
              </button>
              <SidebarContent role={activeRole} onClose={onClose} />
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
