"use client";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/hooks/user-current-user";
import ArticulosDataTable from "@/components/auth/articulos-table";

const ArticulosPage = () => {
  const user = useCurrentUser();

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">Articulos</p>
        <div className="flex justify-center">
          <span className="text-center">Puedes agregar y actualizar articulos...</span>
        </div>
      </CardHeader>
      <CardContent className="w-full h-fit overflow-x-auto">
        {/* Aseguramos que el contenedor siempre sea desplazable horizontalmente */}
        <div className="min-w-full">
          <ArticulosDataTable />
        </div>
      </CardContent>
    </Card>
  );
};

export default ArticulosPage;
