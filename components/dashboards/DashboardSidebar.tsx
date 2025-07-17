'use client';

import { useState } from "react";
import { SidebarLink } from "./SidebarLink";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SidebarDropdown } from "./SidebarDropdown";

type SidebarLinkItem = {
  type: "link";
  href: string;
  text: string;
};

type SidebarDropdownItem = {
  type: "dropdown";
  triggerName: string;
  label: string;
  items: { href: string; text: string }[];
};

type SidebarItem = SidebarLinkItem | SidebarDropdownItem;

interface DashboardSidebarProps {
  links: SidebarItem[];
}

export default function DashboardSidebar({ links }: DashboardSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`transition-all duration-200 bg-white border-r h-screen ${collapsed ? "w-12" : "w-64"}`}>
      <div className="flex items-center justify-between p-4">
        {!collapsed && (
          <img
            src="/images/purepaws-logo-transparent.png"
            alt="PurePaws"
            width={100}
            className="transition-opacity duration-200"
          />
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto cursor-pointer">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="mt-6 flex flex-col gap-4 px-4">
        {links.map((item) => {
          if (item.type === "link") {
            return (
              <SidebarLink
                key={item.href}
                href={item.href}
                text={collapsed ? "" : item.text}
              />
            );
          }

          if (item.type === "dropdown") {
            return (
              <SidebarDropdown
                key={item.triggerName}
                triggerName={item.triggerName}
                label={item.label}
                items={item.items}
                collapsed={collapsed}
              />
            );
          }

          return null;
        })}
      </nav>
    </div>
  );
}
