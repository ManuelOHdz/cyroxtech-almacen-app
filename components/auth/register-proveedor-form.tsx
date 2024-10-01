"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ProveedorSchema } from "@/schemas";
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
import { registerProveedor } from "@/actions/proveedor";
import { Spinner } from "@/components/ui/spinner";


export const RegisterProveedorForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, setPending] = useState(false);

    const form = useForm<z.infer<typeof ProveedorSchema>>({
        resolver: zodResolver(ProveedorSchema),
        defaultValues: {
            nombre: "",
            segmento: "",
            ubicacion: "",
            contacto: "",
            puesto: "",
            correo: "",
            telefono: "",
            ext: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof ProveedorSchema>) => {
        setError("");
        setSuccess("");
        setPending(true);

        try {
            const data = await registerProveedor(values);
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
            headerTitle={"Agregar Proveedor"}
            headerLabel="Datos del Proveedor"
            width="w-screen min-h-screen max-h-screen sm:max-w-[600px] sm:min-h-[400px] sm:max-h-[600px] sm:overflow-hidden overflow-auto"
        >
            <div className="">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Dividimos los campos en dos columnas */}
                        <div className="flex flex-wrap -mx-2">
                            {/* Primera columna */}
                            <div className="w-full sm:w-1/2 px-2 mb-4">
                                <FormField
                                    control={form.control}
                                    name="nombre"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nombre del Proveedor</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Nombre del proveedor"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="segmento"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Segmento</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Segmento del proveedor"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ubicacion"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ubicación</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Ubicación del proveedor"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="correo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Correo Electrónico</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Correo electrónico"
                                                    type="email"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Segunda columna */}
                            <div className="w-full sm:w-1/2 px-2 mb-4">
                                <FormField
                                    control={form.control}
                                    name="contacto"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Contacto</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Persona de contacto"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="puesto"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Puesto</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Puesto del contacto"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                
                                <FormField
                                    control={form.control}
                                    name="telefono"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Teléfono</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Teléfono de contacto"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="ext"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Extensión</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Extensión telefónica"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Botón de submit y mensajes de error/éxito */}
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
                                "Guardar Proveedor"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </CardWrapper>
    );
};

export default RegisterProveedorForm;
