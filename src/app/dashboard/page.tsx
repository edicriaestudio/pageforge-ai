import { listProjects } from "@/app/actions/projects";
import { Plus, ArrowRight, Activity, Globe, HardDrive } from "lucide-react";

type Project = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

export default async function Dashboard() {
  let projects: Project[] = [];
  let offlineMode = false;

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      projects = (await listProjects()) as Project[];
    } catch {
      offlineMode = true;
    }
  } else {
    offlineMode = true;
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10">
      
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-mono text-emerald-500 text-xs uppercase tracking-widest mb-2">Visão Geral do Sistema</h2>
          <h1 className="text-4xl font-bold text-white tracking-tight">Dashboard.</h1>
        </div>
        
        <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold text-sm rounded-lg hover:bg-zinc-200 transition-colors">
          <Plus size={16} />
          Novo Projeto
        </button>
      </div>

      {offlineMode && (
        <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-amber-400 text-sm font-medium">Modo Local: Conecte o Supabase para persistir projetos reais.</p>
          </div>
          <button className="text-amber-500 hover:text-amber-400 text-sm font-mono underline underline-offset-2">Configurar Agora</button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity"><Activity className="text-emerald-500" size={40} /></div>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Projetos Ativos</span>
          <span className="text-4xl font-bold text-white">{projects.length > 0 ? projects.length : '01'}</span>
        </div>
        
        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity"><Globe className="text-blue-500" size={40} /></div>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Tráfego (30d)</span>
          <span className="text-4xl font-bold text-white">0</span>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/50 p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity"><HardDrive className="text-purple-500" size={40} /></div>
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-widest">Uso de Armazenamento</span>
          <span className="text-4xl font-bold text-white">12 MB</span>
        </div>
      </div>

      {/* Lista de Projetos */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Projetos Recentes</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card Mock / Offline Demo */}
          {offlineMode && (
            <a href="/dashboard/projects/demo/editor" className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-white">
                  A
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded uppercase tracking-wider">Demo</span>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-1">Projeto Alpha</h4>
              <p className="text-sm text-zinc-400 mb-8 font-mono">/projeto-alpha</p>
              
              <div className="mt-auto flex items-center justify-between text-sm">
                <span className="text-zinc-500 font-mono text-xs">Acessado hoje</span>
                <div className="flex items-center gap-1 text-emerald-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                  Abrir <ArrowRight size={14} />
                </div>
              </div>
            </a>
          )}

          {projects.map((proj) => (
            <a key={proj.id} href={`/dashboard/projects/${proj.id}/editor`} className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-zinc-900/80 transition-all relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-start mb-6">
                <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center font-bold text-white">
                  {proj.name.charAt(0).toUpperCase()}
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-mono rounded uppercase tracking-wider">Ativo</span>
              </div>
              
              <h4 className="text-xl font-bold text-white mb-1">{proj.name}</h4>
              <p className="text-sm text-zinc-400 mb-8 font-mono">/{proj.slug}</p>
              
              <div className="mt-auto flex items-center justify-between text-sm">
                <span className="text-zinc-500 font-mono text-xs">Criado: {new Date(proj.created_at).toLocaleDateString()}</span>
                <div className="flex items-center gap-1 text-emerald-400 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all">
                  Abrir <ArrowRight size={14} />
                </div>
              </div>
            </a>
          ))}

          {/* Create New Card */}
          <button className="flex flex-col items-center justify-center gap-4 bg-transparent border-2 border-dashed border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group min-h-[240px]">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-all">
              <Plus className="text-zinc-500 group-hover:text-white transition-colors" size={24} />
            </div>
            <span className="font-bold text-zinc-400 group-hover:text-emerald-400 transition-colors">Criar Novo Projeto</span>
          </button>

        </div>
      </div>

    </div>
  );
}


