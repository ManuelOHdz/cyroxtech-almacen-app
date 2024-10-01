"use client"

import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="flex items-center justify-center min-h-full">
      <div className="text-center">
        {/* Imagen superior */}
        <div className="flex mb-8 justify-center">
          <Image unoptimized src="/programming.gif" alt="Programando" width={400} height={300} />
        </div>

        {/* Texto "COMING SOON!" */}
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-yellow-500">
        ¡PRÓXIMAMENTE!
        </h1>

        {/* Subtexto */}
        <p className="text-gray-600 mt-4">
          Estamos trabajando arduamente en esta página.
          <br />
          ¡Te notificaremos cuando esté listo!
        </p>
      </div>
    </div>
  );
}
