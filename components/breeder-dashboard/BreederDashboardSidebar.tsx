'use client';

import { useState, useRef } from "react";
import { SidebarLink } from "./SidebarLink";

export default function BreederDashboardSidebar() {
  const [width, setWidth] = useState(250); // default width in px
  const [isResizing, setIsResizing] = useState(false);

   const sidebarRef = useRef<HTMLDivElement>(null);

   const handleMouseDown = () => {
    setIsResizing(true);
  };

   const handleMouseMove = (e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = e.clientX; // distance from left of viewport
    if (newWidth >= 150 && newWidth <= 400) {
      setWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

    // Attach global listeners when resizing
  if (typeof window !== "undefined") {
    window.onmousemove = handleMouseMove;
    window.onmouseup = handleMouseUp;
  }

  return (
    <main className="flex min-h-screen">
      <div
      ref={sidebarRef}
      className="relative bg-white border-r h-full transition-all duration-200"
      style={{ width: `${width}px` }}
    >
      <div className="p-4">
        <img src="/images/purepaws-logo-transparent.png" alt="PurePaws" width={120} />
        <nav className="mt-6 flex flex-col gap-4">
          <SidebarLink href="/dashboard" text="Dashboard" />
          <SidebarLink href="/dashboard/dogs" text="Dogs" />
          <SidebarLink href="/dashboard/litters" text="Litters" />
          <SidebarLink href="/dashboard/requests" text="Adoption Requests" />
        </nav>
      </div>

      {/* Resize handle */}
      <div
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-300 hover:bg-gray-400"
      ></div>
    </div>
    </main>
  );
}