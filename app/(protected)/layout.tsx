"use client";

import Navbar from "./_components/navbar";
import Sidebar from "./_components/sidebar";
import { logout } from "@/actions/logout";
import io from "socket.io-client";
import { useEffect, useMemo } from "react";
import { useCurrentUser } from "@/hooks/user-current-user";
import { getSocket } from "@/lib/socket";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  // Inicializar la conexión a Socket.io
  const socket = getSocket();
  const user = useCurrentUser();

  useEffect(() => {
    // Escuchar el evento "force logout" emitido por el servidor
    socket.on("force logout", (id) => {
      if(user?.id === id){
        logout(); // Cerrar la sesión
      }
      
    });

    // Limpiar el evento cuando el componente se desmonta
    return () => {
      socket.off("force logout");
    };
  }, [socket]);

  return (
    <div className="h-screen w-full flex flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
