import React from "react";
import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";

export function Footer() {
  return (
    <footer id="footer" className="relative bg-[#F8F9FB] text-slate-600 border-t border-slate-200/80 pt-10 sm:pt-16 pb-0 overflow-hidden font-poppins">
      
      {/* Decorative top border glow - dynamically matches theme */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[1.5px]"
        style={{
          background: "linear-gradient(to right, transparent 0%, var(--primary) 50%, transparent 100%)",
          opacity: 0.5
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] gap-x-8 gap-y-8 pb-10 sm:pb-16">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-4 col-span-2 lg:col-span-1">
            <Link to="/" className="inline-block text-2xl font-black tracking-wider text-slate-900 uppercase font-outfit hover:text-[var(--primary)] transition-colors duration-300">
              CANVASBAG
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-slate-500">
              Premium canvas bags built for everyday movement in Bangladesh. Confident carry, minimal styling, and a frictionless COD shopping experience.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3 col-span-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Quick Link</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-500 hover:text-[var(--primary)] transition-colors flex items-center gap-1 group">
                  Home
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[var(--primary)] transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link to="/" className="text-slate-500 hover:text-[var(--primary)] transition-colors flex items-center gap-1 group">
                  Shop All
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[var(--primary)] transition-all duration-300" />
                </Link>
              </li>
              <li>
                <a href="tel:01942212267" className="text-slate-500 hover:text-[var(--primary)] transition-colors flex items-center gap-1 group">
                  Contact Us
                  <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[var(--primary)] transition-all duration-300" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Shop Categories */}
          <div className="space-y-3 col-span-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Categories</h4>
            <ul className="space-y-2.5 text-sm text-slate-500">
              <li>
                <Link to="/" className="hover:text-[var(--primary)] transition-colors duration-300">Travel Duffels</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[var(--primary)] transition-colors duration-300">Tactical Backpacks</Link>
              </li>
              <li>
                <Link to="/" className="hover:text-[var(--primary)] transition-colors duration-300">Gym Bags</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials & Support */}
          <div className="space-y-4 col-span-2 lg:col-span-1">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Social & Support</h4>
            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 text-sm">
              <a
                href="https://www.facebook.com/canvas.bangladesh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center sm:justify-start gap-3 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-[var(--primary)] text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all duration-300 w-full lg:max-w-[220px] font-medium"
              >
                <svg className="h-4 w-4 fill-current text-[#1877F2] shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="truncate">canvas.bangladesh</span>
              </a>

              <a
                href="tel:01942212267"
                className="flex items-center justify-center sm:justify-start gap-3 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-[var(--primary)] text-slate-700 hover:text-slate-900 px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all duration-300 w-full lg:max-w-[220px] font-medium"
              >
                <Phone className="h-4 w-4 text-[var(--primary)] shrink-0" />
                <span className="font-semibold text-slate-800 truncate">01942-212267</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="border-t border-slate-200/60 py-5 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 relative z-20">
          <p>© 2026 CanvasBag. All rights reserved.</p>
          <p className="flex items-center gap-1.5 text-slate-400">
            Built by{" "}
            <a 
              href="https://shakhwatrasel.vercel.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-[var(--primary)] hover:underline transition-colors font-medium"
            >
              Shakhwat Hossain Rasel
            </a>
          </p>
        </div>

      </div>

      {/* Massive Watermark Centerpiece - dynamically matches active theme color over light bg */}
      <div className="relative w-full overflow-hidden select-none pointer-events-none h-14 sm:h-32 md:h-40 lg:h-48 mt-2 sm:mt-8 flex items-end justify-center">
        <h2 
          className="text-[14vw] font-black tracking-[0.18em] text-center leading-none uppercase select-none translate-y-2 sm:translate-y-4"
          style={{
            backgroundImage: "linear-gradient(to bottom, var(--primary) 0%, var(--primary) 40%, rgba(248, 249, 251, 0) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            opacity: 0.22
          }}
        >
          CANVASBAG
        </h2>
      </div>

    </footer>
  );
}
