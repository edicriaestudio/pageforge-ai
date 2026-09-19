export default function Dashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Meus Projetos</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/50 hover:bg-zinc-900 transition-colors cursor-pointer border-dashed flex flex-col items-center justify-center min-h-[200px]">
          <span className="text-4xl text-zinc-600 mb-2">+</span>
          <span className="text-zinc-400 font-medium">Novo Projeto</span>
        </div>
      </div>
    </div>
  );
}
