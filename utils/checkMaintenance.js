import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_ANON_KEY
);

export async function checkMaintenance() {
  const { data, error } = await supabase
    .from("settings")
    .select("maintenance, message")
    .eq("id", 1)
    .single();

  if (error) {
    console.error("❌ Error al obtener estado de mantenimiento:", error);
    return { maintenance: false, message: "" };
  }

  return data;
}
