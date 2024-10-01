"use client";

import React, { useState, useMemo, useEffect, Fragment, useRef } from 'react';
import { getUsers } from '@/actions/user';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon
} from '@heroicons/react/24/outline';
import { Listbox, ListboxItem } from "@nextui-org/react";
import { Button } from '../ui/button';
import { Transition } from '@headlessui/react';
import { UpdateUserButton } from '@/components/auth/update-user-button';
import { RegisterUserButton } from './register-user-button';

import { getSocket } from "@/lib/socket"; 



const columns = [
  { uid: 'name', name: 'Nombre' },
  { uid: 'email', name: 'Correo Electrónico' },
  { uid: 'departament', name: 'Departamento' },
  { uid: 'cargo', name: 'Cargo' },
  { uid: 'estado', name: 'Estado' },
  { uid: 'acciones', name: 'Acciones' }, // Columna de acciones
];


const UsersDataTable = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['name','email', 'departament', 'cargo', 'estado', 'acciones' ]));
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isColumnsOpen, setIsColumnsOpen] = useState(false);
  const columnsMenuRef = useRef<HTMLDivElement>(null);
  const socket = getSocket();

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers || []);
    };

    fetchUsers();

    // Escuchar el evento 'user updated' del servidor
    socket.on("user updated", (updatedUser) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === updatedUser.id ? updatedUser : user
        )
      );
    });

    // Cleanup al desmontar el componente
    return () => {
      socket.off("user updated");
    };
  }, [socket]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      setUsers(fetchedUsers || []);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnsMenuRef.current && !columnsMenuRef.current.contains(event.target as Node)) {
        setIsColumnsOpen(false);
      }
    };

    if (isColumnsOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColumnsOpen]);

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        Object.values(user).some((val) =>
          String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [searchTerm, users]);


  const sortedUsers = useMemo(() => {
    if (sortConfig !== null) {
      return [...filteredUsers].sort((a, b) => {
        if (a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
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
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
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
  
 



  const selectedColumnsArray = useMemo(() => Array.from(selectedKeys), [selectedKeys]);

  return (
    <div className="h-full p-1 max-w-[350px] sm:max-w-screen-sm md:max-w-screen-md bg-white text-gray-800 min-w-full overflow-h-hidden">
      <div className="flex justify-between items-center mb-4">
      <div className="w-full space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
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
  <div className="flex items-center space-x-4">
          <div className="relative" ref={columnsMenuRef}>
            <Button onClick={() => setIsColumnsOpen(!isColumnsOpen)} className="h-10 p-2 text-black hover:text-white bg-gray-100 border border-gray-300 rounded">
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
                  onSelectionChange={handleColumnsChange}
                >
                  {columns.map((column) => (
                    <ListboxItem key={column.uid}>{column.name}</ListboxItem>
                  ))}
                </Listbox>
              </div>
            </Transition>
          </div>
          <RegisterUserButton>
            <div className="p-2 bg-blue-600 hover:bg-blue-700 text-white hover:text-gray-100 rounded">+ User</div>
          </RegisterUserButton>
          
          <div>
            Ver:
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="ml-2 p-2 bg-gray-100 border border-gray-300 rounded"
            >
              {[5, 10, 15].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        </div>
  </div>
        
      </div>
      </div>

      <div className="w-full p-2 rounded-lg shadow shadow-black/25 overflow-x-auto">
      <table className="min-w-full table-auto bg-white">
        <thead className="border-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">
              <input
                type="checkbox"
                className="mr-2"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRows(users.map((user) => user.id));
                  } else {
                    setSelectedRows([]);
                  }
                }}
                checked={selectedRows.length === users.length}
              />
            </th>
            {columns
              .filter((column) => selectedColumnsArray.includes(column.uid))
              .map((column) => (
                <th
                  key={column.uid}
                  className="py-2 px-4 cursor-pointer text-left text-sm text-black/50 hover:text-black/35"
                  onClick={() => handleSort(column.uid)}
                >
                  {column.name}
                  {sortConfig && sortConfig.key === column.uid ? (
                    sortConfig.direction === 'ascending' ? (
                      <span className="ml-1">▲</span>
                    ) : (
                      <span className="ml-1">▼</span>
                    )
                  ) : (
                    ''
                  )}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <tr
                key={user.id}
                className={`text-left ${
                  selectedRows.includes(user.id) ? 'bg-gray-100' : 'border-t border-t-gray-200'
                }`}
                onClick={() => handleRowSelect(user.id)}
              >
                <td className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(user.id)}
                    onChange={() => handleRowSelect(user.id)}
                    className="mr-2"
                  />
                </td>
                {selectedColumnsArray.includes('id') && <td className="py-2 px-4">{user.id}</td>}
                {selectedColumnsArray.includes('name') && (
                  <td className="py-2 px-4 flex items-center space-x-4">
                    {user.image && (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <span>{user.name}</span>
                  </td>
                )}
                {selectedColumnsArray.includes('email') && <td className="py-2 px-4">{user.email}</td>}
                {selectedColumnsArray.includes('departament') && <td className="py-2 px-4">{user.departament}</td>}
                {selectedColumnsArray.includes('cargo') && <td className="py-2 px-4">{user.cargo}</td>}
                {selectedColumnsArray.includes('estado') && (
                  <td className="py-2 px-4">
                    {user.estado ? (
                        <div className='h-6 w-16 px-1 bg-green-200 text-sm text-green-500 text-center rounded-2xl border border-green-500'>Activo</div>
                      ) : (
                        <div className='h-6 w-16 px-1 bg-red-200 text-sm align-middle text-red-500 text-center rounded-xl border border-red-500'>Inactivo</div>
                      )}
                  </td>
                )}

                {selectedColumnsArray.includes('acciones') && (
                  <td className="py-2 px-4">
                    <UpdateUserButton  userId={user.id}>
                      <PencilSquareIcon className='h-5 w-5'/>
                    </UpdateUserButton>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={selectedColumnsArray.length} className="py-4 text-center">
                No se encontraron usuarios.
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
                  ? 'bg-blue-600 text-white rounded-lg shadow-md shadow-blue-400'
                  : ' border-gray-300 hover:bg-gray-200'
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

export default UsersDataTable;
