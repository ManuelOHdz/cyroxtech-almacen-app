"use server";

import * as z from "zod"
import { getMarcaById, getMarcas } from "@/data/almacen";
import { MarcaSchema } from "@/schemas";
import { db } from "@/lib/db";

export const getAllMarcas = async () => {
    try {
        const marcas = await getMarcas();
        return marcas;
    } catch (error){
        console.error("Error fetching marcas:", error);
        return [];
    }
}

export const registerMarca = async (values: z.infer<typeof MarcaSchema>) => {
    // Validate fields using the schema
    const validatedFields = MarcaSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, error: validatedFields.error.errors };
    }

    try {
        // Create an Articulo in the database using Prisma
        const marca = await db.marca.create({
            data: {
                ...values
            },
        });

        return { success: `Marca ${marca.nombre} guardado`};
    } catch (error) {
        return { error: "Error al guardar proveedor" };
    }
};

export const updateMarca = async (values: z.infer<typeof MarcaSchema>, id: string) => {
    // Validar los campos usando el esquema de Marca
    const validatedFields = MarcaSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!", errors: validatedFields.error.errors };
    }

    const { nombre } = validatedFields.data;

    // Verificar si la marca existe por su ID
    const existingMarca = await getMarcaById(id);

    if (!existingMarca) {
        return { error: "Marca no encontrada!" };
    }

    // Preparar los datos que se actualizarán
    const updatedData: any = {};

    // Actualizar solo si los campos son diferentes
    if (nombre && nombre !== existingMarca.nombre) {
        updatedData.nombre = nombre;
    }

    try {
        // Actualizar la marca en la base de datos
        const updatedMarca = await db.marca.update({
            where: { id },
            data: updatedData,
        });

        return { success: `Marca ${updatedMarca.nombre} actualizada exitosamente!` };
    } catch (error) {
        return { error: "Error al actualizar la marca" };
    }
};
