import React from 'react';
import { useStore } from '../../context/StoreContext';

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
  const { siteSettings } = useStore();
  const branding = siteSettings?.branding || {
    brandName: 'Ladesar',
    subName: 'Organics',
    tagline: 'Rooted in Purity',
    logoType: 'emblem',
    customLogoUrl: '',
  };

  const isLight = variant === 'light';

  const sizeClasses = {
    sm: { emblem: 'w-6 h-6', customImg: 'h-7 max-w-[120px]', title: 'text-lg tracking-[0.18em]', sub: 'text-[9px]', tagline: 'text-[8px]' },
    md: { emblem: 'w-9 h-9', customImg: 'h-10 max-w-[160px]', title: 'text-2xl tracking-[0.22em]', sub: 'text-[10px]', tagline: 'text-[9px]' },
    lg: { emblem: 'w-14 h-14', customImg: 'h-14 max-w-[220px]', title: 'text-4xl tracking-[0.24em]', sub: 'text-xs', tagline: 'text-[11px]' },
    xl: { emblem: 'w-20 h-20', customImg: 'h-20 max-w-[300px]', title: 'text-5xl tracking-[0.28em]', sub: 'text-sm', tagline: 'text-xs' },
  }[size];

  // If Admin selected Custom Image Logo
  if (branding.logoType === 'custom_image' && branding.customLogoUrl) {
    return (
      <div
        onClick={onClick}
        className={`inline-flex flex-col items-center select-none cursor-pointer group transition-transform ${className}`}
      >
        <img
          src={branding.customLogoUrl}
          alt={branding.brandName}
          className={`${sizeClasses.customImg} object-contain transition-transform duration-300 group-hover:scale-105`}
        />
        {showTagline && branding.tagline && (
          <span
            className={`font-sans tracking-[0.25em] uppercase font-medium mt-1 ${sizeClasses.tagline} ${
              isLight ? 'text-[#FAF7F2]/80' : 'text-[#2D6A4F]'
            }`}
          >
            {branding.tagline}
          </span>
        )}
      </div>
    );
  }

  // Default: Royal Vedic Sacred Lotus & Kalash Vector Emblem
  return (
    <div
      onClick={onClick}
      className={`inline-flex flex-col items-center select-none cursor-pointer group transition-transform ${className}`}
    >
      {/* Royal Botanical Lotus & Kalash Emblem */}
      <div className={`relative flex items-center justify-center ${sizeClasses.emblem} mb-1.5`}>
        <svg viewBox="0 0 120 120" className="w-full h-full drop-shadow-md transition-transform duration-300 group-hover:scale-105" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldRoyalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2D1" />
              <stop offset="25%" stopColor="#E5C158" />
              <stop offset="60%" stopColor="#C59B27" />
              <stop offset="100%" stopColor="#8A630A" />
            </linearGradient>
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2D6A4F" />
              <stop offset="100%" stopColor="#0F3823" />
            </linearGradient>
            <linearGradient id="sunAura" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Outer Sacred Sun Halo */}
          <circle cx="60" cy="60" r="54" stroke="url(#goldRoyalGrad)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.75" />
          <circle cx="60" cy="60" r="48" stroke="url(#goldRoyalGrad)" strokeWidth="1.2" opacity="0.9" />

          {/* Central Vedic Lotus Petals */}
          <path
            d="M 60,18 C 66,32 74,48 60,68 C 46,48 54,32 60,18 Z"
            fill="url(#goldRoyalGrad)"
          />

          {/* Side Lotus Petals Left & Right */}
          <path
            d="M 60,68 C 45,62 30,50 36,36 C 46,38 54,52 60,68 Z"
            fill="url(#goldRoyalGrad)"
            opacity="0.95"
          />
          <path
            d="M 60,68 C 75,62 90,50 84,36 C 74,38 66,52 60,68 Z"
            fill="url(#goldRoyalGrad)"
            opacity="0.95"
          />

          {/* Outer Flaring Petals */}
          <path
            d="M 60,72 C 40,68 22,60 25,48 C 36,48 48,60 60,72 Z"
            fill="url(#goldRoyalGrad)"
            opacity="0.8"
          />
          <path
            d="M 60,72 C 80,68 98,60 95,48 C 84,48 72,60 60,72 Z"
            fill="url(#goldRoyalGrad)"
            opacity="0.8"
          />

          {/* Base Sacred Kalash / Bilona Vessel */}
          <path
            d="M 44,74 C 44,72 76,72 76,74 C 82,82 82,94 60,98 C 38,94 38,82 44,74 Z"
            fill="url(#emeraldGrad)"
            stroke="url(#goldRoyalGrad)"
            strokeWidth="2"
          />

          {/* Kalash Band Accent */}
          <path
            d="M 43,78 C 50,81 70,81 77,78"
            stroke="url(#goldRoyalGrad)"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Central Radiant Sun Dot */}
          <circle cx="60" cy="50" r="3.5" fill="#FFF2D1" />
          <circle cx="60" cy="86" r="2.5" fill="url(#goldRoyalGrad)" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col items-center text-center">
        <span
          className={`font-serif tracking-[0.24em] font-bold uppercase transition-colors duration-200 leading-none ${sizeClasses.title} ${
            isLight ? 'text-[#FAF7F2]' : 'text-[#0F3823]'
          }`}
        >
          {branding.brandName}
        </span>

        {/* Flanked SUB-NAME bar */}
        <div className="flex items-center gap-1.5 mt-0.5 w-full justify-center">
          <div className="h-[1px] w-4 bg-[#D4AF37]" />
          <span
            className={`font-sans tracking-[0.32em] font-semibold uppercase ${sizeClasses.sub} text-[#B8860B]`}
          >
            {branding.subName}
          </span>
          <div className="h-[1px] w-4 bg-[#D4AF37]" />
        </div>

        {/* Tagline */}
        {showTagline && branding.tagline && (
          <div className="flex items-center gap-1 mt-1 text-[#0F3823]/80">
            <span className="text-[#D4AF37] text-[9px]">—</span>
            <span
              className={`font-sans tracking-[0.25em] uppercase font-medium ${sizeClasses.tagline} ${
                isLight ? 'text-[#FAF7F2]/80' : 'text-[#2D6A4F]'
              }`}
            >
              {branding.tagline}
            </span>
            <span className="text-[#D4AF37] text-[9px]">—</span>
          </div>
        )}
      </div>
    </div>
  );
};
