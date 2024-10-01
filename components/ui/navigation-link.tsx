import Link from "next/link"

interface Props {
    children: React.ReactNode
    name: string
    isOpen: boolean
    href: string
  }
  
  const NavigationLink = ({ children, name, isOpen, href}: Props) => {
    return (
      <a
        href={href}
        className="flex p-2 w-ful rounded cursor-pointer stroke-[0.75] hover:stroke-neutral-100 stroke-neutral-400 text-neutral-400 hover:text-neutral-100 place-items-center gap-3 hover:bg-neutral-700/30 transition-colors duration-100"
      >
        {children}
        <p className="text-inherit truncate font-poppins overflow-clip whitespace-nowrap tracking-wide">
            <span>{name}</span>
            {isOpen ? null : <span className="text">{name}</span>}
        </p>
      </a>
    )
  }
  
  export default NavigationLink