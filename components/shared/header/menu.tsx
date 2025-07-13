'use client';

import { useState } from "react";
import { PawPrint, UserIcon, EllipsisVertical, Dog, FlaskConicalIcon, MapIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useSession, signOut } from "next-auth/react";
import { BellIcon, LogOut } from "lucide-react";
import SignInRequiredDialog from "@/components/dialogs/SignInRequiredDialog";

interface MenuProps {
    puppyApplication: any;
    notificationCount: number;
}

interface SessionUser {
    email?: string;
    name?: string;
    role?: string;
}

interface SessionData {
    user?: SessionUser;
}

const Menu: React.FC<MenuProps> = ({ notificationCount, puppyApplication }) => {
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const { data: session } = useSession();

    const handleSignOut = async (): Promise<void> => {
        localStorage.setItem('signout-success', "true");
        await signOut({ callbackUrl: '/' })
    };

    const handlePuppyApplicationClick = (e: { preventDefault: () => void; }): void => {
        if (!session) {
            e.preventDefault();

            setShowDialog(true);
            return
        }
    }

    return (
        <>
            <div className="flex justify-end gap-3 pr-4">
                <nav className="hidden md:flex w-full gap-2 items-center">
                    {/* Public breed matcher feature */}
                    <Button asChild variant="ghost">
                        <Link href="/breed-selector">
                            <FlaskConicalIcon className="text-gray-500" />
                            Breed Selector Tool
                        </Link>
                    </Button>
                    {/* Map view - TODO: Remove */}
                    <Button asChild variant="ghost">
                        <Link href="/map-view">
                            <MapIcon className="text-gray-500" />
                             Map
                        </Link>
                    </Button>
                    {/* Note - admin role can see all navbar links */}
                    {!puppyApplication && (
                        <Button onClick={handlePuppyApplicationClick} asChild variant="ghost">
                            <Link href="/puppy-application">
                                <Dog /> Puppy Application
                            </Link>
                        </Button>
                    )}
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
                            {/* TODO: Notifications feature */}
                            <Button asChild variant="ghost" className="relative">
                                <Link href="/profile/notifications">
                                    <BellIcon className="text-gray-500 hover:text-blue-600" />
                                    {notificationCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                            {notificationCount}
                                        </span>
                                    )}
                                </Link>
                            </Button>
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
                            <SheetTitle className="p-4">Menu</SheetTitle>
                            {/* Public breed matcher feature */}
                            <Button asChild variant="ghost">
                                <Link href="/breed-selector">
                                    <FlaskConicalIcon className="text-gray-500" />
                                    Breed Selector Tool
                                </Link>
                            </Button>
                            {/* Map view - TODO: Remove */}
                            <Button asChild variant="ghost">
                                <Link href="/map-view">
                                    <MapIcon className="text-gray-500" />
                                    Map
                                </Link>
                            </Button>
                            {!puppyApplication && (
                                <Button onClick={handlePuppyApplicationClick} asChild variant="ghost">
                                    <Link href="/puppy-application">
                                        <Dog /> Puppy Application
                                    </Link>
                                </Button>
                            )}
                            {session?.user?.role !== 'breeder' && (
                                <Button asChild variant="ghost">
                                    <Link href="/list-your-kennel">
                                        <PawPrint /> List your kennel
                                    </Link>
                                </Button>

                            )}
                            {/* Session check */}
                            {session?.user ? (
                                <div className="flex flex-col gap-4 pl-4">
                                    <Link href="/profile" className="text-sm text-gray-700">
                                        {session.user.email || session.user.name}
                                    </Link>
                                    {/* TODO: Notifications feature */}
                                    <Button asChild variant="ghost" className="relative">
                                        <Link href="/profile/notifications">
                                            <BellIcon className="text-gray-500 hover:text-blue-600" />
                                            {/* Hypothetical unread count */}
                                            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                                1
                                            </span>
                                        </Link>
                                    </Button>
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
            <SignInRequiredDialog open={showDialog} onOpenChange={setShowDialog} description="Create your puppy adoption application once and share it with reputable breeders instantly. Sign in to get started!" />
        </>

    )
}

export default Menu;