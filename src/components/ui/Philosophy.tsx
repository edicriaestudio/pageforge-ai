"use client";

import { motion } from "framer-motion";

export interface PhilosophyProps {
  commonFocus: string;
  ourDifferential: string;
}

export function Philosophy({ commonFocus, ourDifferential }: PhilosophyProps) {
  return (
    <section className="relative w-full min-h-[80vh] py-32 px-6 md:px-12 bg-zinc-950 flex flex-col items-center justify-center overflow-hidden">
      {/* Background layer for subtle parallax */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80')] bg-cover bg-fixed bg-center mix-blend-overlay" />
      
      <div className="relative z-10 w-full max-w-5xl flex flex-col gap-12 text-center md:text-left">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col gap-2"
        >
          <span className="font-mono text-sm text-zinc-500 uppercase tracking-widest">A maioria foca em:</span>
          <p className="font-sans font-medium text-[clamp(1.5rem,3vw,2.5rem)] text-zinc-400">
            {commonFocus}
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="flex flex-col gap-4"
        >
          <span className="font-mono text-sm text-[var(--primary-color)] uppercase tracking-widest">Nós focamos em:</span>
          <p className="font-serif italic text-[clamp(2.5rem,6vw,5rem)] text-white leading-[1.1] tracking-tighter">
            {ourDifferential}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
