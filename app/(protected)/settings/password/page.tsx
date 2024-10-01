"use client";

import * as z from "zod";
import { useTransition, useState } from "react";
import { useSession } from "next-auth/react";

import { Switch } from "@/components/ui/switch";
import { ChangePasswordSchema } from "@/schemas";
import {
    Card,
    CardHeader,
    CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { changePassword, settings } from "@/actions/settings";
import { 
    Form,
    FormField,
    FormControl,
    FormItem,
    FormLabel,
    FormDescription,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCurrentUser } from "@/hooks/user-current-user";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import { FormWarning } from "@/components/auth/form-warning";
import { RoleGate } from "@/components/auth/role.gat";
import { UserRole } from "@prisma/client";


const PasswordPage = () => {
    const user = useCurrentUser();

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    const [warning, setWarning] = useState<string | undefined>()

    const { update } = useSession();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof ChangePasswordSchema>>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            password: undefined,
            newPassword: undefined,
            newPasswordConfirmation: undefined,
            isTwoFactorEnabled: user?.isTwoFactorEnabled || undefined,
        }
    });

    const onSubmit = (values: z.infer<typeof ChangePasswordSchema>) => {
        startTransition(() => {
            changePassword(values)
              .then((data) => {
                setError("");
                setSuccess("");
                setWarning("");
                if (data.error) {
                    setError(data.error);
                }

                if (data.warning) {
                    setWarning(data.warning);
                }

                if (data.success) {
                    update();
                    setSuccess(data.success);
                    form.setValue("password" , "")
                    form.setValue("newPassword" , "")
                    form.setValue("newPasswordConfirmation" , "")
                }
              }).catch(() => setError("Algo salio mal!"));       
        })
    }

    return (
        <RoleGate allowedRole={UserRole.ADMIN} message>
        <Card className="w-[500px]">
        <CardHeader>
            <p className="text-2xl font-semibold text-center">
                Cambiar Contraseña y Autenticación
            </p>
        </CardHeader>
        <CardContent>
            <Form {...form}>
                <form 
                    className="space-y-6" 
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="space-y-4">
                        
                        {user?.isOAuth === false && (
                        <>
                            
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="*******"
                                                type="password"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage/>
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
                                                placeholder="*******"
                                                type="password"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPasswordConfirmation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirmar Contraseña</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="*******"
                                                type="password"
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </>
                        )}
                        
                        
                        
                        {user?.isOAuth === false && (
                            <>
                        <FormField
                            control={form.control}
                            name="isTwoFactorEnabled"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center
                                justify-between rounded-lg border p-3 shadow-sm">
                                    <div>
                                        <FormLabel>Autenticacion de 2 Factores</FormLabel>
                                        <FormDescription>
                                            Activa Autenticacion de 2 Factores para tu cuenta
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
                        </>
                        )}
                    </div>
                    <FormError message={error}/>
                    <FormSuccess message={success}/>
                    <FormWarning message={warning}/>
                    <Button
                        disabled={isPending}
                        type="submit"
                    >
                        Guardar
                    </Button>
                </form>
            </Form>
        </CardContent>
    </Card>
    </RoleGate>
    
    );
}

export default PasswordPage;