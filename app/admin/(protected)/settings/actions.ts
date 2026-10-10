"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

async function getAdminAndSettingId() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: admin } = await supabase
    .from("admin_profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (!admin) {
    redirect("/admin/login");
  }

  const { data: settings } = await supabase
    .from("wedding_settings")
    .select("id")
    .limit(1)
    .single();

  if (!settings) {
    throw new Error("Wedding settings not found.");
  }

  return {
    supabase,
    id: settings.id,
  };
}

export async function updateWeddingSettingsAction(
  formData: FormData
) {
  const { supabase, id } =
    await getAdminAndSettingId();

  const payload = {
    host_line:
      String(formData.get("host_line") ?? "").trim() || null,
    groom_name:
      String(formData.get("groom_name") ?? "").trim() || null,
    bride_name:
      String(formData.get("bride_name") ?? "").trim() || null,
    secondary_bride_name:
      String(formData.get("secondary_bride_name") ?? "").trim() || null,
    secondary_groom_name:
      String(formData.get("secondary_groom_name") ?? "").trim() || null,
    bride_placeholder_text:
      String(formData.get("bride_placeholder_text") ?? "").trim() || null,
    secondary_bride_placeholder_text:
      String(formData.get("secondary_bride_placeholder_text") ?? "").trim() || null,
    venue_name_default:
      String(formData.get("venue_name_default") ?? "").trim() || null,
    venue_address_default:
      String(formData.get("venue_address_default") ?? "").trim() || null,
    quranic_verse:
      String(formData.get("quranic_verse") ?? "").trim() || null,
    quranic_reference:
      String(formData.get("quranic_reference") ?? "").trim() || null,
    welcome_message:
      String(formData.get("welcome_message") ?? "").trim() || null,
    thank_you_title:
      String(formData.get("thank_you_title") ?? "").trim() || null,
    thank_you_message:
      String(formData.get("thank_you_message") ?? "").trim() || null,
    background_music_url:
      String(formData.get("background_music_url") ?? "").trim() || null,
    music_mode:
      String(formData.get("music_mode") ?? "procedural").trim() || "procedural",
    show_sidra_name_default:
      String(formData.get("show_sidra_name_default")) === "on",
    show_iqra_name_default:
      String(formData.get("show_iqra_name_default")) === "on",
    updated_at: new Date().toISOString(),
  };

  await supabase
    .from("wedding_settings")
    .update(payload)
    .eq("id", id);

  revalidatePath("/admin/settings");
  revalidatePath("/admin/guests");
}