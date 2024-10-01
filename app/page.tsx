import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"]
})

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center 
    bg-white">
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <img src="/cyroxtech-logo.png" alt="Logo" className="h-12 w-auto" />
        </div>
        {/*<h1 className={cn(
          "text-6xl font-semibold text-black drop-shadow-md",
          font.className,
          )}>  
        </h1>
        */}
        <p className="text-white text-lg">
          Simple servicio de autenticacion 
        </p>
        <div>
          <LoginButton mode="redirect" asChild>
            <Button size="lg" variant="secondary">Iniciar Sesion</Button>
          </LoginButton>

        </div>
      </div>  
    </main>
    
  );
}
