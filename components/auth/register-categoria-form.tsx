"use client";

import * as z from "zod";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { CategoriaSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { registerCategoria } from "@/actions/categoria";
import { Spinner } from "@/components/ui/spinner";


export const RegisterCategoriaForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, setPending] = useState(false);

    const form = useForm<z.infer<typeof CategoriaSchema>>({
        resolver: zodResolver(CategoriaSchema),
        defaultValues: {
            nombre: "",
            descripcion: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof CategoriaSchema>) => {
        setError("");
        setSuccess("");
        setPending(true);

        try {
            const data = await registerCategoria(values);
            setPending(false);

            if (data?.error) {
                setError(data.error as string);
            }
            if (data?.success) {
                form.reset();
                setSuccess(data.success as string);
            }
        } catch (err) {
            setPending(false);
            setError("Algo salió mal.");
        }
    };

    return (
        <CardWrapper
            headerTitle={"Agregar Categoría"}
            headerLabel="Datos de la Categoría"
            width="w-screen min-h-screen max-h-screen sm:max-w-[600px] sm:min-h-[400px] sm:max-h-[600px] sm:overflow-hidden overflow-auto"
        >
            <div className="">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Primera columna */}
                        <div className="flex flex-col space-y-4">
                            <FormField
                                control={form.control}
                                name="nombre"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nombre</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Nombre de la categoría"
                                                type="text"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="descripcion"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Descripción</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Descripción de la categoría"
                                                type="text"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button
                            type="submit"
                            className="w-full mt-5"
                            size="lg"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Spinner color="white" ClassName="scale-[.30]" /> Guardando...
                                </>
                            ) : (
                                "Guardar Categoría"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </CardWrapper>
    );
};

export default RegisterCategoriaForm;
