"use client";

import { motion } from "framer-motion";

export interface HeroProps {
  headlinePrefix: string;
  headlineMain: string;
  subheadline: string;
  ctaText: string;
  backgroundImageUrl?: string;
}

const fadeUp = {
  hidden: { y: 40, opacity: 0 },
  visible: (custom: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: custom * 0.15,
      duration: 0.8,
      ease: [0.23, 1, 0.32, 1] as [number, number, number, number], // Quintic Out
    }
  })
};

export function Hero({ headlinePrefix, headlineMain, subheadline, ctaText, backgroundImageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80" }: HeroProps) {
  return (
    <section className="relative h-[100dvh] w-full overflow-hidden flex items-end pb-24 md:pb-32 px-6 md:px-12">
      {/* Background with heavy gradient to black */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/60 to-transparent" />
      
      {/* Glassmorphism / Noise layer is applied globally by Renderer */}
      
      {/* Content - Bottom Left Third */}
      <div className="relative z-20 w-full max-w-4xl flex flex-col items-start gap-6">
        <h1 className="flex flex-col leading-[1.1]">
          <motion.span 
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="font-sans font-bold text-[clamp(1.5rem,4vw,2.5rem)] text-zinc-300 tracking-tight"
          >
            {headlinePrefix}
          </motion.span>
          <motion.span 
            custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="font-serif italic font-light text-[clamp(4rem,10vw,8rem)] text-white tracking-tighter"
          >
            {headlineMain}
          </motion.span>
        </h1>
        
        <motion.p 
          custom={3} initial="hidden" animate="visible" variants={fadeUp}
          className="font-mono text-[clamp(0.875rem,1.5vw,1rem)] text-zinc-400 max-w-lg leading-relaxed uppercase tracking-widest"
        >
          {subheadline}
        </motion.p>
        
        <motion.button 
          custom={4} initial="hidden" animate="visible" variants={fadeUp}
          className="mt-4 px-8 py-4 rounded-full bg-[var(--primary-color)] text-white font-sans font-bold text-sm tracking-wide hover:scale-105 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] backdrop-blur-xl border border-white/10"
        >
          {ctaText}
        </motion.button>
      </div>
    </section>
  );
}

