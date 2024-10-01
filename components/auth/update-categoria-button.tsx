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
    categoriaId: string;
};

export const UpdateCategoriaButton = ({
    children,
    asChild,
    categoriaId
}: UpdateUserButtonProps) => {
    const router = useRouter();

        return (
            <Dialog>
                <DialogTrigger asChild={asChild}>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0 w-auto bg-transparent border-none">
                    <UpdateUserForm userId={categoriaId}/>
                </DialogContent>
            </Dialog>
        )

}