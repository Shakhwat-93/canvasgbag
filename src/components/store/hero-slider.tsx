"use client";

import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-4 pt-16 pb-8 sm:px-6 lg:px-8 overflow-hidden bg-white text-foreground">
      {/* SVG Clip Path Definitions for Folder Tabs */}
      <svg className="absolute w-0 h-0" width="0" height="0">
        <defs>
          <clipPath id="folder-left" clipPathUnits="objectBoundingBox">
            <path d="M 0, 0.12 
                     C 0, 0.06, 0.05, 0, 0.1, 0 
                     L 0.42, 0 
                     C 0.45, 0, 0.48, 0.03, 0.50, 0.08 
                     L 0.54, 0.15
                     C 0.56, 0.19, 0.59, 0.22, 0.63, 0.22 
                     L 0.9, 0.22 
                     C 0.95, 0.22, 1, 0.27, 1, 0.32 
                     L 1, 0.9 
                     C 1, 0.95, 0.95, 1, 0.9, 1 
                     L 0.1, 1 
                     C 0.05, 1, 0, 0.95, 0, 0.9 
                     Z" />
          </clipPath>
          <clipPath id="folder-right" clipPathUnits="objectBoundingBox">
            <path d="M 0, 0.22
                     C 0, 0.27, 0.05, 0.22, 0.1, 0.22
                     L 0.37, 0.22
                     C 0.41, 0.22, 0.44, 0.19, 0.46, 0.15
                     L 0.50, 0.08
                     C 0.52, 0.03, 0.55, 0, 0.58, 0
                     L 0.9, 0
                     C 0.95, 0, 1, 0.05, 1, 0.1
                     L 1, 0.9
                     C 1, 0.95, 0.95, 1, 0.9, 1
                     L 0.1, 1
                     C 0.05, 1, 0, 0.95, 0, 0.9
                     Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Top Section */}
      <div className="flex flex-col gap-4 mb-4 sm:mb-6">
        {/* Row 1: Badge & Avatars on mobile viewports */}
        <div className="flex items-center justify-between w-full md:hidden">
          {/* Left: Spinning Badge / Play Button */}
          <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
            <div className="absolute inset-0 animate-spin-slow">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#121212]">
                <path
                  id="textPathMobile"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                  fill="none"
                />
                <text className="text-[7.5px] font-bold tracking-[0.12em] uppercase fill-current">
                  <textPath href="#textPathMobile" startOffset="0%">
                    • learn about us • learn about us
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-2.5 h-2.5 ml-0.5 group-hover:scale-110 transition-transform"
              >
                <polygon points="6,4 20,12 6,20" />
              </svg>
            </div>
          </div>

          {/* Right: Avatar Cluster */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex -space-x-2.5">
              <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                  alt="Fashion User"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop"
                  alt="Fashion User"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <div className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop"
                  alt="Fashion User"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-black text-white flex items-center justify-center text-[10px] font-bold shadow-md cursor-pointer hover:bg-black/90 transition-colors">
                +
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Headline & Desktop-only items */}
        <div className="flex items-center justify-between gap-8 w-full">
          {/* Desktop Left Badge (hidden on mobile) */}
          <div className="hidden md:flex relative w-28 h-28 items-center justify-center shrink-0">
            <div className="absolute inset-0 animate-spin-slow">
              <svg viewBox="0 0 100 100" className="w-full h-full text-[#121212]">
                <path
                  id="textPath"
                  d="M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                  fill="none"
                />
                <text className="text-[7px] font-bold tracking-[0.12em] uppercase fill-current">
                  <textPath href="#textPath" startOffset="0%">
                    • learn about us through this video • learn about us through this video
                  </textPath>
                </text>
              </svg>
            </div>
            <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer group">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 ml-0.5 group-hover:scale-110 transition-transform"
              >
                <polygon points="6,4 20,12 6,20" />
              </svg>
            </div>
          </div>

          {/* Center: Headline */}
          <div className="text-center max-w-3xl w-full">
            <h1 className="text-[1.75rem] sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.1] tracking-[-0.03em] text-[#121212]">
              Elevate Your Style With <br className="hidden sm:inline" />
              Bold Fashion
            </h1>
          </div>

          {/* Desktop Right Avatars (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <div className="flex -space-x-3.5">
              <div className="relative w-11 h-11 rounded-full border-[3px] border-white overflow-hidden bg-slate-100 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop"
                  alt="Fashion User"
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div className="relative w-11 h-11 rounded-full border-[3px] border-white overflow-hidden bg-slate-100 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=256&auto=format&fit=crop"
                  alt="Fashion User"
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div className="relative w-11 h-11 rounded-full border-[3px] border-white overflow-hidden bg-slate-100 shadow-sm">
                <Image
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=256&auto=format&fit=crop"
                  alt="Fashion User"
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              </div>
              <div className="w-11 h-11 rounded-full border-[3px] border-white bg-black text-white flex items-center justify-center text-sm font-bold shadow-md cursor-pointer hover:bg-black/90 transition-colors">
                +
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-6 items-start px-0.5 sm:px-1 mt-6">
        {/* Column 1 */}
        <div className="flex flex-col gap-2 sm:gap-6 mt-0.5 sm:mt-3">
          {/* Orange Card (Folder Tab Left) */}
          <div
            className="relative w-full aspect-[3/3.8] overflow-hidden bg-[#FF6B35] transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
            style={{ clipPath: "url(#folder-left)" }}
          >
            <Image
              src="/brand/hero_orange_model.webp"
              alt="Orange Hoodie Model"
              fill
              priority
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="20vw"
            />
          </div>
          {/* Yellow Kid Card */}
          <div
            className="relative w-full aspect-[3/2.1] rounded-lg sm:rounded-[2rem] overflow-hidden bg-[#FFB84C] transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
          >
            <Image
              src="/brand/hero_kid_model.webp"
              alt="Kid Sunglasses Model"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="20vw"
            />
          </div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col mt-1.5 sm:mt-8">
          {/* Green Card (Folder Tab Left) */}
          <div
            className="relative w-full aspect-[3/4.6] overflow-hidden bg-[#4E9F3D] transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
            style={{ clipPath: "url(#folder-left)" }}
          >
            <Image
              src="/brand/hero_green_model.webp"
              alt="Green Coat Model"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="20vw"
            />
          </div>
        </div>

        {/* Column 3 - Center */}
        <div className="flex flex-col items-center gap-2 sm:gap-6 mt-0">
          {/* Decorative Logo Icon */}
          <div className="w-6 h-6 sm:w-11 sm:h-11 flex items-center justify-center bg-transparent border border-black/10 rounded-full text-foreground/75 font-semibold text-[10px] sm:text-sm hover:rotate-45 transition-transform duration-500">
            🎛
          </div>

          {/* Center Yellow Card */}
          <div
            className="relative w-full aspect-[3/3.4] rounded-lg sm:rounded-[2rem] overflow-hidden bg-[#FFCC00] transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
          >
            <Image
              src="/brand/hero_yellow_model.webp"
              alt="Yellow Hat Model"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="20vw"
            />
          </div>

          {/* Explore Collections CTA (Desktop only inside grid) */}
          <Link href="/category/everyday-totes" className="w-full hidden lg:block">
            <button className="w-full bg-black text-white hover:bg-black/90 active:scale-95 transition-all duration-300 rounded-full py-4 px-6 font-bold text-sm flex items-center justify-center gap-2 group shadow-md">
              Explore Collections
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="w-4 h-4 text-[#86E237] group-hover:translate-x-1 transition-transform duration-300"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12,5 19,12 12,19" />
              </svg>
            </button>
          </Link>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col mt-1.5 sm:mt-8">
          {/* Blue Card (Folder Tab Left) */}
          <div
            className="relative w-full aspect-[3/4.6] overflow-hidden bg-[#3C99DC] transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
            style={{ clipPath: "url(#folder-left)" }}
          >
            <Image
              src="/brand/hero_blue_model.webp"
              alt="White Tracksuit Model"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="20vw"
            />
          </div>
        </div>

        {/* Column 5 */}
        <div className="flex flex-col gap-2 sm:gap-6 mt-0.5 sm:mt-3">
          {/* Mint Green Card (Folder Tab Right) */}
          <div
            className="relative w-full aspect-[3/3.8] overflow-hidden bg-[#88D49E] transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
            style={{ clipPath: "url(#folder-right)" }}
          >
            <Image
              src="/brand/hero_mint_model.webp"
              alt="Heart Sunglasses Model"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="20vw"
            />
          </div>
          {/* Dark Green Card */}
          <div
            className="relative w-full aspect-[3/2.1] rounded-lg sm:rounded-[2rem] overflow-hidden bg-[#1A5F35] transition-all duration-500 hover:scale-[1.02] cursor-pointer group"
          >
            <Image
              src="/brand/hero_dark_green_model.webp"
              alt="Green Suit Model"
              fill
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
              sizes="20vw"
            />
          </div>
        </div>
      </div>

      {/* Mobile-only CTA below the grid */}
      <div className="lg:hidden mt-6 px-1">
        <Link href="/category/everyday-totes" className="block w-full">
          <button className="w-full bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-all duration-300 rounded-full py-4.5 px-6 font-bold text-sm flex items-center justify-center gap-2 group shadow-md">
            Explore Collections
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-4 h-4 text-[#86E237] group-hover:translate-x-1 transition-transform duration-300"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12,5 19,12 12,19" />
            </svg>
          </button>
        </Link>
      </div>
    </section>
  );
}
