"use client";

import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card"

import { useCurrentUser } from "@/hooks/user-current-user";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role.gat";
import UsersDataTable from "@/components/auth/users-table";

const UsersPage = () => {
    const user = useCurrentUser();

    return (
        <RoleGate allowedRole={UserRole.ADMIN} message>
        <Card className="h-full w-full">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Administrar usuarios
                </p>
                <div className="flex justify-center">
                    <span>Puedes agregar usuarios y asignar permisos... </span>    
                </div>            
            </CardHeader>
            <CardContent className="w-full h-fit overflow-x-auto">
                <div className="min-w-full">
                    <UsersDataTable/>  
                </div>
            </CardContent>
        </Card>
        </RoleGate>
    );
}

export default UsersPage;