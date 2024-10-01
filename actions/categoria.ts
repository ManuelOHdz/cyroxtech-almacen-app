"use server";

import * as z from "zod"
import { generateCodigo, getCategoriaById, getCategorias } from "@/data/almacen";
import { CategoriaSchema } from "@/schemas";
import { db } from "@/lib/db";

export const getAllCategorias = async () => {
    try {
        const categorias = await getCategorias();
        return categorias;
    } catch (error){
        console.error("Error fetching categorias:", error);
        return [];
    }
}

export const registerCategoria = async (values: z.infer<typeof CategoriaSchema>) => {
    // Validate fields using the schema
    const validatedFields = CategoriaSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, error: validatedFields.error.errors };
    }

    try {
        // Create an Articulo in the database using Prisma
        const categoria = await db.categoria.create({
            data: {
                ...values
            },
        });

        return { success: `Categoria ${categoria.nombre} guardado`};
    } catch (error) {
        return { error: "Error al guardar proveedor" };
    }
};

export const updateCategoria = async (values: z.infer<typeof CategoriaSchema>, id: string) => {
    // Validar los campos usando el esquema de Categoría
    const validatedFields = CategoriaSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!", errors: validatedFields.error.errors };
    }

    const { nombre, descripcion } = validatedFields.data;

    // Verificar si la categoría existe por su ID
    const existingCategoria = await getCategoriaById(id);

    if (!existingCategoria) {
        return { error: "Categoría no encontrada!" };
    }

    // Preparar los datos que se actualizarán
    const updatedData: any = {};

    // Actualizar solo si los campos son diferentes
    if (nombre && nombre !== existingCategoria.nombre) {
        updatedData.nombre = nombre;
    }

    if (descripcion !== undefined && descripcion !== existingCategoria.descripcion) {
        updatedData.descripcion = descripcion;
    }

    try {
        // Actualizar la categoría en la base de datos
        const updatedCategoria = await db.categoria.update({
            where: { id },
            data: updatedData,
        });

        return { success: `Categoría ${updatedCategoria.nombre} actualizada exitosamente!` };
    } catch (error) {
        return { error: "Error al actualizar la categoría" };
    }
};
