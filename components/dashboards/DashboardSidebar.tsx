'use client';

import { useState } from "react";
import { SidebarLink } from "./SidebarLink";
import { ChevronLeft, ChevronRight } from "lucide-react";

type SidebarLinkProps = {
  href: string;
  text: string;
};

interface DashboardSidebarProps {
  links: SidebarLinkProps[];
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
        {links.map((link) => (
          <SidebarLink key={link.href} href={link.href} text={collapsed ? "" : link.text} />
        ))}
      </nav>
    </div>
  );
}
