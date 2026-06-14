import React from "react";
import { Phone } from "lucide-react";

export function FloatingCallButton() {
  return (
    <a
      href="tel:01942212267"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 group cursor-pointer"
      aria-label="Call Support"
    >
      {/* Label - visible on hover or permanently on mobile */}
      <span className="hidden sm:inline-block bg-white text-slate-800 border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
        কল করুন: 01942-212267
      </span>

      {/* Button with pulsing effects */}
      <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 text-white shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.2)] hover:scale-105 active:scale-95 transition-all duration-300">
        {/* Pulsing rings */}
        <span className="absolute inset-0 rounded-full bg-slate-900/30 animate-ping opacity-75" style={{ animationDuration: "2s" }} />
        <span className="absolute inset-0 rounded-full bg-slate-900/20 animate-pulse opacity-60" style={{ animationDuration: "1.5s" }} />
        
        <Phone className="w-5 h-5 relative z-10" />
      </div>
    </a>
  );
}
