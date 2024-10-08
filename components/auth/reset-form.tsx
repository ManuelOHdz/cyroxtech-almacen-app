"use client";

import * as z from "zod"

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetSchema } from "@/schemas";
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
import { reset } from "@/actions/reset";



export const ResetForm = () => {

    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, starTransition] = useTransition();

    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        }
    })
    const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setError("");
        setSuccess("");


        starTransition(() => {
            reset(values)
                .then((data) => {
                    setError(data?.error);            
                    setSuccess(data?.success);
                });
        });
    }

    return ( 
        <CardWrapper
            headerLabel="¿Olvidaste tu contraseña?"
            backButtonLabel="Regresar a Iniciar Sesion"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="space-y-4">
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
                                            placeholder="manuel.hdz@example.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success} />
                    <Button 
                        type="submit"
                        className="w-full"
                        size="lg"
                        disabled={isPending}
                    >
                            Recuperar
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    );
}

export default ResetForm;