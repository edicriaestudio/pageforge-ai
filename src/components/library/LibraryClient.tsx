"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, LayoutTemplate, Blocks, Loader2 } from "lucide-react";
import { listLibraryItems, createLibraryItem, deleteLibraryItem } from "@/app/actions/library";

type LibraryItem = {
  id: string;
  type: 'template' | 'asset';
  name: string;
  category: string;
  spec_json: any; // Using any here to safely read nested properties like hero.image without complex type casting
};

export function LibraryClient({ type }: { type: 'template' | 'asset' }) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [jsonString, setJsonString] = useState("");

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await listLibraryItems(type);
      setItems(data as LibraryItem[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const handleSave = async () => {
    if (!name || !jsonString) {
      setError("Nome e JSON são obrigatórios.");
      return;
    }
    
    let parsedJson;
    try {
      parsedJson = JSON.parse(jsonString);
    } catch { // unused
      setError("JSON inválido. Verifique o código.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await createLibraryItem(type, name, category, parsedJson);
      setIsModalOpen(false);
      setName("");
      setCategory("");
      setJsonString("");
      loadItems();
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este item?")) return;
    try {
      await deleteLibraryItem(id);
      loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  const Icon = type === 'template' ? LayoutTemplate : Blocks;

  return (
    <div className="flex flex-col gap-8">
      {/* Botão de Adicionar */}
      <div className="flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-500 transition-colors"
        >
          <Plus size={16} />
          Adicionar {type === 'template' ? 'Template' : 'Asset'}
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-emerald-500" size={32} /></div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
          <div className="flex flex-col items-center gap-3 text-zinc-500">
            <Icon size={32} />
            <p className="font-medium text-sm">Nenhum item salvo ainda na biblioteca.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-4 relative group">
              <div className="w-full h-32 bg-zinc-800/50 rounded-lg overflow-hidden mb-2">
                {item.spec_json?.hero?.image ? (
                  <img src={item.spec_json.hero.image} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700">
                    <Icon size={24}/>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-lg">{item.name}</h3>
                  <span className="text-xs font-mono text-emerald-500 mt-1 block">{item.category || 'Geral'}</span>
                </div>
                <button 
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Deletar"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl w-full max-w-2xl flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white">Adicionar Novo {type === 'template' ? 'Template' : 'Asset'}</h2>
            
            {error && <div className="p-3 bg-red-500/10 text-red-400 text-sm border-l-2 border-red-500">{error}</div>}

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-mono text-zinc-500 mb-2 block">Nome</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none" placeholder="Ex: Hero Advocacia" />
              </div>
              <div className="w-1/3">
                <label className="text-xs font-mono text-zinc-500 mb-2 block">Categoria / Nicho</label>
                <input value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-emerald-500 outline-none" placeholder="Ex: Advogados" />
              </div>
            </div>

            <div className="flex-1">
              <label className="text-xs font-mono text-zinc-500 mb-2 block">Código Blueprint (JSON)</label>
              <textarea 
                value={jsonString} 
                onChange={e => setJsonString(e.target.value)} 
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-emerald-400 font-mono text-xs h-64 focus:border-emerald-500 outline-none resize-none" 
                placeholder="Cole o código JSON gerado..." 
                spellCheck={false}
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-sm text-zinc-400 hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-500 disabled:opacity-50 transition-colors">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Salvar no Banco"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
