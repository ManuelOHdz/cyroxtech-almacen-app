import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"],
});

interface HeaderProps {
    title?: string;
    label: string;
};

export const Header = ({
    title,
    label,
}: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <h1 className={cn(
                "text-3xl font-semibold",
                font.className,
            )}>
            <div className="flex justify-center">
                {title ? (<span>{title}</span>) : <img src="/cyroxtech-logo.png" className="h-14 w-auto"/>}
            </div>
            </h1>
            <p className="text-muted-foreground text-sm">
                {label}
            </p>
        </div>
    );
};