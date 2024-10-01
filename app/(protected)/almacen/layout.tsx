import { RoleGate } from "@/components/auth/role.gat";
import { UserRole } from "@prisma/client";
import SidebarAlmacen from "../_components/sidebar-almacen";

interface ProtectedLayoutProps {
    children: React.ReactNode;
};

const ProtectedLayout = ({children}: ProtectedLayoutProps) => {
    return (
        <div className="h-[94vh] w-full flex flex-row">
            <SidebarAlmacen />
            <div className="flex-1 flex justify-center shadow shadow-neutral-600/30 overflow-auto">
                <div className="h-full w-full flex justify-center">
                    {children}
                </div>
            </div>
        </div>

    );
}

export default ProtectedLayout;