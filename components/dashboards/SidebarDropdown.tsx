'use client';

import { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarLink } from "./SidebarLink";
import { ChevronRight } from "lucide-react";

type sidebarDropdownProps = {
    triggerName: string;
    label: string;
    items: { href: string; text: string }[];
    collapsed?: boolean;
}

export function SidebarDropdown({ triggerName, label, items, collapsed = false }: sidebarDropdownProps) {
    const [open, setOpen] = useState(false);

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className={`w-full flex items-center px-3 py-2 rounded-md text-sm font-medium cursor-pointer transition ${collapsed
                        ? "justify-center text-gray-600"
                        : "justify-between text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                        }`}
                >
                    {collapsed ? null : triggerName}
                    {!collapsed && (
                        <ChevronRight
                            className={`h-4 w-4 transform origin-center transition-transform duration-200 ${open ? "rotate-90" : ""
                                }`}
                        />
                    )}
                </button>
            </DropdownMenuTrigger>

            {!collapsed && (
                <DropdownMenuContent className="w-56 ml-2 flex flex-col gap-1">
                    <DropdownMenuLabel className="px-3 py-1 text-xs text-gray-500">{label}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {items.map(({ href, text }) => (
                        <DropdownMenuItem key={href} asChild>
                            <SidebarLink href={href} text={text} />
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            )}
        </DropdownMenu>
    );
}
