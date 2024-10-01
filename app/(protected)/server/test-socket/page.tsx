"use client";

import { useCurrentUser } from "@/hooks/user-current-user";
import { useEffect, useMemo, useState } from "react";
import io from "socket.io-client";

export default function TestSocket() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ msg: string, name: string }[]>([]);
  const user = useCurrentUser(); // Obtener los datos del usuario actual

  const name = user?.name || "Usuario Desconocido"; // Nombre del usuario

  // Memoriza la conexión del socket
  const socket = useMemo(() => io("http://localhost:4000"), []);

  useEffect(() => {
    console.log('consultando datos en bd')
    // Escucha los mensajes entrantes del servidor
    socket.on("chat message", ({ msg, name }) => {
      setMessages((prevMessages) => [...prevMessages, { msg, name }]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [socket]);

  // Maneja el envío de mensajes
  const handleSendMessage = () => {
    if (message.trim() !== "") {
      // Enviar el mensaje junto con el nombre del usuario al servidor
      socket.emit("chat message", message, name);
      setMessage(""); // Limpiar el input
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Mini Chat</h1>
      <div className="mt-4">
        {/* Mostrar los mensajes recibidos */}
        <div className="h-64 p-2 border border-gray-300 rounded mb-4 overflow-y-scroll">
          {messages.map((messageData, index) => (
            <div key={index} className="text-gray-700 mb-2">
              <strong>{messageData.name}:</strong> {messageData.msg}
            </div>
          ))}
        </div>
        {/* Input del chat */}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="p-2 border border-gray-300 rounded w-full mb-2"
          placeholder="Escribe tu mensaje..."
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 text-white rounded w-full"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
