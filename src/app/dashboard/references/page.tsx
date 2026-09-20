import { LibraryClient } from "@/components/library/LibraryClient";

export default function ReferencesPage() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10">
      <div>
        <h2 className="font-mono text-lime-500 text-xs uppercase tracking-widest mb-2">Engine Visual</h2>
        <h1 className="text-4xl font-bold text-white tracking-tight">Imagens de Referência</h1>
        <p className="text-zinc-400 text-sm mt-2">Salve screenshots e designs de inspiração para a IA clonar visualmente.</p>
      </div>
      
      <LibraryClient type="reference" />
    </div>
  );
}
