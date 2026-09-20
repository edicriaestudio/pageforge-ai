"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { createProject } from "@/app/actions/projects";

export function NewProjectButton({ variant = "primary" }: { variant?: "primary" | "card" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreate = async () => {
    if (!name || !slug) {
      setError("Preencha nome e slug.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const proj = await createProject(name, slug);
      // Redirect to editor
      window.location.href = `/dashboard/projects/${proj.id}/editor`;
    } catch (err: unknown) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <>
      {variant === "primary" ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-black font-bold text-sm rounded-lg hover:bg-zinc-200 transition-colors"
        >
          <Plus size={16} />
          Novo Projeto
        </button>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center justify-center gap-4 bg-transparent border-2 border-dashed border-zinc-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group min-h-[240px]"
        >
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500 group-hover:border-emerald-400 transition-all">
            <Plus className="text-zinc-500 group-hover:text-white transition-colors" size={24} />
          </div>
          <span className="font-bold text-zinc-400 group-hover:text-emerald-400 transition-colors">Criar Novo Projeto</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl w-full max-w-md flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white">Criar Novo Projeto</h2>
            
            {error && <div className="p-3 bg-red-500/10 text-red-400 text-sm border-l-2 border-red-500">{error}</div>}

            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-mono text-zinc-500 mb-2 block">Nome do Projeto</label>
                <input 
                  value={name} 
                  onChange={e => {
                    setName(e.target.value);
                    // auto generate slug if empty or typing
                    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                    }
                  }} 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none" 
                  placeholder="Ex: Landing Page Advogado" 
                />
              </div>
              <div>
                <label className="text-xs font-mono text-zinc-500 mb-2 block">Slug (URL Pública)</label>
                <input 
                  value={slug} 
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} 
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-emerald-400 font-mono focus:border-emerald-500 outline-none" 
                  placeholder="ex: lp-advogado" 
                />
                <p className="text-[10px] text-zinc-500 mt-2 font-mono">Link final: seudominio.com/p/{slug || 'slug'}</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsOpen(false)} className="px-6 py-3 font-bold text-sm text-zinc-400 hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleCreate} disabled={loading} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-500 disabled:opacity-50 transition-colors">
                {loading ? <Loader2 size={16} className="animate-spin" /> : "Criar e Editar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
