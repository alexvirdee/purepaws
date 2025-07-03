'use client';

import { PawPrint, UserIcon, EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

const Menu = () => {
    const { data: session } = useSession();

    const handleSignOut = async () => {
        localStorage.setItem('signout-success', "true");
        await signOut({ callbackUrl: '/' })
    };

    return (
        <div className="flex justify-end gap-3 pr-4">
            <nav className="hidden md:flex w-full gap-2 items-center">
                {session?.user?.role !== 'breeder' && (
                    <Button asChild variant="ghost">
                        <Link href="/list-your-kennel">
                            <PawPrint /> List your kennel
                        </Link>
                    </Button>
                )}
                {/* Session check */}
                {session?.user ? (
                    <div className="flex items-center gap-2">
                        <Link href="/profile" className="text-sm text-gray-700 truncate hover:text-blue-600">
                            {session.user.email || session.user.name}
                        </Link>
                        <Button onClick={handleSignOut} variant={"outline"} className="text-blue-500">
                            <LogOut /> Sign Out
                        </Button>
                    </div>
                ) : (
                    <Button asChild>
                        <Link href="/auth/signin">
                            <UserIcon /> Sign In
                        </Link>
                    </Button>
                )
                }
            </nav>
            {/* Mobile Menu */}
            <nav className="md:hidden">
                <Sheet>
                    <SheetTrigger className="align-middle">
                        <EllipsisVertical />
                    </SheetTrigger>
                    <SheetContent className="flex flex-col items-start">
                        <SheetTitle>Menu</SheetTitle>
                        {session?.user?.role !== 'breeder' && (
                            <Button asChild variant="ghost">
                                <Link href="/list-your-kennel">
                                    <PawPrint /> List your kennel
                                </Link>
                            </Button>
                        )}
                        {/* Session check */}
                        {session?.user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/profile" className="text-sm text-gray-700">
                                    {session.user.email || session.user.name}
                                </Link>
                                <Button onClick={handleSignOut} variant={"outline"} className="text-blue-500">
                                    <LogOut /> Sign Out
                                </Button>
                            </div>
                        ) : (
                            <Button asChild>
                                <Link href="/auth/signin">
                                    <UserIcon /> Sign In
                                </Link>
                            </Button>
                        )
                        }
                        <SheetDescription></SheetDescription>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    )
}

export default Menu;