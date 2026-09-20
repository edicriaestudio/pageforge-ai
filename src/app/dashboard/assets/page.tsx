import { LibraryClient } from "@/components/library/LibraryClient";

export default function AssetsLibrary() {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-10">
      <div>
        <h2 className="font-mono text-emerald-500 text-xs uppercase tracking-widest mb-2">Engine Visual</h2>
        <h1 className="text-4xl font-bold text-white tracking-tight">Assets UI</h1>
        <p className="text-zinc-400 text-sm mt-2">Blocos de alta conversão (Heroes, Pricing, CTAs) para injeção rápida pelo Editor.</p>
      </div>
      <LibraryClient type="asset" />
    </div>
  );
}
