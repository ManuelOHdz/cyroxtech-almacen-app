"use client";

import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card"

import { useCurrentUser } from "@/hooks/user-current-user";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/components/auth/role.gat";
import MarcasDataTable from "@/components/auth/marcas-table";

const UsersPage = () => {
    const user = useCurrentUser();

    return (
        <Card className="h-full w-full">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Marcas</p>
        <div className="flex justify-center">
          <span className="text-center">Puedes agregar y actualizar marcas...</span>
        </div>
      </CardHeader>
      <CardContent className="w-full min-h-full overflow-x-auto">
        {/* Aseguramos que el contenedor siempre sea desplazable horizontalmente */}
        <div className="min-w-full">
          <MarcasDataTable />
        </div>
      </CardContent>
    </Card>
    );
}

export default UsersPage;