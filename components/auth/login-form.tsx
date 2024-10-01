"use client";

import * as z from "zod"

import { CircleLoader, ClipLoader } from "react-spinners"
import { Spinner } from "@/components/ui/spinner"
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { LoginSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { login } from "@/actions/login";
import { useSearchParams } from "next/navigation";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");
    const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email ya existe, usa diferente proveedor":"";

    const [showTwoFactor, setShowTwoFactor] = useState(false);
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, starTransition] = useTransition();
    const [showPassword, setShowPassword] = useState(false);

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError("");
        setSuccess("");

        starTransition(() => {
            login(values, callbackUrl)
                .then((data) => {
                    if(data?.error){
                        
                        setError(data.error);
                    }  
                    if(data?.success){
                        form.reset();
                        setSuccess(data.success);
                    }     
                    if (data?.twoFactor) {
                        setShowTwoFactor(true)
                    } 
                }).catch(() => setError("Algo salio mal"));
        });
    };

    return ( 
        <CardWrapper
            headerTitle=""
            headerLabel="Bienvenido de nuevo"
            showSocial
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
                        {showTwoFactor && (
                            <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Codigo</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="123456"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> 
                        )}
                        {!showTwoFactor && (
                        <>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="cyroxtech@cyroxtech.com"
                                                type="email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="********"
                                                    type={showPassword ? "text" : "password"}
                                                />
                                                <FontAwesomeIcon
                                                    icon={showPassword ? faEyeSlash : faEye}
                                                    className="absolute w-4 right-2 top-[0.6rem] cursor-pointer text-black/60"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                />
                                            </div>
                                        </FormControl>
                                        
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </>
                        )}
                    </div>
                    <FormError message={error || urlError}/>
                    <FormSuccess message={success} />
                    <Button 
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isPending}
                    >
                            {isPending ? <Spinner color="white" ClassName="scale-[.30]"/> : (showTwoFactor ? "Confirmar" :  "Iniciar Sesion")}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}

export default LoginForm;
