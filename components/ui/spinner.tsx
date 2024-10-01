import React from 'react';

interface SpinnerProps {
  children?: React.ReactNode;
  ClassName?: string;
  color?: 'white' | 'black'; // Aquí defines las opciones para el color
}

export const Spinner = ({
  children,
  ClassName = '',
  color = 'black', // Valor predeterminado
}: SpinnerProps) => {
  
  // Definir la clase de color basada en el prop `color`
  const colorClass = color === 'black' ? 'after:bg-black' : 'after:bg-white';

  return (
    <div className={`${ClassName}`}>
      <div className="lds-roller">
        <div className={`${colorClass}`}></div>
        <div className={`${colorClass}`}></div>
        <div className={`${colorClass}`}></div>
        <div className={`${colorClass}`}></div>
      </div>
    </div>
    
  );
}

