export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-10">
      <div>
        <h2 className="font-mono text-emerald-500 text-xs uppercase tracking-widest mb-2">Engine Visual</h2>
        <h1 className="text-4xl font-bold text-white tracking-tight">Configurações</h1>
        <p className="text-zinc-400 text-sm mt-2">Ajustes globais do PageForge AI.</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col gap-6">
        <div className="border-b border-zinc-800 pb-6">
          <h3 className="text-xl font-bold text-white mb-1">API do Supabase</h3>
          <p className="text-sm text-zinc-500 mb-4">Conexão com o banco de dados configurada via Variáveis de Ambiente (Vercel).</p>
          <div className="flex items-center gap-2 text-emerald-500 font-mono text-xs bg-emerald-500/10 px-3 py-2 rounded-lg w-fit border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Conectado: {process.env.NEXT_PUBLIC_SUPABASE_URL || "Offline"}
          </div>
        </div>

        <div className="border-b border-zinc-800 pb-6">
          <h3 className="text-xl font-bold text-white mb-1">Modelo de IA (LLM)</h3>
          <p className="text-sm text-zinc-500 mb-4">Defina qual modelo irá gerar os códigos de interface e estrutura.</p>
          <select className="bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg p-3 w-full md:w-1/2 outline-none focus:border-emerald-500">
            <option>Llama 3.1 70B (Groq) - Rápido</option>
            <option disabled>GPT-4o (OpenAI) - Em Breve</option>
            <option disabled>Claude 3.5 Sonnet (Anthropic) - Em Breve</option>
          </select>
        </div>

        <div className="opacity-50 pointer-events-none">
          <h3 className="text-xl font-bold text-white mb-1">Domínio Personalizado</h3>
          <p className="text-sm text-zinc-500 mb-4">Adicione domínios próprios para mascarar as URLs de preview.</p>
          <button className="px-5 py-2.5 bg-zinc-800 text-white font-bold text-sm rounded-lg">Adicionar Domínio</button>
        </div>
      </div>
    </div>
  );
}
