const express = require('express');
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",  // Permitir todas las conexiones
    credentials: true,
    methods: ["GET", "POST", "PUT"],
  },
});

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado", socket.id);

  // Escuchar cuando un usuario es actualizado
  socket.on("update user", (updatedUser) => {
    // Mostrar el valor de 'estado' para depuración
    console.log("Datos del usuario:", updatedUser);

    // Emitir los datos actualizados a todos los clientes conectados
    io.emit("user updated", updatedUser);

    // Verificar si el estado es falsy (false, 0, null, etc.)
    if (updatedUser.estado === false || updatedUser.estado === 0 || updatedUser.estado === "inactive") {
      console.log("El usuario ha sido desactivado, forzando el logout para el usuario", updatedUser.id);
      // Si el usuario ha sido desactivado, emitir un evento específico para este usuario
      io.emit("force logout", updatedUser.id);
    }
  });

  // Manejar la desconexión del cliente
  socket.on("disconnect", () => {
    console.log("Cliente desconectado", socket.id);
  });
});

// Iniciar el servidor
server.listen(4000, () => {
  console.log(`Servidor iniciado en http://localhost:4000`);
});
