"use client";

import { useState, useEffect, useRef } from "react";
import { PageSpec, PageSpecSchema } from "@/page-spec/schema";
import { Send, Code2, MessageSquare, Loader2, RotateCcw, RotateCw, Save, Monitor, Smartphone, ExternalLink, LayoutTemplate, Link as LinkIcon, Image as ImageIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { savePageVersion } from "@/app/actions/pages";

const initialSpec: PageSpec = {
  schemaVersion: 1,
  page: {
    id: "init-uuid-000",
    title: "Projeto Alpha",
    slug: "projeto-alpha",
    language: "pt-BR",
    theme: { primaryColor: "#10b981", secondaryColor: "#000000", fontFamily: "Inter, sans-serif", borderRadius: "24px" },
    sections: [
      { id: "nav-1", type: "navbar", visible: true, props: { logoText: "PAGEFORGE.", links: [ { label: "Manifesto", url: "#" }, { label: "Tecnologia", url: "#" }, { label: "Preços", url: "#" } ], ctaText: "COMEÇAR AGORA" } },
      { id: "hero-1", type: "hero", visible: true, props: { headlinePrefix: "THE FUTURE OF", headlineMain: "Digital Art.", subheadline: "Automação brutalista desenhada para conversão massiva em nichos high-ticket.", ctaText: "INICIAR PROTOCOLO" } },
      { id: "phil-1", type: "philosophy", visible: true, props: { commonFocus: "Templates genéricos, código inchado e design amador.", ourDifferential: "Experiências viscerais construídas com precisão algorítmica." } },
      { id: "features-1", type: "features", visible: true, props: { sectionTitle: "Artefatos Funcionais", items: [ { id: "f1", title: "Diagnostic Shuffler", description: "Análise profunda de métricas com resposta em tempo real.", type: "diagnostic" }, { id: "f2", title: "Telemetry Typewriter", description: "Feed de dados contínuo sincronizado via WebSockets.", type: "telemetry" }, { id: "f3", title: "Protocol Scheduler", description: "Agendamento avançado com heurística preditiva.", type: "scheduler" } ] } },
      { id: "proto-1", type: "protocol", visible: true, props: { sectionTitle: "Protocolo de Empilhamento", steps: [ { id: "p1", number: "01", title: "Injeção de Blueprint", description: "A IA escaneia seu nicho e gera um arquivo JSON estruturado contendo a planta baixa." }, { id: "p2", number: "02", title: "Renderização Cinematográfica", description: "O motor transforma os dados crus em animações fluidas 60fps." }, { id: "p3", number: "03", title: "Deploy em Edge", description: "Disponibilizamos o artefato na nossa rede edge global com extrema velocidade." } ] } },
      { id: "mem-1", type: "membership", visible: true, props: { sectionTitle: "Acesso ao Sistema", tiers: [ { id: "t1", name: "Essencial", price: "R$497", period: "/mês", features: ["1 Projeto ativo", "Design System Base", "Suporte Padrão"], isPopular: false, ctaText: "ASSINAR ESSENCIAL" }, { id: "t2", name: "Performance", price: "R$997", period: "/mês", features: ["Projetos Ilimitados", "Renderização Cinematográfica", "IA Desbloqueada", "Suporte Prioritário"], isPopular: true, ctaText: "ACESSAR PERFORMANCE" }, { id: "t3", name: "Enterprise", price: "R$2.5k", period: "/mês", features: ["White Label", "API Dedicada", "Setup Híbrido"], isPopular: false, ctaText: "FALAR COM VENDAS" } ] } },
      { id: "foot-1", type: "footer", visible: true, props: { copyrightText: "© 2026 PAGEFORGE INC.", links: [ { label: "Termos", url: "#" }, { label: "Privacidade", url: "#" } ] } }
    ]
  }
};

const quickPrompts = [
  "Use a estrutura do meu template estático de Alta Conversão.",
  "Extrair paleta de cores e tipografia de um Print.",
  "Extrair SEO e estrutura lógica desta URL para recriar.",
];

export default function EditorPage() {
  const [spec, setSpec] = useState<PageSpec>(initialSpec);
  const [specString, setSpecString] = useState(JSON.stringify(initialSpec, null, 2));
  const [history, setHistory] = useState<PageSpec[]>([initialSpec]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "json">("chat");
  const [deviceMode, setDeviceMode] = useState<"desktop" | "mobile">("desktop");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: "UPDATE_SPEC", payload: spec }, "*");
    }
  }, [spec, deviceMode, isSidebarCollapsed]);

  const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const raw = e.target.value;
    setSpecString(raw);
    try {
      const parsed = JSON.parse(raw);
      const validated = PageSpecSchema.parse(parsed);
      setError(null);
      pushToHistory(validated);
    } catch (err: unknown) {
      setError("JSON Inválido: " + (err as Error).message);
    }
  };

  const pushToHistory = (newSpec: PageSpec) => {
    setSpec(newSpec);
    setSpecString(JSON.stringify(newSpec, null, 2));
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newSpec);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => { if (historyIndex > 0) { const prev = history[historyIndex - 1]; setHistoryIndex(historyIndex - 1); setSpec(prev); setSpecString(JSON.stringify(prev, null, 2)); setError(null); } };
  const redo = () => { if (historyIndex < history.length - 1) { const next = history[historyIndex + 1]; setHistoryIndex(historyIndex + 1); setSpec(next); setSpecString(JSON.stringify(next, null, 2)); setError(null); } };

  const handleAIGeneration = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    setSuccess(null);
    const fullIntent = `Este é o JSON atual do PageSpec v1:\n${JSON.stringify(spec)}\n\nAplicar a seguinte alteração/pedido: ${prompt}`;
    try {
      const res = await fetch("/api/ai/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ intent: fullIntent }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao conectar com API de IA.");
      if (data.spec) { pushToHistory(data.spec); setPrompt(""); }
    } catch (err: unknown) { setError((err as Error).message); } finally { setIsGenerating(false); }
  };

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    try {
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL) throw new Error("Modo Offline: Banco Supabase pendente.");
      await savePageVersion(spec.page.slug, spec);
      setSuccess("Blueprint salvo com sucesso na nuvem!");
    } catch (err: unknown) { setError((err as Error).message); } finally { setIsSaving(false); }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] -m-8 overflow-hidden bg-zinc-950 text-white relative">
      
      {/* Botão Flutuante de Toggle da Sidebar */}
      <button 
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute left-[450px] top-1/2 -translate-y-1/2 -ml-3 z-50 bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white rounded-full p-1 shadow-lg transition-transform"
        style={{ transform: `translateY(-50%) translateX(${isSidebarCollapsed ? '-450px' : '0'})` }}
        title={isSidebarCollapsed ? "Abrir Painel" : "Recolher Painel"}
      >
        {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {/* Esquerda: Painel de Controle */}
      <div className={`${isSidebarCollapsed ? 'w-0 opacity-0 -ml-[450px]' : 'w-[450px] opacity-100'} border-r border-zinc-800 flex flex-col bg-zinc-900 z-10 shadow-2xl transition-all duration-300 ease-in-out shrink-0`}>
        <div className="p-4 border-b border-zinc-800 flex flex-col gap-4 bg-zinc-950 shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg text-white">Editor Visual</h2>
            <button onClick={handleSaveToDatabase} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 bg-lime-600 text-white rounded-lg font-bold text-sm hover:bg-lime-500 disabled:opacity-50 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Salvar Deploy
            </button>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex bg-zinc-900 rounded-lg p-1 gap-1 border border-zinc-800">
              <button onClick={() => setActiveTab("chat")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "chat" ? "bg-zinc-800 text-lime-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>
                <MessageSquare size={16} /> Assistente IA
              </button>
              <button onClick={() => setActiveTab("json")} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === "json" ? "bg-zinc-800 text-lime-400 shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}>
                <Code2 size={16} /> JSON Raw
              </button>
            </div>

            <div className="flex gap-2">
              <button onClick={undo} disabled={historyIndex === 0} className="p-2 bg-zinc-900 border border-zinc-800 disabled:opacity-30 rounded hover:bg-zinc-800"><RotateCcw size={16} /></button>
              <button onClick={redo} disabled={historyIndex === history.length - 1} className="p-2 bg-zinc-900 border border-zinc-800 disabled:opacity-30 rounded hover:bg-zinc-800"><RotateCw size={16} /></button>
            </div>
          </div>
        </div>
        
        {error && <div className="p-3 bg-red-500/10 text-red-400 text-xs border-b border-red-500/20 font-mono shrink-0"><strong>AVISO:</strong> {error}</div>}
        {success && <div className="p-3 bg-lime-500/10 text-lime-400 text-xs border-b border-lime-500/20 font-mono shrink-0"><strong>SUCESSO:</strong> {success}</div>}

        {activeTab === "json" && (
          <textarea className="flex-1 w-full p-4 bg-zinc-950 font-mono text-[13px] text-lime-400/80 resize-none focus:outline-none min-h-0" value={specString} onChange={handleJsonChange} spellCheck={false} />
        )}

        {activeTab === "chat" && (
          <div className="flex flex-col flex-1 min-h-0 bg-zinc-950">
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="flex gap-4 mb-6">
                <div className="w-8 h-8 rounded-full bg-lime-600/20 text-lime-500 flex items-center justify-center shrink-0 border border-lime-500/30">
                  <Code2 size={16} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-zinc-300 mb-2">Engenharia Autônoma Ativada.</p>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                    Comande a estruturação da landing page. Ou utilize um dos atalhos:
                  </p>
                  <div className="flex flex-col gap-2">
                    {quickPrompts.map((qp, i) => (
                      <button key={i} onClick={() => setPrompt(qp)} className="text-left p-2.5 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/50 hover:border-lime-500/30 rounded-lg text-xs text-zinc-400 hover:text-lime-400 transition-colors">
                        {qp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-zinc-800 bg-zinc-900 shrink-0">
              <div className="flex gap-2 mb-2">
                <button title="Galeria de Templates" className="p-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"><LayoutTemplate size={14} /></button>
                <button title="Anexar URL Base" className="p-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"><LinkIcon size={14} /></button>
                <button title="Anexar Print" className="p-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"><ImageIcon size={14} /></button>
              </div>

              <div className="relative group">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAIGeneration(); } }}
                  placeholder="Comande a forja..."
                  disabled={isGenerating}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 pr-12 text-sm text-white resize-none h-20 focus:outline-none focus:border-lime-500 disabled:opacity-50 shadow-inner"
                />
                <button 
                  onClick={handleAIGeneration}
                  disabled={isGenerating || !prompt.trim()}
                  className="absolute right-2 bottom-2 p-2 bg-lime-600 text-white rounded-lg disabled:opacity-50 hover:bg-lime-500 transition-all"
                >
                  {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Direita: Preview Iframe */}
      <div className="flex-1 bg-zinc-950 relative flex flex-col min-w-0 transition-all duration-300">
        <div className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
            <button onClick={() => setDeviceMode("desktop")} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${deviceMode === "desktop" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}><Monitor size={16} /> <span className="hidden lg:inline">Desktop</span></button>
            <button onClick={() => setDeviceMode("mobile")} className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${deviceMode === "mobile" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"}`}><Smartphone size={16} /> <span className="hidden lg:inline">Mobile</span></button>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 text-zinc-400 hover:text-white bg-zinc-900 rounded-lg border border-zinc-800 transition-colors" title="Abrir em Nova Guia"><ExternalLink size={18} /></button>
          </div>
        </div>

        <div className="flex-1 bg-zinc-900/50 flex justify-center items-start overflow-hidden relative" style={{ backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '24px 24px' }}>
          <div className={`h-full bg-black transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden ${deviceMode === 'mobile' ? 'w-[375px] shadow-[0_0_50px_rgba(0,0,0,0.5)] border-x border-zinc-800' : 'w-full'}`}>
            <iframe ref={iframeRef} src="/preview" className="w-full h-full border-0" title="Live Preview" />
          </div>
        </div>
      </div>
    </div>
  );
}


