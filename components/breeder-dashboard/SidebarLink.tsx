"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarLink({ href, text }: { href: string; text: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
        isActive
          ? "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
          : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
      }`}
    >
      {text}
    </Link>
  );
}
