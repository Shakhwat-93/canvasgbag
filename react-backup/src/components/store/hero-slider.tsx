import { Link } from "react-router-dom";
import { useStore } from "@/components/providers/store-provider";
import { motion, Variants } from "framer-motion";

export function HeroSection() {
  const { settings } = useStore();

  // Intro Stagger Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 16,
      },
    },
  };

  return (
    <section className="relative mx-auto w-full max-w-[1440px] px-4 pt-16 sm:pt-6 pb-8 sm:px-6 lg:px-8 overflow-hidden bg-white text-foreground">
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

      {/* Optimized Mobile 2x2 Bento Grid (Visible only on mobile below sm, when enabled) */}
      {settings.heroMobileFourCards && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3.5 sm:hidden mt-1.5 px-0.5"
        >
          {/* Card 1: Orange Hoodie */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full aspect-[3/4.2] rounded-2xl overflow-hidden bg-[#FF6B35] shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100/50"
          >
            <motion.img
              src={settings.heroImage1 || "/brand/hero_orange_model.webp"}
              alt="Orange Hoodie Model"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>

          {/* Card 2: Green Coat */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full aspect-[3/4.2] rounded-2xl overflow-hidden bg-[#4E9F3D] shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100/50"
          >
            <motion.img
              src={settings.heroImage3 || "/brand/hero_green_model.webp"}
              alt="Green Coat Model"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>

          {/* Card 3: Crossbody Bag (Yellow Hat) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full aspect-[3/4.2] rounded-2xl overflow-hidden bg-[#FFCC00] shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100/50"
          >
            <motion.img
              src={settings.heroImage4 || "/brand/hero_yellow_model.webp"}
              alt="Yellow Hat Model"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>

          {/* Card 4: Heart Sunglasses (Mint Green) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full aspect-[3/4.2] rounded-2xl overflow-hidden bg-[#88D49E] shadow-[0_4px_12px_rgba(0,0,0,0.03)] border border-slate-100/50"
          >
            <motion.img
              src={settings.heroImage6 || "/brand/hero_mint_model.webp"}
              alt="Heart Sunglasses Model"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Bento Grid Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className={`${settings.heroMobileFourCards ? "hidden sm:grid" : "grid"} grid-cols-5 gap-2 sm:gap-6 items-start px-0.5 sm:px-1 mt-0`}
      >
        {/* Column 1 */}
        <div className="flex flex-col gap-2 sm:gap-6 mt-0.5 sm:mt-3">
          {/* Orange Card (Folder Tab Left) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.035, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full aspect-[3/7.2] sm:aspect-[3/3.8] overflow-hidden bg-[#FF6B35] cursor-pointer group filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.04)] hover:drop-shadow-[0_16px_24px_rgba(0,0,0,0.08)] transition-shadow duration-500"
            style={{ clipPath: "url(#folder-left)" }}
          >
            <motion.img
              src={settings.heroImage1 || "/brand/hero_orange_model.webp"}
              alt="Orange Hoodie Model"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>

          {/* Yellow Kid Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.035, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full aspect-[3/4.5] sm:aspect-[3/2.1] rounded-lg sm:rounded-[2rem] overflow-hidden bg-[#FFB84C] cursor-pointer group shadow-sm hover:shadow-[0_20px_35px_rgba(0,0,0,0.06)] border border-slate-100/50 transition-shadow duration-500"
          >
            <motion.img
              src={settings.heroImage2 || "/brand/hero_kid_model.webp"}
              alt="Kid Sunglasses Model"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>
        </div>

        {/* Column 2 */}
        <div className="flex flex-col mt-1.5 sm:mt-8">
          {/* Green Card (Folder Tab Left) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.035, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full aspect-[3/8.8] sm:aspect-[3/4.6] overflow-hidden bg-[#4E9F3D] cursor-pointer group filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.04)] hover:drop-shadow-[0_16px_24px_rgba(0,0,0,0.08)] transition-shadow duration-500"
            style={{ clipPath: "url(#folder-left)" }}
          >
            <motion.img
              src={settings.heroImage3 || "/brand/hero_green_model.webp"}
              alt="Green Coat Model"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>
        </div>

        {/* Column 3 - Center */}
        <div className="flex flex-col items-center justify-end gap-2 sm:gap-6 self-stretch mt-0 pb-2">
          {/* Center Yellow Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.035, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full aspect-[3/6.8] sm:aspect-[3/3.4] rounded-lg sm:rounded-[2rem] overflow-hidden bg-[#FFCC00] cursor-pointer group shadow-sm hover:shadow-[0_20px_35px_rgba(0,0,0,0.06)] border border-slate-100/50 transition-shadow duration-500"
          >
            <motion.img
              src={settings.heroImage4 || "/brand/hero_yellow_model.webp"}
              alt="Yellow Hat Model"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>

          {/* Shop Now CTA (Desktop only inside grid) */}
          <Link to="/category/everyday-totes" className="w-full hidden lg:block">
            <motion.button
              variants={cardVariants}
              whileHover={{ scale: 1.025, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-black text-white hover:bg-black/90 active:scale-95 transition-colors duration-300 rounded-full py-4 px-6 font-bold text-sm flex items-center justify-center gap-2 group shadow-md"
            >
              Shop Now
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
            </motion.button>
          </Link>
        </div>

        {/* Column 4 */}
        <div className="flex flex-col mt-1.5 sm:mt-8">
          {/* Blue Card (Folder Tab Left) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.035, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full aspect-[3/8.8] sm:aspect-[3/4.6] overflow-hidden bg-[#3C99DC] cursor-pointer group filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.04)] hover:drop-shadow-[0_16px_24px_rgba(0,0,0,0.08)] transition-shadow duration-500"
            style={{ clipPath: "url(#folder-left)" }}
          >
            <motion.img
              src={settings.heroImage5 || "/brand/hero_blue_model.webp"}
              alt="White Tracksuit Model"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>
        </div>

        {/* Column 5 */}
        <div className="flex flex-col gap-2 sm:gap-6 mt-0.5 sm:mt-3">
          {/* Mint Green Card (Folder Tab Right) */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.035, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full aspect-[3/7.2] sm:aspect-[3/3.8] overflow-hidden bg-[#88D49E] cursor-pointer group filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.04)] hover:drop-shadow-[0_16px_24px_rgba(0,0,0,0.08)] transition-shadow duration-500"
            style={{ clipPath: "url(#folder-right)" }}
          >
            <motion.img
              src={settings.heroImage6 || "/brand/hero_mint_model.webp"}
              alt="Heart Sunglasses Model"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>

          {/* Dark Green Card */}
          <motion.div
            variants={cardVariants}
            whileHover={{ scale: 1.035, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="relative w-full aspect-[3/4.5] sm:aspect-[3/2.1] rounded-lg sm:rounded-[2rem] overflow-hidden bg-[#1A5F35] cursor-pointer group shadow-sm hover:shadow-[0_20px_35px_rgba(0,0,0,0.06)] border border-slate-100/50 transition-shadow duration-500"
          >
            <motion.img
              src={settings.heroImage7 || "/brand/hero_dark_green_model.webp"}
              alt="Green Suit Model"
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile-only CTA below the grid */}
      <div className="lg:hidden mt-6 flex justify-center w-full">
        <Link to="/category/everyday-totes" className="inline-block">
          <button className="bg-black text-white hover:bg-black/90 active:scale-[0.98] transition-all duration-300 rounded-full py-3 px-8 font-bold text-xs flex items-center justify-center gap-1.5 group shadow-md cursor-pointer">
            Shop Now
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-3.5 h-3.5 text-[#86E237] group-hover:translate-x-1 transition-transform duration-300"
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
