
import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', bodyClassName = '', footer }) => {
  return (
    <div className={`bg-futuristic-bg-secondary rounded-xl shadow-2xl border border-futuristic-primary/20 overflow-hidden ${className}`}>
      {title && (
        <div className={`px-6 py-4 border-b border-futuristic-primary/20 ${titleClassName}`}>
          <h3 className="text-xl font-orbitron text-futuristic-primary">{title}</h3>
        </div>
      )}
      <div className={`p-6 ${bodyClassName}`}>
        {children}
      </div>
      {footer && (
        <div className="px-6 py-4 border-t border-futuristic-primary/20 bg-futuristic-bg-secondary/50">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
