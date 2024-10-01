"use client"

import { admin } from "@/actions/admin";
import { FormSuccess } from "@/components/auth/form-success";
import { RoleGate } from "@/components/auth/role.gat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
    const onServerActionClick = () => {
        admin()
            .then((data) => {
                if (data.error) {
                    toast.error(data.error);
                }

                if (data.success) {
                    toast.success(data.success);
                }
            });
    }

    const onApiRouteClick = () => {
        fetch("/api/admin")
            .then((response) => {
                if(response.ok) {
                    toast.success("RUTA API Permitido!");
                } else {
                    toast.error("RUTA API Denegado")
                }
            })
    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    🔑 Admin
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess message="Tienes permiso de ver este contenido"/>
                </RoleGate>
                <div className="flex flex-row items-center justify-between rounded-lg 
                border p-3 shadow-md">
                    <p>
                        Ruta API para solo admin
                    </p>
                    <Button onClick={onApiRouteClick}>
                        Click to test
                    </Button>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg 
                border p-3 shadow-md">
                    <p>
                        Server Action para solo admin
                    </p>
                    <Button onClick={onServerActionClick}>
                        Click to test
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
export default AdminPage;