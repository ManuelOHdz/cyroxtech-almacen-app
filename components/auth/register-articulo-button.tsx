"use client";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog"
import UserForm from "./register-user-form";
import RegisterArticuloForm from "./register-articulo-form";

interface RegisterButtonProps {
    children: React.ReactNode
    mode?: "modal" | "redirect",
    asChild?: boolean;
};

export const RegisterArticuloButton = ({
    children,
    asChild
}: RegisterButtonProps) => {


        return (
            <Dialog>
                <DialogTrigger asChild={asChild}>
                    {children}
                </DialogTrigger>
                <DialogContent className="p-0 w-auto bg-transparent border-none">
                    <RegisterArticuloForm />
                </DialogContent>
            </Dialog>
        )
}