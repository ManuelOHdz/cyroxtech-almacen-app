"use-client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Header } from "@/components/auth/header";
import { Social } from "@/components/auth/social";
import { BackButton } from "@/components/auth/back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    headerTitle: string;
    headerLabel: string;
    backButtonLabel?: string;
    backButtonHref?: string;
    showSocial?: boolean;
    width?: string;
};

export const CardWrapper = ({
    children,
    headerTitle,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial,
    width = "w-[400px]",
}: CardWrapperProps) => {
    return(
        <Card className={`${width} border-[1px] border-black/40 shadow-md rounded-lg bg-white`}>
            <CardHeader>
                <Header title={headerTitle} label={headerLabel}/>
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}   
            <CardFooter>
                {backButtonLabel &&  (
                <BackButton 
                    href={backButtonHref || ""}
                    label={backButtonLabel}
                />)}   
            </CardFooter>   
        </Card>
    )
}

