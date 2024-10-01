"use client";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import UpdateUserForm from "./update-user-form";

interface UpdateUserButtonProps {
    children: React.ReactNode
    mode?: "modal" | "redirect",
    asChild?: boolean;
    userId: string;
};

export const UpdateUserButton = ({
    children,
    asChild,
    userId
}: UpdateUserButtonProps) => {
    const router = useRouter();

        return (
            <Dialog>
                <DialogTrigger asChild={asChild}>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0 w-auto bg-transparent border-none">
                    <UpdateUserForm userId={userId}/>
                </DialogContent>
            </Dialog>
        )

}