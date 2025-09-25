"use client";

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
  FileSignature,
  CircleDollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  {
    href: "/dashboard",
    label: "Money Hub",
    icon: CircleDollarSign,
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
    href: "/reports",
    label: "Reports",
    icon: BarChart3,
  },
  {
    href: "/negotiate",
    label: "Negotiate Bill",
    icon: FileSignature,
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
            isActive={pathname === item.href}
            className={cn(
              "justify-start",
              pathname === item.href && "bg-primary/10 text-primary hover:bg-primary/20"
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
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
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
