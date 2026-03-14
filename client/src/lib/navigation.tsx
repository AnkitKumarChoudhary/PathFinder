import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  BookOpen,
  Bookmark,
  Briefcase,
  Calendar,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Compass,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Route,
  Settings,
  TrendingUp,
  User,
  UserCircle,
  Users,
} from "lucide-react";

export type DashboardRole = "student" | "counsellor" | "admin";

export interface MarketingNavItem {
  label: string;
  href: string;
}

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface DashboardNavSection {
  label: string;
  items: DashboardNavItem[];
}

export const marketingNavItems: MarketingNavItem[] = [
  { label: "Home", href: "/" },
  { label: "Careers", href: "/student/careers" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const dashboardNavigation: Record<DashboardRole, DashboardNavSection[]> = {
  student: [
    {
      label: "Main",
      items: [
        { label: "Dashboard", href: "/student", icon: LayoutDashboard },
        { label: "Assessments", href: "/student/assessment", icon: ClipboardCheck },
        { label: "My Results", href: "/student", icon: BarChart3 },
        { label: "Career Roadmap", href: "/student/roadmap", icon: Route },
      ],
    },
    {
      label: "Discover",
      items: [
        { label: "Explore Careers", href: "/student/careers", icon: Compass },
        { label: "Find Mentors", href: "/student/mentorship", icon: Users },
        { label: "Resources", href: "/student/resources", icon: BookOpen },
      ],
    },
    {
      label: "Tools",
      items: [
        { label: "Resume Builder", href: "/student/resume", icon: FileText },
        { label: "Saved Careers", href: "/student/careers/saved", icon: Bookmark },
        { label: "My Appointments", href: "/student/appointments", icon: Calendar },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Profile", href: "/student/profile", icon: User },
        { label: "Settings", href: "/student/profile", icon: Settings },
      ],
    },
  ],
  counsellor: [
    {
      label: "Main",
      items: [
        { label: "Dashboard", href: "/counsellor", icon: LayoutDashboard },
        { label: "Appointments", href: "/counsellor/appointments", icon: Calendar },
        { label: "My Students", href: "/counsellor/students", icon: Users },
      ],
    },
    {
      label: "Manage",
      items: [
        { label: "Availability", href: "/counsellor/availability", icon: Clock },
        { label: "Profile", href: "/counsellor/profile", icon: UserCircle },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Settings", href: "/counsellor/settings", icon: Settings },
        { label: "Logout", href: "/counsellor", icon: LogOut },
      ],
    },
  ],
  admin: [
    {
      label: "Overview",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
      ],
    },
    {
      label: "Manage",
      items: [
        { label: "Users", href: "/admin/users", icon: Users },
        { label: "Careers", href: "/admin/careers", icon: Briefcase },
        { label: "Assessments", href: "/admin/assessments", icon: ClipboardList },
        { label: "Inquiries", href: "/admin/inquiries", icon: MessageSquare },
      ],
    },
    {
      label: "Account",
      items: [
        { label: "Settings", href: "/admin/settings", icon: Settings },
        { label: "Logout", href: "/admin", icon: LogOut },
      ],
    },
  ],
};

export const mobileNavigation: Record<DashboardRole, DashboardNavItem[]> = {
  student: [
    { label: "Home", href: "/student", icon: LayoutDashboard },
    { label: "Assess", href: "/student/assessment", icon: ClipboardCheck },
    { label: "Careers", href: "/student/careers", icon: Compass },
    { label: "Mentors", href: "/student/mentorship", icon: Users },
    { label: "Profile", href: "/student/profile", icon: User },
  ],
  counsellor: [
    { label: "Home", href: "/counsellor", icon: LayoutDashboard },
    { label: "Appointments", href: "/counsellor/appointments", icon: Calendar },
    { label: "Students", href: "/counsellor/students", icon: Users },
    { label: "Profile", href: "/counsellor/profile", icon: UserCircle },
    { label: "Settings", href: "/counsellor/settings", icon: Settings },
  ],
  admin: [
    { label: "Home", href: "/admin", icon: LayoutDashboard },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Careers", href: "/admin/careers", icon: Briefcase },
    { label: "Assessments", href: "/admin/assessments", icon: ClipboardList },
  ],
};

export function getRoleFromPathname(pathname: string): DashboardRole {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/counsellor")) return "counsellor";
  return "student";
}

export function getRoleMeta(role: DashboardRole) {
  return {
    student: {
      name: "Aarav Sharma",
      email: "aarav.sharma@pathfinder.in",
      roleLabel: "Student",
    },
    counsellor: {
      name: "Dr. Meera Iyer",
      email: "meera.iyer@pathfinder.in",
      roleLabel: "Counsellor",
    },
    admin: {
      name: "Karan Malhotra",
      email: "karan.malhotra@pathfinder.in",
      roleLabel: "Admin",
    },
  }[role];
}

export function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = [{ label: "Dashboard", href: segments[0] ? `/${segments[0]}` : "/student" }];

  segments.slice(1).forEach((segment, index) => {
    const isIdLike = /^[a-z0-9]{20,}$/i.test(segment) || segment.startsWith("cm") || segment.startsWith("cl");
    if (isIdLike) {
      return;
    }

    const href = `/${segments.slice(0, index + 2).join("/")}`;
    breadcrumbs.push({
      label: segment
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
      href,
    });
  });

  return breadcrumbs;
}