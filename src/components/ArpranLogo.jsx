import React, { useState } from 'react';

/**
 * EXACT ARPRAN LOGO COMPONENT
 * Renders the exact brand logo provided by the user (Blue 8-blade swirl emblem + ARPRAN typography).
 * - Primary: High-res transparent horizontal lockup generated from the exact uploaded image.
 * - Fallback: Original uploaded file `/logo.png`.
 */
export const ArpranLogo = ({ className = "h-11", light = false }) => {
  const [useOriginal, setUseOriginal] = useState(false);

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img 
        src={useOriginal ? "/logo.png" : (light ? "/logo-horizontal-white.png" : "/logo-horizontal.png")} 
        alt="ARPRAN Industries" 
        onError={() => setUseOriginal(true)} 
        className="h-9 sm:h-10 md:h-12 w-auto object-contain"
      />
    </div>
  );
};

export default ArpranLogo;
