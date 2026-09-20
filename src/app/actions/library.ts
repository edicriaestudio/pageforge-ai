"use server";
import { createClient } from "@/lib/db/server";

export async function listLibraryItems(type: 'template' | 'asset') {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("library_items")
    .select("*")
    .eq("type", type)
    .order("created_at", { ascending: false });
    
  if (error) return { error: error.message };
  return { data };
}

export async function createLibraryItem(type: 'template' | 'asset', name: string, category: string, spec_json: Record<string, unknown>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("library_items")
    .insert([{ type, name, category, spec_json }])
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function deleteLibraryItem(id: string) {
  const supabase = createClient();
  const { error } = await supabase.from("library_items").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
