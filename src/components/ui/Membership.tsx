"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

export interface PricingTier {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular: boolean;
  ctaText: string;
}

export interface MembershipProps {
  sectionTitle: string;
  tiers: PricingTier[];
}

export function Membership({ sectionTitle, tiers }: MembershipProps) {
  return (
    <section className="relative w-full bg-zinc-950 py-32 px-6 md:px-12 flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col items-center">
        
        <h2 className="font-serif italic text-[clamp(2.5rem,5vw,4rem)] text-white mb-20 text-center">
          {sectionTitle}
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full items-center">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className={`relative flex flex-col p-8 rounded-[2rem] border transition-all ${
                tier.isPopular 
                  ? "bg-zinc-900 border-[var(--primary-color)] shadow-[0_0_30px_rgba(16,185,129,0.1)] lg:scale-105 z-10" 
                  : "bg-zinc-900/50 border-zinc-800"
              }`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-[var(--primary-color)] text-black font-sans font-bold text-xs uppercase tracking-widest rounded-full">
                  Recomendado
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-sans font-bold text-xl text-white mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-sans font-bold text-white">{tier.price}</span>
                  <span className="text-zinc-500 font-mono text-sm">{tier.period}</span>
                </div>
              </div>

              <ul className="flex flex-col gap-4 mb-10 flex-1">
                {tier.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <Check size={18} className="text-[var(--primary-color)] shrink-0 mt-0.5" />
                    <span className="font-mono text-sm text-zinc-300 leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>

              <button className={`w-full py-4 rounded-full font-bold font-sans text-sm tracking-wide transition-colors ${
                tier.isPopular 
                  ? "bg-[var(--primary-color)] text-white hover:opacity-90"
                  : "bg-zinc-800 text-white hover:bg-zinc-700"
              }`}>
                {tier.ctaText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
