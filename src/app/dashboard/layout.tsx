export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      <header className="bg-zinc-900 border-b border-zinc-800 p-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">PageForge Workspace</h2>
        <div className="flex gap-4 items-center">
          <span className="text-sm text-zinc-400">Usuário Anônimo</span>
          <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
        </div>
      </header>
      <main className="flex-1 p-8 text-white">
        {children}
      </main>
    </div>
  );
}
