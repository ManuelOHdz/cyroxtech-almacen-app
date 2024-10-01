import { CardWrapper } from "@/components/auth/card-wrapper";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";

export const ErrorCard = () => {
    return (
        <CardWrapper
            headerLabel="Ups! Algo salio mal!"
            backButtonHref="/auth/login"
            backButtonLabel="Regresar a Iniciar Sesion"
        >
            <div className="w-full flex justify-center items-center">
                <ExclamationTriangleIcon className="text-destructive"/>
            </div>

        </CardWrapper>
    )
}