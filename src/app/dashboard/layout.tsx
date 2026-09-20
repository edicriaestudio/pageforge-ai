"use client";

import Link from "next/link";
import { LayoutDashboard, FolderKanban, Settings, Zap, LogOut, ChevronLeft, ChevronRight, LayoutTemplate, Blocks, Image as ImageIcon, TerminalSquare } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  
  return (
    <div className="flex h-screen bg-[#050505] text-zinc-300 selection:bg-lime-500/30 overflow-hidden font-sans">
      
      {/* Sidebar Luxuosa */}
      <aside className={`${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-64 opacity-100'} border-r border-zinc-900 bg-black flex flex-col relative z-20 transition-all duration-300 ease-in-out shrink-0`}>
        
        <div className="absolute top-0 left-0 w-full h-32 bg-lime-900/10 blur-[50px] pointer-events-none" />

        <div className="p-6 pb-8 border-b border-zinc-900/50 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center shrink-0">
            <Zap size={16} className="text-lime-500" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-white whitespace-nowrap">PAGEFORGE.</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <span className="px-4 text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2 mt-2 block whitespace-nowrap">Menu Principal</span>
          
          <Link href="/dashboard" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${pathname === '/dashboard' ? 'bg-zinc-900/50 text-lime-400 border border-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}>
            <LayoutDashboard size={18} className="shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">Visão Geral</span>
          </Link>
          
          <Link href="/dashboard/projects" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${pathname.includes('/projects') ? 'bg-zinc-900/50 text-lime-400 border border-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}>
            <FolderKanban size={18} className="shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">Meus Projetos</span>
          </Link>

          <span className="px-4 text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2 mt-6 block whitespace-nowrap">Engine Visual</span>

          <Link href="/dashboard/templates" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${pathname.includes('/templates') ? 'bg-zinc-900/50 text-lime-400 border border-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}>
            <LayoutTemplate size={18} className="shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">Templates</span>
          </Link>

          <Link href="/dashboard/assets" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${pathname.includes('/assets') ? 'bg-zinc-900/50 text-lime-400 border border-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}>
            <Blocks size={18} className="shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">Assets UI</span>
          </Link>

                    <Link href="/dashboard/references" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${pathname.includes('/references') ? 'bg-zinc-900/50 text-lime-400 border border-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}>
            <ImageIcon size={18} className="shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">Referências (Visão)</span>
          </Link>

          <Link href="/dashboard/prompts" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${pathname.includes('/prompts') ? 'bg-zinc-900/50 text-lime-400 border border-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}>
            <TerminalSquare size={18} className="shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">Prompts</span>
          </Link>

          <span className="px-4 text-[10px] font-mono uppercase tracking-widest text-zinc-600 mb-2 mt-6 block whitespace-nowrap">Sistema</span>

          <Link href="/dashboard/settings" className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${pathname.includes('/settings') ? 'bg-zinc-900/50 text-lime-400 border border-zinc-800/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/50'}`}>
            <Settings size={18} className="shrink-0" />
            <span className="font-medium text-sm whitespace-nowrap">Configurações</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-zinc-900/50 shrink-0 whitespace-nowrap">
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/30 border border-zinc-800/30 hover:border-zinc-700/50 transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-mono text-xs text-white shrink-0">ME</div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-white">Meu Workspace</span>
                <span className="text-[10px] font-mono text-zinc-500">PRO PLAN</span>
              </div>
            </div>
            <LogOut size={14} className="text-zinc-600 group-hover:text-red-400 transition-colors shrink-0" />
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col relative overflow-y-auto bg-black">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-50 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white rounded-r-xl py-4 px-1 shadow-2xl transition-all"
          title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime-900/5 blur-[100px] pointer-events-none rounded-full" />
        <div className="flex-1 p-8 md:p-12 z-10 min-w-0">
          {children}
        </div>
      </main>
    </div>
  );
}


