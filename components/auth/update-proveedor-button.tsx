"use client";
import { useRouter } from "next/navigation";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"

import UpdateProveedorForm from "./update-proveedor-form";

interface UpdateUserButtonProps {
    children: React.ReactNode
    mode?: "modal" | "redirect",
    asChild?: boolean;
    proveedorId: string;
};

export const UpdateProveedorButton = ({
    children,
    asChild,
    proveedorId
}: UpdateUserButtonProps) => {
    const router = useRouter();

        return (
            <Dialog>
                <DialogTrigger asChild={asChild}>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0 w-auto bg-transparent border-none">
                    <UpdateProveedorForm proveedorId={proveedorId}/>
                </DialogContent>
            </Dialog>
        )

}