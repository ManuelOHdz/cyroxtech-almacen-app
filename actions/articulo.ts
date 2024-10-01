"use server";

import * as z from "zod"
import { generateCodigo, getArticulos, getArticuloById } from "@/data/almacen";
import { RegisterArticuloSchema, UpdateArticuloSchema } from "@/schemas";
import { db } from "@/lib/db";
import { Decimal } from "@prisma/client/runtime/library";

export const getArticuloDataById = async (id: string) => {
    const articulo = await getArticuloById(id);

    if (!articulo) return { error: "Artículo no encontrado" };

    // Transformar el objeto para la vista
    const articuloView = {
        id: articulo.id,
        name: articulo.name,
        stock: articulo.stock,
        min_stock: articulo.min_stock,
        max_stock: articulo.max_stock,
        categoria: articulo.categoriaId, // Puedes mapear relaciones si es necesario
        marca: articulo.marcaId, // Igual aquí para relaciones
        modelo: articulo.modelo,
        no_parte: articulo.no_parte,
        estado: articulo.estado,
        proveedor: articulo.proveedorId, // Relaciones
        almacen: articulo.almacen,
        rack: articulo.rack,
        nivel: articulo.nivel,
        fila: articulo.fila,
        columna: articulo.columna,
        imagen: articulo.imagen, // URL de la imagen
        precio: articulo.precio instanceof Decimal ? articulo.precio.toNumber().toFixed(2) : null, // Convertir a string con dos decimales
        moneda: articulo.moneda, // Moneda
    };

    return articuloView;
};




export const getAllArticulos = async () => {
    try {
        const articulos = await getArticulos(); // Asegúrate de esperar a la respuesta si es una promesa
    
        // Recorremos los artículos para convertir el precio a string
        const updatedArticulos = articulos.map((articulo: any) => ({
          ...articulo,
          precio: articulo.precio?.toFixed(2).toString() // Convierte a string y limita los decimales
        }));
    
        return updatedArticulos;
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
}

export const registerArticulo = async (values: z.infer<typeof RegisterArticuloSchema>, imageUrl: string | null ) => {
    // Validar campos usando el esquema
    const validatedFields = RegisterArticuloSchema.safeParse(values);

    if (!validatedFields.success) {
        return { success: false, error: validatedFields.error.errors };
    }

    console.log("Url de imagen: " + imageUrl);

    try {
        // Generar código único
        const codigo = await generateCodigo();

        // Crear el Articulo en la base de datos utilizando Prisma
        const articulo = await db.articulo.create({
            data: {
                codigo, // Almacena el código generado
                name: validatedFields.data.name,
                stock: parseInt(validatedFields.data.stock),
                min_stock: parseInt(validatedFields.data.min_stock),
                max_stock: parseInt(validatedFields.data.max_stock),
                categoriaId: validatedFields.data.categoria,
                marcaId: validatedFields.data.marca,
                modelo: validatedFields.data.modelo as string,
                no_parte: validatedFields.data.no_parte,
                precio: validatedFields.data.precio,
                moneda: validatedFields.data.moneda,
                estado: validatedFields.data.estado,
                proveedorId: validatedFields.data.proveedor,
                almacen: validatedFields.data.almacen,
                rack: validatedFields.data.rack,
                nivel: validatedFields.data.nivel,
                fila: validatedFields.data.fila,
                columna: validatedFields.data.columna,
                imagen: imageUrl as string, // Almacenar la URL de Cloudinary
            },
        });

        return { success: `Articulo ${articulo.name} guardado` };
    } catch (error) {
        return { success: false, error: "Error al guardar articulo" };
    }
};

export const updateArticulo = async (values: z.infer<typeof UpdateArticuloSchema>, id: string, imageUrl: string | null) => {
    // Validar los campos usando el esquema
    const validatedFields = UpdateArticuloSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos!", errors: validatedFields.error.errors };
    }

    const { name, stock, min_stock, max_stock, categoria, marca, modelo, no_parte, precio, moneda, estado, proveedor, almacen, rack, nivel, fila, columna } = validatedFields.data;

    // Verificar si el artículo existe por su ID
    const existingArticulo = await getArticuloById(id);

    if (!existingArticulo) {
        return { error: "Artículo no encontrado!" };
    }

    // Preparar los datos que se actualizarán
    const updatedData: any = {};

    // Actualizamos los campos solo si se proporcionan y son diferentes de los valores actuales
    if (name && name !== existingArticulo.name) {
        updatedData.name = name;
    }

    if (stock && parseInt(stock) !== existingArticulo.stock) {
        updatedData.stock = parseInt(stock);
    }

    if (min_stock && parseInt(min_stock) !== existingArticulo.min_stock) {
        updatedData.min_stock = parseInt(min_stock);
    }

    if (max_stock && parseInt(max_stock) !== existingArticulo.max_stock) {
        updatedData.max_stock = parseInt(max_stock);
    }

    if (categoria && categoria !== existingArticulo.categoriaId) {
        updatedData.categoriaId = categoria;
    }

    if (marca && marca !== existingArticulo.marcaId) {
        updatedData.marcaId = marca;
    }

    if (modelo && modelo !== existingArticulo.modelo) {
        updatedData.modelo = modelo;
    }

    if (no_parte && no_parte !== existingArticulo.no_parte) {
        updatedData.no_parte = no_parte;
    }

    if (precio && precio !== existingArticulo.precio.toString()) {
        updatedData.precio = precio;
    }

    if (moneda && moneda !== existingArticulo.moneda) {
        updatedData.moneda = moneda;
    }

    if (estado !== undefined && estado !== existingArticulo.estado) {
        updatedData.estado = estado;
    }

    if (proveedor && proveedor !== existingArticulo.proveedorId) {
        updatedData.proveedorId = proveedor;
    }

    if (almacen && almacen !== existingArticulo.almacen) {
        updatedData.almacen = almacen;
    }

    if (rack && rack !== existingArticulo.rack) {
        updatedData.rack = rack;
    }

    if (nivel && nivel !== existingArticulo.nivel) {
        updatedData.nivel = nivel;
    }

    if (fila && fila !== existingArticulo.fila) {
        updatedData.fila = fila;
    }

    if (columna && columna !== existingArticulo.columna) {
        updatedData.columna = columna;
    }

    if (imageUrl && imageUrl !== existingArticulo.imagen) {
        updatedData.imagen = imageUrl;
    }

    try {
        // Actualizar el artículo en la base de datos
        const updatedArticulo = await db.articulo.update({
            where: { id },
            data: updatedData,
        });

        return { success: `Artículo ${updatedArticulo.name} actualizado exitosamente!` };
    } catch (error) {
        return { error: "Error al actualizar el artículo" };
    }
};



