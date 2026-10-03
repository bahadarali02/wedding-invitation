"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarDays,
  MessageSquareHeart,
  Settings,
  Heart,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Guests",
    href: "/admin/guests",
    icon: Users,
  },
  {
    name: "Events",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    name: "RSVP",
    href: "/admin/rsvp",
    icon: MessageSquareHeart,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/5 bg-[#171713] lg:block">
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 px-7 py-7">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#d4b673]/40 bg-[#d4b673]/10">
              <Heart
                size={18}
                className="text-[#d4b673]"
                strokeWidth={1.7}
              />
            </div>

            <div>
              <p className="font-serif text-lg text-white">
                Wedding Suite
              </p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                Administration
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-7">
          {navigation.map((item) => {
            const active =
              pathname === item.href ||
              pathname.startsWith(`${item.href}/`);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition ${
                  active
                    ? "bg-[#d4b673]/12 text-[#e3c985]"
                    : "text-stone-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} strokeWidth={1.8} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 px-6 py-6">
          <p className="text-xs leading-5 text-stone-600">
            Premium Wedding Invitation
            <br />
            Management System
          </p>
        </div>
      </div>
    </aside>
  );
}