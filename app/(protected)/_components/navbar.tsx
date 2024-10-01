"use client";

import Link from "next/link"
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button"
import { UserButton } from "@/components/auth/user-button";

export const Navbar = () => {
    const pathname = usePathname();

    return (
        <nav className="bg-white flex justify-between items-center 
        p-2 w-[100%] shadow shadow-neutral-600/30 relative">
            <div className="flex gap-x-2">
                
                {/*
                <Button 
                    asChild
                    variant={pathname === "/settings" ? "default" : "outline"}
                >
                    <Link href="/settings">
                        Settings
                    </Link>
                </Button>
                */}
            </div>
            <UserButton/>
        </nav>
    )
}

export default Navbar;