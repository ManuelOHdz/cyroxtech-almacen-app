"use client";

import * as z from "zod";
import { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { RegisterArticuloSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/auth/form-error";
import { FormSuccess } from "@/components/auth/form-success";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { getAllCategorias } from "@/actions/categoria";
import { getAllMarcas } from "@/actions/marca";
import { getAllProveedores } from "@/actions/proveedor";
import { registerArticulo } from "@/actions/articulo";
import Image from "next/image";


// Enums para Moneda y Estado
import { Moneda, Estado } from "@prisma/client";
import { Spinner } from "@/components/ui/spinner";


export const RegisterArticuloForm = () => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, setPending] = useState(false);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [marcas, setMarcas] = useState<any[]>([]);
    const [proveedores, setProveedores] = useState<any[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<z.infer<typeof RegisterArticuloSchema>>({
        resolver: zodResolver(RegisterArticuloSchema),
        defaultValues: {
            name: "",
            stock: "",
            min_stock: "",
            max_stock: "",
            precio: "",
            moneda: Moneda.USD, // Moneda predeterminada
            categoria: "",
            marca: "",
            proveedor: "",
            almacen: "",
            rack: "",
            nivel: "",
            fila: "",
            columna: "",
            estado: Estado.NUEVO, // Estado predeterminado
            no_parte: "",
            modelo: "",
        },
    });

    useEffect(() => {
        const fetchData = async () => {
            const [categorias, marcas, proveedores] = await Promise.all([
                getAllCategorias(),
                getAllMarcas(),
                getAllProveedores(),
            ]);
            setCategorias(categorias);
            setMarcas(marcas);
            setProveedores(proveedores);
        };

        fetchData();
    }, []);

    const uploadImage = async () => {
        if (image) {
          const formdata = new FormData();
          formdata.append("image", image);
      
          try {
            const imageUrl = await fetch("/api/uploadImage", {
              method: "POST",
              body: formdata,
            });
      
            const data = await imageUrl.json();
      
            if (imageUrl.ok) {
              return data.url; // Devuelve la URL de la imagen
            } else {
              throw new Error(data.message || "Error al subir la imagen");
            }
          } catch (error) {
            console.error("Error al subir la imagen:", error);
            throw error;
          }
        } else {
          return null; // Si no hay imagen, simplemente devuelve null
        }
    };
      
    const onSubmit = async (values: z.infer<typeof RegisterArticuloSchema>) => {
        setError("");
        setSuccess("");

        setPending(true);
            uploadImage().then((imageUrl) => {
                registerArticulo(values, imageUrl)
                    .then((data) => {
                        setPending(false);
                        if(data?.error){
                        
                            setError(data.error as string);
                        }  
                        if(data?.success){
                            form.reset();
                            setSuccess(data.success as string);
                        }  
                    });        
            }).catch(() => {
                setPending(false);
                setError("Algo salio mal")
            });
    };
      
    

    const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            setImage(files[0]);
            setImagePreview(URL.createObjectURL(files[0]));
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleImageClick = () => {
        if (!image) {
            document.getElementById("fileInput")?.click();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
            setImagePreview(URL.createObjectURL(files[0]));
        }
    };

    return (
        <CardWrapper
            headerTitle={"Agregar Artículo"}
            headerLabel="Datos del artículo"
            width="w-screen min-h-screen max-h-screen sm:max-w-[900px] sm:min-h-[580px] sm:max-h-[850px] sm:overflow-hidden overflow-auto"
        >
            <div className="">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        <div className="flex flex-col sm:flex-row sm:space-x-4">
                            {/* Primera columna */}
                            <div className="flex flex-col w-full sm:w-1/3 space-y-4">
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
                                                    placeholder="Nombre del artículo"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="no_parte"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>No. Parte</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="No. Parte del artículo"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="stock"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Cantidad en stock"
                                                    type="number"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex space-x-2">
                                    <FormField
                                        control={form.control}
                                        name="min_stock"
                                        render={({ field }) => (
                                            <FormItem className="w-1/2">
                                                <FormLabel>Stock Mínimo</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="Stock mínimo"
                                                        type="number"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="max_stock"
                                        render={({ field }) => (
                                            <FormItem className="w-1/2">
                                                <FormLabel>Stock Máximo</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="Stock máximo"
                                                        type="number"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="estado"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estado</FormLabel>
                                            <Select
                                                disabled={isPending}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona el estado" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {Object.values(Estado).map((estado) => (
                                                        <SelectItem key={estado} value={estado}>
                                                            {estado}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Segunda columna */}
                            
                            <div className="flex flex-col w-full sm:w-1/3 space-y-4">
                                <FormField
                                    control={form.control}
                                    name="modelo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Modelo</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    disabled={isPending}
                                                    placeholder="Modelo del artículo"
                                                    type="text"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="categoria"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Categoría</FormLabel>
                                            <Select
                                                disabled={isPending}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una categoría" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {categorias.map((categoria) => (
                                                        <SelectItem
                                                            key={categoria.id}
                                                            value={categoria.id}
                                                        >
                                                            {categoria.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="marca"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Marca</FormLabel>
                                            <Select
                                                disabled={isPending}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona una marca" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {marcas.map((marca) => (
                                                        <SelectItem
                                                            key={marca.id}
                                                            value={marca.id}
                                                        >
                                                            {marca.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="proveedor"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Proveedor</FormLabel>
                                            <Select
                                                disabled={isPending}
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona un proveedor" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {proveedores.map((proveedor) => (
                                                        <SelectItem
                                                            key={proveedor.id}
                                                            value={proveedor.id}
                                                        >
                                                            {proveedor.nombre}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex space-x-2">
                                    <FormField
                                        control={form.control}
                                        name="precio"
                                        render={({ field }) => (
                                            <FormItem className="w-3/5">
                                                <FormLabel>Precio</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        disabled={isPending}
                                                        placeholder="Precio"
                                                        type="number"
                                                        step="0.01"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="moneda"
                                        render={({ field }) => (
                                            <FormItem className="w-2/5">
                                                <FormLabel>Moneda</FormLabel>
                                                <Select
                                                    disabled={isPending}
                                                    onValueChange={field.onChange}
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Selecciona una moneda" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {Object.values(Moneda).map((moneda) => (
                                                            <SelectItem key={moneda} value={moneda}>
                                                                {moneda}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Tercera columna - Drag and drop para imagen */}
                            <div className="flex flex-col w-full sm:w-1/3 space-y-4 items-center justify-center">
                                <div
                                    onDrop={handleImageDrop}
                                    onDragOver={handleDragOver}
                                    onClick={handleImageClick}
                                    className="w-full h-48 mt-6 border-2 border-dashed border-gray-400 flex items-center justify-center cursor-pointer relative"
                                >
                                    {imagePreview ? (
                                        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                                            <Image
                                                src={imagePreview}
                                                alt="Vista previa"
                                                layout="intrinsic"
                                                width={170} // Tamaño máximo permitido
                                                height={100} // Tamaño máximo permitido
                                                objectFit="contain"
                                            />
                                        </div>
                                    ) : (
                                        <>
                                        <p className="text-center w-4/5">Arrastra y suelta una imagen o haz clic para seleccionar una imagen</p>
                                        </>
                                    )}
                                    <input
                                        id="fileInput"
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>
                                {image && (
                                    <>
                                    <p>{image.name}</p>
                                    </>
                                )}
                                <Button
                                        onClick={() => {
                                            setImage(null);
                                            setImagePreview(null);
                                        }}
                                        disabled={image ? false : true}
                                        className="mt-2"
                                    >
                                        Eliminar Imagen
                                </Button>
                            </div>
                        </div>

                        {/* Fila para ubicación */}
                        <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-4 sm:space-y-0">
                            <FormField
                                control={form.control}
                                name="almacen"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:w-1/5">
                                        <FormLabel>Almacén</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Almacén"
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="rack"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:w-1/5">
                                        <FormLabel>Rack</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Rack"
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="nivel"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:w-1/5">
                                        <FormLabel>Nivel</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Nivel"
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="fila"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:w-1/5">
                                        <FormLabel>Fila</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Fila"
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="columna"
                                render={({ field }) => (
                                    <FormItem className="w-full sm:w-1/5">
                                        <FormLabel>Columna</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                placeholder="Columna"
                                                type="number"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <Button
                            type="submit"
                            className="w-full mt-5"
                            size="lg"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <Spinner color="white" ClassName="scale-[.30]"/> Guardando...
                                </>
                                ) : 
                            ("Guardar Artículo")}       
                        </Button>
                    </form>
                </Form>
            </div>
        </CardWrapper>
    );
};

export default RegisterArticuloForm;


