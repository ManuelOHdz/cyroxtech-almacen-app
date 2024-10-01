"use client";

import React, { useState, useMemo, useEffect, Fragment, useRef } from "react";
import { getAllMarcas } from "@/actions/marca";
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
import { UpdateMarcaButton } from "@/components/auth/update-marca-button";
import { RegisterMarcaButton } from "./register-marca-button";

import { getSocket } from "@/lib/socket";

const columns = [{ uid: "nombre", name: "Nombre" }, { uid: "acciones", name: "Acciones"}];

const MarcasDataTable = () => {
  const [marcas, setMarcas] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(["nombre", "acciones"]));
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const columnsMenuRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();

  useEffect(() => {
    const fetchMarcas = async () => {
      const fetchedMarcas = await getAllMarcas();
      setMarcas(fetchedMarcas || []);
    };

    fetchMarcas();

    // Escuchar el evento 'marca updated' del servidor
    socket.on("marca updated", (updatedMarca) => {
      setMarcas((prevMarcas) =>
        prevMarcas.map((marca) =>
          marca.id === updatedMarca.id ? updatedMarca : marca
        )
      );
    });

    // Cleanup al desmontar el componente
    return () => {
      socket.off("marca updated");
    };
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target as Node)) {
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

  const filteredMarcas = useMemo(() => {
    return marcas.filter((marca) =>
      Object.values(marca).some((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, marcas]);

  const sortedMarcas = useMemo(() => {
    if (sortConfig !== null) {
      return [...filteredMarcas].sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return filteredMarcas;
  }, [filteredMarcas, sortConfig]);

  const paginatedMarcas = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return sortedMarcas.slice(startIndex, endIndex);
  }, [currentPage, rowsPerPage, sortedMarcas]);

  const totalPages = Math.ceil(filteredMarcas.length / rowsPerPage);

  const handleSort = (key: string) => {
    let direction = "ascending";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
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
    const selectedKeys = new Set<string>(Array.from(keys as unknown as Iterable<string>));
    setSelectedKeys(selectedKeys);
  };

  const selectedColumnsArray = useMemo(() => Array.from(selectedKeys), [selectedKeys]);

  return (
    <div className="h-full p-1 max-w-[350px] sm:max-w-screen-sm md:max-w-screen-md bg-white text-gray-800 min-w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="w-full space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          {/* Buscador */}
          <div className="relative w-full md:w-auto">
            <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar marca"
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
                <div className="absolute left-0 w-56 mt-2 origin-top-right bg-white border border-gray-300 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                  <Listbox
                    aria-label="Selecciona las columnas"
                    variant="flat"
                    disallowEmptySelection
                    selectionMode="multiple"
                    selectedKeys={selectedKeys}
                    onSelectionChange={(keys) => handleColumnsChange(new Set(keys))}
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

            {/* Añadir Marca Button */}
            <RegisterMarcaButton>
              <div className="p-2 bg-blue-600 hover:bg-blue-700 text-white hover:text-gray-100 rounded">
                + Marca
              </div>
            </RegisterMarcaButton>

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
                      setSelectedRows(marcas.map((marca) => marca.id));
                    } else {
                      setSelectedRows([]);
                    }
                  }}
                  checked={selectedRows.length === marcas.length}
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
                      sortConfig.direction === "ascending" ? (
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
            {paginatedMarcas.length > 0 ? (
              paginatedMarcas.map((marca) => (
                <tr
                  key={marca.id}
                  className={`text-left text-sm ${
                    selectedRows.includes(marca.id) ? "bg-gray-100" : "border-t border-gray-200"
                  }`}
                >
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(marca.id)}
                      onChange={() => handleRowSelect(marca.id)}
                      className="mr-2"
                    />
                  </td>
                  {selectedColumnsArray.includes("nombre") && <td className="py-2 px-4">{marca.nombre}</td>}
                  {selectedColumnsArray.includes("acciones") && (
                    <td className="py-2 px-4">
                      <UpdateMarcaButton marcaId={marca.id}>
                        <PencilSquareIcon className="h-5 w-5" />
                      </UpdateMarcaButton>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={selectedColumnsArray.length + 1} className="py-4 text-center">
                  No se encontraron marcas.
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

export default MarcasDataTable;
