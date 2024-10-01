"use client"

import { motion, useAnimationControls, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import NavigationLink from "@/components/ui/navigation-link"
import {
  Squares2X2Icon,
  Cog6ToothIcon,
  ChartPieIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline"
import { RoleGate } from "@/components/auth/role.gat"
import { UserRole } from "@prisma/client"

const containerVariants = {
  close: {
    width: "3.5rem",
    transition: {
      duration: 0.3,
    },
  },
  open: {
    width: "12rem",
    transition: {
      duration: 0.3,
    },
  },
}

const svgVariants = {
  close: {
    rotate: 360,
    transition: {
      duration: 0.5,
    },
  },
  open: {
    rotate: 180,
    transition: {
      delay: 0.2, // Añadimos un delay para la animación del ícono
      duration: 0.5,
    },
  },
}

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const containerControls = useAnimationControls()
  const svgControls = useAnimationControls()

  useEffect(() => {
    if (isOpen) {
      containerControls.start("open")
      svgControls.start("open")
    } else {
      containerControls.start("close")
      svgControls.start("close")
    }
  }, [isOpen])

  const handleOpenClose = () => {
    setIsOpen(!isOpen)
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      {/* Botón para mostrar el menú en móviles */}
      <div className={`md:hidden fixed top-2 left-2 z-50 ${isMobileMenuOpen ? "hidden" : ""}`}>
        <button
          className="p-2 text-black rounded"
          onClick={handleMobileMenuToggle}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Menú lateral para pantallas grandes */}
      <motion.nav
        variants={containerVariants}
        animate={containerControls}
        initial="close"
        className="hidden md:flex bg-neutral-900 flex-col gap-10 p-2 top-0 left-0 h-full shadow shadow-neutral-600"
      >
        <div className="flex flex-row w-full justify-between place-items-center">
          <div className="bg-gradient-to-br rounded-full">
            <img
              src="/cyroxtech-logo.png"
              alt="Logo"
              className="max-h-[1.3rem] w-auto"
            />
          </div>

          <button
            className="p-1 rounded-full flex"
            onClick={() => handleOpenClose()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1}
              stroke="currentColor"
              className="w-8 h-8 stroke-neutral-200"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={svgVariants}
                animate={svgControls}
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-1">
          <NavigationLink name="Dashboard" href="/dashboard" isOpen={isOpen}>
            <Squares2X2Icon className="stroke-inherit stroke-[0.75] min-w-6 w-6" />
          </NavigationLink>
          <NavigationLink name="Admin" href="/admin" isOpen={isOpen}>
            <ChartPieIcon className="stroke-inherit stroke-[0.75] min-w-6 w-6" />
          </NavigationLink>
          <NavigationLink name="Almacen" href="/almacen/articulos" isOpen={isOpen}>
            <ClipboardDocumentListIcon className="stroke-inherit stroke-[0.75] min-w-6 w-6" />
          </NavigationLink>
          
          <RoleGate allowedRole={UserRole.ADMIN}>
            <NavigationLink name="Configuración" href="/settings/myaccount" isOpen={isOpen}>
              <Cog6ToothIcon className="stroke-inherit stroke-[0.75] min-w-6 w-6" />
            </NavigationLink>
          </RoleGate>
        </div>
      </motion.nav>

      {/* Menú lateral para pantallas móviles */}
      <AnimatePresence>
  {isMobileMenuOpen && (
    <motion.nav
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      exit={{ x: -300 }}
      transition={{ 
        ease: "easeInOut",  // Suaviza la transición de la animación en móviles
        duration: 0.4,      // Aumenta la duración para que sea más fluido
      }}
      className="md:hidden fixed top-0 left-0 w-56 h-full bg-neutral-900 shadow-lg z-40 p-4"
    >
      <div className="flex justify-between items-center mb-8">
        <div className="bg-gradient-to-br rounded-full">
          <img
            src="/cyroxtech-logo.png"
            alt="Logo"
            className="max-h-[1.3rem] w-auto"
          />
        </div>
        <button
          className="p-1 rounded-full flex"
          onClick={() => handleMobileMenuToggle()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
            className="w-8 h-8 stroke-neutral-200 rotate-180"
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <NavigationLink name="Dashboard" href="/dashboard" isOpen={true}>
          <Squares2X2Icon className="stroke-inherit stroke-[0.75] min-w-6 w-6" />
        </NavigationLink>
        <NavigationLink name="Admin" href="/admin" isOpen={true}>
          <ChartPieIcon className="stroke-inherit stroke-[0.75] min-w-6 w-6" />
        </NavigationLink>
        <NavigationLink name="Almacen" href="/almacen/articulos" isOpen={true}>
          <ClipboardDocumentListIcon className="stroke-inherit stroke-[0.75] min-w-6 w-6" />
        </NavigationLink>

        <RoleGate allowedRole={UserRole.ADMIN}>
          <NavigationLink name="Configuración" href="/settings/myaccount" isOpen={true}>
            <Cog6ToothIcon className="stroke-inherit stroke-[0.75] min-w-6 w-6" />
          </NavigationLink>
        </RoleGate>
      </div>
    </motion.nav>
  )}
</AnimatePresence>

    </>
  )
}

export default Sidebar;
