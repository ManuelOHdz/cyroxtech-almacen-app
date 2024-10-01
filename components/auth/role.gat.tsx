"use client";

import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { FormError } from "@/components/auth/form-error";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole: UserRole;
    message?: boolean;
};

export const RoleGate = ({
    children,
    allowedRole,
    message,
}: RoleGateProps) => {
    const role = useCurrentRole();

    if(role !== allowedRole && message) {
        return (
            <FormError message="No tienes permiso de ver este contenido" />           
        )
    }

    if(role !== allowedRole) {
        return (
            <></>         
        )
    }

    return (
        <>
            {children}
        </>
    );
};