"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { SettingsSchema, ChangePasswordSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const settings = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();

    if (!user) {
        return { error: "No autorizado" };
    }

    const dbUser = await getUserById(user.id as string);

    if (!dbUser) {
        return { error: "No autorizado" };
    }

    if (user.isOAuth) {
        values.name = undefined;
        values.email = undefined;
    }

    if (values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        if (existingUser && existingUser.id !== user.id) {
            return { error: "Email ya está en uso!" };
        }

        const verificationToken = await generateVerificationToken(values.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return { success: "Verificación enviada al correo" };
    }


    

    if (values.password && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);

        if (!passwordsMatch) {
            return { error: "Contraseña incorrecta" };
        }
    }

    

    await db.user.update({
        where: { id: dbUser.id },
        data: { name: values.name, email: values.email }
    });

    return { success: "Ajustes actualizados!" };
};

export const changePassword = async (values: z.infer<typeof ChangePasswordSchema>) => {
    const user = await currentUser();

    if (!user) {
        return { error: "No autorizado" };
    }

    const dbUser = await getUserById(user.id as string);

    if (!dbUser) {
        return { error: "No autorizado" };
    }

    


    if (values.password && dbUser.password) {
        const passwordsMatch = await bcrypt.compare(values.password, dbUser.password);
    
        if(values.isTwoFactorEnabled === dbUser.isTwoFactorEnabled && !values.newPassword){
            return { warning: "No haz realizado ningun cambio" }
        }

        if (!passwordsMatch) {
            return { error: "Contraseña incorrecta" };
        }
    
        let hashedPassword = dbUser.password; 
    
        if (values.newPassword) {
            hashedPassword = await bcrypt.hash(values.newPassword, 10);
        }
    
        await db.user.update({
            where: { id: dbUser.id },
            data: {
                isTwoFactorEnabled: values.isTwoFactorEnabled,
                password: hashedPassword
            }
        });
    
        return { success: "Datos Actualizados!" };
    }

    return { error: "Error al actualizar la contraseña" };
};
