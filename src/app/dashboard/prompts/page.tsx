import { LibraryClient } from "@/components/library/LibraryClient";

export default function PromptsPage() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10">
      <div>
        <h2 className="font-mono text-lime-500 text-xs uppercase tracking-widest mb-2">Engine Visual</h2>
        <h1 className="text-4xl font-bold text-white tracking-tight">Biblioteca de Prompts</h1>
        <p className="text-zinc-400 text-sm mt-2">Guarde seus prompts de alta conversão para copiar, colar e gerar estruturas inteiras em segundos.</p>
      </div>
      
      <LibraryClient type="prompt" />
    </div>
  );
}
