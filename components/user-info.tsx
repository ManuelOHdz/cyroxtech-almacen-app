import { ExtendUser } from "@/next-auth"
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserInfoProps {
    user?: ExtendUser;
    label: string;
};

export const UserInfo = ({
    user,
    label,
}: UserInfoProps) => {
    return (
        <Card className="w-[600px] shadow-md">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    {label}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between 
                rounded-lg border p-3 shadow-sm">
                    <p className="text-sm">
                        ID
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono 
                    p-1 bg-slate-100 rounded-md">
                        {user?.id}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between 
                rounded-lg border p-3 shadow-sm">
                    <p className="text-sm">
                        Nombre
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono 
                    p-1 bg-slate-100 rounded-md">
                        {user?.name}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between 
                rounded-lg border p-3 shadow-sm">
                    <p className="text-sm">
                        Correo
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono 
                    p-1 bg-slate-100 rounded-md">
                        {user?.email}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between 
                rounded-lg border p-3 shadow-sm">
                    <p className="text-sm">
                        Rol
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono 
                    p-1 bg-slate-100 rounded-md">
                        {user?.role}
                    </p>
                </div>
                <div className="flex flex-row items-center justify-between 
                rounded-lg border p-3 shadow-sm">
                    <p className="text-sm">
                        Autenticacion
                    </p>
                    <Badge 
                        variant={user?.isTwoFactorEnabled ? "success" : "destructive"}
                    >
                        {user?.isTwoFactorEnabled ? "ON" : "OFF"}
                    </Badge>
                </div>
            </CardContent>
        </Card>
    )
}