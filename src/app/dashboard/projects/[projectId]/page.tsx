import { createClient } from "@/lib/db/server";

type PageData = {
  id: string;
  name: string;
  slug: string;
  status: string;
  updated_at: string;
};

export default async function ProjectDetails({ params }: { params: { projectId: string } }) {
  let pages: PageData[] = [];
  let errorMsg = "";

  if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("pages").select("*").eq("project_id", params.projectId);
      if (error) throw new Error(error.message);
      pages = data as PageData[] || [];
    } catch (e) {
      if (e instanceof Error) {
        errorMsg = e.message;
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Páginas do Projeto</h1>
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500">
          + Nova Página
        </button>
      </div>

      {errorMsg && <div className="text-red-400 mb-4">{errorMsg}</div>}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-zinc-950 border-b border-zinc-800 text-zinc-400 text-sm">
            <tr>
              <th className="p-4 font-medium">Nome</th>
              <th className="p-4 font-medium">Slug</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Última Modificação</th>
              <th className="p-4 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody>
            {pages.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">Nenhuma página encontrada.</td>
              </tr>
            )}
            {pages.map(page => (
              <tr key={page.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/50">
                <td className="p-4 font-bold text-emerald-400">{page.name}</td>
                <td className="p-4 text-zinc-400">/{page.slug}</td>
                <td className="p-4">
                  <span className="px-2 py-1 text-xs rounded bg-zinc-800 text-zinc-300 capitalize">{page.status}</span>
                </td>
                <td className="p-4 text-zinc-400 text-sm">{new Date(page.updated_at).toLocaleString()}</td>
                <td className="p-4">
                  <a href={`/dashboard/projects/${params.projectId}/editor?pageId=${page.id}`} className="text-blue-400 hover:underline text-sm">
                    Abrir Editor
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
