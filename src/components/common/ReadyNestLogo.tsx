import React from 'react';

interface ReadyNestLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  showText?: boolean;
  variant?: 'full' | 'icon' | 'text-only';
  lightText?: boolean;
}

export const ReadyNestLogo: React.FC<ReadyNestLogoProps> = ({
  size = 'md',
  className = '',
  showText = false,
  variant = 'icon',
  lightText = false
}) => {
  let pixelSize = 36;
  if (typeof size === 'number') {
    pixelSize = size;
  } else if (size === 'sm') {
    pixelSize = 24;
  } else if (size === 'md') {
    pixelSize = 36;
  } else if (size === 'lg') {
    pixelSize = 48;
  } else if (size === 'xl') {
    pixelSize = 64;
  }

  // Pure SVG icon matching ReadyNest Messenger design
  const IconSVG = (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="flex-shrink-0"
    >
      {/* Speech Bubble (Vibrant Emerald/Teal) */}
      <path
        d="M 36 20 
           H 80 
           A 16 16 0 0 1 96 36 
           V 54 
           A 16 16 0 0 1 80 70 
           H 54 
           L 36 84 
           V 70 
           A 16 16 0 0 1 20 54 
           V 36 
           A 16 16 0 0 1 36 20 Z"
        fill="#009983"
      />

      {/* Inner Speech Dot / Silhouette */}
      <path
        d="M 60 38 
           A 7 7 0 0 1 67 45 
           V 47 
           A 7 7 0 0 1 60 54 
           H 54 
           L 48 58 
           V 54 
           A 7 7 0 0 1 43 47 
           V 45 
           A 7 7 0 0 1 50 38 Z"
        fill="#2D3132"
      />

      {/* Nest Basket Woven Strokes (Dark Charcoal) */}
      <g stroke="#2D3132" strokeWidth="5.5" strokeLinecap="round" fill="none">
        {/* Main outer nest rim */}
        <path d="M 16 58 C 16 98, 104 98, 104 58" />
        {/* Second weave layer */}
        <path d="M 22 66 C 26 102, 94 102, 98 66" />
        {/* Diagonal crossover weave 1 */}
        <path d="M 20 62 Q 60 94, 100 70" />
        {/* Diagonal crossover weave 2 */}
        <path d="M 100 62 Q 60 94, 20 70" />
        {/* Nest bottom base support */}
        <path d="M 34 80 Q 60 106, 86 80" />
      </g>
    </svg>
  );

  if (variant === 'icon' && !showText) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{IconSVG}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {variant !== 'text-only' && IconSVG}

      {(showText || variant === 'full' || variant === 'text-only') && (
        <div className="flex flex-col text-left leading-none font-sans">
          <span
            className={`font-black tracking-wider uppercase text-slate-900 dark:text-white`}
            style={{ fontSize: `${pixelSize * 0.42}px` }}
          >
            READY NEST
          </span>
          <span
            className="font-extrabold tracking-widest uppercase text-[#009983]"
            style={{ fontSize: `${pixelSize * 0.40}px`, marginTop: '2px' }}
          >
            MESSENGER
          </span>
        </div>
      )}
    </div>
  );
};
