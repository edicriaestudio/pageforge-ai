"use server";
import { createClient } from "@/lib/db/server";
import { PageSpec } from "@/page-spec/schema";

export async function savePageVersion(pageSlug: string, spec: PageSpec) {
  const supabase = createClient();

  // 1. Check if the project exists (create a default one if not)
  let { data: project } = await supabase.from("projects").select("id").eq("slug", "default").single();
  
  if (!project) {
    const { data: newProj, error: errProj } = await supabase
      .from("projects")
      .insert([{ name: "Default Project", slug: "default" }])
      .select("id")
      .single();
    if (errProj) throw new Error("Erro ao criar projeto padrão: " + errProj.message);
    project = newProj;
  }

  // 2. Check if the page exists
  let { data: page } = await supabase.from("pages").select("id").eq("slug", pageSlug).single();

  if (!page) {
    const { data: newPage, error: errPage } = await supabase
      .from("pages")
      .insert([{ project_id: project.id, name: spec.page.title, slug: pageSlug }])
      .select("id")
      .single();
    if (errPage) throw new Error("Erro ao criar página: " + errPage.message);
    page = newPage;
  }

  // Obter o número da última versão para incrementar
  const { count } = await supabase
    .from("page_versions")
    .select("*", { count: "exact", head: true })
    .eq("page_id", page.id);
  
  const nextVersion = (count || 0) + 1;

  // 3. Insert snapshot
  const { data: version, error: vError } = await supabase
    .from("page_versions")
    .insert([{ page_id: page.id, version_number: nextVersion, page_spec: spec }])
    .select()
    .single();

  if (vError) throw new Error("Erro ao salvar snapshot: " + vError.message);

  // 4. Update current_version_id on the page
  const { error: pError } = await supabase
    .from("pages")
    .update({ current_version_id: version.id, updated_at: new Date().toISOString() })
    .eq("id", page.id);

  if (pError) throw new Error("Erro ao atualizar versão ativa: " + pError.message);
  
  return version;
}

export async function getPageSpecBySlug(slug: string) {
  const supabase = createClient();
  
  const { data: page, error: pError } = await supabase
    .from("pages")
    .select("current_version_id")
    .eq("slug", slug)
    .single();
    
  if (pError || !page) return null;
  if (!page.current_version_id) return null;

  const { data: version, error: vError } = await supabase
    .from("page_versions")
    .select("page_spec")
    .eq("id", page.current_version_id)
    .single();

  if (vError || !version) return null;
  
  return version.page_spec as PageSpec;
}
