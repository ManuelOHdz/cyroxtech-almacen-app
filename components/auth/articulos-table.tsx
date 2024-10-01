"use client";

import React, { useState, useMemo, useEffect, Fragment, useRef } from "react";
import { getAllArticulos } from "@/actions/articulo";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { Button } from "../ui/button";
import { Transition } from "@headlessui/react";
import { UpdateArticuloButton } from "@/components/auth/update-articulo-button";
import { RegisterArticuloButton } from "./register-articulo-button";

import { getSocket } from "@/lib/socket";

const columns = [
  { uid: "codigo", name: "Codigo" },
  { uid: "imagen", name: "Imagen" },
  { uid: "name", name: "Nombre" },
  { uid: "stock", name: "Stock" },
  { uid: "min_stock", name: "Stock Mínimo" },
  { uid: "max_stock", name: "Stock Máximo" },
  { uid: "categoria", name: "Categoría" },
  { uid: "marca", name: "Marca" },
  { uid: "proveedor", name: "Proveedor" },
  { uid: "modelo", name: "Modelo" },
  { uid: "no_parte", name: "No. Parte" },
  { uid: "precio", name: "Precio" },
  { uid: "moneda", name: "Moneda" },
  { uid: "estado", name: "Estado" },
  { uid: "almacen", name: "Almacen" },
  { uid: "rack", name: "Rack" },
  { uid: "nivel", name: "Nivel" },
  { uid: "fila", name: "Fila" },
  { uid: "columna", name: "Columna" },
  { uid: "acciones", name: "Acciones" },
];

const ArticulosDataTable = () => {
  const [articulos, setArticulos] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(
    new Set([
      "codigo",
      "name",
      "imagen",
      "stock",
      "min_stock",
      "categoria",
      "marca",
      "proveedor",
      "modelo",
      "no_parte",
      "precio",
      "moneda",
      "acciones",
      "estado",
      "max_stock",
    ])
  );
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const columnsMenuRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();

  useEffect(() => {
    const fetchArticulos = async () => {
      const fetchedArticulos = await getAllArticulos();
      setArticulos(fetchedArticulos || []);
    };

    fetchArticulos();

    // Escuchar el evento 'user updated' del servidor
    socket.on("articulo updated", (updatedArticulo) => {
      setArticulos((prevUsers) =>
        prevUsers.map((articulo) =>
          articulo.id === updatedArticulo.id ? updatedArticulo : articulo
        )
      );
    });

    // Cleanup al desmontar el componente
    return () => {
      socket.off("user updated");
    };
  }, [socket]);

  useEffect(() => {
    const fetchArticulos = async () => {
      const fetchedArticulos = await getAllArticulos();
      setArticulos(fetchedArticulos || []);
      console.log(fetchedArticulos);
    };

    fetchArticulos();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        columnsMenuRef.current &&
        !columnsMenuRef.current.contains(event.target as Node)
      ) {
        setIsColumnsOpen(false);
      }
    };

    if (isColumnsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isColumnsOpen]);

  const filteredUsers = useMemo(() => {
    return articulos.filter((articulo) =>
      Object.values(articulo).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, articulos]);

  const sortedUsers = useMemo(() => {
    if (sortConfig !== null) {
      return [...filteredUsers].sort((a, b) => {
        if (
          a[sortConfig.key as keyof typeof a] <
          b[sortConfig.key as keyof typeof b]
        ) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (
          a[sortConfig.key as keyof typeof a] >
          b[sortConfig.key as keyof typeof b]
        ) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredUsers;
  }, [filteredUsers, sortConfig]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedUsers.slice(startIndex, endIndex);
  }, [currentPage, rowsPerPage, sortedUsers]);

  const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleRowSelect = (id: number) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleColumnsChange = (keys: any) => {
    const selectedKeys = new Set<string>(
      Array.from(keys as unknown as Iterable<string>)
    );
    setSelectedKeys(selectedKeys);
  };

  const selectedColumnsArray = useMemo(
    () => Array.from(selectedKeys),
    [selectedKeys]
  );

  return (
    <div className="h-full p-1 max-w-[350px] sm:max-w-screen-sm md:max-w-screen-md bg-white text-gray-800 min-w-full overflow-h-hidden">
      <div className="flex justify-between items-center mb-4">
      <div className="w-full space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
  {/* Buscador */}
  <div className="relative w-full md:w-auto">
    <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    <input
      type="text"
      placeholder="Buscar articulo"
      className="pl-10 p-2 bg-gray-100 border border-gray-300 rounded w-full"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {/* Botones */}
  <div className="flex flex-wrap items-center space-x-4 justify-center md:space-y-0 mt-4 md:mt-0">
    {/* Columnas Button */}
    <div className="relative" ref={columnsMenuRef}>
      <Button
        onClick={() => setIsColumnsOpen(!isColumnsOpen)}
        className="h-10 p-2 text-black bg-gray-100 border hover:bg-gray-200 border-gray-300 rounded"
      >
        Columnas
      </Button>
      <Transition
        show={isColumnsOpen}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <div className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <Listbox
            aria-label="Selecciona las columnas"
            variant="flat"
            disallowEmptySelection
            selectionMode="multiple"
            selectedKeys={selectedKeys}
            onSelectionChange={(keys) =>
              handleColumnsChange(new Set(keys))
            }
          >
            {columns.map((column) => (
              <ListboxItem key={column.uid} textValue={column.name}>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={selectedKeys.has(column.uid)}
                    onChange={() => {}}
                  />
                  {column.name}
                </div>
              </ListboxItem>
            ))}
          </Listbox>
        </div>
      </Transition>
    </div>

    {/* Añadir Articulo Button */}
    <RegisterArticuloButton>
      <div className="p-2 bg-blue-600 hover:bg-blue-700 text-white hover:text-gray-100 rounded">
        + Articulo
      </div>
    </RegisterArticuloButton>

    {/* Selección de filas por página */}
    <div>
      Ver:
      <select
        value={rowsPerPage}
        onChange={(e) => setRowsPerPage(Number(e.target.value))}
        className="ml-2 p-2 bg-gray-100 border border-gray-300 rounded"
      >
        {[10, 15].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

      </div>

      <div className="w-full p-2 rounded-lg shadow shadow-black/25 overflow-x-auto">
      <table className="min-w-full table-auto bg-white">
    <thead className="border-b">
      <tr>
        <th className="py-2 px-4 text-left">
          <input
            type="checkbox"
            className="mr-2"
            onChange={(e) => {
              if (e.target.checked) {
                setSelectedRows(articulos.map((articulo) => articulo.id));
              } else {
                setSelectedRows([]);
              }
            }}
            checked={selectedRows.length === articulos.length}
          />
        </th>
        {columns
          .filter((column) => selectedColumnsArray.includes(column.uid))
          .map((column) => (
            <th
              key={column.uid}
              className="py-2 px-4 cursor-pointer text-left text-sm text-black/50 hover:text-black/35 w-auto"
              onClick={() => handleSort(column.uid)}
            >
              {column.name}
              {sortConfig && sortConfig.key === column.uid ? (
                sortConfig.direction === 'ascending' ? (
                  <span className="ml-1">▲</span>
                ) : (
                  <span className="ml-1">▼</span>
                )
              ) : null}
            </th>
          ))}
      </tr>
    </thead>
    <tbody>
      {paginatedUsers.length > 0 ? (
        paginatedUsers.map((articulo) => (
          <tr
            key={articulo.id}
            className={`text-left text-sm ${
              selectedRows.includes(articulo.id) ? 'bg-gray-100' : 'border-t border-gray-200'
            }`}
          >
            <td className="px-4 py-2">
              <input
                type="checkbox"
                checked={selectedRows.includes(articulo.id)}
                onChange={() => handleRowSelect(articulo.id)}
                className="mr-2"
              />
            </td>
            {selectedColumnsArray.includes('codigo') && <td className="py-2 px-4">{articulo.codigo}</td>}
            {selectedColumnsArray.includes('imagen') && (
              <td className="py-2 px-4">
                {articulo.imagen ? (
                  <img src={articulo.imagen} alt={articulo.name} className="w-10 h-10 rounded-sm" />
                ) : (
                  <span>Sin Imagen</span>
                )}
              </td>
            )}
            {selectedColumnsArray.includes('name') && <td className="py-2 px-4">{articulo.name}</td>}
            {selectedColumnsArray.includes('stock') && <td className="py-2 px-4">{articulo.stock}</td>}
            {selectedColumnsArray.includes('min_stock') && <td className="py-2 px-4">{articulo.min_stock}</td>}
            {selectedColumnsArray.includes('max_stock') && <td className="py-2 px-4">{articulo.max_stock}</td>}
            {selectedColumnsArray.includes('categoria') && <td className="py-2 px-4">{articulo.categoria.nombre}</td>}
            {selectedColumnsArray.includes('marca') && <td className="py-2 px-4">{articulo.marca.nombre}</td>}
            {selectedColumnsArray.includes('proveedor') && <td className="py-2 px-4">{articulo.proveedor.nombre}</td>}
            {selectedColumnsArray.includes('modelo') && <td className="py-2 px-4">{articulo.modelo}</td>}
            {selectedColumnsArray.includes('no_parte') && <td className="py-2 px-4">{articulo.no_parte}</td>}
            {selectedColumnsArray.includes('precio') && <td className="py-2 px-4">{articulo.precio}</td>}
            {selectedColumnsArray.includes('moneda') && <td className="py-2 px-4">{articulo.moneda}</td>}
            {selectedColumnsArray.includes('estado') && <td className="py-2 px-4">{articulo.estado}</td>}
            {selectedColumnsArray.includes('almacen') && <td className="py-2 px-4">{articulo.almacen}</td>}
            {selectedColumnsArray.includes('rack') && <td className="py-2 px-4">{articulo.rack}</td>}
            {selectedColumnsArray.includes('nivel') && <td className="py-2 px-4">{articulo.nivel}</td>}
            {selectedColumnsArray.includes('fila') && <td className="py-2 px-4">{articulo.fila}</td>}
            {selectedColumnsArray.includes('columna') && <td className="py-2 px-4">{articulo.columna}</td>}
            {selectedColumnsArray.includes('acciones') && (
              <td className="py-2 px-4">
                <UpdateArticuloButton articuloId={articulo.id}>
                  <PencilSquareIcon className='h-5 w-5'/>
                </UpdateArticuloButton>
              </td>
            )}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={selectedColumnsArray.length} className="py-4 text-center">
            No se encontraron artículos.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>


      <div className="flex justify-center items-center mt-4">
        <div className="flex items-center bg-gray-100/50 rounded-lg shadow shadow-black/20">
          <button
            className="p-2 rounded-l-lg border-x-gray-200 hover:bg-gray-200"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
          >
            <ChevronDoubleLeftIcon className="h-5 w-5" />
          </button>
          <button
            className="p-2 border-x-gray-200"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
            <button
              key={number}
              className={`min-w-10 p-2 text-center ${
                number === currentPage
                  ? "bg-blue-600 text-white rounded-lg shadow-md shadow-blue-400"
                  : " border-gray-300 hover:bg-gray-200"
              }`}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </button>
          ))}
          <button
            className="p-2 rounded"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
          <button
            className="p-2 rounded-r-lg border-x-gray-200 hover:bg-gray-200"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
          >
            <ChevronDoubleRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArticulosDataTable;
