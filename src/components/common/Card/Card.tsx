import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const Card = ({ children, className = '', onClick, ...props }: CardProps) => {
  const baseStyle = 'rounded-2xl border border-gray-200 bg-white p-4 shadow-sm';
  const clickableStyle = onClick ? 'cursor-pointer transition-shadow hover:shadow-md' : '';

  return (
    <div className={`${baseStyle} ${clickableStyle} ${className}`} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

export default Card;
