"use server";

import * as z from "zod"
import bcrypt from "bcryptjs"

import { db } from "@/lib/db"
import { RegisterSchema, UpdateUserSchema } from "@/schemas";
import { getUserByEmail, getUserById } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos invalidos!" };
    }

    const { email, password, name, cargo, departament } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return { error: "Email ya existe" };
    }

    await db.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            cargo,
            departament,
        },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    )

    return { success: "Correo de confirmacion enviado!" };
};

export const updateUser = async (values: z.infer<typeof UpdateUserSchema>, id: string) => {
  // Validación de los campos proporcionados
  const validatedFields = UpdateUserSchema.safeParse(values);

  if (!validatedFields.success) {
      return { error: "Campos inválidos!" };
  }

  const { email, newPassword, name, departament, cargo, estado } = validatedFields.data;

  // Verificamos si el usuario existe por su ID
  const existingUser = await getUserById(id);

  if (!existingUser) {
      return { error: "Usuario no encontrado!" };
  }

  // Preparar los datos que se actualizarán
  const updatedData: any = {};

  // Actualizamos los campos solo si se proporcionan y son diferentes de los valores actuales
  if (name && name !== existingUser.name) {
      updatedData.name = name;
  }

  if (email && email !== existingUser.email) {
      const emailExists = await getUserByEmail(email);
      if (emailExists) {
          return { error: "El email ya existe" };
      }
      updatedData.email = email;
  }

  if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updatedData.password = hashedPassword;
  }

  if (departament && departament !== existingUser.departament) {
      updatedData.departament = departament;
  }

  if (cargo && cargo !== existingUser.cargo) {
      updatedData.cargo = cargo;
  }

  if (estado !== undefined && estado !== existingUser.estado) {
      updatedData.estado = estado;
  }

  // Verificamos que al menos haya un campo para actualizar
  if (Object.keys(updatedData).length > 0) {
      // Actualizamos el usuario en la base de datos
      await db.user.update({
          where: { id },
          data: updatedData,
      });

      return { success: "Usuario actualizado exitosamente!" };
  } else {
      return { error: "No hay campos a actualizar!" };
  }
};


export const getUsers = async () => {
    try {
      const users = await db.user.findMany({
        where: {
          role: {
            not: 'ADMIN',
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          cargo: true,
          departament: true,
          estado: true,
        },
      });
  
      return users;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];  // En lugar de null, devuelve un arreglo vacío
    }
  };

  export const getUserDataById = async (key: string) => {
    try {
      const user = await db.user.findFirst({
        where: {
          id: key,
          role: {
            not: 'ADMIN',
          },
        },
        select: {
          name: true,
          email: true,
          image: true,
          cargo: true,
          departament: true,
          estado: true,
        },
      });
  
      return user; // Si el usuario es encontrado, se retorna el objeto del usuario
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;  // Devuelve null en caso de error o si no se encuentra al usuario
    }
  };
  
  