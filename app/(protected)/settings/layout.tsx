import { RoleGate } from "@/components/auth/role.gat";
import SidebarSettings from "../_components/sidebar-settings";
import { UserRole } from "@prisma/client";

interface ProtectedLayoutProps {
    children: React.ReactNode;
};

const ProtectedLayout = ({children}: ProtectedLayoutProps) => {
    return (
        <RoleGate allowedRole={UserRole.ADMIN} message>
        <div className="h-[94vh] w-full flex flex-row overflow-auto">
            <SidebarSettings />
            <div className="flex-1 flex justify-center shadow shadow-neutral-600/30">
                <div className="h-full w-full flex justify-center">
                    {children}
                </div>
            </div>
        </div>
        </RoleGate>
    );
}

export default ProtectedLayout;