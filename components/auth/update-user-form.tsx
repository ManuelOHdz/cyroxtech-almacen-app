"use client";

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateUserSchema } from "@/schemas";
import { Input } from "@/components/ui/input";

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { updateUser, getUserDataById } from "@/actions/user";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

import { getSocket } from '@/lib/socket';
import { Spinner } from '../ui/spinner';

export const UpdateUserForm = ({ userId }: { userId: string }) => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState<boolean>(true);
    const [selected, setSelected] = useState<string>("datos");
    const [selectedDepartment, setSelectedDepartment] = useState<string>("");
    const [selectedEstado, setSelectedEstado] = useState<string>("");

    // Crear conexión a Socket.io
    const socket = getSocket();

    const form = useForm<z.infer<typeof UpdateUserSchema>>({
      resolver: zodResolver(UpdateUserSchema),
      defaultValues: {
        email: "",
        newPassword: "",
        name: "",
        cargo: "",
        departament: "",
        estado: undefined,
      },
    });

    const cargoOptions: Record<string, string[]> = {
      Finanzas: ["Contador", "Analista Financiero"],
      Almacen: ["Supervisor de Almacén", "Operador de Logística"],
      Ventas: ["Vendedor", "Ejecutivo de Ventas"],
      Gerencia: ["Gerente", "Subgerente"],
      Direccion: ["Director General", "Asistente de Dirección"],
    };

    useEffect(() => {
      if (userId) {
        getUserDataById(userId).then((userData) => {
          form.reset({
            email: userData?.email || "",
            name: userData?.name || "",
            newPassword: "",  // leave password field empty
            departament: userData?.departament || "",
            cargo: userData?.cargo || "",
            estado: userData?.estado || undefined, 
          });
          setSelectedDepartment(userData?.departament || "");
          setSelectedEstado(userData?.estado !== undefined ? String(userData.estado) : "true");
        })
        .catch(err => console.error("Error fetching user data:", err))
        .finally(() => setLoading(false));;
      }
    }, [userId]);
  
  
    const onSubmit = async (values: z.infer<typeof UpdateUserSchema>) => {
      setError("");
      setSuccess("");
  
      startTransition(async () => {
        const result = await updateUser(values, userId);
        if (result.success) {
          setSuccess("Usuario actualizado con éxito");
          values.newPassword = "";
          // Emitir evento a través de Socket.io para notificar a los clientes conectados
          socket.emit("update user", {
            id: userId,
            ...values,
          });
  
        } else {
          setError(result.error);
        }
      });
    };

    return (
      <CardWrapper
        headerTitle={"Editar Usuario"}
        headerLabel="Datos y permisos de usuario"
        width="w-[600px]"
      >
        <div className="min-h-[37rem] max-h-[38rem]">
          <Form {...form}>
            <form 
              onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-6"
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
                  {loading ? (
                  <div className='mt-3'>
                    <SkeletonTheme baseColor="#e4e4e4" highlightColor="#f4f4f4">
                      <p>
                        <Skeleton  duration={1.6} width={'15%'} height={20} />
                        <Skeleton duration={1.6} width={'100%'} height={35} className='mb-2' />
                        <Skeleton duration={1.6} width={'15%'} height={20} />
                        <Skeleton duration={1.6} width={'100%'} height={35} className='mb-2' />
                        <Skeleton duration={1.6} width={'15%'} height={20} />
                        <Skeleton duration={1.6} width={'100%'} height={35} className='mb-2' />
                        <Skeleton duration={1.6} width={'15%'} height={20} className='mb-1'/>
                        <Skeleton duration={1.6} width={'100%'} height={38} className='mb-3' />
                      </p>
                    </SkeletonTheme>
                    <div className="flex flex-row items-center justify-between rounded-lg border shadow-sm mb-2 w-full">
                      <div className="w-full p-3">
                        <Skeleton baseColor="#e4e4e4" highlightColor="#f4f4f4" duration={1.6} width={'15%'} height={18} />
                        <Skeleton baseColor="#e4e4e4" highlightColor="#f4f4f4" duration={1.6} width={'40%'} height={20} />
                      </div>
                      <div className='w-[15%]'>
                        <Skeleton baseColor="#e4e4e4" highlightColor="#f4f4f4" duration={1.6} width={'90%'} height={25} />
                      </div>
                      
                    </div>
                    <SkeletonTheme baseColor="#e4e4e4" highlightColor="#f4f4f4" duration={1.6}>
                      <p>
                        <Skeleton duration={1.6} width={'15%'} height={20}  />
                        <Skeleton duration={1.6} width={'100%'} height={35} className='mb-2' />
                        <Skeleton duration={1.6} width={'100%'} height={35} />
                      </p>
                    </SkeletonTheme>
                    
                                       
                  </div>
                    ) : (
                    <Card>
                      <div className="space-y-4 px-[0.1rem]">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nombre</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={isPending}
                                  placeholder="Manuel"
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
                                value={selectedDepartment} // Actualiza el valor del departamento seleccionado
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un departamento" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Finanzas">Finanzas</SelectItem>
                                  <SelectItem value="Almacen">Almacen</SelectItem>
                                  <SelectItem value="Ventas">Ventas</SelectItem>
                                  <SelectItem value="Gerencia">Gerencia</SelectItem>
                                  <SelectItem value="Direccion">Direccion</SelectItem>
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
                                value={field.value} // Actualiza el valor del cargo seleccionado
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
                          name="estado"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center
                            justify-between rounded-lg border p-3 shadow-sm">
                                  <div>
                                      <FormLabel>Estado</FormLabel>
                                      <FormDescription>
                                          Cambia entre Activo e Inactivo
                                      </FormDescription>
                                  </div>
                                  <FormControl>
                                        <Switch
                                            disabled={isPending}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>  
                              </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nueva Contraseña</FormLabel>
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
                      <div className="mt-2">
                        <FormError message={error} />
                        <FormSuccess message={success} />
                      </div>      
                      <Button
                        type="submit"
                        className="w-full mt-5"
                        size="lg"
                        disabled={isPending}
                      >
                        {isPending ? (
                                <>
                                    <Spinner color="white" ClassName="scale-[.30]"/> Actualizando...
                                </>
                                ) : 
                            ("Actualizar Usuario")}   
                      </Button>
                    </Card>
                    )}
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
  
  export default UpdateUserForm;
