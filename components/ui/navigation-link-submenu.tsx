import Link from "next/link"

interface Props {
    children: React.ReactNode
    name: string
    isOpen: boolean
    href: string
  }
  
  const NavigationLinkSubmenu = ({ children, name, isOpen, href}: Props) => {
    return (
      <a
        href={href}
        className="flex p-2 w-ful rounded cursor-pointer stroke-[0.75] hover:stroke-neutral-800 stroke-neutral-700 text-neutral-700 hover:text-neutral-800 place-items-center gap-3 hover:bg-neutral-500/20 transition-colors duration-100"
      >
        {children}
        <p className="text-inherit truncate font-poppins overflow-clip whitespace-nowrap tracking-wide">
            <span>{name}</span>
            {isOpen ? null : <span className="text-submenu shadow after:drop-shadow-sm border border-gray-200">{name}</span>}
        </p>
      </a>
    )
  }
  
  export default NavigationLinkSubmenu;