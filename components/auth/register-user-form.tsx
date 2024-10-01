"use client";

import * as z from "zod";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterSchema } from "@/schemas";
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
import { register } from "@/actions/user";

import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export const RegisterUserForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, setPending] = useState(false);
    const [selected, setSelected] = useState<string>("datos");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: "",
            password: "",
            name: "",
            departament: "",
            cargo: "",
        }
    });

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError("");
        setSuccess("");

        setPending(true);
            register(values)
                .then((data) => {
                    setError(data.error);
                    setSuccess(data.success);
                }).catch(() => {
                    setPending(false);
                    setError("Algo salio mal")
                });
    };

    const cargoOptions: Record<string, string[]> = {
        Finanzas: ["Contador", "Analista Financiero"],
        Almacen: ["Supervisor de Almacén", "Operador de Logística"],
        Ventas: ["Vendedor", "Ejecutivo de Ventas"],
        Gerencia: ["Gerente", "Subgerente"],
        Direccion: ["Director General", "Asistente de Dirección"],
    };

    return (
        <CardWrapper
            headerTitle={"Agregar Usuario"}
            headerLabel="Datos y permisos de usuario"
            width="w-[800px]"
        >
            <div className="">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6 h-[34rem]"
                    >
                        <div className="flex w-full flex-col">
                            <Tabs
                                selectedKey={selected}
                                onSelectionChange={(key) => setSelected(key as string)}
                                aria-label="Options"
                                className="text-gray-600 hover:text-gray-400"
                                classNames={{
                                    tabList: "gap-6 w-full rounded-lg relative p-1 border-b border-divider bg-gray-100 ",
                                    cursor: "w-full bg-[white] rounded-lg border-[0.5px] border-gray-300 shadow-sm shadow-black/25",
                                    tabContent: "group-data-[selected=true]:text-[black]",
                                }}
                                radius="lg"
                                size="sm"
                            >
                                <Tab key="datos" title="Datos" className="rounded-lg">
                                    <Card>
                                        <div className="space-y-4 px-[0.1rem] mb-2">
                                            <FormField
                                                control={form.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                placeholder="Misael Hernandez"
                                                                type="text"
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
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
                                            <FormField
                                                control={form.control}
                                                name="departament"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Departamento</FormLabel>
                                                        <Select
                                                            disabled={isPending}
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                setSelectedDepartment(value);
                                                            }}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecciona un departamento" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Finanzas">
                                                                    Finanzas
                                                                </SelectItem>
                                                                <SelectItem value="Almacen">
                                                                    Almacen
                                                                </SelectItem>
                                                                <SelectItem value="Ventas">
                                                                    Ventas
                                                                </SelectItem>
                                                                <SelectItem value="Gerencia">
                                                                    Gerencia
                                                                </SelectItem>
                                                                <SelectItem value="Direccion">
                                                                    Direccion
                                                                </SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="cargo"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Cargo</FormLabel>
                                                        <Select
                                                            disabled={!selectedDepartment || isPending}
                                                            onValueChange={field.onChange}
                                                            defaultValue={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Selecciona un cargo" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {selectedDepartment
                                                                    ? cargoOptions[selectedDepartment]?.map((cargo) => (
                                                                          <SelectItem key={cargo} value={cargo}>
                                                                              {cargo}
                                                                          </SelectItem>
                                                                      ))
                                                                    : null}
                                                            </SelectContent>
                                                        </Select>
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
                                                            <Input
                                                                {...field}
                                                                disabled={isPending}
                                                                placeholder="********"
                                                                type="password"
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
                                            Crear Cuenta
                                        </Button>
                                    </Card>
                                </Tab>
                                <Tab key="permisos" title="Permisos">
                                    <Card>
                                        <CardBody>
                                            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                        </CardBody>
                                    </Card>
                                </Tab>
                            </Tabs>
                        </div>
                    </form>
                </Form>
            </div>
        </CardWrapper>
    );
};

export default RegisterUserForm;
