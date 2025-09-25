'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Wallet,
  CreditCard,
  BarChart3,
  BookOpen,
  Receipt,
  User,
  TrendingUp,
  FileSignature,
  ScanLine,
  Scale,
  Banknote,
  Bell,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/transactions",
    label: "Transactions",
    icon: Receipt,
  },
  {
    href: "/scan",
    label: "Scan Receipt",
    icon: ScanLine,
  },
  {
    href: "/budget",
    label: "Budget",
    icon: Wallet,
  },
  {
    href: "/debts",
    label: "Debts",
    icon: CreditCard,
  },
  {
    href: "/investments",
    label: "Investments",
    icon: TrendingUp,
  },
  {
    href: "/net-worth",
    label: "Net Worth",
    icon: Scale,
  },
  {
    href: "/reports",
    label: "Reports",
    icon: BarChart3,
  },
  {
    href: "/negotiate",
    label: "Negotiate Bill",
    icon: FileSignature,
  },
   {
    href: "/alerts",
    label: "Alerts",
    icon: Bell,
  },
  {
    href: "/link",
    label: "Link Bank Account",
    icon: Link2,
  },
  {
    href: "/education",
    label: "Education",
    icon: BookOpen,
  },
   {
    href: "/viability",
    label: "Income Viability",
    icon: Banknote,
  },
   {
    href: "/profile",
    label: "Profile",
    icon: User,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {menuItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname.startsWith(item.href)}
            className={cn(
              "justify-start",
              pathname.startsWith(item.href) && "bg-primary/10 text-primary hover:bg-primary/20"
            )}
            tooltip={{
              children: item.label,
              className: "bg-primary text-primary-foreground",
            }}
          >
            <Link href={item.href}>
              <item.icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  pathname.startsWith(item.href) ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
