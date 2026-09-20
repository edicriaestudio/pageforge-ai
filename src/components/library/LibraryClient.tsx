"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, LayoutTemplate, Blocks, Loader2, Image as ImageIcon, TerminalSquare, Copy, Upload, ArrowRight } from "lucide-react";
import { listLibraryItems, createLibraryItem, deleteLibraryItem } from "@/app/actions/library";
import { createProject } from "@/app/actions/projects";

type LibraryItem = {
  id: string;
  type: 'template' | 'asset' | 'reference' | 'prompt';
  name: string;
  category: string;
  spec_json: { 
    hero?: { image?: string }; 
    _image_base64?: string;
    [key: string]: unknown 
  };
};

export function LibraryClient({ type }: { type: 'template' | 'asset' | 'reference' | 'prompt' }) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [jsonString, setJsonString] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await listLibraryItems(type); 
      if (res.error) throw new Error(res.error); 
      setItems(res.data as LibraryItem[]);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
        setError("A imagem deve ter no máximo 5MB.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        setImageBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!name) {
      setError("Nome é obrigatório.");
      return;
    }
    
    let parsedJson = {};
    if (type === 'reference') {
        if (!imageBase64) {
            setError("Faça o upload da imagem de referência.");
            return;
        }
        parsedJson = { _image_base64: imageBase64 };
    } else {
        if (!jsonString) {
            setError("JSON/Código é obrigatório.");
            return;
        }
        try {
          parsedJson = JSON.parse(jsonString);
        } catch {
          setError("JSON inválido. Verifique o código.");
          return;
        }
    }

    setIsSubmitting(true);
    setError(null);
    try {
      const res = await createLibraryItem(type, name, category, parsedJson); 
      if (res.error) throw new Error(res.error);
      setIsModalOpen(false);
      setName("");
      setCategory("");
      setJsonString("");
      setImageBase64(null);
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
      const res = await deleteLibraryItem(id); 
      if (res.error) throw new Error(res.error);
      loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopy = (item: LibraryItem) => {
      navigator.clipboard.writeText(JSON.stringify(item.spec_json, null, 2));
      alert("Código copiado para a área de transferência!");
  };

  const handleUseTemplate = async (item: LibraryItem) => {
      const projName = prompt("Qual o nome do novo projeto que usará este template?");
      if (!projName) return;
      
      const slug = projName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      try {
          // Creates the project
          const proj = await createProject(projName, slug);
          // In a real scenario we'd create the page with the template JSON injected.
          // For now, redirecting to editor so they can paste it, or we could pass it via sessionStorage.
          sessionStorage.setItem("pending_template", JSON.stringify(item.spec_json));
          window.location.href = `/dashboard/projects/${proj.id}/editor`;
      } catch(err) {
          alert("Erro ao criar projeto: " + (err as Error).message);
      }
  };

  const Icon = type === 'template' ? LayoutTemplate : type === 'asset' ? Blocks : type === 'reference' ? ImageIcon : TerminalSquare;

  return (
    <div className="flex flex-col gap-8">
      {/* Botão de Adicionar */}
      <div className="flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-lime-600 text-white font-bold text-sm rounded-lg hover:bg-lime-500 transition-colors"
        >
          <Plus size={16} />
          Adicionar {type === 'template' ? 'Template' : type === 'asset' ? 'Asset' : type === 'reference' ? 'Imagem Referência' : 'Prompt'}
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-lime-500" size={32} /></div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center h-64 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
          <div className="flex flex-col items-center gap-3 text-zinc-500">
            <Icon size={32} />
            <p className="font-medium text-sm">Nenhum item salvo ainda na biblioteca.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map(item => {
            const thumbnail = item.spec_json?._image_base64 || item.spec_json?.hero?.image;
            return (
              <div key={item.id} className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col gap-4 relative group">
                <div className="w-full h-32 bg-zinc-800/50 rounded-lg overflow-hidden mb-2 relative">
                  {thumbnail ? (
                    <img src={thumbnail} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                      <Icon size={24}/>
                    </div>
                  )}
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => handleCopy(item)} className="p-2 bg-zinc-800 hover:bg-lime-500 text-white rounded-lg transition-colors" title="Copiar Código">
                          <Copy size={16} />
                      </button>
                      {type === 'template' && (
                        <button onClick={() => handleUseTemplate(item)} className="p-2 bg-zinc-800 hover:bg-lime-500 text-white rounded-lg transition-colors flex items-center gap-1 text-xs font-bold" title="Usar Template">
                            <ArrowRight size={14} /> Usar
                        </button>
                      )}
                  </div>
                </div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-lg">{item.name}</h3>
                    <span className="text-xs font-mono text-lime-500 mt-1 block">{item.category || 'Geral'}</span>
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
            );
          })}
        </div>
      )}

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-2xl w-full max-w-2xl flex flex-col gap-6">
            <h2 className="text-xl font-bold text-white">Adicionar Novo {type === 'template' ? 'Template' : type === 'asset' ? 'Asset' : type === 'reference' ? 'Imagem Referência' : 'Prompt'}</h2>
            
            {error && <div className="p-3 bg-red-500/10 text-red-400 text-sm border-l-2 border-red-500">{error}</div>}

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs font-mono text-zinc-500 mb-2 block">Nome</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-lime-500 outline-none" placeholder="Ex: Hero Advocacia" />
              </div>
              <div className="w-1/3">
                <label className="text-xs font-mono text-zinc-500 mb-2 block">Categoria / Nicho</label>
                <input value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-lime-500 outline-none" placeholder="Ex: Advogados" />
              </div>
            </div>

            {type === 'reference' ? (
                <div className="flex-1">
                  <label className="text-xs font-mono text-zinc-500 mb-2 block">Upload da Imagem</label>
                  <div className="w-full h-48 border-2 border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-4 relative overflow-hidden bg-zinc-900">
                    {imageBase64 ? (
                        <>
                            <img src={imageBase64} className="absolute inset-0 w-full h-full object-contain" alt="Preview" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                <label className="cursor-pointer px-4 py-2 bg-zinc-800 text-white rounded-lg font-bold text-sm hover:bg-lime-500 transition-colors">
                                    Trocar Imagem
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                                </label>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center"><Upload className="text-zinc-500" /></div>
                            <span className="text-sm font-bold text-zinc-400">Clique para selecionar</span>
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                        </>
                    )}
                  </div>
                </div>
            ) : (
                <div className="flex-1">
                  <label className="text-xs font-mono text-zinc-500 mb-2 block">Código (JSON ou Texto)</label>
                  <textarea 
                    value={jsonString} 
                    onChange={e => setJsonString(e.target.value)} 
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-lime-400 font-mono text-xs h-64 focus:border-lime-500 outline-none resize-none" 
                    placeholder="Cole o código JSON gerado..." 
                    spellCheck={false}
                  />
                </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-sm text-zinc-400 hover:text-white transition-colors">Cancelar</button>
              <button onClick={handleSave} disabled={isSubmitting} className="flex items-center gap-2 px-6 py-3 bg-lime-600 text-white font-bold text-sm rounded-lg hover:bg-lime-500 disabled:opacity-50 transition-colors">
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : "Salvar no Banco"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
