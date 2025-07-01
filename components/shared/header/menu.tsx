import { PawPrint, UserIcon, EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const Menu = () => {
    return (
        <div className="flex justify-end gap-3 pr-4">
            <nav className="hidden md:flex w-full max-w-xs gap-2">
                <Button asChild variant="ghost">
                    <Link href="/list-your-kennel">
                        <PawPrint /> List your kennel
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/sign-in">
                        <UserIcon /> Sign In
                    </Link>
                </Button>
            </nav>
            <nav className="md:hidden">
                <Sheet>
                    <SheetTrigger className="align-middle">
                        <EllipsisVertical />
                    </SheetTrigger>
                    <SheetContent className="flex flex-col items-start">
                        <SheetTitle>Menu</SheetTitle>
                        <Button asChild variant='ghost'>
                            <Link href='/list-your-kennel'>
                                <PawPrint /> List your kennel
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link href="/sign-in">
                                <UserIcon /> Sign In
                            </Link>
                        </Button>
                        <SheetDescription></SheetDescription>
                    </SheetContent>
                </Sheet>
            </nav>
        </div>
    )
}

export default Menu;