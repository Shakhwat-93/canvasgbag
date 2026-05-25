"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/providers/store-provider";

export function HeroSection() {
  const { settings } = useStore();
  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-4 pt-6 pb-8 sm:px-6 lg:px-8 overflow-hidden bg-white text-foreground">
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

      {/* Bento Grid */}
      <div className="grid grid-cols-5 gap-2 sm:gap-6 items-start px-0.5 sm:px-1 mt-0">
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
