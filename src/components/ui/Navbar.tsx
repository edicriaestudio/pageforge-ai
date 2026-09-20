"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export interface NavbarProps {
  logoText: string;
  links: { label: string; url: string }[];
  ctaText: string;
}

export function Navbar({ logoText, links, ctaText }: NavbarProps) {
  const { scrollY } = useScroll();
  
  // Transformações baseadas no scroll
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(9, 9, 11, 0)", "rgba(9, 9, 11, 0.7)"] // zinc-950 transparent to glassy
  );
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(16px)"]
  );

  const borderColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]
  );

  return (
    <motion.nav
      style={{ backgroundColor, backdropFilter: backdropBlur, borderColor, borderWidth: "1px", borderStyle: "solid" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-full flex items-center gap-8 shadow-2xl transition-all"
    >
      <div className="font-sans font-bold text-white tracking-tight text-lg">
        {logoText}
      </div>

      <div className="hidden md:flex items-center gap-6">
        {links.map((link, i) => (
          <a key={i} href={link.url} className="font-mono text-xs uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            {link.label}
          </a>
        ))}
      </div>

      <button className="px-5 py-2 rounded-full bg-white text-black font-sans font-bold text-sm hover:bg-zinc-200 transition-colors">
        {ctaText}
      </button>
    </motion.nav>
  );
}
