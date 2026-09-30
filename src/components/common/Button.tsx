import React from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Icon } from './Icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'solid' | 'outline' | 'champagne';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
  icon?: any;
  iconPosition?: 'left' | 'right';
  asLink?: boolean;
  href?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'solid',
  size = 'md',
  isLoading = false,
  children,
  icon,
  iconPosition = 'right',
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs tracking-wider uppercase',
    md: 'px-6 py-3 text-sm tracking-wider uppercase',
    lg: 'px-8 py-4 text-base tracking-wider uppercase',
  }[size];

  // Variantes avec balayage 400ms fluide
  const variantClasses = {
    // Plein : fond argent-200, texte nuit-800
    solid:
      'bg-[#E8ECEF] text-[#0B1B33] border border-[#E8ECEF] hover:bg-transparent hover:text-[#E8ECEF]',
    // Contour : 1px argent, texte argent-200, fond transparent
    outline:
      'bg-transparent text-[#E8ECEF] border border-[rgba(199,204,209,0.35)] hover:bg-[#E8ECEF] hover:text-[#0B1B33]',
    // Champagne : accent champagne
    champagne:
      'bg-[#D9C2A3] text-[#060F1F] border border-[#D9C2A3] hover:bg-transparent hover:text-[#D9C2A3]',
  }[variant];

  return (
    <button
      className={`
        relative inline-flex items-center justify-center font-medium font-sans
        transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9C2A3] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B1B33]
        disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
        ${sizeClasses}
        ${variantClasses}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <Icon icon={faSpinner} spin className="text-current" />
          <span>Chargement...</span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2.5">
          {icon && iconPosition === 'left' && (
            <Icon icon={icon} className="transition-transform group-hover:-translate-x-1" />
          )}
          <span>{children}</span>
          {icon && iconPosition === 'right' && (
            <Icon icon={icon} className="transition-transform group-hover:translate-x-1" />
          )}
        </span>
      )}
    </button>
  );
};
