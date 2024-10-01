"use server";

import * as z from "zod"
import { generateCodigo, getProveedores, getProveedorById } from "@/data/almacen";
import { ProveedorSchema } from "@/schemas";
import { db } from "@/lib/db";

export const getAllProveedores = async () => {
    try {
        const proveedores = await getProveedores();
        return proveedores;
    } catch (error){
        console.error("Error fetching categorias:", error);
        return [];
    }
}

export const getProveedorDataById = async (id: string) => {
    try{
        const proveedor = await getProveedorById(id);
        return proveedor;
    } catch (error){
        return { error: "Algo fallo" }
    }
}

export const registerProveedor = async (values: z.infer<typeof ProveedorSchema>) => {
    // Validate fields using the schema
    const validatedFields = ProveedorSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, error: validatedFields.error.errors };
    }

    try {
        // Generate unique codigo
        const codigo = await generateCodigo();

        // Create an Articulo in the database using Prisma
        const proveedor = await db.proveedor.create({
            data: {
                ...values
            },
        });

        return { success: `Proveedor ${proveedor.nombre} guardado`};
    } catch (error) {
        return { error: "Error al guardar proveedor" };
    }
};

export const updateProveedor = async (values: z.infer<typeof ProveedorSchema>, id: string) => {
    // Validar los campos usando el esquema de Proveedor
    const validatedFields = ProveedorSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!", errors: validatedFields.error.errors };
    }

    const { nombre, segmento, ubicacion, contacto, puesto, correo, telefono, ext } = validatedFields.data;

    // Verificar si el proveedor existe por su ID
    const existingProveedor = await getProveedorById(id);

    if (!existingProveedor) {
        return { error: "Proveedor no encontrado!" };
    }

    // Preparar los datos que se actualizarán
    const updatedData: any = {};

    // Actualizar solo si los campos son diferentes
    if (nombre && nombre !== existingProveedor.nombre) {
        updatedData.nombre = nombre;
    }
    
    if (segmento !== undefined && segmento !== existingProveedor.segmento) {
        updatedData.segmento = segmento;
    }
    
    if (ubicacion !== undefined && ubicacion !== existingProveedor.ubicacion) {
        updatedData.ubicacion = ubicacion;
    }
    
    if (contacto !== undefined && contacto !== existingProveedor.contacto) {
        updatedData.contacto = contacto;
    }

    if (puesto !== undefined && puesto !== existingProveedor.puesto) {
        updatedData.puesto = puesto;
    }

    if (correo !== undefined && correo !== existingProveedor.correo) {
        updatedData.correo = correo;
    }

    if (telefono !== undefined && telefono !== existingProveedor.telefono) {
        updatedData.telefono = telefono;
    }

    if (ext !== undefined && ext !== existingProveedor.ext) {
        updatedData.ext = ext;
    }

    try {
        // Actualizar el proveedor en la base de datos
        const updatedProveedor = await db.proveedor.update({
            where: { id },
            data: updatedData,
        });

        return { success: `Proveedor ${updatedProveedor.nombre} actualizado exitosamente!` };
    } catch (error) {
        return { error: "Error al actualizar el proveedor" };
    }
};
