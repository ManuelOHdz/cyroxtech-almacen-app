"use client"

import { BeatLoader } from "react-spinners"
import { useSearchParams } from "next/navigation"
import { useEffect, useCallback, useState } from "react";

import { newVerification } from "@/actions/new-verification";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";

const NewVerificatonForm = () => {
    const [ error, setError ] = useState<string | undefined>();
    const [ success, setSuccess ] = useState<string | undefined>();

    const searchParams = useSearchParams();

    const token = searchParams.get("token");

    
    const onSubmit = useCallback(() => {
        if ( success || error) return;
        if (!token) {
            setError("Token no encontrado!");
            return;
        }
        newVerification(token).then((data) => {
            setSuccess(data.success);
            setError(data.error);
        }).catch(() => {
            setError("Algo salio mal!")
        })
    }, [token, success, error]);
    
    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <CardWrapper
            headerLabel="Confirm your verification"
            backButtonHref="/auth/login"
            backButtonLabel="Regresar a iniciar sesion"
        >
            <div className="flex items-center w-full justify-center">
                {!success && !error && (
                    <BeatLoader />
                )}
                <FormSuccess message={success} />
                {!success && (
                <FormError message={error} />
                )}
                
            </div>
        </CardWrapper>
    );
}

export default NewVerificatonForm;