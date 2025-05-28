
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  const baseStyle = "font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 ease-in-out transform active:scale-95 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    primary: 'bg-futuristic-primary hover:bg-futuristic-primary/80 text-futuristic-bg-secondary focus:ring-futuristic-accent',
    secondary: 'bg-futuristic-bg-secondary hover:bg-futuristic-bg-secondary/80 text-futuristic-text border border-futuristic-primary/50 focus:ring-futuristic-primary',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-futuristic-bg-secondary/50 text-futuristic-primary focus:ring-futuristic-primary',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-7 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className="w-5 h-5">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && !isLoading && <span className="w-5 h-5">{rightIcon}</span>}
    </button>
  );
};

export default Button;
