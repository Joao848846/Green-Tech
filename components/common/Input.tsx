
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, name, error, icon, className = '', type = 'text', ...props }) => {
  const baseInputClasses = "w-full px-4 py-2.5 rounded-lg bg-futuristic-bg-secondary border border-futuristic-primary/30 focus:border-futuristic-primary focus:ring-1 focus:ring-futuristic-primary focus:outline-none placeholder-futuristic-text-secondary/70 transition-colors duration-200 ease-in-out shadow-sm";
  const iconPadding = icon ? "pl-10" : "";
  
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-futuristic-text-secondary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && React.isValidElement(icon) && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-futuristic-text-secondary">
            {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })}
          </div>
        )}
        <input
          id={name}
          name={name}
          type={type}
          className={`${baseInputClasses} ${iconPadding} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
