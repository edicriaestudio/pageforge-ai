"use client";

import { motion } from "framer-motion";

export interface ProtocolStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface ProtocolProps {
  sectionTitle: string;
  steps: ProtocolStep[];
}

export function Protocol({ sectionTitle, steps }: ProtocolProps) {
  return (
    <section className="relative w-full bg-black py-32 px-6 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-5xl mb-24 text-center">
        <h2 className="font-serif italic text-[clamp(2.5rem,5vw,4rem)] text-white">
          {sectionTitle}
        </h2>
      </div>

      <div className="w-full max-w-4xl flex flex-col gap-12 relative">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            // Efeito Sticky
            className="sticky top-24 w-full min-h-[300px] bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col justify-between"
            style={{ zIndex: index * 10 }} // Empilha por cima
          >
            <div className="flex justify-between items-start mb-8">
              <span className="font-mono text-5xl md:text-7xl text-[var(--primary-color)] opacity-50">
                {step.number}
              </span>
              <div className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            
            <div>
              <h3 className="font-sans font-bold text-3xl md:text-5xl text-white mb-4 tracking-tight">
                {step.title}
              </h3>
              <p className="font-mono text-sm md:text-base text-zinc-400 max-w-2xl leading-relaxed">
                {step.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
