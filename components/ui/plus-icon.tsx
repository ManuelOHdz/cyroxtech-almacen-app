import React from "react";

interface PlusIconProps {
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  [key: string]: any; // Permitir cualquier otra propiedad
}

export const PlusIcon: React.FC<PlusIconProps> = ({
  size = 24,
  width,
  height,
  className,
  ...props
}) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    className={className}
    {...props}
  >
    <g
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
    >
      <path d="M6 12h12" />
      <path d="M12 18V6" />
    </g>
  </svg>
);
