import { UserRole, Moneda, Estado } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z.object({
    name: z.string().optional(),
    role: z.nativeEnum(UserRole),
    email: z.string().email().optional(),
    password: z.string().min(6, { message: "Contraseña es requerida" })
});

export const ChangePasswordSchema = z.object({
    isTwoFactorEnabled: z.boolean().optional(),
    password: z.string().min(6, { message: "Contraseña es requerida" }),
    newPassword: z.optional(z.string().refine((value) => !value || value.length >= 6, {
        message: "Nueva contraseña debe tener al menos 6 caracteres",
    })),
    newPasswordConfirmation: z.optional(z.string().refine((value) => !value || value.length >= 6, {
        message: "Confirmacion de contraseña es requerida",
    })),
})
.refine((data) => {
    if (data.newPassword !== data.newPasswordConfirmation) {
        return false;
    }
    return true;
}, {
    message: "No coinciden las contraseñas",
    path: ["newPasswordConfirmation"]
});

export const ResetSchema = z.object({
    email: z.string().email({ message: "Email es requerido" })
});

export const LoginSchema = z.object({
    email: z.string().email({ message: "Email es requerido" }),
    password: z.string().min(1, { message: "Password es requerido" }),
    code: z.string().optional()
});

export const RegisterSchema = z.object({
    email: z.string().email({ message: "Email es requerido" }),
    password: z.string().min(6, { message: "Mínimo 6 caracteres" }),
    name: z.string().min(1, { message: "Nombre es requerido" }),
    cargo: z.optional(z.string()),
    departament: z.string().min(1, { message: "Departamento es requerido" }),
});

export const RegisterArticuloSchema = z.object({
    name: z.string().min(1,{ message: "Nombre es requerido" }),
    stock: z.string().min(1,{ message: "Stock es requerido" }),
    min_stock: z.string().min(1,{ message: "Stock minimo es requerido" }),
    max_stock: z.string().min(1,{ message: "Stock maximo es requerido" }),
    categoria: z.string(),
    marca: z.string(),
    proveedor: z.string(),
    modelo: z.optional(z.string().min(1,{ message: "Modelo es requerido" })),
    no_parte: z.string().min(5,{ message: "No. parte es requerido" }),
    precio: z.string().min(1,{ message: "Precio es requerido" }),
    moneda: z.nativeEnum(Moneda),
    estado: z.nativeEnum(Estado),
    almacen: z.string().min(1,{ message: "Almacen es requerido" }),
    rack: z.string().min(1,{ message: "Rack es requerido" }),
    nivel: z.string().min(1,{ message: "Nivel es requerido" }),
    fila: z.string().min(1,{ message: "Fila es requerido" }),
    columna: z.string().min(1,{ message: "Columna es requerido" }),
});

export const UpdateArticuloSchema = z.object({
    name: z.optional(z.string().min(3,{ message: "Debe tener minimo 3 caracteres" })),
    stock: z.optional(z.string().min(1,{ message: "Stock es requerido" })),
    min_stock: z.optional(z.string().min(1,{ message: "Stock minimo es requerido" })),
    max_stock: z.optional(z.string().min(1,{ message: "Stock maximo es requerido" })),
    categoria: z.optional(z.string()),
    marca: z.optional(z.string()),
    proveedor: z.optional(z.string()),
    modelo: z.optional(z.optional(z.string().min(1,{ message: "Debe tener minimo 3 caracteres" }))),
    no_parte: z.optional(z.string().min(5,{ message: "Debe tener minimo 5 caracteres" })),
    precio: z.optional(z.string().min(1,{ message: "Precio es requerido" })),
    moneda: z.optional(z.nativeEnum(Moneda)),
    estado: z.optional(z.nativeEnum(Estado)),
    almacen: z.optional(z.string().min(1,{ message: "Almacen es requerido" })),
    rack: z.optional(z.string().min(1,{ message: "Rack es requerido" })),
    nivel: z.optional(z.string().min(1,{ message: "Nivel es requerido" })),
    fila: z.optional(z.string().min(1,{ message: "Fila es requerido" })),
    columna: z.optional(z.string().min(1,{ message: "Columna es requerido" })),
});

export const UpdateUserSchema = z.object({
    email: z.optional(z.string().email({ message: "Email incorrecto" })),
    name: z.optional(z.string().min(4, { message: "Debe tener minimo 4 caracteres" })),
    cargo: z.optional(z.string()),
    departament: z.optional(z.string()),
    estado: z.optional(z.boolean()),
    newPassword: z.optional(z.string().refine((value) => !value || value.length >= 6, {
        message: "Nueva contraseña debe tener al menos 6 caracteres",
    })),
});

export const CategoriaSchema = z.object({
    nombre: z.string().min(4,{ message: "Nombre debe tener minimo 4 caracteres" }),
    descripcion: z.optional(z.string().min(8, { message: "Descripcion debe tener minimo 8 caracteres" })),
})

export const MarcaSchema = z.object({
    nombre: z.string().min(2,{ message: "Nombre debe tener minimo 2 caracteres" }),
})

export const ProveedorSchema = z.object({
    nombre: z.string().min(2,{ message: "Nombre debe tener minimo 2 caracteres" }),
    segmento: z.optional(z.string().min(2,{ message: "Segmento debe tener minimo 2 caracteres" })),
    ubicacion: z.optional(z.string().min(2,{ message: "Ubicacion debe tener minimo 2 caracteres" })),
    contacto: z.optional(z.string().min(2,{ message: "Contacto debe tener minimo 2 caracteres" })),
    puesto: z.optional(z.string().min(2,{ message: "Puesto debe tener minimo 2 caracteres" })),
    correo: z.optional(z.string().min(2,{ message: "Correo debe tener minimo 2 caracteres" })),
    telefono: z.optional(z.string().min(2,{ message: "Telefono debe tener minimo 2 caracteres" })),
    ext: z.optional(z.string().min(2,{ message: "Ext. debe tener minimo 2 caracteres" })),
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, { message: "Se requiere mínimo 6 caracteres" })
});
