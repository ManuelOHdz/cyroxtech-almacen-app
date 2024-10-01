"use client";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import UpdateArticuloForm from "./update-articulo-form";

interface UpdateUserButtonProps {
    children: React.ReactNode
    mode?: "modal" | "redirect",
    asChild?: boolean;
    articuloId: string;
};

export const UpdateArticuloButton = ({
    children,
    asChild,
    articuloId
}: UpdateUserButtonProps) => {
    const router = useRouter();

        return (
            <Dialog>
                <DialogTrigger asChild={asChild}>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0 w-auto bg-transparent border-none">
                    <UpdateArticuloForm articuloId={articuloId}/>
                </DialogContent>
            </Dialog>
        )

}