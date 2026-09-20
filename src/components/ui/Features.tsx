"use client";

import { motion } from "framer-motion";
import { Terminal, Activity, Calendar } from "lucide-react";

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  type: "telemetry" | "diagnostic" | "scheduler" | string;
}

export interface FeaturesProps {
  sectionTitle: string;
  items: FeatureItem[];
}

export function Features({ sectionTitle, items }: FeaturesProps) {
  return (
    <section className="relative w-full py-32 px-6 md:px-12 bg-zinc-950 flex flex-col items-center">
      <div className="w-full max-w-7xl">
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
          className="font-serif italic text-[clamp(2.5rem,5vw,4rem)] text-white mb-16 max-w-2xl"
        >
          {sectionTitle}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.15, duration: 0.8, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }}
              className="group relative flex flex-col justify-between h-[400px] p-8 rounded-3xl bg-zinc-900/30 backdrop-blur-[15px] border border-white/10 hover:border-white/20 transition-colors"
            >
              {/* Glassmorphism gradient effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10 flex flex-col gap-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-zinc-800/50 border border-white/5 text-[var(--primary-color)]">
                  {item.type === 'telemetry' && <Terminal size={20} />}
                  {item.type === 'diagnostic' && <Activity size={20} />}
                  {item.type === 'scheduler' && <Calendar size={20} />}
                  {!['telemetry', 'diagnostic', 'scheduler'].includes(item.type) && <Activity size={20} />}
                </div>
                <h3 className="font-sans font-bold text-xl text-white tracking-tight">{item.title}</h3>
                <p className="font-mono text-sm text-zinc-400 leading-relaxed">{item.description}</p>
              </div>

              {/* Decorative Micro-UI element based on type */}
              <div className="relative z-10 mt-auto pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 font-mono text-xs text-zinc-600 uppercase">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Status: Operacional
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

