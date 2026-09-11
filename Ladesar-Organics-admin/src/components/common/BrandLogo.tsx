import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'dark' | 'light' | 'gold';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  variant = 'dark',
  showTagline = true,
  className = '',
  onClick,
}) => {
  const isLight = variant === 'light';

  const sizeClasses = {
    sm: 'h-10 sm:h-11 max-w-[150px]',
    md: 'h-14 sm:h-16 md:h-[68px] max-w-[220px]',
    lg: 'h-20 sm:h-24 max-w-[300px]',
    xl: 'h-28 sm:h-36 max-w-[400px]',
  }[size];

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center justify-center select-none cursor-pointer group transition-transform ${className}`}
    >
      {isLight ? (
        <div className="bg-white/95 hover:bg-white px-2.5 py-1 rounded-2xl shadow-xs border border-white/60 backdrop-blur-md transition-all duration-200 group-hover:scale-[1.02]">
          <img
            src="/ladesar-logo.png"
            alt="Ladesar Organics - Rooted in Purity"
            className={`${sizeClasses} object-contain transition-transform duration-300`}
            loading="eager"
          />
        </div>
      ) : (
        <img
          src="/ladesar-logo.png"
          alt="Ladesar Organics - Rooted in Purity"
          className={`${sizeClasses} object-contain transition-transform duration-300 group-hover:scale-105`}
          loading="eager"
        />
      )}
    </div>
  );
};
