"use client"

import { motion, useAnimationControls, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import NavigationLink from "@/components/ui/navigation-link"
import {
  FaceSmileIcon,
  ChartBarIcon,
  ChartPieIcon,
  DocumentCheckIcon,
  Square2StackIcon,
  UsersIcon,
  KeyIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline"
import ProjectLink from "@/components/ui/project-link"
import ProjectNavigation from "@/components/ui/project-navigation"
import NavigationLinkSubmenu from "@/components/ui/navigation-link-submenu"
import { FaSmile } from "react-icons/fa"
import { RoleGate } from "@/components/auth/role.gat"
import { UserRole } from "@prisma/client"

const containerVariants = {
  close: {
    width: "3.5rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
  open: {
    width: "10rem",
    transition: {
      type: "spring",
      damping: 15,
      duration: 0.5,
    },
  },
}

const svgVariants = {
  close: {
    rotate: 360,
  },
  open: {
    rotate: 180,
  },
}

const SidebarSettings = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

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
    setSelectedProject(null)
  }

  return (
    <>
      
      <motion.nav
        variants={containerVariants}
        animate={containerControls}  
        initial="close"
        className="bg-neutral-100 flex flex-col gap-10 p-2 top-0 left-0 h-full"
      >
        <div className="flex flex-row w-full justify-between place-items-center">
          
          
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
              className="w-8 h-8 stroke-neutral-700"
            >
              <motion.path
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={svgVariants}
                animate={svgControls}
                d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
                transition={{
                  duration: 0.5,
                  ease: "easeInOut",
                }}
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-1 text-neutral-700">
          <NavigationLinkSubmenu name="Mi Cuenta" href="/settings/myaccount" isOpen={isOpen}>
            <IdentificationIcon className="stroke-inherit stroke-[0.75] min-w-6 w-6" />
          </NavigationLinkSubmenu>
          <RoleGate allowedRole={UserRole.ADMIN}>
            <NavigationLinkSubmenu name="Contraseña" href="/settings/password" isOpen={isOpen}>
              <KeyIcon className="stroke-inherit stroke-[0.75] min-w-6 w-6" />
            </NavigationLinkSubmenu>
            <NavigationLinkSubmenu name="Usuarios" href="/settings/users" isOpen={isOpen}>
              <UsersIcon className="stroke-inherit stroke-[0.75] min-w-6 w-6" />
            </NavigationLinkSubmenu>
          </RoleGate>
        </div>
       
      </motion.nav>
    </>
  )
}

export default SidebarSettings;