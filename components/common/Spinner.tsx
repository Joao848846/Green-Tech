
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g. text-blue-500
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'text-futuristic-accent', className = '' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-4',
    lg: 'w-16 h-16 border-[6px]',
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className={`animate-spin rounded-full ${sizeClasses[size]} ${color} border-t-transparent`}
        style={{ borderTopColor: 'transparent' }} // Ensure border-t-transparent works reliably
      ></div>
    </div>
  );
};

export default Spinner;
