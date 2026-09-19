export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-950 text-white">
      <h1 className="text-4xl font-bold mb-4">PageForge AI</h1>
      <p className="text-zinc-400">Plataforma autônoma de geração de Landing Pages.</p>
      <a href="/dashboard" className="mt-8 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-lg font-semibold transition-colors">
        Acessar Dashboard
      </a>
    </main>
  );
}
