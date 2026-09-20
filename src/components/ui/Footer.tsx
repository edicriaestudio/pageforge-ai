"use client";



export interface FooterProps {
  copyrightText: string;
  links: { label: string; url: string }[];
}

export function Footer({ copyrightText, links }: FooterProps) {
  return (
    <footer className="relative w-full bg-black pt-32 pb-12 px-6 md:px-12 rounded-t-[4rem] border-t border-zinc-900 flex flex-col items-center">
      <div className="w-full max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8 mb-16">
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs text-zinc-400 uppercase tracking-widest">Todos os Sistemas Operacionais</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {links.map((link, i) => (
            <a key={i} href={link.url} className="font-mono text-sm text-zinc-500 hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>

      <div className="w-full max-w-7xl border-t border-zinc-900 pt-8 flex justify-between items-center">
        <span className="font-mono text-xs text-zinc-600">{copyrightText}</span>
        <span className="font-mono text-xs text-zinc-600">v1.0.0 — PAGEFORGE ENGINE</span>
      </div>
    </footer>
  );
}

