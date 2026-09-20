"use server";
import { createClient } from "@/lib/db/server";

export async function createProject(name: string, slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert([{ name, slug }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function listProjects() {
  const supabase = createClient();
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}
