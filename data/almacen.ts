import { db } from "@/lib/db";
import { randomInt } from "crypto";

import { v2 as cloudinary } from 'cloudinary';

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});


export const getArticulos = async () => {
    const articulos = await db.articulo.findMany({
        include: {
            marca: true, // Esto incluye la relación de la marca con cada artículo
            proveedor: true,
            categoria: true,
        },
    });


    return articulos
}

export const getArticuloById = async (id: string) => {
    const articulo = await db.articulo.findUnique({
        where: { id }
    });
    return articulo;
}

export const generateCodigo = async (): Promise<string> => {
    let unique = false;
    let codigo = '';

    while (!unique) {
        // Generate a random code starting with 'C' and followed by 5 random alphanumeric characters
        const randomPart = randomInt(10000, 99999).toString();
        codigo = `C${randomPart}`;

        // Check if the code already exists in the database
        const exists = await db.articulo.findUnique({
            where: { codigo },
        });

        if (!exists) {
            unique = true;
        }
    }

    return codigo;
};

export const getCategorias = async () => {
    const categorias = await db.categoria.findMany();
    return categorias;
}

export const getMarcas = async () => {
    const marcas = await db.marca.findMany();
    return marcas;
}

export const getProveedores = async () => {
    const proveedores = await db.proveedor.findMany();
    return proveedores;
}

export const getCategoriaById = async (id: string) => {
    const categoria = await db.categoria.findUnique({
        where: { id }
    })
    return categoria;
}

export const getMarcaById = async (id: string) => {
    const categoria = await db.categoria.findUnique({
        where: { id }
    })
    return categoria;
}

export const getProveedorById = async (id: string) => {
    const proveedor = await db.proveedor.findUnique({
        where: { id }
    })
    return proveedor;
}
