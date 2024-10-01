// socket.ts (colócalo en una carpeta como /lib o /utils)
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    socket = io("http://177.17.13.177:4000", {
      reconnectionAttempts: 5, // Intentos de reconexión
      transports: ['websocket'], // Usa websocket como transporte preferido
    });
  }
  return socket;
};
