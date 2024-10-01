"use client";

import * as z from "zod";
import { useState, useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { UpdateArticuloSchema } from "@/schemas";
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

import {Spinner} from "@/components/ui/spinner";
import { getAllCategorias } from "@/actions/categoria";
import { getAllMarcas } from "@/actions/marca";
import { getAllProveedores } from "@/actions/proveedor";
import { updateArticulo, getArticuloDataById } from "@/actions/articulo";

// Enums para Moneda y Estado
import { Moneda, Estado } from "@prisma/client";

export const UpdateArticuloForm = ({ articuloId }: { articuloId: string }) => {
    const [error, setError] = useState<string | undefined>("");
    const [success, setSuccess] = useState<string | undefined>("");
    const [isPending, setPending] = useState(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [categorias, setCategorias] = useState<any[]>([]);
    const [marcas, setMarcas] = useState<any[]>([]);
    const [proveedores, setProveedores] = useState<any[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const form = useForm<z.infer<typeof UpdateArticuloSchema>>({
        resolver: zodResolver(UpdateArticuloSchema),
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
            try {
                const [categorias, marcas, proveedores, articulo] = await Promise.all([
                    getAllCategorias(),
                    getAllMarcas(),
                    getAllProveedores(),
                    getArticuloDataById(articuloId),
                ]);
                setCategorias(categorias);
                setMarcas(marcas);
                setProveedores(proveedores);

                setLoading(false);

                if ("error" in articulo) {
                  setError(articulo.error);
                  return;
              }
              
              // Si no hay error, restablecer los valores del formulario
              form.reset({
                  name: articulo.name,
                  stock: articulo.stock?.toString(),
                  min_stock: articulo.min_stock?.toString(),
                  max_stock: articulo.max_stock?.toString(),
                  precio: articulo.precio?.toString(),
                  moneda: articulo.moneda,
                  categoria: articulo.categoria,
                  marca: articulo.marca,
                  proveedor: articulo.proveedor,
                  almacen: articulo.almacen,
                  rack: articulo.rack,
                  nivel: articulo.nivel,
                  fila: articulo.fila,
                  columna: articulo.columna,
                  estado: articulo.estado,
                  no_parte: articulo.no_parte,
                  modelo: articulo.modelo || "",
              });

              setImagePreview(articulo.imagen || null);
            } catch (error) {
                setError("Error al cargar los datos del artículo");
                console.error(error);
            }
        };

        fetchData();
    }, [articuloId]);

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
            return imagePreview; // Si no hay nueva imagen, usa la existente
        }
    };

    const onSubmit = async (values: z.infer<typeof UpdateArticuloSchema>) => {
        setError('');
        setSuccess('');

        try {
            setPending(true);
            const imageUrl = await uploadImage();
            const response = await updateArticulo(values, articuloId, imageUrl)
              
            setPending(false);
            if (response.error) {
                setError(response.error);
            } else {
                setSuccess(response.success);
            }
        } catch (err) {
            setPending(false);
            setError("Error al actualizar el artículo. Inténtalo de nuevo.");
            console.error(err);
        }
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
            headerTitle={"Actualizar Artículo"}
            headerLabel="Datos del artículo"
            width="w-screen min-h-screen max-h-screen sm:max-w-[900px] sm:min-h-[580px] sm:max-h-[850px] sm:overflow-hidden overflow-auto"
        >
            {loading ? (
                <div className="flex w-full h-[580px] justify-center items-center">
                    <Spinner color="black"/>
                </div>
            ) : (
                <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                        {/* Primera columna */}
                        <div className="flex flex-col w-full sm:w-1/3 space-y-4">
                            {/* Nombre */}
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
                            {/* No. Parte */}
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
                            {/* Stock */}
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
                                {/* Stock Mínimo */}
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
                                {/* Stock Máximo */}
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
                            {/* Estado */}
                            <FormField
                                control={form.control}
                                name="estado"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Estado</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            value={field.value}
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
                            {/* Modelo */}
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
                            {/* Categoría */}
                            <FormField
                                control={form.control}
                                name="categoria"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoría</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            value={field.value} // Aseguramos que el valor seleccionado sea el ID
                                             // Esto selecciona el ID predeterminado de la categoría del artículo
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona una categoría" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categorias.map((categoria) => (
                                                    <SelectItem key={categoria.id} value={categoria.id}>
                                                        {categoria.nombre}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Marca */}
                            <FormField
                                control={form.control}
                                name="marca"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Marca</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            value={field.value}
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
                            {/* Proveedor */}
                            <FormField
                                control={form.control}
                                name="proveedor"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Proveedor</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            value={field.value}
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
                            {/* Precio y Moneda */}
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
                                                value={field.value}
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
                                      <img
                                          src={imagePreview}
                                          alt="Vista previa"
                                          className="w-auto h-full object-contain"
                                      />
                                  </div>
                                  ) : (
                                    <p className="text-center w-4/5">Arrastra y suelta una imagen o haz clic para seleccionar una imagen</p>
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
                                <p>{image.name}</p>
                            )}
                            <Button
                                onClick={() => {
                                    setImage(null);
                                    setImagePreview(null);
                                }}
                                disabled={!image}
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
                                    <Spinner color="white" ClassName="scale-[.30]"/> Actualizando...
                                </>
                                ) : 
                            ("Actualizar Artículo")}   
                    </Button>
                </form>
            </Form> 
            )}
        </CardWrapper>
    );
};

export default UpdateArticuloForm;
